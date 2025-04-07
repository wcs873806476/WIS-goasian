document.addEventListener("DOMContentLoaded", function () {
    // 获取 URL 参数中的 'id'
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get("id");
    console.log("Recipe ID:", recipeId);

    // 获取菜谱数据并渲染
    fetch("data/recipes.json")
        .then(response => response.json())
        .then(data => {
            console.log("Recipe Data:", data);
            const recipe = data[recipeId];

            if (recipe) {
                renderRecipeDetail(recipe);
            } else {
                console.log("Recipe not found:", recipeId);
                document.getElementById("recipe-detail").innerHTML = "<h2>Recipe not found</h2>";
            }
        })
        .catch(error => {
            console.error("Error loading recipe data:", error);
            document.getElementById("recipe-detail").innerHTML = "<h2>Error loading recipe data</h2>";
        });
});

function renderRecipeDetail(recipe) {
    if (!recipe) {
        document.getElementById("recipe-detail").innerHTML = "<h2>Recipe not found</h2>";
        return;
    }

    const detailContainer = document.getElementById("recipe-detail");

    // 渲染基本信息
    detailContainer.innerHTML = `
        <h1 class="mb-3">${recipe.name}</h1>
        <img src="assets/image/${recipe.image}" class="img-fluid mb-3" alt="${recipe.name}">

        <p class="mt-4"><strong>Ingredients:</strong> ${recipe.ingredients.join(", ")}</p>

        <p class="mt-3"><strong>Instructions:</strong></p>
        <p class="mt-2">${recipe.instructions}</p>
    `;

    // 调用 YouTube API 显示视频
    const apiKey = "";
    const query = recipe.media.video_keywords;
    const maxResults = 1;

    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=${maxResults}&q=${encodeURIComponent(query)}&key=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            if (data.items && data.items.length > 0) {
                const videoId = data.items[0].id.videoId;

                detailContainer.innerHTML += `
                    <div class="mt-5">
                        <iframe width="100%" height="450"
                            src="https://www.youtube.com/embed/${videoId}"
                            frameborder="0" allowfullscreen>
                        </iframe>
                        <p class="mt-3">
                            <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(query)}" target="_blank">
                                Watch more related videos on YouTube
                            </a>
                        </p>
                    </div>
                `;
            } else {
                detailContainer.innerHTML += `<p class="mt-4 text-muted">No video found for "${query}".</p>`;
            }
        })
        .catch(err => {
            console.error("YouTube API error:", err);
            detailContainer.innerHTML += `<p class="mt-4 text-danger">Failed to load video.</p>`;
        });
}
