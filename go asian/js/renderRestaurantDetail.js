document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const restaurantId = urlParams.get("id"); 
    console.log("Restaurant ID:", restaurantId); 

    fetch("data/restaurants.json")
        .then(response => response.json())
        .then(data => {
            console.log("Restaurant Data:", data); 
            const restaurant = data[restaurantId]; 
            if (restaurant) {
                renderRestaurantDetail(restaurant);
            } else {
                console.log("Restaurant not found:", restaurantId);
                document.getElementById("restaurant-detail").innerHTML = "<h2>Restaurant not found</h2>";
            }
        })
        .catch(error => console.error("Error loading restaurant data:", error));
});

function renderRestaurantDetail(restaurant) {
    if (!restaurant) {
        document.getElementById("restaurant-detail").innerHTML = "<h2>Restaurant not found</h2>";
        return;
    }

    const detailContainer = document.getElementById("restaurant-detail");

    // 生成 Google Maps 嵌入 URL
    const googleMapsUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR API&q=${encodeURIComponent(restaurant.name)}`;

    detailContainer.innerHTML = `
        <div class="card mx-auto p-4 shadow" style="max-width: 900px; border-radius: 1rem;">
            <div class="row g-4 align-items-center">
                <div class="col-md-6 text-center">
                    <img src="img/${restaurant.image}" class="detail-img" alt="${restaurant.name}">
                </div>
                <div class="col-md-6">
                    <h2 class="fw-bold mb-2">${restaurant.name}</h2>
                    ${renderGoogleStyleRating(restaurant.details.rating)}
                    <p class="mt-3"><strong>Specialties:</strong> ${restaurant.details.specialties.join(", ")}</p>
                    <p><strong>Address:</strong> ${restaurant.location.address}</p>
                    <p><strong>Opening Hours:</strong> ${restaurant.details.opening_hours}</p>
                </div>
            </div>

            <div class="mt-5 text-center">
                <h5 class="mb-3">📍 Location</h5>
                <div class="d-flex justify-content-center">
                    <iframe 
                        src="${googleMapsUrl}" 
                        class="map-iframe" 
                        allowfullscreen 
                        loading="lazy">
                    </iframe>
                </div>
                <a href="https://www.google.com/maps/search/?q=${encodeURIComponent(restaurant.name)}" 
                   target="_blank" 
                   class="btn btn-outline-primary mt-3">
                   View on Google Maps
                </a>
            </div>

            <div class="text-center mt-4">
                <button class="btn btn-warning px-4 py-2 fw-bold" onclick="history.back()">✕ CLOSE</button>
            </div>
        </div>
    `;
}

// ⭐ 星星评分渲染函数
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
        <div class="d-flex align-items-center gap-2 mb-2">
            <span class="fs-5 fw-bold text-dark">${score.toFixed(1)}</span>
            <span>${stars}</span>
        </div>
    `;
}
