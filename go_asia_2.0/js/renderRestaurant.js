let restaurantData = [];

document.addEventListener("DOMContentLoaded", function () {
    fetch("data/restaurants.json")
        .then(response => response.json())
        .then(data => {
            restaurantData = Object.values(data);
            renderRestaurants(restaurantData, "", "name");

            const searchInput = document.getElementById("searchInput");
            const searchCategory = document.getElementById("searchCategory");

            searchInput.addEventListener("input", () => {
                const query = searchInput.value.toLowerCase().trim();
                const category = searchCategory.value;

                const filtered = restaurantData.filter(restaurant => {
                    if (category === "name") {
                        return restaurant.name.toLowerCase().includes(query);
                    } else if (category === "specialties") {
                        return restaurant.details.specialties.some(spec =>
                            spec.toLowerCase().includes(query)
                        );
                    } else if (category === "location") {
                        return restaurant.location.address.toLowerCase().includes(query);
                    }
                    return false;
                });

                renderRestaurants(filtered, query, category);
            });

            searchCategory.addEventListener("change", () => {
                searchInput.dispatchEvent(new Event("input"));
            });
        })
        .catch(error => console.error("Error loading restaurant data:", error));
});

// 渲染餐厅卡片
function renderRestaurants(data, query = "", category = "name") {
    const container = document.getElementById("restaurant-list");
    container.innerHTML = "";

    if (data.length === 0) {
        container.innerHTML = `<p class="text-center text-muted">No matching restaurants found.</p>`;
        return;
    }

    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row", "row-cols-1", "row-cols-md-2", "g-3");
    container.appendChild(rowDiv);

    data.forEach(restaurant => {
        const name = highlight(restaurant.name, query, category === "name");
        const specialties = restaurant.details.specialties
            .map(spec => highlight(spec, query, category === "specialties"))
            .join(", ");
        const address = highlight(restaurant.location.address, query, category === "location");

        const restaurantCard = document.createElement("div");
        restaurantCard.classList.add("col");

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

// 高亮关键词函数（与市场页一致）
function highlight(text, query, active) {
    if (!active || !query) return text;
    const regex = new RegExp(`(${escapeRegExp(query)})`, "gi");
    return text.replace(regex, '<span class="bg-warning fw-semibold">$1</span>');
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// 星级渲染
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
