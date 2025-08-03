import './AboutPage.css'

export const AboutPage = () => {
  const handleVisitWebsite = () => {
    window.open('https://tabs4palestine.com', '_blank')
  }

  const handleContactEmail = () => {
    window.open('mailto:freepalestine@gmail.com', '_blank')
  }

  return (
    <div className="about-container">
      <div className="about-header">
        <h2 className="about-title">🚀 Tabs4Palestine</h2>
        <p className="about-subtitle">Turn Every Tab into a Lifeline</p>
      </div>

      <div className="about-content">
        <div className="about-section">
          <h3 className="about-section-title">How It Works</h3>
          <p className="about-description">
            Open a tab, make a difference. Every time you browse, discreet ads run in the background—never disrupting your experience. 
            The revenue generated from these ads is donated towards Palestinian charities. Together we can generate meaningful donations 
            to support the people of Palestine.
          </p>
          <p className="about-description">
            Your everyday browsing is now a quiet act of resistance, delivering real help where the world often looks away.
          </p>
        </div>

        <div className="about-section">
          <h3 className="about-section-title">Key Features</h3>
          <ul className="about-features">
            <li>✨ Seamless integration with your browsing experience</li>
            <li>💝 Revenue automatically donated to Palestinian causes</li>
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
            We partner with verified humanitarian organizations including UNRWA, Palestine Red Crescent, 
            Save the Children, Oxfam, UNICEF, and other trusted aid organizations working directly with 
            Palestinian communities.
          </p>
        </div>
      </div>

      <div className="about-actions">
        <button className="about-button primary" onClick={handleVisitWebsite}>
          🌐 Visit tabs4palestine.com
        </button>
        <button className="about-button secondary" onClick={handleContactEmail}>
          📧 Contact Us
        </button>
      </div>

      <div className="about-footer">
        <p className="about-footer-text">
          "Together, our collective impact can turn everyday browsing into real change."
        </p>
        <p className="about-version">Version 1.0.0</p>
      </div>
    </div>
  )
}

export default AboutPage 