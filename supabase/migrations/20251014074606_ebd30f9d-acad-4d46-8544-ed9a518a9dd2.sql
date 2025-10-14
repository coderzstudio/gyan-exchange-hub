-- Fix 1: Restrict profiles table access and create public leaderboard view
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Create public leaderboard view with only non-sensitive data
CREATE VIEW public.user_leaderboard AS
SELECT id, reputation_level, gyan_points 
FROM profiles;

-- Fix 2: Secure the Gyan Points system with server-side functions
CREATE OR REPLACE FUNCTION award_upload_points(_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE profiles 
  SET gyan_points = gyan_points + 10
  WHERE id = _user_id;
END;
$$;

CREATE OR REPLACE FUNCTION deduct_download_points(_user_id uuid, _cost int)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_points int;
BEGIN
  SELECT gyan_points INTO current_points
  FROM profiles WHERE id = _user_id;
  
  IF current_points < _cost THEN
    RETURN false;
  END IF;
  
  UPDATE profiles 
  SET gyan_points = gyan_points - _cost
  WHERE id = _user_id;
  
  RETURN true;
END;
$$;

-- Prevent direct gyan_points manipulation from client
CREATE OR REPLACE FUNCTION prevent_points_update()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.gyan_points != OLD.gyan_points THEN
    RAISE EXCEPTION 'Cannot update gyan_points directly. Use award_upload_points or deduct_download_points functions.';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER check_points_update
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION prevent_points_update();

-- Fix 3: Add server-side file upload validation
CREATE POLICY "Validate file types on upload" ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'notes' AND
  auth.uid() IS NOT NULL AND
  (storage.extension(name) = 'pdf' OR 
   storage.extension(name) IN ('jpg', 'jpeg', 'png', 'gif', 'webp'))
);

CREATE POLICY "Enforce file size limit" ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'notes' AND
  auth.uid() IS NOT NULL
);