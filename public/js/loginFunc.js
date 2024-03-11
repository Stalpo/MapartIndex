function sendLogin(username, password){
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/login", true);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        var data = JSON.parse(xhr.responseText);

        // Check if login was successful
        if (data.token) {
          // Save the token as a cookie
          document.cookie = "token=" + data.token;

          // Redirect to a new page or perform other actions
          window.location.href = "/"; // Change this URL as needed
        } else {
          // Display the error message from the server
          showError("Login failed: " + data.error);
        }
      } else if (xhr.status == 401) {
        // Unauthorized - Incorrect username or password
        showError("Invalid username or password. Please try again.");
      } else {
        // Handle other server errors or HTTP status codes
        showError("Failed to make the login request. Please try again later.");
      }
    }
  };

  // Convert the data to JSON format
  var jsonData = JSON.stringify({
    username: username,
    password: password
  });

  // Send the request
  xhr.send(jsonData);
}

function showError(message) {
  // Display error using Bootstrap alert
  var alertDiv = document.createElement("div");
  alertDiv.className = "alert alert-danger mt-3";
  alertDiv.textContent = message;

  // Insert the alert above the form
  var form = document.querySelector("form");
  form.parentNode.insertBefore(alertDiv, form.nextSibling);

  // Remove the alert after a few seconds
  setTimeout(function() {
    alertDiv.parentNode.removeChild(alertDiv);
  }, 5000);
}