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
    xhr.open("POST", "/admin/initialPush", true);

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

let mapIds = [];
let displayNames = [];

async function stitchMaps(mapArtInfo, files){
  let nextInfo = 0;
  for(let i = 1; i <= files.length; i++){
    // stitch new mapart
    let imgUrls = [];
    displayNames = [];
    let rotations = [];
    let width = 1;
    let height = 1;
    if(i == mapArtInfo[nextInfo].startIndex){
      // multi map mapart
      width = mapArtInfo[nextInfo].width;
      height = mapArtInfo[nextInfo].height;
      let maxNext = 0;
      for (let j = 0; j < width * height; j++) {
        if(mapArtInfo[nextInfo].special.length == 0){
          // normal multi map
          const id = i + j;
          maxNext = Math.max(maxNext, j);
          imgUrls.push(`/public/uploads/2b2t_${id}.png`);
          rotations.push(0);
          displayNames.push(`2b2t_${id}`);
        }else{
          // special map
          const id = i + mapArtInfo[nextInfo].special[j][0];
          maxNext = Math.max(maxNext, mapArtInfo[nextInfo].special[j][0]);
          imgUrls.push(`/public/uploads/2b2t_${id}.png`);
          rotations.push(mapArtInfo[nextInfo].special[j][1]);
          displayNames.push(`2b2t_${id}`);
        }
      }
      i += maxNext;

      // move nextInfo pointer
      nextInfo++;
      if(nextInfo == mapArtInfo.length){
        nextInfo = 0;
      }
    }else{
      // 1x1 map
      imgUrls.push(`/public/uploads/2b2t_${i}.png`);
      rotations.push(0);
      displayNames.push(`2b2t_${i}`);
    }

    // stitch them
    await new Promise((resolve, reject) => {
      joinImages(width, height, imgUrls, rotations)
        .then(resultImageUrl => {
          fetch(resultImageUrl)
            .then(response => response.blob())
            .then(async resultBlob => {
              const blobObj = resultBlob;

              await fetchImages();

              // post new mapart
              const formData = new FormData();
              formData.append('name', "N/A");
              formData.append('description', "");
              formData.append('artist', "N/A");
              formData.append('server', "2b2t");
              formData.append('file', blobObj);
              formData.append('mapIds', JSON.stringify(mapIds));
              // Convert comma-separated values into a JSON array
              const tagsArray = [];
              formData.append('tags', JSON.stringify(tagsArray));

              return fetch('/mapart/create', {
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
                resolve();
              })
              .catch(error => {
                console.error('Error adding image to database:', error);
                errorMessage.style.display = "block";
                errorMessage.innerHTML = "Error: " + error;
                reject();
              });
            })
            .catch(error => {
              console.error('Error fetching blob:', error);
              reject();
            });
        });
    });
  }
}

function fetchImages() {
  return new Promise((resolve, reject) => {

    const promises = [];

    displayNames.forEach(displayName => {
      if (displayName) {
        const promise = fetch(`/api/mapId/name/${displayName}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            if (data && data.id && data.imgUrl) {
              return { id: data.id };
            } else {
              throw new Error('Invalid data received');
            }
          })
          .catch(error => {
            console.error('Error fetching data:', error.message);
            return null;
          });

        promises.push(promise);
      }
    });
    mapIds = [];

    Promise.all(promises)
      .then(results => {
        // Filter out null results
        const validResults = results.filter(result => result !== null);
        if (validResults.length > 0) {
          validResults.forEach(map => {
            if (map && map.id) {
              mapIds.push(map.id);
            }
          });
          resolve();
        } else {
          reject(new Error('No valid map data fetched'));
        }
      })
      .catch(error => {
        reject(error);
      });
  });
}