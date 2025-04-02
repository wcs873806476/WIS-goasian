document.addEventListener("DOMContentLoaded", function () {
    fetch("data/markets.json") // 这里改成 markets.json
        .then(response => response.json())
        .then(data => renderMarkets(data)) // 这里改成 renderMarkets
        .catch(error => console.error("Error loading market data:", error));
});

function renderMarkets(data) {
    const container = document.getElementById("market-list"); // 选择存放卡片的父容器
    container.innerHTML = ""; // 清空已有内容

    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row", "row-cols-1", "row-cols-md-2", "g-3"); // Bootstrap 自适应网格
    container.appendChild(rowDiv);

    Object.values(data).forEach(market => { // 把 restaurant 改成 market
        const marketCard = document.createElement("div");
        marketCard.classList.add("col");

        marketCard.innerHTML = `
            <a href="market_detail.html?id=${market.sid}" class="text-decoration-none text-dark"> 
                <div class="card h-100 d-flex flex-row">
                    <img src="img/${market.image}" class="img-fluid" alt="${market.name}" 
                    style="width: 150px; height: auto; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${market.name}</h5>
                        <p class="text-muted">⭐ ${market.details.rating}</p>
                        <p class="card-text">${market.details.specialties.join(", ")}</p>
                        <p class="text-muted">${market.location.address}</p>
                        <p class="text-muted">${market.details.opening_hours}</p>
                    </div>
                </div>
            </a>
        `;

        rowDiv.appendChild(marketCard);
    });
}
