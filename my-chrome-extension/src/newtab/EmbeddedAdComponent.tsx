import { useState, useEffect } from 'react'
import './EmbeddedAdComponent.css'

interface EmbeddedAdData {
  id: string
  title: string
  description: string
  imageUrl: string
  link: string
  organization: string
}

interface EmbeddedAdComponentProps {
  position: 'top' | 'side' | 'bottom' | 'bottom-right' | 'bottom-right-top' | 'bottom-middle'
  adIndex: number
  onClose?: () => void
}

export const EmbeddedAdComponent = ({ position, adIndex, onClose }: EmbeddedAdComponentProps) => {
  const [currentAd, setCurrentAd] = useState<EmbeddedAdData | null>(null)

  // Sample Palestine-related ads - you can expand this list
  const ads: EmbeddedAdData[] = [
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
    },
    {
      id: '6',
      title: 'Food Security',
      description: 'Support food distribution programs in Palestine',
      imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
      link: 'https://www.wfp.org/countries/palestine',
      organization: 'World Food Programme'
    },
    {
      id: '7',
      title: 'Shelter and Housing',
      description: 'Help rebuild homes and provide shelter',
      imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&h=200&fit=crop',
      link: 'https://www.habitat.org/where-we-build/palestine',
      organization: 'Habitat for Humanity'
    },
    {
      id: '8',
      title: 'Mental Health Support',
      description: 'Provide psychological support to affected families',
      imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
      link: 'https://www.msf.org/palestine',
      organization: 'Doctors Without Borders'
    },
    {
      id: '9',
      title: 'Emergency Response',
      description: 'Support rapid emergency response teams',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
      link: 'https://www.icrc.org/en/where-we-work/middle-east/israel-and-occupied-territories',
      organization: 'International Red Cross'
    },
    {
      id: '10',
      title: 'Children\'s Rights',
      description: 'Protect and support Palestinian children',
      imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop',
      link: 'https://www.unicef.org/emergencies/occupied-palestinian-territory',
      organization: 'UNICEF'
    },
    {
      id: '11',
      title: 'Women\'s Empowerment',
      description: 'Support women and girls in Palestine',
      imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=300&h=200&fit=crop',
      link: 'https://www.unwomen.org/en/where-we-are/arab-states/palestine',
      organization: 'UN Women'
    },
    {
      id: '12',
      title: 'Cultural Preservation',
      description: 'Help preserve Palestinian culture and heritage',
      imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&h=200&fit=crop',
      link: 'https://www.unesco.org/en/fieldoffice/ramallah',
      organization: 'UNESCO'
    }
  ]

  useEffect(() => {
    // Select a random ad instead of using adIndex
    const randomAd = ads[Math.floor(Math.random() * ads.length)]
    setCurrentAd(randomAd)
  }, [adIndex])

  const handleAdClick = () => {
    if (currentAd) {
      window.open(currentAd.link, '_blank')
    }
  }

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onClose) {
      onClose()
    }
  }

  if (!currentAd) {
    return null
  }

  return (
    <div 
      className={`embedded-ad-container embedded-ad-${position}`}
      onClick={handleAdClick}
    >
      {onClose && (
        <button 
          className="embedded-ad-close" 
          onClick={handleClose}
          title="Close ad"
        >
          ×
        </button>
      )}
      <div className="embedded-ad-content">
        <img 
          src={currentAd.imageUrl} 
          alt={currentAd.title}
          className="embedded-ad-image"
          onError={(e) => {
            // Fallback to a placeholder if image fails to load
            e.currentTarget.src = 'https://via.placeholder.com/300x200/4a90e2/ffffff?text=Support+Palestine'
          }}
        />
        <div className="embedded-ad-text">
          <h3 className="embedded-ad-title">{currentAd.title}</h3>
          <p className="embedded-ad-description">{currentAd.description}</p>
          <p className="embedded-ad-organization">by {currentAd.organization}</p>
          <div className="embedded-ad-cta">
            <span>Click to Support</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmbeddedAdComponent 