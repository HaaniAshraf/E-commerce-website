document.addEventListener('click', async function (event) {
    const heart = event.target.closest('.fa-heart');

    if (heart) {
        if (heart.classList.contains('redcolor')) {
            heart.classList.remove('redcolor');

            const productId = heart.closest('.btn-action').getAttribute('data-product-id');

            // Check if productId is defined and not an empty string before making the fetch request
            if (productId && productId.trim() !== '') {
                try {
                    const response = await fetch(`/removeFromWishlist/${productId}`, {
                        method: 'POST',
                    });

                    if (!response.ok) {
                        console.log('Error removing product from wishlist:', response.statusText);
                    }
                } catch (error) {
                    console.log('Error removing product from wishlist:', error);
                }
            } else {
                console.log('ProductId is not defined or is an empty string');
            }
        } else {
            heart.classList.add('redcolor');
        }
    }
});
