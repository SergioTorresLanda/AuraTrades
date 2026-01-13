class RewardSystem {
    constructor() {
        this.wallet = null;
        this.address = null;
        this.balance = 0;
    }
    
    async initialize() {
        try {
            console.log('Initializing reward wallet...');
            
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
            const txId = await this.wallet.send([
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
            console.log('Transaction:', txId);
            console.log('Explorer:', `https://blockchair.com/bitcoin-cash/transaction/${txId}`);
            
            return {
                success: true,
                txId: txId,
                amount: amount,
                explorerUrl: `https://blockchair.com/bitcoin-cash/transaction/${txId}`
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

let walletConnected = false;
let bchAddress = null;
let bchProvider = null;

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
async function vote(signalId, direction) {

    if (!userWalletConnected) {
        alert('Connect your BCH wallet first to vote & receive rewards!');
        return;
    }

    // Simple IP-based rate limiting
    const ip = context.rawRequest.ip;
    const now = Date.now();
    
    if (rateLimit[ip] && (now - rateLimit[ip].lastRequest) < 5000) {
        throw new functions.https.HttpsError(
            'resource-exhausted',
            'Please wait 5 seconds between votes'
        );
    }
    
    rateLimit[ip] = {
        lastRequest: now,
        count: (rateLimit[ip]?.count || 0) + 1
    };
    
    // Show loading
    const voteBtn = event.target;
    const originalText = voteBtn.innerHTML;
    voteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    voteBtn.disabled = true;
    
    try {

        const sendReward = firebase.functions().httpsCallable('sendReward');
        const result = await sendReward({
            toAddress: userWalletAddress, // From connected wallet
            amount: 0.0001, // 0.0001 BCH per vote
            note: `Vote reward for signal #${signalId}`
        });
        
        updateVoteCount(signalId, direction);
        
        alert(`✅ Voted ${direction.toUpperCase()}!\n\n` +
              `0.0001 BCH reward sent to your wallet.\n` +
              `Transaction: ${result.data.txId.slice(0, 16)}...\n\n` +
              `View on explorer: ${result.data.explorerUrl}`);
        

        addToTransactionHistory(result.data);
        
    } catch (error) {
        console.error('Vote failed:', error);
        
        if (error.message.includes('insufficient funds')) {
            alert('⚠️ Reward pool low! Voting still counted, but reward pending.');
        } else {
            alert(`✅ Voted! (Reward pending: ${error.message})`);
        }
        
        updateVoteCount(signalId, direction);

    } finally {
        voteBtn.innerHTML = originalText;
        voteBtn.disabled = false;
    }
}

// Add click handler
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

// Smooth scrolling for navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Smooth scroll
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Update active nav on scroll
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

// FAQ toggle functionality
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', function() {
        const item = this.parentElement;
        item.classList.toggle('active');
    });
});
