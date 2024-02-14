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
                } else {
                    console.error('Failed to add to cart');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        // Check if the cartIcon element exists before accessing its classList
        const cartIcon = document.getElementById('cartIcon');
        if (cartIcon && cartIcon.classList.contains('productInCart')) {
            cartIcon.classList.add('orangeColor');
        }
    });
});



function updateQuantity(itemId, change) {
        const quantityElement = document.getElementById(`${itemId}Quantity`);
        let quantity = parseInt(quantityElement.innerText);
        quantity += change;
        if (quantity < 1) {
            quantity = 1; 
        }
        quantityElement.innerText = quantity;
    }


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
    