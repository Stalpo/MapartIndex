// Fetch random images from /api/mapId/maps
const maparts = 20;
const randomPage = Math.floor(Math.random() * 50);
fetch(`/api/mapArt/maps?page=${randomPage}&perPage=${maparts}`)
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
      const imgUrl = `/public/uploads/mapart/${image.imgUrl}`;
      const opacity = 50; // Opacity %

      carouselItem.innerHTML = `<img src="${imgUrl}" class="d-block w-100" style="image-rendering: pixelated; opacity: ${opacity}%;" alt="Map Image">`;
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