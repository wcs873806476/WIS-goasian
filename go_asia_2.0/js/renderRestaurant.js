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
    const searchCategory = document.getElementById("searchCategory");

    // 监听搜索框的输入事件
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const keyword = this.value.toLowerCase().trim();
            const category = searchCategory.value;

            const filtered = restaurantData.filter(restaurant => {
                if (category === "name") {
                    return restaurant.name.toLowerCase().includes(keyword);
                } else if (category === "specialties") {
                    return restaurant.details.specialties.some(spec =>
                        spec.toLowerCase().includes(keyword)
                    );
                } else if (category === "location") {
                    return restaurant.location.address.toLowerCase().includes(keyword);
                }
                return false;
            });

            renderRestaurants(filtered, keyword, category); // 重新渲染筛选后的餐厅
        });
    }

    // 当选择类别变化时，触发搜索框的输入事件
    if (searchCategory) {
        searchCategory.addEventListener("change", () => {
            searchInput.dispatchEvent(new Event("input"));
        });
    }
});

// 渲染餐厅列表
function renderRestaurants(data, query = "", category = "name") {
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
        const name = highlight(restaurant.name, query, category === "name");
        const specialties = restaurant.details.specialties
            .map(spec => highlight(spec, query, category === "specialties"))
            .join(", ");
        const address = highlight(restaurant.location.address, query, category === "location");

        const restaurantCard = document.createElement("div");
        restaurantCard.classList.add("col");

        // 渲染每个餐厅卡片
        restaurantCard.innerHTML = `
            <a href="restaurant_detail.html?id=${restaurant.rid}" class="text-decoration-none text-dark">
                <div class="card h-100 d-flex flex-row" style="border-radius: 12px;">
                    <img src="img/${restaurant.image}" class="img-fluid rounded-start" alt="${restaurant.name}" 
                    style="width: 150px; height: auto; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${name}</h5>
                        ${renderGoogleStyleRating(restaurant.details.rating)}
                        <p class="card-text">${specialties}</p>
                        <p class="text-muted">${address}</p>
                        <p class="text-muted">${restaurant.details.opening_hours}</p>
                    </div>
                </div>
            </a>
        `;

        rowDiv.appendChild(restaurantCard);
    });
}

// ⭐ 高亮关键词（统一使用 <mark>）
function highlight(text, query, active) {
    if (!active || !query) return text;
    const regex = new RegExp(`(${escapeRegExp(query)})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// 星级渲染函数
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
