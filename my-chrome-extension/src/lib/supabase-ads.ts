import { supabase } from './supabase'

export interface SupabaseAd {
  id: number
  name: string
  title: string
  description: string
  logo_url: string
  destination_url: string
  status: string
  type: string
  width: number
  height: number
  impressions: number
  clicks: number
  created_at: string
  updated_at: string
  campaign_id: number
  user_id: string
}

export interface ExtensionAd {
  id: string
  title: string
  description: string
  imageUrl: string
  link: string
  organization: string
}

class SupabaseAdsService {
  private ads: SupabaseAd[] = []
  private lastFetch: number = 0
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  async fetchAds(): Promise<SupabaseAd[]> {
    try {
      console.log('🔍 Fetching approved ads from Supabase for tabs4ukraine...')
      
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error fetching ads:', error)
        throw error
      }

      console.log('✅ Fetched ads:', data?.length || 0, 'ads')
      console.log('📋 Ads data:', data)
      
      this.ads = data || []
      this.lastFetch = Date.now()
      
      return this.ads
    } catch (error) {
      console.error('❌ Failed to fetch ads:', error)
      return []
    }
  }

  async getRandomAd(format?: string): Promise<SupabaseAd | null> {
    try {
      // Check if we need to refresh the cache
      if (this.ads.length === 0 || Date.now() - this.lastFetch > this.CACHE_DURATION) {
        await this.fetchAds()
      }

      if (this.ads.length === 0) {
        console.log('⚠️ No approved ads available')
        return null
      }

      // Filter by format if specified
      let filteredAds = this.ads
      if (format) {
        filteredAds = this.ads.filter(ad => ad.type === format)
        console.log(`🔍 Filtered ads for format "${format}":`, filteredAds.length)
      }

      if (filteredAds.length === 0) {
        console.log(`⚠️ No ads available for format "${format}", using any approved ad`)
        filteredAds = this.ads
      }

      // Get random ad
      const randomIndex = Math.floor(Math.random() * filteredAds.length)
      const selectedAd = filteredAds[randomIndex]
      
      console.log('🎯 Selected random ad:', selectedAd)
      return selectedAd
    } catch (error) {
      console.error('❌ Error getting random ad:', error)
      return null
    }
  }

  convertToExtensionAd(supabaseAd: SupabaseAd): ExtensionAd {
    return {
      id: supabaseAd.id.toString(),
      title: supabaseAd.title || supabaseAd.name || 'Ad',
      description: supabaseAd.description || 'Click to learn more',
      imageUrl: supabaseAd.logo_url,
      link: supabaseAd.destination_url,
      organization: 'Ethicly'
    }
  }

  async trackImpressions(adIds: number[]): Promise<void> {
    try {
      console.log('📊 Tracking impressions for ads:', adIds)
      
      for (const adId of adIds) {
        const { error } = await supabase.rpc('increment', {
          table_name: 'ads',
          column_name: 'impressions',
          x: 1,
          row_id: adId
        })

        if (error) {
          console.error(`❌ Error tracking impression for ad ${adId}:`, error)
        } else {
          console.log(`✅ Tracked impression for ad ${adId}`)
        }
      }
    } catch (error) {
      console.error('❌ Error tracking impressions:', error)
    }
  }

  async trackClick(adId: number): Promise<void> {
    try {
      console.log('🖱️ Tracking click for ad:', adId)
      
      const { error } = await supabase.rpc('increment', {
        table_name: 'ads',
        column_name: 'clicks',
        x: 1,
        row_id: adId
      })

      if (error) {
        console.error(`❌ Error tracking click for ad ${adId}:`, error)
      } else {
        console.log(`✅ Tracked click for ad ${adId}`)
      }
    } catch (error) {
      console.error('❌ Error tracking click:', error)
    }
  }

  async getTotalMoneyRaised(): Promise<number> {
    try {
      console.log('💰 Calculating total money raised from impressions...')
      
      const { data, error } = await supabase
        .from('ads')
        .select('impressions, clicks')
        .eq('status', 'approved')

      if (error) {
        console.error('❌ Error fetching ads for money calculation:', error)
        return 0
      }

      // Calculate total based on impressions and clicks
      // Assuming $0.01 per impression and $0.50 per click
      const totalImpressions = data?.reduce((sum, ad) => sum + (ad.impressions || 0), 0) || 0
      const totalClicks = data?.reduce((sum, ad) => sum + (ad.clicks || 0), 0) || 0
      
      const totalMoney = (totalImpressions * 0.01) + (totalClicks * 0.50)
      
      console.log('💰 Total money raised:', totalMoney, '(impressions:', totalImpressions, ', clicks:', totalClicks, ')')
      
      return totalMoney
    } catch (error) {
      console.error('❌ Error calculating total money raised:', error)
      return 0
    }
  }

  // Get all approved ads (for debugging)
  async getAllApprovedAds(): Promise<SupabaseAd[]> {
    return await this.fetchAds()
  }
}

export const supabaseAdsService = new SupabaseAdsService()
