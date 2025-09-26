import { useState, useEffect, useRef } from 'react'
import AdComponent from './AdComponent'
import EthiclyAdComponent from './EthiclyAdComponent'
import AdvertisementsUpgrade from './AdvertisementsUpgrade'
import AboutPage from './AboutPage'
import AuthComponent from './AuthComponent'
import GamificationModal from './GamificationModal'
import { auth, userProfile, donationTracker, sponsoredTracker, gamificationTracker } from '../lib/supabase'

import './NewTab.css'
import './GamificationModal.css'
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

function SettingsModal({ open, onClose, toggles, setToggles, backgroundMode, setBackgroundMode, onUploadBackground, adCount, onAdUpgrade, sponsoredShortcutsCount, setSponsoredShortcutsCount, showMoneyRaised, setShowMoneyRaised, showShortcuts, setShowShortcuts, shortcutsType, setShortcutsType, onAuthChange, onShowWallpaperModal, selectedWallpaper, customWallpaperEnabled, onCustomWallpaperToggle }: { open: boolean, onClose: () => void, toggles: any, setToggles: (t: any) => void, backgroundMode: string, setBackgroundMode: (m: string) => void, onUploadBackground: (file: File) => void, adCount: number, onAdUpgrade: (count: number) => void, sponsoredShortcutsCount: number, setSponsoredShortcutsCount: (count: number) => void, showMoneyRaised: boolean, setShowMoneyRaised: (show: boolean) => void, showShortcuts: boolean, setShowShortcuts: (show: boolean) => void, shortcutsType: 'advertisements' | 'most-visited' | 'favorites', setShortcutsType: (type: 'advertisements' | 'most-visited' | 'favorites') => void, onAuthChange: (user: any) => void, onShowWallpaperModal: () => void, selectedWallpaper: any, customWallpaperEnabled: boolean, onCustomWallpaperToggle: (enabled: boolean) => void }) {
  const [activeTab, setActiveTab] = useState('General');
  const fileInputRef = useRef<HTMLInputElement>(null);
  if (!open) return null;
  return (
    <div className="t4p-modal-bubble-overlay" onClick={onClose}>
      <div className="t4p-modal-bubble" onClick={e => e.stopPropagation()}>
        <button className="t4p-modal-close" onClick={onClose} style={{position: 'absolute', top: 16, right: 18}}>×</button>
        <div className="t4p-modal-tabs">
          {['General', 'Background', 'Advertisements', 'Shortcuts', 'Account', 'About'].map(tab => (
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
                <span className="t4p-toggle-label">Show Apps Grid</span>
                <label className="t4p-switch">
                  <input type="checkbox" checked={toggles.apps} onChange={e => setToggles({...toggles, apps: e.target.checked})} />
                  <span className="t4p-slider"></span>
                </label>
              </div>
              <div className="t4p-toggle-row">
                <span className="t4p-toggle-label">Show News</span>
                <label className="t4p-switch">
                  <input type="checkbox" checked={toggles.news} onChange={e => setToggles({...toggles, news: e.target.checked})} />
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
              <div className="t4p-toggle-row">
                <span className="t4p-toggle-label">Show Money Raised</span>
                <label className="t4p-switch">
                  <input type="checkbox" checked={showMoneyRaised} onChange={e => setShowMoneyRaised(e.target.checked)} />
                  <span className="t4p-slider"></span>
                </label>
              </div>
            </div>
          )}
          {activeTab === 'Background' && (
            <div className="t4p-background-settings">
              {/* Appearance Section */}
              <div className="t4p-appearance-section">
                <h3 className="t4p-section-title">Appearance</h3>
                
                {/* Theme Section */}
                <div className="t4p-theme-section">
                  <div className="t4p-theme-header">
                    <h4 className="t4p-subsection-title">Theme</h4>
                    <p className="t4p-subsection-description">Changes the overall look of your homepage</p>
                  </div>
                  
                  <div className="t4p-theme-options">
                    <button 
                      className={`t4p-theme-btn${backgroundMode === 'default' ? ' t4p-theme-btn-active' : ''}`} 
                      onClick={() => setBackgroundMode('default')}
                    >
                      <span>Default</span>
                    </button>
                    
                    <button 
                      className={`t4p-theme-btn${backgroundMode === 'gallery' ? ' t4p-theme-btn-active' : ''}`} 
                      onClick={() => setBackgroundMode('gallery')}
                    >
                      <span>Gallery</span>
                    </button>
                    
                    <button 
                      className={`t4p-theme-btn${backgroundMode === 'dark' ? ' t4p-theme-btn-active' : ''}`} 
                      onClick={() => setBackgroundMode('dark')}
                    >
                      <span>Dark</span>
                    </button>
                  </div>
                </div>

                {/* Wallpaper Section */}
                <div className="t4p-wallpaper-section">
                  <div className="t4p-wallpaper-header">
                    <h4 className="t4p-subsection-title">Wallpaper</h4>
                    <p className="t4p-subsection-description">Customize your homepage</p>
                  </div>
                  
                  <div className="t4p-wallpaper-toggle">
                    <div className="t4p-toggle-row">
                      <span className="t4p-toggle-label">Enable Custom Wallpaper</span>
                      <label className="t4p-switch">
                        <input 
                          type="checkbox" 
                          checked={customWallpaperEnabled} 
                          onChange={e => onCustomWallpaperToggle(e.target.checked)} 
                        />
                        <span className="t4p-slider"></span>
                      </label>
                    </div>
                  </div>
                  
                  {customWallpaperEnabled && (
                    <div className="t4p-wallpaper-preview">
                      <div className="t4p-wallpaper-preview-image">
                        <img 
                          src={selectedWallpaper.image} 
                          alt={`${selectedWallpaper.name} preview`}
                          className="t4p-preview-img"
                        />
                      </div>
                      <div className="t4p-wallpaper-preview-info">
                        <span className="t4p-preview-title">{selectedWallpaper.name}</span>
                        <button 
                          className="t4p-edit-background-btn"
                          onClick={onShowWallpaperModal}
                        >
                          Edit Background
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {activeTab === 'Advertisements' && (
            <div>
              <AdvertisementsUpgrade 
                currentAdCount={adCount} 
                onUpgrade={onAdUpgrade} 
              />
            </div>
          )}
          {activeTab === 'Account' && (
            <AuthComponent 
              onAuthChange={onAuthChange} 
              gamificationUser={null}
              totalDonations={0}
            />
          )}
          {activeTab === 'Shortcuts' && (
            <div className="t4p-shortcuts-section">
              <div className="t4p-shortcuts-header">
                <h3>Shortcuts Settings</h3>
                <div className="t4p-shortcuts-toggle">
                  <span className="t4p-toggle-label">Show Shortcuts</span>
                  <label className="t4p-switch">
                    <input 
                      type="checkbox" 
                      checked={showShortcuts} 
                      onChange={e => setShowShortcuts(e.target.checked)} 
                    />
                    <span className="t4p-slider"></span>
                  </label>
                </div>
              </div>
              
              {showShortcuts && (
                <div className="t4p-shortcuts-type-section">
                  <div className="t4p-shortcuts-type-header">
                    <h4>Shortcut Type</h4>
                    <p>Choose what type of shortcuts to display</p>
                  </div>
                  
                  <div className="t4p-shortcuts-type-options">
                    <label className="t4p-shortcuts-type-option">
                      <input
                        type="radio"
                        name="shortcutsType"
                        value="advertisements"
                        checked={shortcutsType === 'advertisements'}
                        onChange={e => {
                          console.log('Shortcut type changed to:', e.target.value);
                          setShortcutsType(e.target.value as 'advertisements' | 'most-visited' | 'favorites');
                        }}
                      />
                      <div className="t4p-option-content">
                        <div className="t4p-option-title">Sponsored Advertisements</div>
                        <div className="t4p-option-description">Show sponsored shortcuts that support Palestinian causes</div>
                      </div>
                    </label>
                    
                    <label className="t4p-shortcuts-type-option">
                      <input
                        type="radio"
                        name="shortcutsType"
                        value="most-visited"
                        checked={shortcutsType === 'most-visited'}
                        onChange={e => {
                          console.log('Shortcut type changed to:', e.target.value);
                          setShortcutsType(e.target.value as 'advertisements' | 'most-visited' | 'favorites');
                        }}
                      />
                      <div className="t4p-option-content">
                        <div className="t4p-option-title">Most Visited</div>
                        <div className="t4p-option-description">Show your most frequently visited websites</div>
                      </div>
                    </label>
                    
                    <label className="t4p-shortcuts-type-option">
                      <input
                        type="radio"
                        name="shortcutsType"
                        value="favorites"
                        checked={shortcutsType === 'favorites'}
                        onChange={e => {
                          console.log('Shortcut type changed to:', e.target.value);
                          setShortcutsType(e.target.value as 'advertisements' | 'most-visited' | 'favorites');
                        }}
                      />
                      <div className="t4p-option-content">
                        <div className="t4p-option-title">Favorites</div>
                        <div className="t4p-option-description">Show your bookmarked favorite websites</div>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Sponsored Shortcuts Section */}
              <div className="t4p-sponsored-shortcuts-section">
                <div className="t4p-sponsored-header">
                  <h3>Sponsored Shortcuts</h3>
                  <div className="t4p-sponsored-earnings">
                    <span className="t4p-earnings-text">10 clicks = $5 (max 10/day)</span>
                  </div>
                </div>
                
                <div className="t4p-sponsored-control-box">
                  <div className="t4p-sponsored-controls">
                    <label className="t4p-sponsored-label">
                      Show {sponsoredShortcutsCount} shortcuts
                    </label>
                    <div className="t4p-slider-container">
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={sponsoredShortcutsCount}
                        onChange={(e) => setSponsoredShortcutsCount(parseInt(e.target.value))}
                        className="t4p-sponsored-slider"
                      />
                      <div className="t4p-slider-labels">
                        <span>0</span>
                        <span>10</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="t4p-sponsored-explanation">
                    <div className="t4p-explanation-title">💡 How Sponsored Shortcuts Work</div>
                    <div className="t4p-explanation-text">
                      Sponsored shortcuts are carefully selected websites that support Palestinian causes. 
                      Each click on a sponsored shortcut generates $0.50 in donations. You can choose how many 
                      sponsored shortcuts to display (0-10), and you can earn up to $5 per day through clicks. 
                      These shortcuts appear alongside your regular shortcuts and help fund Palestinian relief efforts.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'About' && <AboutPage />}
        </div>
      </div>
    </div>
  );
}

// Wallpaper Selection Modal Component
function WallpaperModal({ open, onClose, onSelectWallpaper }: { open: boolean, onClose: () => void, onSelectWallpaper: (wallpaper: any) => void }) {
  const [selectedCategory, setSelectedCategory] = useState<'palestine' | 'basic'>('palestine');
  
  if (!open) return null;

  const wallpaperCategories = {
    palestine: [
      {
        id: 'abu-adel-gaza-day',
        name: 'Gaza at Day',
        photographer: 'Abu Adel',
        description: 'Gaza at Day',
        image: '/img/backgrounds/abu-adel-gaza-at-day.jpg'
      },
      {
        id: 'ala-j-graczyk-bethlehem',
        name: 'Bethlehem, Palestine',
        photographer: 'Ala J Graczyk',
        description: 'Bethlehem, Palestine',
        image: '/img/backgrounds/ala-j-graczyk-bethlehem-palestine.jpg'
      },
      {
        id: 'belal-salem-gaza-night',
        name: 'Gaza at Night',
        photographer: 'Belal Salem',
        description: 'Gaza at Night',
        image: '/img/backgrounds/belal-salem-gaza-at-night.jpg'
      },
      {
        id: 'haley-black-jerusalem',
        name: 'Jerusalem',
        photographer: 'Haley Black',
        description: 'Jerusalem',
        image: '/img/backgrounds/haley-black-jerusalem.jpg'
      },
      {
        id: 'haley-black-jerusalem-palestine',
        name: 'Jerusalem, Palestine',
        photographer: 'Haley Black',
        description: 'Jerusalem, Palestine',
        image: '/img/backgrounds/haley-black-jerusalem-palestine.jpg'
      },
      {
        id: 'haley-black-dead-sea',
        name: 'Western Shore of the Dead Sea',
        photographer: 'Haley Black',
        description: 'Western Shore of the Dead Sea',
        image: '/img/backgrounds/haley-black-western-shore-of-the-dead-sea.jpg'
      },
      {
        id: 'leon-natan-jerusalem',
        name: 'Jerusalem, Palestine',
        photographer: 'Leon Natan',
        description: 'Jerusalem, Palestine',
        image: '/img/backgrounds/leon-natan-jerusalem-palestine.jpg'
      },
      {
        id: 'musa-alzanoun-jerusalem',
        name: 'Jerusalem, Palestine',
        photographer: 'Musa Alzanoun',
        description: 'Jerusalem, Palestine',
        image: '/img/backgrounds/musa-alzanoun-jerusalem-palestine.jpg'
      }
    ],
    basic: [
      {
        id: 'default-wallpaper',
        name: 'Default Wallpaper',
        photographer: 'Tabs4Palestine',
        description: 'Default Wallpaper',
        image: '/img/backgrounds/background-default-wallpaper.png'
      },
      {
        id: 'samer-zeton-al-ain',
        name: 'Rocky Landscape of Al Ain',
        photographer: 'Samer Zeton',
        description: 'Rocky Landscape of Al Ain',
        image: '/img/backgrounds/Samer-Zeton-rocky-landscape-of-al-ain.jpg'
      },
      {
        id: 'emiliano-arano-la-pampa',
        name: 'La Pampa, Argentina',
        photographer: 'Emiliano Arano',
        description: 'La Pampa, Argentina',
        image: '/img/backgrounds/emiliano-arano-la-pampa-argentina.jpg'
      },
      {
        id: 'white-clouds-pixabay',
        name: 'White Clouds',
        photographer: 'Pixabay',
        description: 'White Clouds',
        image: '/img/backgrounds/white-clouds-pixabay.jpg'
      }
    ]
  };

  return (
    <div className="t4p-modal-overlay" onClick={onClose}>
      <div className="t4p-wallpaper-modal" onClick={e => e.stopPropagation()}>
        <button className="t4p-modal-close" onClick={onClose}>×</button>
        
        <div className="t4p-wallpaper-modal-header">
          <h2>Wallpaper</h2>
          <p>Customize your homepage</p>
        </div>

        <div className="t4p-wallpaper-categories">
          <button 
            className={`t4p-category-btn${selectedCategory === 'palestine' ? ' t4p-category-btn-active' : ''}`}
            onClick={() => setSelectedCategory('palestine')}
          >
            Palestine
          </button>
          <button 
            className={`t4p-category-btn${selectedCategory === 'basic' ? ' t4p-category-btn-active' : ''}`}
            onClick={() => setSelectedCategory('basic')}
          >
            Basic Background
          </button>
        </div>

        <div className="t4p-wallpaper-grid">
          {wallpaperCategories[selectedCategory].map((wallpaper) => (
            <div 
              key={wallpaper.id} 
              className="t4p-wallpaper-item"
              onClick={() => {
                onSelectWallpaper(wallpaper);
                onClose();
              }}
            >
              <div className="t4p-wallpaper-item-image">
                <img src={wallpaper.image} alt={wallpaper.name} />
              </div>
              <div className="t4p-wallpaper-item-info">
                <h4>{wallpaper.name}</h4>
                <p className="t4p-photographer">by {wallpaper.photographer}</p>
                <p className="t4p-description">{wallpaper.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const NewTab = () => {
  console.log('NewTab component starting...');
  
  // Import all gallery images from public/img/backgrounds
  // Only include images that actually exist in the public folder
  const backgroundImageNames = [
    'abu-adel-gaza-at-day.jpg',
    'ala-j-graczyk-bethlehem-palestine.jpg',
    'belal-salem-gaza-at-night.jpg',
    'emiliano-arano-la-pampa-argentina.jpg',
    'haley-black-jerusalem-palestine.jpg',
    'haley-black-jerusalem.jpg',
    'haley-black-western-shore-of-the-dead-sea.jpg',
    'leon-natan-jerusalem-palestine.jpg',
    'musa-alzanoun-jerusalem-palestine.jpg',
    'Samer-Zeton-rocky-landscape-of-al-ain.jpg',
    'white-clouds-pixabay.jpg'
  ]
  
  // Gallery images array using public directory
  const galleryImages = backgroundImageNames.map(name => `/img/backgrounds/${name}`)
  
  const getAvailableBackgroundImages = () => {
    // For now, return all images - we'll handle loading errors when actually using them
    return galleryImages;
  };
  const [searchQuery, setSearchQuery] = useState('')
  const [time, setTime] = useState('')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [customWallpaperEnabled, setCustomWallpaperEnabled] = useState(false);
  // const [gamificationUserData, setGamificationUserData] = useState<any>(null);
  const [toggles, setToggles] = useState({
    apps: true,
    logo: true,
    clock: true,
    search: true,
    news: true
  })
  const [backgroundMode, setBackgroundMode] = useState('default');
  const [customBg, setCustomBg] = useState<string | null>(null);
  const [galleryBg, setGalleryBg] = useState('/img/backgrounds/pexels-gaza-8660631.jpg');
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
   const [totalDonations, setTotalDonations] = useState(0);
  const [sponsoredShortcutsCount, setSponsoredShortcutsCount] = useState(8);
  const [shortcuts, setShortcuts] = useState([
    { name: 'Huda Beauty', url: 'https://www.hudabeauty.com', icon: '/img/8_icons/huda-beauty.png' },
    { name: 'Watan Apparel', url: 'https://www.watanapparel.com', icon: '/img/8_icons/watan.png' },
    { name: 'Farsali', url: 'https://www.farsali.com', icon: '/img/8_icons/farsali.png' },
    { name: 'Wear The Peace', url: 'https://www.wearthepeace.com', icon: '/img/8_icons/wear_the_peacelogo.png' },
    { name: 'Ben & Jerry\'s', url: 'https://www.benjerry.com', icon: '/img/8_icons/white-Ben-and-Jerrys-Logo-1990s-500x281.png' },
    { name: 'Darzah', url: 'https://www.darzah.org', icon: '/img/8_icons/white-darzah_logo.png' },
    { name: 'NOL Collective', url: 'https://www.nolcollective.com', icon: '/img/8_icons/white-nol-collective.png' },
    { name: 'SEP', url: 'https://www.sep.com', icon: '/img/8_icons/white-sep_icon_512x512.png' },
    { name: 'Lush', url: 'https://www.lush.com', icon: '/img/8_icons/01-scaled-2.jpg' },
    { name: 'Paliroots', url: 'https://www.paliroots.com', icon: '/img/8_icons/paliroots-logo.png' }
  ]);
  const [filteredShortcuts, setFilteredShortcuts] = useState(shortcuts.slice(0, sponsoredShortcutsCount));
  const [showShortcutModal, setShowShortcutModal] = useState(false);
  const [newShortcut, setNewShortcut] = useState({ name: '', url: '' });
  const [shortcutError, setShortcutError] = useState('');
  const [showLogoToggle, setShowLogoToggle] = useState(false);
  const [showMoneyRaised, setShowMoneyRaised] = useState(true);
  const [showShortcuts, setShowShortcuts] = useState(true);
  const [shortcutsType, setShortcutsType] = useState<'advertisements' | 'most-visited' | 'favorites'>('advertisements');
  const [gamificationRefreshTrigger, setGamificationRefreshTrigger] = useState(0);
  const [showWallpaperModal, setShowWallpaperModal] = useState(false);
  const [selectedWallpaper, setSelectedWallpaper] = useState({
    id: 'default-wallpaper',
    name: 'Default Wallpaper',
    photographer: 'Tabs4Palestine',
    description: 'Default Wallpaper',
    image: '/img/backgrounds/background-default-wallpaper.png'
  });

  // Wallpaper data structure
  const mainWallpaperCategories = {
    palestine: [
      {
        id: 'abu-adel-gaza-day',
        name: 'Gaza at Day',
        photographer: 'Abu Adel',
        description: 'Gaza at Day',
        image: '/img/backgrounds/abu-adel-gaza-at-day.jpg'
      },
      {
        id: 'ala-j-graczyk-bethlehem',
        name: 'Bethlehem, Palestine',
        photographer: 'Ala J Graczyk',
        description: 'Bethlehem, Palestine',
        image: '/img/backgrounds/ala-j-graczyk-bethlehem-palestine.jpg'
      },
      {
        id: 'belal-salem-gaza-night',
        name: 'Gaza at Night',
        photographer: 'Belal Salem',
        description: 'Gaza at Night',
        image: '/img/backgrounds/belal-salem-gaza-at-night.jpg'
      },
      {
        id: 'haley-black-jerusalem',
        name: 'Jerusalem',
        photographer: 'Haley Black',
        description: 'Jerusalem',
        image: '/img/backgrounds/haley-black-jerusalem.jpg'
      },
      {
        id: 'haley-black-jerusalem-palestine',
        name: 'Jerusalem, Palestine',
        photographer: 'Haley Black',
        description: 'Jerusalem, Palestine',
        image: '/img/backgrounds/haley-black-jerusalem-palestine.jpg'
      },
      {
        id: 'haley-black-dead-sea',
        name: 'Western Shore of the Dead Sea',
        photographer: 'Haley Black',
        description: 'Western Shore of the Dead Sea',
        image: '/img/backgrounds/haley-black-western-shore-of-the-dead-sea.jpg'
      },
      {
        id: 'leon-natan-jerusalem',
        name: 'Jerusalem, Palestine',
        photographer: 'Leon Natan',
        description: 'Jerusalem, Palestine',
        image: '/img/backgrounds/leon-natan-jerusalem-palestine.jpg'
      },
      {
        id: 'musa-alzanoun-jerusalem',
        name: 'Jerusalem, Palestine',
        photographer: 'Musa Alzanoun',
        description: 'Jerusalem, Palestine',
        image: '/img/backgrounds/musa-alzanoun-jerusalem-palestine.jpg'
      }
    ],
    basic: [
      {
        id: 'default-wallpaper',
        name: 'Default Wallpaper',
        photographer: 'Tabs4Palestine',
        description: 'Default Wallpaper',
        image: '/img/backgrounds/background-default-wallpaper.png'
      },
      {
        id: 'samer-zeton-al-ain',
        name: 'Rocky Landscape of Al Ain',
        photographer: 'Samer Zeton',
        description: 'Rocky Landscape of Al Ain',
        image: '/img/backgrounds/Samer-Zeton-rocky-landscape-of-al-ain.jpg'
      },
      {
        id: 'emiliano-arano-la-pampa',
        name: 'La Pampa, Argentina',
        photographer: 'Emiliano Arano',
        description: 'La Pampa, Argentina',
        image: '/img/backgrounds/emiliano-arano-la-pampa-argentina.jpg'
      },
      {
        id: 'white-clouds-pixabay',
        name: 'White Clouds',
        photographer: 'Pixabay',
        description: 'White Clouds',
        image: '/img/backgrounds/white-clouds-pixabay.jpg'
      }
    ]
  };

  // State for most visited sites
  const [mostVisitedSites, setMostVisitedSites] = useState<any[]>([]);
  const [favoriteSites, setFavoriteSites] = useState<any[]>([]);

  // Load most visited sites from Chrome API
  useEffect(() => {
    const loadMostVisitedSites = async () => {
      try {
        if (chrome?.topSites) {
          const sites = await chrome.topSites.get();
          console.log('Loaded most visited sites:', sites);
          setMostVisitedSites(sites.slice(0, 10)); // Limit to 10 sites
        } else {
          console.warn('Chrome topSites API not available');
        }
      } catch (error) {
        console.error('Error loading most visited sites:', error);
      }
    };

    if (shortcutsType === 'most-visited') {
      loadMostVisitedSites();
    }
  }, [shortcutsType]);

  // Load favorite sites from Chrome bookmarks API
  useEffect(() => {
    const loadFavoriteSites = async () => {
      try {
        if (chrome?.bookmarks) {
          const bookmarks = await chrome.bookmarks.getTree();
          const extractBookmarks = (nodes: any[]): any[] => {
            let result: any[] = [];
            for (const node of nodes) {
              if (node.url) {
                result.push({
                  id: node.id,
                  title: node.title,
                  url: node.url,
                  favicon: `https://www.google.com/s2/favicons?domain=${new URL(node.url).hostname}&sz=32`
                });
              }
              if (node.children) {
                result = result.concat(extractBookmarks(node.children));
              }
            }
            return result;
          };
          const favorites = extractBookmarks(bookmarks).slice(0, 10); // Limit to 10 sites
          console.log('Loaded favorite sites:', favorites);
          setFavoriteSites(favorites);
        } else {
          console.warn('Chrome bookmarks API not available');
        }
      } catch (error) {
        console.error('Error loading favorite sites:', error);
      }
    };

    if (shortcutsType === 'favorites') {
      loadFavoriteSites();
    }
  }, [shortcutsType]);

  // Function to get filtered shortcuts based on type
  const getFilteredShortcuts = () => {
    console.log('Getting filtered shortcuts for type:', shortcutsType);
    console.log('Total shortcuts available:', shortcuts.length);
    console.log('Sponsored shortcuts count:', sponsoredShortcutsCount);
    
    switch (shortcutsType) {
      case 'advertisements':
        const ads = shortcuts.slice(0, sponsoredShortcutsCount);
        console.log('Returning advertisements:', ads.length);
        return ads;
      case 'most-visited':
        console.log('Most visited mode - returning sites:', mostVisitedSites.length);
        return mostVisitedSites.map(site => ({
          id: site.url,
          title: site.title,
          url: site.url,
          favicon: `https://www.google.com/s2/favicons?domain=${new URL(site.url).hostname}&sz=32`
        }));
      case 'favorites':
        console.log('Favorites mode - returning bookmarks:', favoriteSites.length);
        return favoriteSites;
      default:
        const defaultShortcuts = shortcuts.slice(0, sponsoredShortcutsCount);
        console.log('Returning default:', defaultShortcuts.length);
        return defaultShortcuts;
    }
  };

  // Update filtered shortcuts when shortcutsType or sponsoredShortcutsCount changes
  useEffect(() => {
    try {
      const newShortcuts = getFilteredShortcuts();
      setFilteredShortcuts(newShortcuts);
    } catch (error) {
      console.error('Error updating filtered shortcuts:', error);
      // Fallback to sponsored shortcuts
      setFilteredShortcuts(shortcuts.slice(0, sponsoredShortcutsCount));
    }
  }, [shortcutsType, sponsoredShortcutsCount]);

  // Initialize filtered shortcuts on component mount
  useEffect(() => {
    if (filteredShortcuts.length === 0) {
      setFilteredShortcuts(shortcuts.slice(0, sponsoredShortcutsCount));
    }
  }, []);

  // Function to add new shortcut
  const addShortcut = () => {
    console.log('Adding shortcut:', newShortcut);
    if (!newShortcut.name || !newShortcut.url) {
      setShortcutError('Name and URL are required.');
      return;
    }
    
    // Check if we already have 10 shortcuts
    if (shortcuts.length >= 10) {
      setShortcutError('Maximum of 10 shortcuts allowed.');
      return;
    }
    
    // Create a default icon (you can replace this with a generic icon)
    const defaultIcon = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMiA3VjIwSDEwVjE0SDE0VjIwSDIyVjdMMTIgMloiIGZpbGw9IiMxODgwMzgiLz4KPC9zdmc+';
    
    const shortcutWithIcon = { ...newShortcut, icon: defaultIcon };
    console.log('Adding shortcut with icon:', shortcutWithIcon);
    
    const newShortcuts = [...shortcuts, shortcutWithIcon];
    setShortcuts(newShortcuts);
    
    // Update filtered shortcuts if we're in advertisements mode
    if (shortcutsType === 'advertisements') {
      const newFilteredShortcuts = newShortcuts.slice(0, sponsoredShortcutsCount);
      setFilteredShortcuts(newFilteredShortcuts);
    }
    
    console.log('Shortcuts after adding:', newShortcuts);
    setShowShortcutModal(false);
    setNewShortcut({ name: '', url: '' });
    setShortcutError('');
  };

  // Load settings from storage on mount
  useEffect(() => {
    chrome.storage.sync.get(['adCount', 'backgroundMode', 'sponsoredShortcutsCount', 'showMoneyRaised', 'selectedWallpaper', 'galleryBg', 'customWallpaperEnabled', 'totalDonations'], (result: { adCount?: number, backgroundMode?: string, sponsoredShortcutsCount?: number, showMoneyRaised?: boolean, selectedWallpaper?: any, galleryBg?: string, customWallpaperEnabled?: boolean, totalDonations?: number }) => {
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
      if (result.sponsoredShortcutsCount !== undefined) {
        setSponsoredShortcutsCount(result.sponsoredShortcutsCount);
      }
      if (result.showMoneyRaised !== undefined) {
        setShowMoneyRaised(result.showMoneyRaised);
      }
      if (result.selectedWallpaper) {
        setSelectedWallpaper(result.selectedWallpaper);
      }
      if (result.galleryBg) {
        setGalleryBg(result.galleryBg);
      }
      if (result.customWallpaperEnabled !== undefined) {
        setCustomWallpaperEnabled(result.customWallpaperEnabled);
      }
      // Load the last saved total donations value
      if (result.totalDonations !== undefined) {
        console.log('Loading total donations from storage:', result.totalDonations);
        setTotalDonations(result.totalDonations);
      }
    });

    // Track tab open when component mounts (new tab opened)
    trackTabOpen();
  }, []);

  // Load total donations from database
  const loadTotalDonations = async () => {
    try {
      console.log('Loading total donations from database...');
      const { data, error } = await donationTracker.getTotalDonations();
      console.log('Database response:', { data, error });
      
      if (error) {
        console.error('Error loading total donations:', error);
        // Keep current value if there's an error
        return;
      } else {
        const newTotal = data || 0;
        console.log('Setting total donations to:', newTotal);
        setTotalDonations(newTotal);
        // Save to storage so it persists across new tabs
        chrome.storage.sync.set({ totalDonations: newTotal }, () => {
          console.log('Total donations saved to storage:', newTotal);
        });
      }
    } catch (error) {
      console.error('Error loading total donations:', error);
    }
  };

  // Track tab open
  const trackTabOpen = async () => {
    try {
      await donationTracker.trackTabOpen(currentUser?.id || null, adCount);
      
      // Update gamification stats if user is logged in
      if (currentUser?.id) {
        await gamificationTracker.updateUserStats(currentUser.id, true, false);
        // Reload gamification user data
        const gamificationResult = await gamificationTracker.getUserProfile(currentUser.id);
        if (gamificationResult.success) {
          // setGamificationUserData(gamificationResult.data);
        }
        // Trigger gamification modal refresh
        setGamificationRefreshTrigger(prev => prev + 1);
      }
      
      // Don't automatically reload total donations - only update on refresh button click
    } catch (error) {
      console.error('Error tracking tab open:', error);
    }
  };

  // Save ad count to storage when it changes
  const handleAdUpgrade = async (count: number) => {
    setAdCount(count);
    chrome.storage.sync.set({ adCount: count });
    
    // Update user's ad count in database if logged in
    if (currentUser?.id) {
      try {
        await userProfile.updateProfile(currentUser.id, { ad_count: count });
      } catch (error) {
        console.error('Error updating ad count in database:', error);
      }
    }
  };

  // Save sponsored shortcuts count to storage when it changes
  const handleSponsoredShortcutsChange = (count: number) => {
    setSponsoredShortcutsCount(count);
    chrome.storage.sync.set({ sponsoredShortcutsCount: count });
  };

  const handleShowMoneyRaisedChange = (show: boolean) => {
    setShowMoneyRaised(show);
    chrome.storage.sync.set({ showMoneyRaised: show });
  };

  const handleCustomWallpaperToggle = (enabled: boolean) => {
    setCustomWallpaperEnabled(enabled);
    chrome.storage.sync.set({ customWallpaperEnabled: enabled });
    
    if (enabled) {
      // When enabling custom wallpaper, set background to default mode
      setBackgroundMode('default');
      chrome.storage.sync.set({ backgroundMode: 'default' });
      console.log('Custom wallpaper enabled, background set to default mode');
    } else {
      // If disabling custom wallpaper, reset to default background
      if (backgroundMode === 'gallery') {
        setBackgroundMode('default');
        chrome.storage.sync.set({ backgroundMode: 'default' });
      }
    }
  };

  // Save background mode to storage when it changes
  const handleBackgroundModeChange = (mode: string) => {
    console.log('Changing background mode to:', mode);
    setBackgroundMode(mode);
    chrome.storage.sync.set({ backgroundMode: mode });
    
    // If switching to gallery or dark mode, disable custom wallpaper
    if (mode === 'gallery' || mode === 'dark') {
      setCustomWallpaperEnabled(false);
      chrome.storage.sync.set({ customWallpaperEnabled: false });
      console.log('Switched to', mode, 'mode, disabled custom wallpaper');
    }
    
    // If switching to gallery mode, immediately pick a random image
    if (mode === 'gallery') {
      const availableImages = getAvailableBackgroundImages();
      console.log('Available gallery images:', availableImages);
      if (availableImages.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableImages.length);
        const selectedImage = availableImages[randomIndex];
        console.log('Setting gallery background to:', selectedImage);
        setGalleryBg(selectedImage);
        // Save the gallery background to storage
        chrome.storage.sync.set({ galleryBg: selectedImage });
      } else {
        console.warn('No gallery images available');
      }
    }
  };

  const handleWallpaperSelection = (wallpaper: any) => {
    console.log('Wallpaper selected:', wallpaper);
    console.log('Custom wallpaper enabled:', customWallpaperEnabled);
    
    if (!customWallpaperEnabled) {
      console.log('Custom wallpaper not enabled, ignoring selection');
      return;
    }
    
    // If default wallpaper is selected, set background to default mode
    if (wallpaper.id === 'default-wallpaper') {
      console.log('Default wallpaper selected, setting background to default mode');
      setBackgroundMode('default');
      setSelectedWallpaper(wallpaper);
      
      chrome.storage.sync.set({ 
        backgroundMode: 'default',
        selectedWallpaper: wallpaper,
        customWallpaperEnabled: true
      }, () => {
        console.log('Default wallpaper settings saved to storage');
      });
      return;
    }
    
    console.log('Setting custom wallpaper permanently:', wallpaper.image);
    console.log('Current galleryBg before update:', galleryBg);
    console.log('Current backgroundMode before update:', backgroundMode);
    
    // Set the wallpaper as a permanent custom background (not gallery mode)
    setGalleryBg(wallpaper.image);
    setBackgroundMode('custom'); // Use 'custom' mode instead of 'gallery'
    setSelectedWallpaper(wallpaper);
    
    console.log('State updates called - galleryBg:', wallpaper.image, 'backgroundMode: custom');
    
    chrome.storage.sync.set({ 
      backgroundMode: 'custom',
      galleryBg: wallpaper.image,
      selectedWallpaper: wallpaper,
      customWallpaperEnabled: true
    }, () => {
      console.log('Custom wallpaper settings saved to storage');
      console.log('Saved data:', { backgroundMode: 'custom', galleryBg: wallpaper.image, selectedWallpaper: wallpaper });
    });
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
        
        // Load gamification user data
        const gamificationResult = await gamificationTracker.getUserProfile(user.id);
        if (gamificationResult.success) {
          // setGamificationUserData(gamificationResult.data);
        }
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
    try {
      checkCurrentUser()
    } catch (error) {
      console.error('Error checking current user:', error);
    }
  }, [])

  // Subscribe to real-time donation updates
  useEffect(() => {
    try {
      const subscription = donationTracker.subscribeToDonationUpdates((total) => {
        setTotalDonations(total);
        // Save to storage so it persists across new tabs
        chrome.storage.sync.set({ totalDonations: total }, () => {
          console.log('Real-time donation update saved to storage:', total);
        });
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error('Error subscribing to donation updates:', error);
    }
  }, []);

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

  // Gallery mode rotation on new tab open
  useEffect(() => {
    // Rotate gallery image each time component mounts (new tab opened)
    if (backgroundMode === 'gallery') {
      const availableImages = getAvailableBackgroundImages();
      if (availableImages.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableImages.length);
        const newImage = availableImages[randomIndex];
        console.log('New tab opened - rotating to new gallery image:', newImage);
        setGalleryBg(newImage);
      }
    }
  }, []); // Empty dependency array means this runs on every mount (new tab)

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

  const handleRefreshDonations = async () => {
    // Only reload total donations, don't track tab opens
    loadTotalDonations();
  };

  const handleSponsoredShortcutClick = async (shortcut: { name: string, url: string }) => {
    try {
      await sponsoredTracker.trackSponsoredClick(currentUser?.id || null, shortcut.name, shortcut.url);
      
      // Update gamification stats if user is logged in
      if (currentUser?.id) {
        await gamificationTracker.updateUserStats(currentUser.id, false, true);
        // Reload gamification user data
        const gamificationResult = await gamificationTracker.getUserProfile(currentUser.id);
        if (gamificationResult.success) {
          // setGamificationUserData(gamificationResult.data);
        }
        // Trigger gamification modal refresh
        setGamificationRefreshTrigger(prev => prev + 1);
      }
      
      // Don't automatically reload total donations - only update on refresh button click
    } catch (error) {
      console.error('Error tracking sponsored click:', error);
    }
  };

  const handleLogoToggle = () => {
    setShowLogoToggle(!showLogoToggle);
  };

  const handleLogoTypeChange = (type: 'logo' | 'clock' | 'watermelon') => {
    setLogoType(type);
    setShowLogoToggle(false);
  };

  // Debug effect to monitor galleryBg changes
  useEffect(() => {
    console.log('galleryBg changed to:', galleryBg);
  }, [galleryBg]);

  // Debug effect to monitor backgroundMode changes
  useEffect(() => {
    console.log('backgroundMode changed to:', backgroundMode);
  }, [backgroundMode]);

  // Debug logging for background mode
  console.log('Current background mode:', backgroundMode);
  console.log('Gallery background:', galleryBg);
  console.log('Custom background:', customBg);
  console.log('Selected wallpaper:', selectedWallpaper);
  
  const sectionStyle = backgroundMode === 'default'
    ? { background: '#F8F8F0' }
    : backgroundMode === 'classic'
    ? { background: '#fff' }
    : backgroundMode === 'upload' && customBg
    ? { backgroundImage: `url(${customBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : backgroundMode === 'gallery'
    ? { backgroundImage: `url(${galleryBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : backgroundMode === 'custom'
    ? { backgroundImage: `url(${galleryBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: '#F8F8F0' };
  
  console.log('Applied section style:', sectionStyle);
  console.log('Section style calculation - backgroundMode:', backgroundMode, 'galleryBg:', galleryBg);
  
  return (
    <section style={sectionStyle} className={backgroundMode === 'dark' ? 'dark-mode' : backgroundMode === 'default' ? 'default-mode' : backgroundMode === 'custom' ? 'custom-mode' : backgroundMode === 'gallery' ? 'gallery-mode' : ''}>
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
        sponsoredShortcutsCount={sponsoredShortcutsCount}
        setSponsoredShortcutsCount={handleSponsoredShortcutsChange}
        showMoneyRaised={showMoneyRaised}
        setShowMoneyRaised={handleShowMoneyRaisedChange}
        showShortcuts={showShortcuts}
        setShowShortcuts={setShowShortcuts}
        shortcutsType={shortcutsType}
        setShortcutsType={setShortcutsType}
        onAuthChange={(user) => {
          console.log('User auth changed:', user);
          setCurrentUser(user);
          
          if (user?.id) {
            gamificationTracker.getUserProfile(user.id).then(result => {
              if (result.success) {
                // setGamificationUserData(result.data);
              }
            });
          } else {
            // setGamificationUserData(null);
            }
          }}
          onShowWallpaperModal={() => setShowWallpaperModal(true)}
          selectedWallpaper={selectedWallpaper}
          customWallpaperEnabled={customWallpaperEnabled}
          onCustomWallpaperToggle={handleCustomWallpaperToggle}
        />
        
      <WallpaperModal
        open={showWallpaperModal}
        onClose={() => setShowWallpaperModal(false)}
        onSelectWallpaper={handleWallpaperSelection}
      />
      
      {/* Gamification Modal */}
      <GamificationModal
        open={gamificationOpen}
        onClose={() => setGamificationOpen(false)}
        currentUser={currentUser}
        refreshTrigger={gamificationRefreshTrigger}
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
                <div className={`t4p-profile-avatar ${currentUser ? 'logged-in' : 'guest'}`}>
                  {currentUser ? (
                    <span className="profile-avatar-text">
                      {currentUser.username?.charAt(0).toUpperCase() || currentUser.email?.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#666"/>
                    </svg>
                  )}
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
         {!currentUser && (
           <button className="t4p-signup-btn" onClick={() => setProfileOpen(true)}>
             Sign Up
           </button>
         )}
         {toggles.news && (
           <button className="t4p-icon-btn" title="News" onClick={() => setNotificationsOpen(v => !v)}>
             <img src={NotificationsIcon} width="24" height="24" alt="News" />
           </button>
         )}
         <button className="t4p-icon-btn" title="Profile" onClick={() => setProfileOpen(v => !v)}>
           <div className={`profile-avatar ${currentUser ? 'logged-in' : 'guest'}`}>
             {currentUser ? (
               <span className="avatar-text">
                 {currentUser.username?.charAt(0).toUpperCase() || currentUser.email?.charAt(0).toUpperCase()}
               </span>
             ) : (
               <img src={ProfileIcon} width="24" height="24" alt="Profile" />
             )}
           </div>
         </button>
         <button className="t4p-icon-btn" title="Settings" onClick={() => setSettingsOpen(true)}>
           <img src={SettingsIcon} width="24" height="24" alt="Settings" />
         </button>
         <button className="t4p-icon-btn" title="Gamification" onClick={() => setGamificationOpen(v => !v)}>
           <img src={TrophyIcon} width="24" height="24" alt="Gamification" />
         </button>
         {toggles.apps && (
           <button className="t4p-icon-btn" title="Apps" onClick={() => setAppsOpen(v => !v)}>
             <img src={AppsIcon} width="24" height="24" alt="Apps" />
           </button>
         )}
       </div>
      
      <div className="center-content">
                 {toggles.logo && (
           <div className="t4p-logo-container">
             {logoType === 'logo' && (
               <img 
                 src={backgroundMode === 'gallery' || backgroundMode === 'custom' ? '/img/tabs4_palestine_black_logo-removebg-preview.png' : backgroundMode === 'dark' ? '/img/tabs4_palestine_black_logo-removebg-preview.png' : '/img/logo_green_transparent.png'} 
                 alt="tabs4palestine logo" 
                 className="t4p-logo" 
                 style={{ transform: 'scale(1.2)' }}
               />
             )}
             {logoType === 'clock' && (
               <div className="t4p-digital-clock" style={{ color: backgroundMode === 'gallery' || backgroundMode === 'custom' ? 'white' : '#188038' }}>
                 <div className="t4p-clock-time">{time}</div>
                 <div className="t4p-clock-date">{new Date().toLocaleDateString()}</div>
               </div>
             )}
             {logoType === 'watermelon' && (
               <img 
                 src={backgroundMode === 'gallery' || backgroundMode === 'custom' ? '/img/tabs4_palestine_black_logo-removebg-preview.png' : backgroundMode === 'dark' ? '/img/tabs4_palestine_black_logo-removebg-preview.png' : '/img/logo_green_transparent.png'} 
                 alt="Tabs4Palestine Logo" 
                 className="t4p-logo" 
                 style={{ transform: 'scale(1.2)' }}
               />
             )}
             <button className="t4p-logo-toggle" title="Toggle Logo" onClick={handleLogoToggle}>
               <img 
                 src={backgroundMode === 'gallery' || backgroundMode === 'custom' ? CachedIconWhite : CachedIconBlack} 
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
           {showMoneyRaised && (
             <div className="donation-box-bottom-left">
               <button className="donation-close-btn" title="Hide" onClick={() => handleShowMoneyRaisedChange(false)}>
                 ×
               </button>
               <img src={oliveIcon} alt="Olive" className="donation-icon" />
               <div className="donation-info">
                 <div className="donation-amount">{totalDonations.toLocaleString()}$</div>
                 <div className="donation-label">raised so far</div>
               </div>
               <button className="donation-refresh-btn" title="Refresh" onClick={handleRefreshDonations}>
                 <img src={RefreshIconBlack} width="16" height="16" alt="Refresh" />
               </button>
             </div>
           )}
         
        <div className="quick-access-grid">
          {filteredShortcuts.map((shortcut, index) => (
            <a 
              key={index} 
              href={shortcut.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="quick-access-item" 
              onClick={() => {
                // Only track clicks for sponsored shortcuts, not user's own sites
                if (shortcutsType === 'advertisements') {
                  handleSponsoredShortcutClick(shortcut);
                }
              }}
            >
              <img 
                src={(shortcut as any).icon || (shortcut as any).favicon} 
                alt={(shortcut as any).name || (shortcut as any).title} 
                onError={(e) => {
                  // Fallback to a default icon if favicon fails to load
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNCIgZmlsbD0iI0Y1RjVGNSIvPgo8cGF0aCBkPSJNMTYgMTBMMjIgMTZMMTYgMjJMMTAgMTZMMTYgMTBaIiBmaWxsPSIjOTk5Ii8+Cjwvc3ZnPgo=';
                }}
              />
              <span>{(shortcut as any).name || (shortcut as any).title}</span>
            </a>
          ))}
           <div 
             className="quick-access-item" 
             onClick={() => setShowShortcutModal(true)}
             style={{ cursor: 'pointer' }}
           >
             <img 
               src="/img/8_icons/plus_sign.png" 
               alt="Add Shortcut" 
             />
             <span>
               {shortcutsType === 'favorites' ? 'Add\nFavorite' : 
                shortcutsType === 'most-visited' ? 'Add\nShortcut' : 'Add\nShortcut'}
             </span>
           </div>
         </div>
         
         {/* 3rd Advertisement - Supabase API-driven Leaderboard Ad */}
         {adCount >= 3 && (
           <EthiclyAdComponent key={`leaderboard-ad-${Date.now()}`} />
         )}
      </div>
      
      {/* Side Advertisements - Supabase Ads */}
      {adCount >= 1 && (
        <div style={{ position: 'absolute', bottom: '20px', right: '20px', zIndex: 10 }}>
          <AdComponent key={`side-ad-1-${Date.now()}`} />
        </div>
      )}
      {adCount >= 2 && (
        <div style={{ position: 'absolute', bottom: '320px', right: '20px', zIndex: 10 }}>
          <AdComponent key={`side-ad-2-${Date.now()}`} />
        </div>
      )}

      {/* Shortcut Modal */}
      {showShortcutModal && (
        <div className="t4p-shortcut-modal-overlay" onClick={() => setShowShortcutModal(false)}>
          <div className="t4p-shortcut-modal" onClick={e => e.stopPropagation()}>
            <h2>{shortcutsType === 'favorites' ? 'Add Favorite' : 'Add Shortcut'}</h2>
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
          </div>
        </div>
      )}
    </section>
  )
}

export default NewTab
