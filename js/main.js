// Appointment Booking Platform - Main JavaScript

document.addEventListener("DOMContentLoaded", function() {
  // Mobile navigation toggle
  initMobileNavigation();
  
  // FAQ accordion functionality
  initFaqAccordion();
  
  // Smooth scrolling for anchor links
  initSmoothScrolling();
  
  // Initialize notifications
  initNotifications();
  
  // Add loading states to forms
  initFormHandlers();
});

// Mobile Navigation
function initMobileNavigation() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  
  if (hamburger && mobileNav) {
    // Create hamburger icon spans if they don't exist
    if (hamburger.children.length === 0) {
      for (let i = 0; i < 3; i++) {
        const span = document.createElement('span');
        hamburger.appendChild(span);
      }
    }
    
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('active');
    });
    
    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
      }
    });
    
    // Close mobile nav when a link is clicked
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
      });
    });
  }
}

// FAQ Accordion
function initFaqAccordion() {
  const questionButtons = document.querySelectorAll('.q-btn');
  
  questionButtons.forEach(button => {
    button.addEventListener('click', function() {
      const answer = this.nextElementSibling;
      const plusIcon = this.querySelector('.plus-icon');
      
      // Check if the answer is currently shown
      const isOpen = answer.style.maxHeight && answer.style.maxHeight !== '0px';
      
      // Close all answers first
      document.querySelectorAll('.answer').forEach(ans => {
        ans.style.maxHeight = '0px';
        ans.style.padding = '0 15px';
      });
      
      // Reset all plus icons
      document.querySelectorAll('.plus-icon').forEach(icon => {
        icon.style.transform = 'rotate(0deg)';
      });
      
      // If the clicked answer wasn't open, open it
      if (!isOpen) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        answer.style.padding = '20px 20px 70px 15px';
        if (plusIcon) plusIcon.style.transform = 'rotate(45deg)';
      }
    });
  });
}

// Smooth Scrolling
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      
      if (target) {
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPosition = target.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Notification System
function initNotifications() {
  window.showNotification = function(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="flex items-center justify-between">
        <span>${message}</span>
        <button class="ml-4 text-lg" onclick="this.parentElement.parentElement.remove()">&times;</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto remove
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, duration);
  };
}

// Form Handlers
function initFormHandlers() {
  // Add loading states to buttons
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
      const submitBtn = form.querySelector('button[type="submit"], .btn-primary');
      if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Re-enable after 3 seconds (adjust based on actual form processing)
        setTimeout(() => {
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
        }, 3000);
      }
    });
  });
  
  // Basic form validation
  document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('blur', validateField);
    input.addEventListener('input', clearFieldError);
  });
}

// Field Validation
function validateField(e) {
  const field = e.target;
  const value = field.value.trim();
  const type = field.type;
  const required = field.hasAttribute('required');
  
  // Clear previous errors
  clearFieldError(e);
  
  if (required && !value) {
    showFieldError(field, 'This field is required');
    return false;
  }
  
  if (value) {
    switch (type) {
      case 'email':
        if (!isValidEmail(value)) {
          showFieldError(field, 'Please enter a valid email address');
          return false;
        }
        break;
      case 'tel':
        if (!isValidPhone(value)) {
          showFieldError(field, 'Please enter a valid phone number');
          return false;
        }
        break;
    }
  }
  
  return true;
}

function clearFieldError(e) {
  const field = e.target;
  field.classList.remove('error');
  const errorMsg = field.parentNode.querySelector('.form-error');
  if (errorMsg) {
    errorMsg.remove();
  }
}

function showFieldError(field, message) {
  field.classList.add('error');
  
  // Remove existing error message
  const existingError = field.parentNode.querySelector('.form-error');
  if (existingError) {
    existingError.remove();
  }
  
  // Add new error message
  const errorDiv = document.createElement('div');
  errorDiv.className = 'form-error';
  errorDiv.textContent = message;
  field.parentNode.appendChild(errorDiv);
}

// Utility Functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Modal System
window.openModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

// Close modal when clicking outside
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const activeModal = document.querySelector('.modal.active');
    if (activeModal) {
      activeModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
});

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
    }
  });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .card, .stats-widget').forEach(el => {
  observer.observe(el);
});

// Add CSS for animations
const animationStyles = `
<style>
.service-card, .card, .stats-widget {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.service-card.animate-in, .card.animate-in, .stats-widget.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.hamburger {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
}

.hamburger span {
  width: 100%;
  height: 2px;
  background-color: var(--text-primary);
  transition: all 0.3s ease;
}

.hamburger.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

.loading {
  position: relative;
  color: transparent !important;
}

.loading::after {
  content: "";
  position: absolute;
  width: 16px;
  height: 16px;
  top: 50%;
  left: 50%;
  margin-left: -8px;
  margin-top: -8px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 767.98px) {
  .hamburger {
    display: flex;
  }
  
  .nav-links {
    display: none;
  }
}

@media (min-width: 768px) {
  .hamburger {
    display: none;
  }
  
  .mobile-nav {
    display: none !important;
  }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', animationStyles);