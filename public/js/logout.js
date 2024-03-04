async function logout() {
    try {
        const response = await fetch('/logout', { method: 'POST' });
        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                showLogoutConfirmation();
            } else {
                console.error('Error logging out:', result.message);
            }
        } else {
            console.error('Server error:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}
function showLogoutConfirmation() {
Swal.fire({
title: "Are you sure?",
text: "You are about to log out.",
icon: "warning",
showCancelButton: true,
confirmButtonColor: "#3085d6",
cancelButtonColor: "#d33",
confirmButtonText: "Yes, logout!",
backdrop: 'rgba(0,0,0,0.9)',
customClass: {
    container: 'custom-swal-container',
    popup: 'custom-swal-popup',
    title: 'custom-swal-title',
    text: 'custom-swal-text',
    confirmButton: 'custom-swal-confirm-button',
    cancelButton: 'custom-swal-cancel-button',
    backdrop: 'rgba(0,0,0,0.9)',
}
}).then((result) => {
if (result.isConfirmed) {
    Swal.fire({
        title: "Logged Out!",
        text: "You have been logged out.",
        icon: "success",
        backdrop: 'rgba(0,0,0,0.9)',
        customClass: {
            container: 'custom-swal-container',
            popup: 'custom-swal-popup',
            title: 'custom-swal-title',
            text: 'custom-swal-text',
            confirmButton: 'custom-swal-confirm-button',
            backdrop: 'rgba(0,0,0,0.9)',
        }
    }).then(() => {
        window.location.href = "/login";
    });
}
});
}