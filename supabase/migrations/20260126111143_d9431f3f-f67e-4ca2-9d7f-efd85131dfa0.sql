-- Create enum for sleep schedules
CREATE TYPE public.sleep_schedule AS ENUM ('early_riser', 'night_owl', 'flexible');

-- Create enum for gender
CREATE TYPE public.gender AS ENUM ('male', 'female', 'non_binary', 'prefer_not_to_say');

-- Create enum for unit status
CREATE TYPE public.unit_status AS ENUM ('occupied', 'vacant', 'maintenance');

-- Create enum for issue status
CREATE TYPE public.issue_status AS ENUM ('pending', 'in_progress', 'resolved');

-- Create enum for inspection type
CREATE TYPE public.inspection_type AS ENUM ('move_in', 'move_out');

-- Create complexes table
CREATE TABLE public.complexes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    total_units INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create units table
CREATE TABLE public.units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complex_id UUID REFERENCES public.complexes(id) ON DELETE CASCADE,
    unit_number TEXT NOT NULL,
    status public.unit_status NOT NULL DEFAULT 'vacant',
    bedrooms INTEGER NOT NULL DEFAULT 1,
    bathrooms INTEGER NOT NULL DEFAULT 1,
    rent_amount DECIMAL(10,2),
    security_deposit DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create employees table (residents/staff being matched)
CREATE TABLE public.employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    gender public.gender NOT NULL DEFAULT 'prefer_not_to_say',
    sleep_schedule public.sleep_schedule NOT NULL DEFAULT 'flexible',
    hobbies TEXT[] DEFAULT '{}',
    unit_id UUID REFERENCES public.units(id) ON DELETE SET NULL,
    is_assigned BOOLEAN NOT NULL DEFAULT false,
    lease_start DATE,
    lease_end DATE,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create issues table
CREATE TABLE public.issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE NOT NULL,
    reported_by UUID REFERENCES public.employees(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    status public.issue_status NOT NULL DEFAULT 'pending',
    priority TEXT DEFAULT 'normal',
    estimated_cost DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create inspections table
CREATE TABLE public.inspections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE NOT NULL,
    inspection_type public.inspection_type NOT NULL,
    room_name TEXT NOT NULL,
    area_name TEXT NOT NULL,
    photo_url TEXT,
    status TEXT DEFAULT 'pending',
    damage_detected BOOLEAN DEFAULT false,
    repair_cost DECIMAL(10,2) DEFAULT 0,
    inspector_notes TEXT,
    inspected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create roommate_pairings table
CREATE TABLE public.roommate_pairings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee1_id UUID REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
    employee2_id UUID REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
    unit_id UUID REFERENCES public.units(id) ON DELETE SET NULL,
    match_score INTEGER DEFAULT 0,
    confirmed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create announcements table
CREATE TABLE public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    icon TEXT DEFAULT 'megaphone',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create security_deposit_statements table
CREATE TABLE public.security_deposit_statements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
    unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE NOT NULL,
    original_deposit DECIMAL(10,2) NOT NULL,
    inspection_deductions DECIMAL(10,2) DEFAULT 0,
    issue_deductions DECIMAL(10,2) DEFAULT 0,
    final_amount DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables (public read for this standalone app)
ALTER TABLE public.complexes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roommate_pairings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_deposit_statements ENABLE ROW LEVEL SECURITY;

-- Create public read policies (standalone app without auth)
CREATE POLICY "Public read access" ON public.complexes FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.complexes FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.complexes FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON public.complexes FOR DELETE USING (true);

CREATE POLICY "Public read access" ON public.units FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.units FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.units FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON public.units FOR DELETE USING (true);

CREATE POLICY "Public read access" ON public.employees FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.employees FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.employees FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON public.employees FOR DELETE USING (true);

CREATE POLICY "Public read access" ON public.issues FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.issues FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.issues FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON public.issues FOR DELETE USING (true);

CREATE POLICY "Public read access" ON public.inspections FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.inspections FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.inspections FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON public.inspections FOR DELETE USING (true);

CREATE POLICY "Public read access" ON public.roommate_pairings FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.roommate_pairings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.roommate_pairings FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON public.roommate_pairings FOR DELETE USING (true);

CREATE POLICY "Public read access" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.announcements FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.announcements FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON public.announcements FOR DELETE USING (true);

CREATE POLICY "Public read access" ON public.security_deposit_statements FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.security_deposit_statements FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.security_deposit_statements FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON public.security_deposit_statements FOR DELETE USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_complexes_updated_at BEFORE UPDATE ON public.complexes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_units_updated_at BEFORE UPDATE ON public.units FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_issues_updated_at BEFORE UPDATE ON public.issues FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.complexes (name, address, total_units) VALUES
('Bayside Community', '123 Corporate Way, Austin TX', 150),
('Boca West', '456 Palm Beach Rd, Boca Raton FL', 200),
('Ballenisles', '789 Golf Course Dr, Palm Beach FL', 100);

INSERT INTO public.announcements (title, content, icon) VALUES
('Parking Lot Cleaning', 'The north parking lot will be closed for cleaning this Friday from 9 AM to 2 PM. Please move your vehicles.', 'car');

-- Insert sample units
INSERT INTO public.units (complex_id, unit_number, status, bedrooms, bathrooms, rent_amount, security_deposit)
SELECT 
    c.id,
    '402-B',
    'occupied'::public.unit_status,
    2,
    1,
    1500.00,
    3000.00
FROM public.complexes c WHERE c.name = 'Bayside Community';