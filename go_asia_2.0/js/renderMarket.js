let allMarkets = [];

document.addEventListener("DOMContentLoaded", function () {
    fetch("data/markets.json")
        .then(response => response.json())
        .then(data => {
            allMarkets = Object.values(data);
            renderMarkets(allMarkets, "", "name"); // 初始加载

            const searchInput = document.getElementById("searchInput");
            const searchCategory = document.getElementById("searchCategory");

            // 输入时搜索
            searchInput.addEventListener("input", () => {
                const query = searchInput.value.toLowerCase();
                const category = searchCategory.value;

                const filtered = allMarkets.filter(market => {
                    if (category === "name") {
                        return market.name.toLowerCase().includes(query);
                    } else if (category === "specialties") {
                        return market.details.specialties.some(spec =>
                            spec.toLowerCase().includes(query)
                        );
                    } else if (category === "location") {
                        return market.location.address.toLowerCase().includes(query);
                    }
                    return false;
                });

                renderMarkets(filtered, query, category);
            });

            // 切换搜索类别时自动搜索
            searchCategory.addEventListener("change", () => {
                searchInput.dispatchEvent(new Event("input"));
            });
        })
        .catch(error => console.error("Error loading market data:", error));
});

function renderMarkets(data, query = "", category = "name") {
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
        const name = highlight(market.name, query, category === "name");
        const specialties = market.details.specialties
            .map(spec => highlight(spec, query, category === "specialties"))
            .join(", ");
        const address = highlight(market.location.address, query, category === "location");

        const marketCard = document.createElement("div");
        marketCard.classList.add("col");

        marketCard.innerHTML = `
            <a href="market_detail.html?id=${market.sid}" class="text-decoration-none text-dark"> 
                <div class="card h-100 d-flex flex-row" style="border-radius: 12px;">
                    <img src="img/${market.image}" class="img-fluid rounded-start" alt="${market.name}" 
                         style="width: 150px; height: auto; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${name}</h5>
                        ${renderGoogleStyleRating(market.details.rating)}
                        <p class="card-text">${specialties}</p>
                        <p class="text-muted">${address}</p>
                        <p class="text-muted">${market.details.opening_hours}</p>
                    </div>
                </div>
            </a>
        `;
        rowDiv.appendChild(marketCard);
    });
}

// ⭐ 高亮关键词
function highlight(text, query, active) {
    if (!active || !query) return text;
    const regex = new RegExp(`(${escapeRegExp(query)})`, "gi");
    return text.replace(regex, '<span class="bg-warning fw-semibold">$1</span>');
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
