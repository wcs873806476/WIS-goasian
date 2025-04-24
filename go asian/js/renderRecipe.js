document.addEventListener("DOMContentLoaded", function () {
    fetch("data/recipes.json")
        .then(response => response.json())
        .then(data => renderRecipes(data)) // 
        .catch(error => console.error("Error loading recipe data:", error));
});

function renderRecipes(data) {
    const container = document.getElementById("recipe-list"); 
    container.innerHTML = ""; 

    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row", "row-cols-1", "row-cols-md-2", "g-3"); 
    container.appendChild(rowDiv);

    Object.values(data).forEach(recipe => {
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

        rowDiv.appendChild(recipeCard); 
    });
}
