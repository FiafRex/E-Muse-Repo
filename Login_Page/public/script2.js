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
