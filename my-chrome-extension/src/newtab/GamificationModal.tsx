import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  username: string;
  total_raised: number;
  rank: number;
  tier: string;
  daily_streak: number;
  invite_code: string;
}

interface Achievement {
  id: number;
  badge_type: string;
  badge_name: string;
  badge_description: string;
  earned_at: string;
}

interface CommunityStats {
  total_users: number;
  total_raised: number;
  monthly_raised: number;
  total_tabs_opened: number;
}

interface GamificationModalProps {
  open: boolean;
  onClose: () => void;
  currentUser: User | null;
  refreshTrigger?: number; // Add this to trigger refresh when it changes
}

const TIER_INFO = {
  beginner: { name: '🌱 Beginner', color: '#8B4513', threshold: 0 },
  supporter: { name: '🌿 Supporter', color: '#228B22', threshold: 1 },
  advocate: { name: '🌳 Advocate', color: '#32CD32', threshold: 10 },
  champion: { name: '🕊️ Champion', color: '#FFD700', threshold: 100 }
};

const BADGE_ICONS = {
  'first_dollar': '💰',
  'hundred_tabs': '📊',
  'daily_streak_7': '🔥',
  'daily_streak_30': '⭐',
  'ten_dollars': '💎',
  'hundred_dollars': '👑',
  'friend_inviter': '🦋',
  'community_builder': '🏗️'
};

export default function GamificationModal({ open, onClose, currentUser, refreshTrigger }: GamificationModalProps) {
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [friendsLeaderboard, setFriendsLeaderboard] = useState<User[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [communityStats, setCommunityStats] = useState<CommunityStats | null>(null);
  const [friends, setFriends] = useState<User[]>([]);
  const [pendingFriends, setPendingFriends] = useState<User[]>([]);
  const [showFriendsOnly, setShowFriendsOnly] = useState(false);
  const [friendCode, setFriendCode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && currentUser) {
      loadLeaderboard();
      loadAchievements();
      loadCommunityStats();
      loadFriends();
    }
  }, [open, currentUser, refreshTrigger]);

  const loadLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, total_raised, rank, tier, daily_streak, invite_code')
        .order('total_raised', { ascending: false })
        .limit(10);

      if (error) throw error;
      setLeaderboard(data || []);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  };

  const loadAchievements = async () => {
    if (!currentUser) return;
    
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      setAchievements(data || []);
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  };

  const loadCommunityStats = async () => {
    try {
      const { data, error } = await supabase
        .from('community_stats')
        .select('*')
        .eq('stat_date', new Date().toISOString().split('T')[0])
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setCommunityStats(data);
      } else {
        // Create default stats if none exist
        setCommunityStats({
          total_users: 0,
          total_raised: 0,
          monthly_raised: 0,
          total_tabs_opened: 0
        });
      }
    } catch (error) {
      console.error('Error loading community stats:', error);
    }
  };

  const loadFriends = async () => {
    if (!currentUser) return;
    
    try {
      const { data, error } = await supabase
        .from('friends')
        .select(`
          *,
          friend:profiles!friends_friend_id_fkey(id, username, total_raised, rank, tier, daily_streak, invite_code)
        `)
        .eq('user_id', currentUser.id)
        .eq('status', 'accepted');

      if (error) throw error;
      
      const friendsList = data?.map(f => f.friend).filter(Boolean) || [];
      setFriends(friendsList);
      
      // Load friends leaderboard
      if (friendsList.length > 0) {
        const friendIds = friendsList.map(f => f.id);
        const { data: friendsData, error: friendsError } = await supabase
          .from('profiles')
          .select('id, username, total_raised, rank, tier, daily_streak, invite_code')
          .in('id', friendIds)
          .order('total_raised', { ascending: false });

        if (!friendsError) {
          setFriendsLeaderboard(friendsData || []);
        }
      }
    } catch (error) {
      console.error('Error loading friends:', error);
    }
  };

  const addFriend = async () => {
    if (!friendCode.trim() || !currentUser) return;
    
    setLoading(true);
    try {
      // Find user by invite code
      const { data: friendData, error: findError } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('invite_code', friendCode.toUpperCase())
        .single();

      if (findError || !friendData) {
        alert('Invalid invite code');
        return;
      }

      if (friendData.id === currentUser.id) {
        alert('You cannot add yourself as a friend');
        return;
      }

      // Add friend request
      const { error: addError } = await supabase
        .from('friends')
        .insert({
          user_id: currentUser.id,
          friend_id: friendData.id,
          status: 'pending'
        });

      if (addError) {
        if (addError.code === '23505') {
          alert('Friend request already sent');
        } else {
          throw addError;
        }
      } else {
        alert('Friend request sent!');
        setFriendCode('');
        loadFriends();
      }
    } catch (error) {
      console.error('Error adding friend:', error);
      alert('Error adding friend');
    } finally {
      setLoading(false);
    }
  };

  const getTierProgress = (currentRaised: number) => {
    const tiers = Object.values(TIER_INFO).sort((a, b) => a.threshold - b.threshold);
    const currentTier = tiers.find(tier => currentRaised >= tier.threshold) || tiers[0];
    const nextTier = tiers[tiers.indexOf(currentTier) + 1];
    
    if (!nextTier) {
      return { progress: 100, nextTier: null };
    }
    
    const progress = ((currentRaised - currentTier.threshold) / (nextTier.threshold - currentTier.threshold)) * 100;
    return { progress: Math.min(progress, 100), nextTier };
  };

  if (!open) return null;

  const currentLeaderboard = showFriendsOnly ? friendsLeaderboard : leaderboard;
  const userRank = currentUser ? currentLeaderboard.findIndex(u => u.id === currentUser.id) + 1 : 0;
  const tierProgress = currentUser ? getTierProgress(currentUser.total_raised) : { progress: 0, nextTier: null };

  return (
    <div className="gamification-modal-overlay" onClick={onClose}>
      <div className="gamification-modal" onClick={e => e.stopPropagation()}>
        <button className="gamification-close" onClick={onClose}>×</button>
        
        <div className="gamification-header">
          <h2>🎮 Gamification Center</h2>
          <div className="gamification-tabs">
            {['leaderboard', 'achievements', 'friends', 'community'].map(tab => (
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
          {activeTab === 'leaderboard' && (
            <div className="leaderboard-section">
              <div className="leaderboard-header">
                <h3>🏆 Leaderboard</h3>
                <div className="leaderboard-toggle">
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={showFriendsOnly}
                      onChange={e => setShowFriendsOnly(e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                    <span className="toggle-label">Friends Only</span>
                  </label>
                </div>
              </div>

              {currentUser && (
                <div className="user-rank-card">
                  <div className="user-rank-info">
                    <span className="user-rank">#{userRank || 'Unranked'}</span>
                    <span className="user-total">${currentUser.total_raised.toFixed(2)} raised</span>
                  </div>
                  <div className="tier-progress">
                    <div className="tier-info">
                      <span className="current-tier">{TIER_INFO[currentUser.tier as keyof typeof TIER_INFO]?.name}</span>
                      {tierProgress.nextTier && (
                        <span className="next-tier">→ {TIER_INFO[tierProgress.nextTier.name.toLowerCase() as keyof typeof TIER_INFO]?.name}</span>
                      )}
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${tierProgress.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div className="leaderboard-list">
                {currentLeaderboard.map((user, index) => (
                  <div key={user.id} className={`leaderboard-item ${user.id === currentUser?.id ? 'current-user' : ''}`}>
                    <div className="rank">#{index + 1}</div>
                    <div className="user-info">
                      <div className="username">{user.username}</div>
                      <div className="tier">{TIER_INFO[user.tier as keyof typeof TIER_INFO]?.name}</div>
                    </div>
                    <div className="stats">
                      <div className="total-raised">${user.total_raised.toFixed(2)}</div>
                      <div className="streak">🔥 {user.daily_streak}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="achievements-section">
              <h3>🏅 Achievements</h3>
              <div className="achievements-grid">
                {achievements.map(achievement => (
                  <div key={achievement.id} className="achievement-card earned">
                    <div className="achievement-icon">
                      {BADGE_ICONS[achievement.badge_type as keyof typeof BADGE_ICONS] || '🏆'}
                    </div>
                    <div className="achievement-info">
                      <div className="achievement-name">{achievement.badge_name}</div>
                      <div className="achievement-description">{achievement.badge_description}</div>
                      <div className="achievement-date">
                        Earned {new Date(achievement.earned_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'friends' && (
            <div className="friends-section">
              <h3>👥 Friends</h3>
              
              <div className="add-friend-form">
                <input
                  type="text"
                  placeholder="Enter friend's invite code"
                  value={friendCode}
                  onChange={e => setFriendCode(e.target.value)}
                  className="friend-code-input"
                />
                <button 
                  onClick={addFriend} 
                  disabled={loading || !friendCode.trim()}
                  className="add-friend-btn"
                >
                  {loading ? 'Adding...' : 'Add Friend'}
                </button>
              </div>

              {currentUser && (
                <div className="invite-code-section">
                  <label>Your Invite Code:</label>
                  <div className="invite-code-display">
                    <span className="invite-code">{currentUser.invite_code}</span>
                    <button 
                      onClick={() => navigator.clipboard.writeText(currentUser.invite_code)}
                      className="copy-btn"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}

              <div className="friends-list">
                {friends.map(friend => (
                  <div key={friend.id} className="friend-item">
                    <div className="friend-info">
                      <div className="friend-username">{friend.username}</div>
                      <div className="friend-tier">{TIER_INFO[friend.tier as keyof typeof TIER_INFO]?.name}</div>
                    </div>
                    <div className="friend-stats">
                      <div className="friend-raised">${friend.total_raised.toFixed(2)}</div>
                      <div className="friend-streak">🔥 {friend.daily_streak}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'community' && (
            <div className="community-section">
              <h3>🌍 Community Impact</h3>
              {communityStats && (
                <div className="community-stats">
                  <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                      <div className="stat-value">{communityStats.total_users.toLocaleString()}</div>
                      <div className="stat-label">Total Users</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-info">
                      <div className="stat-value">${communityStats.total_raised.toLocaleString()}</div>
                      <div className="stat-label">Total Raised</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-info">
                      <div className="stat-value">{communityStats.total_tabs_opened.toLocaleString()}</div>
                      <div className="stat-label">Tabs Opened</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">📅</div>
                    <div className="stat-info">
                      <div className="stat-value">${communityStats.monthly_raised.toLocaleString()}</div>
                      <div className="stat-label">This Month</div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="community-message">
                <h4>Together, we're making a difference! 🌟</h4>
                <p>
                  Every tab you open, every click you make, and every friend you invite 
                  contributes to our mission of supporting Palestinian causes. 
                  Thank you for being part of this incredible community!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}