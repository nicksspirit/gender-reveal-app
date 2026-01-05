create extension if not exists pgcrypto;

create table if not exists admin (
  id uuid primary key default gen_random_uuid(),
  password_hash text not null,
  created_at timestamptz not null default now()
);

alter table admin enable row level security;

create or replace function public.verify_admin_password(input_password text)
returns boolean
language sql
security definer
set search_path = public, extensions
as $$
  select exists (
    select 1
    from admin
    where password_hash = extensions.crypt(input_password, password_hash)
  );
$$;

revoke all on function public.verify_admin_password(text) from public;
grant execute on function public.verify_admin_password(text) to service_role;
