function toggleMobileMenu() {
  const navMenu = document.querySelector(".nav-menu")
  const navToggle = document.querySelector(".nav-toggle")

  navMenu.classList.toggle("active")
  navToggle.classList.toggle("active")
}

// Handle Get Started button clicks
function handleGetStarted() {
  // Add a smooth scroll effect or redirect to signup
  console.log("Get Started clicked")

  // Example: Smooth scroll to features section
  const featuresSection = document.querySelector(".features")
  if (featuresSection) {
    featuresSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  // You can replace this with actual navigation logic
  // window.location.href = '/signup';
}

// Handle feature card clicks
function handleFeatureClick(feature) {
  console.log(`${feature} feature clicked`)

  // Add visual feedback
  const clickedCard = event.currentTarget
  clickedCard.style.transform = "scale(0.95)"

  setTimeout(() => {
    clickedCard.style.transform = ""
  }, 150)

  // You can add navigation logic here
  // window.location.href = `/features/${feature}`;
}

// Add scroll animations
function addScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observe feature cards
  const featureCards = document.querySelectorAll(".feature-card")
  featureCards.forEach((card, index) => {
    card.style.opacity = "0"
    card.style.transform = "translateY(30px)"
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`
    observer.observe(card)
  })
}

// Add particle effect to background
function createParticles() {
  const particleContainer = document.createElement("div")
  particleContainer.style.position = "fixed"
  particleContainer.style.top = "0"
  particleContainer.style.left = "0"
  particleContainer.style.width = "100%"
  particleContainer.style.height = "100%"
  particleContainer.style.pointerEvents = "none"
  particleContainer.style.zIndex = "-1"
  document.body.appendChild(particleContainer)

  for (let i = 0; i < 50; i++) {
    const particle = document.createElement("div")
    particle.style.position = "absolute"
    particle.style.width = "2px"
    particle.style.height = "2px"
    particle.style.background = "rgba(79, 70, 229, 0.3)"
    particle.style.borderRadius = "50%"
    particle.style.left = Math.random() * 100 + "%"
    particle.style.top = Math.random() * 100 + "%"
    particle.style.animation = `float ${3 + Math.random() * 4}s ease-in-out infinite`
    particle.style.animationDelay = Math.random() * 2 + "s"
    particleContainer.appendChild(particle)
  }
}

// Add floating animation for particles
const style = document.createElement("style")
style.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
        50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
    }
`
document.head.appendChild(style)

// Training Page Functions
function startTraining() {
  console.log("[v0] Training started")
  const progressBar = document.getElementById("trainingProgress")
  const button = event.target

  // Disable button during training
  button.disabled = true
  button.innerHTML = '<span class="arrow">⏳</span> Training...'

  // Animate progress bar
  if (progressBar) {
    progressBar.style.width = "0%"
    setTimeout(() => {
      progressBar.style.width = "100%"
    }, 100)

    // Re-enable button after training completes
    setTimeout(() => {
      button.disabled = false
      button.innerHTML = '<span class="arrow">→</span> Train'
      updateMetrics()
    }, 3000)
  }
}

function updateMetrics() {
  // Simulate updating metrics with random values
  const accuracy = 85 + Math.random() * 10
  const f1Score = 0.8 + Math.random() * 0.15
  const auc = 0.9 + Math.random() * 0.08

  const metricCards = document.querySelectorAll(".metric-value")
  if (metricCards.length >= 3) {
    metricCards[0].textContent = accuracy.toFixed(1) + "%"
    metricCards[1].textContent = f1Score.toFixed(3)
    metricCards[2].textContent = auc.toFixed(3)
  }
}

// Data Analysis Page Functions
function initializeDataAnalysis() {
  console.log("[v0] Initializing data analysis page")

  // Animate feature type bars
  setTimeout(() => {
    const featureBars = document.querySelectorAll(".feature-progress")
    featureBars.forEach((bar) => {
      const width = bar.style.width
      bar.style.width = "0%"
      setTimeout(() => {
        bar.style.width = width
      }, 500)
    })
  }, 500)

  // Animate missing values bars
  setTimeout(() => {
    const missingBars = document.querySelectorAll(".missing-fill")
    missingBars.forEach((bar) => {
      const width = bar.style.width
      bar.style.width = "0%"
      setTimeout(() => {
        bar.style.width = width
      }, 300)
    })
  }, 1000)

  // Animate class balance circles
  setTimeout(() => {
    const balanceCircles = document.querySelectorAll(".balance-circle")
    balanceCircles.forEach((circle) => {
      circle.style.transform = "scale(0)"
      setTimeout(() => {
        circle.style.transform = "scale(1)"
        circle.style.transition = "transform 0.5s ease"
      }, 200)
    })
  }, 1500)

  // Initialize heatmap hover effects
  const heatmapCells = document.querySelectorAll(".heatmap-cell")
  heatmapCells.forEach((cell, index) => {
    cell.addEventListener("mouseenter", () => {
      cell.style.boxShadow = "0 4px 20px rgba(79, 70, 229, 0.5)"
    })

    cell.addEventListener("mouseleave", () => {
      cell.style.boxShadow = "none"
    })
  })
}

// Enhanced sendMessage function for data analysis context
function sendMessage() {
  const chatInput = document.getElementById("chatInput")
  const chatMessages = document.getElementById("chatMessages")

  if (!chatInput || !chatMessages) return

  const message = chatInput.value.trim()
  if (!message) return

  // Add user message
  const userMessage = document.createElement("div")
  userMessage.className = "message user-message"
  userMessage.innerHTML = `
    <div class="message-content">${message}</div>
  `
  chatMessages.appendChild(userMessage)

  // Clear input
  chatInput.value = ""

  // Simulate bot response with data analysis context
  setTimeout(() => {
    const botMessage = document.createElement("div")
    botMessage.className = "message bot-message"

    // Generate contextual responses based on common data analysis questions
    let response = "That's a great question! "

    if (message.toLowerCase().includes("missing") || message.toLowerCase().includes("null")) {
      response +=
        "I can see you have some missing values in your dataset. The Age column has 15% missing data - you might want to consider imputation strategies like mean/median filling or using algorithms that handle missing values naturally."
    } else if (message.toLowerCase().includes("balance") || message.toLowerCase().includes("class")) {
      response +=
        "Your dataset shows a 60-40 class distribution. This is reasonably balanced, but you might still want to consider techniques like stratified sampling during train-test split to maintain this ratio."
    } else if (message.toLowerCase().includes("correlation") || message.toLowerCase().includes("feature")) {
      response +=
        "The correlation heatmap shows some interesting relationships between your features. Look for highly correlated features (>0.8) as they might be redundant and could benefit from feature selection."
    } else if (message.toLowerCase().includes("overfitting") || message.toLowerCase().includes("overfit")) {
      response +=
        "Your model is likely overfitting because complexity is too high for the amount of data - try reducing depth, adding regularization, or collecting more training data."
    } else {
      response +=
        "Based on your data analysis, I'd suggest examining the feature distributions and correlations before proceeding with model training. The missing values in Age and Income columns should be addressed first."
    }

    botMessage.innerHTML = `
      <div class="message-avatar bot-avatar"></div>
      <div class="message-content">${response}</div>
    `
    chatMessages.appendChild(botMessage)

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight
  }, 1000)

  // Scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight
}

// Update slider values in real-time
function updateSliderValues() {
  const sliders = document.querySelectorAll(".slider")
  sliders.forEach((slider) => {
    const valueSpan = slider.parentElement.querySelector(".slider-value")
    if (valueSpan) {
      slider.addEventListener("input", (e) => {
        valueSpan.textContent = e.target.value + "%"
      })
    }
  })
}

// Initialize animations when page loads
document.addEventListener("DOMContentLoaded", () => {
  addScrollAnimations()
  createParticles()

  updateSliderValues()

  if (window.location.pathname.includes("data-analysis") || document.querySelector(".data-analysis-main")) {
    initializeDataAnalysis()
  }

  // Handle Enter key in chat input
  const chatInput = document.getElementById("chatInput")
  if (chatInput) {
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        sendMessage()
      }
    })
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })

        // Close mobile menu after clicking a link
        const navMenu = document.querySelector(".nav-menu")
        const navToggle = document.querySelector(".nav-toggle")
        if (navMenu.classList.contains("active")) {
          navMenu.classList.remove("active")
          navToggle.classList.remove("active")
        }
      }
    })
  })

  window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar")
    if (window.scrollY > 50) {
      navbar.style.background = "rgba(15, 15, 35, 0.98)"
      navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.3)"
    } else {
      navbar.style.background = "rgba(15, 15, 35, 0.95)"
      navbar.style.boxShadow = "none"
    }
  })
})

// Add keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    const focusedElement = document.activeElement
    if (focusedElement.classList.contains("feature-card")) {
      focusedElement.click()
    }
  }
})
