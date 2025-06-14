document.addEventListener("DOMContentLoaded", function() {
  // Sign-up button event listeners
  const finishBtn = document.getElementById('finish');
  if (finishBtn)
    finishBtn.addEventListener("click", function() {
      window.location.href = "signup.html";
    });

  const finishBottomBtn = document.getElementById('finish-bottom');
  if (finishBottomBtn)
    finishBottomBtn.addEventListener("click", function() {
      window.location.href = "signup.html";
    });

  // Hamburger menu toggle
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('active');
    });
    // Close mobile nav when a link is clicked
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
      });
    });
  }

  // FAQ Accordion functionality
  const questionButtons = document.querySelectorAll('.q-btn');
  questionButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Get the next element (which should be the answer div)
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
});
