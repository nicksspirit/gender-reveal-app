# Uzoma & Maame — Gender Reveal App 🎉

A small Next.js app (App Router) that shows a countdown, lets guests submit boy/girl predictions, and includes an admin portal to manage the reveal. Built with Next.js, Tailwind CSS and Supabase (Postgres).

## Quickstart ⚡

Prerequisites:
- Node 18+
- pnpm
- Supabase project (for database + auth)

1. Install dependencies

```bash
pnpm install
```

2. Create a `.env.local` with required environment variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

(You may also see other envs referenced in `GEMINI.md`.)

3. Initialize the database

Run the SQL scripts in the `scripts/` folder in your Supabase SQL Editor (in order):
- `scripts/001_create_reveal_state.sql`
- `scripts/002_create_predictions_table.sql`
- `scripts/003_add_email_to_predictions.sql`
- `scripts/004_update_reveal_state_due_date.sql`
- `scripts/005_create_registries_table.sql`

4. Start the dev server

```bash
pnpm dev
```

Open: http://localhost:3000
Admin portal: http://localhost:3000/admin

## Useful scripts

- `pnpm dev` — development server
- `pnpm build` — production build
- `pnpm start` — run production build
- `pnpm lint` — run ESLint

## Notes 🔧

- Uses Supabase for data storage and realtime updates. Server helpers expect `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Admin operations require `SUPABASE_SERVICE_ROLE_KEY` (server-side).
- This repository includes `GEMINI.md` with more detailed docs and design notes.

---

If you want, I can also add a short `CONTRIBUTING.md` or an `.env.example` file. ✅
