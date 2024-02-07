async function toggleWishlist(event) {
    event.preventDefault();
    const heart = event.currentTarget.querySelector('.fa-heart');
    const productId = event.currentTarget.getAttribute('data-product-id');
    const isRedColor = heart.classList.contains('redcolor');
    if (productId) {
        try {
            const response = await fetch(`/wishlistToggle/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isRedColor: isRedColor.toString() }),
            });
            if (response.status === 401) {
                window.location.href = '/login';
                return;
            }
            if (response.ok) {
                heart.classList.toggle('redcolor');
                updateWishlistCount();
            } else {
                console.log(`Error toggling wishlist: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
        }
    }
}





async function updateWishlistCount() {
    try {
        const response = await fetch('/wishlist/count');
        if (response.status === 302) {
            window.location.href = '/login';
            return; 
        }
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        const data = await response.json();
        const wishlistCountSpan = document.getElementById('wishlistCount');
        if (wishlistCountSpan) {
            wishlistCountSpan.textContent = data.wishlistCount;
        } else {
            console.log('Null');
        }
    } catch (error) {
        console.error('Error updating wishlist count:', error);
    }
}
updateWishlistCount();
