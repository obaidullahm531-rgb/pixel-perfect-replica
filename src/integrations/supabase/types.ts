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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          achieved_on: string | null
          banner_url: string | null
          created_at: string
          details: string | null
          id: string
          position: string | null
          prize_money: string | null
          published: boolean
          sort_order: number
          team_members: string | null
          tournament_name: string
          updated_at: string
        }
        Insert: {
          achieved_on?: string | null
          banner_url?: string | null
          created_at?: string
          details?: string | null
          id?: string
          position?: string | null
          prize_money?: string | null
          published?: boolean
          sort_order?: number
          team_members?: string | null
          tournament_name: string
          updated_at?: string
        }
        Update: {
          achieved_on?: string | null
          banner_url?: string | null
          created_at?: string
          details?: string | null
          id?: string
          position?: string | null
          prize_money?: string | null
          published?: boolean
          sort_order?: number
          team_members?: string | null
          tournament_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          is_read: boolean
          message: string
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          is_read?: boolean
          message: string
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_read?: boolean
          message?: string
          subject?: string | null
        }
        Relationships: []
      }
      gallery: {
        Row: {
          caption: string | null
          category: string
          created_at: string
          id: string
          image_url: string | null
          published: boolean
          sort_order: number
          updated_at: string
          video_url: string | null
        }
        Insert: {
          caption?: string | null
          category?: string
          created_at?: string
          id?: string
          image_url?: string | null
          published?: boolean
          sort_order?: number
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          caption?: string | null
          category?: string
          created_at?: string
          id?: string
          image_url?: string | null
          published?: boolean
          sort_order?: number
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      join_applications: {
        Row: {
          age: number | null
          country: string | null
          created_at: string
          email: string
          experience: string
          facebook: string | null
          ff_uid: string | null
          full_name: string
          id: string
          ign: string
          is_read: boolean
          phone: string | null
          preferred_role: string
          secondary_role: string | null
          video_link: string | null
        }
        Insert: {
          age?: number | null
          country?: string | null
          created_at?: string
          email: string
          experience: string
          facebook?: string | null
          ff_uid?: string | null
          full_name: string
          id?: string
          ign: string
          is_read?: boolean
          phone?: string | null
          preferred_role: string
          secondary_role?: string | null
          video_link?: string | null
        }
        Update: {
          age?: number | null
          country?: string | null
          created_at?: string
          email?: string
          experience?: string
          facebook?: string | null
          ff_uid?: string | null
          full_name?: string
          id?: string
          ign?: string
          is_read?: boolean
          phone?: string | null
          preferred_role?: string
          secondary_role?: string | null
          video_link?: string | null
        }
        Relationships: []
      }
      managers: {
        Row: {
          age: number | null
          bio: string | null
          created_at: string
          email: string | null
          facebook: string | null
          id: string
          instagram: string | null
          name: string
          phone: string | null
          photo_url: string | null
          position: string
          published: boolean
          sort_order: number
          updated_at: string
        }
        Insert: {
          age?: number | null
          bio?: string | null
          created_at?: string
          email?: string | null
          facebook?: string | null
          id?: string
          instagram?: string | null
          name: string
          phone?: string | null
          photo_url?: string | null
          position?: string
          published?: boolean
          sort_order?: number
          updated_at?: string
        }
        Update: {
          age?: number | null
          bio?: string | null
          created_at?: string
          email?: string | null
          facebook?: string | null
          id?: string
          instagram?: string | null
          name?: string
          phone?: string | null
          photo_url?: string | null
          position?: string
          published?: boolean
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          category: string
          content: string | null
          created_at: string
          excerpt: string | null
          id: string
          image_url: string | null
          published: boolean
          published_at: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published?: boolean
          published_at?: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published?: boolean
          published_at?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      players: {
        Row: {
          address: string | null
          age: number | null
          bio: string | null
          country: string | null
          created_at: string
          discord: string | null
          experience: string | null
          facebook: string | null
          featured: boolean
          ff_uid: string | null
          id: string
          ign: string
          instagram: string | null
          other_links: string | null
          photo_url: string | null
          published: boolean
          real_name: string | null
          role: string
          role_label: string | null
          slug: string
          sort_order: number
          tiktok: string | null
          updated_at: string
          youtube: string | null
        }
        Insert: {
          address?: string | null
          age?: number | null
          bio?: string | null
          country?: string | null
          created_at?: string
          discord?: string | null
          experience?: string | null
          facebook?: string | null
          featured?: boolean
          ff_uid?: string | null
          id?: string
          ign: string
          instagram?: string | null
          other_links?: string | null
          photo_url?: string | null
          published?: boolean
          real_name?: string | null
          role?: string
          role_label?: string | null
          slug: string
          sort_order?: number
          tiktok?: string | null
          updated_at?: string
          youtube?: string | null
        }
        Update: {
          address?: string | null
          age?: number | null
          bio?: string | null
          country?: string | null
          created_at?: string
          discord?: string | null
          experience?: string | null
          facebook?: string | null
          featured?: boolean
          ff_uid?: string | null
          id?: string
          ign?: string
          instagram?: string | null
          other_links?: string | null
          photo_url?: string | null
          published?: boolean
          real_name?: string | null
          role?: string
          role_label?: string | null
          slug?: string
          sort_order?: number
          tiktok?: string | null
          updated_at?: string
          youtube?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          data: Json
          id: number
          updated_at: string
        }
        Insert: {
          data?: Json
          id?: number
          updated_at?: string
        }
        Update: {
          data?: Json
          id?: number
          updated_at?: string
        }
        Relationships: []
      }
      social_links: {
        Row: {
          created_at: string
          id: string
          label: string | null
          platform: string
          published: boolean
          sort_order: number
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          label?: string | null
          platform: string
          published?: boolean
          sort_order?: number
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string | null
          platform?: string
          published?: boolean
          sort_order?: number
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      sponsors: {
        Row: {
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          published: boolean
          sort_order: number
          sponsor_type: string
          tier: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          published?: boolean
          sort_order?: number
          sponsor_type?: string
          tier?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          published?: boolean
          sort_order?: number
          sponsor_type?: string
          tier?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      sponsorship_enquiries: {
        Row: {
          company: string
          contact_person: string
          created_at: string
          details: string
          email: string
          id: string
          is_read: boolean
          partnership_type: string | null
          phone: string | null
        }
        Insert: {
          company: string
          contact_person: string
          created_at?: string
          details: string
          email: string
          id?: string
          is_read?: boolean
          partnership_type?: string | null
          phone?: string | null
        }
        Update: {
          company?: string
          contact_person?: string
          created_at?: string
          details?: string
          email?: string
          id?: string
          is_read?: boolean
          partnership_type?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      tournaments: {
        Row: {
          banner_url: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          organizer: string | null
          prize_pool: string | null
          published: boolean
          result: string | null
          schedule: string | null
          sort_order: number
          start_date: string | null
          start_time: string | null
          status: string
          stream_url: string | null
          updated_at: string
        }
        Insert: {
          banner_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          organizer?: string | null
          prize_pool?: string | null
          published?: boolean
          result?: string | null
          schedule?: string | null
          sort_order?: number
          start_date?: string | null
          start_time?: string | null
          status?: string
          stream_url?: string | null
          updated_at?: string
        }
        Update: {
          banner_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          organizer?: string | null
          prize_pool?: string | null
          published?: boolean
          result?: string | null
          schedule?: string | null
          sort_order?: number
          start_date?: string | null
          start_time?: string | null
          status?: string
          stream_url?: string | null
          updated_at?: string
        }
        Relationships: []
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
      videos: {
        Row: {
          category: string | null
          created_at: string
          id: string
          published: boolean
          sort_order: number
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_url: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          published?: boolean
          sort_order?: number
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_url: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          published?: boolean
          sort_order?: number
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_exists: { Args: never; Returns: boolean }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
