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
            Swal.fire({
              title: "Cancelled!",
              text: "Your Order has been cancelled.",
              icon: "success",
              backdrop: "rgba(0,0,0,0.8)",
            });

            const orderStatusElements = document.querySelectorAll(
              `.order-item-right[data-order-id="${orderId}"] .orderStatus span`
            );
            const updatedOrderStatus = data.updatedOrderStatus || "Cancelled";

            orderStatusElements.forEach((statusElement) => {
              statusElement.style.color = "rgb(249, 57, 57)";
              statusElement.innerText = updatedOrderStatus;
              button.style.display = "none";

              const deliveryDateElement = document.querySelector(
                `.order-item-right[data-order-id="${orderId}"] .deliveryDate`
              );
              deliveryDateElement.style.display = "none";
            });
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
