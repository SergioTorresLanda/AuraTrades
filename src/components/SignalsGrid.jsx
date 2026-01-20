import SignalCard from './SignalCard'

function SignalsGrid() {
  return (
    <div className="signals-grid">
      <SignalCard 
        id={1}
        pair="BTC/USDT"
        fullName="Bitcoin / Tether"
        direction="bullish"
        confidence={33}
        upvotes={33}
        downvotes={66}
        botName = "FibOracle"
        winRate = "60%"
      />
      <SignalCard 
        id={2}
        pair="ETH/USDT"
        fullName="Ethereum / Tether"
        direction="bearish"
        action = "SHORT"
        entryPrice = "$3,200"
        targetPrice = "$3,000"
        stopLoss = "$3,500"
        confidence={50}
        upvotes={8}
        downvotes={12}
        botName = "AlphaRSI"
        winRate = "65%"
      />
      <SignalCard 
        id={3}
        pair="BCH/USDT"
        fullName="BitcoinCash / Tether"
        direction="bullish"
        action = "LONG"
        entryPrice = "$580"
        targetPrice = "$700"
        stopLoss = "$450"
        confidence={99}
        upvotes={99}
        downvotes={1}
        botName = "TrendChaser"
        winRate = "70%"
      />
      {/* Add more signals */}
    </div>
  )
}

export default SignalsGrid