# Uzoma & Maame Gender Reveal App - Project Documentation

## 1. Project Overview

**Uzoma & Maame Gender Reveal App** is a personalized, full-stack Next.js web application designed to celebrate the upcoming arrival of Uzoma and Maame's first child. The app features a vibrant Nigerian Ankara-inspired design and enables family and friends to:

- View a live countdown to the baby's due date (March 24, 2026)
- Learn about the couple's journey through a heartwarming photo story section
- Submit predictions (boy or girl) with their name and email
- Experience a beautiful, mobile-first responsive design with gradient backgrounds and cultural aesthetics

The app includes an admin portal where the couple can manage the due date, reveal status, and gender information. Built with Supabase for real-time data synchronization, the application ensures all visitors see updates instantly without page refreshes.

---

## Local Development Setup

### Prerequisites

- Node.js 18+ installed
- Supabase account with a project created
- Git (for cloning the repository)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gender-reveal-app
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   The following environment variables are already configured in the v0 workspace:
   - `SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `POSTGRES_URL` (and related Postgres connection strings)

   For local development outside of v0, create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Initialize the database**

   Run the SQL migration scripts in order:
   ```bash
   # Execute these in your Supabase SQL Editor or using the Supabase CLI
   scripts/001_create_reveal_state.sql
   scripts/002_create_predictions_table.sql
   scripts/003_add_email_to_predictions.sql
   scripts/004_update_reveal_state_due_date.sql
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Open the application**

   Navigate to `http://localhost:3000` in your browser.

### Development URLs

- **Landing Page**: `http://localhost:3000`
- **Admin Portal**: `http://localhost:3000/admin`

### Common Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint

# Type checking
pnpm type-check
```

---

## 2. Core Coding Principles

### Technology Stack
- **Framework**: Next.js 16 with App Router and React 19.2
- **Runtime**: Next.js (browser-based Next.js runtime)
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Fonts**: Geist and Geist Mono
- **TypeScript**: Strict mode enabled
- **State Management**: SWR for client-side data fetching and caching

### Design Philosophy
- **Mobile-first responsive design** using `min-h-dvh` for proper viewport handling
- **Cultural aesthetics** with Nigerian Ankara patterns and warm gradient backgrounds (purple-blue to pink-orange-yellow)
- **Accessibility** through semantic HTML, ARIA attributes, and proper contrast ratios
- **Visual hierarchy** with proper spacing, typography scales, and color contrast
- **Performance** through optimized images, minimal JavaScript, and efficient rendering

### Code Organization
- **Component-driven architecture** with reusable, single-responsibility components
- **Server Components by default** for optimal performance
- **Client Components** only when necessary (interactivity, hooks, browser APIs)
- **Colocated styles** using Tailwind utility classes
- **Type safety** with TypeScript interfaces and strict null checks

---

## 3. Implemented Functionality

### Public Features

#### Landing Page (`/`)
- **Hero Section**
  - Animated Ankara pattern background (SVG with blue, pink, yellow geometric shapes)
  - Large "BOY or GIRL" title with colored text and white drop shadows
  - Live countdown timer showing days, hours, minutes, seconds until March 24, 2026
  - Due date display ("Baby Arriving On March 24, 2026")
  - Couple names display ("Uzoma & Maame - Our First Child")
  - Scroll indicator with animated chevron

- **Our Journey Story Section**
  - Three cards showcasing the couple's journey:
    1. Oil painting portrait of Uzoma and Maame
    2. Maame's baby bump photo with artistic background
    3. Ultrasound image (cropped and centered)
  - Heartwarming captions describing their story

- **Prediction Form**
  - Frosty glassmorphism card design with backdrop blur
  - Form fields:
    - Name input (minimum 2 characters, required)
    - Email input (valid email format, required)
    - Prediction buttons (Boy 💙 / Girl 💗)
  - Real-time validation with error badges
  - Cursor states (pointer for enabled, not-allowed for disabled)
  - Submissions stored in Supabase `predictions` table

#### Admin Portal (`/admin`)
- **Configuration Interface**
  - Due date picker (updates countdown in real-time)
  - Gender selection (Boy/Girl/Not Set)
  - Reveal status toggle (revealed/not revealed)
  - Save button with loading states
  - Changes persist to Supabase and sync via Realtime

### Database Schema

#### `reveal_state` Table
```sql
- id (uuid, primary key)
- countdown_date (timestamp with timezone)
- is_revealed (boolean, default false)
- gender (text, nullable, 'boy' | 'girl')
- created_at (timestamp)
- updated_at (timestamp)
```

#### `predictions` Table
```sql
- id (uuid, primary key)
- name (text, not null)
- email (text, not null)
- prediction (text, not null, 'boy' | 'girl')
- created_at (timestamp)
```

### Real-time Features
- **Supabase Realtime subscriptions** sync countdown date changes across all connected clients
- **Live countdown** updates every second client-side
- **Admin changes** propagate instantly to all visitors

---

## 4. Project Structure Guidelines

### File Organization

**MUST:**
- Place all page routes in `app/` directory following Next.js App Router conventions
- Store reusable components in `components/` directory
- Keep UI primitives (shadcn components) in `components/ui/`
- Store custom hooks in `hooks/` directory
- Place utility functions in `lib/` directory
- Organize Supabase clients in `lib/supabase/` (client.ts, server.ts)
- Keep database migration scripts in `scripts/` directory with incremental numbering (001, 002, 003, etc.)
- Store public assets in `public/` with descriptive subdirectories (`/images`, `/icons`)

**SHOULD:**
- Group related components together (e.g., all story-related components)
- Use kebab-case for file names (`countdown-timer.tsx`, not `CountdownTimer.tsx`)
- Prefix client components with `"use client"` directive only when necessary
- Keep page components thin and delegate logic to smaller components

### Component Architecture

**MUST:**
- Split large pages into multiple smaller components for maintainability
- Use Server Components by default for better performance
- Mark Client Components with `"use client"` directive at the top
- Export components as named exports, not default exports (except for page.tsx)
- Use TypeScript interfaces for all component props
- Implement proper error boundaries for client-side errors

**SHOULD:**
- Keep components focused on a single responsibility
- Extract reusable logic into custom hooks
- Use composition over inheritance
- Prefer controlled components for form inputs
- Implement loading and error states for async operations

### Styling Guidelines

**MUST:**
- Use Tailwind CSS utility classes for all styling
- Override semantic design tokens in `globals.css` for theming
- Use responsive prefixes (`sm:`, `md:`, `lg:`) for mobile-first design
- Apply `cursor-pointer` to interactive elements
- Use `disabled:cursor-not-allowed` for disabled buttons
- Ensure proper color contrast (WCAG AA minimum) for text

**SHOULD:**
- Prefer Tailwind spacing scale over arbitrary values (`p-4` not `p-[16px]`)
- Use `gap` classes instead of margins for flex/grid spacing
- Apply `text-balance` or `text-pretty` for multi-line headings
- Use semantic color tokens (`bg-background`, `text-foreground`) when possible
- Limit design to 3-5 colors maximum

### Database & Backend

**MUST:**
- Use Row Level Security (RLS) policies on all Supabase tables
- Create separate browser client (`createBrowserClient`) and server client (`createServerClient`)
- Use singleton pattern for Supabase clients to prevent memory leaks
- Write parameterized SQL queries to prevent injection attacks
- Version all schema changes with numbered migration scripts
- Never store sensitive data in client-side code

**SHOULD:**
- Enable Realtime subscriptions only for data that needs live updates
- Use server actions for mutations when appropriate
- Implement proper error handling for database operations
- Clean up subscriptions in useEffect cleanup functions
- Use transactions for multi-step database operations

### Form Validation

**MUST:**
- Implement client-side validation before submission
- Show validation errors only after field has been touched (onBlur)
- Display error messages with sufficient color contrast (badges on gradients)
- Disable submit buttons when form is invalid or submitting
- Use proper input types (`type="email"` for emails)
- Add ARIA attributes (`aria-invalid`, `aria-describedby`) for accessibility

**SHOULD:**
- Validate in real-time after initial blur
- Provide clear, specific error messages
- Use visual indicators (red borders, error badges) for invalid fields
- Show success feedback after successful submission

### Performance & Optimization

**MUST:**
- Use Next.js `<Image>` component for all images with proper sizing
- Implement proper loading states for async operations
- Avoid unnecessary client-side re-renders
- Clean up intervals, timeouts, and subscriptions in useEffect
- Use `use cache` directive for expensive computations (Next.js 16 feature)

**SHOULD:**
- Prefetch critical routes
- Lazy load below-the-fold content
- Use SWR for client-side data caching
- Minimize bundle size by tree-shaking unused code
- Optimize images with WebP format and proper dimensions

### Accessibility

**MUST:**
- Use semantic HTML elements (`<main>`, `<section>`, `<header>`, `<nav>`)
- Provide alt text for all meaningful images
- Ensure keyboard navigation works for all interactive elements
- Add ARIA labels where semantic HTML is insufficient
- Maintain proper heading hierarchy (h1 → h2 → h3)
- Ensure color contrast meets WCAG AA standards (4.5:1 for text)

**SHOULD:**
- Use `sr-only` class for screen-reader-only text
- Add focus indicators for keyboard navigation
- Test with screen readers (VoiceOver, NVDA, JAWS)
- Support reduced motion preferences

### Environment & Configuration

**MUST:**
- Store all secrets in environment variables
- Never commit `.env.local` to version control
- Use `NEXT_PUBLIC_` prefix for client-side variables only
- Validate required environment variables at startup
- Use Vercel environment variables for production

**SHOULD:**
- Document all required environment variables
- Provide `.env.example` template
- Use different values for development and production
- Rotate secrets regularly

---

## Troubleshooting

### Common Issues

**Database Connection Errors**
- Verify Supabase environment variables are set correctly
- Check that database migrations have been run in order
- Ensure RLS policies allow the operations you're attempting

**Countdown Not Working**
- Check that `countdown_date` is set to a future date in the `reveal_state` table
- Verify the date is in the correct timezone format (ISO 8601 with timezone)
- Ensure Realtime is enabled on the `reveal_state` table in Supabase

**Form Submissions Failing**
- Check browser console for error messages
- Verify `predictions` table exists with correct schema
- Ensure RLS policies allow public INSERT on predictions table

**Styles Not Applying**
- Clear Next.js cache: `rm -rf .next && pnpm dev`
- Check that Tailwind CSS is properly configured in `globals.css`
- Verify component classes are not being overridden

---

This documentation provides a comprehensive guide for understanding, maintaining, and extending the Uzoma & Maame Gender Reveal App while adhering to best practices for Next.js, React, Supabase, and modern web development.
