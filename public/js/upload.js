// Handle file upload with vanilla JavaScript
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const progressBar = document.getElementById("uploadProgressBar");
  const successMessage = document.getElementById("successMessage");
  const errorMessage = document.getElementById("errorMessage");
  const previewImg = document.getElementById("previewImg");

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting normally

    const formData = new FormData(form);

    // Hide the form and show the progress bar
    form.style.display = "none";
    progressBar.parentElement.style.display = "block";

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/upload", true);

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
        successMessage.innerHTML =
          "Upload Successful! Click <a href='./public/uploads/" +
          response.filename +
          "' target='_blank'>here</a> to view your file.";

        // Display the uploaded image in the success alert
        if (response.filename) {
          previewImg.src = "./public/uploads/" + response.filename;
          console.dir(previewImg);
          previewImg.style.display = "block";
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
