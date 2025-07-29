import { useState, useEffect, useRef } from 'react'
import AdComponent from './AdComponent'
import EmbeddedAdComponent from './EmbeddedAdComponent'
import AdvertisementsUpgrade from './AdvertisementsUpgrade'

import './NewTab.css'
import logo from '../assets/tabs4palestine_transparent_logo_25.png'
import watermelonLogo from '../assets/nobackground_watermelon.png'
// Remove SVG imports and use URLs instead
const gmailIcon = 'img/icons/gmail.svg';
const driveIcon = 'img/icons/drive.svg';
const sheetsIcon = 'img/icons/sheets.svg';
const classroomIcon = 'img/icons/classroom.svg';
const sitesIcon = 'img/icons/sites.svg';
const moreIcon = 'img/icons/more.svg';
const classicsIcon = 'img/icons/classics.svg';
const instagramIcon = 'img/icons/instagram.svg';
const xIcon = 'img/icons/x.svg';
const youtubeIcon = 'img/icons/youtube.svg';

function SettingsModal({ open, onClose, toggles, setToggles, backgroundMode, setBackgroundMode, onUploadBackground, adCount, onAdUpgrade }: { open: boolean, onClose: () => void, toggles: any, setToggles: (t: any) => void, backgroundMode: string, setBackgroundMode: (m: string) => void, onUploadBackground: (file: File) => void, adCount: number, onAdUpgrade: (count: number) => void }) {
  const [activeTab, setActiveTab] = useState('General');
  const fileInputRef = useRef<HTMLInputElement>(null);
  if (!open) return null;
  return (
    <div className="t4p-modal-bubble-overlay" onClick={onClose}>
      <div className="t4p-modal-bubble" onClick={e => e.stopPropagation()}>
        <button className="t4p-modal-close" onClick={onClose} style={{position: 'absolute', top: 16, right: 18}}>×</button>
        <div className="t4p-modal-tabs">
          {['General', 'Background', 'Advertisements', 'About'].map(tab => (
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
              <button className={`t4p-bg-btn${backgroundMode === 'gallery' ? ' t4p-bg-btn-active' : ''}`} onClick={() => setBackgroundMode('gallery')}>
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" stroke="#222" strokeWidth="2"/><circle cx="8" cy="10" r="2" fill="#188038"/><path d="M21 19l-5.5-7-4.5 6-3-4-4 5" stroke="#188038" strokeWidth="2"/></svg>
                <span>Gallery</span>
              </button>
              <button className={`t4p-bg-btn${backgroundMode === 'classic' ? ' t4p-bg-btn-active' : ''}`} onClick={() => setBackgroundMode('classic')}>
                <svg width="24" height="24" fill="#fff" stroke="#222" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/></svg>
                <span>Classic Mode</span>
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
          {activeTab === 'About' && <div>About page coming soon.</div>}
        </div>
      </div>
    </div>
  );
}

// Add all gallery images as URLs from public/img/backgrounds
const galleryImages = [
  'img/backgrounds/pexels-gaza-8660631.jpg',
  'img/backgrounds/pexels-earano-1352196.jpg',
  'img/backgrounds/pexels-pixabay-531767.jpg',
  'img/backgrounds/pexels-simon73-1323550.jpg',
  'img/backgrounds/pexels-luisdelrio-15286.jpg',
  'img/backgrounds/pexels-samkolder-2387873.jpg',
  'img/backgrounds/pexels-walidphotoz-847402.jpg',
  'img/backgrounds/pexels-dushenkovsky-4100130.jpg',
  'img/backgrounds/pexels-eberhardgross-1287145.jpg',
  'img/backgrounds/pexels-abu-adel-2153065-3805146.jpg',
  // ...add all other images here
];

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
  const [backgroundMode, setBackgroundMode] = useState('gallery');
  const [customBg, setCustomBg] = useState<string | null>(null);
  const [galleryBg, setGalleryBg] = useState(galleryImages[0]);
  const [appsOpen, setAppsOpen] = useState(false);
  const [adCount, setAdCount] = useState(1);

  // Load ad count from storage on mount
  useEffect(() => {
    chrome.storage.sync.get(['adCount'], (result: { adCount?: number }) => {
      if (result.adCount) {
        setAdCount(result.adCount);
      }
    });
  }, []);

  // Save ad count to storage when it changes
  const handleAdUpgrade = (count: number) => {
    setAdCount(count);
    chrome.storage.sync.set({ adCount: count });
  };

  useEffect(() => {
    const updateClock = () => {
      const now = new Date()
      const hour = String(now.getHours()).padStart(2, '0')
      const minute = String(now.getMinutes()).padStart(2, '0')
      setTime(`${hour}:${minute}`)
    }
    updateClock()
    const interval = setInterval(updateClock, 1000 * 10)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // On mount, pick a random gallery image for this tab
    if (backgroundMode === 'gallery' || !backgroundMode) {
      const idx = Math.floor(Math.random() * galleryImages.length);
      setGalleryBg(galleryImages[idx]);
    }
  }, []);

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
        backgroundMode === 'classic'
          ? { background: '#fff' }
          : backgroundMode === 'upload' && customBg
          ? { backgroundImage: `url(${customBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : { backgroundImage: `url(${galleryBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
      }
    >
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        toggles={toggles}
        setToggles={setToggles}
        backgroundMode={backgroundMode}
        setBackgroundMode={setBackgroundMode}
        onUploadBackground={handleUploadBackground}
        adCount={adCount}
        onAdUpgrade={handleAdUpgrade}
      />
      {/* Apps Bubble */}
      {appsOpen && (
        <div className="t4p-modal-bubble-overlay" onClick={() => setAppsOpen(false)}>
          <div className="t4p-modal-bubble t4p-apps-bubble" onClick={e => e.stopPropagation()}>
            <button className="t4p-modal-close" onClick={() => setAppsOpen(false)} style={{position: 'absolute', top: 16, right: 18}}>×</button>
            <div className="t4p-apps-section">
              <div className="t4p-apps-title">Google Apps</div>
              <div className="t4p-apps-grid">
                <a href="https://www.google.com" target="_blank" className="t4p-apps-item"><img src={classicsIcon} alt="Classics" /><span>Classics</span></a>
                <a href="https://mail.google.com" target="_blank" className="t4p-apps-item"><img src={gmailIcon} alt="Gmail" /><span>Gmail</span></a>
                <a href="https://drive.google.com" target="_blank" className="t4p-apps-item"><img src={driveIcon} alt="Drive" /><span>Drive</span></a>
                <a href="https://sheets.google.com" target="_blank" className="t4p-apps-item"><img src={sheetsIcon} alt="Sheets" /><span>Sheets</span></a>
                <a href="https://classroom.google.com" target="_blank" className="t4p-apps-item"><img src={classroomIcon} alt="Classroom" /><span>Classroom</span></a>
                <a href="https://sites.google.com" target="_blank" className="t4p-apps-item"><img src={sitesIcon} alt="Sites" /><span>Sites</span></a>
                <a href="#" className="t4p-apps-item"><img src={moreIcon} alt="More" /><span>More</span></a>
              </div>
            </div>
            <div className="t4p-apps-section t4p-apps-socials">
              <div className="t4p-apps-title">Socials</div>
              <div className="t4p-apps-grid">
                <a href="https://instagram.com" target="_blank" className="t4p-apps-item"><img src={instagramIcon} alt="Instagram" /><span>Instagram</span></a>
                <a href="https://x.com" target="_blank" className="t4p-apps-item"><img src={xIcon} alt="X" /><span>X</span></a>
                <a href="https://youtube.com" target="_blank" className="t4p-apps-item"><img src={youtubeIcon} alt="YouTube" /><span>YouTube</span></a>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Top left clock */}
      {toggles.clock && (
        <div className="t4p-clock">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2"/><path d="M12 7v5l3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
          <span>{time}</span>
        </div>
      )}
      {/* Top right icons */}
      <div className="t4p-top-right-icons">
        <div className="t4p-pill">
          <img src={watermelonLogo} alt="watermelon logo" className="t4p-pill-logo" />
          <span className="t4p-pill-amount">12,349,249$</span>
        </div>
        {toggles.apps && (
          <button className="t4p-icon-btn" title="Apps" onClick={() => setAppsOpen(v => !v)}>
            {/* 9-dot grid icon */}
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><g fill="#fff"><circle cx="5" cy="5" r="2"/><circle cx="14" cy="5" r="2"/><circle cx="23" cy="5" r="2"/><circle cx="5" cy="14" r="2"/><circle cx="14" cy="14" r="2"/><circle cx="23" cy="14" r="2"/><circle cx="5" cy="23" r="2"/><circle cx="14" cy="23" r="2"/><circle cx="23" cy="23" r="2"/></g></svg>
          </button>
        )}
        {toggles.apps && (
          <button className="t4p-icon-btn" title="Notifications">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.73 21a2 2 0 01-3.46 0" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        )}
        {toggles.apps && (
          <button className="t4p-icon-btn" title="Menu">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
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
        {toggles.logo && <img src={logo} alt="tabs4palestine logo" className="t4p-logo" />}
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
        <div className="quick-access-grid">
          <a href="https://www.sep.com" target="_blank" className="quick-access-item">
            <img src="img/8_icons/white-sep_icon_512x512.png" alt="SEP" />
            <span>SEP</span>
          </a>
          <a href="https://www.nolcollective.com" target="_blank" className="quick-access-item">
            <img src="img/8_icons/white-nol-collective.png" alt="NOL Collective" />
            <span>NOL Collective</span>
          </a>
          <a href="https://www.darzah.org" target="_blank" className="quick-access-item">
            <img src="img/8_icons/white-darzah_logo.png" alt="Darzah" />
            <span>Darzah</span>
          </a>
          <a href="https://www.wearthepeace.com" target="_blank" className="quick-access-item">
            <img src="img/8_icons/wear_the_peacelogo.png" alt="Wear The Peace" />
            <span>Wear The Peace</span>
          </a>
          <a href="https://www.ben-jekats.com" target="_blank" className="quick-access-item">
            <img src="img/8_icons/white-Ben-and-Jerrys-Logo-1990s-500x281.png" alt="Ben & Jekats" />
            <span>Ben & Jekats</span>
          </a>
          <a href="https://www.baytoun.uk" target="_blank" className="quick-access-item">
            <img src="img/8_icons/white-sep_icon_512x512.png" alt="Baytoun" />
            <span>Baytoun</span>
          </a>
          <a href="https://www.watanapparel.com" target="_blank" className="quick-access-item">
            <img src="img/8_icons/watan.png" alt="Watan Apparel" />
            <span>Watan Apparel</span>
          </a>
          <a href="https://www.farsali.com" target="_blank" className="quick-access-item">
            <img src="img/8_icons/farsali.png" alt="Farsali" />
            <span>Farsali</span>
          </a>
        </div>
      </div>
      
      {/* Embedded Advertisements */}
      {adCount >= 1 && (
        <EmbeddedAdComponent position="bottom" adIndex={0} />
      )}
      {adCount >= 2 && (
        <EmbeddedAdComponent position="top" adIndex={1} />
      )}
      {adCount >= 3 && (
        <EmbeddedAdComponent position="side" adIndex={2} />
      )}
    </section>
  )
}

export default NewTab
