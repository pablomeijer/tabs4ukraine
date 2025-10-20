import './AboutPage.css'

export const AboutPage = () => {
  const handleVisitWebsite = () => {
    window.open('https://tabs4ukraine.framer.website/', '_blank')
  }

  const handleContactEmail = () => {
    window.open('mailto:support@tabs4ukraine.framer.website', '_blank')
  }

  return (
    <div className="about-container">
      <div className="about-header">
        <h2 className="about-title">🚀 Tabs4Ukraine</h2>
        <p className="about-subtitle">Turn Every Tab into Support</p>
      </div>

      <div className="about-content">
        <div className="about-section">
          <h3 className="about-section-title">How It Works</h3>
          <p className="about-description">
            Open a tab, make a difference. Every time you browse, discreet ads run in the background—never disrupting your experience.
            The revenue generated from these ads is donated to humanitarian organizations supporting Ukraine. Together, we can generate
            meaningful donations to support the people of Ukraine.
          </p>
          <p className="about-description">
            Your everyday browsing becomes a practical way to deliver real help to those affected by the war in Ukraine.
          </p>
        </div>

        <div className="about-section">
          <h3 className="about-section-title">Key Features</h3>
          <ul className="about-features">
            <li>✨ Seamless integration with your browsing experience</li>
            <li>💝 Revenue automatically donated to Ukrainian humanitarian causes</li>
            <li>🎯 Multiple impact levels to maximize your contribution</li>
            <li>🔒 Privacy-focused with no personal data collection</li>
            <li>🌍 Support for verified humanitarian organizations</li>
          </ul>
        </div>

        <div className="about-section">
          <h3 className="about-section-title">Impact Levels</h3>
          <div className="impact-levels">
            <div className="impact-level">
              <span className="impact-number">1</span>
              <span className="impact-text">Advertisement - Basic support</span>
            </div>
            <div className="impact-level">
              <span className="impact-number">2</span>
              <span className="impact-text">Advertisements - Enhanced impact</span>
            </div>
            <div className="impact-level">
              <span className="impact-number">3</span>
              <span className="impact-text">Advertisements - Maximum support</span>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h3 className="about-section-title">Supported Organizations</h3>
          <p className="about-description">
            We partner with verified humanitarian organizations including UNICEF, Save the Children, Doctors Without Borders,
            World Central Kitchen, the International Rescue Committee, and other trusted organizations supporting
            humanitarian relief efforts for Ukraine.
          </p>
        </div>
      </div>

      <div className="about-actions">
        <button className="about-button primary" onClick={handleVisitWebsite}>
          🌐 Visit tabs4ukraine.framer.website
        </button>
        <button className="about-button secondary" onClick={handleContactEmail}>
          📧 Contact Us
        </button>
      </div>

      <div className="about-footer">
        <p className="about-footer-text">"Together, we can turn everyday browsing into meaningful support."</p>
        <p className="about-version">Version 1.0.0</p>
      </div>
    </div>
  )
}

export default AboutPage 