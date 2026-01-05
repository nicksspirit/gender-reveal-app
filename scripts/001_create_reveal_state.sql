-- Create reveal_state table for countdown and reveal status
CREATE TABLE IF NOT EXISTS reveal_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  is_revealed BOOLEAN DEFAULT FALSE,
  gender TEXT CHECK (gender IN ('boy', 'girl')),
  countdown_date TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  registry_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE reveal_state ENABLE ROW LEVEL SECURITY;

-- Allow public SELECT (everyone can see the countdown state)
CREATE POLICY "Allow public read access" ON reveal_state
  FOR SELECT USING (true);

-- Allow authenticated users to UPDATE (admin only)
CREATE POLICY "Allow authenticated update" ON reveal_state
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Set replica identity to FULL for realtime
ALTER TABLE reveal_state REPLICA IDENTITY FULL;

-- Insert default state (30 seconds from now for testing)
INSERT INTO reveal_state (is_revealed, gender, countdown_date)
VALUES (false, null, NOW() + INTERVAL '30 seconds');
