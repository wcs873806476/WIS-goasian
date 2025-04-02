document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const restaurantId = urlParams.get("id"); // 获取 URL 中的 id 参数
    console.log("Restaurant ID:", restaurantId); // 打印出 id 参数

    fetch("data/restaurants.json")
        .then(response => response.json())
        .then(data => {
            console.log("Restaurant Data:", data); // 打印 JSON 数据
            const restaurant = data[restaurantId]; // 获取对应的餐厅数据
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
    const googleMapsUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyDV5CG9qvLYeBPGfZWqRJpgYqa34U_Ld-o&q=${encodeURIComponent(restaurant.name)}`;

    detailContainer.innerHTML = `
        <h1 class="mb-3">${restaurant.name}</h1>
        <p class="mb-3"> ⭐ ${restaurant.details.rating}</p>
        <img src="img/${restaurant.image}" class="img-fluid mb-3" alt="${restaurant.name}">
       
        <p class="mt-4"><strong>Specialties:</strong> ${restaurant.details.specialties.join(", ")}</p>
        <p class="mt-3"><strong>Address:</strong> ${restaurant.location.address}</p>
        <p class="mt-3"><strong>Opening Hours:</strong> ${restaurant.details.opening_hours}</p>
        
        <p class="mt-5"><strong>Location</strong> </p>
        
        <!-- Google Maps 嵌入 -->
        <div class="mt-3">
            <iframe 
                class="w-100" height="450" frameborder="0" style="border:0"
                src="${googleMapsUrl}" allowfullscreen>
            </iframe>
        </div>
        
        <!-- 额外提供跳转到 Google Maps 的链接 -->
        <p class="mt-2">
            <a href="https://www.google.com/maps/search/?q=${encodeURIComponent(restaurant.name)}" target="_blank">
                查看完整地图
            </a>
        </p>
    `;
}
