export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      child_interests: {
        Row: {
          child_id: string
          id: string
          interest_id: string
        }
        Insert: {
          child_id: string
          id?: string
          interest_id: string
        }
        Update: {
          child_id?: string
          id?: string
          interest_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "child_interests_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "child_interests_interest_id_fkey"
            columns: ["interest_id"]
            isOneToOne: false
            referencedRelation: "interests"
            referencedColumns: ["id"]
          },
        ]
      }
      children: {
        Row: {
          age: string
          bio: string | null
          created_at: string
          id: string
          name: string
          parent_id: string
          updated_at: string
        }
        Insert: {
          age: string
          bio?: string | null
          created_at?: string
          id?: string
          name: string
          parent_id: string
          updated_at?: string
        }
        Update: {
          age?: string
          bio?: string | null
          created_at?: string
          id?: string
          name?: string
          parent_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "children_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      connections: {
        Row: {
          created_at: string
          id: string
          recipient_id: string
          requester_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          recipient_id: string
          requester_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          recipient_id?: string
          requester_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      early_signups: {
        Row: {
          children: Json[]
          converted_at: string | null
          converted_user_id: string | null
          created_at: string | null
          email: string
          id: string
          interests: string[]
          invited_at: string | null
          location: string
          parent_name: string
          phone: string | null
          referrer: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          children: Json[]
          converted_at?: string | null
          converted_user_id?: string | null
          created_at?: string | null
          email: string
          id?: string
          interests: string[]
          invited_at?: string | null
          location: string
          parent_name: string
          phone?: string | null
          referrer?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          children?: Json[]
          converted_at?: string | null
          converted_user_id?: string | null
          created_at?: string | null
          email?: string
          id?: string
          interests?: string[]
          invited_at?: string | null
          location?: string
          parent_name?: string
          phone?: string | null
          referrer?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      event_participants: {
        Row: {
          children_ids: string[]
          event_id: string
          id: string
          joined_at: string
          parent_id: string
        }
        Insert: {
          children_ids: string[]
          event_id: string
          id?: string
          joined_at?: string
          parent_id: string
        }
        Update: {
          children_ids?: string[]
          event_id?: string
          id?: string
          joined_at?: string
          parent_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          address: string
          city: string
          created_at: string
          description: string | null
          end_time: string
          host_id: string
          id: string
          location: string
          max_families: number | null
          start_time: string
          title: string
          updated_at: string
        }
        Insert: {
          address: string
          city: string
          created_at?: string
          description?: string | null
          end_time: string
          host_id: string
          id?: string
          location: string
          max_families?: number | null
          start_time: string
          title: string
          updated_at?: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          description?: string | null
          end_time?: string
          host_id?: string
          id?: string
          location?: string
          max_families?: number | null
          start_time?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      interests: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      matches: {
        Row: {
          child1_id: string
          child2_id: string
          created_at: string
          id: string
          status: string
          updated_at: string
        }
        Insert: {
          child1_id: string
          child2_id: string
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
        }
        Update: {
          child1_id?: string
          child2_id?: string
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_child1_id_fkey"
            columns: ["child1_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_child2_id_fkey"
            columns: ["child2_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read: boolean | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read?: boolean | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read?: boolean | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      old_early_signups: {
        Row: {
          children: Json[]
          created_at: string | null
          email: string
          id: string
          interests: string[]
          location: string
          parent_name: string
          phone: string | null
          referrer: string | null
          status: string | null
        }
        Insert: {
          children: Json[]
          created_at?: string | null
          email: string
          id?: string
          interests: string[]
          location: string
          parent_name: string
          phone?: string | null
          referrer?: string | null
          status?: string | null
        }
        Update: {
          children?: Json[]
          created_at?: string | null
          email?: string
          id?: string
          interests?: string[]
          location?: string
          parent_name?: string
          phone?: string | null
          referrer?: string | null
          status?: string | null
        }
        Relationships: []
      }
      playdate_participants: {
        Row: {
          child_id: string
          child_ids: string[]
          created_at: string
          id: string
          parent_id: string
          playdate_id: string
          status: string
          updated_at: string
        }
        Insert: {
          child_id: string
          child_ids?: string[]
          created_at?: string
          id?: string
          parent_id?: string
          playdate_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          child_id?: string
          child_ids?: string[]
          created_at?: string
          id?: string
          parent_id?: string
          playdate_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "playdate_participants_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playdate_participants_playdate_id_fkey"
            columns: ["playdate_id"]
            isOneToOne: false
            referencedRelation: "playdates"
            referencedColumns: ["id"]
          },
        ]
      }
      playdates: {
        Row: {
          created_at: string
          creator_id: string
          description: string | null
          end_time: string
          id: string
          latitude: number | null
          location: string
          longitude: number | null
          max_participants: number | null
          start_time: string
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          description?: string | null
          end_time: string
          id?: string
          latitude?: number | null
          location: string
          longitude?: number | null
          max_participants?: number | null
          start_time: string
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          description?: string | null
          end_time?: string
          id?: string
          latitude?: number | null
          location?: string
          longitude?: number | null
          max_participants?: number | null
          start_time?: string
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "playdates_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          created_at: string
          description: string | null
          email: string
          id: string
          interests: string[] | null
          location: string | null
          parent_name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          description?: string | null
          email: string
          id: string
          interests?: string[] | null
          location?: string | null
          parent_name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          description?: string | null
          email?: string
          id?: string
          interests?: string[] | null
          location?: string | null
          parent_name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_connection_exists: {
        Args: { user1_id: string; user2_id: string }
        Returns: {
          id: string
          requester_id: string
          recipient_id: string
          status: string
          created_at: string
        }[]
      }
      check_connection_status: {
        Args: { user1_id: string; user2_id: string }
        Returns: string
      }
      create_connection: {
        Args: { req_id: string; rec_id: string }
        Returns: {
          id: string
          requester_id: string
          recipient_id: string
          status: string
          created_at: string
        }[]
      }
      create_event: {
        Args: {
          p_title: string
          p_description: string
          p_location: string
          p_city: string
          p_address: string
          p_start_time: string
          p_end_time: string
          p_host_id: string
          p_max_families: number
        }
        Returns: {
          id: string
          title: string
          description: string
          location: string
          city: string
          address: string
          start_time: string
          end_time: string
          host_id: string
          max_families: number
          created_at: string
          updated_at: string
        }[]
      }
      find_potential_matches: {
        Args: { child_id: string }
        Returns: {
          id: string
          name: string
          age: string
          parent_id: string
          parent_name: string
          location: string
          common_interests: number
        }[]
      }
      get_all_events: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          title: string
          description: string
          location: string
          city: string
          address: string
          start_time: string
          end_time: string
          host_id: string
          max_families: number
          created_at: string
          updated_at: string
        }[]
      }
      get_conversation: {
        Args: { user1_id: string; user2_id: string }
        Returns: {
          id: string
          sender_id: string
          recipient_id: string
          content: string
          created_at: string
          read: boolean
        }[]
      }
      get_event_by_id: {
        Args: { p_event_id: string }
        Returns: {
          id: string
          title: string
          description: string
          location: string
          city: string
          address: string
          start_time: string
          end_time: string
          host_id: string
          max_families: number
          created_at: string
          updated_at: string
        }[]
      }
      get_event_participant_counts: {
        Args: { p_event_ids: string[] }
        Returns: {
          event_id: string
          participant_count: number
        }[]
      }
      get_event_participants: {
        Args: { p_event_id: string }
        Returns: {
          id: string
          event_id: string
          parent_id: string
          children_ids: string[]
          joined_at: string
        }[]
      }
      get_hosted_events: {
        Args: { host_user_id: string }
        Returns: {
          id: string
          title: string
          description: string
          location: string
          city: string
          address: string
          start_time: string
          end_time: string
          host_id: string
          max_families: number
          created_at: string
          updated_at: string
        }[]
      }
      get_joined_events: {
        Args: { participant_user_id: string }
        Returns: {
          id: string
          title: string
          description: string
          location: string
          city: string
          address: string
          start_time: string
          end_time: string
          host_id: string
          max_families: number
          created_at: string
          updated_at: string
        }[]
      }
      get_user_connections: {
        Args: { user_id: string }
        Returns: {
          id: string
          requester_id: string
          recipient_id: string
          status: string
          created_at: string
          updated_at: string
        }[]
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      join_event: {
        Args: {
          p_event_id: string
          p_user_id: string
          p_children_ids: string[]
        }
        Returns: {
          id: string
          event_id: string
          parent_id: string
          children_ids: string[]
          joined_at: string
        }[]
      }
      leave_event: {
        Args: { p_event_id: string; p_user_id: string }
        Returns: boolean
      }
      mark_messages_as_read: {
        Args: { msg_ids: string[] }
        Returns: boolean
      }
      send_message: {
        Args: {
          sender_user_id: string
          recipient_user_id: string
          msg_content: string
        }
        Returns: {
          id: string
          sender_id: string
          recipient_id: string
          content: string
          created_at: string
          read: boolean
        }[]
      }
      update_connection_status: {
        Args: { conn_id: string; user_id: string; new_status: string }
        Returns: {
          id: string
          requester_id: string
          recipient_id: string
          status: string
          created_at: string
        }[]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
