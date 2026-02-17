import { useState, useEffect, useCallback } from 'react'

export function useWallet() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [balance, setBalance] = useState(0)

  // Load wallet from localStorage on mount
  useEffect(() => {
    const savedAddress = localStorage.getItem('aura_wallet_address')
    if (savedAddress) {
      setWalletAddress(savedAddress)
      setWalletConnected(true)
      checkAddressHasBalance(savedAddress)
    }
  }, [])

  //CREATE NEW WALLET
  const createWallet = useCallback(async () => {
    if (!window.Wallet || !window.Mainnet) {
      throw new Error('Wallet library not loaded. Please refresh the page.')
    }

    setIsLoading(true)
    setError(null)

    try {
      const wallet = await window.Wallet.newRandom()
      const address = await wallet.cashaddr
      
      console.log('Wallet address:', address)
      
      // Save to localStorage
      localStorage.setItem('aura_wallet_address', address)
      
      // Update state
      setWalletAddress(address)
      setWalletConnected(true)
      
      // Show IMPORTANT backup warning
      showBackupWarning2(wallet.mnemonic)
      
      // Update any global state if needed
      window.walletConnected = true
      window.userWalletAddress = address
      
      return address
      
    } catch (error) {
      setWalletConnected(false)
      setError(error.message)
      console.error('Wallet creation failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

   // NEW: Connect with existing address
   const connectWallet = useCallback(async (address) => {
    setIsLoading(true)
    setError(null)

    try {
      // Validate BCH address format
      if (!isValidBCHAddress(address)) {
        throw new Error('Invalid BCH address format')
      }

      // Check if address has balance
      const hasBalance = await checkAddressHasBalance(address)
      if (!hasBalance) {
        // You might want to warn but not block
        console.warn('Address has zero balance')
      }

      // Save to localStorage
      localStorage.setItem('aura_wallet_address', address)
      
      // Update state
      setWalletAddress(address)
      setWalletConnected(true)
      
      window.walletConnected = true
      window.userWalletAddress = address
      
      return address
      
    } catch (error) {
      setWalletConnected(false)
      setError(error.message)
      console.error('Wallet connection failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Helper: Validate BCH address
  const isValidBCHAddress = (address) => {
    // Basic BCH address validation (bitcoincash: prefix or simple)
    return address && (
      address.startsWith('bitcoincash:') || 
      address.startsWith('bchtest:') ||
      address.startsWith('q') || // P2PKH
      address.startsWith('p') // P2SH
    )
  }

  // Helper: Check address balance
  const checkAddressHasBalance = async (address) => {
    try {
      // 1. Construct the walletId for watch-only wallet
      // Format: watch:testnet:bchtest:qq1234567
      const walletId = `watch:mainnet:${address}`;
      
      // 2. Make the POST request to the API
      const response = await fetch('https://rest-unstable.mainnet.cash/wallet/balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletId: walletId,
          unit: 'bch' 
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Address balance:', data);
      
      // 3. Set balance and return whether > 0
      setBalance(data.sat || data.bch || 0);
      return (data.sat > 0) || (data.bch > 0);
      
    } catch (error) {
      console.warn('Could not check balance:', error);
      return true;
    }
  };

  const disconnectWallet = useCallback(() => {
    // Clear localStorage
    localStorage.removeItem('aura_wallet_address')
    
    // Clear state
    setWalletAddress('')
    setWalletConnected(false)
    
    // Clear global state
    window.walletConnected = false
    window.userWalletAddress = null
    
    return true
  }, [])

  const showBackupWarning2 = useCallback((mnemonic) => {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.9); z-index: 99999;
        display: flex; align-items: center; justify-content: center;
        color: white; font-family: monospace; text-align: center;
    `;
    
    modal.innerHTML = `
        <div style="background: #1a1a2e; padding: 30px; border-radius: 15px; max-width: 500px;">
            <h2 style="color: linear-gradient(135deg, #00FF9D, #00D4FF);">⚠️ BACKUP YOUR WALLET</h2>
            <p>This is a NEW wallet. Save this information NOW:</p>
            <div style="background: #0a0a0f; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Address:</strong><br>${walletAddress}</p>
                <p><strong>Seed Phrase (12 words):</strong><br>${mnemonic}</p>
            </div>
            <p style="color: #FF4D7D; font-size: 14px;">
                ⚠️ If you lose this, you may lose your progress to get your BCH rewards!
            </p>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: linear-gradient(135deg,rgb(0, 98, 255)); color: white; border: none; 
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
}, [])

  // Function to show backup warning (moved from app.js)
  const showBackupWarning = useCallback((mnemonic) => {
    const warning = `
⚠️ IMPORTANT - BACKUP YOUR SEED PHRASE ⚠️

Your seed phrase: ${mnemonic}

WRITE THIS DOWN AND KEEP IT SAFE!
• This is your ONLY way to recover your wallet
• Never share it with anyone
• Store it offline in multiple secure locations

Click OK to confirm you have saved it.`
    
    alert(warning)
  }, [])


  return {
    walletConnected,
    walletAddress,
    isLoading,
    error,
    connectWallet,
    createWallet,
    disconnectWallet
  }
}