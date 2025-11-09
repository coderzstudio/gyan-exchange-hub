-- Create saved_notes table for user's library
CREATE TABLE public.saved_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  note_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, note_id)
);

-- Enable RLS
ALTER TABLE public.saved_notes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own saved notes"
ON public.saved_notes
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can save notes"
ON public.saved_notes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove saved notes"
ON public.saved_notes
FOR DELETE
USING (auth.uid() = user_id);

-- Add index for better performance
CREATE INDEX idx_saved_notes_user_id ON public.saved_notes(user_id);
CREATE INDEX idx_saved_notes_note_id ON public.saved_notes(note_id);