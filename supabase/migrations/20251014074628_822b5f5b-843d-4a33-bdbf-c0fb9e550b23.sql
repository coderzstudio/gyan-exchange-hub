-- Fix remaining function search_path warnings
CREATE OR REPLACE FUNCTION update_reputation_level()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.gyan_points >= 1000 THEN
    NEW.reputation_level := 'Legend';
  ELSIF NEW.gyan_points >= 500 THEN
    NEW.reputation_level := 'Top Contributor';
  ELSIF NEW.gyan_points >= 200 THEN
    NEW.reputation_level := 'Active';
  ELSIF NEW.gyan_points >= 50 THEN
    NEW.reputation_level := 'Contributor';
  ELSE
    NEW.reputation_level := 'Newbie';
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;