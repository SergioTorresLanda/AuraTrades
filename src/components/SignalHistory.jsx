import React, { useState } from 'react';
import '../styles/SignalHistory.css'; 
import '../styles/Graphene.css'; 
import btcIcon from '../assets/btc.png'
import ethIcon from '../assets/eth.png'
import bchIcon from '../assets/bch.png'
import xrpIcon from '../assets/xrp.png'
import solIcon from '../assets/sol.png' 
import adaIcon from '../assets/ada.png'
import dogeIcon from '../assets/doge.png' 
import bnbIcon from '../assets/bnb.png' 
 
const dummyHistory = [
  {
    id: 1,
    pair: "BCH/USDT",
    fullName: "Bitcoin Cash / Tether",
    action: "LONG",
    entryPrice: 460,
    targetPrice: 520,
    stopLoss: 400,
    botName: "AlphaRSI",
    result: "WIN",
    exitPrice: 518,
    profitLoss: "+12.6%",
    closedDate: "2024-01-15T14:30:00Z"
  },
  {
    id: 2,
    pair: "BTC/USDT",
    fullName: "Bitcoin / Tether",
    action: "SHORT",
    entryPrice: 68700,
    targetPrice: 65000,
    stopLoss: 71000,
    botName: "GammaTrend",
    result: "LOSS",
    exitPrice: 69500,
    profitLoss: "-1.2%",
    closedDate: "2024-01-14T09:15:00Z"
  },
  {
    id: 3,
    pair: "ETH/USDT",
    fullName: "Ethereum / Tether",
    action: "LONG",
    entryPrice: 2000,
    targetPrice: 2170,
    stopLoss: 1790,
    botName: "BetaMomentum",
    result: "WIN",
    exitPrice: 3480,
    profitLoss: "+8.75%",
    closedDate: "2024-02-16T18:45:00Z"
  },
  {
    id: 4,
    pair: "SOL/USDT",
    fullName: "Solana / Tether",
    action: "LONG",
    entryPrice: 80,
    targetPrice: 100,
    stopLoss: 60,
    botName: "BetaMomentum",
    result: "WIN",
    exitPrice: 3480,
    profitLoss: "+8.75%",
    closedDate: "2024-02-13T18:45:00Z"
  }
];
const SignalHistory = ({ onClose }) => {
  const [history] = useState(dummyHistory);
  
  const totalSignals = history.length;
  const wins = history.filter(s => s.result === "WIN").length;
  const losses = history.filter(s => s.result === "LOSS").length;
  const winRate = totalSignals > 0 ? ((wins / totalSignals) * 100).toFixed(1) : 0;
  
   const CRYPTO_ICONS = {
      btc: btcIcon,
      eth: ethIcon,
      bch: bchIcon,
      xrp: xrpIcon,
      sol: solIcon,
      ada: adaIcon, 
      doge: dogeIcon, 
      bnb: bnbIcon
    }

  const getPairIcon = (pair) => {

    const pairLower = pair.toLowerCase()
    for (const [crypto, icon] of Object.entries(CRYPTO_ICONS)) {
      if (pairLower.includes(crypto)) {
        return icon
      }
    }
    return defaultIcon
  }
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="history-overlay" >
    <div className="signal-history-container" onClick={(e) => e.stopPropagation()}>
      
      <button className="graphene-close-btn" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      {/* Header with stats */}
      <div className="history-header">
        <h2 className="history-title">Signal History</h2>
        <div className="stats-summary">
          <div className="stat-item">
            <span className="stat-label">Total Signals: </span>
            <span className="stat-value">{totalSignals}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Win Rate: </span>
            <span className="stat-value win">{winRate}%</span>
          </div>
        </div>
        
        {/* Win rate progress bar */}
        <div className="win-rate-bar-container">
          <div 
            className="win-rate-fill" 
            style={{ width: `${winRate}%` }}
          ></div>
        </div>
      </div>
      
      {/* History list - vertical */}
      <div className="history-list">
        {history.map((signal) => (
          <div 
            key={signal.id} 
            className={`history-item ${signal.result === 'WIN' ? 'win-item' : 'loss-item'}`}
          >
            {/* Left side - Pair and action */}
            <div className="history-left">
              <div className="history-pair">
                <div className="pair-icon">
              <img 
                src={getPairIcon(signal.pair)} 
                alt={`${signal.pair} icon`}
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
                  <div className="pair-name">{signal.pair}</div>
                  {/* <div className="pair-fullname">{signal.fullName}</div>*/}
                </div>
              </div>
              
              <div className={`history-action ${signal.action === 'LONG' ? 'buy' : 'sell'}`}>
                {signal.action}
              </div>
            </div>
            
            {/* Center - Trade details */}
            <div className="history-details">
              <div className="detail-row">
                <div className="detail-item">
                  <span className="detail-label">Entry</span>
                  <span className="detail-value">${signal.entryPrice.toLocaleString()}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Target</span>
                  <span className="detail-value">${signal.targetPrice.toLocaleString()}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Stop Loss</span>
                  <span className="detail-value">${signal.stopLoss.toLocaleString()}</span>
                </div>
              </div>
              
        
            </div>
            
            {/* Right side - Result and date */}
            <div className="history-right">
              <div className={`history-result ${signal.result.toLowerCase()}`}>
                {signal.result}
              </div>
              <div className="history-date">
                <i className="far fa-calendar-alt"></i>
                {formatDate(signal.closedDate)}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Optional: Show empty state */}
      {history.length === 0 && (
        <div className="history-empty">
          <i className="fas fa-history"></i>
          <p>No closed signals yet</p>
        </div>
      )}
    </div>
    </div>
  );
}

export default SignalHistory;