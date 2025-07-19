/*
  # Fix Foreign Key Relationships

  1. Database Changes
    - Add foreign key constraint from feedback.user_id to user_profiles.user_id
    - Add foreign key constraint from tickets.user_id to user_profiles.user_id
    - Ensure proper relationships for Supabase joins

  2. Security
    - Maintain existing RLS policies
    - Ensure referential integrity

  3. Notes
    - This enables proper joins between tables in Supabase
    - Fixes the "Could not find a relationship" errors
*/

-- Add foreign key constraint from feedback to user_profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'feedback_user_profiles_fkey'
  ) THEN
    ALTER TABLE public.feedback 
    ADD CONSTRAINT feedback_user_profiles_fkey 
    FOREIGN KEY (user_id) REFERENCES public.user_profiles(user_id);
  END IF;
END $$;

-- Add foreign key constraint from tickets to user_profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'tickets_user_profiles_fkey'
  ) THEN
    ALTER TABLE public.tickets 
    ADD CONSTRAINT tickets_user_profiles_fkey 
    FOREIGN KEY (user_id) REFERENCES public.user_profiles(user_id);
  END IF;
END $$;