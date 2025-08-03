import { useState, useEffect } from 'react'
import './AdvertisementsUpgrade.css'

interface AdUpgradeProps {
  currentAdCount: number
  onUpgrade: (adCount: number) => void
}

export const AdvertisementsUpgrade = ({ currentAdCount, onUpgrade }: AdUpgradeProps) => {
  const [selectedPlan, setSelectedPlan] = useState<number>(currentAdCount)

  const impactLevels = [
    {
      id: 1,
      title: '1 Advertisement',
      description: 'Basic impact level',
      price: '$3',
      rate: 'raised per 1000 tabs'
    },
    {
      id: 2,
      title: '2 Advertisements',
      description: 'Enhanced impact level',
      price: '$6',
      rate: 'raised per 1000 tabs'
    },
    {
      id: 3,
      title: '3 Advertisements',
      description: 'Maximum impact level',
      price: '$9',
      rate: 'raised per 1000 tabs'
    }
  ]

  const handleUpgrade = () => {
    onUpgrade(selectedPlan)
  }

  return (
    <div className="ad-upgrade-container">
      <div className="ad-upgrade-header">
        <h2 className="ad-upgrade-title">
          🚀 Upgrade your Impact
        </h2>
        <p className="ad-upgrade-subtitle">
          Increase the rate at which you donate to the Palestinian cause
        </p>
      </div>

      <div className="ad-upgrade-plans">
        {impactLevels.map((level) => (
          <div 
            key={level.id}
            className={`ad-upgrade-card ${selectedPlan === level.id ? 'ad-upgrade-card-selected' : ''} ${currentAdCount === level.id ? 'ad-upgrade-card-current' : ''}`}
            onClick={() => setSelectedPlan(level.id)}
          >
            {currentAdCount === level.id && (
              <div className="ad-upgrade-current-badge">Current Level</div>
            )}
            <div className="ad-upgrade-card-header">
              <h3 className="ad-upgrade-card-title">{level.title}</h3>
              <p className="ad-upgrade-card-description">{level.description}</p>
            </div>
            <div className="ad-upgrade-card-pricing">
              <span className="ad-upgrade-card-price">{level.price}</span>
              <span className="ad-upgrade-card-rate">{level.rate}</span>
            </div>

          </div>
        ))}
      </div>

      <div className="ad-upgrade-actions">
        <button 
          className={`ad-upgrade-button ${selectedPlan === currentAdCount ? 'ad-upgrade-button-disabled' : ''}`}
          onClick={handleUpgrade}
          disabled={selectedPlan === currentAdCount}
        >
          {selectedPlan === currentAdCount ? 'Current Level' : `Raise More with ${selectedPlan} Advertisement${selectedPlan > 1 ? 's' : ''}`}
        </button>
      </div>

      <div className="ad-upgrade-info">
        <p className="ad-upgrade-info-text">
          💡 <strong>How it works:</strong> Each time you open a new tab, embedded advertisements will appear on your new tab page. 
          The revenue from these ads is automatically donated to Palestinian causes. The more advertisements you choose, 
          the more money we can raise for Palestinian communities with every tab you open.
        </p>
      </div>
    </div>
  )
}

export default AdvertisementsUpgrade 