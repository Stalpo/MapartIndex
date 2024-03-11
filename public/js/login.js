// Prevent form submission on Enter key press
document.addEventListener("keydown", function(event) {
  if (event.key === "Enter" && event.target.tagName !== "TEXTAREA" && event.target.tagName !== "INPUT") {
    event.preventDefault();
  }
});

// Handle login with vanilla JavaScript
document.addEventListener("DOMContentLoaded", function() {
  document.querySelector("form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    var username = document.getElementById("usernameInput").value;
    var password = document.getElementById("passwordInput").value;

    sendLogin(username, password);
  });
});