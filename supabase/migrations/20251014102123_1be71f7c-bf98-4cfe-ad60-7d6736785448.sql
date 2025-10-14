-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own roles
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Only admins can insert/update/delete roles
CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Add admin/moderator policy for reports (view all)
CREATE POLICY "Admins and moderators can view all reports" ON public.reports
  FOR SELECT USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'moderator')
  );

-- Add admin/moderator policy for notes (update any)
CREATE POLICY "Admins and moderators can update any note" ON public.notes
  FOR UPDATE USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'moderator')
  );

-- Add DELETE policy for users to delete own notes
CREATE POLICY "Users can delete own notes" ON public.notes
  FOR DELETE USING (auth.uid() = uploader_id);

-- Add DELETE policy for reports (users can delete own reports)
CREATE POLICY "Users can delete own reports" ON public.reports
  FOR DELETE USING (auth.uid() = reporter_id);

-- Add database CHECK constraints for input validation
ALTER TABLE public.notes ADD CONSTRAINT subject_length CHECK (length(subject) <= 100);
ALTER TABLE public.notes ADD CONSTRAINT topic_length CHECK (length(topic) <= 200);
ALTER TABLE public.notes ADD CONSTRAINT subject_not_empty CHECK (length(trim(subject)) > 0);
ALTER TABLE public.notes ADD CONSTRAINT topic_not_empty CHECK (length(trim(topic)) > 0);

ALTER TABLE public.reports ADD CONSTRAINT reason_length CHECK (length(reason) BETWEEN 10 AND 1000);
ALTER TABLE public.reports ADD CONSTRAINT reason_not_empty CHECK (length(trim(reason)) >= 10);

ALTER TABLE public.profiles ADD CONSTRAINT full_name_length CHECK (full_name IS NULL OR length(full_name) <= 100);
ALTER TABLE public.profiles ADD CONSTRAINT university_length CHECK (university IS NULL OR length(university) <= 200);
ALTER TABLE public.profiles ADD CONSTRAINT course_length CHECK (course IS NULL OR length(course) <= 100);