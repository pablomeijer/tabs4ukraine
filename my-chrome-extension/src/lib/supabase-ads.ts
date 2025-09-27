// Supabase Ads API service
import { supabase } from './supabase';

export interface SupabaseAd {
  id: number;
  logo_url: string;
  destination_url: string;
  title?: string;
  description?: string;
  created_at?: string;
}

export class SupabaseAdsService {
  private readonly RPC_URL = "https://fvmpnqaoympgmrullemj.supabase.co/rest/v1/rpc/increment_impressions";
  private readonly CLICKS_RPC_URL = "https://fvmpnqaoympgmrullemj.supabase.co/rest/v1/rpc/increment_clicks";
  private readonly API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2bXBucWFveW1wZ21ydWxsZW1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4OTY5NjYsImV4cCI6MjA3NDQ3Mjk2Nn0.6gAhop5FNlHR7-3adPfeLF4QxoOn3rlRROC6GaXJigs";

  /**
   * Fetch ads from Supabase
   * @returns Promise<SupabaseAd[]>
   */
  async fetchAds(): Promise<SupabaseAd[]> {
    try {
      console.log('Fetching ads from Supabase using client...');
      
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .limit(10);

      if (error) {
        console.error('Supabase client error:', error);
        throw error;
      }

      console.log('Supabase ads fetched:', data);
      console.log('Number of ads:', data?.length || 0);
      
      return data || [];
    } catch (error) {
      console.error('Error fetching ads from Supabase:', error);
      return [];
    }
  }

  /**
   * Track clicks for ads
   * @param adId - Ad ID to track click for
   */
  async trackClick(adId: number): Promise<void> {
    try {
      console.log('🖱️ Tracking click for ad ID:', adId);
      console.log('🔍 Clicks RPC URL:', this.CLICKS_RPC_URL);

      const response = await fetch(this.CLICKS_RPC_URL, {
        method: "POST",
        headers: {
          "apikey": this.API_KEY,
          "Authorization": `Bearer ${this.API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ad_id: adId })
      });

      console.log('🔍 Click response status:', response.status);
      console.log('🔍 Click response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error tracking click:', errorText);
        console.error('❌ Click response status:', response.status);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const responseText = await response.text();
      console.log('✅ Click tracked successfully for ad:', adId);
      console.log('✅ Click response:', responseText);
    } catch (error) {
      console.error('❌ Error tracking click:', error);
      // Don't throw error to avoid breaking the ad click
    }
  }

  /**
   * Track impressions for displayed ads
   * @param adIds - Array of ad IDs to track impressions for
   */
  async trackImpressions(adIds: number[]): Promise<void> {
    try {
      if (adIds.length === 0) {
        console.log('No ad IDs to track impressions for');
        return;
      }

      console.log('🔍 Tracking impressions for ad IDs:', adIds);
      console.log('🔍 RPC URL:', this.RPC_URL);
      console.log('🔍 Request body:', JSON.stringify({ ad_ids: adIds }));

      const response = await fetch(this.RPC_URL, {
        method: "POST",
        headers: {
          "apikey": this.API_KEY,
          "Authorization": `Bearer ${this.API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ad_ids: adIds })
      });

      console.log('🔍 Response status:', response.status);
      console.log('🔍 Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error tracking impressions:', errorText);
        console.error('❌ Response status:', response.status);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const responseText = await response.text();
      console.log('✅ Impressions tracked successfully for ads:', adIds);
      console.log('✅ Response:', responseText);
    } catch (error) {
      console.error('❌ Error tracking impressions:', error);
      // Don't throw error to avoid breaking the ad display
    }
  }

  /**
   * Get a random ad from Supabase
   * @returns Promise<SupabaseAd | null>
   */
  async getRandomAd(): Promise<SupabaseAd | null> {
    try {
      const ads = await this.fetchAds();
      
      if (ads.length === 0) {
        console.warn('No ads available from Supabase');
        return null;
      }

      const randomIndex = Math.floor(Math.random() * ads.length);
      const selectedAd = ads[randomIndex];
      
      console.log('Selected random ad from Supabase:', selectedAd);
      return selectedAd;
    } catch (error) {
      console.error('Error getting random ad from Supabase:', error);
      return null;
    }
  }

  /**
   * Convert Supabase ad to extension ad format
   * @param supabaseAd - The Supabase ad
   * @returns Extension ad format
   */
  convertToExtensionAd(supabaseAd: SupabaseAd) {
    return {
      id: `supabase-${supabaseAd.id}`,
      title: supabaseAd.title || 'Advertisement',
      description: supabaseAd.description || 'Click to learn more',
      imageUrl: supabaseAd.logo_url,
      link: supabaseAd.destination_url,
      organization: 'Sponsored',
      campaignId: `supabase-campaign-${supabaseAd.id}`
    };
  }
}

// Export singleton instance
export const supabaseAdsService = new SupabaseAdsService();
export default supabaseAdsService;
