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
        const supabaseAd = await supabaseAdsService.getRandomAd()
        
        if (supabaseAd) {
          const convertedAd = supabaseAdsService.convertToExtensionAd(supabaseAd)
          setCurrentAd(convertedAd)
          
          // Track impression for this ad
          await supabaseAdsService.trackImpressions([supabaseAd.id])
        } else {
          // Fallback to default ad if no Supabase ads available
          setCurrentAd({
            id: 'fallback',
            title: 'Support Palestine',
            description: 'Help support Palestinian causes',
            imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=300&h=200&fit=crop',
            link: 'https://www.unrwa.org/donate',
            organization: 'UNRWA'
          })
        }
      } catch (error) {
        console.error('Error loading ad:', error)
        // Fallback ad
        setCurrentAd({
          id: 'fallback',
          title: 'Support Palestine',
          description: 'Help support Palestinian causes',
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

  const handleAdClick = () => {
    if (currentAd) {
      window.open(currentAd.link, '_blank')
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
    <div className="ad-container" onClick={handleAdClick}>
      <div className="ad-content">
        <img 
          src={currentAd.imageUrl} 
          alt={currentAd.title}
          className="ad-image"
          onError={(e) => {
            // Fallback to a placeholder if image fails to load
            e.currentTarget.src = 'https://via.placeholder.com/300x200/4a90e2/ffffff?text=Support+Palestine'
          }}
        />
        <div className="ad-text">
          <h3 className="ad-title">{currentAd.title}</h3>
          <p className="ad-description">{currentAd.description}</p>
          <p className="ad-sponsored">Sponsored by Ethicly</p>
        </div>
      </div>
    </div>
  )
}

export default AdComponent 