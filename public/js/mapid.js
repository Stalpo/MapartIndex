document.addEventListener('DOMContentLoaded', () => {
  const mapId = `#{mapId}`;
  const mapContainer = document.getElementById('mapContainer');

  fetch(`/api/mapId/${mapId}`)
    .then(response => response.json())
    .then(map => {
      if (map) {
        const imageUrl = `/public/uploads/${map.imgUrl}`;
        const dateUploaded = map.createdAt ? new Date(map.createdAt).toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        }) : 'Unknown';

        const mapContent = document.createElement('div');
        const mapInfo = document.createElement('div');
        mapInfo.innerHTML = `
          <p>Map ID: ${mapId}</p>
          <div class="row">
            <div class="col-md-12 text-center">
              <img src="${imageUrl}" alt="${mapId}" class="pixelated-image img-fluid" style="width: 100%; max-width: none; height: auto; border: 1px solid #ddd; border-radius: 5px; box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); image-rendering: pixelated;">
            </div>
          </div>
          <br>
          <div class="row">
            <div class="col-md-12 text-center">
              <p>Artist: ${map.artist || 'N/A'}</p>
              <p>Uploaded By: <a href="/profile/${map.username}">${map.username}</a></p>
              <p>NSFW: ${map.nsfw}</p>
              <p>Date Uploaded: ${dateUploaded}</p>
            </div>
          </div>`;
        mapContent.appendChild(mapInfo);
        mapContainer.innerHTML = ''; // Clear existing.
        mapContainer.appendChild(mapContent);
      } else {
        mapContainer.innerHTML = '<div class="alert alert-danger" role="alert">MapId not found!</div>';
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      document.getElementById('loadingSpinner').innerHTML = '<div class="alert alert-danger" role="alert">Error fetching data</div>';
    });
});