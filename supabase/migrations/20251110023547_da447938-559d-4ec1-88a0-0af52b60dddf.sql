-- Create note_views table for tracking what users view
CREATE TABLE IF NOT EXISTS public.note_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  note_id UUID REFERENCES public.notes(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, note_id)
);

-- Enable RLS
ALTER TABLE public.note_views ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own views
CREATE POLICY "Users can track own views"
  ON public.note_views FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow anyone to read views (for recommendations)
CREATE POLICY "Anyone can read views"
  ON public.note_views FOR SELECT
  USING (true);

-- Create index for faster queries
CREATE INDEX idx_note_views_note_id ON public.note_views(note_id);
CREATE INDEX idx_note_views_user_id ON public.note_views(user_id);
CREATE INDEX idx_note_views_viewed_at ON public.note_views(viewed_at DESC);