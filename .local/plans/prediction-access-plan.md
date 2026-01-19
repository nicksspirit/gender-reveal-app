# Prediction Access + Stats + Registry Plan (REVISED v2)

## Summary

**Objective:** Persist each visitor's prediction and make it easy to return to their personalized results, live stats, and registry across refreshes and devices.

**Purpose/Value:** Reduce friction after a prediction, increase repeat engagement, and ensure visitors can quickly access the most important information without re-submitting or hunting for links.

---

## 1) UX Flow (new/returning/cross-device)

```
[Landing Page]
   |
   |-- (No saved prediction) --> [Prediction Form Section]
   |                               |
   |                               |-- Submit --> [Personalized Stats + Registry View]
   |                               |              (Save email to LocalStorage)
   |                               |
   |                               |-- (Email exists on submit) --> [Show error: "You've already voted!"]
   |                                                                 [Option to lookup existing prediction]
   |
   |-- (Email in LocalStorage) --> [Verify against DB]
   |                               |
   |                               |-- (Valid) --> [Your Prediction Card + Live Stats + Registry]
   |                               |-- (Invalid/Not found) --> [Clear LocalStorage, show Prediction Form]
   |
   |-- (Manual Fallback) --> [Find My Prediction Link] (appears at bottom of form)
                                  |
                                  |-- Enter Email --> [Fetch from DB]
                                  |                   |
                                  |                   |-- (Found) --> [Restore to LocalStorage, show Stats]
                                  |                   |-- (Not found) --> [Show error message]
```

---

## 2) Information Architecture (Single Page Focus)

We will stick to a dynamic landing page (`/`) to maintain the festive atmosphere, using conditional rendering.

- **`/` (Home)**
  - Hero (Countdown)
  - **Dynamic Middle Section:**
    - State A: `PredictionForm` + "Already voted? Find my prediction" link
    - State B: `UserPredictionCard` (personalized message with name & prediction) + `PredictionStats` (live) + `RegistrySection`
  - Our Story Section
- **`/admin`** (Existing - no changes needed)

---

## 3) DB Changes (Required)

```sql
-- Migration 007: Enforce unique email (case-insensitive)
-- First, normalize existing emails to lowercase
UPDATE predictions SET email = LOWER(TRIM(email));

-- Remove any duplicates (keep the earliest submission)
DELETE FROM predictions a
USING predictions b
WHERE a.email = b.email
  AND a.created_at > b.created_at;

-- Add unique constraint
ALTER TABLE predictions ADD CONSTRAINT unique_email UNIQUE (email);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS predictions_email_idx ON predictions(email);
```

**Note:** Always normalize emails to lowercase before INSERT and SELECT operations.

---

## 4) Data Access (Server Actions)

Add to `app/actions.ts`:

### `getPredictionByEmail(email: string)`
- Normalizes email to lowercase
- Returns the user's prediction record or null
- Used for: localStorage verification, "Find My Prediction" lookup

### `submitPrediction(name: string, email: string, prediction: 'boy' | 'girl')`
- Normalizes email to lowercase
- Attempts INSERT (not upsert - we want one prediction per email)
- Returns `{ success: true, data }` or `{ success: false, error: 'EMAIL_EXISTS' | 'UNKNOWN' }`
- On success, the client saves email to localStorage

### `getPredictionStats()`
- Returns `{ boy: number, girl: number, total: number }`
- Server-side aggregation for initial load (more efficient than client-side counting)

---

## 5) Client State & Persistence

### LocalStorage
- **Key:** `gender_reveal_user_email`
- **Value:** lowercase email string

### Initial Load Logic (in `PredictionSection` component)
1. Start with `isLoading: true` — render skeleton placeholder
2. Check `localStorage` for email
3. If found, call `getPredictionByEmail(email)` server action
4. If valid prediction returned → set `userPrediction` state, show `UserPredictionCard`
5. If null/error → clear localStorage, show `PredictionForm`
6. If no localStorage → show `PredictionForm`
7. Set `isLoading: false` only after determination is complete

### Handling Hydration Flash
Since localStorage is only available on the client, the server always renders a default state first. To prevent a jarring "form suddenly disappears" effect for returning users:

- **`PredictionSection` starts with a skeleton/loading state** (not the form)
- Skeleton should match the approximate shape of the form (input fields, buttons)
- Only render actual content (form OR stats) after localStorage check + DB verification completes
- Keep loading state brief — localStorage check is instant, DB call should be fast

```tsx
// Pseudocode for PredictionSection
const [isLoading, setIsLoading] = useState(true)
const [userPrediction, setUserPrediction] = useState(null)

useEffect(() => {
  async function checkReturningUser() {
    const email = localStorage.getItem('gender_reveal_user_email')
    if (email) {
      const prediction = await getPredictionByEmail(email)
      if (prediction) {
        setUserPrediction(prediction)
      } else {
        localStorage.removeItem('gender_reveal_user_email')
      }
    }
    setIsLoading(false)
  }
  checkReturningUser()
}, [])

if (isLoading) return <PredictionSkeleton />
if (userPrediction) return <UserPredictionCard ... />
return <PredictionForm ... />
```

### Privacy Considerations
- Private/incognito mode: localStorage won't persist, so users will see the form again but can use "Find My Prediction"
- No sensitive data stored - only email address
- No "clear my data" feature needed (users can clear browser data or just ignore)

---

## 6) Realtime Behavior

### Stats Component Updates
- Use `lib/supabase/client.ts` to subscribe to the `predictions` table
- On any `INSERT` event, refetch stats or increment local counts
- Unsubscribe on component unmount (cleanup in useEffect)

**Implementation approach:**
```tsx
// In PredictionStats component
useEffect(() => {
  const supabase = createClient()
  
  const channel = supabase
    .channel('predictions-changes')
    .on('postgres_changes', 
      { event: 'INSERT', schema: 'public', table: 'predictions' },
      (payload) => {
        // Increment the appropriate counter
        setStats(prev => ({
          ...prev,
          [payload.new.prediction]: prev[payload.new.prediction] + 1
        }))
      }
    )
    .subscribe()

  return () => { supabase.removeChannel(channel) }
}, [])
```

---

## 7) New Components to Create

| Component | Location | Purpose |
|-----------|----------|---------|
| `UserPredictionCard` | `components/user-prediction-card.tsx` | Shows returning user's name, prediction, and personalized message |
| `FindPredictionModal` | `components/find-prediction-modal.tsx` | Email input dialog for "Find My Prediction" flow |
| `PredictionSection` | `components/prediction-section.tsx` | Wrapper that handles localStorage check and conditionally renders form or card |

---

## 8) Files to Modify

| File | Changes |
|------|---------|
| `app/actions.ts` | Add `getPredictionByEmail`, `submitPrediction`, `getPredictionStats` |
| `app/page.tsx` | Replace direct `PredictionForm` usage with `PredictionSection` wrapper |
| `components/prediction-form.tsx` | Use `submitPrediction` server action, add "Find My Prediction" link |
| `components/prediction-stats.tsx` | Add Realtime subscription, use server action for initial fetch |

---

## 9) Implementation Order

1. **Database migration** (007) - Run in Supabase SQL editor
2. **Server actions** - Add new functions to `app/actions.ts`
3. **`UserPredictionCard`** - New component for returning users
4. **`FindPredictionModal`** - New component for email lookup
5. **`PredictionSection`** - Wrapper with localStorage logic
6. **Update `PredictionStats`** - Add Realtime subscription
7. **Update `prediction-form.tsx`** - Use server action, add find link
8. **Update `page.tsx`** - Use new `PredictionSection`
9. **Testing** - Test all flows (new user, returning user, cross-device)

---

## 10) Error States to Handle

| Scenario | User Message |
|----------|--------------|
| Email already exists on submit | "You've already made a prediction! Use 'Find My Prediction' to see it." |
| Email not found in lookup | "We couldn't find a prediction with that email. Would you like to make one?" |
| Network error on submit | "Something went wrong. Please try again." |
| Network error on lookup | "Couldn't connect. Please check your internet and try again." |
| LocalStorage email invalid | (Silent) Clear localStorage, show form |

---

## 11) Open Questions / Decisions

- [x] **Should users be able to change their prediction?** ✅ **Decided: No** — One prediction per email, cannot be changed once submitted.
- [ ] **Show Registry before prediction?** Current plan: Only after prediction to encourage engagement.
- [ ] **Rate limiting on email lookups?** Consider adding if abuse is a concern.
