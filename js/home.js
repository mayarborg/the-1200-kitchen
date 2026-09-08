/* ==========================================================================
   HOME PAGE
   Featured recipes, the category strip, and the live "Your day" panel
   that reads whatever is currently in the meal planner.
   ========================================================================== */
(function () {
  "use strict";

  const DIAL_CIRCUMFERENCE = 2 * Math.PI * 50; // r=50 in the SVG

  /* ---------- Featured recipes -------------------------------------
     One from as many different categories as possible, full recipes
     first, so the row never shows six variations on the same thing. */
  function featured(limit) {
    const picked = [];
    const usedCategories = {};
    const full = TK.allRecipes().filter(function (r) { return r.kind !== "quick"; });

    full.forEach(function (r) {
      if (picked.length >= limit) return;
      if (usedCategories[r.category]) return;
      usedCategories[r.category] = true;
      picked.push(r);
    });
    full.forEach(function (r) {
      if (picked.length >= limit) return;
      if (picked.indexOf(r) === -1) picked.push(r);
    });
    return picked.slice(0, limit);
  }

  function renderFeatured() {
    const grid = document.getElementById("featured-grid");
    if (!grid) return;
    grid.innerHTML = featured(6).map(function (r) { return TK.recipeCard(r); }).join("");
  }

  /* ---------- Category strip --------------------------------------- */
  function renderCategories() {
    const strip = document.getElementById("category-strip");
    if (!strip) return;
    strip.innerHTML = CATEGORIES.map(function (cat) {
      const n = TK.countInCategory(cat);
      return '<a class="cat-tile" href="recipes.html?category=' + encodeURIComponent(cat) + '">' +
        '<span class="cat-name">' + TK.esc(cat) + "</span>" +
        '<span class="cat-count">' + n + " recipe" + (n === 1 ? "" : "s") + "</span>" +
        "</a>";
    }).join("");
  }

  /* ---------- Live day panel --------------------------------------- */
  function renderDayPanel() {
    const totals = TK.dayTotals();
    const target = TK.getTarget();
    const entries = TK.dayEntries();

    const dial = document.getElementById("home-dial");
    const kcalEl = document.getElementById("home-dial-kcal");
    const ofEl = document.getElementById("home-dial-of");
    const listEl = document.getElementById("home-day-list");
    const statusEl = document.querySelector("#home-day-panel .js-panel-status");
    const cta = document.getElementById("home-day-cta");
    if (!dial) return;

    const pct = target > 0 ? Math.min(totals.calories / target, 1) : 0;
    dial.style.strokeDasharray = DIAL_CIRCUMFERENCE.toFixed(1);
    dial.style.strokeDashoffset = (DIAL_CIRCUMFERENCE * (1 - pct)).toFixed(1);
    dial.classList.toggle("is-over", totals.calories > target);

    kcalEl.textContent = totals.calories.toLocaleString();
    ofEl.textContent = "of " + target.toLocaleString() + " kcal";

    document.getElementById("home-protein").textContent = totals.protein + " g";
    document.getElementById("home-carbs").textContent = totals.carbs + " g";
    document.getElementById("home-fat").textContent = totals.fat + " g";

    if (entries.length === 0) {
      statusEl.textContent = "Nothing planned yet";
      listEl.innerHTML = '<li class="is-empty"><span>Your meals will appear here as you add them.</span></li>';
      cta.textContent = "Start building";
    } else {
      const remaining = target - totals.calories;
      statusEl.textContent = remaining >= 0
        ? remaining.toLocaleString() + " kcal left"
        : Math.abs(remaining).toLocaleString() + " kcal over";
      listEl.innerHTML = entries.slice(0, 6).map(function (row) {
        const q = row.entry.qty > 1 ? " &times;" + row.entry.qty : "";
        return "<li><span>" + TK.esc(row.recipe.name) + q + "</span>" +
          "<span>" + TK.kcal(row.recipe, row.entry.qty) + " kcal</span></li>";
      }).join("") + (entries.length > 6
        ? '<li class="is-empty"><span>and ' + (entries.length - 6) + " more</span><span></span></li>"
        : "");
      cta.textContent = "Open my day";
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderFeatured();
    renderCategories();
    renderDayPanel();
    document.addEventListener("tk:change", renderDayPanel);
  });
})();
