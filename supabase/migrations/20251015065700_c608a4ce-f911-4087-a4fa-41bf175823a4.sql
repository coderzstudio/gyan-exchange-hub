-- Create category enum for educational levels
CREATE TYPE public.education_category AS ENUM ('programming', 'school', 'university');

-- Add new columns to notes table
ALTER TABLE public.notes 
ADD COLUMN category public.education_category NOT NULL DEFAULT 'university',
ADD COLUMN level text NOT NULL DEFAULT '1';

-- Migrate existing data (existing notes are university with semester as level)
UPDATE public.notes 
SET category = 'university', 
    level = semester::text;

-- Drop the old semester column (data is now in level)
ALTER TABLE public.notes DROP COLUMN semester;

-- Add index for better query performance
CREATE INDEX idx_notes_category ON public.notes(category);
CREATE INDEX idx_notes_level ON public.notes(level);