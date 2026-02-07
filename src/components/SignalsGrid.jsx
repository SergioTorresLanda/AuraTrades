import SignalCard from './SignalCard'

function SignalsGrid() {

  const signals = [
    {
      id: 1,
      pair: "BTC/USDT",
      fullName: "Bitcoin / Tether",
      direction: "bearish",
      action: "SHORT",
      entryPrice: "$70,500",
      targetPrice: "$65,000",
      stopLoss: "$85,500",
      confidence: 73,
      upvotes: 15,
      downvotes: 3,
      botName: "FibOracle",
      winRate: "65%"
    },
    {
      id: 2,
      pair: "ETH/USDT",
      fullName: "Ethereum / Tether",
      direction: "bearish",
      action: "SHORT",
      entryPrice: "$2,000",
      targetPrice: "$1,700",
      stopLoss: "$2,400",
      confidence: 42,
      upvotes: 8,
      downvotes: 12,
      botName: "AlphaRSI",
      winRate: "58%"
    },
    // Add more signals here as needed
    {
      id: 3,
      pair: "SOL/USDT",
      fullName: "Solana / Tether",
      direction: "bullish",
      action: "LONG",
      entryPrice: "$70",
      targetPrice: "$95",
      stopLoss: "$50",
      confidence: 85,
      upvotes: 22,
      downvotes: 5,
      botName: "TrendChaser",
      winRate: "72%"
    },
    {
      id: 4,
      pair: "XRP/USDT",
      fullName: "Ripple / Tether",
      direction: "bearish",
      action: "SHORT",
      entryPrice: "$1.80",
      targetPrice: "$1.25",
      stopLoss: "$2.45",
      confidence: 61,
      upvotes: 10,
      downvotes: 7,
      botName: "ChainSpy",
      winRate: "63%"
    },
    {
      id: 5,
      pair: "BNB/USDT",
      fullName: "Binance / Tether",
      direction: "bearish",
      action: "SHORT",
      entryPrice: "$886",
      targetPrice: "$840",
      stopLoss: "$920",
      confidence: 50,
      upvotes: 10,
      downvotes: 10,
      botName: "FibOracle",
      winRate: "65%"
    },
    {
      id: 6,
      pair: "BCH/USDT",
      fullName: "Bitcoin Cash / Tether",
      direction: "bullish",
      action: "LONG",
      entryPrice: "$460",
      targetPrice: "$520",
      stopLoss: "$400",
      confidence: 95,
      upvotes: 10,
      downvotes: 10,
      botName: "AlphaRSI",
      winRate: "58%"
    }
    // Add unlimited more signals...
  ]

  return (
    <section className="signals-section">
      <div className="section-headersig">
        <h2>Live Trading Signals</h2>
        <div className="carousel-indicator">
          <span className="signal-count">{signals.length} Active Signals</span>
          <div className="scroll-hint">
            <i className="fas fa-arrow-right"></i>
            <span>Scroll for more</span>
          </div>
        </div>
      </div>
      
      <div className="signals-grid-container">
        <div className="signals-grid">
          {signals.map((signal) => (
            <SignalCard
              key={signal.id}
              id={signal.id}
              pair={signal.pair}
              fullName={signal.fullName}
              direction={signal.direction}
              action={signal.action}
              entryPrice={signal.entryPrice}
              targetPrice={signal.targetPrice}
              stopLoss={signal.stopLoss}
              confidence={signal.confidence}
              upvotes={signal.upvotes}
              downvotes={signal.downvotes}
              botName={signal.botName}
              winRate={signal.winRate}
            />
          ))}
        </div>
      </div>
      
      {/* Optional navigation buttons 
      <div className="carousel-controls">
        <button 
          className="carousel-btn prev"
          onClick={() => {
            const container = document.querySelector('.signals-grid-container');
            container.scrollBy({ left: -400, behavior: 'smooth' });
          }}
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        <button 
          className="carousel-btn next"
          onClick={() => {
            const container = document.querySelector('.signals-grid-container');
            container.scrollBy({ left: 400, behavior: 'smooth' });
          }}
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
      */}
    </section>
  )
}

export default SignalsGrid
