// Popular Product
document.addEventListener("DOMContentLoaded", function () {
  // Fetch most popular product data from the API
  fetch("/popularProduct")
    .then((response) => response.json())
    .then((data) => {
      const popularProductElement = document.querySelector(".popProduct h4");
      const productImageElement = document.querySelector(".popProduct img");
      const countElement = document.querySelector(".popProduct span");

      if (data.productInfo) {
        const productName = data.productInfo.name;
        const imageUrls = data.productInfo.imageUrls;
        const productImageSrc = imageUrls.length > 0 ? imageUrls[0] : "";
        const count = data.count || 0;

        productImageElement.src = productImageSrc;
        productImageElement.alt = productName;
        popularProductElement.textContent = `${productName}`;
        countElement.textContent = `${count}`;
      } else {
        popularProductElement.textContent = "No popular product found";
        countElement.textContent = "";
        productImageElement.src = "";
        productImageElement.alt = "";
      }
    })
    .catch((error) =>
      console.error("Error fetching most popular product:", error)
    );
});


// Most Ordered Product
document.addEventListener("DOMContentLoaded", function () {
  // Fetch most ordered product data from the API
  fetch("/mostOrderedProduct")
    .then((response) => response.json())
    .then((data) => {
      const mostOrderedProductElement = document.querySelector(".orderProduct p");
      const productImageElement = document.querySelector(".orderProduct img");
      const productNameElement = document.querySelector(".orderProduct h4");
      const countElement = document.querySelector(".orderProduct span");

      if (data.productInfo) {
        const productName = data.productInfo.name;
        const productImageSrc = data.productInfo.imageUrls[0];
        const totalOrders = data.totalOrders || 0;

        productImageElement.src = productImageSrc;
        productImageElement.alt = productName;
        productNameElement.textContent = productName;
        countElement.textContent = `${totalOrders}`;
      } else {
        mostOrderedProductElement.textContent = "No most ordered product found";
        countElement.textContent = "";
        productImageElement.src = "";
        productImageElement.alt = "";
      }
    })
    .catch((error) =>
      console.error("Error fetching most ordered product:", error)
    );
});


// Most Active User
document.addEventListener("DOMContentLoaded", function () {
  // Fetch most active user data from the API
  fetch("/mostActiveUser")
    .then((response) => response.json())
    .then((data) => {
      const mostActiveUserElement = document.querySelector(".activeAll h3");
      const userIdElement = document.querySelector(".activeAll h5");
      const totalOrdersElement = document.querySelector(".activeAll span");

      if (data.userInfo) {
        const totalOrders = data.totalOrders || 0;

        mostActiveUserElement.textContent = `${data.userInfo.name}`;
        userIdElement.textContent = `UserId - ${data.userInfo._id}`;
        totalOrdersElement.textContent = `No : of Orders - ${totalOrders}`;
      } else {
        mostActiveUserElement.textContent = "No active user found";
        userIdElement.textContent = "";
        totalOrdersElement.textContent = "";
      }
    })
    .catch((error) => console.error("Error fetching most active user:", error));
});


// Recent Updates
document.addEventListener("DOMContentLoaded", function () {
  fetch("/recentUpdates")
    .then((response) => response.json())
    .then((data) => {
      // Update the HTML content with the fetched data
      const recentUpdatesList = document.getElementById("recentUpdatesList");
      recentUpdatesList.innerHTML = "";

      // Function to create list items
      const createListItem = (value) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `${value}`;
        return listItem;
      };

      // Add items to the list
      recentUpdatesList.appendChild(
        createListItem(
          `${data.latestSignup.name} signed up at ${new Date(
            data.latestSignup.createdAt
          ).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}`
        )
      );
      recentUpdatesList.appendChild(
        createListItem(`${data.pendingOrders} orders pending to be delivered.`)
      );
      recentUpdatesList.appendChild(
        createListItem(
          `New product ${data.latestProduct.name} added to ${data.latestProduct.category}`
        )
      );
    })
    .catch((error) => console.error("Error fetching recent updates:", error));
});
