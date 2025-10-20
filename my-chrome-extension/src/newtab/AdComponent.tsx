import { useState, useEffect } from 'react'
import { supabaseAdsService } from '../lib/supabase-ads'
import './AdComponent.css'

interface AdData {
  id: string
  title: string
  description: string
  imageUrl: string
  link: string
  organization: string
}

export const AdComponent = () => {
  const [currentAd, setCurrentAd] = useState<AdData | null>(null)
  const [isVisible, setIsVisible] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAd = async () => {
      try {
        setLoading(true)
        console.log('🔄 AdComponent: Loading new ad...')
        
        const supabaseAd = await supabaseAdsService.getRandomAd()
        console.log('📋 AdComponent: Got ad from service:', supabaseAd)
        
        if (supabaseAd) {
          const convertedAd = supabaseAdsService.convertToExtensionAd(supabaseAd)
          console.log('🔄 AdComponent: Converted ad:', convertedAd)
          setCurrentAd(convertedAd)
          
          // Track impression for this ad
          await supabaseAdsService.trackImpressions([supabaseAd.id])
          console.log('✅ AdComponent: Tracked impression for ad:', supabaseAd.id)
        } else {
          console.log('⚠️ AdComponent: No Supabase ads available, using fallback')
          // Fallback to default ad if no Supabase ads available
          setCurrentAd({
            id: 'fallback',
            title: 'Support Ukraine',
            description: 'Help support Ukrainian causes',
            imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=300&h=200&fit=crop',
            link: 'https://www.unrwa.org/donate',
            organization: 'UNRWA'
          })
        }
      } catch (error) {
        console.error('❌ AdComponent: Error loading ad:', error)
        // Fallback ad
        setCurrentAd({
          id: 'fallback',
          title: 'Support Ukraine',
          description: 'Help support Ukranian causes',
          imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=300&h=200&fit=crop',
          link: 'https://www.unrwa.org/donate',
          organization: 'UNRWA'
        })
      } finally {
        setLoading(false)
      }
    }

    loadAd()
  }, [])

  const handleAdClick = async () => {
    if (currentAd) {
      try {
        console.log('🖱️ Ad clicked:', currentAd);
        
        // Track the click if it's a Supabase ad
        if (currentAd.id !== 'fallback') {
          const adId = parseInt(currentAd.id);
          await supabaseAdsService.trackClick(adId);
        }
        
        // Open the ad link
        window.open(currentAd.link, '_blank', 'noopener,noreferrer');
      } catch (error) {
        console.error('❌ Error handling ad click:', error);
        // Still open the link even if tracking fails
        window.open(currentAd.link, '_blank', 'noopener,noreferrer');
      }
    }
  }

  const handleRefresh = async () => {
    console.log('🔄 Manual refresh requested')
    setLoading(true)
    try {
      const supabaseAd = await supabaseAdsService.getRandomAd()
      console.log('🔄 Refresh: Got new ad:', supabaseAd)
      
      if (supabaseAd) {
        const convertedAd = supabaseAdsService.convertToExtensionAd(supabaseAd)
        setCurrentAd(convertedAd)
        await supabaseAdsService.trackImpressions([supabaseAd.id])
      }
    } catch (error) {
      console.error('❌ Refresh error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsVisible(false)
  }

  if (!isVisible || !currentAd || loading) {
    return null
  }

  return (
    <div className="ad-container">
      <div className="ad-content" onClick={handleAdClick}>
        <img 
          src={currentAd.imageUrl} 
          alt={currentAd.title}
          className="ad-image"
          onError={(e) => {
            // Fallback to a placeholder if image fails to load
            e.currentTarget.src = 'https://via.placeholder.com/300x200/4a90e2/ffffff?text=Support+Ukraine'
          }}
        />
        <div className="ad-text">
          <p className="ad-sponsored">Sponsored by Ethicly</p>
        </div>
      </div>
      <button 
        onClick={(e) => {
          e.stopPropagation()
          handleRefresh()
        }}
        style={{
          position: 'absolute',
          top: '5px',
          right: '5px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          border: 'none',
          borderRadius: '3px',
          padding: '2px 6px',
          fontSize: '10px',
          cursor: 'pointer'
        }}
        title="Refresh Ad"
      >
        🔄
      </button>
    </div>
  )
}

export default AdComponent 