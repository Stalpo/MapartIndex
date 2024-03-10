// Prevent form submission on Enter key press
document.addEventListener("keydown", function(event) {
  if (event.key === "Enter" && event.target.tagName !== "TEXTAREA" && event.target.tagName !== "INPUT") {
    event.preventDefault();
  }
});

// Handle profile edit with vanilla JavaScript
document.addEventListener("DOMContentLoaded", function() {
  document.querySelector("form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Collect form data
    var bioInput = document.getElementById("bioInput");
    var emailInput = document.getElementById("emailInput");
    var locationInput = document.getElementById("locationInput");
    var avatarInput = document.getElementById("avatarInput");
    var mcUuidInput = document.getElementById("mcUuidInput");    

    // Check if elements are input elements
    if (bioInput && emailInput && locationInput && avatarInput && mcUuidInput) {

      var bio = bioInput.value;
      var email = emailInput.value;
      var location = locationInput.value;
      var avatar = avatarInput.value;
      var mcUuid = mcUuidInput.value;

      // You may need to collect other form data as needed

      var xhr = new XMLHttpRequest();
      xhr.open("POST", "/edit-profile", true);
      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            // Handle successful profile edit
            window.location.href = "/profile"; // Redirect to the profile page or another page as needed
          } else if (xhr.status == 401) {
            // Unauthorized - Handle the case where the user is not allowed to edit the profile
            showError("Unauthorized access. Please log in.");
          } else {
            // Handle other server errors or HTTP status codes
            showError("Failed to make the profile edit request. Please try again later.");
          }
        }
      };

      // Convert the data to JSON format
      var jsonData = JSON.stringify({
        bio: bio,
        email: email,
        location: location,
        avatar: avatar,
        mcUuid: mcUuid,
        // Add other fields as needed
      });

      console.log(jsonData);

      // Send the request
      xhr.send(jsonData);
    } else {
      console.error("One or more input elements not found");
    }
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
});
