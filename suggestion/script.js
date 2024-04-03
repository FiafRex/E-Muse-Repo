const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const close = document.querySelector('.icon-close');

registerLink.addEventListener('click',()=>{
  wrapper.classList.add('active');
});

close.addEventListener('click',()=>{
  wrapper.classList.remove('active-popup');
});

loginLink.addEventListener('click',()=>{
  wrapper.classList.remove('active');
});
document.getElementById('register-link').addEventListener('click', function(event) {
  event.preventDefault(); // Prevent the default behavior of the link

  // Change the value of the hidden input field to "signup"
  document.getElementById('action').value = "signup";

  // Submit the form
  this.closest('form').submit();
});

document.addEventListener("DOMContentLoaded", function() {
  const logoutButton = document.getElementById('logout');

  logoutButton.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default behavior of the link
    fetch('/logout', { method: 'POST' }) // Send a POST request to the logout route
      .then(response => {
        if (response.ok) {
          window.location.href = '/login.html'; // Redirect to login page after successful logout
        } else {
          console.error('Failed to logout');
          // Handle logout failure
        }
      })
      .catch(error => {
        console.error('Error during logout:', error);
        // Handle logout error
      });
  });
});
