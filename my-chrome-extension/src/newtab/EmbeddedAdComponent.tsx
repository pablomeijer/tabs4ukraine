import type React from 'react'
import './EmbeddedAdComponent.css'

interface EmbeddedAdComponentProps {
  position: 'top' | 'side' | 'bottom' | 'bottom-right' | 'bottom-right-top' | 'bottom-middle'
  adIndex: number
  onClose?: () => void
}

export const EmbeddedAdComponent = ({ position, onClose }: EmbeddedAdComponentProps) => {
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClose?.()
  }

  return (
    <div className={`embedded-ad-container embedded-ad-${position}`}>
      {onClose && (
        <button 
          className="embedded-ad-close" 
          onClick={handleClose}
          title="Close ad"
        >
          ×
        </button>
      )}
      <div className="embedded-ad-content" style={{ padding: 0 }}>
        <iframe
          title="sponsored-ad"
          src="ad-loader-secure.html"
          sandbox="allow-scripts allow-popups"
          referrerPolicy="no-referrer-when-downgrade"
          style={{
            width: '100%',
            height: '100%',
            border: '0',
            display: 'block',
            background: 'transparent'
          }}
        />
      </div>
    </div>
  )
}

export default EmbeddedAdComponent 