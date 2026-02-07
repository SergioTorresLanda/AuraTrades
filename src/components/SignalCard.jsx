import React, { useState } from 'react'
import { vote } from '../app.js'
import btcIcon from '../assets/btc.png'
import ethIcon from '../assets/eth.png'
import bchIcon from '../assets/bch.png'
import xrpIcon from '../assets/xrp.png'
import solIcon from '../assets/sol.png' 
import adaIcon from '../assets/ada.png'
import dogeIcon from '../assets/doge.png' 
import bnbIcon from '../assets/bnb.png' 

function SignalCard({ 
  id = 1,
  pair = "BTC/USDT",
  fullName = "Bitcoin / Tether",
  direction = "bullish",
  action = "LONG",
  entryPrice = "$90,500",
  targetPrice = "$95,000",
  stopLoss = "$87,500",
  confidence = 0,
  upvotes = 0,
  downvotes = 0,
  botName = "FibOracle",
  winRate = "65%"
}) {
  const [upvoteCount, setUpvoteCount] = useState(upvotes)
  const [downvoteCount, setDownvoteCount] = useState(downvotes)
  const [confidenceLevel, setConfidenceLevel] = useState(confidence)
  const [hasVoted, setHasVoted] = useState(false)

  const handleVote = async (voteType) => {
    if (hasVoted) {
      alert("You've already voted on this signal!")
      return
    }

    try {
      const result = await vote(id, voteType, action === "LONG" ? 'up' : 'down')
      
      // Update local state
      if (voteType === 'up') {
        setUpvoteCount(prev => prev + 1)
      } else {
        setDownvoteCount(prev => prev + 1)
      }
      
      // Update confidence (you might want to calculate this based on votes)
      const newConfidence = calculateNewConfidence(voteType)
      setConfidenceLevel(newConfidence)
      setHasVoted(true)
      
    } catch (error) {
      console.error('Vote failed:', error)
      alert('Vote failed. Please try again.')
    }
  }

  const calculateNewConfidence = (voteType) => {
    // Your confidence calculation logic here
    const totalVotes = upvoteCount + downvoteCount + 1
    const newUpvotes = voteType === 'up' ? upvoteCount + 1 : upvoteCount
    return Math.round((newUpvotes / totalVotes) * 100)
  }

  // Determine icon based on pair
  const CRYPTO_ICONS = {
    btc: btcIcon,
    eth: ethIcon,
    bch: bchIcon,
    xrp: xrpIcon,
    sol: solIcon,
    ada: adaIcon,  // if you have more
    doge: dogeIcon, 
    bnb: bnbIcon
  }
  
  // Then in component
  const getPairIcon = () => {
    const pairLower = pair.toLowerCase()
    
    // Find first matching crypto in the pair
    for (const [crypto, icon] of Object.entries(CRYPTO_ICONS)) {
      if (pairLower.includes(crypto)) {
        return icon
      }
    }
    
    return defaultIcon
  }

  return (
    <div className={`signal-card ${direction}`} id={`signal-${id}`}>
      <div className="signal-header">
        <div className="signal-pair">
          <div className="pair-icon">
              <img 
                src={getPairIcon()} 
                alt={`${pair} icon`}
                className="crypto-icon"
                onError={(e) => {
                  e.target.style.display = 'none'
                  const fallbackIcon = document.createElement('i')
                  fallbackIcon.className = 'fas fa-chart-line'
                  e.target.parentNode.appendChild(fallbackIcon)
                }}
              />
          </div>
          <div>
            <div className="pair-name">{pair}</div>
            <div className="pair-fullname">{fullName}</div>
          </div>
        </div>
        <div className={`signal-action ${direction === 'bullish' ? 'buy' : 'sell'}`}>
          {action}
        </div>
      </div>
      
      <div className="signal-meta">
        <div className="meta-item">
          <span className="meta-label">Entry price</span>
          <span className="meta-value">{entryPrice}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Target Price</span>
          <span className="meta-value">{targetPrice}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Stop Loss</span>
          <span className="meta-value">{stopLoss}</span>
        </div>
      </div>
      
      <div className="aura-confidence">
        <div className="confidence-header">
          <span className="confidence-label">Aura Confidence</span>
          <span className={`confidence-value-${id}`}>{confidenceLevel}%</span>
        </div>
        <div className="confidence-bar" id={`confidence-bar-${id}`}>
          <div 
            className={`confidence-fill ${direction}`} 
            style={{ width: `${confidenceLevel}%` }}
          ></div>
        </div>
      </div>
      
      <div className="vote-section">
        <div className="vote-header">
          <div className="vote-title">Community Aura</div>
          <div className="vote-stats">
            <div className="vote-stat up">
              <i className="fas fa-arrow-up"></i>
              <span id={`upvotes-${id}`}>{upvoteCount}</span>
            </div>
            <div className="vote-stat down">
              <i className="fas fa-arrow-down"></i>
              <span id={`downvotes-${id}`}>{downvoteCount}</span>
            </div>
          </div>
        </div>
        
        <div className="vote-buttons">
          <button 
            className={`vote-button upvote ${hasVoted ? 'disabled' : ''}`}
            onClick={() => handleVote('up')}
            disabled={hasVoted}
          >
            <i className="fas fa-arrow-up"></i>
            <span>Bullish</span>
          </button>
          <button 
            className={`vote-button downvote ${hasVoted ? 'disabled' : ''}`}
            onClick={() => handleVote('down')}
            disabled={hasVoted}
          >
            <i className="fas fa-arrow-down"></i>
            <span>Bearish</span>
          </button>
        </div>
      </div>
      
      <div className="bot-performance">
        <i className="fas fa-robot"></i>
        <span>Signal by: <span className="bot-name">{botName}</span></span>
        <span className="win-rate">Win Rate: {winRate}</span>
      </div>
    </div>
  )
}

export default SignalCard