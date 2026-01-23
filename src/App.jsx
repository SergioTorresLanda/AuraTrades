import { useState } from 'react'
import React from 'react'
import logo from './assets/auralogo7.png'
import './app.js'    
import './config.js' 
import './styles/styles.css' 
import './App.css'
import { RewardProvider } from './contexts/BCHContext'
import { useWallet } from './hooks/useWallet' 
import SignalsGrid from './components/SignalsGrid'
import SmoothScrollLink from './components/SmoothScroll'
import FaqSection from './components/FaqSection'
import GrapheneProtocol from './components/Graphene'
import ConnectWalletButton from './components/ConnectWalletButton'  
import AuraTokens from './components/AuraTokens'

function App() {
  const [count, setCount] = useState(0)
  const [showGrapheneProtocol, setShowGrapheneProtocol] = useState(false)
  const [showTokens, setShowTokens] = useState(false)

  return (
    <RewardProvider>
      {
    <>
     <nav className="how-it-works-nav">
     <ConnectWalletButton />

     <a 
          href="#auraTokens" 
          className="nav-link"
          onClick={(e) => {
            e.preventDefault()
            setShowTokens(true)
          }}
        >
          <i className="fas fa-trophy"></i> AuraTokens
        </a>

     <SmoothScrollLink href="#how-it-works">
        <i className="fas fa-question-circle"></i> How It Works
      </SmoothScrollLink>
      
      <SmoothScrollLink href="#faq">
        <i className="fas fa-comments"></i> FAQ
      </SmoothScrollLink>
      
      <a 
          href="#graphene" 
          className="nav-link"
          onClick={(e) => {
            e.preventDefault()
            setShowGrapheneProtocol(true)
          }}
        >
          <i className="fas fa-info-circle"></i> Graphene Protocol
        </a>

  </nav>
    {/* Header Component */}
    <header className="header">
        <img src={logo} alt="AuraTrades Logo" className="logo-icon" />
        <p className="tagline">
          Community-Validated AI Trading Signals • Powered by Collective Intuition
        </p>
      </header>

         {/* Stats Bar Component */}
         <div className="stats-bar">
        <div className="stat-item">
          <div className="stat-value" id="total-signals">3</div>
          <div className="stat-label">Live Signals</div>
        </div>
        <div className="stat-item">
          <div className="stat-value" id="total-votes">0</div>
          <div className="stat-label">Total Votes</div>
        </div>
        <div className="stat-item">
          <div className="stat-value" id="accuracy-rate">73%</div>
          <div className="stat-label">Accuracy Rate</div>
        </div>
        <div className="stat-item">
          <div className="stat-value" id="active-users">15</div>
          <div className="stat-label">Active Traders</div>
        </div>
        <div className="stat-item">
        <div className="stat-value" id="pool-balance">0.00</div>
        <div className="stat-label">BCH Available</div>
        </div>
      </div>

      <div className="container">

        <SignalsGrid />

        <div className="quick-start">
          <h3><i className="fas fa-rocket"></i> Get Started in 60 Seconds</h3>
          <div className="quick-steps">
              <div className="quick-step">
                  <span className="quick-number">①</span>
                  <span>Connect or create your BCH wallet</span>
              </div>
              <div className="quick-step">
                  <span className="quick-number">②</span>
                  <span>Browse & vote on trading signals</span>
              </div>
              <div className="quick-step">
                  <span className="quick-number">④</span>
                  <span>Unlock trophys & claim BCH rewards</span>
              </div>
          </div>
        </div>

        <section id="how-it-works" className="section">
          <h2 className="section-title">
              <i className="fas fa-magic"></i> How AuraTrades Works
          </h2>
          
          <div className="steps-container">
              <div className="step-card">
                  <div className="step-number">1</div>
                  <div className="step-icon">
                      <i className="fas fa-robot"></i>
                  </div>
                  <h3 className="step-title">AI Generates Signals</h3>
                  <p className="step-description">
                      Our AI bots analyze market data 24/7 using technical indicators 
                       to generate trading signals, always with a 1:1 risk/reward ratio.
                  </p>
              </div>
              
              <div className="step-card">
                  <div className="step-number">2</div>
                  <div className="step-icon">
                      <i className="fas fa-vote-yea"></i>
                  </div>
                  <h3 className="step-title">Community Votes</h3>
                  <p className="step-description">
                      Traders like you vote bullish or bearish on each signal. 
                      Conenct your BCH wallet or create one to participate and earn rewards.
                  </p>
              </div>
              
              <div className="step-card">
                  <div className="step-number">3</div>
                  <div className="step-icon">
                      <i className="fas fa-chart-line"></i>
                  </div>
                  <h3 className="step-title">Collective Wisdom Emerges</h3>
                  <p className="step-description">
                      Signals with highest community confidence shows first. 
                      See which bots perform best with transparent win-rate tracking.
                  </p>
              </div>
              
              <div className="step-card">
                  <div className="step-number">4</div>
                  <div className="step-icon">
                      <i className="fas fa-wallet"></i>
                  </div>
                  <h3 className="step-title">Execute & Earn</h3>
                  <p className="step-description">
                      Use the signals on your preferred exchange. Unlock NFTs and claim BCH rewards 
                      for accurate votes and build your reputation as a top AuraTrader.
                  </p>
              </div>
          </div>
        </section>

        <FaqSection/>

      <footer className="footer">
      <p>Certifying trading skill on-chain with collectibles - proof of expertise.</p>
        <p>AuraTrades © 2026 | Built for BCH-1 Hackcelerator</p>
      </footer>

    </div>

    {showGrapheneProtocol && (
      <GrapheneProtocol onClose={() => setShowGrapheneProtocol(false)} />
    )}
    {showTokens && (
      <AuraTokens onClose={() => setShowTokens(false)} />
    )}

    </>
    }
    </RewardProvider>
  )
}

export default App
