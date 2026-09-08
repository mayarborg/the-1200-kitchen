/* ==========================================================================
   RECIPE PAGE
   Reads ?id= from the address bar and renders that recipe.
   Also writes the page title, meta description and Recipe structured data
   so each recipe is a proper, indexable page in its own right.
   ========================================================================== */
(function () {
  "use strict";

  const root = document.getElementById("recipe-root");
  if (!root) return;

  const id = new URLSearchParams(location.search).get("id");
  const recipe = id ? TK.getRecipe(id) : null;
  let servings = recipe ? recipe.servings : 1;

  /* ---------- Not found -------------------------------------------- */
  if (!recipe) {
    root.innerHTML =
      '<div class="wrap" style="padding-block:4rem 6rem">' +
        '<div class="empty">' +
          "<h1>That recipe isn&rsquo;t here</h1>" +
          "<p>The link may be out of date, or the recipe may have been renamed. " +
          "Everything currently in the kitchen is on the recipes page.</p>" +
          '<div class="btn-row" style="justify-content:center">' +
            '<a class="btn btn-primary" href="recipes.html">Browse all recipes</a>' +
            '<a class="btn btn-secondary" href="index.html">Go home</a>' +
          "</div>" +
        "</div>" +
      "</div>";
    document.title = "Recipe not found — The 1,200 Kitchen";
    return;
  }

  /* ---------- Head ------------------------------------------------- */
  function setHead() {
    document.title = recipe.name + " — The 1,200 Kitchen";
    const desc = recipe.description + " " + TK.kcal(recipe) + " kcal per serving.";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", desc);
    const og = document.querySelector('meta[property="og:title"]');
    if (og) og.setAttribute("content", recipe.name + " — The 1,200 Kitchen");

    /* Recipe schema. Search engines use this to show cooking time and
       nutrition directly in results. */
    const schema = {
      "@context": "https://schema.org",
      "@type": "Recipe",
      "name": recipe.name,
      "description": recipe.description,
      "image": [new URL(recipe.image, location.href).href],
      "recipeCategory": recipe.category,
      "recipeYield": recipe.servings + " serving" + (recipe.servings === 1 ? "" : "s"),
      "prepTime": "PT" + recipe.prepTime + "M",
      "cookTime": "PT" + recipe.cookTime + "M",
      "totalTime": "PT" + TK.totalTime(recipe) + "M",
      "keywords": (recipe.tags || []).join(", "),
      "recipeIngredient": recipe.ingredients.map(function (i) {
        const line = TK.ingredientLine(i, 1);
        return (line.amount === "to taste" ? "" : line.amount + " ") + line.item;
      }),
      "recipeInstructions": recipe.method.map(function (step, i) {
        return { "@type": "HowToStep", "position": i + 1, "text": step };
      }),
      "nutrition": {
        "@type": "NutritionInformation",
        "servingSize": recipe.servingNote || "1 serving",
        "calories": recipe.nutrition.calories + " kcal",
        "proteinContent": recipe.nutrition.protein + " g",
        "carbohydrateContent": recipe.nutrition.carbs + " g",
        "fatContent": recipe.nutrition.fat + " g",
        "fiberContent": (recipe.nutrition.fibre || 0) + " g"
      }
    };
    if (recipe.dietary && recipe.dietary.indexOf("Vegetarian") !== -1) {
      schema.suitableForDiet = "https://schema.org/VegetarianDiet";
    }
    const tag = document.createElement("script");
    tag.type = "application/ld+json";
    tag.textContent = JSON.stringify(schema);
    document.head.appendChild(tag);
  }

  /* ---------- Pieces ----------------------------------------------- */
  function statusBadge() {
    return recipe.nutritionStatus === "verified"
      ? '<span class="badge badge-verified">Verified nutrition</span>'
      : '<span class="badge badge-estimated">Estimated nutrition</span>';
  }

  function nutritionBlock() {
    const n = recipe.nutrition;
    return (
      '<div class="recipe-nutrition">' +
        '<div class="recipe-nutrition-head">' +
          "<h2>Per serving</h2>" + statusBadge() +
        "</div>" +
        '<div class="nut-strip">' +
          cell(TK.kcal(recipe), "kcal", true) +
          cell(TK.approx(recipe, n.protein) + " g", "Protein") +
          cell(TK.approx(recipe, n.carbs) + " g", "Carbs") +
          cell(TK.approx(recipe, n.fat) + " g", "Fat") +
        "</div>" +
        (n.fibre ? '<div class="nut-strip" style="grid-template-columns:1fr;border-top:0">' +
          cell(TK.approx(recipe, n.fibre) + " g", "Fibre") + "</div>" : "") +
        (recipe.nutritionNote
          ? '<p class="nutrition-note">' + TK.esc(recipe.nutritionNote) + "</p>"
          : '<p class="nutrition-note">' +
            (recipe.nutritionStatus === "verified"
              ? "Taken from the product packaging."
              : "Estimated from generic ingredient values. Check your own labels for exact figures.") +
            "</p>") +
      "</div>"
    );
  }

  function cell(value, label, primary) {
    return '<div class="nut-cell' + (primary ? " nut-cell-primary" : "") + '">' +
      '<span class="nut-value">' + value + "</span>" +
      '<span class="nut-label">' + label + "</span></div>";
  }

  function ingredientsHtml() {
    const factor = servings / recipe.servings;
    return recipe.ingredients.map(function (ing) {
      const line = TK.ingredientLine(ing, factor);
      return "<li>" +
        '<span class="ingredient-qty">' + TK.esc(line.amount) + "</span>" +
        "<span>" + TK.esc(line.item) +
          (line.note ? ' <span class="ingredient-note">' + TK.esc(line.note) + "</span>" : "") +
        "</span></li>";
    }).join("");
  }

  function related() {
    const list = TK.allRecipes()
      .filter(function (r) { return r.id !== recipe.id && r.category === recipe.category; })
      .slice(0, 3);
    while (list.length < 3) {
      const extra = TK.allRecipes().filter(function (r) {
        return r.id !== recipe.id && list.indexOf(r) === -1;
      })[0];
      if (!extra) break;
      list.push(extra);
    }
    if (!list.length) return "";
    return (
      '<section class="band no-print"><div class="wrap">' +
        '<div class="section-head"><h2>More from the kitchen</h2>' +
        '<a class="section-link" href="recipes.html">All recipes &rarr;</a></div>' +
        '<div class="grid grid-cards">' + list.map(function (r) { return TK.recipeCard(r); }).join("") + "</div>" +
      "</div></section>"
    );
  }

  /* ---------- Render ------------------------------------------------ */
  function render() {
    const t = TK.totalTime(recipe);
    const quick = recipe.kind === "quick";

    root.innerHTML =
      '<div class="wrap">' +
        '<nav aria-label="Breadcrumb" class="no-print" style="padding-top:1.5rem;font-size:.875rem">' +
          '<a href="recipes.html">Recipes</a> <span class="muted" aria-hidden="true">/</span> ' +
          '<a href="recipes.html?category=' + encodeURIComponent(recipe.category) + '">' +
          TK.esc(recipe.category) + "</a>" +
        "</nav>" +

        '<div class="recipe-hero">' +
          "<div>" +
            '<div class="badge-row" style="margin-bottom:1rem">' +
              '<span class="badge badge-category">' + TK.esc(recipe.category) + "</span>" +
              (quick ? '<span class="badge badge-quick">Quick entry</span>' : "") +
              (recipe.dietary || []).map(function (d) {
                return '<span class="badge badge-diet">' + TK.esc(d) + "</span>";
              }).join("") +
            "</div>" +
            '<h1 class="recipe-title">' + TK.esc(recipe.name) + "</h1>" +
            '<p class="recipe-lead">' + TK.esc(recipe.description) + "</p>" +
            '<p class="meta-row">' +
              "<span><strong>" + recipe.prepTime + " min</strong> prep</span>" +
              (recipe.cookTime ? "<span><strong>" + recipe.cookTime + " min</strong> cook</span>" : "") +
              "<span><strong>" + TK.timeLabel(t) + "</strong> total</span>" +
              "<span><strong>" + recipe.servings + "</strong> serving" + (recipe.servings === 1 ? "" : "s") + "</span>" +
              "<span><strong>" + TK.esc(recipe.difficulty) + "</strong></span>" +
            "</p>" +
            (recipe.servingNote
              ? '<p class="small muted">One serving is ' + TK.esc(recipe.servingNote) + ".</p>"
              : "") +

            nutritionBlock() +

            '<div class="btn-row no-print">' +
              '<button type="button" class="btn btn-primary js-add-day" data-id="' + TK.esc(recipe.id) + '">Add to my day</button>' +
              '<button type="button" class="btn btn-olive" id="add-grocery">Add to grocery list</button>' +
              '<button type="button" class="btn btn-secondary" id="fav-btn" aria-pressed="false"></button>' +
              '<button type="button" class="btn btn-secondary" id="print-recipe">Print recipe</button>' +
            "</div>" +
          "</div>" +

          '<div class="recipe-hero-media">' +
            '<img src="' + TK.esc(recipe.image) + '" alt="' + TK.esc(recipe.imageAlt) + '" width="800" height="600">' +
          "</div>" +
        "</div>" +

        (quick ? "" :
          '<div class="serving-control no-print">' +
            "<span><strong>Servings</strong></span>" +
            '<div class="serving-stepper">' +
              '<button type="button" class="icon-btn" id="serv-down" aria-label="Fewer servings">&minus;</button>' +
              '<span class="serving-count" id="serv-count" role="status" aria-live="polite">' + servings + "</span>" +
              '<button type="button" class="icon-btn" id="serv-up" aria-label="More servings">+</button>' +
            "</div>" +
            '<div class="chip-set">' +
              [1, 2, 4].map(function (n) {
                return '<button type="button" class="chip js-serv-preset" data-n="' + n + '">' +
                  n + " serving" + (n === 1 ? "" : "s") + "</button>";
              }).join("") +
            "</div>" +
            '<p class="serving-note">Ingredient amounts scale. The nutrition per serving stays the same.</p>' +
          "</div>") +

        '<div class="recipe-columns">' +
          "<div>" +
            "<h2>Ingredients</h2>" +
            '<p class="small muted print-only" id="print-servings">Makes ' + servings + " servings</p>" +
            '<ul class="ingredient-list" id="ingredient-list">' + ingredientsHtml() + "</ul>" +
          "</div>" +
          "<div>" +
            (recipe.method.length
              ? "<h2>Method</h2><ol class=\"method-list\">" +
                recipe.method.map(function (s) { return "<li>" + TK.esc(s) + "</li>"; }).join("") + "</ol>"
              : "<h2>How to serve it</h2><p>" + TK.esc(recipe.description) +
                "</p><p class=\"muted\">This is a simple entry rather than a full recipe &mdash; " +
                "it is here so it can be counted in your day.</p>") +
            '<div class="print-footer print-only">' +
              "The 1,200 Kitchen &mdash; " + TK.esc(recipe.name) + " &mdash; " +
              TK.kcal(recipe) + " kcal per serving, " +
              TK.approx(recipe, recipe.nutrition.protein) + " g protein, " +
              TK.approx(recipe, recipe.nutrition.carbs) + " g carbs, " +
              TK.approx(recipe, recipe.nutrition.fat) + " g fat." +
            "</div>" +
          "</div>" +
        "</div>" +
      "</div>" +
      related();

    wire();
  }

  function refreshIngredients() {
    document.getElementById("ingredient-list").innerHTML = ingredientsHtml();
    document.getElementById("serv-count").textContent = servings;
    const ps = document.getElementById("print-servings");
    if (ps) ps.textContent = "Makes " + servings + " serving" + (servings === 1 ? "" : "s");
    document.querySelectorAll(".js-serv-preset").forEach(function (b) {
      b.classList.toggle("is-on", Number(b.getAttribute("data-n")) === servings);
    });
  }

  function setServings(n) {
    servings = Math.max(1, Math.min(24, n));
    refreshIngredients();
  }

  function updateFavButton() {
    const btn = document.getElementById("fav-btn");
    if (!btn) return;
    const on = TK.isFavourite(recipe.id);
    btn.textContent = on ? "Saved to favourites" : "Save to favourites";
    btn.setAttribute("aria-pressed", on ? "true" : "false");
  }

  function wire() {
    const up = document.getElementById("serv-up");
    if (up) {
      up.addEventListener("click", function () { setServings(servings + 1); });
      document.getElementById("serv-down").addEventListener("click", function () { setServings(servings - 1); });
      document.querySelectorAll(".js-serv-preset").forEach(function (b) {
        b.addEventListener("click", function () { setServings(Number(b.getAttribute("data-n"))); });
      });
      refreshIngredients();
    }

    document.getElementById("add-grocery").addEventListener("click", function () {
      TK.addRecipeToGrocery(recipe.id, servings);
      TK.toast("Ingredients for " + servings + " serving" + (servings === 1 ? "" : "s") + " added.",
               "grocery.html", "See the list");
    });

    document.getElementById("print-recipe").addEventListener("click", function () { window.print(); });

    const fav = document.getElementById("fav-btn");
    fav.addEventListener("click", function () {
      const added = TK.toggleFavourite(recipe.id);
      updateFavButton();
      TK.toast(added ? "Saved to your favourites." : "Removed from your favourites.");
    });
    updateFavButton();
  }

  setHead();
  render();
})();
