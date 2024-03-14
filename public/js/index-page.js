// Fetch random images from /api/mapId/maps
fetch('/api/mapId/maps')
  .then(response => response.json())
  .then(images => {
    // Shuffle the array of images
    images = shuffleArray(images);

    const carouselInner = document.querySelector('#imageCarousel .carousel-inner');
    carouselInner.innerHTML = '';

    images.forEach((image, index) => {
      const activeClass = index === 0 ? 'active' : '';
      const carouselItem = document.createElement('div');
      carouselItem.className = `carousel-item ${activeClass}`;
      const imgUrl = `/public/uploads/${image.imgUrl}`;
      const brightnessValue = 350; // Brightness value

      carouselItem.innerHTML = `<img src="${imgUrl}" class="d-block w-100" style="image-rendering: pixelated; filter: brightness(${brightnessValue}%);" alt="Map Image">`;
      carouselInner.appendChild(carouselItem);
    });
  });

// Function to shuffle array elements
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Carousel fix
document.addEventListener('DOMContentLoaded', function () {
  // Select the navbar and change its background color
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    navbar.style.backgroundColor = 'white';
  }
});