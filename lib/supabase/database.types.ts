// Generato da Supabase a partire dallo schema vero del progetto.
//
// Non si scrive a mano: si rigenera quando lo schema cambia. Prima di questo
// file il client Supabase era senza tipi, quindi ogni `.select()` tornava
// `any` — ed e' il motivo per cui in giro per le pagine c'erano tredici
// `(r: any)` scritti a mano. Non erano pigrizia: erano l'unico modo di dare
// un nome a qualcosa che TypeScript non sapeva descrivere.
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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      budgets: {
        Row: {
          category: string
          created_at: string
          id: string
          monthly_limit: number
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          monthly_limit: number
          user_id?: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          monthly_limit?: number
          user_id?: string
        }
        Relationships: []
      }
      contact_notes: {
        Row: {
          contact_id: string
          created_at: string
          done: boolean
          id: string
          note: string
          remind_at: string | null
          user_id: string
        }
        Insert: {
          contact_id: string
          created_at?: string
          done?: boolean
          id?: string
          note: string
          remind_at?: string | null
          user_id?: string
        }
        Update: {
          contact_id?: string
          created_at?: string
          done?: boolean
          id?: string
          note?: string
          remind_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_notes_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          user_id?: string
        }
        Relationships: []
      }
      email_events: {
        Row: {
          bounce_type: string | null
          created_at: string
          email_id: string | null
          id: string
          payload: Json
          reason: string | null
          recipient: string | null
          subject: string | null
          svix_id: string | null
          type: string
        }
        Insert: {
          bounce_type?: string | null
          created_at?: string
          email_id?: string | null
          id?: string
          payload: Json
          reason?: string | null
          recipient?: string | null
          subject?: string | null
          svix_id?: string | null
          type: string
        }
        Update: {
          bounce_type?: string | null
          created_at?: string
          email_id?: string | null
          id?: string
          payload?: Json
          reason?: string | null
          recipient?: string | null
          subject?: string | null
          svix_id?: string | null
          type?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          created_at: string
          id: string
          name: string
          saved: number
          target: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          saved?: number
          target: number
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          saved?: number
          target?: number
          user_id?: string
        }
        Relationships: []
      }
      newsletter_issues: {
        Row: {
          body_html: string
          created_at: string
          id: string
          sent_at: string | null
          status: string
          subject: string
        }
        Insert: {
          body_html: string
          created_at?: string
          id?: string
          sent_at?: string | null
          status?: string
          subject: string
        }
        Update: {
          body_html?: string
          created_at?: string
          id?: string
          sent_at?: string | null
          status?: string
          subject?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          unsubscribe_token: string
          unsubscribed_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          unsubscribe_token?: string
          unsubscribed_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          unsubscribe_token?: string
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          birth_date: string | null
          created_at: string
          currency: string
          first_name: string | null
          last_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          birth_date?: string | null
          created_at?: string
          currency?: string
          first_name?: string | null
          last_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          birth_date?: string | null
          created_at?: string
          currency?: string
          first_name?: string | null
          last_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      recurring_transactions: {
        Row: {
          active: boolean
          amount: number
          category: string | null
          contact_id: string | null
          created_at: string
          description: string
          end_date: string | null
          frequency: string
          id: string
          next_date: string
          start_date: string
          user_id: string
        }
        Insert: {
          active?: boolean
          amount: number
          category?: string | null
          contact_id?: string | null
          created_at?: string
          description: string
          end_date?: string | null
          frequency: string
          id?: string
          next_date: string
          start_date: string
          user_id?: string
        }
        Update: {
          active?: boolean
          amount?: number
          category?: string | null
          contact_id?: string | null
          created_at?: string
          description?: string
          end_date?: string | null
          frequency?: string
          id?: string
          next_date?: string
          start_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recurring_transactions_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          category: string | null
          contact_id: string | null
          created_at: string
          date: string
          deleted_at: string | null
          description: string
          id: string
          recurring_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          category?: string | null
          contact_id?: string | null
          created_at?: string
          date: string
          deleted_at?: string | null
          description: string
          id?: string
          recurring_id?: string | null
          user_id?: string
        }
        Update: {
          amount?: number
          category?: string | null
          contact_id?: string | null
          created_at?: string
          date?: string
          deleted_at?: string | null
          description?: string
          id?: string
          recurring_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_recurring_id_fkey"
            columns: ["recurring_id"]
            isOneToOne: false
            referencedRelation: "recurring_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_due_recurring_transactions: { Args: never; Returns: undefined }
      next_occurrence: { Args: { d: string; freq: string }; Returns: string }
      purge_old_deleted_transactions: { Args: never; Returns: undefined }
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
    Enums: {},
  },
} as const
