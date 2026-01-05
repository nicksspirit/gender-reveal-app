-- 008_unique_prediction_email.sql
-- Enforce unique, case-insensitive email for predictions

-- Normalize existing emails
UPDATE predictions SET email = LOWER(TRIM(email));

-- Remove duplicates (keep earliest submission)
DELETE FROM predictions a
USING predictions b
WHERE a.email = b.email
  AND a.created_at > b.created_at;

-- Add unique constraint
ALTER TABLE predictions ADD CONSTRAINT unique_email UNIQUE (email);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS predictions_email_idx ON predictions(email);
