-- Supabase default privileges GRANT EXECUTE on new functions directly to anon (not via PUBLIC),
-- so 0001's "REVOKE ... FROM PUBLIC" left anon able to call is_admin(). Harmless (returns false
-- without a JWT email) but contrary to intent: is_admin is authenticated-only.
REVOKE ALL ON FUNCTION public.is_admin() FROM anon;
