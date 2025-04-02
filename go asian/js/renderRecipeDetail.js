document.addEventListener("DOMContentLoaded", function () {
    // 获取 URL 参数中的 'id'
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get("id"); // 获取 URL 中的 id 参数
    console.log("Recipe ID:", recipeId); // 调试信息

    // 获取菜谱数据并渲染
    fetch("data/recipes.json")
        .then(response => response.json())  // 解析 JSON 数据
        .then(data => {
            console.log("Recipe Data:", data); // 调试信息

            // 根据 ID 获取对应的菜谱对象
            const recipe = data[recipeId];

            // 如果找到了菜谱数据，渲染详情页面，否则显示错误信息
            if (recipe) {
                renderRecipeDetail(recipe);
            } else {
                console.log("Recipe not found:", recipeId);
                document.getElementById("recipe-detail").innerHTML = "<h2>Recipe not found</h2>";
            }
        })
        .catch(error => console.error("Error loading recipe data:", error));  // 错误处理
});

// 渲染菜谱详情的函数
function renderRecipeDetail(recipe) {
    // 确保菜谱数据存在
    if (!recipe) {
        document.getElementById("recipe-detail").innerHTML = "<h2>Recipe not found</h2>";
        return;
    }

    const detailContainer = document.getElementById("recipe-detail");

    // 构建菜谱详情内容
    detailContainer.innerHTML = `
        <h1 class="mb-3">${recipe.name}</h1>
        <img src="img/${recipe.image}" class="img-fluid mb-3" alt="${recipe.name}">
        
        <p class="mt-4"><strong>Ingredients:</strong> ${recipe.ingredients.join(", ")}</p>
        
        <p class="mt-3"><strong>Instructions:</strong></p>
        <p class="mt-2">${recipe.instructions}</p>
        
        <p class="mt-5"><strong>Cooking Video:</strong></p>
        <div class="mt-3">
            <iframe 
                class="w-100" height="450" frameborder="0" style="border:0"
                src="${recipe.media.default_video_embed}" allowfullscreen>
            </iframe>
        </div>
        
        <p class="mt-2">
            <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(recipe.media.video_keywords)}" target="_blank">
                Watch more related videos
            </a>
        </p>
    `;
}
