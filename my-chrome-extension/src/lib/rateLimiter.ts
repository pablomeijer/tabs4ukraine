// Rate limiter to prevent abuse/spam
// Tracks clicks in local storage to prevent rapid repeated clicks

export interface RateLimitConfig {
  maxClicks: number;
  timeWindow: number; // in milliseconds
  actionType: 'sponsored' | 'ad_click' | 'ad_impression' | 'tab_open';
}

interface StoredData {
  clicks: number[];
}

class RateLimiter {
  // Check if action is allowed
  async isAllowed(config: RateLimitConfig): Promise<boolean> {
    const storageKey = `rate_limit_${config.actionType}`;
    const now = Date.now();

    try {
      const result = await new Promise<any>((resolve) => {
        chrome.storage.local.get([storageKey], resolve);
      });
      const stored: StoredData | undefined = result[storageKey] as StoredData | undefined;

      if (!stored || !stored.clicks || !Array.isArray(stored.clicks)) {
        return true; // No previous clicks, allowed
      }

      // Filter out clicks outside the time window
      const recentClicks = stored.clicks.filter(
        (timestamp: number) => (now - timestamp) < config.timeWindow
      );

      // Check if under limit
      if (recentClicks.length < config.maxClicks) {
        // Update stored clicks
        await chrome.storage.local.set({
          [storageKey]: { clicks: recentClicks }
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Rate limiter error:', error);
      // Allow action on error to not break functionality
      return true;
    }
  }

  // Record an action
  async recordAction(config: RateLimitConfig): Promise<void> {
    const storageKey = `rate_limit_${config.actionType}`;
    const now = Date.now();

    try {
      const result = await new Promise<any>((resolve) => {
        chrome.storage.local.get([storageKey], resolve);
      });
      const stored: StoredData | undefined = result[storageKey] as StoredData | undefined;

      const clicks = stored?.clicks || [];
      
      // Add current timestamp
      clicks.push(now);

      // Keep only clicks within the time window
      const recentClicks = clicks.filter(
        (timestamp: number) => (now - timestamp) < config.timeWindow
      );

      // Store updated clicks
      await chrome.storage.local.set({
        [storageKey]: { clicks: recentClicks }
      });
    } catch (error) {
      console.error('Rate limiter record error:', error);
    }
  }

  // Check and record in one operation
  async checkAndRecord(config: RateLimitConfig): Promise<boolean> {
    const allowed = await this.isAllowed(config);
    
    if (allowed) {
      await this.recordAction(config);
    }
    
    return allowed;
  }

  // Clear all rate limit data (for testing)
  async clearAll(): Promise<void> {
    await chrome.storage.local.set({
      'rate_limit_sponsored': { clicks: [] },
      'rate_limit_ad_click': { clicks: [] },
      'rate_limit_ad_impression': { clicks: [] },
      'rate_limit_tab_open': { clicks: [] }
    });
  }
}

export const rateLimiter = new RateLimiter();

// Pre-configured limits
export const RATE_LIMITS = {
  // Sponsored shortcuts: max 10 clicks per 24 hours
  SPONSORED: {
    maxClicks: 10,
    timeWindow: 24 * 60 * 60 * 1000, // 24 hours
    actionType: 'sponsored' as const
  },
  
  // Ad clicks: max 30 clicks per hour
  AD_CLICK: {
    maxClicks: 30,
    timeWindow: 60 * 60 * 1000, // 1 hour
    actionType: 'ad_click' as const
  },
  
  // Ad impressions: max 100 per hour
  AD_IMPRESSION: {
    maxClicks: 100,
    timeWindow: 60 * 60 * 1000, // 1 hour
    actionType: 'ad_impression' as const
  },
  
  // Tab opens: max 50 per hour
  TAB_OPEN: {
    maxClicks: 50,
    timeWindow: 60 * 60 * 1000, // 1 hour
    actionType: 'tab_open' as const
  }
};

