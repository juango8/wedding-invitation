-- Security model (see docs/RESTRUCTURE_PLAN.md):
--  * anon (public site) has ZERO table access — it can only execute get_guest / submit_rsvp,
--    which look up exactly one row by its unguessable token. No guest-list enumeration.
--  * authenticated users reach the tables only if their Google email is in `admins` (RLS).
--  * Internal helper functions are not executable through the API.

-- ---------------------------------------------------------------------------
-- Token generation: 10 chars from an alphabet without ambiguous glyphs (0/O, 1/l/I, i, o).
-- pgcrypto lives in the `extensions` schema on Supabase, hence the qualified call.
CREATE OR REPLACE FUNCTION public.gen_guest_token()
RETURNS text
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  alphabet constant text := '23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ';
  result text;
BEGIN
  LOOP
    SELECT string_agg(substr(alphabet, (get_byte(extensions.gen_random_bytes(1), 0) % length(alphabet)) + 1, 1), '')
      INTO result
      FROM generate_series(1, 10);
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.guests WHERE token = result);
  END LOOP;
  RETURN result;
END
$$;--> statement-breakpoint

CREATE OR REPLACE FUNCTION public.set_guest_token()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.token IS NULL OR length(trim(NEW.token)) = 0 THEN
    NEW.token := public.gen_guest_token();
  END IF;
  RETURN NEW;
END
$$;--> statement-breakpoint

CREATE TRIGGER guests_set_token
  BEFORE INSERT ON public.guests
  FOR EACH ROW EXECUTE FUNCTION public.set_guest_token();--> statement-breakpoint

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END
$$;--> statement-breakpoint

CREATE TRIGGER guests_set_updated_at
  BEFORE UPDATE ON public.guests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();--> statement-breakpoint

-- ---------------------------------------------------------------------------
-- Public RPCs (the ONLY thing the anon key can do)

CREATE OR REPLACE FUNCTION public.get_guest(p_token text)
RETURNS TABLE (full_name text, status public.guest_status, message text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT g.full_name, g.status, g.message
  FROM public.guests g
  WHERE g.token = trim(coalesce(p_token, ''));
$$;--> statement-breakpoint

CREATE OR REPLACE FUNCTION public.submit_rsvp(p_token text, p_attending boolean, p_message text DEFAULT NULL)
RETURNS boolean
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF p_attending IS NULL THEN
    RETURN false;
  END IF;
  UPDATE public.guests
     SET status = CASE WHEN p_attending THEN 'accepted'::public.guest_status ELSE 'declined'::public.guest_status END,
         message = nullif(left(trim(coalesce(p_message, '')), 500), ''),
         responded_at = now()
   WHERE token = trim(coalesce(p_token, ''));
  RETURN found;
END
$$;--> statement-breakpoint

-- Admin gate for the manage page UI; RLS policies below are the real enforcement.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admins a
    WHERE a.email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;--> statement-breakpoint

-- ---------------------------------------------------------------------------
-- Grants & RLS

ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;--> statement-breakpoint

REVOKE ALL ON TABLE public.guests FROM anon, authenticated;--> statement-breakpoint
REVOKE ALL ON TABLE public.admins FROM anon, authenticated;--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.guests TO authenticated;--> statement-breakpoint
GRANT SELECT ON TABLE public.admins TO authenticated;--> statement-breakpoint

CREATE POLICY guests_admin_all ON public.guests
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());--> statement-breakpoint

CREATE POLICY admins_admin_read ON public.admins
  FOR SELECT TO authenticated
  USING (public.is_admin());--> statement-breakpoint

-- Functions: default EXECUTE goes to PUBLIC — lock down, then grant deliberately.
REVOKE ALL ON FUNCTION public.gen_guest_token() FROM PUBLIC, anon, authenticated;--> statement-breakpoint
REVOKE ALL ON FUNCTION public.set_guest_token() FROM PUBLIC, anon, authenticated;--> statement-breakpoint
REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;--> statement-breakpoint
REVOKE ALL ON FUNCTION public.get_guest(text) FROM PUBLIC;--> statement-breakpoint
REVOKE ALL ON FUNCTION public.submit_rsvp(text, boolean, text) FROM PUBLIC;--> statement-breakpoint
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION public.get_guest(text) TO anon, authenticated;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION public.submit_rsvp(text, boolean, text) TO anon, authenticated;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;--> statement-breakpoint

-- ---------------------------------------------------------------------------
-- Seed admins (manage-page allowlist). Add more via SQL editor when needed.
INSERT INTO public.admins (email) VALUES
  ('jgonzalofh2898@gmail.com'),
  ('gcoayla.28@gmail.com')
ON CONFLICT (email) DO NOTHING;
