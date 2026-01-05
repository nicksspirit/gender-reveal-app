-- Create the predictions table
create table if not exists predictions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  prediction text not null check (prediction in ('boy', 'girl')),
  message text,
  created_at timestamptz default now() not null
);

-- Enable Row Level Security
alter table predictions enable row level security;

-- Allow anyone to read predictions
create policy "Anyone can view predictions"
on predictions for select
to authenticated, anon
using (true);

-- Allow anyone to insert predictions
create policy "Anyone can create predictions"
on predictions for insert
to authenticated, anon
with check (true);

-- Create index for better query performance
create index if not exists predictions_created_at_idx on predictions(created_at desc);
