document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const progressBar = document.getElementById("uploadProgressBar");
  const successMessage = document.getElementById("successMessage");
  const errorMessage = document.getElementById("errorMessage");

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting normally

    const formData = new FormData(form);

    // Hide the form and show the progress bar
    form.style.display = "none";
    progressBar.parentElement.style.display = "block";

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/initialPush", true);

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
        stitchMaps(response.mapArtInfo, response.files);

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
  
async function stitchMaps(mapArtInfo, files){
  let nextInfo = 0;
  for(let i = 1; i <= files.length; i++){
    // stitch new mapart
    let imgUrls = [];
    let rotations = [];
    let width = 1;
    let height = 1;
    if(i == mapArtInfo[nextInfo].startIndex){
      // multi map mapart
      width = mapArtInfo[nextInfo].width;
      height = mapArtInfo[nextInfo].height;
      for (let j = 0; j < width * height; j++) {
        if(mapArtInfo[nextInfo].special.length == 0){
          // normal multi map
          const id = i + j;
          imgUrls.push(`/public/uploads/2b2t_${id}.png`);
          rotations.push(0);
        }else{
          // special map
          const id = i + mapArtInfo[nextInfo].special[j][0];
          imgUrls.push(`/public/uploads/2b2t_${id}.png`);
          rotations.push(mapArtInfo[nextInfo].special[j][1]);
        }
      }
      i += width * height - 1;

      // move nextInfo pointer
      nextInfo++;
      if(nextInfo == mapArtInfo.length){
        nextInfo = 0;
      }
    }else{
      // 1x1 map
      imgUrls.push(`/public/uploads/2b2t_${i}.png`);
      rotations.push(0);
    }

    // stitch them
    await joinImages(width, height, imgUrls, rotations)
      .then(resultImageUrl => {
        fetch(resultImageUrl)
          .then(response => response.blob())
          .then(resultBlob => {
            const blobObj = resultBlob;

            // post new mapart
            const formData = new FormData();
            formData.append('name', "N/A");
            formData.append('description', "");
            formData.append('artist', "N/A");
            formData.append('server', "2b2t");
            formData.append('file', blobObj);

            return fetch('/mapart-create', {
              method: 'POST',
              body: formData
            })
            .then(response => {
              if (!response.ok) {
                throw new Error('Failed to add image to database');
              }
              return response.json();
            })
            .then(data => {
              console.log('Image added to database:', data);
            })
            .catch(error => {
              console.error('Error adding image to database:', error);
              errorMessage.style.display = "block";
              errorMessage.innerHTML = "Error: " + error;
            });
          })
          .catch(error => {
            console.error('Error fetching blob:', error);
          });
      });
  }
}