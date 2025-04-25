let restaurantData = []; // 保存原始数据，供搜索过滤使用

document.addEventListener("DOMContentLoaded", function () {
    fetch("data/restaurants.json")
        .then(response => response.json())
        .then(data => {
            restaurantData = Object.values(data); // 存储数据到全局变量
            renderRestaurants(restaurantData);     // 初始渲染所有餐厅
        })
        .catch(error => console.error("Error loading restaurant data:", error));

    // 添加搜索监听器
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const keyword = this.value.toLowerCase().trim();
            const filtered = restaurantData.filter(restaurant =>
                restaurant.name.toLowerCase().includes(keyword) ||
                restaurant.details.specialties.join(", ").toLowerCase().includes(keyword)
            );
            renderRestaurants(filtered); // 重新渲染筛选后的餐厅
        });
    }
});

function renderRestaurants(data) {
    const container = document.getElementById("restaurant-list");
    container.innerHTML = "";

    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row", "row-cols-1", "row-cols-md-2", "g-3");
    container.appendChild(rowDiv);

    if (data.length === 0) {
        container.innerHTML = `<p class="text-center text-muted">No matching restaurants found.</p>`;
        return;
    }

    data.forEach(restaurant => {
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
