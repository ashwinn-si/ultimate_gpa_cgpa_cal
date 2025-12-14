// Database Types (Auto-generated from Supabase)
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      semesters: {
        Row: {
          id: string
          user_id: string
          name: string
          year: number
          term: string | null
          gpa: number
          total_credits: number
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          year: number
          term?: string | null
          gpa?: number
          total_credits?: number
          order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          year?: number
          term?: string | null
          gpa?: number
          total_credits?: number
          order?: number
          created_at?: string
          updated_at?: string
        }
      }
      subjects: {
        Row: {
          id: string
          semester_id: string
          name: string
          grade: string
          grade_points: number
          credits: number
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          semester_id: string
          name: string
          grade: string
          grade_points: number
          credits: number
          order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          semester_id?: string
          name?: string
          grade?: string
          grade_points?: number
          credits?: number
          order?: number
          created_at?: string
          updated_at?: string
        }
      }
      grade_configs: {
        Row: {
          id: string
          user_id: string
          name: string
          points: number
          description: string | null
          min_percentage: number | null
          max_percentage: number | null
          order: number
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          points: number
          description?: string | null
          min_percentage?: number | null
          max_percentage?: number | null
          order?: number
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          points?: number
          description?: string | null
          min_percentage?: number | null
          max_percentage?: number | null
          order?: number
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          theme: string
          default_grading_system: string
          decimal_precision: number
          include_failed_courses: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          theme?: string
          default_grading_system?: string
          decimal_precision?: number
          include_failed_courses?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          theme?: string
          default_grading_system?: string
          decimal_precision?: number
          include_failed_courses?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
