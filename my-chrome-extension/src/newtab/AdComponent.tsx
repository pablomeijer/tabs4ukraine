import { useState, useEffect } from 'react'
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

  // Sample Palestine-related ads - you can expand this list
  const ads: AdData[] = [
    {
      id: '1',
      title: 'Support Gaza Relief',
      description: 'Help provide emergency aid to families in Gaza',
      imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=300&h=200&fit=crop',
      link: 'https://www.unrwa.org/donate',
      organization: 'UNRWA'
    },
    {
      id: '2',
      title: 'Medical Aid for Palestine',
      description: 'Support medical missions and healthcare in Palestine',
      imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
      link: 'https://www.palestinercs.org/en/donate',
      organization: 'Palestine Red Crescent'
    },
    {
      id: '3',
      title: 'Education for Palestinian Children',
      description: 'Help provide education and school supplies',
      imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop',
      link: 'https://www.savethechildren.org/where-we-help/middle-east/palestine',
      organization: 'Save the Children'
    },
    {
      id: '4',
      title: 'Humanitarian Aid',
      description: 'Support emergency relief efforts in Palestine',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
      link: 'https://www.oxfam.org/en/emergencies/occupied-palestinian-territory-and-israel',
      organization: 'Oxfam'
    },
    {
      id: '5',
      title: 'Water and Sanitation',
      description: 'Help provide clean water to Palestinian communities',
      imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=200&fit=crop',
      link: 'https://www.unicef.org/emergencies/occupied-palestinian-territory',
      organization: 'UNICEF'
    }
  ]

  useEffect(() => {
    // Select a random ad when component mounts
    const randomAd = ads[Math.floor(Math.random() * ads.length)]
    setCurrentAd(randomAd)
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

  if (!isVisible || !currentAd) {
    return null
  }

  return (
    <div className="ad-container" onClick={handleAdClick}>
      <button className="ad-close" onClick={handleClose}>
        ×
      </button>
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
          <p className="ad-organization">by {currentAd.organization}</p>
        </div>
      </div>
    </div>
  )
}

export default AdComponent 