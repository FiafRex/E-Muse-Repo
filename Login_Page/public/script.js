const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const close = document.querySelector('.icon-close');

const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get('message');

if (message) {
  const messageElement = document.getElementById('message');
  messageElement.textContent = message;

  setTimeout(() => {
    messageElement.textContent = '';
  }, 5000); 
}

registerLink.addEventListener('click', () => {
  wrapper.classList.add('active');
});

close.addEventListener('click', () => {
  wrapper.classList.remove('active-popup');
});

loginLink.addEventListener('click', () => {
  wrapper.classList.remove('active');
});

document.getElementById('register-link').addEventListener('click', function(event) {
  event.preventDefault(); // Prevent the default behavior of the link

  // Change the value of the hidden input field to "signup"
  document.getElementById('action').value = "signup";

  // Submit the form
  this.closest('form').submit();
});
