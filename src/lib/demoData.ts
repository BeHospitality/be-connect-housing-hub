import { Complex, Unit, Employee, Issue, Inspection, Announcement, SecurityDepositStatement } from '@/types';

// ──────────────────────────────────────────────
// DEMO SEED DATA — used for sales demos & walkthroughs
// ──────────────────────────────────────────────

const demoId = (n: number) => `demo-${String(n).padStart(4, '0')}-0000-0000-000000000000`;

export const demoComplexes: Complex[] = [
  { id: demoId(1), name: 'Boca West Tower', address: '1200 Boca West Blvd, Boca Raton FL', total_units: 180, created_at: '2025-01-10T00:00:00Z', updated_at: '2025-01-10T00:00:00Z' },
  { id: demoId(2), name: 'Ballenisles Residences', address: '850 Ballenisles Dr, Palm Beach FL', total_units: 120, created_at: '2025-02-01T00:00:00Z', updated_at: '2025-02-01T00:00:00Z' },
  { id: demoId(3), name: 'Mira Corporate Housing', address: '2300 Mira Pkwy, Austin TX', total_units: 150, created_at: '2025-03-15T00:00:00Z', updated_at: '2025-03-15T00:00:00Z' },
];

export const demoUnits: Unit[] = [
  { id: demoId(10), complex_id: demoId(1), unit_number: '101A', status: 'occupied', bedrooms: 2, bathrooms: 1, rent_amount: 2200, security_deposit: 3000, created_at: '2025-01-10T00:00:00Z', updated_at: '2025-01-10T00:00:00Z' },
  { id: demoId(11), complex_id: demoId(1), unit_number: '102B', status: 'occupied', bedrooms: 3, bathrooms: 2, rent_amount: 2800, security_deposit: 4000, created_at: '2025-01-10T00:00:00Z', updated_at: '2025-01-10T00:00:00Z' },
  { id: demoId(12), complex_id: demoId(1), unit_number: '103C', status: 'vacant', bedrooms: 1, bathrooms: 1, rent_amount: 1500, security_deposit: 2000, created_at: '2025-01-10T00:00:00Z', updated_at: '2025-01-10T00:00:00Z' },
  { id: demoId(13), complex_id: demoId(2), unit_number: '201A', status: 'occupied', bedrooms: 2, bathrooms: 2, rent_amount: 2500, security_deposit: 3500, created_at: '2025-02-01T00:00:00Z', updated_at: '2025-02-01T00:00:00Z' },
  { id: demoId(14), complex_id: demoId(2), unit_number: '202B', status: 'maintenance', bedrooms: 2, bathrooms: 1, rent_amount: 2200, security_deposit: 3000, created_at: '2025-02-01T00:00:00Z', updated_at: '2025-02-01T00:00:00Z' },
  { id: demoId(15), complex_id: demoId(3), unit_number: '301A', status: 'occupied', bedrooms: 3, bathrooms: 2, rent_amount: 3200, security_deposit: 4500, created_at: '2025-03-15T00:00:00Z', updated_at: '2025-03-15T00:00:00Z' },
  { id: demoId(16), complex_id: demoId(3), unit_number: '302B', status: 'occupied', bedrooms: 2, bathrooms: 1, rent_amount: 2400, security_deposit: 3200, created_at: '2025-03-15T00:00:00Z', updated_at: '2025-03-15T00:00:00Z' },
  { id: demoId(17), complex_id: demoId(3), unit_number: '303C', status: 'vacant', bedrooms: 1, bathrooms: 1, rent_amount: 1800, security_deposit: 2500, created_at: '2025-03-15T00:00:00Z', updated_at: '2025-03-15T00:00:00Z' },
];

export const demoEmployees: Employee[] = [
  { id: demoId(20), name: 'Sarah Chen', email: 'sarah.chen@corp.com', gender: 'female', sleep_schedule: 'early_riser', hobbies: ['Yoga', 'Cooking', 'Reading'], unit_id: demoId(10), is_assigned: true, lease_start: '2025-01-15', lease_end: '2025-12-31', avatar_url: null, created_at: '2025-01-12T00:00:00Z', updated_at: '2025-01-12T00:00:00Z' },
  { id: demoId(21), name: 'Alex Rivera', email: 'alex.r@corp.com', gender: 'male', sleep_schedule: 'early_riser', hobbies: ['Yoga', 'Gaming'], unit_id: demoId(10), is_assigned: true, lease_start: '2025-01-15', lease_end: '2025-12-31', avatar_url: null, created_at: '2025-01-12T00:00:00Z', updated_at: '2025-01-12T00:00:00Z' },
  { id: demoId(22), name: 'Jamie Patel', email: 'jamie.p@corp.com', gender: 'female', sleep_schedule: 'night_owl', hobbies: ['Music', 'Photography'], unit_id: demoId(11), is_assigned: true, lease_start: '2025-02-01', lease_end: '2025-12-31', avatar_url: null, created_at: '2025-01-20T00:00:00Z', updated_at: '2025-01-20T00:00:00Z' },
  { id: demoId(23), name: 'Marcus Johnson', email: 'marcus.j@corp.com', gender: 'male', sleep_schedule: 'flexible', hobbies: ['Basketball', 'Cooking'], unit_id: demoId(13), is_assigned: true, lease_start: '2025-02-01', lease_end: '2025-12-31', avatar_url: null, created_at: '2025-02-05T00:00:00Z', updated_at: '2025-02-05T00:00:00Z' },
  { id: demoId(24), name: 'Emily Nakamura', email: 'emily.n@corp.com', gender: 'female', sleep_schedule: 'early_riser', hobbies: ['Hiking', 'Reading', 'Art'], unit_id: demoId(15), is_assigned: true, lease_start: '2025-03-15', lease_end: '2026-03-14', avatar_url: null, created_at: '2025-03-10T00:00:00Z', updated_at: '2025-03-10T00:00:00Z' },
  { id: demoId(25), name: 'David Kim', email: 'david.k@corp.com', gender: 'male', sleep_schedule: 'night_owl', hobbies: ['Gaming', 'Coding'], unit_id: null, is_assigned: false, lease_start: null, lease_end: null, avatar_url: null, created_at: '2025-04-01T00:00:00Z', updated_at: '2025-04-01T00:00:00Z' },
  { id: demoId(26), name: 'Priya Sharma', email: 'priya.s@corp.com', gender: 'female', sleep_schedule: 'flexible', hobbies: ['Dance', 'Yoga', 'Reading'], unit_id: null, is_assigned: false, lease_start: null, lease_end: null, avatar_url: null, created_at: '2025-04-05T00:00:00Z', updated_at: '2025-04-05T00:00:00Z' },
  { id: demoId(27), name: 'Tom Bradley', email: 'tom.b@corp.com', gender: 'male', sleep_schedule: 'early_riser', hobbies: ['Running', 'Cooking'], unit_id: demoId(16), is_assigned: true, lease_start: '2025-03-20', lease_end: '2026-03-19', avatar_url: null, created_at: '2025-03-18T00:00:00Z', updated_at: '2025-03-18T00:00:00Z' },
];

export const demoIssues: Issue[] = [
  { id: demoId(30), unit_id: demoId(10), reported_by: demoId(20), title: 'Kitchen Sink Leak', description: 'Slow drip under the kitchen sink, getting worse.', status: 'in_progress', priority: 'high', estimated_cost: 250, created_at: '2026-01-28T14:30:00Z', updated_at: '2026-01-29T09:00:00Z' },
  { id: demoId(31), unit_id: demoId(11), reported_by: demoId(22), title: 'HVAC Not Cooling', description: 'AC unit blowing warm air since yesterday.', status: 'pending', priority: 'urgent', estimated_cost: 400, created_at: '2026-02-10T08:15:00Z', updated_at: '2026-02-10T08:15:00Z' },
  { id: demoId(32), unit_id: demoId(13), reported_by: demoId(23), title: 'Broken Closet Door', description: 'Sliding closet door came off the track.', status: 'resolved', priority: 'normal', estimated_cost: 75, created_at: '2026-01-15T10:00:00Z', updated_at: '2026-01-20T16:00:00Z' },
  { id: demoId(33), unit_id: demoId(15), reported_by: demoId(24), title: 'Bathroom Tile Crack', description: 'Hairline crack in floor tile near shower.', status: 'pending', priority: 'low', estimated_cost: 120, created_at: '2026-02-08T11:45:00Z', updated_at: '2026-02-08T11:45:00Z' },
  { id: demoId(34), unit_id: demoId(10), reported_by: demoId(21), title: 'Electrical Outlet Sparking', description: 'Living room outlet sparks when plugging in devices.', status: 'in_progress', priority: 'urgent', estimated_cost: 300, created_at: '2026-02-11T07:00:00Z', updated_at: '2026-02-11T10:00:00Z' },
];

export const demoInspections: Inspection[] = [
  { id: demoId(40), unit_id: demoId(10), inspection_type: 'move_in', room_name: 'Living Room', area_name: 'North Wall', photo_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop', status: 'completed', damage_detected: false, repair_cost: 0, inspector_notes: 'Wall in excellent condition at move-in.', inspected_at: '2025-01-15T10:42:00Z', created_at: '2025-01-15T10:42:00Z' },
  { id: demoId(41), unit_id: demoId(10), inspection_type: 'move_out', room_name: 'Living Room', area_name: 'North Wall', photo_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop', status: 'completed', damage_detected: true, repair_cost: 125, inspector_notes: 'Scuffing and small dent found on north wall.', inspected_at: '2026-01-30T14:15:00Z', created_at: '2026-01-30T14:15:00Z' },
  { id: demoId(42), unit_id: demoId(11), inspection_type: 'move_in', room_name: 'Kitchen', area_name: 'Countertops', photo_url: null, status: 'completed', damage_detected: false, repair_cost: 0, inspector_notes: 'Countertops clean, no damage.', inspected_at: '2025-02-01T09:00:00Z', created_at: '2025-02-01T09:00:00Z' },
  { id: demoId(43), unit_id: demoId(14), inspection_type: 'move_out', room_name: 'Bathroom', area_name: 'Floor', photo_url: null, status: 'completed', damage_detected: true, repair_cost: 200, inspector_notes: 'Water damage to bathroom floor tiles.', inspected_at: '2026-02-05T11:30:00Z', created_at: '2026-02-05T11:30:00Z' },
];

export const demoAnnouncements: Announcement[] = [
  { id: demoId(50), title: 'Pool Maintenance Schedule', content: 'The community pool will be closed for maintenance from Feb 15-17. We apologize for the inconvenience.', icon: 'megaphone', created_at: '2026-02-09T12:00:00Z' },
  { id: demoId(51), title: 'New Fitness Center Hours', content: 'Starting March 1st, the fitness center will be open 5AM-11PM daily. Enjoy the extended hours!', icon: 'megaphone', created_at: '2026-02-07T09:00:00Z' },
  { id: demoId(52), title: 'Package Room Reminder', content: 'Please pick up packages within 48 hours of delivery. Unclaimed packages will be returned after 7 days.', icon: 'megaphone', created_at: '2026-02-03T15:00:00Z' },
];

export const demoDepositStatements: SecurityDepositStatement[] = [
  { id: demoId(60), employee_id: demoId(20), unit_id: demoId(10), original_deposit: 3000, inspection_deductions: 125, issue_deductions: 250, final_amount: 2625, status: 'generated', created_at: '2026-02-01T00:00:00Z' },
  { id: demoId(61), employee_id: demoId(23), unit_id: demoId(13), original_deposit: 3500, inspection_deductions: 0, issue_deductions: 75, final_amount: 3425, status: 'generated', created_at: '2026-02-03T00:00:00Z' },
];

// ──────────────────────────────────────────────
// Computed demo stats for the Dashboard & Analytics
// ──────────────────────────────────────────────

export const demoStats = {
  totalUnits: 450,
  occupiedUnits: 423,
  vacantUnits: 18,
  maintenanceUnits: 9,
  totalComplexes: 12,
  onboardingPending: 85,
  occupancyRate: 94,
  occupancyTrend: '+2.5%',
  avgResolutionDays: 3.2,
  totalEmployees: 328,
  totalDepositsHeld: 142500,
  totalDeductions: 8750,
  totalRecovered: 8750,
};

export const demoBreakdownItems = [
  { label: 'Occupied', count: 423, percentage: 94, color: 'hsl(187, 100%, 42%)' },
  { label: 'Vacant', count: 18, percentage: 4, color: 'hsl(210, 20%, 90%)' },
  { label: 'Maintenance', count: 9, percentage: 2, color: 'hsl(38, 92%, 50%)' },
];

export const demoIssueTrends = [
  { name: 'Sep', resolved: 12, pending: 3 },
  { name: 'Oct', resolved: 15, pending: 2 },
  { name: 'Nov', resolved: 8, pending: 5 },
  { name: 'Dec', resolved: 20, pending: 1 },
  { name: 'Jan', resolved: 18, pending: 4 },
  { name: 'Feb', resolved: 14, pending: 3 },
];

export const demoVendorAssignments = [
  { id: demoId(70), issue_id: demoId(30), vendor_name: 'AllStar Plumbing', vendor_contact: '(561) 555-0101', status: 'in_progress', notes: 'Scheduled for Tuesday morning.', assigned_at: '2026-01-29T10:00:00Z', completed_at: null, created_at: '2026-01-29T10:00:00Z' },
  { id: demoId(71), issue_id: demoId(34), vendor_name: 'SafeWire Electrical', vendor_contact: '(512) 555-0202', status: 'assigned', notes: 'Priority call - sparking outlet.', assigned_at: '2026-02-11T11:00:00Z', completed_at: null, created_at: '2026-02-11T11:00:00Z' },
  { id: demoId(72), issue_id: demoId(32), vendor_name: 'QuickFix Handyman', vendor_contact: '(561) 555-0303', status: 'completed', notes: 'Door re-hung and track replaced.', assigned_at: '2026-01-16T08:00:00Z', completed_at: '2026-01-18T15:00:00Z', created_at: '2026-01-16T08:00:00Z' },
];
