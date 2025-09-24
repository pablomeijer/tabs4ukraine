// Ethicly API integration service
export interface EthiclyAd {
  ad_id: string;
  campaign_id: string;
  title: string;
  description: string;
  image_url: string;
  destination_url: string;
  tracking_urls: {
    impression: string;
    click: string;
  };
}

export interface EthiclyApiResponse {
  ads: EthiclyAd[];
}

export interface FallbackAd {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  organization: string;
  campaignId: string;
}

export interface TrackingEvent {
  event_type: 'impression' | 'click';
  ad_id: string;
  campaign_id: string;
  timestamp: string;
  metadata?: {
    country?: string;
    device?: string;
    user_agent?: string;
    referrer?: string;
  };
}

class EthiclyService {
  private readonly API_BASE = 'https://api.ethicly.com/v1';
  private readonly API_KEY = 'ethicly_sk_lhuoeznirc81jwovau57165clabk22j2'; // Replace with your actual API key
  
  // Fallback ads when API is unavailable
  private readonly fallbackAds: FallbackAd[] = [
    {
      id: 'fallback-1',
      title: 'Support Palestine Relief',
      description: 'Help provide emergency aid to families in Palestine',
      imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=150&fit=crop',
      link: 'https://www.unrwa.org/donate',
      organization: 'UNRWA',
      campaignId: 'fallback-campaign-1'
    },
    {
      id: 'fallback-2',
      title: 'Medical Aid for Gaza',
      description: 'Support medical missions and healthcare in Gaza',
      imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=150&fit=crop',
      link: 'https://www.palestinercs.org/en/donate',
      organization: 'Palestine Red Crescent',
      campaignId: 'fallback-campaign-2'
    },
    {
      id: 'fallback-3',
      title: 'Education for Palestinian Children',
      description: 'Help provide education and school supplies',
      imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=150&fit=crop',
      link: 'https://www.savethechildren.org/where-we-help/middle-east/palestine',
      organization: 'Save the Children',
      campaignId: 'fallback-campaign-3'
    }
  ];
  
  /**
   * Fetch ads from Ethicly API
   * @param count - Number of ads to return (default: 1)
   * @param country - User's country code (default: 'US')
   * @param device - Device type (default: 'desktop')
   * @param age - User's estimated age (optional)
   * @returns Promise<EthiclyApiResponse>
   */
  async getEthicAds(count: number = 1, country: string = 'US', device: string = 'desktop', age?: number): Promise<EthiclyApiResponse> {
    try {
      const url = new URL(`${this.API_BASE}/ads`);
      url.searchParams.append('count', count.toString());
      url.searchParams.append('country', country);
      url.searchParams.append('device', device);
      if (age) {
        url.searchParams.append('age', age.toString());
      }
      
      console.log('Ethicly API Request:', {
        url: url.toString(),
        headers: {
          'Authorization': `Bearer ${this.API_KEY.substring(0, 10)}...`,
          'Content-Type': 'application/json',
        }
      });
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Ethicly API Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ethicly API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('Ethicly API Data:', data);
      
      return {
        ads: data.ads || [],
      };
    } catch (error) {
      console.error('Error fetching Ethicly ads:', error);
      return {
        ads: [],
      };
    }
  }

  /**
   * Track ad impression using tracking URL from API response
   * @param trackingUrl - The impression tracking URL from the ad
   */
  async trackImpression(trackingUrl: string): Promise<void> {
    try {
      await fetch(trackingUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
        },
      });
    } catch (error) {
      console.error('Error tracking impression:', error);
    }
  }

  /**
   * Track ad click using tracking URL from API response
   * @param trackingUrl - The click tracking URL from the ad
   */
  async trackClick(trackingUrl: string): Promise<void> {
    try {
      await fetch(trackingUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
        },
      });
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  }

  /**
   * Send tracking event to Ethicly API (alternative method using POST /track)
   * @param event - The tracking event to send
   */
  async sendTrackingEvent(event: TrackingEvent): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE}/track`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error sending tracking event:', error);
      throw error;
    }
  }

  /**
   * Get user's country based on browser settings or IP
   * @returns Promise<string> - Country code
   */
  private async getUserCountry(): Promise<string> {
    try {
      // Try to get country from browser locale
      const locale = navigator.language || navigator.languages?.[0] || 'en-US';
      const countryCode = locale.split('-')[1]?.toUpperCase() || 'US';
      return countryCode;
    } catch (error) {
      console.error('Error getting user country:', error);
      return 'US'; // Default fallback
    }
  }

  /**
   * Get a random ad from Ethicly API
   * @returns Promise<EthiclyAd | null>
   */
  async getRandomAd(): Promise<EthiclyAd | null> {
    try {
      const country = await this.getUserCountry();
      const response = await this.getEthicAds(1, country, 'desktop');
      
      if (response.ads.length === 0) {
        console.warn('No ads available from Ethicly API, using fallback');
        return this.getRandomFallbackAd();
      }

      // Return the first ad (we requested count=1)
      return response.ads[0];
    } catch (error) {
      console.error('Error getting random ad, using fallback:', error);
      return this.getRandomFallbackAd();
    }
  }

  /**
   * Get a random fallback ad when API is unavailable
   * @returns EthiclyAd | null
   */
  private getRandomFallbackAd(): EthiclyAd | null {
    if (this.fallbackAds.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * this.fallbackAds.length);
    const fallbackAd = this.fallbackAds[randomIndex];
    
    // Convert FallbackAd to EthiclyAd format
    return {
      ad_id: fallbackAd.id,
      campaign_id: fallbackAd.campaignId,
      title: fallbackAd.title,
      description: fallbackAd.description,
      image_url: fallbackAd.imageUrl,
      destination_url: fallbackAd.link,
      tracking_urls: {
        impression: '', // No tracking for fallback ads
        click: ''
      }
    };
  }

  /**
   * Check if an ad is a fallback ad
   * @param adId - The ad ID to check
   * @returns boolean
   */
  isFallbackAd(adId: string): boolean {
    return adId.startsWith('fallback-');
  }

  /**
   * Track fallback ad interaction (no API call needed)
   * @param adId - The fallback ad ID
   * @param eventType - The type of event
   */
  async trackFallbackAdInteraction(adId: string, eventType: 'impression' | 'click'): Promise<void> {
    if (this.isFallbackAd(adId)) {
      console.log(`Fallback ad ${eventType} tracked for ad: ${adId}`);
      // For fallback ads, we just log the interaction
      // In a real implementation, you might want to store this locally or send to analytics
      return;
    }
  }

  /**
   * Legacy method for backward compatibility
   * @deprecated Use getRandomAd() instead
   */
  async getRandomLeaderboardAd(): Promise<EthiclyAd | null> {
    return this.getRandomAd();
  }
}

// Export singleton instance
export const ethiclyService = new EthiclyService();
export default ethiclyService;
