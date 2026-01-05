-- Create registries table
create table if not exists registries (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table registries enable row level security;

-- Allow public read access
create policy "Enable read access for all users" on registries
  for select using (true);

-- Allow service role (admin) full access
create policy "Enable all access for service role" on registries
  for all using (auth.role() = 'service_role');

-- Refresh Supabase schema cache
NOTIFY pgrst, 'reload config';
