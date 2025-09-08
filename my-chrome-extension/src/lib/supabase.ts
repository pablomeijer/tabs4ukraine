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

// Donation tracking functions
export const donationTracker = {
  // Track a new tab open (works for both logged-in and anonymous users)
  async trackTabOpen(userId: string | null, adCount: number) {
    const donationAmount = (adCount * 3) / 1000; // $3 per 1000 tabs per ad
    
    // For anonymous users, we'll track with a temporary ID
    const trackingUserId = userId || `anonymous_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Insert tab open record
    const { data: tabData, error: tabError } = await supabase
      .from('tab_opens')
      .insert([{
        user_id: trackingUserId,
        ad_count: adCount,
        donation_amount: donationAmount,
        created_at: new Date().toISOString()
      }])
    
    if (tabError) {
      console.error('Error tracking tab open:', tabError)
      return { data: null, error: tabError }
    }

    // For logged-in users, update their profile
    if (userId) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('total_donations')
        .eq('id', userId)
        .single()

      if (profileError) {
        console.error('Error fetching profile:', profileError)
        return { data: null, error: profileError }
      }

      const newTotal = (profileData?.total_donations || 0) + donationAmount

      const { data: updateData, error: updateError } = await supabase
        .from('profiles')
        .update({ total_donations: newTotal })
        .eq('id', userId)

      if (updateError) {
        console.error('Error updating total donations:', updateError)
        return { data: null, error: updateError }
      }
    }

    return { data: { tabData }, error: null }
  },

  // Get total donations across all users (including anonymous and sponsored clicks)
  async getTotalDonations() {
    console.log('Getting total donations from database...');
    
    // Get donations from profiles table (logged-in users)
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('total_donations')
    
    console.log('Profile data:', { profileData, profileError });
    
    if (profileError) {
      console.error('Error fetching profile donations:', profileError)
      return { data: null, error: profileError }
    }

    // Get donations from tab_opens table (includes anonymous users)
    const { data: tabData, error: tabError } = await supabase
      .from('tab_opens')
      .select('donation_amount')
    
    console.log('Tab data:', { tabData, tabError });
    
    if (tabError) {
      console.error('Error fetching tab donations:', tabError)
      return { data: null, error: tabError }
    }

    // Get donations from sponsored_clicks table
    const { data: sponsoredData, error: sponsoredError } = await supabase
      .from('sponsored_clicks')
      .select('donation_amount')
    
    console.log('Sponsored data:', { sponsoredData, sponsoredError });
    
    if (sponsoredError) {
      console.error('Error fetching sponsored donations:', sponsoredError)
      return { data: null, error: sponsoredError }
    }

    // Calculate total from all sources
    const profileTotal = profileData?.reduce((sum, profile) => sum + (profile.total_donations || 0), 0) || 0
    const tabTotal = tabData?.reduce((sum, tab) => sum + tab.donation_amount, 0) || 0
    const sponsoredTotal = sponsoredData?.reduce((sum, click) => sum + click.donation_amount, 0) || 0
    
    // Use the sum of all sources
    const total = profileTotal + tabTotal + sponsoredTotal
    
    console.log('Calculated totals:', { profileTotal, tabTotal, sponsoredTotal, total });
    
    return { data: total, error: null }
  },

  // Get donation stats for a specific user
  async getUserDonationStats(userId: string) {
    const { data, error } = await supabase
      .from('tab_opens')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching user donation stats:', error)
      return { data: null, error }
    }

    const totalTabs = data?.length || 0
    const totalDonations = data?.reduce((sum, tab) => sum + tab.donation_amount, 0) || 0

    return { 
      data: { 
        totalTabs, 
        totalDonations, 
        recentTabs: data?.slice(0, 10) || [] 
      }, 
      error: null 
    }
  },

  // Subscribe to real-time donation updates
  subscribeToDonationUpdates(callback: (total: number) => void) {
    return supabase
      .channel('donation_updates')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'profiles' 
        }, 
        async () => {
          const { data } = await donationTracker.getTotalDonations()
          if (data !== null) {
            callback(data)
          }
        }
      )
      .subscribe()
  }
}

// Sponsored shortcuts tracking functions
export const sponsoredTracker = {
  // Track a sponsored shortcut click
  async trackSponsoredClick(userId: string | null, shortcutName: string, shortcutUrl: string) {
    const donationAmount = 0.50; // $0.50 per click
    
    // For anonymous users, we'll track with a temporary ID
    const trackingUserId = userId || `anonymous_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Check if user has reached the $5 limit TODAY
    const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD format
    const { data: userClicks, error: checkError } = await supabase
      .from('sponsored_clicks')
      .select('donation_amount')
      .eq('user_id', trackingUserId)
      .gte('created_at', `${today}T00:00:00.000Z`)
      .lt('created_at', `${today}T23:59:59.999Z`)
    
    if (checkError) {
      console.error('Error checking user clicks:', checkError)
      return { data: null, error: checkError }
    }

    const todayTotal = userClicks?.reduce((sum, click) => sum + click.donation_amount, 0) || 0
    if (todayTotal >= 5.00) {
      console.log('User has reached $5 daily limit for sponsored clicks')
      return { data: null, error: { message: 'Maximum $5 daily limit reached for sponsored clicks' } }
    }

    // Insert sponsored click record
    const { data: clickData, error: clickError } = await supabase
      .from('sponsored_clicks')
      .insert([{
        user_id: trackingUserId,
        shortcut_name: shortcutName,
        shortcut_url: shortcutUrl,
        donation_amount: donationAmount,
        created_at: new Date().toISOString()
      }])
    
    if (clickError) {
      console.error('Error tracking sponsored click:', clickError)
      return { data: null, error: clickError }
    }

    // For logged-in users, update their sponsored donations
    if (userId) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('sponsored_donations')
        .eq('id', userId)
        .single()

      if (profileError) {
        console.error('Error fetching profile:', profileError)
        return { data: null, error: profileError }
      }

      const newSponsoredTotal = (profileData?.sponsored_donations || 0) + donationAmount

      const { data: updateData, error: updateError } = await supabase
        .from('profiles')
        .update({ sponsored_donations: newSponsoredTotal })
        .eq('id', userId)

      if (updateError) {
        console.error('Error updating sponsored donations:', updateError)
        return { data: null, error: updateError }
      }
    }

    return { data: { clickData }, error: null }
  },

  // Get user's sponsored click stats
  async getUserSponsoredStats(userId: string) {
    const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD format
    
    // Get all-time stats
    const { data: allTimeData, error: allTimeError } = await supabase
      .from('sponsored_clicks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (allTimeError) {
      console.error('Error fetching user sponsored stats:', allTimeError)
      return { data: null, error: allTimeError }
    }

    // Get today's stats
    const { data: todayData, error: todayError } = await supabase
      .from('sponsored_clicks')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', `${today}T00:00:00.000Z`)
      .lt('created_at', `${today}T23:59:59.999Z`)
      .order('created_at', { ascending: false })
    
    if (todayError) {
      console.error('Error fetching today\'s sponsored stats:', todayError)
      return { data: null, error: todayError }
    }

    const allTimeClicks = allTimeData?.length || 0
    const allTimeDonations = allTimeData?.reduce((sum, click) => sum + click.donation_amount, 0) || 0
    
    const todayClicks = todayData?.length || 0
    const todayDonations = todayData?.reduce((sum, click) => sum + click.donation_amount, 0) || 0
    const remainingToday = Math.max(0, 5.00 - todayDonations)

    return { 
      data: { 
        allTime: {
          totalClicks: allTimeClicks, 
          totalDonations: allTimeDonations
        },
        today: {
          totalClicks: todayClicks,
          totalDonations: todayDonations,
          remainingLimit: remainingToday
        },
        recentClicks: allTimeData?.slice(0, 10) || [] 
      }, 
      error: null 
    }
  }
} 