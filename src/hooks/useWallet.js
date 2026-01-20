import { useState, useEffect, useCallback } from 'react'

export function useWallet() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load wallet from localStorage on mount
  useEffect(() => {
    const savedAddress = localStorage.getItem('aura_wallet_address')
    if (savedAddress) {
      setWalletAddress(savedAddress)
      setWalletConnected(true)
    }
  }, [])

  const connectWallet = useCallback(async () => {
    if (!window.Wallet || !window.Mainnet) {
      throw new Error('Wallet library not loaded. Please refresh the page.')
    }

    setIsLoading(true)
    setError(null)

    try {
      // CREATE A NEW WALLET 
      const wallet = await window.Wallet.newRandom()
      const address = await wallet.cashaddr
      
      console.log('Wallet address:', address)
      
      // Save to localStorage
      localStorage.setItem('aura_wallet_address', address)
      localStorage.setItem('aura_wallet', address)
      
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

  const disconnectWallet = useCallback(() => {
    // Clear localStorage
    localStorage.removeItem('aura_wallet_address')
    localStorage.removeItem('aura_wallet')
    
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
                ⚠️ If you lose this, you lose access to your BCH rewards!
            </p>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: linear-gradient(135deg, #00FF9D, #00D4FF); color: white; border: none; 
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

  // Optional: Function to update UI (if you need global UI updates)
  const updateWalletUI = useCallback(() => {
    // Your existing UI update logic here
    // Example: Update any global UI elements
    const walletBtn = document.getElementById('wallet-connect-btn')
    if (walletBtn) {
      walletBtn.innerHTML = walletConnected 
        ? `<i class="fas fa-wallet"></i> Disconnect ${walletAddress.substring(0, 6)}...`
        : '<i class="fas fa-wallet"></i> Connect Wallet'
    }
  }, [walletConnected, walletAddress])

  return {
    walletConnected,
    walletAddress,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    updateWalletUI
  }
}