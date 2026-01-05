# Project Context & Rules

## 1. Identity & Stack
**Role:** Senior Full-Stack Developer (Next.js Expert).
**Goal:** Maintain a Gender Reveal App for "Uzoma & Maame".

**Tech Stack:**
- **Framework:** Next.js 16 (App Router) + React 19.2.
- **Styling:** Tailwind CSS v4 + shadcn/ui.
- **Database:** Supabase (PostgreSQL) + RLS.
- **Language:** TypeScript (Strict).
- **Package Manager:** pnpm.

## 2. Coding Standards

### Architecture
- **Server Components:** Default. Use `async/await` for DB calls.
- **Client Components:** Use `'use client'` only for interactivity (forms, hooks, event listeners).
- **Files:** kebab-case (e.g., `prediction-form.tsx`).
- **Exports:** Named exports preferred.

### Styling (Tailwind v4)
- **Design System:** Mobile-first (`min-h-dvh`).
- **Theme:** "Ankara" aesthetic. Use gradients: `from-indigo-800 via-pink-700 to-amber-500`.
- **Colors:**
  - Boy: `text-blue-500` / `#3b5998`
  - Girl: `text-pink-500` / `#db2777`
- **UI Lib:** Use `@/components/ui/*` (shadcn) for primitives.

### Supabase & Data
- **Server-Side:**
  ```ts
  import { createClient } from "@/lib/supabase/server"
  const supabase = await createClient()
  ```

* **Client-Side:**
  ```ts
  import { createClient } from "@/lib/supabase/client"
  const supabase = createClient()

  ```

* **Admin/Actions:** Use `createAdminClient` from `@/lib/supabase/admin.ts` strictly for server actions requiring bypass of RLS.

## 3. Data Schema (Reference)

**`reveal_state`** (Singleton row)

* `id` (uuid)
* `countdown_date` (timestamptz) -> Target date: March 24, 2026.
* `is_revealed` (bool) -> Controls visibility of gender.
* `gender` (text: 'boy'|'girl')

**`predictions`**

* `id` (uuid)
* `name` (text)
* `email` (text)
* `prediction` (text: 'boy'|'girl')
* `created_at` (timestamptz)

**`registries`**

* `id` (uuid)
* `name` (text)
* `url` (text)

## 4. Key Workflows

### Countdown Logic

* Synced via Supabase Realtime in `@/components/countdown-timer.tsx`.
* Input string must be ISO 8601.

### Gender Reveal Logic

* **State:** Controlled by `is_revealed` in DB.
* **Flow:** If `is_revealed = false`, show Countdown/Prediction Form. If `true`, show `GenderRevealCard`.
* **Animation:** Uses `react-confetti` and CSS animations.

### Admin Portal (`/admin`)

* Protected route (conceptually).
* Allows updating `reveal_state` (Date/Gender/Status).
* Allows CRUD on `registries`.
* Displays prediction stats table.

## 5. File Structure Map

* `app/` -> Routes (page.tsx, layout.tsx, globals.css).
* `components/` -> Feature components (e.g., `prediction-form.tsx`).
* `components/ui/` -> Reusable UI primitives.
* `lib/supabase/` -> Client/Server/Admin connection logic.
* `hooks/` -> `use-toast`, `use-window-size`, `use-mobile`.
* `public/` -> Static images (Ankara patterns, placeholders).

## 6. Quick Start

### Environment (`.env.local`)

Required variables:

* `NEXT_PUBLIC_SUPABASE_URL`
* `NEXT_PUBLIC_SUPABASE_ANON_KEY`
* `SUPABASE_SERVICE_ROLE_KEY` (Required for Admin actions)

### Database Init

Run SQL scripts in `scripts/` sequentially in Supabase SQL Editor:

1. `001_create_reveal_state.sql`
2. `002_create_predictions_table.sql`
3. `003_add_email_to_predictions.sql`
4. `004_update_reveal_state_due_date.sql`
5. `005_create_registries_table.sql`

### Commands

* **Install:** `pnpm install`
* **Dev:** `pnpm dev` (Runs on http://localhost:3000)
* **Lint:** `pnpm lint`