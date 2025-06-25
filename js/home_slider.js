// Enhanced Food Data with Directions
const foodDatabase = {
  pizza: {
    name: "Margherita Pizza",
    icon: "🍕",
    price: "$18.99",
    description: "Fresh mozzarella, San Marzano tomatoes, and basil on our signature wood-fired crust. A classic Italian masterpiece that brings authentic flavors to your table.",
    rating: 4.8,
    category: "Italian",
    direction: "East"
  },
  burger: {
    name: "Gourmet Burger",
    icon: "🍔",
    price: "$15.99",
    description: "Premium Angus beef patty with aged cheddar, crispy bacon, fresh lettuce, and our secret sauce on a brioche bun. Comfort food elevated to perfection.",
    rating: 4.7,
    category: "American",
    direction: "Northeast"
  },
  sushi: {
    name: "Fresh Sushi",
    icon: "🍣",
    price: "$24.99",
    description: "Chef's selection of the finest sashimi-grade fish, perfectly seasoned sushi rice, and traditional accompaniments. Ocean-fresh flavors in every bite.",
    rating: 4.9,
    category: "Japanese",
    direction: "North"
  },
  taco: {
    name: "Street Tacos",
    icon: "🌮",
    price: "$12.99",
    description: "Authentic Mexican street tacos with slow-cooked carnitas, fresh cilantro, onions, and lime on handmade corn tortillas. Bold flavors that transport you to Mexico.",
    rating: 4.6,
    category: "Mexican",
    direction: "Northwest"
  },
  pasta: {
    name: "Truffle Pasta",
    icon: "🍝",
    price: "$22.99",
    description: "Hand-rolled pasta with black truffle shavings, wild mushrooms, and Parmigiano-Reggiano in a rich cream sauce. Luxury dining at its finest.",
    rating: 4.8,
    category: "Italian",
    direction: "West"
  },
  ramen: {
    name: "Tonkotsu Ramen",
    icon: "🍜",
    price: "$16.99",
    description: "Rich pork bone broth simmered for 24 hours, topped with chashu pork, soft-boiled egg, and fresh scallions. Soul-warming Japanese comfort food.",
    rating: 4.7,
    category: "Japanese",
    direction: "Southwest"
  },
  salad: {
    name: "Caesar Salad",
    icon: "🥗",
    price: "$13.99",
    description: "Crisp romaine lettuce, house-made croutons, fresh Parmesan, and our signature Caesar dressing. A timeless classic done right.",
    rating: 4.5,
    category: "Healthy",
    direction: "South"
  },
  steak: {
    name: "Wagyu Steak",
    icon: "🥩",
    price: "$45.99",
    description: "Premium A5 Wagyu beef, perfectly grilled to your preference and served with seasonal vegetables. The ultimate indulgence for meat lovers.",
    rating: 5.0,
    category: "Premium",
    direction: "Southeast"
  }
};

// Direction mapping for compass and positioning
const directions = [
  { name: "East", angle: 0, compassAngle: 90 },
  { name: "Northeast", angle: 45, compassAngle: 45 },
  { name: "North", angle: 90, compassAngle: 0 },
  { name: "Northwest", angle: 135, compassAngle: 315 },
  { name: "West", angle: 180, compassAngle: 270 },
  { name: "Southwest", angle: 225, compassAngle: 225 },
  { name: "South", angle: 270, compassAngle: 180 },
  { name: "Southeast", angle: 315, compassAngle: 135 }
];

class PremiumFoodCarousel {
  constructor() {
    this.currentRotation = 0; // Current rotation in degrees
    this.currentIndex = 0; // Current active food index (0 = East/Pizza)
    this.isAutoRotating = true;
    this.isFast = false;
    this.selectedFood = null;
    this.isRotating = false; // Flag to prevent overlapping rotations
    
    this.container = document.querySelector('.carousel-container');
    this.foodRing = document.getElementById('foodRing');
    this.rotateClockBtn = document.getElementById('rotateClockBtn');
    this.rotateCounterBtn = document.getElementById('rotateCounterBtn');
    this.playPauseBtn = document.getElementById('playPauseBtn');
    this.speedBtn = document.getElementById('speedBtn');
    this.resetBtn = document.getElementById('resetBtn');
    this.compassNeedle = document.getElementById('compassNeedle');
    this.currentDirection = document.getElementById('current-direction');
    this.currentFood = document.getElementById('current-food');
    this.detailsPanel = document.getElementById('detailsPanel');
    this.closeDetails = document.getElementById('closeDetails');
    
    this.foodItems = Array.from(document.querySelectorAll('.food-item'));
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.addFoodInteractions();
    this.addKeyboardControls();
    this.updateActiveFood();
    // this.updateCompass();
    this.startAutoRotation();
  }
  
  setupEventListeners() {
    // this.rotateClockBtn.addEventListener('click', () => this.rotateClockwise());
    // this.rotateCounterBtn.addEventListener('click', () => this.rotateCounterClockwise());
    // this.playPauseBtn.addEventListener('click', () => this.toggleAutoRotation());
    // this.speedBtn.addEventListener('click', () => this.toggleSpeed());
    // this.resetBtn.addEventListener('click', () => this.resetPosition());
    this.closeDetails.addEventListener('click', () => this.hideDetails());
    
    // Close details panel when clicking outside
    this.detailsPanel.addEventListener('click', (e) => {
      if (e.target === this.detailsPanel) {
        this.hideDetails();
      }
    });
  }
  
  rotateClockwise() {
    // if (this.isRotating) return; // Prevent overlapping rotations
    
    this.stopAutoRotation();
    this.performRotation(-45, 1); // Clockwise rotation
    // this.addButtonFeedback(this.rotateClockBtn);
    this.startAutoRotation();

  }
  
  rotateCounterClockwise() {
    // if (this.isRotating) return; // Prevent overlapping rotations
    
    this.stopAutoRotation();
    this.performRotation(45, -1); // Counter-clockwise rotation
    // this.addButtonFeedback(this.rotateCounterBtn);
    this.startAutoRotation();

  }
  
  performRotation(rotationDelta, indexDelta) {
    this.isRotating = true;
    
    // Update rotation and index
    this.currentRotation += rotationDelta;
    this.currentIndex = (this.currentIndex + indexDelta + 8) % 8;
    
    // Apply rotation with smooth transition
    this.foodRing.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    this.foodRing.style.transform = `rotate(${this.currentRotation}deg)`;
    
    // Update UI elements
    this.updateActiveFood();
    // this.updateCompass();
    
    // Reset rotation flag after animation completes
    setTimeout(() => {
      this.isRotating = false;
    }, 600);
  }
  
  updateActiveFood() {
    // Remove active class from all items
    this.foodItems.forEach(item => item.classList.remove('active'));
    this.foodItems.forEach(item => item.classList.remove('side'));
    this.foodItems.forEach(item => item.classList.remove('side'));
    
    
    // Add active class to current item
    const activeItem = this.foodItems[this.currentIndex];
    const previousItem = this.currentIndex > 0 ? this.foodItems[this.currentIndex - 1] : this.foodItems[this.foodItems.length - 1];
    const nextItem = this.currentIndex < this.foodItems.length - 1 ? this.foodItems[this.currentIndex + 1] : this.foodItems[0];

    activeItem.classList.add('active');
    previousItem.classList.add('side')
    nextItem.classList.add('side')
    
    // Update center hub content
    const foodType = activeItem.dataset.food;
    const food = foodDatabase[foodType];
    const direction = directions[this.currentIndex];
    
    this.currentDirection.textContent = `${direction.name} Direction`;
    this.currentFood.textContent = food.name;
  }
  
  updateCompass() {
    const direction = directions[this.currentIndex];
    this.compassNeedle.style.transform = `rotate(${direction.compassAngle}deg)`;
  }
  
  toggleAutoRotation() {
    this.isAutoRotating = !this.isAutoRotating;
    
    if (this.isAutoRotating) {
      this.startAutoRotation();
      this.playPauseBtn.innerHTML = '<span class="btn-icon">⏸️</span><span class="btn-text">Pause Auto</span>';
    } else {
      this.stopAutoRotation();
      this.playPauseBtn.innerHTML = '<span class="btn-icon">▶️</span><span class="btn-text">Start Auto</span>';
    }
    
    // this.addButtonFeedback(this.playPauseBtn);
  }
  
  startAutoRotation() {
    if (this.autoRotationInterval) {
      console.log("if condition =True")
      clearInterval(this.autoRotationInterval);
    }
    
    // Remove CSS animation class to use JavaScript-controlled discrete steps
    this.foodRing.classList.remove('auto-rotate');
    console.log("middle")

    const interval = this.isFast ? 1500 : 3000; // 3 seconds normal, 1.5 seconds fast
    
    this.autoRotationInterval = setInterval(() => {
      console.log(this.isAutoRotating,"    ", this.isRotating)
      if (this.isAutoRotating && !this.isRotating) {
        console.log("SetInterval=True")
        this.performRotation(-45, 1); // Discrete 45-degree clockwise steps
      }
    }, interval);
  }
  
  stopAutoRotation() {
    // this.isAutoRotating = false;
    this.foodRing.classList.remove('auto-rotate');
    if (this.autoRotationInterval) {
      clearInterval(this.autoRotationInterval);
    }
  }
  
  toggleSpeed() {
    this.isFast = !this.isFast;
    
    if (this.isFast) {
      this.container.classList.add('fast');
      this.speedBtn.innerHTML = '<span class="btn-icon">🐌</span><span class="btn-text">Normal</span>';
    } else {
      this.container.classList.remove('fast');
      this.speedBtn.innerHTML = '<span class="btn-icon">⚡</span><span class="btn-text">Speed</span>';
    }
    
    // Restart auto rotation with new speed
    if (this.isAutoRotating) {
      this.startAutoRotation();
    }
    
    // this.addButtonFeedback(this.speedBtn);
  }
  
  resetPosition() {
    if (this.isRotating) return; // Prevent reset during rotation
    
    this.stopAutoRotation();
    this.isRotating = true;
    
    this.currentRotation = 0;
    this.currentIndex = 0;
    
    // Apply reset with smooth transition
    this.foodRing.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    this.foodRing.style.transform = `rotate(0deg)`;
    
    this.updateActiveFood();
    this.updateCompass();
    // this.addButtonFeedback(this.resetBtn);
    
    // Reset rotation flag and restart auto rotation after animation
    setTimeout(() => {
      this.isRotating = false;
      if (this.isAutoRotating) {
        this.startAutoRotation();
      }
    }, 800);
  }
  
  addButtonFeedback(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = '';
    }, 150);
  }
  
  addFoodInteractions() {
    this.foodItems.forEach((item, index) => {
      // Click to show details
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const foodType = item.dataset.food;
        this.selectFood(foodType, index);
        this.showDetails(foodType);
      });
      
      // Hover effects
      item.addEventListener('mouseenter', () => {
        if (!item.classList.contains('selected')) {
          this.addHoverEffect(item);
        }
      });
      
      item.addEventListener('mouseleave', () => {
        if (!item.classList.contains('selected')) {
          this.removeHoverEffect(item);
        }
      });
    });
  }
  
  selectFood(foodType, index) {
    // Remove previous selection
    this.foodItems.forEach(item => {
      item.classList.remove('selected');
    });
    
    // Add selection to clicked item
    const targetItem = this.foodItems[index];
    if (targetItem) {
      targetItem.classList.add('selected');
      this.selectedFood = foodType;
      
      // Add selection animation
      this.addSelectionAnimation(targetItem);
    }
  }
  
  addHoverEffect(item) {
    item.style.filter = 'brightness(1.2)';
  }
  
  removeHoverEffect(item) {
    item.style.filter = '';
  }
  
  addSelectionAnimation(item) {
    const card = item.querySelector('.food-card');
    card.style.animation = 'none';
    card.offsetHeight; // Trigger reflow
    card.style.animation = null;
  }
  
  showDetails(foodType) {
    const food = foodDatabase[foodType];
    if (!food) return;
    
    // Update details content
    document.getElementById('detailsIcon').textContent = food.icon;
    document.getElementById('detailsName').textContent = food.name;
    document.getElementById('detailsDirection').textContent = `${food.direction} Direction`;
    document.getElementById('detailsDescription').textContent = food.description;
    document.getElementById('detailsPrice').textContent = food.price;
    
    // Show panel with animation
    this.detailsPanel.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  hideDetails() {
    this.detailsPanel.classList.remove('active');
    document.body.style.overflow = '';
    
    // Remove selection after hiding details
    setTimeout(() => {
      this.foodItems.forEach(item => {
        item.classList.remove('selected');
      });
      this.selectedFood = null;
    }, 300);
  }
  
  addKeyboardControls() {
    document.addEventListener('keydown', (e) => {
      switch(e.key) {
        case ' ':
          e.preventDefault();
          this.toggleAutoRotation();
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.rotateClockwise();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          this.rotateCounterClockwise();
          break;
        case 'ArrowUp':
          e.preventDefault();
          this.toggleSpeed();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          this.resetPosition();
          break;
        case 'Escape':
          this.hideDetails();
          break;
      }
    });
  }
}

// Enhanced visual effects
class VisualEffects {
  constructor() {
    // this.addParticleSystem();
    // this.addMouseTrail();
  }
  
  addParticleSystem() {
    // Create additional floating particles dynamically
    const backgroundEffects = document.querySelector('.background-effects');
    
    for (let i = 0; i < 10; i++) {
      const particle = document.createElement('div');
      particle.className = 'floating-particle';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 8 + 's';
      particle.style.animationDuration = (8 + Math.random() * 4) + 's';
      backgroundEffects.appendChild(particle);
    }
  }
  
  addMouseTrail() {
    let mouseX = 0, mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    
    // Create subtle glow effect that follows mouse
    const glowEffect = document.createElement('div');
    glowEffect.style.cssText = `
      position: fixed;
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(255,215,0,0.1) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
      z-index: 1;
      transition: all 0.3s ease;
    `;
    document.body.appendChild(glowEffect);
    
    function updateGlow() {
      glowEffect.style.left = (mouseX - 100) + 'px';
      glowEffect.style.top = (mouseY - 100) + 'px';
      requestAnimationFrame(updateGlow);
    }
    updateGlow();
  }
}

// Performance optimization
class PerformanceOptimizer {
  constructor() {
    this.setupIntersectionObserver();
    this.optimizeAnimations();
  }
  
  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    });
    
    document.querySelectorAll('.food-item').forEach(item => {
      observer.observe(item);
    });
  }
  
  optimizeAnimations() {
    // Reduce animations on low-performance devices
    if (navigator.hardwareConcurrency < 4) {
      document.documentElement.style.setProperty('--animation-duration', '30s');
    }
    
    // Pause animations when tab is not visible
    document.addEventListener('visibilitychange', () => {
      const container = document.querySelector('.carousel-container');
      if (document.hidden) {
        container.style.animationPlayState = 'paused';
      } else {
        container.style.animationPlayState = 'running';
      }
    });
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Add loading animation
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  
  setTimeout(() => {
    document.body.style.opacity = '1';
    
    // Initialize main components
    new PremiumFoodCarousel();
    new VisualEffects();
    new PerformanceOptimizer();
    
  }, 100);
});

// Add CSS custom properties for dynamic theming
// document.documentElement.style.setProperty('--primary-color', '#ff3232');
// document.documentElement.style.setProperty('--secondary-color', '#ff6b6b');
// document.documentElement.style.setProperty('--accent-color', '#4facfe');

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PremiumFoodCarousel, VisualEffects, PerformanceOptimizer };
}