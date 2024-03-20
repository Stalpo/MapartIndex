// Prevent form submission on Enter key press
document.addEventListener("keydown", function(event) {
  if (event.key === "Enter" && event.target.tagName !== "TEXTAREA" && event.target.tagName !== "INPUT") {
    event.preventDefault();
  }
});

// Handle registration with vanilla JavaScript
document.addEventListener("DOMContentLoaded", function() {
  document.querySelector("form").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    var password = document.querySelector('[name="password"]').value;
    var confirmPassword = document.querySelector('[name="confirmPassword"]').value;

    // Check if passwords match
    if (password !== confirmPassword) {
      showError("Passwords do not match.");
      return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/update-password", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if (xhr.status == 201) {
          // Password update successful
          var data = JSON.parse(xhr.responseText);
          // Display the success message from the server
          showSuccess("Success: Updated password for " + data.username);
        } else {
          var data = JSON.parse(xhr.responseText);
          // Display the error message from the server
          showError("Registration failed: " + data.error);
        }
      }
    };

    // Convert the data to JSON format
    var jsonData = JSON.stringify({
      password: password
    });

    // Send the request
    xhr.send(jsonData);
  });

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

  function showSuccess(message) {
    // Display error using Bootstrap alert
    var alertDiv = document.createElement("div");
    alertDiv.className = "alert alert-success mt-3";
    alertDiv.textContent = message;

    // Insert the alert above the form
    var form = document.querySelector("form");
    form.parentNode.insertBefore(alertDiv, form.nextSibling);

    // Remove the alert after a few seconds
    setTimeout(function() {
      alertDiv.parentNode.removeChild(alertDiv);
    }, 5000);
  }
});
