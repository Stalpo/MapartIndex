document.addEventListener('DOMContentLoaded', function() {
  // Make API call to get maps
  fetch('/api/mapId/maps')
    .then(response => response.json())
    .then(data => {
      buildGrid(data);
      buildUserSelector(data);
      buildArtistSelector(data);
      buildSortSelector(data);
      document.getElementById('loadingSpinner').style.display = 'none';
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      document.getElementById('loadingSpinner').innerHTML = '<div class="alert alert-danger" role="alert">Error fetching data</div>';
    });

  function buildGrid(maps) {
    const gridContainer = document.getElementById('gridContainer');

    // Clear existing content
    gridContainer.innerHTML = '';

    // Build grid
    maps.forEach(map => {
      const card = document.createElement('div');
      card.className = 'card mb-3 mx-auto'; // Added mx-auto for centering
      card.style = 'width: 18rem;';

      card.innerHTML = `
        <img src="/public/uploads/${map.imgUrl}" class="pixelated-image card-img-top" alt="Map Image">
        <div class="card-body">
          <h5 class="card-title">...${map.id.slice(-12)}</h5>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">Artist: ${map.artist}</li>
          <li class="list-group-item">Uploaded by: <a href="/profile/${map.username}">${map.username}</li>
        </ul>
        <div class="card-body">
          <a href="/mapId/${map.id}" class="card-link">View Map</a>
        </div>
      `;

      gridContainer.appendChild(card);
    });
  }

  function buildUserSelector(maps) {
    const userSelector = document.getElementById('userSelector');
    const uniqueUsers = [...new Set(maps.map(map => map.username || map.userId))];

    const allOption = document.createElement('option');
    allOption.value = '';
    allOption.textContent = 'All Users';
    userSelector.appendChild(allOption);

    uniqueUsers.forEach(user => {
      const option = document.createElement('option');
      option.value = user;
      option.textContent = user;
      userSelector.appendChild(option);
    });

    // Add event listener for input change
    userSelector.addEventListener('change', function() {
      const selectedUser = this.value;
      const selectedArtist = document.getElementById('artistSelector').value;
      const selectedSort = document.getElementById('sortSelector').value;
      const filteredMaps = maps.filter(map => 
        (selectedUser === '' || map.username === selectedUser || map.userId === selectedUser) &&
        (selectedArtist === '' || map.artist === selectedArtist)
      );

      applySortAndBuildGrid(filteredMaps, selectedSort);
    });
  }

  function buildArtistSelector(maps) {
    const artistSelector = document.getElementById('artistSelector');
    const uniqueArtists = [...new Set(maps.map(map => map.artist))];

    const allOption = document.createElement('option');
    allOption.value = '';
    allOption.textContent = 'All Artists';
    artistSelector.appendChild(allOption);

    uniqueArtists.forEach(artist => {
      const option = document.createElement('option');
      option.value = artist;
      option.textContent = artist;
      artistSelector.appendChild(option);
    });

    // Add event listener for input change
    artistSelector.addEventListener('change', function() {
      const selectedArtist = this.value;
      const selectedUser = document.getElementById('userSelector').value;
      const selectedSort = document.getElementById('sortSelector').value;
      const filteredMaps = maps.filter(map => 
        (selectedUser === '' || map.username === selectedUser || map.userId === selectedUser) &&
        (selectedArtist === '' || map.artist === selectedArtist)
      );

      applySortAndBuildGrid(filteredMaps, selectedSort);
    });
  }

  function buildSortSelector(maps) {
    const sortSelector = document.getElementById('sortSelector');

    const options = [
      { value: 'nameAsc', label: 'Name (Ascending)' },
      { value: 'nameDesc', label: 'Name (Descending)' },
      { value: 'dateAsc', label: 'Date (Ascending)' },
      { value: 'dateDesc', label: 'Date (Descending)' }
    ];

    options.forEach(option => {
      const sortOption = document.createElement('option');
      sortOption.value = option.value;
      sortOption.textContent = option.label;
      sortSelector.appendChild(sortOption);
    });

    // Add event listener for input change
    sortSelector.addEventListener('change', function() {
      const selectedSort = this.value;
      const selectedUser = document.getElementById('userSelector').value;
      const selectedArtist = document.getElementById('artistSelector').value;
      const filteredMaps = maps.filter(map => 
        (selectedUser === '' || map.username === selectedUser || map.userId === selectedUser) &&
        (selectedArtist === '' || map.artist === selectedArtist)
      );

      applySortAndBuildGrid(filteredMaps, selectedSort);
    });
  }

  function applySortAndBuildGrid(maps, selectedSort) {
    let sortedMaps;

    switch (selectedSort) {
      case 'nameAsc':
        sortedMaps = [...maps].sort((a, b) => a.artist.localeCompare(b.artist));
        break;
      case 'nameDesc':
        sortedMaps = [...maps].sort((a, b) => b.artist.localeCompare(a.artist));
        break;
      case 'dateAsc':
        sortedMaps = [...maps].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'dateDesc':
        sortedMaps = [...maps].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        sortedMaps = maps;
    }

    buildGrid(sortedMaps);
  }
});