import React, { useState, useEffect } from 'react'

function SmoothScrollLink({ href, children, className = '' }) {
  const [isActive, setIsActive] = useState(false)
  
  useEffect(() => {
    const checkActive = () => {
      const targetElement = document.querySelector(href)
      if (!targetElement) return
      
      const scrollPos = window.scrollY + 100
      const targetTop = targetElement.offsetTop
      const targetBottom = targetTop + targetElement.offsetHeight
      
      setIsActive(scrollPos >= targetTop && scrollPos <= targetBottom)
    }
    
    checkActive()
    window.addEventListener('scroll', checkActive)
    
    return () => window.removeEventListener('scroll', checkActive)
  }, [href])
  
  const handleClick = (e) => {
    e.preventDefault()
    
    const targetElement = document.querySelector(href)
    if (!targetElement) return
    
    window.scrollTo({
      top: targetElement.offsetTop - 80,
      behavior: 'smooth'
    })
  }
  
  return (
    <a 
      href={href}
      className={`nav-link ${className} ${isActive ? 'active' : ''}`}
      onClick={handleClick}
    >
      {children}
    </a>
  )
}

export default SmoothScrollLink;