/*
  # Fix User Profiles Data Flow

  1. Tables
    - Ensure proper foreign key references
    - Fix any missing constraints
    - Add proper indexes

  2. Security
    - Update RLS policies to work correctly
    - Ensure admin access works properly

  3. Data Integrity
    - Add proper constraints and defaults
*/

-- First, let's make sure we have the correct table structure
-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admin can view all profiles" ON user_profiles;

-- Recreate the user_profiles table with proper structure
DO $$
BEGIN
  -- Check if user_profiles table exists and has correct structure
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'user_profiles' AND table_schema = 'public'
  ) THEN
    CREATE TABLE user_profiles (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL,
      full_name text,
      phone text,
      company text,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  END IF;

  -- Add foreign key constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_profiles_user_id_fkey'
  ) THEN
    ALTER TABLE user_profiles 
    ADD CONSTRAINT user_profiles_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  -- Add unique constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_profiles_user_id_key'
  ) THEN
    ALTER TABLE user_profiles 
    ADD CONSTRAINT user_profiles_user_id_key 
    UNIQUE (user_id);
  END IF;
END $$;

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create new policies with proper logic
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

-- Admin policy using a more reliable method
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- Create or replace the update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create the trigger
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();