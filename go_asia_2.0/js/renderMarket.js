let allMarkets = [];

document.addEventListener("DOMContentLoaded", function () {
    fetch("data/markets.json")
        .then(response => response.json())
        .then(data => {
            allMarkets = Object.values(data);
            renderMarkets(allMarkets);

            const searchInput = document.getElementById("searchInput");
            searchInput.addEventListener("input", () => {
                const query = searchInput.value.toLowerCase();
                const filtered = allMarkets.filter(market =>
                    market.name.toLowerCase().includes(query) ||
                    market.location.address.toLowerCase().includes(query) ||
                    market.details.specialties.join(", ").toLowerCase().includes(query)
                );
                renderMarkets(filtered);
            });
        })
        .catch(error => console.error("Error loading market data:", error));
});

function renderMarkets(data) {
    const container = document.getElementById("market-list");
    const noResult = document.getElementById("no-result");
    container.innerHTML = "";

    if (data.length === 0) {
        noResult.style.display = "block";
        return;
    } else {
        noResult.style.display = "none";
    }

    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row", "row-cols-1", "row-cols-md-2", "g-3");
    container.appendChild(rowDiv);

    data.forEach(market => {
        const marketCard = document.createElement("div");
        marketCard.classList.add("col");

        marketCard.innerHTML = `
            <a href="market_detail.html?id=${market.sid}" class="text-decoration-none text-dark"> 
                <div class="card h-100 d-flex flex-row" style="border-radius: 12px;">
                    <img src="img/${market.image}" class="img-fluid rounded-start" alt="${market.name}" 
                         style="width: 150px; height: auto; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${market.name}</h5>
                        ${renderGoogleStyleRating(market.details.rating)}
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
