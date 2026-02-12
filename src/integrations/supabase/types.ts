export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          content: string
          created_at: string
          icon: string | null
          id: string
          title: string
        }
        Insert: {
          content: string
          created_at?: string
          icon?: string | null
          id?: string
          title: string
        }
        Update: {
          content?: string
          created_at?: string
          icon?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      complexes: {
        Row: {
          address: string
          created_at: string
          id: string
          name: string
          total_units: number
          updated_at: string
        }
        Insert: {
          address: string
          created_at?: string
          id?: string
          name: string
          total_units?: number
          updated_at?: string
        }
        Update: {
          address?: string
          created_at?: string
          id?: string
          name?: string
          total_units?: number
          updated_at?: string
        }
        Relationships: []
      }
      employees: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          gender: Database["public"]["Enums"]["gender"]
          hobbies: string[] | null
          id: string
          is_assigned: boolean
          lease_end: string | null
          lease_start: string | null
          name: string
          sleep_schedule: Database["public"]["Enums"]["sleep_schedule"]
          unit_id: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          gender?: Database["public"]["Enums"]["gender"]
          hobbies?: string[] | null
          id?: string
          is_assigned?: boolean
          lease_end?: string | null
          lease_start?: string | null
          name: string
          sleep_schedule?: Database["public"]["Enums"]["sleep_schedule"]
          unit_id?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          gender?: Database["public"]["Enums"]["gender"]
          hobbies?: string[] | null
          id?: string
          is_assigned?: boolean
          lease_end?: string | null
          lease_start?: string | null
          name?: string
          sleep_schedule?: Database["public"]["Enums"]["sleep_schedule"]
          unit_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employees_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      inspections: {
        Row: {
          area_name: string
          created_at: string
          damage_detected: boolean | null
          id: string
          inspected_at: string
          inspection_type: Database["public"]["Enums"]["inspection_type"]
          inspector_notes: string | null
          photo_url: string | null
          repair_cost: number | null
          room_name: string
          status: string | null
          unit_id: string
        }
        Insert: {
          area_name: string
          created_at?: string
          damage_detected?: boolean | null
          id?: string
          inspected_at?: string
          inspection_type: Database["public"]["Enums"]["inspection_type"]
          inspector_notes?: string | null
          photo_url?: string | null
          repair_cost?: number | null
          room_name: string
          status?: string | null
          unit_id: string
        }
        Update: {
          area_name?: string
          created_at?: string
          damage_detected?: boolean | null
          id?: string
          inspected_at?: string
          inspection_type?: Database["public"]["Enums"]["inspection_type"]
          inspector_notes?: string | null
          photo_url?: string | null
          repair_cost?: number | null
          room_name?: string
          status?: string | null
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspections_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      issues: {
        Row: {
          attributed_to: string | null
          created_at: string
          description: string | null
          estimated_cost: number | null
          id: string
          priority: string | null
          reported_by: string | null
          status: Database["public"]["Enums"]["issue_status"]
          title: string
          unit_id: string
          updated_at: string
        }
        Insert: {
          attributed_to?: string | null
          created_at?: string
          description?: string | null
          estimated_cost?: number | null
          id?: string
          priority?: string | null
          reported_by?: string | null
          status?: Database["public"]["Enums"]["issue_status"]
          title: string
          unit_id: string
          updated_at?: string
        }
        Update: {
          attributed_to?: string | null
          created_at?: string
          description?: string | null
          estimated_cost?: number | null
          id?: string
          priority?: string | null
          reported_by?: string | null
          status?: Database["public"]["Enums"]["issue_status"]
          title?: string
          unit_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "issues_attributed_to_fkey"
            columns: ["attributed_to"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issues_reported_by_fkey"
            columns: ["reported_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issues_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          employee_id: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          employee_id?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          employee_id?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      roommate_pairings: {
        Row: {
          confirmed: boolean | null
          created_at: string
          employee1_id: string
          employee2_id: string
          id: string
          match_score: number | null
          unit_id: string | null
        }
        Insert: {
          confirmed?: boolean | null
          created_at?: string
          employee1_id: string
          employee2_id: string
          id?: string
          match_score?: number | null
          unit_id?: string | null
        }
        Update: {
          confirmed?: boolean | null
          created_at?: string
          employee1_id?: string
          employee2_id?: string
          id?: string
          match_score?: number | null
          unit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roommate_pairings_employee1_id_fkey"
            columns: ["employee1_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roommate_pairings_employee2_id_fkey"
            columns: ["employee2_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roommate_pairings_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      security_deposit_statements: {
        Row: {
          created_at: string
          employee_id: string
          final_amount: number
          id: string
          inspection_deductions: number | null
          issue_deductions: number | null
          original_deposit: number
          status: string | null
          unit_id: string
        }
        Insert: {
          created_at?: string
          employee_id: string
          final_amount: number
          id?: string
          inspection_deductions?: number | null
          issue_deductions?: number | null
          original_deposit: number
          status?: string | null
          unit_id: string
        }
        Update: {
          created_at?: string
          employee_id?: string
          final_amount?: number
          id?: string
          inspection_deductions?: number | null
          issue_deductions?: number | null
          original_deposit?: number
          status?: string | null
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "security_deposit_statements_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "security_deposit_statements_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      units: {
        Row: {
          bathrooms: number
          bedrooms: number
          complex_id: string | null
          created_at: string
          id: string
          rent_amount: number | null
          security_deposit: number | null
          status: Database["public"]["Enums"]["unit_status"]
          unit_number: string
          updated_at: string
        }
        Insert: {
          bathrooms?: number
          bedrooms?: number
          complex_id?: string | null
          created_at?: string
          id?: string
          rent_amount?: number | null
          security_deposit?: number | null
          status?: Database["public"]["Enums"]["unit_status"]
          unit_number: string
          updated_at?: string
        }
        Update: {
          bathrooms?: number
          bedrooms?: number
          complex_id?: string | null
          created_at?: string
          id?: string
          rent_amount?: number | null
          security_deposit?: number | null
          status?: Database["public"]["Enums"]["unit_status"]
          unit_number?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "units_complex_id_fkey"
            columns: ["complex_id"]
            isOneToOne: false
            referencedRelation: "complexes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vendor_assignments: {
        Row: {
          assigned_at: string
          completed_at: string | null
          created_at: string
          id: string
          issue_id: string
          notes: string | null
          status: string
          vendor_contact: string | null
          vendor_name: string
        }
        Insert: {
          assigned_at?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          issue_id: string
          notes?: string | null
          status?: string
          vendor_contact?: string | null
          vendor_name: string
        }
        Update: {
          assigned_at?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          issue_id?: string
          notes?: string | null
          status?: string
          vendor_contact?: string | null
          vendor_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_assignments_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_unit_occupancy: { Args: { _unit_id: string }; Returns: Json }
      get_user_app_mode: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "resident"
      gender: "male" | "female" | "non_binary" | "prefer_not_to_say"
      inspection_type: "move_in" | "move_out"
      issue_status: "pending" | "in_progress" | "resolved"
      sleep_schedule: "early_riser" | "night_owl" | "flexible"
      unit_status: "occupied" | "vacant" | "maintenance"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "manager", "resident"],
      gender: ["male", "female", "non_binary", "prefer_not_to_say"],
      inspection_type: ["move_in", "move_out"],
      issue_status: ["pending", "in_progress", "resolved"],
      sleep_schedule: ["early_riser", "night_owl", "flexible"],
      unit_status: ["occupied", "vacant", "maintenance"],
    },
  },
} as const
