import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          phone: string | null
          company: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string | null
          phone?: string | null
          company?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          phone?: string | null
          company?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tickets: {
        Row: {
          id: string
          title: string
          description: string
          status: 'open' | 'in_progress' | 'resolved'
          priority: 'low' | 'medium' | 'high'
          category: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          status?: 'open' | 'in_progress' | 'resolved'
          priority?: 'low' | 'medium' | 'high'
          category: string
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          status?: 'open' | 'in_progress' | 'resolved'
          priority?: 'low' | 'medium' | 'high'
          category?: string
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      feedback: {
        Row: {
          id: string
          title: string
          message: string
          rating: number
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          message: string
          rating: number
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          message?: string
          rating?: number
          user_id?: string
          created_at?: string
        }
      }
    }
  }
}