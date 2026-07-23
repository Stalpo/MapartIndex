let hostname2 = window.location.hostname;
let subdomain2 = null;
if (hostname2.endsWith('.mapartindex.com')) {
  subdomain2 = hostname2.slice(0, -'.mapartindex.com'.length);
  if (subdomain2 === 'www') subdomain2 = null;
} else if (hostname2 === 'mapartindex.com') {
  subdomain2 = null;
}

// Image Carousel
const CAROUSEL_BATCH_SIZE = 20;
const CAROUSEL_PREFETCH_THRESHOLD = 5;
const CAROUSEL_KEEP_BEHIND = 3;

let carouselLoadingMore = false;

function fetchRandomMaps(count) {
  const params = new URLSearchParams({ count });
  if (subdomain2) {
    params.set('server', subdomain2);
  }
  return fetch(`/api/mapArt/randomMaps?${params.toString()}`)
    .then(response => response.json())
    .then(images => (Array.isArray(images) ? images : []))
    .catch(error => {
      console.error('Error fetching random maps:', error);
      return [];
    });
}

function buildCarouselItem(image) {
  const carouselItem = document.createElement('div');
  carouselItem.className = 'carousel-item';
  const imgUrl = `/public/uploads/mapart/${image.imgUrl}`;
  const opacity = 50;
  carouselItem.innerHTML = `<img src="${imgUrl}" class="d-block w-100" style="image-rendering: pixelated; opacity: ${opacity}%;" alt="Map Image">`;
  return carouselItem;
}

function appendMapsToCarousel(images) {
  const carouselInner = document.querySelector('#imageCarousel .carousel-inner');
  if (!carouselInner) return;

  const hasActiveSlide = !!carouselInner.querySelector('.carousel-item.active');
  let assignedActive = hasActiveSlide;

  shuffleArray(images).forEach(image => {
    if (image.nsfw) return;

    const carouselItem = buildCarouselItem(image);
    if (!assignedActive) {
      carouselItem.classList.add('active');
      assignedActive = true;
    }
    carouselInner.appendChild(carouselItem);
  });
}

function pruneCarousel() {
  const carouselInner = document.querySelector('#imageCarousel .carousel-inner');
  if (!carouselInner) return;

  const items = Array.from(carouselInner.children);
  const activeIndex = items.findIndex(item => item.classList.contains('active'));
  if (activeIndex > CAROUSEL_KEEP_BEHIND) {
    items.slice(0, activeIndex - CAROUSEL_KEEP_BEHIND).forEach(item => item.remove());
  }
}

function queueMoreImagesIfNeeded() {
  if (carouselLoadingMore) return;

  const carouselInner = document.querySelector('#imageCarousel .carousel-inner');
  if (!carouselInner) return;

  const items = Array.from(carouselInner.children);
  const activeIndex = items.findIndex(item => item.classList.contains('active'));
  const remaining = items.length - 1 - activeIndex;
  if (remaining > CAROUSEL_PREFETCH_THRESHOLD) return;

  carouselLoadingMore = true;
  fetchRandomMaps(CAROUSEL_BATCH_SIZE)
    .then(images => {
      appendMapsToCarousel(images);
      pruneCarousel();
    })
    .finally(() => {
      carouselLoadingMore = false;
    });
}

fetchRandomMaps(CAROUSEL_BATCH_SIZE).then(images => appendMapsToCarousel(images));

$('#imageCarousel').on('slid.bs.carousel', queueMoreImagesIfNeeded);

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Fetch homepage stats from /api/stats
fetch(`/api/stats${!subdomain2 ? "" : `?server=${subdomain2}`}`)
  .then(response => response.json())
  .then(stats => {
    setText('totalMaps', stats.totalMaps);
    setText('totalMaparts', stats.totalMaparts);
    setText('totalServers', stats.totalServers);
    setText('totalVisits', stats.totalVisits);
    setText('dailyVisits', stats.dailyVisits);
    setText('totalUsers', stats.totalUsers);
    setText('dailyUsers', stats.dailyUsers);

    if (stats.displayName) {
      document.querySelectorAll('.server-display-name').forEach(el => {
        el.textContent = stats.displayName;
      });
    }

    if (stats.discord) {
      const discordLink = document.querySelector('#serverDiscordLink');
      const discordContainer = document.querySelector('#serverDiscordContainer');
      if (discordLink && discordContainer) {
        discordLink.setAttribute('href', stats.discord);
        discordContainer.style.display = '';
      }
    }
  })
  .catch(error => console.error('Error fetching stats:', error));

function setText(id, value) {
  const el = document.getElementById(id);
  if (el && value !== undefined && value !== null) {
    el.textContent = value;
  }
}
