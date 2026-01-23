import React, { useState, useEffect } from 'react'  // Add useState
import { useWallet } from '../hooks/useWallet'

function WalletButton() {
  const { 
    walletConnected, 
    walletAddress, 
    isLoading, 
    error,
    createWallet, 
    disconnectWallet 
  } = useWallet()
  
  const handleClick = async (e) => {
    e.preventDefault()
    
    if (!walletConnected) {
      try {
        await createWallet()
      } catch (err) {
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
    ? `${walletAddress.substring(0, 8)}...${walletAddress.slice(-6)}`
    : ''

  return (
    <>
      <a 
        href="#" 
        className="nav-link" 
        onClick={handleClick}
        disabled={isLoading}
        title={walletAddress ? `${walletAddress}` : ''}
      >
        <i className="fas fa-wallet"></i>
        {isLoading ? '...' : (
          walletConnected ? ` ${displayAddress}` : 'Create Wallet'
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