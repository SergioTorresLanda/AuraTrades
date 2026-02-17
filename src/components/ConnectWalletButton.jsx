import React, { useState, useEffect} from 'react'
import { useWallet } from '../hooks/useWallet'

function ConnectWalletButton() {
  const { 
    walletConnected,
    walletAddress, 
    isLoading, 
    error,
    createWallet,
    connectWallet, 
    disconnectWallet
  } = useWallet()

  const [showConnectModal, setShowConnectModal] = useState(false)
  const [inputAddress, setInputAddress] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [showError, setShowError] = useState(false)

  const handleCreateWallet = async () => {
    try {
      setShowConnectModal(false);
      await createWallet();
    } catch (error) {
      console.error("Wallet creation failed:", error);
      alert(`Failed to create wallet: ${error.message}`);
    }
  };

  const handleConnectClick = (e) => {
    e.preventDefault()

    if (!walletConnected) {
      try {
        setShowConnectModal(true)
      } catch (err) {
        console.error('Connection failed:', err)
      }
    } else {
      if (window.confirm(`Disconnect wallet ${walletAddress} ?`)) {
        disconnectWallet()
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!inputAddress.trim()) {
      alert('Please enter a BCH address')
      return
    }

    setIsConnecting(true)
    
    try {
      await connectWallet(inputAddress.trim())
      setShowConnectModal(false)
      setInputAddress('')
    } catch (err) {
      // Error is already handled in hook
      setShowError(true)
      console.error('Connection failed:', err)
    } finally {
      setIsConnecting(false)
    }
  }

  const displayAddress = walletAddress 
    ? `${walletAddress.substring(0, 8)}...${walletAddress.slice(-6)}`
    : ''

  return (
    <>
      <a 
        href="#" 
        className="nav-link" 
        onClick={handleConnectClick}
        disabled={isLoading}
        title={walletAddress ? `Connected: ${walletAddress}` : ''}
      >
        <i className="fas fa-wallet"></i>
        {isLoading ? '...' : (
          walletConnected ? ` ${displayAddress}` : 'Connect Wallet'
        )}
      </a>

      {/* Connect Wallet Modal */}
      {showConnectModal && (
        <div className="modal-overlay" onClick={() => setShowConnectModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={() => setShowConnectModal(false)}
            >
              <i className="fas fa-times"></i>
            </button>

            <div className="modal-header">
              <h3><i className="fas fa-wallet"></i> Connect Your BCH Wallet</h3>
              <p>Enter your Bitcoin Cash address to receive rewards</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="bch-address">
                  <i className="fas fa-address-card"></i> BCH Address
                </label>
                <input
                  type="text"
                  id="bch-address"
                  placeholder="bitcoincash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a"
                  value={inputAddress}
                  onChange={(e) => setInputAddress(e.target.value)}
                  disabled={isConnecting}
                  className="address-input"
                />
                  {showError && (
                    <div className="wallet-error">
                      <i className="fas fa-exclamation-triangle"></i> {error}
                    </div>
                  )}
                <small className="help-text">
                  Enter your public BCH address (starts with "bitcoincash:" or "q")
                </small>

              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowConnectModal(false)}
                  disabled={isConnecting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isConnecting || !inputAddress.trim()}
                >
                  {isConnecting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Connecting...
                    </>
                  ) : (
                    'Connect Wallet'
                  )}
                </button>
              </div>
              <small className="help-text2">
                  Or
                </small>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleCreateWallet}
                  disabled={isConnecting}
                >
                  Create new wallet
                </button>
                
              </div>
            </form>

            <div className="modal-footer">
              <p className="disclaimer">
                <i className="fas fa-shield-alt"></i> Your private keys remain secure.
                We only need your public address to send rewards.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ConnectWalletButton