export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      families: {
        Row: {
          id: string;
          name: string;
          city: string;
          language: string;
          priorities: string[];
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          city: string;
          language: string;
          priorities?: string[];
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["families"]["Insert"]>;
        Relationships: [];
      };
      family_members: {
        Row: {
          id: string;
          family_id: string;
          user_id: string | null;
          name: string;
          relationship: string;
          dob: string | null;
          contact: string | null;
          role: string;
          permission: string;
          verification: string;
          city: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          user_id?: string | null;
          name: string;
          relationship: string;
          dob?: string | null;
          contact?: string | null;
          role: string;
          permission: string;
          verification?: string;
          city: string;
          notes?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["family_members"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      create_family_workspace: {
        Args: {
          family_name: string;
          family_city: string;
          family_language: string;
          family_priorities: string[];
          primary_member_name: string;
        };
        Returns: string;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
