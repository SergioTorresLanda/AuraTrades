
export class RewardSystem {
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
       
            this.wallet = await Wallet.fromSeed(
                window.APP_CONFIG.REWARD_SEED,
                window.APP_CONFIG.REWARD_PATH
            );
            
            this.address = this.wallet.cashaddr            
            this.balance = await this.wallet.getBalance('bch');
            
            console.log('✅ Reward wallet ready!');
            console.log('Address:', this.address);
            console.log('Balance:', this.balance, 'BCH');

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
                this.address ? `${this.address}` : '---';
        }
    }
    
    async sendReward(toAddress, amount = 0.0001) {
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

    async commitSignal(signalData) {
        if (!this.wallet) {
            throw new Error('Business wallet not initialized');
        }
        if (this.balance < 0.0001) {
            throw new Error(`Insufficient balance: ${this.balance} BCH available, need ${0.0001}`);
        }
        const { id, direction, entry, target, stopLoss } = signalData;
        
        const commitment = {
          t: "auratradesSignal2026",
          i: id,
          d: direction,
          e: entry,
          tp: target,
          sl: stopLoss,
          timestamp: Math.floor(Date.now() / 1000)
        };
        const jsonString = JSON.stringify(commitment);
        console.log(jsonString);

        const base64Data = btoa(jsonString);

        try {
        
            const tx = await this.wallet.send([
            {
                cashaddr: this.wallet.cashaddr,
                value: 0.00001, 
                unit: 'bch'
            },
            {
                dataString: JSON.stringify(commitment)
            }
            ]);
            console.log(`https://explorer.salemkode.com/tx/${tx.txId}`);
            return {
                success: true,
                txId: tx.txId,
                explorer: `https://explorer.salemkode.com/tx/${tx.txId}`
            };
        } catch (error) {
            console.error('❌ Commit failed:', error);
            return {
                success: false,
                error: error.message
            };
        }       
    }

    async createTokenCategory(wallet, trophyToken) {
    // Create unique category for this achievement type
        // Use mainnet-js to create token category first time
        try {
            const category = await wallet.tokenGenesis({
            amount: 1, // Mint exactly 1 NFT
            value: 1046, // Add dust value to create a proper UTXO
            unit: 'sat',
            nft: {  // Note: nested under nft in v3.0.0 [citation:1]
                capability: 'none', // 'none', 'mutable', or 'minting'
                commitment: trophyToken.commitment || "0x" + Buffer.from(trophyToken.id).toString('hex')
            }
            });
            // Store this category ID for future mints!
            // e.g., in Firestore: achievements/lidia/categoryId
            console.log('Full category response:', JSON.stringify(category, null, 2));
            console.log('Category keys:', Object.keys(category));

            return category.data.achievementId;
            
        } catch (error) {
            console.error('Category creation failed:', error);
            throw error;
        }

    }

    async mintAuraTokenToUser(categoryId, recipientAddress) {
    try {
        const tx = await this.wallet.send([
            {
            cashaddr: recipientAddress,
            value: 1046, // Add dust value to create a proper UTXO
            unit: 'sat',
            tokenId: categoryId,
            tokenAmount: 1
            }
        ]);
        
        return {
            success: true,
            txId: tx.txId,
            explorer: `https://blockchair.com/bitcoin-cash/transaction/${tx.txId}`
        };
        
    } catch (error) {
        console.error('Minting failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

    async sendToken(toAddress, trophyToken) {
        if (!this.wallet) {
            throw new Error('Reward wallet not initialized');
        }
    
        console.log(`Sending BCHTOKEN to ${toAddress}...`);
    
        try {
            console.log('Starting Cashtoken minting...');
            // Determine network (mainnet vs testnet)
            //const network = userWallet.address.startsWith('bchtest:') ? TestNet : MainNet;
            // 1. Create token category (first token of this type creates category)
           // const categoryId = await this.createTokenCategory(this.wallet, trophyToken);
            // 2. Mint the specific token
            // 3. Send token to recipient
            const categoryId = "86b5831068c8325977707be51ab6ea40eded5c4821128b3c32ad8059250daf5a"
            const txId = await this.mintAuraTokenToUser(categoryId, toAddress);
            
            console.log('Cashtoken minted successfully!', { categoryId, txId });
            return { success: true, categoryId, txId };
            
        } catch (error) {
            console.error('Cashtoken minting failed:', error);
            return { success: false, error: error.message };
        }
    }


}