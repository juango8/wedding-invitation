-- Let admins manage the allowlist from the panel (until now: SELECT-only via API, writes via SQL editor).
--  * INSERT: any admin can add another admin.
--  * DELETE: any admin can remove another admin, but NEVER their own row — a typo or a hasty
--    click can't lock the panel out; the other admin (or the SQL editor) removes you.
--  * Emails are normalized (lower/trim) by trigger so is_admin()'s lower() comparison always matches.

CREATE OR REPLACE FUNCTION public.normalize_admin_email()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.email := lower(trim(NEW.email));
  RETURN NEW;
END
$$;--> statement-breakpoint

CREATE TRIGGER admins_normalize_email
  BEFORE INSERT OR UPDATE ON public.admins
  FOR EACH ROW EXECUTE FUNCTION public.normalize_admin_email();--> statement-breakpoint

REVOKE ALL ON FUNCTION public.normalize_admin_email() FROM PUBLIC, anon, authenticated;--> statement-breakpoint

GRANT INSERT, DELETE ON TABLE public.admins TO authenticated;--> statement-breakpoint

CREATE POLICY admins_admin_insert ON public.admins
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());--> statement-breakpoint

CREATE POLICY admins_admin_delete ON public.admins
  FOR DELETE TO authenticated
  USING (public.is_admin() AND email <> lower(coalesce(auth.jwt() ->> 'email', '')));
