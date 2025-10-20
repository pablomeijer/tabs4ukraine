import { useState, useEffect } from 'react'

import './Options.css'

export const Options = () => {
  const [countSync, setCountSync] = useState(0)
  const [settings, setSettings] = useState({
    showClock: true,
    showDonationBox: true,
    showQuickAccess: true,
    showAppsGrid: true,
    showNews: true,
    backgroundMode: 'default',
    sponsoredAdsEnabled: true,
    sponsoredAdsFrequency: 50,
    notificationsEnabled: true,
    gamificationEnabled: true,
    theme: 'light'
  })

  useEffect(() => {
    chrome.storage.sync.get(['count', 'settings'], (result) => {
      setCountSync(result.count || 0)
      if (result.settings) {
        setSettings({ ...settings, ...result.settings })
      }
    })

    chrome.runtime.onMessage.addListener((request) => {
      if (request.type === 'COUNT') {
        setCountSync(request.count || 0)
      }
    })
  }, [])

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    chrome.storage.sync.set({ settings: newSettings })
  }

  const SettingCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="t4p-setting-card">
      <h3 className="t4p-setting-card-title">{title}</h3>
      <div className="t4p-setting-card-content">
        {children}
      </div>
    </div>
  )

  const ToggleSwitch = ({ 
    label, 
    checked, 
    onChange, 
    description 
  }: { 
    label: string; 
    checked: boolean; 
    onChange: (checked: boolean) => void;
    description?: string;
  }) => (
    <div className="t4p-toggle-row">
      <div className="t4p-toggle-info">
        <label className="t4p-toggle-label">{label}</label>
        {description && <p className="t4p-toggle-description">{description}</p>}
      </div>
      <div className="t4p-switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="t4p-slider"></span>
      </div>
    </div>
  )

  const SelectOption = ({ 
    label, 
    value, 
    options, 
    onChange, 
    description 
  }: { 
    label: string; 
    value: string; 
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
    description?: string;
  }) => (
    <div className="t4p-select-row">
      <div className="t4p-select-info">
        <label className="t4p-select-label">{label}</label>
        {description && <p className="t4p-select-description">{description}</p>}
      </div>
      <select 
        className="t4p-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )

  const SliderControl = ({ 
    label, 
    value, 
    min, 
    max, 
    onChange, 
    description,
    unit = '%'
  }: { 
    label: string; 
    value: number; 
    min: number; 
    max: number; 
    onChange: (value: number) => void;
    description?: string;
    unit?: string;
  }) => (
    <div className="t4p-slider-row">
      <div className="t4p-slider-info">
        <label className="t4p-slider-label">{label}</label>
        {description && <p className="t4p-slider-description">{description}</p>}
      </div>
      <div className="t4p-slider-container">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="t4p-range-slider"
        />
        <div className="t4p-slider-value">{value}{unit}</div>
      </div>
    </div>
  )

  return (
    <div className="t4p-options-container">
      <header className="t4p-options-header">
        <div className="t4p-options-logo">
          <img src="/img/tabs4ukraine_logo.png" alt="Tabs4Ukraine" />
        </div>
        <h1 className="t4p-options-title">Settings</h1>
        <p className="t4p-options-subtitle">Customize your Tabs4Ukraine experience</p>
      </header>

      <div className="t4p-options-content">
        <div className="t4p-options-grid">
          
          <SettingCard title="Display Settings">
            <ToggleSwitch
              label="Show Digital Clock"
              checked={settings.showClock}
              onChange={(checked) => handleSettingChange('showClock', checked)}
              description="Display the digital clock next to the logo"
            />
            <ToggleSwitch
              label="Show Donation Box"
              checked={settings.showDonationBox}
              onChange={(checked) => handleSettingChange('showDonationBox', checked)}
              description="Show the donation tracking widget"
            />
            <ToggleSwitch
              label="Show Quick Access"
              checked={settings.showQuickAccess}
              onChange={(checked) => handleSettingChange('showQuickAccess', checked)}
              description="Display quick access shortcuts"
            />
            <ToggleSwitch
              label="Show Apps Grid"
              checked={settings.showAppsGrid}
              onChange={(checked) => handleSettingChange('showAppsGrid', checked)}
              description="Display the 9-circle apps grid (hamburger menu)"
            />
            <ToggleSwitch
              label="Show News"
              checked={settings.showNews}
              onChange={(checked) => handleSettingChange('showNews', checked)}
              description="Display the news/notifications section"
            />
            <SelectOption
              label="Background Mode"
              value={settings.backgroundMode}
              options={[
                { value: 'default', label: 'Default' },
                { value: 'gallery', label: 'Gallery Mode' },
                { value: 'solid', label: 'Solid Color' }
              ]}
              onChange={(value) => handleSettingChange('backgroundMode', value)}
              description="Choose how backgrounds are displayed"
            />
          </SettingCard>

          <SettingCard title="Sponsored Content">
            <ToggleSwitch
              label="Enable Sponsored Ads"
              checked={settings.sponsoredAdsEnabled}
              onChange={(checked) => handleSettingChange('sponsoredAdsEnabled', checked)}
              description="Show sponsored content to support Ukrainian causes"
            />
            <SliderControl
              label="Ad Frequency"
              value={settings.sponsoredAdsFrequency}
              min={10}
              max={100}
              onChange={(value) => handleSettingChange('sponsoredAdsFrequency', value)}
              description="How often sponsored content appears"
            />
          </SettingCard>

          <SettingCard title="Notifications & Engagement">
            <ToggleSwitch
              label="Enable Notifications"
              checked={settings.notificationsEnabled}
              onChange={(checked) => handleSettingChange('notificationsEnabled', checked)}
              description="Receive updates about Ukrainian causes"
            />
            <ToggleSwitch
              label="Enable Gamification"
              checked={settings.gamificationEnabled}
              onChange={(checked) => handleSettingChange('gamificationEnabled', checked)}
              description="Track your impact and earn achievements"
            />
          </SettingCard>

          <SettingCard title="Appearance">
            <SelectOption
              label="Theme"
              value={settings.theme}
              options={[
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
                { value: 'auto', label: 'Auto' }
              ]}
              onChange={(value) => handleSettingChange('theme', value)}
              description="Choose your preferred color scheme"
            />
          </SettingCard>

          <SettingCard title="Statistics">
            <div className="t4p-stats-grid">
              <div className="t4p-stat-item">
                <div className="t4p-stat-value">{countSync}</div>
                <div className="t4p-stat-label">Tabs Opened</div>
              </div>
              <div className="t4p-stat-item">
                <div className="t4p-stat-value">$0.00</div>
                <div className="t4p-stat-label">Donated</div>
              </div>
              <div className="t4p-stat-item">
                <div className="t4p-stat-value">0</div>
                <div className="t4p-stat-label">Achievements</div>
              </div>
            </div>
          </SettingCard>

          <SettingCard title="About">
            <div className="t4p-about-content">
              <p className="t4p-about-text">
                Tabs4Ukraine is a Chrome extension that helps raise awareness and support for Ukrainian causes through your daily browsing habits.
              </p>
              <div className="t4p-about-links">
                <a href="https://github.com/guocaoyi/create-chrome-ext" target="_blank" className="t4p-about-link">
                  GitHub Repository
                </a>
                <a href="#" className="t4p-about-link">
                  Privacy Policy
                </a>
                <a href="#" className="t4p-about-link">
                  Terms of Service
                </a>
              </div>
            </div>
          </SettingCard>

        </div>
      </div>
    </div>
  )
}

export default Options
