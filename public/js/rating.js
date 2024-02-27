let rating = 0;
let valueField = document.querySelector(".star-value");

document
  .querySelectorAll('.star-rating input[name="rating"]')
  .forEach((radio) => {
    radio.addEventListener("change", function () {
      rating = document.querySelector(
        '.star-rating input[name="rating"]:checked'
      ).value;
      valueField.innerHTML = "Rating: " + rating;
    });
  });
