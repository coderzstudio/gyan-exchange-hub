-- Add tags column to notes table
ALTER TABLE public.notes
ADD COLUMN tags text[] DEFAULT '{}';

-- Update profiles table to give new users 50 points by default
ALTER TABLE public.profiles
ALTER COLUMN gyan_points SET DEFAULT 50;

-- Update existing profiles with 0 points to have 50 points
UPDATE public.profiles
SET gyan_points = 50
WHERE gyan_points = 0;