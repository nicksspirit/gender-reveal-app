-- Remove unused columns from reveal_state and predictions.

alter table public.reveal_state
  drop column if exists registry_url;

alter table public.predictions
  drop column if exists message;
