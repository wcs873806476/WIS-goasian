document.addEventListener("DOMContentLoaded", function () {
    fetch("data/recipes.json")
        .then(response => response.json())
        .then(data => renderRecipes(data)) // 这里改成 renderMarkets
        .catch(error => console.error("Error loading recipe data:", error));
});

function renderRecipes(data) {
    const container = document.getElementById("recipe-list"); // 选择存放卡片的父容器
    container.innerHTML = ""; // 清空已有内容，防止重复加载

    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row", "row-cols-1", "row-cols-md-2", "g-3"); // Bootstrap 自适应网格
    container.appendChild(rowDiv);

    Object.values(data).forEach(recipe => {
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("col-md-3", "mb-3"); // 让每行 4 个菜谱

        recipeCard.innerHTML = `
            <a href="recipe_detail.html?id=${recipe.eid}" class="text-decoration-none text-dark">
               <div class="card h-100" style="min-height: 350px;"> <!-- 设置最小高度 -->
                    <img src="img/${recipe.image}" class="card-img-top" alt="${recipe.name}" 
                    style="width: 100%; height: 200px; object-fit: cover;">
                    <div class="card-body text-center">
                        <h5 class="card-title">${recipe.name}</h5>
                        <p class="text-muted">Click to see more details</p>
                        <a href="recipe_detail.html?id=${recipe.eid}" class="btn" style="background-color: #ff6600; color: white;">View Recipe</a>
                    </div>
               </div>
            </a> 
         `;

        rowDiv.appendChild(recipeCard); // 让菜谱卡片正确加入 `.row`
    });
}
