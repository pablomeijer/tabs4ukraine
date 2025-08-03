import { createClient } from '@supabase/supabase-js'

// You'll need to replace these with your actual Supabase credentials
const supabaseUrl = 'https://eqbigueupbqolamgjdpz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxYmlndWV1cGJxb2xhbWdqZHB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4Njg3NDgsImV4cCI6MjA2OTQ0NDc0OH0.R2HxFPv49Pu-0EdnCpzOccOD4LgAnBgGqER9dTIbqcc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// User types
export interface User {
  id: string
  email: string
  username?: string
  created_at: string
  ad_count: number
  total_donations: number
}

// Auth helper functions
export const auth = {
  // Sign up with email and password
  async signUp(email: string, password: string, username?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username || email.split('@')[0]
        }
      }
    })
    return { data, error }
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// User profile functions
export const userProfile = {
  // Get user profile
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  // Update user profile
  async updateProfile(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
    return { data, error }
  },

  // Create user profile
  async createProfile(userId: string, email: string, username?: string) {
    const profileData = {
      id: userId,
      email,
      username: username || email.split('@')[0],
      ad_count: 1,
      total_donations: 0
    }
    
    console.log('Attempting to create profile with data:', profileData)
    
    const { data, error } = await supabase
      .from('profiles')
      .insert([profileData])
    
    console.log('Supabase insert result:', { data, error })
    
    return { data, error }
  }
} 