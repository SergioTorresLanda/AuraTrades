import React, { useState } from 'react'

function FaqItem({ question, answer }) {
  const [isActive, setIsActive] = useState(false)

  const toggleActive = () => {
    setIsActive(!isActive)
  }

  return (
    <div className={`faq-item ${isActive ? 'active' : ''}`}>
      <div className="faq-question" onClick={toggleActive}>
        <span>{question}</span>
        <i className={`fas fa-chevron-${isActive ? 'up' : 'down'}`}></i>
      </div>
      <div className="faq-answer">
        <p>{answer}</p>
      </div>
    </div>
  )
}

export default FaqItem