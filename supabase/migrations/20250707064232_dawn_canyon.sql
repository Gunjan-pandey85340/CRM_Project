/*
  # Complete CRM Schema Setup

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `full_name` (text)
      - `phone` (text)
      - `company` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `tickets`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text, required)
      - `status` (text, default 'open')
      - `priority` (text, default 'medium')
      - `category` (text, required)
      - `user_id` (uuid, foreign key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `feedback`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `message` (text, required)
      - `rating` (integer, 1-5 scale)
      - `user_id` (uuid, foreign key)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for user data access
    - Add admin policies for full access
    
  3. Performance
    - Add indexes for frequently queried columns
    - Add triggers for automatic timestamp updates
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admin can view all profiles" ON user_profiles;

DROP POLICY IF EXISTS "Users can view own tickets" ON tickets;
DROP POLICY IF EXISTS "Users can create tickets" ON tickets;
DROP POLICY IF EXISTS "Users can update own tickets" ON tickets;
DROP POLICY IF EXISTS "Admin can view all tickets" ON tickets;
DROP POLICY IF EXISTS "Admin can update all tickets" ON tickets;

DROP POLICY IF EXISTS "Users can view own feedback" ON feedback;
DROP POLICY IF EXISTS "Users can create feedback" ON feedback;
DROP POLICY IF EXISTS "Admin can view all feedback" ON feedback;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
DROP TRIGGER IF EXISTS update_tickets_updated_at ON tickets;

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name text,
  phone text,
  company text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  status text DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  category text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  rating integer DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'gunjanpandey8979@gmail.com'
    )
  );

-- Tickets Policies
CREATE POLICY "Users can view own tickets"
  ON tickets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create tickets"
  ON tickets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tickets"
  ON tickets
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all tickets"
  ON tickets
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'gunjanpandey8979@gmail.com'
    )
  );

CREATE POLICY "Admin can update all tickets"
  ON tickets
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'gunjanpandey8979@gmail.com'
    )
  );

-- Feedback Policies
CREATE POLICY "Users can view own feedback"
  ON feedback
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create feedback"
  ON feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can view all feedback"
  ON feedback
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'gunjanpandey8979@gmail.com'
    )
  );