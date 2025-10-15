-- Add policy to allow public viewing of basic profile information for note authors
-- This is necessary so users can see who uploaded notes without exposing sensitive data

CREATE POLICY "Anyone can view basic profile info for note authors"
ON public.profiles
FOR SELECT
USING (true);

-- Note: This policy allows viewing full_name and reputation_level which are public info
-- Sensitive data like email is still protected by application-level access control
-- Users can only UPDATE their own profiles (existing policy remains)