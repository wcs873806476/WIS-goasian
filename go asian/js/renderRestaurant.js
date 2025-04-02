document.addEventListener("DOMContentLoaded", function () {
    fetch("data/restaurants.json")
        .then(response => response.json())
        .then(data => renderRestaurants(data))
        .catch(error => console.error("Error loading restaurant data:", error));
});

function renderRestaurants(data) {
    const container = document.getElementById("restaurant-list"); // 选择存放卡片的父容器
    container.innerHTML = ""; // 清空已有内容

    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row", "row-cols-1", "row-cols-md-2", "g-3"); // Bootstrap 自适应网格
    container.appendChild(rowDiv);

    Object.values(data).forEach(restaurant => {
        const restaurantCard = document.createElement("div");
        restaurantCard.classList.add("col");

        restaurantCard.innerHTML = `
            <a href="restaurant_detail.html?id=${restaurant.rid}" class="text-decoration-none text-dark">
                <div class="card h-100 d-flex flex-row">
                    <img src="img/${restaurant.image}" class="img-fluid" alt="${restaurant.name}" 
                    style="width: 150px; height: auto; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${restaurant.name}</h5>
                        <p class="text-muted">⭐ ${restaurant.details.rating}</p>
                        <p class="card-text">${restaurant.details.specialties.join(", ")}</p>
                        <p class="text-muted">${restaurant.location.address}</p>
                        <p class="text-muted">${restaurant.details.opening_hours}</p>
                    </div>
                </div>
            </a>
        `;

        rowDiv.appendChild(restaurantCard);
    });
}
