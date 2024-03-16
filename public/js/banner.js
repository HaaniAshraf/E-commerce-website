const bannerContainer = document.querySelector('.slider-container');
// Total number of banners
const totalBanners = document.querySelectorAll('.slider-item').length;
// Currently visible banner
let currentBanner = 1;

function slideBanners() {
  // Calculate the index of the next banner to be displayed
  const nextBanner = currentBanner % totalBanners + 1;
  // Calculate the translation value to move to the next banner
  bannerContainer.style.transform = `translateX(-${(nextBanner - 1) * (100 / totalBanners)}%)`;
  currentBanner = nextBanner;
}

setInterval(slideBanners, 5000);
