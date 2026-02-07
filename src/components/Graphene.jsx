import React, { useState } from 'react';
import graphIcon from '../assets/graph.png'
import '../styles/Graphene.css';

const GrapheneProtocol = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState(0);

  const sections = [
    {
      title: "Position Sizing: The Emotional Neutralizer",
      subtitle: "The thin line between a professional operator and a gambler",
      content: "Allocate only 1% to 2% of your risk capital per trade. No exceptions.",
      points: [
        "You must size your position so that the outcome—win or loss—elicits zero emotional response.",
        "If you experience swings of euphoria or fear while a trade is active, your position size is too large.",
        "By removing emotion, you eliminate the 'Revenge Trading' and 'Greed' impulses that destroy accounts.",
        "The percentage stays fixed; the dollar value of the position grows as your capital does.",
        "Maintain only one open trade at a time. Avoid 'compensatory' positions—such as shorting one asset against a losing long in another—as unnecessary complexity leads to over-leveraged and dead losing positions positions outside the risk management plan."
      ]
    },
    {
      title: "Asset Selection: Liquidity as a Shield",
      subtitle: "Focus on major assets only",
      content: "Focus exclusively on a maximum of 3 Major Assets (e.g., BTC, ETH, SOL, XRP, BCH).",
      points: [
        "Low-cap assets are 'shallow pools' easily manipulated by bots and market makers seeking 'hidden' liquidity (your Stop Loss).",
        "By trading high-liquidity, top-tier assets, you ensure your presence is camouflaged within the market volume.",
        "By narrowing your focus to a few pairs, you become a master of those assets' specific 'heartbeat' and patterns.",
        "Cognitive Load Optimization: Every extra asset you monitor increases your 'Information Load,' leading to Decision Fatigue—the primary cause of impulsive, non-protocol trades. By limiting your focus, you protect your mental bandwidth.",
        "Write down exactly which 3 assets you will trade and stick to them exclusively. Do not trade what you don't know and have not committed to on paper."
      ]
    },
    {
      title: "Risk-Reward Architecture: The 1:1 Parity",
      subtitle: "The mathematical truth in trading",
      content: "Every trade is executed with a strict 1:1 Risk-Reward Ratio.",
      points: [
        "A priori, price action is a 50/50 probability. We acknowledge this mathematical truth.",
        "Our technical analysis is not a 'crystal ball'; it is an 'edge' that shifts those odds to 65/35 (our statistical win rate)",
        "Over a long series of trades, this statistical advantage—grounded in the Kelly Criterion—ensures consistent capital growth.",
        "Capital Security: Never keep 100% of your risk capital on an exchange. Keep at most 3x your position size in your active trading account.",
        "Keep the remaining 90% in cold storage or hard currency to protect yourself from excessive volatility, platform failures, or regulatory freezes."
      ]
    },
    {
      title: "'Set & Forget' Mindset: Eliminating Entropy",
      subtitle: "Removing the human element",
      content: "Once a trade is live, the human element must be removed.",
      points: [
        "Do not stare at the charts. This is the 'Gambler's Obsession,' a typical symptom of emotional attachment.",
        "We signal trades on 4-hour and Daily timeframes; check your positions once every 24 hours.",
        "No Manual Interference: Never move your Stop Loss to 'break even' or close a trade manually.",
        "Manual interference dismantles the statistical structure of the system. Let the math work. Trust the edge."
      ]
    },
    {
      title: "Resilient Spirit: The Stoic Trader",
      subtitle: "Discipline is your ultimate shield",
      content: "In the wild jungle of crypto and derivatives markets, trust only this protocol.",
      points: [
        "The Hard Truth: You will make mistakes and take losses. Accept this in advance to overcome the drawdowns.",
        "Do not blame others for your actions. Be stoic. Do not punish yourself; learn and keep moving forward.",
        "If a setup fails, analyze the error objectively and sharpen your blades for the next trade. If you fail, internalize the lesson, keep calm, and return to the Protocol.",       
        "Your discipline is your only true edge. Never trade without it; never trade it away."
      ]
    },
    {
      title: "Execution Framework: The Strategic Strike",
      subtitle: "Hard-Coding entry and exit valid setups",
      content: "Operate exclusively within the Daily Trend and defined Fibonacci Kill Zones.",
      points: [
        "Trend Direction: Filter all trades through the Daily Chart. Higher Highs/Lows for Longs; Lower Highs/Lows for Shorts. If the market is 'choppy,' the Protocol remains in Standby.",
        "Setup A (Trend Continuation): On a 4H impulse, wait for pullbacks to the 0.5 or 0.618 Fibonacci levels. Confirmation requires Daily RSI to reset to the 45%–55% neutral zone.",
        "Setup B (Mean Reversion): Catch the end of Daily corrections by identifying 'Extreme Exhaustion' on the 4H RSI (>75 or <25) against the primary trend.",
        "The Candle Metric: For Mean Reversions, entry is valid ONLY at the Daily Candle Close if it shows low volatility (small body, minimal wicks), indicating buyer/seller exhaustion.",
        "Targeting: Aim for a 3%–5% price movement, prioritizing the 0.382 Fibonacci level, previous structure highs, or the -0.27 Extension to maintain mathematical consistency.",
        "The 20-Trade Lock: Hard-code any additional technical pattern or indicator you find optimal to refine your edge. Once your patterns are hard-coded, they are immutable. Do not alter them for at least 20 trades to allow for statistical validation."
      ]
    }
  ];

  return (
    <div className="graphene-modal-overlay" onClick={onClose}>
      <div className="graphene-modal" onClick={(e) => e.stopPropagation()}>
        <button className="graphene-close-btn" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        
        <div className="graphene-header">
          <h1 className="graphene-title">
          <img 
            src={graphIcon} 
            alt="Graph icon" 
            className="title-icon left-icon"
          />
            The Graphene Protocol
            <img 
              src={graphIcon} 
              alt="Graph icon" 
              className="title-icon right-icon"
            />
          </h1>
          <p className="graphene-subtitle">
          The Blueprint for Unbreakable Trading
          </p>
        </div>

        <div className="graphene-nav">
          {sections.map((section, index) => (
            <button
              key={index}
              className={`graphene-nav-btn ${activeSection === index ? 'active' : ''}`}
              onClick={() => setActiveSection(index)}
            >
              {index+1}. {section.title.split(':')[0]}
            </button>
          ))}
        </div>

        <div className="graphene-content">
          <div className="section-header">
            <h2 className="graphene-section-title">
              <span className="section-number">{activeSection+1}.</span>
              {sections[activeSection].title}
            </h2>
            <p className="graphene-section-subtitle">{sections[activeSection].subtitle}</p>
          </div>
          
          <div className="section-body">
            <p className="section-main-content">{sections[activeSection].content}</p>
            
            {sections[activeSection].points && (
              <ul className="protocol-points">
                {sections[activeSection].points.map((point, index) => (
                  <li key={index} className="protocol-point">
                    <i className="fas fa-arrow-right point-icon"></i>
                    {point}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="section-navigation">
            <button 
              className="nav-arrow prev"
              onClick={() => setActiveSection(prev => Math.max(0, prev - 1))}
              disabled={activeSection === 0}
            >
              <i className="fas fa-chevron-left"></i> Previous
            </button>
            
            <div className="section-indicator">
              {sections.map((_, index) => (
                <span 
                  key={index}
                  className={`indicator-dot ${activeSection === index ? 'active' : ''}`}
                  onClick={() => setActiveSection(index)}
                />
              ))}
            </div>
            
            <button 
              className="nav-arrow next"
              onClick={() => setActiveSection(prev => Math.min(sections.length - 1, prev + 1))}
              disabled={activeSection === sections.length - 1}
            >
              Next <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <div className="graphene-footer">
          <p className="protocol-disclaimer">
            <i className="fas fa-exclamation-triangle"></i>
            All information provided here is for educational purposes only and must never be taken as financial advice. Trading derivatives and cryptocurrencies involves high risk; no profits are guaranteed. You acknowledge that you are solely responsible for your own trading decisions and their outcomes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GrapheneProtocol;