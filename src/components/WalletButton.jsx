import React from 'react'
import { useWallet } from '../hooks/useWallet'

function WalletButton() {
  const { 
    walletConnected, 
    walletAddress, 
    isLoading, 
    error,
    connectWallet, 
    disconnectWallet 
  } = useWallet()

  const handleClick = async (e) => {
    e.preventDefault()
    
    if (!walletConnected) {
      try {
        await connectWallet()
      } catch (err) {
        // Error is already set in hook, but you could show a toast
        console.error('Connection failed:', err)
      }
    } else {
      if (window.confirm(`Disconnect wallet ${walletAddress}?`)) {
        disconnectWallet()
      }
    }
  }

  // Format address for display
  const displayAddress = walletAddress 
    ? `${walletAddress.substring(0, 6)}...${walletAddress.slice(-4)}`
    : ''

  return (
    <>
      <a 
        href="#" 
        className="nav-link" 
        onClick={handleClick}
        disabled={isLoading}
        title={walletAddress ? `Connected: ${walletAddress}` : ''}
      >
        <i className="fas fa-wallet"></i>
        {isLoading ? ' Connecting...' : (
          walletConnected ? ` ${displayAddress}` : ' Connect Wallet'
        )}
      </a>
      
      {error && (
        <div className="wallet-error" style={{
          color: 'red',
          fontSize: '12px',
          marginTop: '4px'
        }}>
          {error}
        </div>
      )}
    </>
  )
}

export default WalletButton