-- Fix critical security vulnerability: restrict profile access to own profiles only

-- Drop the insecure policy that allows viewing all profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.user_profiles;

-- Ensure the secure policy exists (create or replace)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;

CREATE POLICY "Users can view their own profile"
ON public.user_profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Verify other policies are secure
-- The insert and update policies should already be secure, but let's ensure they exist correctly

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
CREATE POLICY "Users can insert their own profile"
ON public.user_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
CREATE POLICY "Users can update their own profile"
ON public.user_profiles
FOR UPDATE
USING (auth.uid() = user_id);