import { useState, useEffect, useRef } from 'react'
import AdComponent from './AdComponent'
import EmbeddedAdComponent from './EmbeddedAdComponent'
import AdvertisementsUpgrade from './AdvertisementsUpgrade'
import AboutPage from './AboutPage'
import AuthComponent from './AuthComponent'
import { auth, userProfile } from '../lib/supabase'

import './NewTab.css'
import logo from '../assets/tabs4_palestine_black_logo-removebg-preview.png'
import watermelonIcon from '../assets/original_watermelon.png'




function SettingsModal({ open, onClose, toggles, setToggles, backgroundMode, setBackgroundMode, onUploadBackground, adCount, onAdUpgrade }: { open: boolean, onClose: () => void, toggles: any, setToggles: (t: any) => void, backgroundMode: string, setBackgroundMode: (m: string) => void, onUploadBackground: (file: File) => void, adCount: number, onAdUpgrade: (count: number) => void }) {
  const [activeTab, setActiveTab] = useState('General');
  const fileInputRef = useRef<HTMLInputElement>(null);
  if (!open) return null;
  return (
    <div className="t4p-modal-bubble-overlay" onClick={onClose}>
      <div className="t4p-modal-bubble" onClick={e => e.stopPropagation()}>
        <button className="t4p-modal-close" onClick={onClose} style={{position: 'absolute', top: 16, right: 18}}>×</button>
        <div className="t4p-modal-tabs">
          {['General', 'Background', 'Advertisements', 'Account', 'About'].map(tab => (
            <button
              key={tab}
              className={`t4p-modal-tab${activeTab === tab ? ' t4p-modal-tab-active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="t4p-modal-content">
          {activeTab === 'General' && (
            <div className="t4p-toggles-list">
              <div className="t4p-toggle-row">
                <span className="t4p-toggle-label">Show Apps (Hamburger Menu)</span>
                <label className="t4p-switch">
                  <input type="checkbox" checked={toggles.apps} onChange={e => setToggles({...toggles, apps: e.target.checked})} />
                  <span className="t4p-slider"></span>
                </label>
              </div>
              <div className="t4p-toggle-row">
                <span className="t4p-toggle-label">Show Widget (Logo)</span>
                <label className="t4p-switch">
                  <input type="checkbox" checked={toggles.logo} onChange={e => setToggles({...toggles, logo: e.target.checked})} />
                  <span className="t4p-slider"></span>
                </label>
              </div>
              <div className="t4p-toggle-row">
                <span className="t4p-toggle-label">Show Time (Clock)</span>
                <label className="t4p-switch">
                  <input type="checkbox" checked={toggles.clock} onChange={e => setToggles({...toggles, clock: e.target.checked})} />
                  <span className="t4p-slider"></span>
                </label>
              </div>
              <div className="t4p-toggle-row">
                <span className="t4p-toggle-label">Show Search Bar</span>
                <label className="t4p-switch">
                  <input type="checkbox" checked={toggles.search} onChange={e => setToggles({...toggles, search: e.target.checked})} />
                  <span className="t4p-slider"></span>
                </label>
              </div>
            </div>
          )}
          {activeTab === 'Background' && (
            <div className="t4p-bg-options">
              <button className={`t4p-bg-btn${backgroundMode === 'default' ? ' t4p-bg-btn-active' : ''}`} onClick={() => setBackgroundMode('default')}>
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#188038"/></svg>
                <span>Default</span>
              </button>
              <button className={`t4p-bg-btn${backgroundMode === 'gallery' ? ' t4p-bg-btn-active' : ''}`} onClick={() => setBackgroundMode('gallery')}>
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" stroke="#222" strokeWidth="2"/><circle cx="8" cy="10" r="2" fill="#188038"/><path d="M21 19l-5.5-7-4.5 6-3-4-4 5" stroke="#188038" strokeWidth="2"/></svg>
                <span>Gallery</span>
              </button>

              <button className={`t4p-bg-btn${backgroundMode === 'upload' ? ' t4p-bg-btn-active' : ''}`} onClick={() => fileInputRef.current?.click()}>
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 16V4m0 0l-4 4m4-4l4 4" stroke="#188038" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="4" y="16" width="16" height="4" rx="2" fill="#188038"/></svg>
                <span>Upload</span>
                <input ref={fileInputRef} type="file" accept="image/*" style={{display:'none'}} onChange={e => { if(e.target.files?.[0]) onUploadBackground(e.target.files[0]); setBackgroundMode('upload'); }} />
              </button>
            </div>
          )}
          {activeTab === 'Advertisements' && (
            <AdvertisementsUpgrade 
              currentAdCount={adCount} 
              onUpgrade={onAdUpgrade} 
            />
          )}
          {activeTab === 'Account' && (
            <AuthComponent onAuthChange={(user) => {
              // Handle user auth state change
              console.log('User auth changed:', user)
            }} />
          )}
          {activeTab === 'About' && <AboutPage />}
        </div>
      </div>
    </div>
  );
}

// Import all gallery images from src/assets/backgrounds
import pexelsGaza from '../assets/backgrounds/pexels-gaza-8660631.jpg'
import pexelsEarano from '../assets/backgrounds/pexels-earano-1352196.jpg'
import pexelsPixabay from '../assets/backgrounds/pexels-pixabay-531767.jpg'
import pexelsWalidphotoz from '../assets/backgrounds/pexels-walidphotoz-847402.jpg'
import pexelsAbuAdel from '../assets/backgrounds/pexels-abu-adel-2153065-3805146.jpg'
import pexelsAhmedAkacha from '../assets/backgrounds/pexels-ahmed-akacha-3313934-10629415.jpg'
import pexelsFabio from '../assets/backgrounds/pexels-fabio2311-712392.jpg'
import pexelsMikolaj from '../assets/backgrounds/pexels-mikolaj-kolodziejczyk-2377168-16118911.jpg'
import pexelsRana from '../assets/backgrounds/pexels-rana-841343.jpg'
import pexelsSmuldur from '../assets/backgrounds/pexels-smuldur-2048865.jpg'
import pexelsAbdghat from '../assets/backgrounds/pexels-abdghat-1631665.jpg'
import pexelsVincent from '../assets/backgrounds/pexels-vincent-pelletier-113252-720254.jpg'
import pexelsSamer from '../assets/backgrounds/pexels-samer-zeton-455914177-33151206.jpg'
import pexelsHaleyve1 from '../assets/backgrounds/pexels-haleyve-2102625.jpg'
import pexelsDistoreal from '../assets/backgrounds/pexels-distoreal-3689859.jpg'
import pexelsHaleyve2 from '../assets/backgrounds/pexels-haleyve-2102627.jpg'
import pexelsHaleyve3 from '../assets/backgrounds/pexels-haleyve-2087388.jpg'
import pexelsBelalSalem1 from '../assets/backgrounds/pexels-belal-salem-91944577-9140968.jpg'
import pexelsBelalSalem2 from '../assets/backgrounds/pexels-belal-salem-91944577-9140972.jpg'
import pexelsLeon from '../assets/backgrounds/pexels-leon-natan-2996182-6850831.jpg'

// Gallery images array using imported assets
const galleryImages = [
  pexelsGaza,
  pexelsEarano,
  pexelsPixabay,
  pexelsWalidphotoz,
  pexelsAbuAdel,
  pexelsAhmedAkacha,
  pexelsFabio,
  pexelsMikolaj,
  pexelsRana,
  pexelsSmuldur,
  pexelsAbdghat,
  pexelsVincent,
  pexelsSamer,
  pexelsHaleyve1,
  pexelsDistoreal,
  pexelsHaleyve2,
  pexelsHaleyve3,
  pexelsBelalSalem1,
  pexelsBelalSalem2,
  pexelsLeon
]

export const NewTab = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [time, setTime] = useState('')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [toggles, setToggles] = useState({
    apps: true,
    logo: true,
    clock: true,
    search: true
  })
  const [backgroundMode, setBackgroundMode] = useState('default');
  const [customBg, setCustomBg] = useState<string | null>(null);
  const [galleryBg, setGalleryBg] = useState(galleryImages[0]);
  const [appsOpen, setAppsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authUsername, setAuthUsername] = useState('');
  const [showLogo, setShowLogo] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [adCount, setAdCount] = useState(1);
  const [clockHovered, setClockHovered] = useState(false);
  const [shortcuts, setShortcuts] = useState([
    { name: 'SEP', url: 'https://www.sep.com', icon: '/img/8_icons/white-sep_icon_512x512.png' },
    { name: 'NOL Collective', url: 'https://www.nolcollective.com', icon: '/img/8_icons/white-nol-collective.png' },
    { name: 'Darzah', url: 'https://www.darzah.org', icon: '/img/8_icons/white-darzah_logo.png' },
    { name: 'Wear The Peace', url: 'https://www.wearthepeace.com', icon: '/img/8_icons/wear_the_peacelogo.png' },
    { name: 'Ben & Jekats', url: 'https://www.ben-jekats.com', icon: '/img/8_icons/white-Ben-and-Jerrys-Logo-1990s-500x281.png' },
    { name: 'Baytoun', url: 'https://www.baytoun.uk', icon: '/img/8_icons/white-sep_icon_512x512.png' },
    { name: 'Watan Apparel', url: 'https://www.watanapparel.com', icon: '/img/8_icons/watan.png' },
    { name: 'Farsali', url: 'https://www.farsali.com', icon: '/img/8_icons/farsali.png' }
  ]);
  const [showShortcutModal, setShowShortcutModal] = useState(false);
  const [newShortcut, setNewShortcut] = useState({ name: '', url: '' });
  const [shortcutError, setShortcutError] = useState('');

  // Function to add new shortcut
  const addShortcut = () => {
    if (!newShortcut.name || !newShortcut.url) {
      setShortcutError('Name and URL are required.');
      return;
    }
    
    // Create a default icon (you can replace this with a generic icon)
    const defaultIcon = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMiA3VjIwSDEwVjE0SDE0VjIwSDIyVjdMMTIgMloiIGZpbGw9IiMxODgwMzgiLz4KPC9zdmc+';
    
    const shortcutWithIcon = { ...newShortcut, icon: defaultIcon };
    setShortcuts([...shortcuts, shortcutWithIcon]);
    setShowShortcutModal(false);
    setNewShortcut({ name: '', url: '' });
    setShortcutError('');
  };

  // Load settings from storage on mount
  useEffect(() => {
    chrome.storage.sync.get(['adCount', 'backgroundMode'], (result: { adCount?: number, backgroundMode?: string }) => {
      if (result.adCount) {
        setAdCount(result.adCount);
      }
      if (result.backgroundMode) {
        setBackgroundMode(result.backgroundMode);
      }
    });
  }, []);

  // Save ad count to storage when it changes
  const handleAdUpgrade = (count: number) => {
    setAdCount(count);
    chrome.storage.sync.set({ adCount: count });
  };

  // Save background mode to storage when it changes
  const handleBackgroundModeChange = (mode: string) => {
    setBackgroundMode(mode);
    chrome.storage.sync.set({ backgroundMode: mode });
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (isSignUp) {
        const { data, error } = await auth.signUp(authEmail, authPassword, authUsername)
        if (error) throw error
        
        if (data.user && data.user.email) {
          // Create profile manually
          await userProfile.createProfile(
            data.user.id,
            data.user.email,
            authUsername || data.user.email.split('@')[0]
          )
        }
      } else {
        const { error } = await auth.signIn(authEmail, authPassword)
        if (error) throw error
      }
      
      // Reset form and close profile bubble
      setAuthEmail('')
      setAuthPassword('')
      setAuthUsername('')
      setShowAuthForm(false)
      setIsSignUp(false)
      setProfileOpen(false)
      
      // Check for current user after auth
      checkCurrentUser()
      
    } catch (error: any) {
      console.error('Auth error:', error.message)
      alert(error.message)
    }
  }

  const checkCurrentUser = async () => {
    try {
      const { user } = await auth.getCurrentUser()
      if (user) {
        // Get user profile
        const { data: profile } = await userProfile.getProfile(user.id)
        setCurrentUser({
          id: user.id,
          email: user.email,
          username: profile?.username || user.email?.split('@')[0]
        })
      } else {
        setCurrentUser(null)
      }
    } catch (error) {
      console.error('Error checking current user:', error)
      setCurrentUser(null)
    }
  }

  const handleLogoToggle = () => {
    setShowLogo(!showLogo)
  }

  useEffect(() => {
    const updateClock = () => {
      const now = new Date()
      const hour = String(now.getHours()).padStart(2, '0')
      const minute = String(now.getMinutes()).padStart(2, '0')
      setTime(`${hour}:${minute}`)
    }
    updateClock()
    const interval = setInterval(updateClock, 1000) // Update every second for better accuracy
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Check for current user on component mount
    checkCurrentUser()
  }, [])

  useEffect(() => {
    // Pick a random gallery image when gallery mode is selected
    if (backgroundMode === 'gallery') {
      const idx = Math.floor(Math.random() * galleryImages.length);
      setGalleryBg(galleryImages[idx]);
    }
  }, [backgroundMode]);

  // Ensure gallery background is set on initial load if in gallery mode
  useEffect(() => {
    if (backgroundMode === 'gallery' && !galleryBg) {
      const idx = Math.floor(Math.random() * galleryImages.length);
      setGalleryBg(galleryImages[idx]);
    }
  }, [backgroundMode, galleryBg]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery.trim())}`
      window.open(searchUrl, '_blank')
      setSearchQuery('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e)
    }
  }

  const handleUploadBackground = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => setCustomBg(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <section
      style={
        backgroundMode === 'default'
          ? { background: 'transparent' }
          : backgroundMode === 'classic'
          ? { background: '#fff' }
          : backgroundMode === 'upload' && customBg
          ? { backgroundImage: `url(${customBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : backgroundMode === 'gallery'
          ? { backgroundImage: `url(${galleryBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : { background: 'transparent' }
      }
    >
              <SettingsModal
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          toggles={toggles}
          setToggles={setToggles}
          backgroundMode={backgroundMode}
          setBackgroundMode={handleBackgroundModeChange}
          onUploadBackground={handleUploadBackground}
          adCount={adCount}
          onAdUpgrade={handleAdUpgrade}
        />
      {/* Apps Bubble */}
      {appsOpen && (
        <div className="t4p-apps-bubble">
          <button className="t4p-modal-close" onClick={() => setAppsOpen(false)}>×</button>
          <div className="t4p-apps-section">
            <div className="t4p-apps-title">Google Services</div>
            <div className="t4p-apps-grid">
                              <a href="https://www.google.com" target="_blank" className="t4p-apps-item"><img src="../assets/icons/icons8-google.svg" alt="Google" /><span>Google</span></a>
                <a href="https://mail.google.com" target="_blank" className="t4p-apps-item"><img src="../assets/icons/icons8-gmail.svg" alt="Gmail" /><span>Gmail</span></a>
                <a href="https://drive.google.com" target="_blank" className="t4p-apps-item"><img src="../assets/icons/icons8-google-drive.svg" alt="Drive" /><span>Drive</span></a>
                <a href="https://calendar.google.com" target="_blank" className="t4p-apps-item"><img src="../assets/icons/icons8-google-calendar.svg" alt="Calendar" /><span>Calendar</span></a>
                <a href="https://meet.google.com" target="_blank" className="t4p-apps-item"><img src="../assets/icons/icons8-google-meet.svg" alt="Meet" /><span>Meet</span></a>
                <a href="https://maps.google.com" target="_blank" className="t4p-apps-item"><img src="../assets/icons/icons8-google-maps.svg" alt="Maps" /><span>Maps</span></a>
            </div>
          </div>
          <div className="t4p-apps-section">
            <div className="t4p-apps-title">Social Media</div>
            <div className="t4p-apps-grid">
              <a href="https://instagram.com" target="_blank" className="t4p-apps-item"><img src="../assets/icons/icons8-instagram.svg" alt="Instagram" /><span>Instagram</span></a>
              <a href="https://facebook.com" target="_blank" className="t4p-apps-item"><img src="../assets/icons/icons8-facebook.svg" alt="Facebook" /><span>Facebook</span></a>
              <a href="https://x.com" target="_blank" className="t4p-apps-item"><img src="../assets/icons/icons8-x.svg" alt="X" /><span>X</span></a>
              <a href="https://linkedin.com" target="_blank" className="t4p-apps-item"><img src="../assets/icons/icons8-linkedin.svg" alt="LinkedIn" /><span>LinkedIn</span></a>
              <a href="https://tiktok.com" target="_blank" className="t4p-apps-item"><img src="../assets/icons/icons8-tiktok.svg" alt="TikTok" /><span>TikTok</span></a>
              <a href="https://youtube.com" target="_blank" className="t4p-apps-item"><img src="../assets/icons/icons8-youtube.svg" alt="YouTube" /><span>YouTube</span></a>
            </div>
          </div>
          <div className="t4p-apps-section">
            <div className="t4p-apps-title">Development & Media</div>
            <div className="t4p-apps-grid">
              <a href="https://github.com" target="_blank" className="t4p-apps-item"><img src="../assets/icons/icons8-github.svg" alt="GitHub" /><span>GitHub</span></a>
              <a href="https://medium.com" target="_blank" className="t4p-apps-item"><img src="../assets/icons/icons8-medium.svg" alt="Medium" /><span>Medium</span></a>
              <a href="https://spotify.com" target="_blank" className="t4p-apps-item"><img src="../assets/icons/icons8-spotify.svg" alt="Spotify" /><span>Spotify</span></a>
              <a href="https://soundcloud.com" target="_blank" className="t4p-apps-item"><img src="../assets/icons/icons8-soundcloud.svg" alt="SoundCloud" /><span>SoundCloud</span></a>
              <a href="https://zoom.us" target="_blank" className="t4p-apps-item"><img src="../assets/icons/icons8-zoom.svg" alt="Zoom" /><span>Zoom</span></a>
              <a href="https://wechat.com" target="_blank" className="t4p-apps-item"><img src="../assets/icons/icons8-wechat.svg" alt="WeChat" /><span>WeChat</span></a>
            </div>
          </div>
        </div>
      )}
      
      {/* Profile Bubble */}
      {profileOpen && (
        <div className="t4p-profile-bubble">
          <button className="t4p-modal-close" onClick={() => {
            setProfileOpen(false)
            setShowAuthForm(false)
            setIsSignUp(false)
          }}>×</button>
          
          {!showAuthForm ? (
            <div className="t4p-profile-section">
              <div className="t4p-profile-header">
                <div className="t4p-profile-avatar">
                  <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#666"/>
                  </svg>
                </div>
                <div className="t4p-profile-info">
                  <div className="t4p-profile-name">
                    {currentUser ? currentUser.username : 'Guest User'}
                  </div>
                  <div className="t4p-profile-email">
                    {currentUser ? currentUser.email : 'Not signed in'}
                  </div>
                </div>
              </div>
              <div className="t4p-profile-actions">
                {currentUser ? (
                  <>
                    <button className="t4p-profile-btn" onClick={async () => {
                      await auth.signOut()
                      setCurrentUser(null)
                      setProfileOpen(false)
                    }}>
                      Sign Out
                    </button>
                    <button className="t4p-profile-btn" onClick={() => {
                      setProfileOpen(false)
                      setSettingsOpen(true)
                    }}>
                      Settings
                    </button>
                  </>
                ) : (
                  <>
                    <button className="t4p-profile-btn t4p-profile-btn-primary" onClick={() => {
                      setShowAuthForm(true)
                      setIsSignUp(false)
                    }}>
                      Sign In
                    </button>
                    <button className="t4p-profile-btn" onClick={() => {
                      setShowAuthForm(true)
                      setIsSignUp(true)
                    }}>
                      Create Account
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="t4p-profile-section">
              <div className="t4p-profile-header">
                <div className="t4p-profile-avatar">
                  <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#666"/>
                  </svg>
                </div>
                <div className="t4p-profile-info">
                  <div className="t4p-profile-name">{isSignUp ? 'Create Account' : 'Sign In'}</div>
                  <div className="t4p-profile-email">Enter your details below</div>
                </div>
              </div>
              
              <form onSubmit={handleAuthSubmit} className="t4p-profile-form">
                {isSignUp && (
                  <input
                    type="text"
                    placeholder="Username (optional)"
                    value={authUsername}
                    onChange={(e) => setAuthUsername(e.target.value)}
                    className="t4p-profile-input"
                  />
                )}
                <input
                  type="email"
                  placeholder="Email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  required
                  className="t4p-profile-input"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  required
                  className="t4p-profile-input"
                />
                <button type="submit" className="t4p-profile-btn t4p-profile-btn-primary">
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </button>
                <button 
                  type="button" 
                  className="t4p-profile-btn t4p-profile-btn-link"
                  onClick={() => {
                    setIsSignUp(!isSignUp)
                    setAuthEmail('')
                    setAuthPassword('')
                    setAuthUsername('')
                  }}
                >
                  {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
      
      {/* Notifications Bubble */}
      {notificationsOpen && (
        <div className="t4p-notifications-bubble">
          <button className="t4p-modal-close" onClick={() => setNotificationsOpen(false)}>×</button>
          <div className="t4p-notifications-section">
            <div className="t4p-notifications-title">Palestine News</div>
            <div className="t4p-notifications-list">
              <div className="t4p-notification-item">
                <div className="t4p-notification-headline">UN Calls for Immediate Ceasefire in Gaza</div>
                <div className="t4p-notification-summary">The United Nations Security Council has issued an urgent call for an immediate ceasefire in Gaza, citing the humanitarian crisis and civilian casualties.</div>
                <a href="https://www.un.org" target="_blank" className="t4p-notification-link">Read More →</a>
              </div>
              <div className="t4p-notification-item">
                <div className="t4p-notification-headline">Humanitarian Aid Reaches Northern Gaza</div>
                <div className="t4p-notification-summary">International aid organizations have successfully delivered critical supplies to northern Gaza, providing relief to thousands of displaced families.</div>
                <a href="https://www.unrwa.org" target="_blank" className="t4p-notification-link">Read More →</a>
              </div>
              <div className="t4p-notification-item">
                <div className="t4p-notification-headline">Palestinian Students Return to Rebuilt Schools</div>
                <div className="t4p-notification-summary">Reconstruction efforts have enabled Palestinian students to return to newly rebuilt schools, marking a step toward normalcy in affected communities.</div>
                <a href="https://www.unicef.org" target="_blank" className="t4p-notification-link">Read More →</a>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Top left clock */}
      {toggles.clock && (
        <div className="t4p-clock" onMouseEnter={() => setClockHovered(true)} onMouseLeave={() => setClockHovered(false)}>
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2"/><path d="M12 7v5l3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
          <span>{time}</span>
          {clockHovered && (
            <button 
              className="t4p-clock-close" 
              onClick={() => setToggles({...toggles, clock: false})}
              title="Hide clock"
            >
              ×
            </button>
          )}
        </div>
      )}
      {/* Top right icons */}
      <div className="t4p-top-right-icons">
        <button className="t4p-signup-btn" onClick={() => setProfileOpen(true)}>
          Sign Up
        </button>
        {toggles.apps && (
          <button className="t4p-icon-btn" title="Notifications" onClick={() => setNotificationsOpen(v => !v)}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.73 21a2 2 0 01-3.46 0" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        )}
        <button className="t4p-icon-btn" title="Profile" onClick={() => setProfileOpen(v => !v)}>
          {/* Profile icon */}
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#fff"/>
          </svg>
        </button>
        {toggles.apps && (
          <button className="t4p-icon-btn" title="Apps" onClick={() => setAppsOpen(v => !v)}>
            {/* 9-dot grid icon */}
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><g fill="#fff"><circle cx="5" cy="5" r="2"/><circle cx="14" cy="5" r="2"/><circle cx="23" cy="5" r="2"/><circle cx="5" cy="14" r="2"/><circle cx="14" cy="14" r="2"/><circle cx="23" cy="14" r="2"/><circle cx="5" cy="23" r="2"/><circle cx="14" cy="23" r="2"/><circle cx="23" cy="23" r="2"/></g></svg>
          </button>
        )}
      </div>
      {/* Bottom left settings */}
      <div className="t4p-settings">
        <button className="t4p-icon-btn" title="Settings" onClick={() => setSettingsOpen(true)}>
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" stroke="#fff" strokeWidth="2"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33h.09A1.65 1.65 0 008.91 3.09V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51h.09a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.09a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="#fff" strokeWidth="2"/></svg>
        </button>
      </div>
      <div className="center-content">
        {toggles.logo && (
          <div className="t4p-logo-container">
            {showLogo ? (
              <img src={logo} alt="tabs4palestine logo" className="t4p-logo" />
            ) : (
              <div className="t4p-clock-logo">
                <div className="t4p-clock-display">{time}</div>
              </div>
            )}
            <button className="t4p-logo-toggle" onClick={handleLogoToggle} title="Toggle logo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M7 10l5 5 5-5" stroke="#188038" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}
        {toggles.search && (
          <div className="search-container">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-box">
                <svg className="search-icon" viewBox="0 0 24 24">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search Google or type a URL"
                  className="search-input"
                  autoFocus
                />
              </div>
            </form>
          </div>
        )}
        
        {/* Donation Box */}
        <div className="donation-box">
          <img src={watermelonIcon} alt="Watermelon" className="donation-watermelon" />
          <div className="donation-divider"></div>
          <div className="donation-text">
            <span className="donation-amount">340,234$</span> has been donated to the Palestinian cause
          </div>
        </div>
        <div className="quick-access-grid">
          {shortcuts.map((shortcut, index) => (
            <a key={index} href={shortcut.url} target="_blank" rel="noopener noreferrer" className="quick-access-item">
              <img src={shortcut.icon} alt={shortcut.name} />
              <span>{shortcut.name}</span>
            </a>
          ))}
          <button className="t4p-add-shortcut-btn" onClick={() => setShowShortcutModal(true)}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="#188038"/>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Embedded Advertisements */}
      {adCount >= 1 && (
        <EmbeddedAdComponent position="bottom-right" adIndex={0} />
      )}
      {adCount >= 2 && (
        <EmbeddedAdComponent position="bottom-right-top" adIndex={1} />
      )}
      {adCount >= 3 && (
        <EmbeddedAdComponent 
          position="bottom-middle" 
          adIndex={2} 
          onClose={() => {
            // Reduce ad count to 2 when middle ad is closed
            setAdCount(2)
            // Save to storage
            chrome.storage.sync.set({ adCount: 2 })
          }}
        />
      )}

      {/* Shortcut Modal */}
      {showShortcutModal && (
        <div className="t4p-shortcut-modal-overlay" onClick={() => setShowShortcutModal(false)}>
          <div className="t4p-shortcut-modal" onClick={e => e.stopPropagation()}>
            <h2>Add New Shortcut</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              addShortcut();
            }}>
              <div className="t4p-shortcut-form-group">
                <label htmlFor="shortcutName">Name:</label>
                <input
                  type="text"
                  id="shortcutName"
                  value={newShortcut.name}
                  onChange={(e) => setNewShortcut({ ...newShortcut, name: e.target.value })}
                  required
                />
              </div>
              <div className="t4p-shortcut-form-group">
                <label htmlFor="shortcutUrl">URL:</label>
                <input
                  type="url"
                  id="shortcutUrl"
                  value={newShortcut.url}
                  onChange={(e) => setNewShortcut({ ...newShortcut, url: e.target.value })}
                  required
                />
              </div>
              {shortcutError && <p style={{ color: 'red' }}>{shortcutError}</p>}
              <button type="submit" className="t4p-profile-btn t4p-profile-btn-primary">Add Shortcut</button>
              <button type="button" className="t4p-profile-btn t4p-profile-btn-link" onClick={() => setShowShortcutModal(false)}>Cancel</button>
            </form>
            <h3>Current Shortcuts:</h3>
            <div className="t4p-shortcut-list">
              {shortcuts.map((shortcut, index) => (
                <div key={index} className="t4p-shortcut-item">
                  <a href={shortcut.url} target="_blank" rel="noopener noreferrer">
                    <img src={shortcut.icon} alt={shortcut.name} />
                    <span>{shortcut.name}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default NewTab
