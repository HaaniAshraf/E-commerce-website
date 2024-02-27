
// Orange Color of Cart
document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', async (event) => {
        const addToCartButton = event.target.closest('#addToCartButton');

        if (addToCartButton) {
            try {
                const productId = addToCartButton.querySelector('[data-product-id]').getAttribute('data-product-id');
                const cartResponse = await fetch(`/addToCart/${productId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (cartResponse.ok) {
                    addToCartButton.classList.add('orangeColor');
                    updateCartCount()

                } else {
                    console.error('Failed to add to cart');
                }

            } catch (error) {
                console.error('Error:', error);
            }
        }

        const cartIcon = document.getElementById('cartIcon');
        if (cartIcon && cartIcon.classList.contains('productInCart')) {
            cartIcon.classList.add('orangeColor');
        }

    });
});





// Cart Count
async function updateCartCount() {
    try {
        console.log('Updating cart count...');
        const response = await fetch('/cart/count');       
   
        if (!response.ok) {
            console.error(`Server responded with status: ${response.status}`);
            return;
        }

            const data = await response.json();

            const cartCountSpan = document.getElementById('cartCount'); 
            if (cartCountSpan) {
                cartCountSpan.textContent = data.cartCount;
            }

    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}
updateCartCount(); 





// Quantity Update
const productPrice = document.getElementById('productPrice')  //price of a product
const productOgPrice = document.getElementById('productOgPrice')  // Ogprice of a product
const totalPriceElement = document.getElementById('totalCartPrice');  // Total price of the cart
const totalOgPriceElement = document.getElementById('totalCartOgPrice');  // Total original price of the cart(mrp)
const totalDiscountElement = document.getElementById('totalCartDiscount'); // Mrp-Our Price
const totalAmountElement = document.getElementById('totalAmountValue');

function updateQuantity(itemId, change, price, ogPrice) {
    const quantityElement = document.getElementById(`${itemId}Quantity`);
    let quantity = parseInt(quantityElement.innerText);
    quantity += change;
    if (quantity < 1) {
        quantity = 1; 
    }
    quantityElement.innerText = quantity;

    const finalPrice = parseInt(price * quantity);
    const finalOgPrice = parseInt(ogPrice * quantity);

    const productPriceElement = document.querySelector(`.productPrice${itemId}`);
    const productOgPriceElement = document.querySelector(`.productOgPrice${itemId}`);

    productPriceElement.innerHTML = `₹${finalPrice}`;
    productOgPriceElement.innerHTML = `₹${finalOgPrice}`;

    const data = {
        itemId: itemId,
        quantity: quantity,
        finalPrice: finalPrice,
        finalOgPrice: finalOgPrice
    };

    fetch('/updateCartItem', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        totalPriceElement.innerText = `₹${result.totalPrice}`;
        totalOgPriceElement.innerText = `₹${result.totalOgPrice}`;
        totalDiscountElement.innerText = `₹${result.discount}`;
        totalAmountElement.innerText = `₹${result.totalOrderAmount}`
    })
    .catch(error => {
        console.error('Error updating cart:', error);
     });
    }
    



    
// Cart Remove
    function confirmRemove(productId) {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to remove this item from your cart.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove it!',
            backdrop: 'rgba(0,0,0,0.9)',
        }).then((result) => {
            if (result.isConfirmed) {
                removeFromCart(productId);
            }
        });
    }

    async function removeFromCart(productId) {
        try {
            const response = await fetch('/removeFromCart/' + productId, {
                method: 'POST',
            });
    
            if (response.ok) {
                const result = await response.json();
                console.log('Remove from cart response:', result);
    
                if (result.success) {
                    // Wait for the removal to be completed before reloading
                     window.location.reload();
                } else {
                    console.error('Failed to remove item from cart.');
                }
            } else {
                console.error('Failed to remove item from cart:', response.statusText);
            }
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    }
    
 



// Gift Wrap 
    document.addEventListener('DOMContentLoaded', function () {
        var addGiftWrapBtn = document.getElementById('addGiftWrapBtn');
        var totalAmountElement = document.getElementById('totalAmountValue'); 

        if (totalAmountElement) {
            var txtContent = totalAmountElement.textContent.replace('₹', '');
            const total = parseFloat(txtContent);

            if(addGiftWrapBtn){
                addGiftWrapBtn.addEventListener('click',async ()=> {

                    try{
                        const response = await fetch('/applyGift',{
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({  })
                        })
        
                        if(response.ok){
                            const result = await response.json();
        
                            if(result.success){
                                totalAmountElement.innerHTML = `₹${result.totalOrderAmount}`;
                            }
                        }

                    }catch(error){
                        console.error('Error applying gift wrap:',error)
                    }

                })
            }
        }
    });
    




// Coupon Apply
document.addEventListener('DOMContentLoaded',()=>{
    
    document.querySelector('.apply').addEventListener('click', async () => {
        const couponCode = document.getElementById('couponCode').value;
    
        try {
            const response = await fetch('/applyCoupon', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ couponCode }),
            });
    
            if (response.ok) {
                const result = await response.json();
    
                if (result.success) {
                    const couponDiscount = parseFloat(result.discount);
                    const condition = result.condition;
    
                    const couponDiscountElement = document.querySelector('.couponDiscount');
                    couponDiscountElement.textContent = `${couponDiscount}%`;
    
                    const totalAmountElement = document.getElementById('totalAmountValue');
                    const originalPriceElement = document.getElementById('totalCartPrice');
    
                    if (originalPriceElement) {
                        const originalPrice = parseFloat(originalPriceElement.innerText.replace('₹', ''));
    
                        if (!isNaN(couponDiscount) && !isNaN(originalPrice)) {   // isNaN() returns true if a value is Not A Number.
                            const discountedAmount = originalPrice - (originalPrice * (couponDiscount / 100));

                            if(checkCondition(condition,originalPrice)){
                                totalAmountElement.textContent = `₹ ${discountedAmount.toFixed()}`;
                                couponDiscountElement.classList.add('coupongreen')
                            }else{
                                couponDiscountElement.textContent = `Coupon condition not met!`
                                couponDiscountElement.classList.add('couponred')
                            }

                        } else {
                            console.log('Invalid coupon discount or original price');
                        }
                    } else {
                        console.log('Total price element not found');
                    }
                } else {
                    console.log('Invalid coupon code');
                }
    
            } else {
                console.error('Failed to validate coupon:', response.statusText);
            }
        } catch (error) {
            console.error('Error validating coupon:', error);
        }
    });
    
})

function checkCondition(condition, originalPrice) {
    // Extract numeric values from the condition
    const amounts = condition.match(/\d+/g); // amounts is an array with the 2 numbers is condition.

    if (amounts && amounts.length === 2) {
        const minPurchaseAmount = parseFloat(amounts[0]); // takes the first amount of amounts array
        const maxPurchaseAmount = parseFloat(amounts[1]); // takes the second amount of amounts array

        if (!isNaN(minPurchaseAmount) && !isNaN(maxPurchaseAmount)) {
            return originalPrice >= minPurchaseAmount && originalPrice <= maxPurchaseAmount;
        } else {
            console.log('Invalid numeric values in condition');
            return false;
        }
    } else {
        console.log('Invalid condition format');
        return false;
    }
}


