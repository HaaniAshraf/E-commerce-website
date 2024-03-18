document.addEventListener("DOMContentLoaded", function () {
  const cancelOrderButtons = document.querySelectorAll(".cancelOrder");

  cancelOrderButtons.forEach((button) => {
    button.addEventListener("click", async function () {
      const orderId = button.dataset.orderId;

      const { value: reason } = await Swal.fire({
        title: "Cancel Order",
        input: "text",
        inputPlaceholder: "Enter the reason for cancellation",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, cancel it!",
        backdrop: "rgba(0,0,0,0.8)",
        inputValidator: (value) => {
          if (!value) {
            return "Please enter a reason for cancellation";
          }
        },
      });

      if (reason) {
        try {
          const response = await fetch(`/cancelOrder/${orderId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ reason }),
          });

          const data = await response.json();

          if (data.success) {

            const orderStatus = document.querySelector('.orderStatus span')
            orderStatus.innerText =  "Cancelled"
            orderStatus.style.color = "rgb(249, 57, 57)";
            const deliveryDate = document.querySelector('.deliveryDate')
            deliveryDate.style.display = "none"
            button.style.display = "none";

          } else {
            Swal.fire({
              title: "Error",
              text: "Failed to cancel the order.",
              icon: "error",
              backdrop: "rgba(0,0,0,0.8)",
            });
          }
        } catch (error) {
          console.error("Error in AJAX request:", error);
        }
      }
    });
  });
});
