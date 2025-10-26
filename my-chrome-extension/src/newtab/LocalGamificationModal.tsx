import React, { useState, useEffect } from 'react';
import localGamification, { UserStats } from '../lib/localGamification';
import { sponsoredTracker } from '../lib/supabase';
import './LocalGamificationModal.css';

interface LocalGamificationModalProps {
  open: boolean;
  onClose: () => void;
  refreshTrigger?: number;
}

export default function LocalGamificationModal({ open, onClose, refreshTrigger }: LocalGamificationModalProps) {
  const [activeTab, setActiveTab] = useState('stats');
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [syncStatus, setSyncStatus] = useState<any>(null);
  const [shortcutStats, setShortcutStats] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      loadUserStats();
      loadShortcutStats();
    }
  }, [open, refreshTrigger]);
  
  const loadShortcutStats = async () => {
    try {
      const { data, error } = await sponsoredTracker.getShortcutStats();
      if (!error && data) {
        setShortcutStats(data);
      }
    } catch (error) {
      console.error('Error loading shortcut stats:', error);
    }
  };

  const loadUserStats = async () => {
    try {
      const stats = await localGamification.getStats();
      setUserStats(stats);
      
      if (stats) {
        const achievementsWithProgress = localGamification.getAchievementsWithProgress();
        setAchievements(achievementsWithProgress);
      }
      
      // Load sync status
      const status = localGamification.getSyncStatus();
      setSyncStatus(status);
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const handleManualSync = async () => {
    try {
      await localGamification.manualSync();
      await loadUserStats(); // Refresh stats after sync
    } catch (error) {
      console.error('Error syncing:', error);
    }
  };

  const getLevelInfo = (stats: UserStats) => {
    return localGamification.getLevelInfo(stats.experience);
  };

  if (!open) return null;

  return (
    <div className="gamification-modal-overlay" onClick={onClose}>
      <div className="gamification-modal" onClick={e => e.stopPropagation()}>
        <button className="gamification-close" onClick={onClose}>×</button>
        
        <div className="gamification-header">
          <h2>🎮 Your Progress</h2>
          <div className="gamification-tabs">
            {['stats', 'achievements', 'shortcuts'].map(tab => (
              <button
                key={tab}
                className={`gamification-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="gamification-content">
          {activeTab === 'stats' && userStats && (
            <div className="stats-section">
              <div className="user-level-card">
                <div className="level-info">
                  <div className="level-number">Level {userStats.level}</div>
                  <div className="level-progress">
                    {(() => {
                      const levelInfo = getLevelInfo(userStats);
                      return `${levelInfo.progress}% to Level ${userStats.level + 1}`;
                    })()}
                  </div>
                </div>
                <div className="experience-bar">
                  <div 
                    className="experience-fill" 
                    style={{ 
                      width: `${getLevelInfo(userStats).progress}%` 
                    }}
                  ></div>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📊</div>
                  <div className="stat-info">
                    <div className="stat-value">{userStats.totalTabsOpened}</div>
                    <div className="stat-label">Tabs Opened</div>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">🤝</div>
                  <div className="stat-info">
                    <div className="stat-value">{userStats.totalSponsoredClicks}</div>
                    <div className="stat-label">Sponsored Clicks</div>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-info">
                    <div className="stat-value">${userStats.totalDonations.toFixed(2)}</div>
                    <div className="stat-label">Total Contributed</div>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">🔥</div>
                  <div className="stat-info">
                    <div className="stat-value">{userStats.currentStreak}</div>
                    <div className="stat-label">Current Streak</div>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">⭐</div>
                  <div className="stat-info">
                    <div className="stat-value">{userStats.longestStreak}</div>
                    <div className="stat-label">Longest Streak</div>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">🏆</div>
                  <div className="stat-info">
                    <div className="stat-value">{userStats.achievements.length}</div>
                    <div className="stat-label">Achievements</div>
                  </div>
                </div>
              </div>

              <div className="contribution-message">
                <h4>Thank you for supporting Ukraine! 🇺🇦</h4>
                <p>
                  Your daily use of this extension is making a real difference. 
                  Every tab you open and every sponsored link you click contributes 
                  to Ukrainian relief efforts.
                </p>
              </div>

              {syncStatus && (
                <div className="sync-status">
                  <h4>🔄 Sync Status</h4>
                  <div className="sync-info">
                    <div className="sync-item">
                      <span className="sync-label">Last Sync:</span>
                      <span className="sync-value">{syncStatus.lastSync}</span>
                    </div>
                    <div className="sync-item">
                      <span className="sync-label">Pending Actions:</span>
                      <span className="sync-value">{syncStatus.pendingActions}</span>
                    </div>
                    <div className="sync-item">
                      <span className="sync-label">Next Sync In:</span>
                      <span className="sync-value">{syncStatus.nextSyncIn}</span>
                    </div>
                  </div>
                  <button 
                    className="manual-sync-btn"
                    onClick={handleManualSync}
                  >
                    🔄 Sync Now
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="achievements-section">
              <h3>🏅 Achievements</h3>
              <div className="achievements-grid">
                {achievements.map(achievement => {
                  const isEarned = achievement.unlocked || achievement.progress >= 100;
                  
                  return (
                    <div key={achievement.id} className={`achievement-card ${isEarned ? 'earned' : 'unearned'}`}>
                      <div className="achievement-icon">
                        {achievement.icon}
                      </div>
                      <div className="achievement-info">
                        <div className="achievement-name">{achievement.name}</div>
                        <div className="achievement-description">{achievement.description}</div>
                        {!isEarned && (
                        <div className="achievement-progress">
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ width: `${achievement.progress}%` }}
                            ></div>
                          </div>
                          <div className="progress-text">{achievement.progress}%</div>
                        </div>
                      )}
                      {isEarned && (
                        <div className="achievement-reward">+{achievement.reward} XP</div>
                      )}
                    </div>
                    {isEarned && (
                      <div className="achievement-badge">✓</div>
                    )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'shortcuts' && (
            <div className="shortcuts-section">
              <h3>🔗 Shortcut Performance</h3>
              <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
                See which sponsored shortcuts are getting the most clicks and generating the most donations
              </p>
              <div className="shortcuts-list">
                {shortcutStats.length > 0 ? (
                  shortcutStats.map((shortcut, index) => (
                    <div key={shortcut.url} className="shortcut-stat-item">
                      <div className="shortcut-rank">#{index + 1}</div>
                      <div className="shortcut-info">
                        <div className="shortcut-name">{shortcut.name}</div>
                        <div className="shortcut-url">{shortcut.url}</div>
                      </div>
                      <div className="shortcut-stats">
                        <div className="shortcut-stat">
                          <div className="stat-value">{shortcut.clicks}</div>
                          <div className="stat-label">Clicks</div>
                        </div>
                        <div className="shortcut-stat">
                          <div className="stat-value">${shortcut.donations.toFixed(2)}</div>
                          <div className="stat-label">Raised</div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
                    No shortcut statistics available yet
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
