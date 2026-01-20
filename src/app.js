import { functions, httpsCallable } from './firebase.js';

const REWARD_LIMITS = {
    perHour: 0.001, // Max 0.001 BCH/hour per user
    perDay: 0.01,   // Max 0.01 BCH/day per user
    totalPool: 0.3  // Your total budget
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

export async function vote(signalId, direction, signalDirection, rewardSystem) {

    if (!rewardSystem) return ;

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
    
      // 3. Client sends BCH reward (using mainnet-js)
      const rewardResult = await rewardSystem.sendReward(
          userWalletAddress,
          0.0001
      );
      console.log('params 0 : ', signalId, direction, signalDirection);

      //if (rewardResult.success) {
    await logVoteReward(
        //userWalletAddress,
        //0.0001,
        signalId,
        direction,
        signalDirection
    );
    //}
      
      updateVoteCount(signalId, direction, signalDirection);
    
    alert(`✅ Voted ${direction.toUpperCase()}!\n\n` +
    `0.0001 BCH reward sent to your wallet.\n` +
    `Transaction: ${rewardResult.txId}\n` +
    `View on explorer: ${rewardResult.explorerUrl}`);
    //voteBtn.disabled = false;
    //addToTransactionHistory(result.data);
}

async function logVoteReward(signalId, direction, signalDirection) {
    try {
        const logRewardFn = httpsCallable(functions, 'logReward');
        const result = await logRewardFn({
            signalId: signalId,
            follows: direction == signalDirection
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
