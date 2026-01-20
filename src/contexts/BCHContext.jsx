import React, { createContext, useContext, useState, useEffect } from 'react'
import { RewardSystem } from '../lib/RewardSystem.js'

const BCHContext = createContext()

export function RewardProvider({ children }) {
  const [rewardSystem, setRewardSystem] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function initialize() {
      try {
        globalThis.exports = globalThis.exports || {}
        Object.assign(globalThis, await __mainnetPromise)
        const system = new RewardSystem()
        const rewardAddress = await system.initialize()
        setRewardSystem(system) 
        console.log('Reward system initialized:', rewardAddress)
      } catch (error) {
        console.error('Failed to initialize reward system:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    initialize()
  }, [])

  return (
    <BCHContext.Provider value={{ rewardSystem, isLoading }}>
      {children}
    </BCHContext.Provider>
  )
}

export function useReward() {
  const context = useContext(BCHContext)
  if (!context) {
    throw new Error('useReward must be used within RewardProvider')
  }
  return context
}