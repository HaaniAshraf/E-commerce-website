document
  .getElementById("profileForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new URLSearchParams(new FormData(this));
    fetch("/profile", {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        Swal.fire(
          "Profile Updated",
          "Your profile has been updated!",
          "success"
        );
      })
      .catch((error) => {
        Swal.fire("Error", "Failed to update profile", "error");
      });
  });