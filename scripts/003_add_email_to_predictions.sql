-- Add email column to predictions table
alter table predictions add column if not exists email text not null default '';
