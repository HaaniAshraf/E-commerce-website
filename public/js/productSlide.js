document.addEventListener("DOMContentLoaded", function () {
  let currentImageIndex = 0;
  const images = document.querySelectorAll(
    ".product-images-slider .product-img"
  );
  const totalImages = images.length;
  function showImage(index) {
    images.forEach((img, i) => {
      img.classList.toggle("active", i === index);
    });
  }
  function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % totalImages;
    showImage(currentImageIndex);
  }
  setInterval(nextImage, 4000);
});
