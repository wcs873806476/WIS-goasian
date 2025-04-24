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
                        ${renderGoogleStyleRating(restaurant.details.rating)}
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

// ⭐ 星级渲染函数
function renderGoogleStyleRating(score) {
    const fullStar = '<i class="bi bi-star-fill text-warning"></i>';
    const halfStar = '<i class="bi bi-star-half text-warning"></i>';
    const emptyStar = '<i class="bi bi-star text-warning"></i>';

    let full = Math.floor(score);
    const decimal = score - full;

    let half = false;
    if (decimal >= 0.75) {
        full += 1;
    } else if (decimal >= 0.25) {
        half = true;
    }

    const empty = 5 - full - (half ? 1 : 0);

    let stars = fullStar.repeat(full);
    if (half) stars += halfStar;
    stars += emptyStar.repeat(empty);

    return `
        <div class="d-flex align-items-center gap-1 mb-1">
            <span class="fw-semibold text-dark">${score.toFixed(1)}</span>
            <span>${stars}</span>
        </div>
    `;
}
