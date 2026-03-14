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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      answers: {
        Row: {
          created_at: string
          id: string
          question_id: string
          text: string
          updated_at: string
          upvotes: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          question_id: string
          text: string
          updated_at?: string
          upvotes?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          question_id?: string
          text?: string
          updated_at?: string
          upvotes?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      community_experiences: {
        Row: {
          advice: string
          city: string
          corridor_id: string | null
          created_at: string
          id: string
          problems: string
          status: string
          step_template_id: string | null
          time_required: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          advice?: string
          city?: string
          corridor_id?: string | null
          created_at?: string
          id?: string
          problems?: string
          status?: string
          step_template_id?: string | null
          time_required?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          advice?: string
          city?: string
          corridor_id?: string | null
          created_at?: string
          id?: string
          problems?: string
          status?: string
          step_template_id?: string | null
          time_required?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_experiences_corridor_id_fkey"
            columns: ["corridor_id"]
            isOneToOne: false
            referencedRelation: "relocation_corridors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_experiences_step_template_id_fkey"
            columns: ["step_template_id"]
            isOneToOne: false
            referencedRelation: "journey_step_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      community_tips: {
        Row: {
          category: string
          city: string
          corridor_id: string | null
          created_at: string
          description: string
          id: string
          is_highlighted: boolean
          status: string
          step_template_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          city?: string
          corridor_id?: string | null
          created_at?: string
          description: string
          id?: string
          is_highlighted?: boolean
          status?: string
          step_template_id?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          city?: string
          corridor_id?: string | null
          created_at?: string
          description?: string
          id?: string
          is_highlighted?: boolean
          status?: string
          step_template_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_tips_corridor_id_fkey"
            columns: ["corridor_id"]
            isOneToOne: false
            referencedRelation: "relocation_corridors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_tips_step_template_id_fkey"
            columns: ["step_template_id"]
            isOneToOne: false
            referencedRelation: "journey_step_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      experience_votes: {
        Row: {
          created_at: string
          experience_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          experience_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          experience_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "experience_votes_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "community_experiences"
            referencedColumns: ["id"]
          },
        ]
      }
      guides: {
        Row: {
          category: string
          corridor_id: string | null
          created_at: string
          id: string
          is_published: boolean
          reading_time: string
          sections: Json
          sort_order: number
          summary: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          corridor_id?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          reading_time?: string
          sections?: Json
          sort_order?: number
          summary?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          corridor_id?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          reading_time?: string
          sections?: Json
          sort_order?: number
          summary?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "guides_corridor_id_fkey"
            columns: ["corridor_id"]
            isOneToOne: false
            referencedRelation: "relocation_corridors"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_step_templates: {
        Row: {
          category: string
          checklist_items: Json
          corridor_id: string
          cost: string
          created_at: string
          documents: Json
          estimated_time: string
          explanation: string
          id: string
          image_url: string | null
          is_active: boolean
          step_order: number
          title: string
          updated_at: string
          where_to_go: string
          why_it_matters: string
        }
        Insert: {
          category?: string
          checklist_items?: Json
          corridor_id: string
          cost?: string
          created_at?: string
          documents?: Json
          estimated_time?: string
          explanation?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          step_order: number
          title: string
          updated_at?: string
          where_to_go?: string
          why_it_matters?: string
        }
        Update: {
          category?: string
          checklist_items?: Json
          corridor_id?: string
          cost?: string
          created_at?: string
          documents?: Json
          estimated_time?: string
          explanation?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          step_order?: number
          title?: string
          updated_at?: string
          where_to_go?: string
          why_it_matters?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_step_templates_corridor_id_fkey"
            columns: ["corridor_id"]
            isOneToOne: false
            referencedRelation: "relocation_corridors"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          already_in_country: boolean | null
          avatar_url: string | null
          bio: string | null
          corridor_id: string | null
          created_at: string
          destination_city: string | null
          destination_country: string | null
          has_tax_code: boolean | null
          id: string
          job_status: string | null
          language_level: string | null
          name: string | null
          nationality: string | null
          onboarding_completed: boolean | null
          preferred_language: string | null
          reason_for_moving: string | null
          social_facebook: string | null
          social_instagram: string | null
          social_linkedin: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          already_in_country?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          corridor_id?: string | null
          created_at?: string
          destination_city?: string | null
          destination_country?: string | null
          has_tax_code?: boolean | null
          id?: string
          job_status?: string | null
          language_level?: string | null
          name?: string | null
          nationality?: string | null
          onboarding_completed?: boolean | null
          preferred_language?: string | null
          reason_for_moving?: string | null
          social_facebook?: string | null
          social_instagram?: string | null
          social_linkedin?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          already_in_country?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          corridor_id?: string | null
          created_at?: string
          destination_city?: string | null
          destination_country?: string | null
          has_tax_code?: boolean | null
          id?: string
          job_status?: string | null
          language_level?: string | null
          name?: string | null
          nationality?: string | null
          onboarding_completed?: boolean | null
          preferred_language?: string | null
          reason_for_moving?: string | null
          social_facebook?: string | null
          social_instagram?: string | null
          social_linkedin?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_corridor_id_fkey"
            columns: ["corridor_id"]
            isOneToOne: false
            referencedRelation: "relocation_corridors"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          category: string
          corridor_id: string | null
          created_at: string
          id: string
          text: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          corridor_id?: string | null
          created_at?: string
          id?: string
          text: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          corridor_id?: string | null
          created_at?: string
          id?: string
          text?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_corridor_id_fkey"
            columns: ["corridor_id"]
            isOneToOne: false
            referencedRelation: "relocation_corridors"
            referencedColumns: ["id"]
          },
        ]
      }
      relocation_corridors: {
        Row: {
          created_at: string
          destination_country: string
          id: string
          is_active: boolean
          origin_country: string
          slug: string
        }
        Insert: {
          created_at?: string
          destination_country: string
          id?: string
          is_active?: boolean
          origin_country: string
          slug: string
        }
        Update: {
          created_at?: string
          destination_country?: string
          id?: string
          is_active?: boolean
          origin_country?: string
          slug?: string
        }
        Relationships: []
      }
      tip_votes: {
        Row: {
          created_at: string
          id: string
          tip_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          tip_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          tip_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tip_votes_tip_id_fkey"
            columns: ["tip_id"]
            isOneToOne: false
            referencedRelation: "community_tips"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_step_progress: {
        Row: {
          checklist_state: Json
          completed_at: string | null
          created_at: string
          id: string
          status: string
          step_template_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          checklist_state?: Json
          completed_at?: string | null
          created_at?: string
          id?: string
          status?: string
          step_template_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          checklist_state?: Json
          completed_at?: string | null
          created_at?: string
          id?: string
          status?: string
          step_template_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_step_progress_step_template_id_fkey"
            columns: ["step_template_id"]
            isOneToOne: false
            referencedRelation: "journey_step_templates"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
