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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      ai_recommendations: {
        Row: {
          based_on_symptoms: string[] | null
          based_on_treatment_history: string[] | null
          confidence_score: number | null
          created_at: string
          helpful_rating: number | null
          id: string
          implemented: boolean | null
          priority: number
          recommendation_text: string
          recommendation_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          based_on_symptoms?: string[] | null
          based_on_treatment_history?: string[] | null
          confidence_score?: number | null
          created_at?: string
          helpful_rating?: number | null
          id?: string
          implemented?: boolean | null
          priority?: number
          recommendation_text: string
          recommendation_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          based_on_symptoms?: string[] | null
          based_on_treatment_history?: string[] | null
          confidence_score?: number | null
          created_at?: string
          helpful_rating?: number | null
          id?: string
          implemented?: boolean | null
          priority?: number
          recommendation_text?: string
          recommendation_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          message_type: string
          response: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          message_type?: string
          response?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          message_type?: string
          response?: string | null
          user_id?: string
        }
        Relationships: []
      }
      community_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          category: string | null
          content: string
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          category: string | null
          content_type: string | null
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          updated_at: string
          uploaded_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          content_type?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          updated_at?: string
          uploaded_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          content_type?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          updated_at?: string
          uploaded_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age_range: string | null
          created_at: string
          display_name: string | null
          id: string
          joined_at: string
          lars_status: string | null
          location: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          age_range?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          joined_at?: string
          lars_status?: string | null
          location?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          age_range?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          joined_at?: string
          lars_status?: string | null
          location?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          age: number | null
          anastomosis_height_cm: number | null
          chemo_end_date: string | null
          chemo_regimen: string | null
          chemo_start_date: string | null
          colorectal_cancer_stage: string | null
          country: string | null
          created_at: string
          current_lars_score: number | null
          current_medications: string[] | null
          diagnosis_date: string | null
          diet_restrictions: string[] | null
          email: string | null
          exercise_frequency: string | null
          full_name: string | null
          gender: string | null
          has_stoma: boolean | null
          id: string
          intake_completed: boolean | null
          intake_completed_at: string | null
          primary_symptoms: string[] | null
          primary_tumor_location: string | null
          quality_of_life_score: number | null
          radiation_end_date: string | null
          radiation_start_date: string | null
          radiation_type: string | null
          stoma_creation_date: string | null
          stoma_reversal_date: string | null
          stoma_temporary: boolean | null
          stoma_type: string | null
          support_system_rating: number | null
          surgery_date: string | null
          surgery_type: string | null
          symptom_severity: number | null
          underwent_chemotherapy: boolean | null
          underwent_radiation: boolean | null
          underwent_surgery: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          age?: number | null
          anastomosis_height_cm?: number | null
          chemo_end_date?: string | null
          chemo_regimen?: string | null
          chemo_start_date?: string | null
          colorectal_cancer_stage?: string | null
          country?: string | null
          created_at?: string
          current_lars_score?: number | null
          current_medications?: string[] | null
          diagnosis_date?: string | null
          diet_restrictions?: string[] | null
          email?: string | null
          exercise_frequency?: string | null
          full_name?: string | null
          gender?: string | null
          has_stoma?: boolean | null
          id?: string
          intake_completed?: boolean | null
          intake_completed_at?: string | null
          primary_symptoms?: string[] | null
          primary_tumor_location?: string | null
          quality_of_life_score?: number | null
          radiation_end_date?: string | null
          radiation_start_date?: string | null
          radiation_type?: string | null
          stoma_creation_date?: string | null
          stoma_reversal_date?: string | null
          stoma_temporary?: boolean | null
          stoma_type?: string | null
          support_system_rating?: number | null
          surgery_date?: string | null
          surgery_type?: string | null
          symptom_severity?: number | null
          underwent_chemotherapy?: boolean | null
          underwent_radiation?: boolean | null
          underwent_surgery?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          age?: number | null
          anastomosis_height_cm?: number | null
          chemo_end_date?: string | null
          chemo_regimen?: string | null
          chemo_start_date?: string | null
          colorectal_cancer_stage?: string | null
          country?: string | null
          created_at?: string
          current_lars_score?: number | null
          current_medications?: string[] | null
          diagnosis_date?: string | null
          diet_restrictions?: string[] | null
          email?: string | null
          exercise_frequency?: string | null
          full_name?: string | null
          gender?: string | null
          has_stoma?: boolean | null
          id?: string
          intake_completed?: boolean | null
          intake_completed_at?: string | null
          primary_symptoms?: string[] | null
          primary_tumor_location?: string | null
          quality_of_life_score?: number | null
          radiation_end_date?: string | null
          radiation_start_date?: string | null
          radiation_type?: string | null
          stoma_creation_date?: string | null
          stoma_reversal_date?: string | null
          stoma_temporary?: boolean | null
          stoma_type?: string | null
          support_system_rating?: number | null
          surgery_date?: string | null
          surgery_type?: string | null
          symptom_severity?: number | null
          underwent_chemotherapy?: boolean | null
          underwent_radiation?: boolean | null
          underwent_surgery?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
    Enums: {},
  },
} as const
