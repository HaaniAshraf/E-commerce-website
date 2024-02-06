
const bannerContainer = document.querySelector('.slider-container');
const totalBanners = document.querySelectorAll('.slider-item').length;
let currentBanner = 1;

function slideBanners() {
  const nextBanner = currentBanner % totalBanners + 1;
  bannerContainer.style.transform = `translateX(-${(nextBanner - 1) * (100 / totalBanners)}%)`;
  currentBanner = nextBanner;
}

setInterval(slideBanners, 5000);
