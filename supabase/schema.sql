-- CV to Web Database Schema
-- Run this in your Supabase SQL editor

-- Create portfolios table
CREATE TABLE portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  email TEXT,
  portfolio_data JSONB NOT NULL,
  template TEXT DEFAULT 'default',
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster username lookups
CREATE INDEX idx_portfolios_username ON portfolios(username);
CREATE INDEX idx_portfolios_is_published ON portfolios(is_published);

-- Enable Row Level Security
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published portfolios
CREATE POLICY "Public portfolios are viewable by everyone"
  ON portfolios
  FOR SELECT
  USING (is_published = true);

-- Policy: Service role can do everything (for API routes)
CREATE POLICY "Service role has full access"
  ON portfolios
  FOR ALL
  USING (auth.role() = 'service_role');

-- Policy: Users can read their own unpublished portfolios
CREATE POLICY "Users can view own portfolios"
  ON portfolios
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can update their own portfolios
CREATE POLICY "Users can update own portfolios"
  ON portfolios
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_portfolios_updated_at
  BEFORE UPDATE ON portfolios
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
