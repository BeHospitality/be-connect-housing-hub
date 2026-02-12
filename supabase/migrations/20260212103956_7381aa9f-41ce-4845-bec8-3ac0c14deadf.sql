
-- 1. Storage bucket for uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true);

-- Storage policies
CREATE POLICY "Authenticated users can upload files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'uploads');

CREATE POLICY "Anyone can view uploaded files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'uploads');

CREATE POLICY "Users can update their own uploads"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own uploads"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 2. Add attributed_to column to issues for roommate liability
ALTER TABLE public.issues ADD COLUMN attributed_to uuid REFERENCES public.employees(id) ON DELETE SET NULL;

-- 3. Create vendor_assignments table
CREATE TABLE public.vendor_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id uuid REFERENCES public.issues(id) ON DELETE CASCADE NOT NULL,
  vendor_name text NOT NULL,
  vendor_contact text,
  assigned_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone,
  status text NOT NULL DEFAULT 'assigned',
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.vendor_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON public.vendor_assignments FOR SELECT USING (true);
CREATE POLICY "Managers can manage vendors" ON public.vendor_assignments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin'));

-- 4. Occupancy enforcement function
CREATE OR REPLACE FUNCTION public.check_unit_occupancy(_unit_id uuid)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'current_occupants', (SELECT count(*) FROM employees WHERE unit_id = _unit_id AND is_assigned = true),
    'bedrooms', (SELECT bedrooms FROM units WHERE id = _unit_id),
    'max_per_bedroom', 2,
    'max_per_unit', 6,
    'can_add', (
      SELECT (count(*) < LEAST(bedrooms * 2, 6))
      FROM employees e
      JOIN units u ON u.id = _unit_id
      WHERE e.unit_id = _unit_id AND e.is_assigned = true
      GROUP BY u.bedrooms
    )
  )
$$;

-- 5. Trigger to enforce occupancy on employee assignment
CREATE OR REPLACE FUNCTION public.enforce_occupancy_limits()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_count integer;
  unit_bedrooms integer;
  max_allowed integer;
BEGIN
  IF NEW.unit_id IS NOT NULL AND NEW.is_assigned = true THEN
    SELECT count(*) INTO current_count
    FROM employees
    WHERE unit_id = NEW.unit_id AND is_assigned = true AND id != NEW.id;

    SELECT bedrooms INTO unit_bedrooms FROM units WHERE id = NEW.unit_id;
    max_allowed := LEAST(unit_bedrooms * 2, 6);

    IF current_count >= max_allowed THEN
      RAISE EXCEPTION 'Unit is at maximum occupancy (% of % allowed)', current_count, max_allowed;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER check_occupancy_before_assignment
  BEFORE INSERT OR UPDATE ON public.employees
  FOR EACH ROW EXECUTE FUNCTION public.enforce_occupancy_limits();
