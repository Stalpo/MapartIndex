// Prevent form submission on Enter key press
document.addEventListener("keydown", function(event) {
  if (event.key === "Enter" && event.target.tagName !== "TEXTAREA" && event.target.tagName !== "INPUT") {
    event.preventDefault();
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const progressBar = document.getElementById("uploadProgressBar");
  const successMessage = document.getElementById("successMessage");
  const errorMessage = document.getElementById("errorMessage");
  const imagePreview = document.getElementById("imagePreview"); // added this line

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting normally

    const formData = new FormData(form);

    // Hide the form and show the progress bar
    form.style.display = "none";
    progressBar.parentElement.style.display = "block";

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/mapid/create", true);

    xhr.upload.addEventListener("progress", function (event) {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        progressBar.style.width = percentComplete + "%";
        progressBar.innerHTML = percentComplete.toFixed(2) + "%";
      }
    });

    xhr.addEventListener("load", function () {
      // Hide the progress bar
      progressBar.parentElement.style.display = "none";

      if (xhr.status === 200) {
        // Handle a successful upload response
        const response = JSON.parse(xhr.responseText);
        successMessage.style.display = "block";
        successMessage.innerHTML = "Upload Successful!";

        // Display the uploaded images in the success alert
        if (response.files && response.files.length > 0) {
          response.files.forEach((filename) => {
            const img = document.createElement("img");
            img.src = "/public/uploads/" + filename;
            img.className = "img-fluid";
            imagePreview.appendChild(img); // corrected this line
          });

          imagePreview.style.display = "block";
        }
      } else {
        // Handle other server errors or HTTP status codes
        try {
          const errorResponse = JSON.parse(xhr.responseText);
          errorMessage.style.display = "block";
          errorMessage.innerHTML = "Error: " + errorResponse.error;
        } catch (error) {
          errorMessage.style.display = "block";
          errorMessage.innerHTML = "Error: " + xhr.responseText;
        }
      }
    });

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        // Additional checks or actions can be performed here if needed
      }
    };

    // Send the request with form data
    xhr.send(formData);
  });
});
