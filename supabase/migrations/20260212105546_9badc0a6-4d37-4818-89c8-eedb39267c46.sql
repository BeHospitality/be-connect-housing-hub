
-- 1. Create clients table
CREATE TABLE public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- 2. Link users to clients via profiles
ALTER TABLE public.profiles ADD COLUMN client_id uuid REFERENCES public.clients(id);

-- 3. Security definer function to get user's client_id
CREATE OR REPLACE FUNCTION public.get_user_client_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT client_id FROM public.profiles WHERE user_id = _user_id LIMIT 1
$$;

-- 4. Add client_id to all data tables
ALTER TABLE public.complexes ADD COLUMN client_id uuid REFERENCES public.clients(id);
ALTER TABLE public.units ADD COLUMN client_id uuid REFERENCES public.clients(id);
ALTER TABLE public.employees ADD COLUMN client_id uuid REFERENCES public.clients(id);
ALTER TABLE public.issues ADD COLUMN client_id uuid REFERENCES public.clients(id);
ALTER TABLE public.inspections ADD COLUMN client_id uuid REFERENCES public.clients(id);
ALTER TABLE public.roommate_pairings ADD COLUMN client_id uuid REFERENCES public.clients(id);
ALTER TABLE public.announcements ADD COLUMN client_id uuid REFERENCES public.clients(id);
ALTER TABLE public.security_deposit_statements ADD COLUMN client_id uuid REFERENCES public.clients(id);
ALTER TABLE public.message_channels ADD COLUMN client_id uuid REFERENCES public.clients(id);
ALTER TABLE public.vendor_assignments ADD COLUMN client_id uuid REFERENCES public.clients(id);

-- 5. Create indexes for performance
CREATE INDEX idx_profiles_client_id ON public.profiles(client_id);
CREATE INDEX idx_complexes_client_id ON public.complexes(client_id);
CREATE INDEX idx_units_client_id ON public.units(client_id);
CREATE INDEX idx_employees_client_id ON public.employees(client_id);
CREATE INDEX idx_issues_client_id ON public.issues(client_id);
CREATE INDEX idx_inspections_client_id ON public.inspections(client_id);
CREATE INDEX idx_roommate_pairings_client_id ON public.roommate_pairings(client_id);
CREATE INDEX idx_announcements_client_id ON public.announcements(client_id);
CREATE INDEX idx_sds_client_id ON public.security_deposit_statements(client_id);
CREATE INDEX idx_message_channels_client_id ON public.message_channels(client_id);
CREATE INDEX idx_vendor_assignments_client_id ON public.vendor_assignments(client_id);

-- 6. RLS on clients table
CREATE POLICY "Users can view their own client" ON public.clients
  FOR SELECT USING (id = public.get_user_client_id(auth.uid()));

CREATE POLICY "Admins can manage clients" ON public.clients
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 7. Drop old permissive policies and replace with tenant-scoped ones

-- COMPLEXES
DROP POLICY IF EXISTS "Public read access" ON public.complexes;
DROP POLICY IF EXISTS "Public insert access" ON public.complexes;
DROP POLICY IF EXISTS "Public update access" ON public.complexes;
DROP POLICY IF EXISTS "Public delete access" ON public.complexes;

CREATE POLICY "Tenant read" ON public.complexes FOR SELECT
  USING (client_id = public.get_user_client_id(auth.uid()));
CREATE POLICY "Tenant insert" ON public.complexes FOR INSERT
  WITH CHECK (client_id = public.get_user_client_id(auth.uid()));
CREATE POLICY "Tenant update" ON public.complexes FOR UPDATE
  USING (client_id = public.get_user_client_id(auth.uid()));
CREATE POLICY "Tenant delete" ON public.complexes FOR DELETE
  USING (client_id = public.get_user_client_id(auth.uid()));

-- UNITS
DROP POLICY IF EXISTS "Public read access" ON public.units;
DROP POLICY IF EXISTS "Public insert access" ON public.units;
DROP POLICY IF EXISTS "Public update access" ON public.units;
DROP POLICY IF EXISTS "Public delete access" ON public.units;

CREATE POLICY "Tenant read" ON public.units FOR SELECT
  USING (client_id = public.get_user_client_id(auth.uid()));
CREATE POLICY "Tenant insert" ON public.units FOR INSERT
  WITH CHECK (client_id = public.get_user_client_id(auth.uid()));
CREATE POLICY "Tenant update" ON public.units FOR UPDATE
  USING (client_id = public.get_user_client_id(auth.uid()));
CREATE POLICY "Tenant delete" ON public.units FOR DELETE
  USING (client_id = public.get_user_client_id(auth.uid()));

-- EMPLOYEES
DROP POLICY IF EXISTS "Public read access" ON public.employees;
DROP POLICY IF EXISTS "Public insert access" ON public.employees;
DROP POLICY IF EXISTS "Public update access" ON public.employees;
DROP POLICY IF EXISTS "Public delete access" ON public.employees;

CREATE POLICY "Tenant read" ON public.employees FOR SELECT
  USING (client_id = public.get_user_client_id(auth.uid()));
CREATE POLICY "Tenant insert" ON public.employees FOR INSERT
  WITH CHECK (client_id = public.get_user_client_id(auth.uid()));
CREATE POLICY "Tenant update" ON public.employees FOR UPDATE
  USING (client_id = public.get_user_client_id(auth.uid()));
CREATE POLICY "Tenant delete" ON public.employees FOR DELETE
  USING (client_id = public.get_user_client_id(auth.uid()));

-- ISSUES
DROP POLICY IF EXISTS "Public read access" ON public.issues;
DROP POLICY IF EXISTS "Public insert access" ON public.issues;
DROP POLICY IF EXISTS "Public update access" ON public.issues;
DROP POLICY IF EXISTS "Public delete access" ON public.issues;

CREATE POLICY "Tenant read" ON public.issues FOR SELECT
  USING (client_id = public.get_user_client_id(auth.uid()));
CREATE POLICY "Tenant insert" ON public.issues FOR INSERT
  WITH CHECK (client_id = public.get_user_client_id(auth.uid()));
CREATE POLICY "Tenant update" ON public.issues FOR UPDATE
  USING (client_id = public.get_user_client_id(auth.uid()));
CREATE POLICY "Tenant delete" ON public.issues FOR DELETE
  USING (client_id = public.get_user_client_id(auth.uid()));

-- INSPECTIONS
DROP POLICY IF EXISTS "Public read access" ON public.inspections;
DROP POLICY IF EXISTS "Public insert access" ON public.inspections;
DROP POLICY IF EXISTS "Public update access" ON public.inspections;
DROP POLICY IF EXISTS "Public delete access" ON public.inspections;

CREATE POLICY "Tenant read" ON public.inspections FOR SELECT
  USING (client_id = public.get_user_client_id(auth.uid()));
CREATE POLICY "Tenant insert" ON public.inspections FOR INSERT
  WITH CHECK (client_id = public.get_user_client_id(auth.uid()));
CREATE POLICY "Tenant update" ON public.inspections FOR UPDATE
  USING (client_id = public.get_user_client_id(auth.uid()));
CREATE POLICY "Tenant delete" ON public.inspections FOR DELETE
  USING (client_id = public.get_user_client_id(auth.uid()));

-- ROOMMATE_PAIRINGS
DROP POLICY IF EXISTS "Public read access" ON public.roommate_pairings;
DROP POLICY IF EXISTS "Public insert access" ON public.roommate_pairings;
DROP POLICY IF EXISTS "Public update access" ON public.roommate_pairings;
DROP POLICY IF EXISTS "Public delete access" ON public.roommate_pairings;

CREATE POLICY "Tenant read" ON public.roommate_pairings FOR SELECT
  USING (client_id = public.get_user_client_id(auth.uid()));
CREATE POLICY "Tenant insert" ON public.roommate_pairings FOR INSERT
  WITH CHECK (client_id = public.get_user_client_id(auth.uid()));
CREATE POLICY "Tenant update" ON public.roommate_pairings FOR UPDATE
  USING (client_id = public.get_user_client_id(auth.uid()));
CREATE POLICY "Tenant delete" ON public.roommate_pairings FOR DELETE
  USING (client_id = public.get_user_client_id(auth.uid()));

-- ANNOUNCEMENTS
DROP POLICY IF EXISTS "Public read access" ON public.announcements;
DROP POLICY IF EXISTS "Public insert access" ON public.announcements;
DROP POLICY IF EXISTS "Public update access" ON public.announcements;
DROP POLICY IF EXISTS "Public delete access" ON public.announcements;

CREATE POLICY "Tenant read" ON public.announcements FOR SELECT
  USING (client_id = public.get_user_client_id(auth.uid()));
CREATE POLICY "Tenant insert" ON public.announcements FOR INSERT
  WITH CHECK (client_id = public.get_user_client_id(auth.uid()));
CREATE POLICY "Tenant update" ON public.announcements FOR UPDATE
  USING (client_id = public.get_user_client_id(auth.uid()));
CREATE POLICY "Tenant delete" ON public.announcements FOR DELETE
  USING (client_id = public.get_user_client_id(auth.uid()));

-- SECURITY_DEPOSIT_STATEMENTS
DROP POLICY IF EXISTS "Public read access" ON public.security_deposit_statements;
DROP POLICY IF EXISTS "Public insert access" ON public.security_deposit_statements;
DROP POLICY IF EXISTS "Public update access" ON public.security_deposit_statements;
DROP POLICY IF EXISTS "Public delete access" ON public.security_deposit_statements;

CREATE POLICY "Tenant read" ON public.security_deposit_statements FOR SELECT
  USING (client_id = public.get_user_client_id(auth.uid()));
CREATE POLICY "Tenant insert" ON public.security_deposit_statements FOR INSERT
  WITH CHECK (client_id = public.get_user_client_id(auth.uid()));
CREATE POLICY "Tenant update" ON public.security_deposit_statements FOR UPDATE
  USING (client_id = public.get_user_client_id(auth.uid()));
CREATE POLICY "Tenant delete" ON public.security_deposit_statements FOR DELETE
  USING (client_id = public.get_user_client_id(auth.uid()));

-- MESSAGE_CHANNELS
DROP POLICY IF EXISTS "Authenticated users can create channels" ON public.message_channels;
DROP POLICY IF EXISTS "Authenticated users can view channels" ON public.message_channels;

CREATE POLICY "Tenant read" ON public.message_channels FOR SELECT
  USING (client_id = public.get_user_client_id(auth.uid()));
CREATE POLICY "Tenant insert" ON public.message_channels FOR INSERT
  WITH CHECK (client_id = public.get_user_client_id(auth.uid()));

-- VENDOR_ASSIGNMENTS
DROP POLICY IF EXISTS "Public read access" ON public.vendor_assignments;
DROP POLICY IF EXISTS "Managers can manage vendors" ON public.vendor_assignments;

CREATE POLICY "Tenant read" ON public.vendor_assignments FOR SELECT
  USING (client_id = public.get_user_client_id(auth.uid()));
CREATE POLICY "Tenant manager write" ON public.vendor_assignments FOR ALL
  USING (client_id = public.get_user_client_id(auth.uid()) AND (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')));

-- Update handle_new_user to NOT set client_id (it will be set during onboarding)
