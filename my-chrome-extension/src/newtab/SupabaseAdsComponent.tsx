import { useState, useEffect } from 'react'
import { supabaseAdsService, SupabaseAd } from '../lib/supabase-ads'
import './SupabaseAdsComponent.css'

export const SupabaseAdsComponent = () => {
  const [ads, setAds] = useState<SupabaseAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAds = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const fetchedAds = await supabaseAdsService.fetchAds();
        setAds(fetchedAds);
        
        if (fetchedAds.length === 0) {
          setError('No ads available');
        }
      } catch (err) {
        console.error('Error loading Supabase ads:', err);
        setError('Failed to load ads');
      } finally {
        setLoading(false);
      }
    };

    loadAds();
  }, []);

  const handleAdClick = (ad: SupabaseAd) => {
    console.log('Supabase ad clicked:', ad);
    // Track click if needed
    window.open(ad.destination_url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="supabase-ads-container">
        <div className="supabase-ads-loading">Loading ads...</div>
      </div>
    );
  }

  if (error || ads.length === 0) {
    return (
      <div className="supabase-ads-container">
        <div className="supabase-ads-error">{error || 'No ads available'}</div>
      </div>
    );
  }

  return (
    <div className="supabase-ads-container">
      <div className="supabase-ads-grid">
        {ads.map((ad) => (
          <div
            key={ad.id}
            className="supabase-ad-item"
            onClick={() => handleAdClick(ad)}
            title={ad.title || 'Advertisement'}
          >
            <img
              src={ad.logo_url}
              alt={ad.title || 'Advertisement'}
              className="supabase-ad-logo"
              onError={(e) => {
                // Fallback to a default icon if image fails to load
                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iOCIgZmlsbD0iI0Y1RjVGNSIvPgo8cGF0aCBkPSJNMzIgMjhMNDggNDRMMzIgNjBMMTYgNDRMMzIgMjhaIiBmaWxsPSIjOTk5Ii8+Cjwvc3ZnPgo=';
              }}
            />
            {ad.title && (
              <div className="supabase-ad-title">{ad.title}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupabaseAdsComponent;
