/*
  # Complete CRM Application Fix

  1. Tables
    - Recreate all tables with proper structure
    - Add proper foreign key constraints
    - Add proper indexes

  2. Security
    - Enable RLS on all tables
    - Create comprehensive policies for users and admin
    - Ensure admin can access all data

  3. Performance
    - Add indexes for frequently queried columns
    - Add triggers for automatic timestamp updates
*/

-- Drop existing policies to recreate them properly
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

-- Ensure all tables exist with proper structure
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  full_name text,
  phone text,
  company text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  status text DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  category text NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  rating integer DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  user_id uuid NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add foreign key constraints and unique constraints
DO $$
BEGIN
  -- user_profiles foreign key
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_profiles_user_id_fkey' 
    AND table_name = 'user_profiles'
  ) THEN
    ALTER TABLE user_profiles 
    ADD CONSTRAINT user_profiles_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  -- user_profiles unique constraint
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_profiles_user_id_key' 
    AND table_name = 'user_profiles'
  ) THEN
    ALTER TABLE user_profiles 
    ADD CONSTRAINT user_profiles_user_id_key 
    UNIQUE (user_id);
  END IF;

  -- tickets foreign key
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'tickets_user_id_fkey' 
    AND table_name = 'tickets'
  ) THEN
    ALTER TABLE tickets 
    ADD CONSTRAINT tickets_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  -- feedback foreign key
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'feedback_user_id_fkey' 
    AND table_name = 'feedback'
  ) THEN
    ALTER TABLE feedback 
    ADD CONSTRAINT feedback_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create or replace the update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tickets_updated_at ON tickets;
CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Create user_profiles policies
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

-- Create tickets policies
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

-- Create feedback policies
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at);