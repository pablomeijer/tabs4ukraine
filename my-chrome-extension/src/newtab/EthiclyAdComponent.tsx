import React, { useState, useEffect } from 'react';
import { supabaseAdsService, SupabaseAd } from '../lib/supabase-ads';
import './EthiclyAdComponent.css';

interface EthiclyAdComponentProps {
  onClose?: () => void;
  className?: string;
}

export const EthiclyAdComponent: React.FC<EthiclyAdComponentProps> = ({ 
  onClose, 
  className = '' 
}) => {
  const [currentAd, setCurrentAd] = useState<SupabaseAd | null>(null);
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
      
      const ad = await supabaseAdsService.getRandomAd();
      
      if (ad) {
        setCurrentAd(ad);
        console.log('Supabase ad loaded for leaderboard:', ad);
        
        // Track impression for this ad
        await supabaseAdsService.trackImpressions([ad.id]);
      } else {
        setError('No ads available');
        setIsVisible(false);
      }
    } catch (err) {
      console.error('Error loading Supabase ad:', err);
      setError('Failed to load ad');
      setIsVisible(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdClick = async () => {
    if (currentAd) {
      try {
        console.log('Supabase ad clicked:', currentAd);
        // Open the ad link in a new tab
        window.open(currentAd.destination_url, '_blank', 'noopener,noreferrer');
      } catch (error) {
        console.error('Error opening ad link:', error);
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
                src={currentAd.logo_url} 
                alt={currentAd.title || 'Advertisement'}
                className="ethicly-ad-image"
                onError={(e) => {
                  // Fallback to a placeholder if image fails to load
                  e.currentTarget.src = 'https://via.placeholder.com/400x150/4a90e2/ffffff?text=Advertisement';
                }}
              />
            </div>
            <div className="ethicly-ad-text">
              <h3 className="ethicly-ad-title">{currentAd.title || 'Advertisement'}</h3>
              <p className="ethicly-ad-description">{currentAd.description || 'Click to learn more'}</p>
            </div>
            <div className="ethicly-ad-sponsored">
              <span>Sponsored by Ethicly</span>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default EthiclyAdComponent;
