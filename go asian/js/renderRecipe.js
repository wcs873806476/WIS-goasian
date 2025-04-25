let allRecipes = []; // 保存所有菜谱数据

document.addEventListener("DOMContentLoaded", function () {
    // 1. 加载菜谱数据
    fetch("data/recipes.json")
        .then(response => response.json())
        .then(data => {
            allRecipes = Object.values(data); // 存储所有菜谱数据
            renderRecipes(allRecipes); // 初次渲染所有菜谱

            // 2. 获取搜索框元素并监听输入事件
            const searchInput = document.getElementById("searchInput");
            searchInput.addEventListener("input", function () {
                const query = searchInput.value.toLowerCase(); // 获取输入框中的查询文本
                filterAndRenderRecipes(query); // 根据查询进行过滤并渲染
            });
        })
        .catch(error => console.error("Error loading recipe data:", error)); // 错误处理
});

// 3. 根据查询过滤并渲染菜谱
function filterAndRenderRecipes(query) {
    // 4. 根据查询关键词过滤菜谱
    const filteredRecipes = allRecipes.filter(recipe =>
        recipe.name.toLowerCase().includes(query) || // 按名称过滤
        (recipe.description && recipe.description.toLowerCase().includes(query)) // 按描述过滤
    );

    renderRecipes(filteredRecipes); // 渲染过滤后的菜谱
}

// 5. 渲染菜谱
function renderRecipes(data) {
    const container = document.getElementById("recipe-list");
    const noResult = document.getElementById("no-result");
    container.innerHTML = ""; // 清空当前菜谱列表

    // 6. 如果没有匹配的结果，显示“没有结果”的信息
    if (data.length === 0) {
        noResult.style.display = "block"; // 显示提示信息
    } else {
        noResult.style.display = "none"; // 隐藏提示信息
    }

    // 7. 创建新的行容器来渲染菜谱卡片
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row", "row-cols-1", "row-cols-md-2", "g-3");
    container.appendChild(rowDiv);

    // 8. 渲染每个菜谱的卡片
    data.forEach(recipe => {
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("col-md-3", "mb-3");

        recipeCard.innerHTML = `
            <a href="recipe_detail.html?id=${recipe.eid}" class="text-decoration-none text-dark">
               <div class="card h-100" style="min-height: 350px;">
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

        rowDiv.appendChild(recipeCard); // 将卡片添加到行容器中
    });
}
