import React, { useState } from 'react';
import { useReward } from '../contexts/BCHContext'
import { sendReward } from '../app.js'
import { sendToken } from '../app.js'
import sha256 from 'crypto-js/sha256';

import bison from '../assets/bisonX.png';
import lidia from '../assets/lidiaX.png';
import brahman from '../assets/brahmanX.png';
import buffalo from '../assets/buffaloX.png';
import black from '../assets/black.png';
import grizzly from '../assets/grizzly.png';
import polar from '../assets/polar.png';
import inferno from '../assets/inferno.png';
import hero from '../assets/herox.png';
import cypher from '../assets/cypherpunk.png';
import satoshi from '../assets/sat.png';

const AuraTokens = ({ onClose }) => {

  const { rewardSystem } = useReward()

  const [userProgress] = useState({
    // Bull tokens progress 
    lidia: 100,
    bison: 50,
    buffalo: 20,
    brahman: 5,
    // Bear tokens progress
    grizzly: 40,
    sloth: 20,
    polar: 10,
    inferno: 2,
    //Loyalty tokens progress
    hero:50,
    cypherpunk:20,
    satoshi:5
  });

  const [unlockedTokens] = useState([
    'lidia', 'hero', 'grizzly', 'sloth',  'bison', 'polar', 'brahman', 'buffalo', 'inferno', 'cypherpunk', 'satoshi'
  ]); // List of unlocked token IDs
  const [unlockedTokens2] = useState([
  ]); 
  


  const bullTokens = [
    { id: 'lidia', name: 'Lidia', image: lidia, condition: '21 bullish votes', progressKey: 'lidia', reward: "0.002" },
    { id: 'bison', name: 'Bison', image: bison, condition: '21 correct bullish votes', progressKey: 'bison', reward: "0.01" },
    { id: 'buffalo', name: 'Buffalo', image: buffalo, condition: '21 bullish votes*', progressKey: 'buffalo', reward: "0.05" },
    { id: 'brahman', name: 'Brahman', image: brahman, condition: '21 correct bullish votes*', progressKey: 'brahman', reward: "0.1"}

  ];

  const bearTokens = [
    { id: 'grizzly', name: 'Grizzly', image: grizzly, condition: '21 bearish votes', progressKey: 'grizzly', reward: "0.005" },
    { id: 'sloth', name: 'Sloth', image: black, condition: '21 correct bearish votes', progressKey: 'sloth', reward: "0.01" },
    { id: 'polar', name: 'Polar', image: polar, condition: '21 bearish votes*', progressKey: 'polar', reward: "0.05" },
    { id: 'inferno', name: 'Inferno', image: inferno, condition: '21 correct bearish votes*', progressKey: 'inferno', reward: "0.1" }
  ];

  const loyaltyTokens = [
    { id: 'hero', name: 'Hero', image: hero, condition: 'first voter in 21 signals', progressKey: 'hero', reward: "0.005" },
    { id: 'cypherpunk', name: 'Cypherpunk', image: cypher, condition: 'vote 21 days in a row', progressKey: 'cypherpunk', reward: "0.05" },
    { id: 'satoshi', name: 'Satoshi', image: satoshi, condition: 'vote 50 days in a row**', progressKey: 'satoshi', reward: "0.21" },
  ];
    const [isClaimed, setIsClaimed] = useState(false)

   const handleReward = async (reward) => {

      if (isClaimed) {
        alert("You've already claimed this reward!")
        return
      }
  
      try {
        const result = await sendReward(reward, rewardSystem)
        const token = createTrophyToken(userData, bullTokens[0]);
        //console.log('Lidia Trophy Token:', token);
        const res = await sendToken(token, rewardSystem)    
        
      } catch (error) {
        console.error('Reward failed:', error)
        alert('Reward failed. Please try again.')
      }
    }

    const createTrophyToken = (userData, tokenData) => {
  // Generate unique commitment hash
  const commitment = sha256(
    `${tokenData.id}-${userData.address}-${Date.now()}`
  )

  const trophyToken = {
    category: 'achievement',
    commitment: `0x${commitment}`,
    capability: 'none', // Non-upgradable, unique token
    data: {
      // Basic achievement info
      achievementId: tokenData.id,
      name: tokenData.name,
      type: tokenData.id.includes('bull') ? 'bull' : 
            tokenData.id.includes('bear') ? 'bear' : 'loyalty',
      
      // User info
      recipient: userData.address, // From wallet connection
      awarded: new Date().toISOString(),
      
      // Achievement-specific stats
      stats: {
        // Bull tokens specific
        ...(tokenData.id.includes('bull') && {
          totalBullishVotes: userData.stats.totalBullishVotes,
          correctBullishVotes: userData.stats.correctBullishVotes,
          bullishAccuracy: userData.stats.correctBullishVotes / userData.stats.totalBullishVotes,
          requiredForToken: tokenData.condition.includes('correct') ? 21 : 21
        }),
        
        // Bear tokens specific  
        ...(tokenData.id.includes('bear') && {
          totalBearishVotes: userData.stats.totalBearishVotes,
          correctBearishVotes: userData.stats.correctBearishVotes,
          bearishAccuracy: userData.stats.correctBearishVotes / userData.stats.totalBearishVotes,
          requiredForToken: tokenData.condition.includes('correct') ? 21 : 21
        }),
        
        // Loyalty tokens specific
        ...(tokenData.id.includes('hero') || tokenData.id.includes('cypher') || tokenData.id.includes('satoshi') && {
          consecutiveDays: userData.stats.consecutiveDays,
          totalDaysVoted: userData.stats.totalDaysVoted,
          walletBalance: userData.walletBalance, // For * conditions
          requiredForToken: tokenData.condition.includes('50') ? 50 : 21
        }),
        
        // Common stats
        overallAccuracy: userData.stats.overallAccuracy,
        totalVotes: userData.stats.totalVotes,
        rank: userData.stats.rank,
        unlockScore: userData.stats.unlockScore
      },
      
      // Reward info
      reward: {
        amount: tokenData.reward,
        currency: 'BCH',
        claimed: false,
        claimTx: null,
        claimableAt: new Date().toISOString() // Immediately claimable
      },
      
      // Proof data (on-chain references)
      proof: {
        // Links to BCH transactions proving votes
        lastVoteTx: userData.lastVoteTxId,
        achievementTx: null, // Will be filled when minted on-chain
        merkleRoot: userData.votesMerkleRoot, // For batch verification
        
        // For * conditions (wallet balance requirement)
        ...(tokenData.condition.includes('*') && {
          balanceProofTx: userData.balanceProofTx,
          minBalance: '0.1', // or '1' for **
          verifiedAt: userData.balanceVerifiedAt
        })
      },
      
      // Metadata
      version: '1.0',
      generation: 'gen1', // First generation tokens
      rarity: tokenData.reward >= '0.1' ? 'legendary' : 
              tokenData.reward >= '0.05' ? 'epic' : 
              tokenData.reward >= '0.01' ? 'rare' : 'common',
      
      // Visual/UI data
      display: {
        image: tokenData.image, // Reference to image file
        color: tokenData.id.includes('bull') ? '#00FF9D' : 
               tokenData.id.includes('bear') ? '#FF3366' : '#FFD700',
        animation: tokenData.id.includes('brahman') || 
                   tokenData.id.includes('inferno') || 
                   tokenData.id.includes('satoshi') ? 'glow' : 'none'
      }
    }
  };

  return trophyToken;
};

// Example usage:
const userData = {
  address: 'bitcoincash:qqzzmf9z334gw68lmhtzg68ktqpf4yp34gruglkljr',
  stats: {
    totalBullishVotes: 21,
    correctBullishVotes: 10,
    totalBearishVotes: 0,
    correctBearishVotes: 0,
    consecutiveDays: 0,
    overallAccuracy: 0.7,
    totalVotes: 21,
    rank: 2,
    unlockScore: 185
  },
  walletBalance: '0.008',
  lastVoteTxId: 'uidxx123fjg94jf84kdks9f85jf',
  votesMerkleRoot: 'def456sldog84869etcjgj'
};

  return (
    <div className="aura-tokens-overlay" onClick={onClose}>
    <div className="aura-tokens-modal" onClick={(e) => e.stopPropagation()}>
      
      <button className="graphene-close-btn" onClick={onClose}>
        <i className="fas fa-times"></i>
      </button>
      
      {<section className="aura-tokens-section">
      {/* First Section: Bull & Bear Collections */}
      <div className="tokens-collections">
        <div className="section-headerX">
          <h2 className="section-titleX">AuraTokens (1st Gen)</h2>
          <p className="section-subtitle">Collectible NFTs earned through participation & accuracy on our voting system</p>
        </div>

        {/* Bull Collection */}
        <div className="collection-group">
          <h3 className="collection-title bull">
            <i className="fas fa"></i> Bull Collection
          </h3>          
          <div className="tokens-grid">
            {bullTokens.map((token) => (
              <div key={token.id} className={`token-card ${unlockedTokens.includes(token.id) ? 'unlocked' : 'locked'}`}>
                <div className="token-image-container">
                <img src={token.image} alt={token.name} className="token-image" />
                  {!unlockedTokens.includes(token.id) && (
                    <div className="lock-overlay">
                      <i className="fas fa-lock"></i>
                    </div>
                  )}
                </div>
                <div className="token-info">
                  <h4 className="token-name">{token.name}</h4>
                  <p className="token-condition">{token.condition}</p>
                  
                  <div className="progress-section">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${userProgress[token.progressKey]}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">
                      {unlockedTokens.includes(token.id) ? '100%' : `${userProgress[token.progressKey]}%`}
                    </span>
                  </div>
                  {!unlockedTokens.includes(token.id) && (
                  <p className="token-reward">Reward: {token.reward} BCH</p>
                  )}
                  {unlockedTokens.includes(token.id) && (
                     <button 
                     className={`cta-button ${isClaimed ? 'disabled' : ''}`}
                     onClick={() => {
                       handleReward(token.reward)
                     }}
                     disabled={isClaimed}
                     >
                     <i className="fas fa-coin "></i> Claim: {token.reward} BCH
                     </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="collection-subtitle">*Voting with a connected wallet with balance greater than 0.1 BCH.
          </p>
        </div>

        {/* Bear Collection */}
        <div className="collection-group">
          <h3 className="collection-title bear">
            <i className="fas"></i> Bear Collection
          </h3>          
          <div className="tokens-grid">
            {bearTokens.map((token) => (
              <div key={token.id} className={`token-card ${unlockedTokens.includes(token.id) ? 'unlocked' : 'locked'}`}>
                <div className="token-image-container">
                  <img src={token.image} alt={token.name} className="token-image" />
                  {!unlockedTokens.includes(token.id) && (
                    <div className="lock-overlay">
                      <i className="fas fa-lock"></i>
                    </div>
                  )}
                </div>
                <div className="token-info">
                  <h4 className="token-name">{token.name}</h4>
                  <p className="token-condition">{token.condition}</p>
                  
                  <div className="progress-section">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${userProgress[token.progressKey]}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">
                      {unlockedTokens.includes(token.id) ? '100%' : `${userProgress[token.progressKey]}%`}
                    </span>
                  </div>
                  {!unlockedTokens.includes(token.id) && (
                  <p className="token-reward">Reward: {token.reward} BCH</p>
                  )}
                  {unlockedTokens.includes(token.id) && (
                   <button 
                   className={`cta-button ${isClaimed ? 'disabled' : ''}`}
                   onClick={() => {
                     handleReward(token.reward)
                   }}
                   disabled={isClaimed}
                   >
                   <i className="fas fa-coin "></i> Claim: {token.reward} BCH
                   </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="collection-subtitle">*Voting with a connected wallet with balance greater than 0.1 BCH.</p>

        </div>

        <div className="collection-group">
            <h3 className="collection-title loyalty">
              <i className="fas"></i> Loyalty Collection
            </h3>          
            <div className="tokens-grid">
              {loyaltyTokens.map((token) => (
                <div key={token.id} className={`token-card ${unlockedTokens.includes(token.id) ? 'unlocked' : 'locked'}`}>
                  <div className="token-image-container">
                    <img src={token.image} alt={token.name} className="token-image" />
                    {!unlockedTokens.includes(token.id) && (
                      <div className="lock-overlay">
                        <i className="fas fa-lock"></i>
                      </div>
                    )}
                  </div>
                  <div className="token-info">
                    <h4 className="token-name">{token.name}</h4>
                    <p className="token-condition">{token.condition}</p>
                    
                    <div className="progress-section">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${userProgress[token.progressKey]}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">
                        {unlockedTokens.includes(token.id) ? '100%' : `${userProgress[token.progressKey]}%`}
                      </span>
                    </div>
                    {!unlockedTokens.includes(token.id) && (
                    <p className="token-reward">Reward: {token.reward} BCH</p>
                    )}
                    {unlockedTokens.includes(token.id) && (
                    <button 
                    className={`cta-button ${isClaimed ? 'disabled' : ''}`}
                    onClick={() => {
                      handleReward(token.reward)
                    }}
                    disabled={isClaimed}
                    >
                    <i className="fas fa-coin "></i> Claim: {token.reward} BCH
                    </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="collection-subtitle">**Voting with a connected wallet with balance greater than 1 BCH.</p>

          </div>
      </div>      

      {/* Second Section: User's Tokens */}
      <div className="my-tokens-section">
        <div className="section-headerX">
          <h2 className="section-titleX">My Tokens</h2>
        </div>

        {unlockedTokens2.length === 0 ? (
          <div className="empty-state">
            <p className="section-subtitleX">
            {unlockedTokens2.length > 0 
              ? `You've unlocked ${unlockedTokens2.length} tokens!` 
              : "You have not unlocked any tokens yet. Keep voting on signals to unlock them and redeem BCH rewards!"
            }
          </p>
            <i className="fas fa-chess-knight empty-icon"></i>
            <p className="empty-message">Start voting to earn your first AuraToken!</p>

          </div>
        ) : (
          <div className="unlocked-tokens-grid">
            {/* Show unlocked tokens here */}
            <p>Your unlocked tokens will appear here</p>
          </div>
        )}
      </div>
      </section>}
    </div>
    </div>
    
  );
}

export default AuraTokens;