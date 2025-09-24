import React, { useState, useEffect } from 'react';
import { ethiclyService, EthiclyAd } from '../lib/ethicly';
import './EthiclyAdComponent.css';

interface EthiclyAdComponentProps {
  onClose?: () => void;
  className?: string;
}

export const EthiclyAdComponent: React.FC<EthiclyAdComponentProps> = ({ 
  onClose, 
  className = '' 
}) => {
  const [currentAd, setCurrentAd] = useState<EthiclyAd | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAd();
  }, []);

  const loadAd = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const ad = await ethiclyService.getRandomAd();
      
      if (ad) {
        setCurrentAd(ad);
        
        // Track impression using tracking URL if available
        if (ad.tracking_urls.impression) {
          await ethiclyService.trackImpression(ad.tracking_urls.impression);
        } else if (ethiclyService.isFallbackAd(ad.ad_id)) {
          await ethiclyService.trackFallbackAdInteraction(ad.ad_id, 'impression');
        }
      } else {
        setError('No ads available');
        setIsVisible(false);
      }
    } catch (err) {
      console.error('Error loading Ethicly ad:', err);
      setError('Failed to load ad');
      setIsVisible(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdClick = async () => {
    if (currentAd) {
      try {
        // Track click using tracking URL if available
        if (currentAd.tracking_urls.click) {
          await ethiclyService.trackClick(currentAd.tracking_urls.click);
        } else if (ethiclyService.isFallbackAd(currentAd.ad_id)) {
          await ethiclyService.trackFallbackAdInteraction(currentAd.ad_id, 'click');
        }
        
        // Open the ad link in a new tab
        window.open(currentAd.destination_url, '_blank', 'noopener,noreferrer');
      } catch (error) {
        console.error('Error tracking click:', error);
        // Still open the link even if tracking fails
        window.open(currentAd.destination_url, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  const handleRetry = () => {
    loadAd();
  };

  // Don't render if not visible or if there's an error and no retry option
  if (!isVisible) {
    return null;
  }

  return (
    <div className={`ethicly-ad-container ${className}`}>
      {onClose && (
        <button 
          className="ethicly-ad-close" 
          onClick={handleClose}
          title="Close ad"
        >
          ×
        </button>
      )}
      
      <div className="ethicly-ad-content" onClick={handleAdClick}>
        {isLoading ? (
          <div className="ethicly-ad-loading">
            <div className="ethicly-ad-loading-spinner"></div>
            <p>Loading ad...</p>
          </div>
        ) : error ? (
          <div className="ethicly-ad-error">
            <p>{error}</p>
            <button 
              className="ethicly-ad-retry-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleRetry();
              }}
            >
              Retry
            </button>
          </div>
        ) : currentAd ? (
          <>
            <div className="ethicly-ad-image-container">
              <img 
                src={currentAd.image_url} 
                alt={currentAd.title}
                className="ethicly-ad-image"
                onError={(e) => {
                  // Fallback to a placeholder if image fails to load
                  e.currentTarget.src = 'https://via.placeholder.com/400x150/4a90e2/ffffff?text=Ethicly+Ad';
                }}
              />
              <div className="ethicly-ad-badge">
                <span>Sponsored</span>
              </div>
            </div>
            <div className="ethicly-ad-text">
              <h3 className="ethicly-ad-title">{currentAd.title}</h3>
              <p className="ethicly-ad-description">{currentAd.description}</p>
            </div>
            <div className="ethicly-ad-cta">
              <span>Click to support</span>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default EthiclyAdComponent;
