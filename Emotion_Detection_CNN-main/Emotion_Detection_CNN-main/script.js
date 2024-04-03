
document.getElementById('emotionButton').addEventListener('click', function() {
  fetch('/emotion_detection')
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.text();
      })
      .then(data => {
          console.log(data); // Log response from the server
          if (data === 'Happy') {
              // If the detected emotion is "Happy", redirect to happy.html
              window.location.href = 'C:\MyFiles\Capstone\Coding\Suggestion\public\index.html';
          }
      })
      .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
      });
});

// Function to get the latest detected emotion from the server
function getLatestEmotion() {
  fetch('/get_latest_emotion')
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.text();
      })
      .then(emotion => {
          // Update HTML textbox with the latest emotion
          document.getElementById('emotionTextbox').value = emotion;
      })
      .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
      });
}

// Call the function to get the latest emotion when the page loads
getLatestEmotion();
