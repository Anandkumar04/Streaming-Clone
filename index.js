document.addEventListener("DOMContentLoaded", function() {
  // Sign-up button event listeners
  document.getElementById('finish').addEventListener("click", function() {
    window.location.href = "signup.html";
  });
});

// document.getElementById("DOMContentLoaded", function(){
document.getElementById('finish-bottom').addEventListener("click", function(){
  window.location.href = "signup.html";
})

  // Add event listener for bottom sign-up button too

  // JavaScript for FAQ accordion functionality
document.addEventListener('DOMContentLoaded', function() {
const questionButtons = document.querySelectorAll('.q-btn');

questionButtons.forEach(button => {
button.addEventListener('click', function() {
// Get the next element (which should be the answer div)
const answer = this.nextElementSibling;

// Toggle the plus icon rotation
const plusIcon = this.querySelector('#plus-icon');

// Check if the answer is currently shown
const isOpen = answer.style.maxHeight && answer.style.maxHeight !== '0px';

// Close all answers first
document.querySelectorAll('.answer').forEach(ans => {
  ans.style.maxHeight = '0px';
  ans.style.padding = '0 15px';
});

// Reset all plus icons
document.querySelectorAll('#plus-icon').forEach(icon => {
  icon.style.transform = 'rotate(0deg)';
});

// If the clicked answer wasn't open, open it
if (!isOpen) {
  answer.style.maxHeight = answer.scrollHeight + 'px';
  answer.style.padding = '20px 20px 70px 15px';
  plusIcon.style.transform = 'rotate(45deg)';
}
});
});
});
