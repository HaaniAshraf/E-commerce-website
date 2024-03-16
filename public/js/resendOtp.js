document.querySelector(".resend").addEventListener("click", function () {
  fetch("/resendOtp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  })
    .then((response) => response.json())
    .then((data) => {
      alert("OTP resent successfully!");
    })
    .catch((error) => {
      console.error("Error during resend:", error);
    });
});
