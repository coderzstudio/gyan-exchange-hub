-- Create storage bucket for notes
INSERT INTO storage.buckets (id, name, public) 
VALUES ('notes', 'notes', true);

-- Storage policies for notes bucket
CREATE POLICY "Anyone can view notes files"
ON storage.objects FOR SELECT
USING (bucket_id = 'notes');

CREATE POLICY "Authenticated users can upload notes"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'notes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own notes files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'notes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own notes files"
ON storage.objects FOR DELETE
USING (bucket_id = 'notes' AND auth.uid()::text = (storage.foldername(name))[1]);