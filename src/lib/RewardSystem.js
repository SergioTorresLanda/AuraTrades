
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
          d: direction === 'LONG' ? 'L' : 'S',
          e: entry,
          tp: target,
          sl: stopLoss,
          timestamp: Math.floor(Date.now() / 1000)
        };
        const jsonString = JSON.stringify(commitment);
        console.log(jsonString);

        const base64Data = btoa(jsonString);

        try {
           /* const tx = await this.wallet.send({
                to: [
                    [this.wallet.cashaddr, 550, "sats"],
                    { "OP_RETURNB64": base64Data }
                ]
            });*/
            const tx = await this.wallet.send([
            {
                cashaddr: this.wallet.cashaddr,
                value: 0.00001, //Dust
                unit: 'bch',
                OP_RETURNB64: base64Data
            },
            {
                dataString: JSON.stringify(commitment)
            }
            ]);
            console.log(`https://blockchair.com/bitcoin-cash/transaction/${tx.txId}`);
            return {
                success: true,
                txId: tx.txId,
                explorer: `https://blockchair.com/bitcoin-cash/transaction/${tx.txId}`
            };
        } catch (error) {
            console.error('❌ Commit failed:', error);
            return {
                success: false,
                error: error.message
            };
        }       
      }
}