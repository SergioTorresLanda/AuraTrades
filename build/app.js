class RewardSystem {
    constructor() {
        this.wallet = null;
        this.address = null;
        this.balance = 0;
    }
    
    async initialize() {
        try {
            console.log('Initializing reward wallet...');
            if (!window.APP_CONFIG?.REWARD_SEED) {
                console.error('Config not loaded');
                return null;
            }
            
            const seed = window.APP_CONFIG.REWARD_SEED;
            
            console.log('✅ Reward wallet loaded: PRIVATE MF');
            // Create wallet from seed
            this.wallet = await Wallet.fromSeed(
                window.APP_CONFIG.REWARD_SEED,
                window.APP_CONFIG.REWARD_PATH
            );
            
            // Get address
            this.address = this.wallet.cashaddr            
            // Get balance
            this.balance = await this.wallet.getBalance('bch');
            
            console.log('✅ Reward wallet ready!');
            console.log('Address:', this.address);
            console.log('Balance:', this.balance, 'BCH');
            // Update UI
            this.updateUI();
            
            return this.address;
            
        } catch (error) {
            console.error('Failed to init reward wallet:', error);
            throw error;
        }
    }
    
    updateUI() {
        // Update your dashboard
        if (document.getElementById('pool-balance')) {
            document.getElementById('pool-balance').textContent = this.balance.toFixed(4);
        }
        if (document.getElementById('reward-address')) {
            document.getElementById('reward-address').textContent = 
                this.address ? `${this.address.slice(0, 10)}...${this.address.slice(-8)}` : 'Not set';
        }
    }
    
    async sendReward(toAddress, amount = 0.0001, note = "Voting reward") {
        if (!this.wallet) {
            throw new Error('Reward wallet not initialized');
        }
        
        if (this.balance < amount) {
            throw new Error(`Insufficient balance: ${this.balance} BCH available, need ${amount}`);
        }
        
        console.log(`Sending ${amount} BCH to ${toAddress}...`);
        
        try {
            const res = await this.wallet.send([
                {
                    cashaddr: toAddress,
                    value: amount,
                    unit: 'bch'
                }
            ]);
            
            // Update balance
            this.balance -= amount;
            this.updateUI();
            
            console.log('✅ Reward sent!');
            console.log('Transaction:', res.txId);
            console.log('Explorer:', `https://blockchair.com/bitcoin-cash/transaction/${res.txId}`);
            
            return {
                success: true,
                txId: res.txId,
                amount: amount,
                explorerUrl: `https://blockchair.com/bitcoin-cash/transaction/${res.txId}`
            };
            
        } catch (error) {
            console.error('❌ Send failed:', error);
            // Fallback: Record promise instead of failing
            queuePendingReward(toAddress, amount);
            return {
                success: false,
                error: error.message
            };
        }
    }
}


window.rewardSystem = new RewardSystem();

const REWARD_LIMITS = {
    perHour: 0.001, // Max 0.001 BCH/hour per user
    perDay: 0.01,   // Max 0.01 BCH/day per user
    totalPool: 0.3  // Your total budget
};

let userWalletAddress = "bitcoincash:qzld92ae0x8gjgvwa949lftn6q3u7slytvkcz8qcnw"
let walletConnected = false;
let bchAddress = null;
let bchProvider = null;
const voteRateLimit = {};

async function connectWallet() {
    try {

        if (!window.Wallet || !window.Mainnet) {
            alert('Please wait for wallet library to load...');
            return;
        }
        // CREATE A NEW WALLET 
        // For demo - users get their own
        //const wallet = await Mainnet.TestNetWallet.newRandom();
        //const address = wallet.address;
        
        // For mainnet (real BCH) use:
        const wallet = await Mainnet.Wallet.newRandom();
        
        console.log('Wallet created:', wallet);
        console.log('Address:', address);
        console.log('Private key (WIF):', wallet.privateKeyWif);
        
        // Update UI
        walletConnected = true;
        bchAddress = address;
        updateWalletUI();
        localStorage.setItem('aura_wallet', address);
        localStorage.setItem('aura_wallet_wif', wallet.privateKeyWif); // Store securely!
        
        // Show success
        alert(`✅ Wallet connected!\nAddress: ${address}\n\nIMPORTANT: Save your private key!`);
        
        //We can now use this wallet for transactions
        return wallet;
        
    } catch (error) {
        console.error('Wallet connection failed:', error);
        alert('❌ Error creating wallet: ' + error.message);
    }
}

function updateWalletUI() {
    const btn = document.getElementById('wallet-connect-btn');
    const icon = btn.querySelector('i');
    
    if (walletConnected && bchAddress) {

        icon.className = 'fas fa-check-circle';
        btn.innerHTML = `<i class="fas fa-check-circle"></i> ${bchAddress.slice(0,6)}...${bchAddress.slice(-4)}`;
        btn.style.background = 'linear-gradient(135deg, #00FF9D, #00D4FF)';
        btn.style.color = '#0A0A0F';
        btn.style.fontWeight = 'bold';        
        // Remove click handler (already connected)
        btn.onclick = null;
        btn.href = '#';
    }
}

function disconnectWallet() {
    walletConnected = false;
    bchAddress = null;
    bchProvider = null;
    localStorage.removeItem('aura_wallet');
    location.reload(); // Simple refresh to reset
}

// Check for existing connection on page load
document.addEventListener("DOMContentLoaded", async () => {
    try {
      globalThis.exports = globalThis.exports || {};
      Object.assign(globalThis, await __mainnetPromise);
      console.log("Mainnet-js loaded successfully!");
      
       // Initialize reward system
    const rewardAddress = await rewardSystem.initialize();
    
    console.log('Reward system ready. Address:', rewardAddress);
      initializeApp();
    } catch (error) {
      console.error("Failed to load mainnet-js:", error);
      initializeApp();
    }
  });
  
  function initializeApp() {
    // Add hover effects to signal cards
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

// Update your voting function to require wallet
async function vote(signalId, direction, signalDirection, event) {

    if (!walletConnected) {
        alert('Connect your BCH wallet first to vote & receive rewards!');
        //return;
    }

    if (!canVote(userWalletAddress)) {
        alert('Please wait 5 seconds between votes');
        return;
    }
      
    const voteBtn = event.target;
    const originalText = voteBtn.innerHTML;
    voteBtn.disabled = true;

      const logVote = firebase.functions().httpsCallable('logVote');
      //await logVote({ signalId, direction, voterAddress: userWalletAddress });
    
      // 3. Client sends BCH reward (using mainnet-js)
      const rewardResult = await window.rewardSystem.sendReward(
          userWalletAddress,
          0.0001
      );
      
      updateVoteCount(signalId, direction, signalDirection);
    

    alert(`✅ Voted ${direction.toUpperCase()}!\n\n` +
    `0.0001 BCH reward sent to your wallet.\n` +
    `Transaction: ${rewardResult.txId.slice(0, 16)}...\n\n` +
    `View on explorer: ${rewardResult.explorerUrl}`);
    voteBtn.disabled = false;
    //addToTransactionHistory(result.data);
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
        console.log('  TOTAL VOTESS! ');
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

document.getElementById('wallet-connect-btn').addEventListener('click', function(e) {
    e.preventDefault();
    if (!walletConnected) {
        connectWallet();
    } else {
        if (confirm('Disconnect wallet?')) {
            disconnectWallet();
        }
    }
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section, #signals');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', function() {
        const item = this.parentElement;
        item.classList.toggle('active');
    });
});
