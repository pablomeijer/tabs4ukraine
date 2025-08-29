import { useState, useEffect, useRef } from 'react'
import AdComponent from './AdComponent'
import EmbeddedAdComponent from './EmbeddedAdComponent'
import AdvertisementsUpgrade from './AdvertisementsUpgrade'
import AboutPage from './AboutPage'
import AuthComponent from './AuthComponent'
import { auth, userProfile } from '../lib/supabase'

import './NewTab.css'
import logoWhite from '../assets/logo_white_transparent.png'
import logoGreen from '../assets/logo_green_transparent.png'
import oliveIcon from '../assets/olive.png'

// Import new SVG icons
import AppsIcon from '../assets/icons/apps_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg'
import ProfileIcon from '../assets/icons/group_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg'
import NotificationsIcon from '../assets/icons/notifications_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg'
import SettingsIcon from '../assets/icons/settings_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg'
import RefreshIcon from '../assets/icons/refresh_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg'
import RefreshIconBlack from '../assets/icons/refresh_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg'
import TrophyIcon from '../assets/icons/trophy_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg'

// Import new cached icons
import CachedIconBlack from '../assets/icons/cached_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg'
import CachedIconWhite from '../assets/icons/cached_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg'

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
// Using dynamic imports to handle missing images gracefully
const backgroundImageNames = [
  'pexels-gaza-8660631.jpg',
  'pexels-earano-1352196.jpg',
  'pexels-pixabay-531767.jpg',
  'pexels-walidphotoz-847402.jpg',
  'pexels-abu-adel-2153065-3805146.jpg',
  'pexels-ahmed-akacha-3313934-10629415.jpg',
  'pexels-fabio2311-712392.jpg',
  'pexels-mikolaj-kolodziejczyk-2377168-16118911.jpg',
  'pexels-rana-841343.jpg',
  'pexels-smuldur-2048865.jpg',
  'pexels-abdghat-1631665.jpg',
  'pexels-vincent-pelletier-113252-720254.jpg',
  'pexels-samer-zeton-455914177-33151206.jpg',
  'pexels-haleyve-2102625.jpg',
  'pexels-distoreal-3689859.jpg',
  'pexels-haleyve-2102627.jpg',
  'pexels-haleyve-2087388.jpg',
  'pexels-belal-salem-91944577-9140968.jpg',
  'pexels-belal-salem-91944577-9140972.jpg',
  'pexels-leon-natan-2996182-6850831.jpg'
]

// Gallery images array using public directory
const galleryImages = backgroundImageNames.map(name => `/img/backgrounds/${name}`)

// Function to get available background images
const getAvailableBackgroundImages = () => {
  // For now, return all images - we'll handle loading errors when actually using them
  return galleryImages;
};

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
  const [logoType, setLogoType] = useState<'logo' | 'clock' | 'watermelon'>('logo');
  const [appsOpen, setAppsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [gamificationOpen, setGamificationOpen] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authUsername, setAuthUsername] = useState('');
     const [currentUser, setCurrentUser] = useState<any>(null);
   const [adCount, setAdCount] = useState(1);
  const [shortcuts, setShortcuts] = useState([
    { name: 'Huda Beauty', url: 'https://www.hudabeauty.com', icon: '/img/8_icons/huda-beauty.png' },
    { name: 'Watan Apparel', url: 'https://www.watanapparel.com', icon: '/img/8_icons/watan.png' },
    { name: 'Farsali', url: 'https://www.farsali.com', icon: '/img/8_icons/farsali.png' },
    { name: 'Wear The Peace', url: 'https://www.wearthepeace.com', icon: '/img/8_icons/wear_the_peacelogo.png' },
    { name: 'Ben & Jerry\'s', url: 'https://www.benjerry.com', icon: '/img/8_icons/white-Ben-and-Jerrys-Logo-1990s-500x281.png' },
    { name: 'Darzah', url: 'https://www.darzah.org', icon: '/img/8_icons/white-darzah_logo.png' },
    { name: 'NOL Collective', url: 'https://www.nolcollective.com', icon: '/img/8_icons/white-nol-collective.png' },
    { name: 'SEP', url: 'https://www.sep.com', icon: '/img/8_icons/white-sep_icon_512x512.png' }
  ]);
  const [showShortcutModal, setShowShortcutModal] = useState(false);
  const [newShortcut, setNewShortcut] = useState({ name: '', url: '' });
  const [shortcutError, setShortcutError] = useState('');
  const [showLogoToggle, setShowLogoToggle] = useState(false);

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
      console.log('Loading settings from storage:', result);
      if (result.adCount) {
        setAdCount(result.adCount);
      }
      if (result.backgroundMode) {
        console.log('Setting background mode from storage:', result.backgroundMode);
        setBackgroundMode(result.backgroundMode);
      } else {
        console.log('No background mode in storage, using default');
        setBackgroundMode('default');
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
    console.log('Changing background mode to:', mode);
    setBackgroundMode(mode);
    chrome.storage.sync.set({ backgroundMode: mode });
    
    // If switching to gallery mode, immediately pick a random image
    if (mode === 'gallery') {
      const availableImages = getAvailableBackgroundImages();
      console.log('Available gallery images:', availableImages);
      if (availableImages.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableImages.length);
        const selectedImage = availableImages[randomIndex];
        console.log('Setting gallery background to:', selectedImage);
        setGalleryBg(selectedImage);
      } else {
        console.warn('No gallery images available');
      }
    }
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
      const availableImages = getAvailableBackgroundImages();
      console.log('Gallery mode selected, available images:', availableImages);
      if (availableImages.length === 0) {
        console.warn('No background images available, falling back to default mode');
        setBackgroundMode('default');
        return;
      }
      
      const idx = Math.floor(Math.random() * availableImages.length);
      const selectedImage = availableImages[idx];
      console.log('Selected gallery image:', selectedImage);
      
      // Test if image loads successfully, fallback to default if it fails
      const img = new Image();
      img.onload = () => {
        console.log('Gallery image loaded successfully:', selectedImage);
        setGalleryBg(selectedImage);
      };
      img.onerror = () => {
        console.warn(`Failed to load background image: ${selectedImage}`);
        // Fallback to default background
        setBackgroundMode('default');
      };
      img.src = selectedImage;
    }
  }, [backgroundMode]);

  // Ensure gallery background is set on initial load if in gallery mode
  useEffect(() => {
    if (backgroundMode === 'gallery' && !galleryBg) {
      const availableImages = getAvailableBackgroundImages();
      console.log('Initial gallery load, available images:', availableImages);
      if (availableImages.length === 0) {
        console.warn('No background images available, falling back to default mode');
        setBackgroundMode('default');
        return;
      }
      
      const idx = Math.floor(Math.random() * availableImages.length);
      const selectedImage = availableImages[idx];
      console.log('Initial gallery image selected:', selectedImage);
      
      // Test if image loads successfully, fallback to default if it fails
      const img = new Image();
      img.onload = () => {
        console.log('Initial gallery image loaded successfully:', selectedImage);
        setGalleryBg(selectedImage);
      };
      img.onerror = () => {
        console.warn(`Failed to load initial background image: ${selectedImage}`);
        // Fallback to default background
        setBackgroundMode('default');
      };
      img.src = selectedImage;
    }
  }, [backgroundMode, galleryBg]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery.trim())}`;
      window.open(searchUrl, '_blank');
      setSearchQuery('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const handleUploadBackground = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => setCustomBg(e.target?.result as string);
    reader.readAsDataURL(file);
  };



  const handleRefreshBackground = () => {
    if (backgroundMode === 'gallery') {
      const availableImages = getAvailableBackgroundImages();
      console.log('Refreshing gallery, available images:', availableImages);
      if (availableImages.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableImages.length);
        const selectedImage = availableImages[randomIndex];
        console.log('Refreshing gallery background to:', selectedImage);
        setGalleryBg(selectedImage);
      } else {
        console.warn('No images available for refresh');
      }
    } else {
      console.log('Refresh called but not in gallery mode, current mode:', backgroundMode);
    }
  };

  const handleLogoToggle = () => {
    setShowLogoToggle(!showLogoToggle);
  };

  const handleLogoTypeChange = (type: 'logo' | 'clock' | 'watermelon') => {
    setLogoType(type);
    setShowLogoToggle(false);
  };

  // Debug logging for background mode
  console.log('Current background mode:', backgroundMode);
  console.log('Gallery background:', galleryBg);
  console.log('Custom background:', customBg);
  
  const sectionStyle = backgroundMode === 'default'
    ? { background: '#F8F8F0' }
    : backgroundMode === 'classic'
    ? { background: '#fff' }
    : backgroundMode === 'upload' && customBg
    ? { backgroundImage: `url(${customBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : backgroundMode === 'gallery'
    ? { backgroundImage: `url(${galleryBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: '#F8F8F0' };
  
  console.log('Applied section style:', sectionStyle);
  
  return (
    <section style={sectionStyle}>
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
                              <a href="https://www.google.com" target="_blank" className="t4p-apps-item"><img src="/img/icons/icons8-google.svg" alt="Google" /><span>Google</span></a>
                <a href="https://mail.google.com" target="_blank" className="t4p-apps-item"><img src="/img/icons/icons8-gmail.svg" alt="Gmail" /><span>Gmail</span></a>
                <a href="https://drive.google.com" target="_blank" className="t4p-apps-item"><img src="/img/icons/icons8-google-drive.svg" alt="Drive" /><span>Drive</span></a>
                <a href="https://calendar.google.com" target="_blank" className="t4p-apps-item"><img src="/img/icons/icons8-google-calendar.svg" alt="Calendar" /><span>Calendar</span></a>
                <a href="https://meet.google.com" target="_blank" className="t4p-apps-item"><img src="/img/icons/icons8-google-meet.svg" alt="Meet" /><span>Meet</span></a>
                <a href="https://maps.google.com" target="_blank" className="t4p-apps-item"><img src="/img/icons/icons8-google-maps.svg" alt="Maps" /><span>Maps</span></a>
            </div>
          </div>
          <div className="t4p-apps-section">
            <div className="t4p-apps-title">Social Media</div>
            <div className="t4p-apps-grid">
              <a href="https://instagram.com" target="_blank" className="t4p-apps-item"><img src="/img/icons/icons8-instagram.svg" alt="Instagram" /><span>Instagram</span></a>
              <a href="https://facebook.com" target="_blank" className="t4p-apps-item"><img src="/img/icons/icons8-facebook.svg" alt="Facebook" /><span>Facebook</span></a>
              <a href="https://x.com" target="_blank" className="t4p-apps-item"><img src="/img/icons/icons8-x.svg" alt="X" /><span>X</span></a>
              <a href="https://linkedin.com" target="_blank" className="t4p-apps-item"><img src="/img/icons/icons8-linkedin.svg" alt="LinkedIn" /><span>LinkedIn</span></a>
              <a href="https://tiktok.com" target="_blank" className="t4p-apps-item"><img src="/img/icons/icons8-tiktok.svg" alt="TikTok" /><span>TikTok</span></a>
              <a href="https://youtube.com" target="_blank" className="t4p-apps-item"><img src="/img/icons/icons8-youtube.svg" alt="YouTube" /><span>YouTube</span></a>
            </div>
          </div>
          <div className="t4p-apps-section">
            <div className="t4p-apps-title">Development & Media</div>
            <div className="t4p-apps-grid">
              <a href="https://github.com" target="_blank" className="t4p-apps-item"><img src="/img/icons/icons8-github.svg" alt="GitHub" /><span>GitHub</span></a>
              <a href="https://medium.com" target="_blank" className="t4p-apps-item"><img src="/img/icons/icons8-medium.svg" alt="Medium" /><span>Medium</span></a>
              <a href="https://spotify.com" target="_blank" className="t4p-apps-item"><img src="/img/icons/icons8-spotify.svg" alt="Spotify" /><span>Spotify</span></a>
              <a href="https://soundcloud.com" target="_blank" className="t4p-apps-item"><img src="/img/icons/icons8-soundcloud.svg" alt="SoundCloud" /><span>SoundCloud</span></a>
              <a href="https://zoom.us" target="_blank" className="t4p-apps-item"><img src="/img/icons/icons8-zoom.svg" alt="Zoom" /><span>Zoom</span></a>
              <a href="https://wechat.com" target="_blank" className="t4p-apps-item"><img src="/img/icons/icons8-wechat.svg" alt="WeChat" /><span>WeChat</span></a>
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
              
              {/* Additional Profile Links */}
              <div className="t4p-profile-links">
                <a href="#" className="t4p-profile-link">Use Tabs4Palestine</a>
                <a href="#" className="t4p-profile-link">Tabs4Palestine Browser</a>
                <a href="#" className="t4p-profile-link">Tabs4Palestine Search</a>
                <a href="#" className="t4p-profile-link">Tabs4Palestine for Companies</a>
                <a href="#" className="t4p-profile-link">Search</a>
                <a href="#" className="t4p-profile-link">Settings</a>
                <a href="#" className="t4p-profile-link">Privacy Policy</a>
                <a href="#" className="t4p-profile-link">Help</a>
                <a href="#" className="t4p-profile-link">Feedback</a>
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
        <div className="t4p-notifications-bubble t4p-notifications-bubble-half-width">
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
      
      {/* Gamification Bubble */}
      {gamificationOpen && (
        <div className="t4p-gamification-bubble">
          <button className="t4p-modal-close" onClick={() => setGamificationOpen(false)}>×</button>
          <div className="t4p-gamification-section">
            <div className="t4p-gamification-title">
              <img src={TrophyIcon} width="24" height="24" alt="Trophy" />
              <span>Gamification</span>
            </div>
            <div className="t4p-gamification-content">
              <div className="t4p-gamification-item">
                <div className="t4p-gamification-headline">Add Friends</div>
                <div className="t4p-gamification-summary">Connect with friends and see who has raised more money for Palestine.</div>
                <div className="t4p-gamification-placeholder">Coming Soon</div>
              </div>
              <div className="t4p-gamification-item">
                <div className="t4p-gamification-headline">Leaderboard</div>
                <div className="t4p-gamification-summary">See your rank and compete with others in fundraising efforts.</div>
                <div className="t4p-gamification-placeholder">Coming Soon</div>
              </div>
              <div className="t4p-gamification-item">
                <div className="t4p-gamification-headline">Achievements</div>
                <div className="t4p-gamification-summary">Unlock badges and rewards for your contributions.</div>
                <div className="t4p-gamification-placeholder">Coming Soon</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      
             {/* Top right icons */}
       <div className="t4p-top-right-icons">
         <button className="t4p-signup-btn" onClick={() => setProfileOpen(true)}>
           Sign Up
         </button>
         {toggles.apps && (
           <button className="t4p-icon-btn" title="Notifications" onClick={() => setNotificationsOpen(v => !v)}>
             <img src={NotificationsIcon} width="24" height="24" alt="Notifications" />
           </button>
         )}
         <button className="t4p-icon-btn" title="Profile" onClick={() => setProfileOpen(v => !v)}>
           <img src={ProfileIcon} width="24" height="24" alt="Profile" />
         </button>
         {toggles.apps && (
           <button className="t4p-icon-btn" title="Apps" onClick={() => setAppsOpen(v => !v)}>
             <img src={AppsIcon} width="24" height="24" alt="Apps" />
           </button>
         )}
         <button className="t4p-icon-btn" title="Gamification" onClick={() => setGamificationOpen(v => !v)}>
           <img src={TrophyIcon} width="24" height="24" alt="Gamification" />
         </button>
         <button className="t4p-icon-btn" title="Settings" onClick={() => setSettingsOpen(true)}>
           <img src={SettingsIcon} width="24" height="24" alt="Settings" />
         </button>
       </div>
      
      <div className="center-content">
                 {toggles.logo && (
           <div className="t4p-logo-container">
             {logoType === 'logo' && (
               <img 
                 src={backgroundMode === 'gallery' ? logoWhite : logoGreen} 
                 alt="tabs4palestine logo" 
                 className="t4p-logo" 
               />
             )}
             {logoType === 'clock' && (
               <div className="t4p-digital-clock">
                 <div className="t4p-clock-time">{time}</div>
                 <div className="t4p-clock-date">{new Date().toLocaleDateString()}</div>
               </div>
             )}
             {logoType === 'watermelon' && (
               <img 
                 src="/img/original_watermelon.png" 
                 alt="Watermelon" 
                 className="t4p-logo" 
               />
             )}
             <button className="t4p-logo-toggle" title="Toggle Logo" onClick={handleLogoToggle}>
               <img 
                 src={backgroundMode === 'gallery' ? CachedIconWhite : CachedIconBlack} 
                 width="20" 
                 height="20" 
                 alt="Toggle" 
               />
             </button>
             {showLogoToggle && (
               <div className="t4p-logo-toggle-options">
                 <button 
                   className={`t4p-logo-toggle-option ${logoType === 'clock' ? 'active' : ''}`}
                   onClick={() => handleLogoTypeChange('clock')}
                   title="Show Clock"
                 >
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                     <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                     <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2"/>
                   </svg>
                 </button>
                 <button 
                   className={`t4p-logo-toggle-option ${logoType === 'watermelon' ? 'active' : ''}`}
                   onClick={() => handleLogoTypeChange('watermelon')}
                   title="Show Watermelon"
                 >
                   <img src="/img/original_watermelon.png" width="16" height="16" alt="Watermelon" />
                 </button>
               </div>
             )}
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
        
                                              {/* Donation Box - Bottom Left */}
           <div className="donation-box-bottom-left">
             <img src={oliveIcon} alt="Olive" className="donation-icon" />
             <div className="donation-info">
               <div className="donation-amount">1,236,346$</div>
               <div className="donation-label">raised so far</div>
             </div>
                           <button className="donation-refresh-btn" title="Refresh" onClick={handleRefreshBackground}>
                <img src={RefreshIconBlack} width="16" height="16" alt="Refresh" />
              </button>
           </div>
         
         {/* 3rd Advertisement - Below Donations Box */}
         {adCount >= 3 && (
           <div style={{ position: 'relative' }}>
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
           </div>
         )}
         
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
      
      {/* Embedded Advertisements - Side Ads */}
      {adCount >= 1 && (
        <EmbeddedAdComponent position="bottom-right" adIndex={0} />
      )}
      {adCount >= 2 && (
        <EmbeddedAdComponent position="bottom-right-top" adIndex={1} />
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
