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
      posts: {
        Row: {
          id: string
          user_id: string
          content: string
          media_urls: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          media_urls?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          media_urls?: string[] | null
          created_at?: string
        }
      }
    }
  }
}