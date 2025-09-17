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
          email: string
          full_name: string | null
          business_name: string | null
          business_type: 'personal_trainer' | 'gym' | 'physiotherapy' | 'yoga_studio' | 'nutrition' | 'other'
          phone: string | null
          location: string | null
          website: string | null
          avatar_url: string | null
          subscription_plan: 'free' | 'starter' | 'professional' | 'enterprise'
          subscription_status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          business_name?: string | null
          business_type: 'personal_trainer' | 'gym' | 'physiotherapy' | 'yoga_studio' | 'nutrition' | 'other'
          phone?: string | null
          location?: string | null
          website?: string | null
          avatar_url?: string | null
          subscription_plan?: 'free' | 'starter' | 'professional' | 'enterprise'
          subscription_status?: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          business_name?: string | null
          business_type?: 'personal_trainer' | 'gym' | 'physiotherapy' | 'yoga_studio' | 'nutrition' | 'other'
          phone?: string | null
          location?: string | null
          website?: string | null
          avatar_url?: string | null
          subscription_plan?: 'free' | 'starter' | 'professional' | 'enterprise'
          subscription_status?: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid'
          created_at?: string
          updated_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          user_id: string
          email: string
          full_name: string
          phone: string | null
          age: number | null
          gender: 'male' | 'female' | 'other' | null
          location: string | null
          fitness_goals: string[] | null
          current_activity_level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active' | null
          previous_gym_experience: boolean | null
          preferred_workout_types: string[] | null
          health_conditions: string[] | null
          budget_range: string | null
          preferred_contact_method: 'email' | 'phone' | 'text' | null
          preferred_workout_times: string[] | null
          lead_source: string | null
          campaign_id: string | null
          score: number | null
          status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
          notes: string | null
          contacted_at: string | null
          converted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email: string
          full_name: string
          phone?: string | null
          age?: number | null
          gender?: 'male' | 'female' | 'other' | null
          location?: string | null
          fitness_goals?: string[] | null
          current_activity_level?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active' | null
          previous_gym_experience?: boolean | null
          preferred_workout_types?: string[] | null
          health_conditions?: string[] | null
          budget_range?: string | null
          preferred_contact_method?: 'email' | 'phone' | 'text' | null
          preferred_workout_times?: string[] | null
          lead_source?: string | null
          campaign_id?: string | null
          score?: number | null
          status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
          notes?: string | null
          contacted_at?: string | null
          converted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email?: string
          full_name?: string
          phone?: string | null
          age?: number | null
          gender?: 'male' | 'female' | 'other' | null
          location?: string | null
          fitness_goals?: string[] | null
          current_activity_level?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active' | null
          previous_gym_experience?: boolean | null
          preferred_workout_types?: string[] | null
          health_conditions?: string[] | null
          budget_range?: string | null
          preferred_contact_method?: 'email' | 'phone' | 'text' | null
          preferred_workout_times?: string[] | null
          lead_source?: string | null
          campaign_id?: string | null
          score?: number | null
          status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
          notes?: string | null
          contacted_at?: string | null
          converted_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      lead_activities: {
        Row: {
          id: string
          lead_id: string
          activity_type: 'email_opened' | 'email_clicked' | 'website_visit' | 'form_submitted' | 'called' | 'meeting_scheduled' | 'note_added'
          description: string
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          activity_type: 'email_opened' | 'email_clicked' | 'website_visit' | 'form_submitted' | 'called' | 'meeting_scheduled' | 'note_added'
          description: string
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          activity_type?: 'email_opened' | 'email_clicked' | 'website_visit' | 'form_submitted' | 'called' | 'meeting_scheduled' | 'note_added'
          description?: string
          metadata?: Json | null
          created_at?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          type: 'email' | 'sms' | 'social' | 'referral'
          status: 'draft' | 'active' | 'paused' | 'completed'
          target_audience: Json | null
          settings: Json | null
          stats: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          type: 'email' | 'sms' | 'social' | 'referral'
          status?: 'draft' | 'active' | 'paused' | 'completed'
          target_audience?: Json | null
          settings?: Json | null
          stats?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          type?: 'email' | 'sms' | 'social' | 'referral'
          status?: 'draft' | 'active' | 'paused' | 'completed'
          target_audience?: Json | null
          settings?: Json | null
          stats?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      integrations: {
        Row: {
          id: string
          user_id: string
          provider: 'myfitnesspal' | 'strava' | 'trainerize' | 'mindbody' | 'webhook'
          status: 'connected' | 'disconnected' | 'error'
          credentials: Json | null
          settings: Json | null
          last_sync: string | null
          error_message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          provider: 'myfitnesspal' | 'strava' | 'trainerize' | 'mindbody' | 'webhook'
          status?: 'connected' | 'disconnected' | 'error'
          credentials?: Json | null
          settings?: Json | null
          last_sync?: string | null
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          provider?: 'myfitnesspal' | 'strava' | 'trainerize' | 'mindbody' | 'webhook'
          status?: 'connected' | 'disconnected' | 'error'
          credentials?: Json | null
          settings?: Json | null
          last_sync?: string | null
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      analytics: {
        Row: {
          id: string
          user_id: string
          date: string
          metric_type: 'leads_generated' | 'leads_converted' | 'revenue' | 'campaign_performance'
          value: number
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          metric_type: 'leads_generated' | 'leads_converted' | 'revenue' | 'campaign_performance'
          value: number
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          metric_type?: 'leads_generated' | 'leads_converted' | 'revenue' | 'campaign_performance'
          value?: number
          metadata?: Json | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_lead_score: {
        Args: {
          lead_id: string
        }
        Returns: number
      }
    }
    Enums: {
      business_type: 'personal_trainer' | 'gym' | 'physiotherapy' | 'yoga_studio' | 'nutrition' | 'other'
      subscription_plan: 'free' | 'starter' | 'professional' | 'enterprise'
      subscription_status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid'
      activity_level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active'
      lead_status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
      campaign_type: 'email' | 'sms' | 'social' | 'referral'
      integration_provider: 'myfitnesspal' | 'strava' | 'trainerize' | 'mindbody' | 'webhook'
    }
  }
}