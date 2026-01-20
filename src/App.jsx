import { useState } from 'react'
import React from 'react'
import logo from './assets/logo2.png'
import './app.js'    
import './config.js' 
import './styles/styles.css' 
import './App.css'
import { RewardProvider } from './contexts/BCHContext.jsx'
import WalletButton from './components/WalletButton'
import SignalsGrid from './components/SignalsGrid.jsx'
import SmoothScrollLink from './components/SmoothScroll'
import FaqSection from './components/FaqSection'

function App() {
  const [count, setCount] = useState(0)

  return (
    <RewardProvider>
      {
    <>
     <nav className="how-it-works-nav">
     <WalletButton />
     <SmoothScrollLink href="#how-it-works">
        <i className="fas fa-question-circle"></i> How It Works
      </SmoothScrollLink>
      
      <SmoothScrollLink href="#faq">
        <i className="fas fa-comments"></i> FAQ
      </SmoothScrollLink>
      
      <SmoothScrollLink href="#graphene">
        <i className="fas fa-info-circle"></i> Graphene Protocol
      </SmoothScrollLink>
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
      </div>

      <div className="container">

        <SignalsGrid />

        <div className="quick-start">
          <h3><i className="fas fa-rocket"></i> Get Started in 60 Seconds</h3>
          <div className="quick-steps">
              <div className="quick-step">
                  <span className="quick-number">①</span>
                  <span>Connect your BCH wallet</span>
              </div>
              <div className="quick-step">
                  <span className="quick-number">②</span>
                  <span>Browse trading signals</span>
              </div>
              <div className="quick-step">
                  <span className="quick-number">③</span>
                  <span>Vote bullish/bearish</span>
              </div>
              <div className="quick-step">
                  <span className="quick-number">④</span>
                  <span>Earn BCH rewards</span>
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
                      (RSI, MACD, Moving Averages, Fibonacci, etc.) to generate trading signals, always with a 1:1 risk/reward ratio.
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
                      Hold BCH in your wallet to participate and earn rewards.
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
                      Use the signals on your preferred exchange. Earn BCH rewards 
                      for accurate votes and build your reputation as a top trader.
                  </p>
              </div>
          </div>
        </section>

        <FaqSection/>

        <div className="funding-stats">
          <h3><i className="fas fa-piggy-bank"></i> Reward Pool</h3>
          <div className="stats-grid">
            <p>Rewards funded by: <code id="reward-address">Loading...</code></p>
              <div className="stat">
                  <div className="stat-value" id="pool-balance">0.00</div>
                  <div className="stat-label">BCH Available</div>
              </div>
             
           
          </div>
          <div className="funding-note">
              <i className="fas fa-info-circle"></i>
              Real Bitcoin Cash rewards funded by AuraTrades
          </div>
      </div>

      <footer className="footer">
        <p>AuraTrades © 2026 | Built for BCH-1 Hackcelerator</p>
        <div className="footer-links">
            <a href="#" className="footer-link">Documentation</a>
            <a href="#" className="footer-link">GitHub</a>
        </div>
      </footer>

    </div>
   
      {/*  
        <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      */ }
    
    </>
    }
    </RewardProvider>
  )
}

export default App
