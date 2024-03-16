// Orange Color of Cart
document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", async (event) => {
     // Check if the clicked element is the "Add to Cart" button
    const addToCartButton = event.target.closest("#addToCartButton");
    const cartIcon = document.getElementById("cartIcon")

    if (addToCartButton && cartIcon) {
      try {
        // Extract the product ID from the data-product-id attribute
        const productId = addToCartButton
          .querySelector("[data-product-id]")
          .getAttribute("data-product-id");

          // Check if the product is already in the cart
          const productInCart = cartIcon.classList.contains("orangeColor");
          if (productInCart){
            window.location.href = "/cart";
          }
          else{
            const cartResponse = await fetch(`/addToCart/${productId}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            });
    
            if (cartResponse.ok) {
              if (cartIcon.classList.contains("orangeColor")) {
                // If the product is already in the cart, redirect to the cart page
                window.location.href = "/cart";
               }else{
                 cartIcon.classList.add("orangeColor");
                 updateCartCount();
               }
            } else {
              console.error("Failed to add to cart");
            }
          }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  });
});


// Cart Count
async function updateCartCount() {
  try {
    const response = await fetch("/cart/count");

    if (!response.ok) {
      console.error(`Server responded with status: ${response.status}`);
      return;
    }

    const data = await response.json();

    const cartCountSpan = document.getElementById("cartCount");
    if (cartCountSpan) {
      cartCountSpan.textContent = data.cartCount;
    }
  } catch (error) {
    console.error("Error updating cart count:", error);
  }
}
updateCartCount();


// Quantity Update
const productPrice = document.getElementById("productPrice"); //price of a product
const productOgPrice = document.getElementById("productOgPrice"); // Ogprice of a product
const totalPriceElement = document.getElementById("totalCartPrice"); // Total price of the cart
const totalOgPriceElement = document.getElementById("totalCartOgPrice"); // Total original price of the cart(mrp)
const totalDiscountElement = document.getElementById("totalCartDiscount"); // Mrp-Our Price
const totalAmountElement = document.getElementById("totalAmountValue"); //Total Order amount after discounts

function updateQuantity(itemId, change, price, ogPrice) {
  // Get the quantity element for the specified item
  const quantityElement = document.getElementById(`${itemId}Quantity`);
  let quantity = parseInt(quantityElement.innerText);
  // Update the quantity based on the change parameter
  quantity += change;
  // Ensure the quantity is not less than 1
  if (quantity < 1) {
    quantity = 1;
  }
  quantityElement.innerText = quantity;

  const finalPrice = parseInt(price * quantity);
  const finalOgPrice = parseInt(ogPrice * quantity);

  // Update the displayed product prices for the specified item
  const productPriceElement = document.querySelector(`.productPrice${itemId}`);
  const productOgPriceElement = document.querySelector(`.productOgPrice${itemId}`);

  productPriceElement.innerHTML = `₹${finalPrice}`;
  productOgPriceElement.innerHTML = `₹${finalOgPrice}`;

  const data = {
    itemId: itemId,
    quantity: quantity,
    finalPrice: finalPrice,
    finalOgPrice: finalOgPrice,
  };

  fetch("/updateCartItem", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      totalPriceElement.innerText = `₹${result.totalPrice}`;
      totalOgPriceElement.innerText = `₹${result.totalOgPrice}`;
      totalDiscountElement.innerText = `₹${result.discount}`;
      totalAmountElement.innerText = `₹${result.totalOrderAmount}`;
    })
    .catch((error) => {
      console.error("Error updating cart:", error);
    });
}


// Cart Remove
function confirmRemove(productId) {
  Swal.fire({
    title: "Are you sure?",
    text: "You are about to remove this item from your cart.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, remove it!",
    backdrop: "rgba(0,0,0,0.9)",
  }).then((result) => {
    if (result.isConfirmed) {
      removeFromCart(productId);
    }
  });
}

async function removeFromCart(productId) {
  try {
    const response = await fetch("/removeFromCart/" + productId, {
      method: "POST",
    });

    if (response.ok) {
      const result = await response.json();

      if (result.success) {
        window.location.reload();
      } else {
        console.error("Failed to remove item from cart.");
      }
    } else {
      console.error("Failed to remove item from cart:", response.statusText);
    }
  } catch (error) {
    console.error("Error removing item from cart:", error);
  }
}


// Gift Wrap
document.addEventListener("DOMContentLoaded", function () {
  var addGiftWrapBtn = document.getElementById("addGiftWrapBtn");
  var totalAmountElement = document.getElementById("totalAmountValue");

  if (totalAmountElement) {
    var txtContent = totalAmountElement.textContent.replace("₹", "");
    const total = parseFloat(txtContent);

    if (addGiftWrapBtn) {
      addGiftWrapBtn.addEventListener("click", async () => {
        try {
          const response = await fetch("/applyGift", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          });

          if (response.ok) {
            const result = await response.json();

            if (result.success) {
              totalAmountElement.innerHTML = `₹${result.totalOrderAmount}`;
            }
          }
        } catch (error) {
          console.error("Error applying gift wrap:", error);
        }
      });
    }
  }
});


// Coupon Apply
document.addEventListener("DOMContentLoaded", () => {
  const applyButton = document.querySelector(".apply");

  if(applyButton){ 
  applyButton.addEventListener("click", async () => {
    const couponDiscountElement = document.querySelector(".couponDiscount");
    const couponCode = document.getElementById("couponCode").value;

    try {
      const response = await fetch("/applyCoupon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ couponCode }),
      });

      if (response.ok) {
        const result = await response.json();
        couponDiscountElement.textContent = ""; // Reset previous messages

        if (result.success) {
          const couponDiscount = parseFloat(result.discount);
          const totalAmountElement = document.getElementById("totalAmountValue");

          if (totalAmountElement) {
            const totalAmountPrice = parseFloat( totalAmountElement.innerText.replace("₹", ""));

            if (!isNaN(couponDiscount) && !isNaN(totalAmountPrice)) {
              // isNaN() returns true if a value is Not A Number.

              const discountedAmount = totalAmountPrice - totalAmountPrice * (couponDiscount / 100);
              totalAmountElement.textContent = `₹ ${discountedAmount.toFixed()}`;
              couponDiscountElement.textContent = `${couponDiscount}%`;
              couponDiscountElement.classList.add("coupongreen");
            } else {
              console.log("Invalid coupon discount or original price");
            }
          } else {
            console.log("Total price element not found");
          }
        } else {
          couponDiscountElement.textContent = `Coupon condition not met`;
          couponDiscountElement.classList.add("couponred");
        }
      } else {
        couponDiscountElement.textContent = `Invalid Coupon Code`;
        couponDiscountElement.classList.add("couponred");
        console.error("Failed to validate coupon:", response.statusText);
      }
    } catch (error) {
      console.error("Error validating coupon:", error);
    }
  })
}
});
