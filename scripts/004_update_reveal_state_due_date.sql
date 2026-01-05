-- Update reveal_state to set due date to March 24th, 2025
-- and rename countdown_date purpose to be the due date
UPDATE reveal_state
SET countdown_date = '2026-03-24T00:00:00Z'
WHERE id = (SELECT id FROM reveal_state LIMIT 1);
