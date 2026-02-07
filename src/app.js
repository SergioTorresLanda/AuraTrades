import { functions, httpsCallable } from './firebase.js';

const REWARD_LIMITS = {
    perHour: 0.001,
    perDay: 0.01,
    totalPool: 0.3 
};

let userWalletAddress = "bitcoincash:qzld92ae0x8gjgvwa949lftn6q3u7slytvkcz8qcnw"
let walletConnected = false;
const voteRateLimit = {};

async function connectWallet() {

    try {

        if (!window.Wallet || !window.Mainnet) {
            alert('Please wait for wallet library to load...');
            return;
        }

        // CREATE A NEW WALLET 
        const wallet = await Wallet.newRandom();
        userWalletAddress = await wallet.cashaddr
        
        console.log('Wallet address:', userWalletAddress);
        localStorage.setItem('aura_wallet_address', userWalletAddress);
        // Update UI
        walletConnected = true;
        localStorage.setItem('aura_wallet', userWalletAddress);
        // Show IMPORTANT backup warning
        showBackupWarning(wallet.mnemonic);

        updateWalletUI();
                
    } catch (error) {
        walletConnected = false;
        console.error('Wallet creation failed:', error);
        alert('❌ Error creating wallet: ' + error.message);
    }
}

function showBackupWarning(seed) {
    // Create secure modal that disappears after viewing
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.9); z-index: 99999;
        display: flex; align-items: center; justify-content: center;
        color: white; font-family: monospace; text-align: center;
    `;
    
    modal.innerHTML = `
        <div style="background: #1a1a2e; padding: 30px; border-radius: 15px; max-width: 500px;">
            <h2 style="color: #00D4FF;">⚠️ BACKUP YOUR WALLET</h2>
            <p>This is a NEW wallet. Save this information NOW:</p>
            <div style="background: #0a0a0f; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Address:</strong><br>${userWalletAddress}</p>
                <p><strong>Seed Phrase (12 words):</strong><br>${seed}</p>
            </div>
            <p style="color: #FF4D7D; font-size: 14px;">
                ⚠️ If you lose this, you lose access to your BCH rewards!
            </p>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: #7B3FE4; color: white; border: none; 
                           padding: 10px 30px; border-radius: 8px; cursor: pointer; margin-top: 15px;">
                I've saved it securely
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Auto-remove after 60 seconds
    setTimeout(() => {
        if (modal.parentElement) {
            modal.remove();
        }
    }, 60000);
}

function updateWalletUI() {
    const btn = document.getElementById('wallet-connect-btn');
    const icon = btn.querySelector('i');
    
    if (walletConnected && userWalletAddress) {

        icon.className = 'fas fa-check-circle';
        btn.innerHTML = "Disconnect"//`<i class="fas fa-check-circle"></i> ${userWalletAddress.slice(0,6)}...${userWalletAddress.slice(-4)}`;
        btn.style.background = 'linear-gradient(135deg, #00FF9D, #00D4FF)';
        btn.style.color = '#0A0A0F';
        btn.style.fontWeight = 'bold';        
        // Remove click handler (already connected)
        //btn.onclick = null;
        //btn.href = '#';
    }
}

function disconnectWallet() {
    walletConnected = false;
    userWalletAddress = "bitcoincash:qzld92ae0x8gjgvwa949lftn6q3u7slytvkcz8qcnw";
    bchProvider = null;
    localStorage.removeItem('aura_wallet');
    location.reload(); // Simple refresh to reset
}
  
function initializeApp() {
const cards = document.querySelectorAll('.signal-card');
cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});
console.log("App initialized with mainnet-js");
}

export async function vote(signalId, direction, signalDirection) {

    if (!walletConnected) {
        alert('Create or connect your BCH wallet to receive vote rewards!');
        //return;
    }

    if (!canVote(userWalletAddress)) {
        alert('Please wait 5 seconds between votes');
        return;
    }
      
    //const voteBtn = event.target;
    //voteBtn.disabled = true;
    console.log('params vote : ', signalId, direction, signalDirection);

    await logVote(
        userWalletAddress,
        signalId,
        direction,
        signalDirection
    );
      
    updateVoteCount(signalId, direction, signalDirection);
    
    alert(`✅ Voted ${direction.toUpperCase()}!`);
    //voteBtn.disabled = false;
    //addToTransactionHistory(result.data);
}

async function logVote(address, signalId, direction, signalDirection) {
    try {
        const logRewardFn = httpsCallable(functions, 'logReward');
        const result = await logRewardFn({
            signalId: signalId,
            follows: direction == signalDirection,
            address: address
        });
        console.log("Success:", result.data);
    } catch (error) {
        console.log('Analytics logging failed:', error);
    }
}

function canVote(userAddress) {
    const now = Date.now();
    const lastVote = voteRateLimit[userAddress]?.timestamp || 0;
    
    // 5 seconds between votes
    if (now - lastVote < 5000) {
        return false;
    }
    
    // Update timestamp
    voteRateLimit[userAddress] = {
        timestamp: now,
        count: (voteRateLimit[userAddress]?.count || 0) + 1
    };
    
    return true;
}

function updateVoteCount(signalId, direction, signalDirection) {
    // Update total votes
    const totalEl = document.getElementById('total-votes');
    if (totalEl) {
        totalEl.textContent = parseInt(totalEl.textContent) + 1;
    }
    
    const voteEl = document.getElementById(`${direction}votes-${signalId}`);
    if (voteEl) {
        voteEl.textContent = parseInt(voteEl.textContent) + 1;
    }
    
    updateVotePercentages(signalId, direction, signalDirection);
}

// Optional: Calculate and display percentages
function updateVotePercentages(signalId, direction, signalDirection) {
    // signalDirection = 'up' or 'down' (from the signal itself)
    // direction = 'up' or 'down' (user's vote)
    const upvotes = parseInt(document.getElementById(`upvotes-${signalId}`).textContent);
    const downvotes = parseInt(document.getElementById(`downvotes-${signalId}`).textContent);
    const total = upvotes + downvotes;
    
    if (total > 0) {
        let supportPercent;
        
        if (signalDirection == 'up') {
            // For bullish signals: upvotes = support, downvotes = against
            supportPercent = Math.round((upvotes / total) * 100);
            console.log(' signal dir up! ');
        } else {
            console.log(' signal dir down! ');
            // For bearish signals: downvotes = support, upvotes = against
            supportPercent = Math.round((downvotes / total) * 100);
        }
        
        // Update percentage text
        const percentEl = document.querySelector(`.confidence-value-${signalId}`);
        if (percentEl) {
            percentEl.textContent = `${supportPercent}%`;
        }
        
        // Update progress bar
        const confidenceFill = document.querySelector(`#signal-${signalId} .confidence-fill`);
        if (confidenceFill) {
            confidenceFill.style.width = `${supportPercent}%`;
        }
    }
}

//AURATOKENS
export async function sendReward(reward, rewardSystem) {
    if (!rewardSystem) return ;
    console.log('send reward 00 : ', reward);
    // 3. Client sends BCH reward (using mainnet-js)
      const rewardResult = await rewardSystem.sendReward(
          userWalletAddress,
          reward
      );

    alert(`✅ Reward sent !\n\n` + 
    `${reward} BCH was sent to your wallet.\n` +
    `Transaction: ${rewardResult.txId}\n` +
    `View on explorer: ${rewardResult.explorerUrl}`);
}

const createTrophyToken = (userData, tokenData) => {
    // Generate unique commitment hash
    const commitment = sha256(
      `${tokenData.id}-${userData.address}-${Date.now()}`
    ).substring(0, 40);
  
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
    address: userWalletAddress,
    stats: {
      totalBullishVotes: 0,
      correctBullishVotes: 0,
      totalBearishVotes: 0,
      correctBearishVotes: 0,
      consecutiveDays: 0,
      overallAccuracy: 0.0,
      totalVotes: 0,
      rank: 21,
      unlockScore: 185
    },
    walletBalance: '0.25',
    lastVoteTxId: 'abc123...',
    votesMerkleRoot: 'def456...'
  };
  
  //const lidiaToken = createTrophyToken(userData, bullTokens[0]);
  //console.log('Lidia Trophy Token:', lidiaToken);
