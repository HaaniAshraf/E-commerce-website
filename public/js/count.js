// Wishlist & Cart Counts
document.addEventListener('DOMContentLoaded', () => {
    // Fetch and update wishlist count
    fetch('/wishlist/count')
        .then(response => response.json())
        .then(data => {
            const wishlistCountSpan = document.querySelector('.wishlist-count');
            if (wishlistCountSpan) {
                wishlistCountSpan.textContent = data.wishlistCount;
            }
        })
        .catch(error => console.error('Error fetching wishlist count:', error));

    // Fetch and update cart count
    fetch('/cart/count')
        .then(response => response.json())
        .then(data => {
            const cartCountSpan = document.querySelector('.cart-count');
            if (cartCountSpan) {
                cartCountSpan.textContent = data.cartCount;
            }
        })
        .catch(error => console.error('Error fetching cart count:', error));
});
