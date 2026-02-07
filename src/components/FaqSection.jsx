import React from 'react'
import FaqItem from './FaqItem'

function FaqSection() {
  const faqData = [
    {
      question: "How do I earn BCH rewards?",
      answer: "Simply vote on signals! Achieve the AuraTokens conditions to unlock them as NFT, rewards are sent automatically to your connected wallet when minted!"
    },
    {
      question: "Do I need trading experience?",
      answer: "No! The community voting system helps surface the best signals. You can learn by observing which signals perform well and following top-rated traders."
    },
    {
      question: "Is this financial advice?",
      answer: "No. AuraTrades provides educational signals for informational purposes only. Always do your own research and never trade more than you can afford to lose."
    },
  ]

  return (
    <section id="faq" className="faq-section">
      <h2 className="section-title">
              <i className="fas fa-comments"></i> Frequently Asked Questions
          </h2>
      <div className="faq-container">
        {faqData.map((item, index) => (
          <FaqItem 
            key={index}
            question={item.question}
            answer={item.answer}
          />
        ))}
      </div>
    </section>
  )
}

export default FaqSection