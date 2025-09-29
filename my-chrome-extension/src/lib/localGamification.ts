// Local Gamification System using Chrome Storage
// This tracks user stats locally and syncs with your ads system

export interface UserStats {
  totalTabsOpened: number;
  totalSponsoredClicks: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  totalDonations: number;
  achievements: string[];
  level: number;
  experience: number;
  // Sync tracking
  lastSyncDate: string;
  pendingSyncData: {
    tabsSinceLastSync: number;
    clicksSinceLastSync: number;
    donationsSinceLastSync: number;
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (stats: UserStats) => boolean;
  reward: number; // experience points
}

// Achievement definitions
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_tab',
    name: 'First Tab',
    description: 'Opened your first tab',
    icon: '🎯',
    condition: (stats) => stats.totalTabsOpened >= 1,
    reward: 10
  },
  {
    id: 'tab_master_10',
    name: 'Tab Master',
    description: 'Opened 10 tabs',
    icon: '🔥',
    condition: (stats) => stats.totalTabsOpened >= 10,
    reward: 25
  },
  {
    id: 'tab_master_100',
    name: 'Tab Champion',
    description: 'Opened 100 tabs',
    icon: '👑',
    condition: (stats) => stats.totalTabsOpened >= 100,
    reward: 100
  },
  {
    id: 'first_click',
    name: 'Supporter',
    description: 'Clicked your first sponsored shortcut',
    icon: '🤝',
    condition: (stats) => stats.totalSponsoredClicks >= 1,
    reward: 15
  },
  {
    id: 'click_master',
    name: 'Click Master',
    description: 'Clicked 10 sponsored shortcuts',
    icon: '💪',
    condition: (stats) => stats.totalSponsoredClicks >= 10,
    reward: 50
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: '7-day streak',
    icon: '📅',
    condition: (stats) => stats.currentStreak >= 7,
    reward: 75
  },
  {
    id: 'streak_30',
    name: 'Month Master',
    description: '30-day streak',
    icon: '🗓️',
    condition: (stats) => stats.currentStreak >= 30,
    reward: 200
  },
  {
    id: 'donation_1',
    name: 'Dollar Donor',
    description: 'Contributed $1+ to Palestine',
    icon: '💵',
    condition: (stats) => stats.totalDonations >= 1,
    reward: 100
  },
  {
    id: 'donation_10',
    name: 'Generous Giver',
    description: 'Contributed $10+ to Palestine',
    icon: '💰',
    condition: (stats) => stats.totalDonations >= 10,
    reward: 300
  }
];

class LocalGamification {
  private static instance: LocalGamification;
  private stats: UserStats | null = null;
  private syncInProgress: boolean = false;

  static getInstance(): LocalGamification {
    if (!LocalGamification.instance) {
      LocalGamification.instance = new LocalGamification();
    }
    return LocalGamification.instance;
  }

  // Initialize user stats
  async initialize(): Promise<UserStats> {
    try {
      const result = await chrome.storage.local.get(['userStats']);
      const today = new Date().toISOString().split('T')[0];
      
      if (result.userStats) {
        this.stats = result.userStats;
        
        // Update streak if user was active yesterday
        if (this.stats.lastActiveDate === this.getYesterday()) {
          // Continue streak
        } else if (this.stats.lastActiveDate === today) {
          // Already active today
        } else {
          // Break streak
          this.stats.currentStreak = 0;
        }
        
        this.stats.lastActiveDate = today;
      } else {
        // Create new user stats
        this.stats = {
          totalTabsOpened: 0,
          totalSponsoredClicks: 0,
          currentStreak: 0,
          longestStreak: 0,
          lastActiveDate: today,
          totalDonations: 0,
          achievements: [],
          level: 1,
          experience: 0,
          lastSyncDate: today,
          pendingSyncData: {
            tabsSinceLastSync: 0,
            clicksSinceLastSync: 0,
            donationsSinceLastSync: 0
          }
        };
      }
      
      await this.saveStats();
      
      // Check if we should sync on startup
      await this.checkAndSyncIfNeeded();
      
      return this.stats;
    } catch (error) {
      console.error('Error initializing gamification:', error);
      throw error;
    }
  }

  // Track tab open
  async trackTabOpen(adCount: number = 1): Promise<UserStats> {
    if (!this.stats) {
      await this.initialize();
    }

    if (!this.stats) throw new Error('Failed to initialize stats');

    const donationAmount = (adCount * 3) / 1000; // $3 per 1000 tabs per ad
    const today = new Date().toISOString().split('T')[0];
    
    // Update stats
    this.stats.totalTabsOpened += 1;
    this.stats.totalDonations += donationAmount;
    this.stats.pendingSyncData.tabsSinceLastSync += 1;
    this.stats.pendingSyncData.donationsSinceLastSync += donationAmount;
    
    // Update streak
    if (this.stats.lastActiveDate === this.getYesterday()) {
      this.stats.currentStreak += 1;
      this.stats.longestStreak = Math.max(this.stats.longestStreak, this.stats.currentStreak);
    } else if (this.stats.lastActiveDate !== today) {
      this.stats.currentStreak = 1;
    }
    
    this.stats.lastActiveDate = today;
    
    // Check for new achievements
    await this.checkAchievements();
    
    await this.saveStats();
    
    // Check if we should sync after this action
    await this.checkAndSyncIfNeeded();
    
    return this.stats;
  }

  // Track sponsored click
  async trackSponsoredClick(): Promise<UserStats> {
    if (!this.stats) {
      await this.initialize();
    }

    if (!this.stats) throw new Error('Failed to initialize stats');

    const donationAmount = 0.50; // $0.50 per click
    
    // Update stats
    this.stats.totalSponsoredClicks += 1;
    this.stats.totalDonations += donationAmount;
    this.stats.pendingSyncData.clicksSinceLastSync += 1;
    this.stats.pendingSyncData.donationsSinceLastSync += donationAmount;
    
    // Check for new achievements
    await this.checkAchievements();
    
    await this.saveStats();
    
    // Check if we should sync after this action
    await this.checkAndSyncIfNeeded();
    
    return this.stats;
  }

  // Check for new achievements
  private async checkAchievements(): Promise<void> {
    if (!this.stats) return;

    const newAchievements: string[] = [];
    
    for (const achievement of ACHIEVEMENTS) {
      if (!this.stats.achievements.includes(achievement.id) && achievement.condition(this.stats)) {
        newAchievements.push(achievement.id);
        this.stats.experience += achievement.reward;
      }
    }
    
    if (newAchievements.length > 0) {
      this.stats.achievements.push(...newAchievements);
      
      // Update level based on experience
      this.stats.level = Math.floor(this.stats.experience / 100) + 1;
      
      // Show achievement notification
      this.showAchievementNotification(newAchievements);
    }
  }

  // Show achievement notification
  private showAchievementNotification(achievementIds: string[]): void {
    // This could trigger a UI notification
    console.log('🎉 New achievements unlocked:', achievementIds);
    
    // You could emit a custom event here for the UI to listen to
    window.dispatchEvent(new CustomEvent('achievementsUnlocked', {
      detail: { achievementIds }
    }));
  }

  // Get user stats
  async getStats(): Promise<UserStats | null> {
    if (!this.stats) {
      await this.initialize();
    }
    return this.stats;
  }

  // Get user level info
  getLevelInfo(experience: number) {
    const level = Math.floor(experience / 100) + 1;
    const currentLevelExp = (level - 1) * 100;
    const nextLevelExp = level * 100;
    const progress = ((experience - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100;
    
    return {
      level,
      experience,
      currentLevelExp,
      nextLevelExp,
      progress: Math.round(progress),
      expToNext: nextLevelExp - experience
    };
  }

  // Get achievement by ID
  getAchievement(id: string): Achievement | undefined {
    return ACHIEVEMENTS.find(achievement => achievement.id === id);
  }

  // Get all achievements with user progress
  getAchievementsWithProgress(): Array<Achievement & { unlocked: boolean; progress: number }> {
    if (!this.stats) return [];
    
    return ACHIEVEMENTS.map(achievement => {
      const unlocked = this.stats!.achievements.includes(achievement.id);
      let progress = 0;
      
      if (!unlocked) {
        // Calculate progress towards achievement
        if (achievement.id.includes('tab')) {
          const target = parseInt(achievement.id.match(/\d+/)?.[0] || '1');
          progress = Math.min(100, (this.stats!.totalTabsOpened / target) * 100);
        } else if (achievement.id.includes('click')) {
          const target = parseInt(achievement.id.match(/\d+/)?.[0] || '1');
          progress = Math.min(100, (this.stats!.totalSponsoredClicks / target) * 100);
        } else if (achievement.id.includes('streak')) {
          const target = parseInt(achievement.id.match(/\d+/)?.[0] || '1');
          progress = Math.min(100, (this.stats!.currentStreak / target) * 100);
        } else if (achievement.id.includes('donation')) {
          const target = parseInt(achievement.id.match(/\d+/)?.[0] || '1');
          progress = Math.min(100, (this.stats!.totalDonations / target) * 100);
        }
      } else {
        progress = 100;
      }
      
      return { ...achievement, unlocked, progress: Math.round(progress) };
    });
  }

  // Save stats to Chrome storage
  private async saveStats(): Promise<void> {
    if (!this.stats) return;
    
    try {
      await chrome.storage.local.set({ userStats: this.stats });
    } catch (error) {
      console.error('Error saving user stats:', error);
    }
  }

  // Helper methods
  private getYesterday(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  }

  // Check if we should sync and sync if needed
  private async checkAndSyncIfNeeded(): Promise<void> {
    if (!this.stats || this.syncInProgress) return;

    const shouldSync = this.shouldSync();
    if (shouldSync) {
      await this.syncWithAdsSystem();
    }
  }

  // Determine if we should sync
  private shouldSync(): boolean {
    if (!this.stats) return false;

    const now = new Date();
    const lastSync = new Date(this.stats.lastSyncDate);
    const hoursSinceLastSync = (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60);
    
    // Sync triggers:
    // 1. Time-based: Every 4 hours
    if (hoursSinceLastSync >= 4) return true;
    
    // 2. Action-based: Every 50 tab opens or 10 clicks
    if (this.stats.pendingSyncData.tabsSinceLastSync >= 50) return true;
    if (this.stats.pendingSyncData.clicksSinceLastSync >= 10) return true;
    
    // 3. Donation-based: Every $1 in pending donations
    if (this.stats.pendingSyncData.donationsSinceLastSync >= 1) return true;
    
    return false;
  }

  // Sync with your ads system
  async syncWithAdsSystem(): Promise<void> {
    if (!this.stats || this.syncInProgress) return;

    this.syncInProgress = true;
    
    try {
      console.log('🔄 Syncing user stats with ads system...');
      
      // Prepare sync data (aggregated, not individual events)
      const syncData = {
        totalTabsOpened: this.stats.totalTabsOpened,
        totalSponsoredClicks: this.stats.totalSponsoredClicks,
        totalDonations: this.stats.totalDonations,
        currentStreak: this.stats.currentStreak,
        longestStreak: this.stats.longestStreak,
        level: this.stats.level,
        experience: this.stats.experience,
        achievements: this.stats.achievements,
        lastActiveDate: this.stats.lastActiveDate,
        syncTimestamp: new Date().toISOString()
      };

      // Here you would integrate with your ads Supabase system
      // Example: await supabaseAdsService.updateUserStats(syncData);
      
      // For now, we'll just log the sync data
      console.log('📊 Sync data:', syncData);
      
      // Update last sync date and reset pending data
      this.stats.lastSyncDate = new Date().toISOString().split('T')[0];
      this.stats.pendingSyncData = {
        tabsSinceLastSync: 0,
        clicksSinceLastSync: 0,
        donationsSinceLastSync: 0
      };
      
      await this.saveStats();
      
      console.log('✅ Sync completed successfully');
      
    } catch (error) {
      console.error('❌ Error syncing with ads system:', error);
      // Don't throw - we want local tracking to continue even if sync fails
    } finally {
      this.syncInProgress = false;
    }
  }

  // Manual sync (triggered by user action)
  async manualSync(): Promise<void> {
    if (!this.stats) return;
    
    console.log('🔄 Manual sync triggered');
    await this.syncWithAdsSystem();
  }

  // Get sync status
  getSyncStatus(): { lastSync: string; pendingActions: number; nextSyncIn: string } {
    if (!this.stats) {
      return { lastSync: 'Never', pendingActions: 0, nextSyncIn: 'Unknown' };
    }

    const now = new Date();
    const lastSync = new Date(this.stats.lastSyncDate);
    const hoursSinceLastSync = (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60);
    const nextSyncIn = Math.max(0, 4 - hoursSinceLastSync);
    
    const pendingActions = this.stats.pendingSyncData.tabsSinceLastSync + 
                          this.stats.pendingSyncData.clicksSinceLastSync;
    
    return {
      lastSync: this.stats.lastSyncDate,
      pendingActions,
      nextSyncIn: `${nextSyncIn.toFixed(1)} hours`
    };
  }
}

export const localGamification = LocalGamification.getInstance();
export default localGamification;
