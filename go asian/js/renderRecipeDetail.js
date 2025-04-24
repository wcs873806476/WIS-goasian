document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get("id");

    fetch("data/recipes.json")
        .then(response => response.json())
        .then(data => {
            const recipe = data[recipeId];
            if (recipe) {
                renderRecipeDetail(recipe);
                loadYoutubeVideo(recipe.media.video_keywords);
            } else {
                document.getElementById("recipe-detail").innerHTML = "<h2 class='text-center mt-5'>Recipe not found</h2>";
            }
        })
        .catch(error => {
            console.error("Error loading recipe data:", error);
            document.getElementById("recipe-detail").innerHTML = "<h2>Error loading recipe data</h2>";
        });
});

function renderRecipeDetail(recipe) {
    const detailContainer = document.getElementById("recipe-detail");
    const steps = recipe.instructions.split(/\d+\.\s/).filter(Boolean);

    detailContainer.innerHTML = `
        <div class="card mx-auto p-4 shadow" style="max-width: 900px; border-radius: 1rem;">
            <div class="row g-4 align-items-center">
                <div class="col-md-6 text-center">
                    <img src="img/${recipe.image}" class="detail-img mb-3" alt="${recipe.name}">
                </div>
                <div class="col-md-6 text-start">
                    <h2 class="fw-bold mb-2">${recipe.name}</h2>
                </div>
            </div>

            <div class="mt-4">
                <p><strong>Ingredients:</strong></p>
                <ul>
                    ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join("")}
                </ul>
            </div>

            <div class="mt-4">
                <p><strong>Instructions:</strong></p>
                <ol class="ps-3">
                    ${steps.map(step => `<li>${step.trim()}</li>`).join("")}
                </ol>
            </div>

            <div id="video-section" class="mt-5 text-center"></div>

            <div class="text-center mt-4">
                <button class="btn btn-warning px-4 py-2 fw-bold" onclick="history.back()">✕ CLOSE</button>
            </div>
        </div>
    `;
}

// 加载 YouTube 视频
function loadYoutubeVideo(query) {
    const apiKey = ""; // ← 输入你的 YouTube API Key
    const maxResults = 1;

    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=${maxResults}&q=${encodeURIComponent(query)}&key=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            const videoSection = document.getElementById("video-section");
            if (data.items && data.items.length > 0) {
                const videoId = data.items[0].id.videoId;
                videoSection.innerHTML = `
                    <iframe width="100%" height="450"
                        src="https://www.youtube.com/embed/${videoId}"
                        frameborder="0" allowfullscreen class="rounded shadow-sm">
                    </iframe>
                    <p class="mt-3">
                        <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(query)}" target="_blank">
                            Watch more related videos on YouTube
                        </a>
                    </p>
                `;
            } else {
                videoSection.innerHTML = `<p class="mt-3 text-muted">No video found for "${query}".</p>`;
            }
        })
        .catch(err => {
            console.error("YouTube API error:", err);
            const videoSection = document.getElementById("video-section");
            videoSection.innerHTML = `<p class="mt-3 text-danger">Failed to load video.</p>`;
        });
}
