document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const marketId = urlParams.get("id"); // 获取 URL 中的 id 参数
    console.log("Market ID:", marketId); // 打印出 id 参数

    fetch("data/markets.json")
        .then(response => response.json())
        .then(data => {
            console.log("Market Data:", data); // 打印 JSON 数据
            const market = data[marketId]; // 获取对应的市场数据
            if (market) {
                renderMarketDetail(market);
            } else {
                console.log("Supermarket not found:", marketId);
                document.getElementById("market-detail").innerHTML = "<h2>Supermarket not found</h2>";
            }
        })
        .catch(error => console.error("Error loading market data:", error));
});

function renderMarketDetail(market) {
    if (!market) {
        document.getElementById("market-detail").innerHTML = "<h2>Supermarket not found</h2>";
        return;
    }

    const detailContainer = document.getElementById("market-detail");

    // 生成 Google Maps 嵌入 URL
    const googleMapsUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyDV5CG9qvLYeBPGfZWqRJpgYqa34U_Ld-o&q=${encodeURIComponent(market.name)}`;

    detailContainer.innerHTML = `
        <h1 class="mb-3">${market.name}</h1>
        <p class="mb-3"> ⭐ ${market.details.rating}</p>
        <img src="img/${market.image}" class="img-fluid mb-3" alt="${market.name}">
       
        <p class="mt-4"><strong>Specialties:</strong> ${market.details.specialties.join(", ")}</p>
        <p class="mt-3"><strong>Address:</strong> ${market.location.address}</p>
        <p class="mt-3"><strong>Opening Hours:</strong> ${market.details.opening_hours}</p>
        
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
            <a href="https://www.google.com/maps/search/?q=${encodeURIComponent(market.name)}" target="_blank">
                查看完整地图
            </a>
        </p>
    `;
}
