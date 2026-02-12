// App Mode
export enum AppMode {
  RESIDENT = 'resident',
  MANAGER = 'manager',
}

// Views
export enum View {
  DASHBOARD = 'dashboard',
  PROPERTIES = 'properties',
  UNIT_DETAIL = 'unit_detail',
  MAINTENANCE = 'maintenance',
  MAINTENANCE_SCHEDULE = 'maintenance_schedule',
  INSPECTION_COMPARISON = 'inspection_comparison',
  FINAL_STATEMENT = 'final_statement',
  STAFF_WORKFLOW = 'staff_workflow',
  TEAM_MANAGEMENT = 'team_management',
  ANALYTICS = 'analytics',
  INBOX = 'inbox',
  RESIDENT_HOME = 'resident_home',
  REPORT_ISSUE = 'report_issue',
  PROFILE = 'profile',
  SMART_MATCHING = 'smart_matching',
  EMPLOYEE_MANAGEMENT = 'employee_management',
  RESIDENT_DEPOSIT = 'resident_deposit',
}

// Database types
export type SleepSchedule = 'early_riser' | 'night_owl' | 'flexible';
export type Gender = 'male' | 'female' | 'non_binary' | 'prefer_not_to_say';
export type UnitStatus = 'occupied' | 'vacant' | 'maintenance';
export type IssueStatus = 'pending' | 'in_progress' | 'resolved';
export type InspectionType = 'move_in' | 'move_out';

export interface Complex {
  id: string;
  name: string;
  address: string;
  total_units: number;
  created_at: string;
  updated_at: string;
}

export interface Unit {
  id: string;
  complex_id: string | null;
  unit_number: string;
  status: UnitStatus;
  bedrooms: number;
  bathrooms: number;
  rent_amount: number | null;
  security_deposit: number | null;
  created_at: string;
  updated_at: string;
  complex?: Complex;
}

export interface Employee {
  id: string;
  name: string;
  email: string | null;
  gender: Gender;
  sleep_schedule: SleepSchedule;
  hobbies: string[];
  unit_id: string | null;
  is_assigned: boolean;
  lease_start: string | null;
  lease_end: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  unit?: Unit;
}

export interface Issue {
  id: string;
  unit_id: string;
  reported_by: string | null;
  title: string;
  description: string | null;
  status: IssueStatus;
  priority: string;
  estimated_cost: number;
  created_at: string;
  updated_at: string;
  unit?: Unit;
  reporter?: Employee;
}

export interface Inspection {
  id: string;
  unit_id: string;
  inspection_type: InspectionType;
  room_name: string;
  area_name: string;
  photo_url: string | null;
  status: string;
  damage_detected: boolean;
  repair_cost: number;
  inspector_notes: string | null;
  inspected_at: string;
  created_at: string;
  unit?: Unit;
}

export interface RoommatePairing {
  id: string;
  employee1_id: string;
  employee2_id: string;
  unit_id: string | null;
  match_score: number;
  confirmed: boolean;
  created_at: string;
  employee1?: Employee;
  employee2?: Employee;
  unit?: Unit;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  icon: string;
  created_at: string;
}

export interface SecurityDepositStatement {
  id: string;
  employee_id: string;
  unit_id: string;
  original_deposit: number;
  inspection_deductions: number;
  issue_deductions: number;
  final_amount: number;
  status: string;
  created_at: string;
  employee?: Employee;
  unit?: Unit;
}
