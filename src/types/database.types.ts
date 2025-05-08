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
      users: {
        Row: {
          id: string
          username: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          extended_bio: string | null
          website: string | null
          social_links: Json | null
          portfolio: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          extended_bio?: string | null
          website?: string | null
          social_links?: Json | null
          portfolio?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          extended_bio?: string | null
          website?: string | null
          social_links?: Json | null
          portfolio?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      [key: string]: any
    }
  }
}