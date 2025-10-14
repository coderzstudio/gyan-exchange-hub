-- Fix linter warning: Add search_path to prevent_points_update function
CREATE OR REPLACE FUNCTION prevent_points_update()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.gyan_points != OLD.gyan_points THEN
    RAISE EXCEPTION 'Cannot update gyan_points directly. Use award_upload_points or deduct_download_points functions.';
  END IF;
  RETURN NEW;
END;
$$;

-- Fix view security: Drop and recreate leaderboard view as SECURITY INVOKER
DROP VIEW IF EXISTS public.user_leaderboard;

CREATE VIEW public.user_leaderboard 
WITH (security_invoker = true)
AS
SELECT id, reputation_level, gyan_points 
FROM profiles;