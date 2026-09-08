/* ==========================================================================
   WHAT'S IN MY FRIDGE?
   Builds a checklist from every ingredient used anywhere in the recipe data,
   then ranks recipes by how much of each one you can already make.

   Add a recipe with a new ingredient and it appears here automatically.
   Staples (salt, pepper, oil, seasonings) are excluded — assuming everyone
   has them keeps the match percentages honest.
   ========================================================================== */
(function () {
  "use strict";

  const groupsEl = document.getElementById("fridge-groups");
  if (!groupsEl) return;

  const resultsEl = document.getElementById("fridge-results");
  const countEl   = document.getElementById("fridge-count");
  const onlyBox   = document.getElementById("only-complete");

  /* ---------- Build the ingredient vocabulary ------------------------ */
  const vocabulary = (function () {
    const map = {};
    TK.allRecipes().forEach(function (r) {
      r.ingredients.forEach(function (ing) {
        if (ing.staple) return;
        const key = ing.item.toLowerCase();
        if (!map[key]) map[key] = { key: key, item: ing.item, group: ing.group, uses: 0 };
        map[key].uses += 1;
      });
    });
    return Object.keys(map).map(function (k) { return map[k]; });
  })();

  function nonStaple(recipe) {
    return recipe.ingredients.filter(function (i) { return !i.staple; });
  }

  /* ---------- Checklist ---------------------------------------------- */
  function renderPicker() {
    const have = TK.getFridge();

    groupsEl.innerHTML = GROCERY_GROUPS.map(function (group) {
      const items = vocabulary
        .filter(function (v) { return v.group === group; })
        .sort(function (a, b) { return b.uses - a.uses || a.item.localeCompare(b.item); });
      if (!items.length) return "";

      return (
        '<div class="fridge-group">' +
          "<h3>" + TK.esc(group) + "</h3>" +
          '<div class="chip-set">' +
            items.map(function (v) {
              const on = have.indexOf(v.key) !== -1;
              return '<button type="button" class="chip js-ing" data-key="' + TK.esc(v.key) + '"' +
                ' aria-pressed="' + (on ? "true" : "false") + '">' +
                TK.esc(v.item) + ' <span class="chip-count">' + v.uses + "</span></button>";
            }).join("") +
          "</div>" +
        "</div>"
      );
    }).join("");
  }

  /* ---------- Matching ------------------------------------------------ */
  function score(recipe, have) {
    const needed = nonStaple(recipe);
    if (!needed.length) return { pct: 100, matched: 0, total: 0, missing: [] };

    const missing = [];
    let matched = 0;
    needed.forEach(function (ing) {
      if (have.indexOf(ing.item.toLowerCase()) !== -1) matched += 1;
      else missing.push(ing.item);
    });
    return {
      pct: Math.round((matched / needed.length) * 100),
      matched: matched,
      total: needed.length,
      missing: missing
    };
  }

  function renderResults() {
    const have = TK.getFridge();
    const onlyComplete = onlyBox.checked;

    if (!have.length) {
      countEl.textContent = "";
      resultsEl.innerHTML = "";
      resultsEl.insertAdjacentHTML("beforeend",
        '<div class="empty" style="grid-column:1/-1">' +
          "<h3>Tick a few things to get started</h3>" +
          "<p>Choose whatever is actually in your fridge and cupboard. Recipes will " +
          "appear here ranked by how much of each one you can make right now.</p>" +
        "</div>");
      return;
    }

    const ranked = TK.allRecipes()
      .map(function (r) { return { recipe: r, score: score(r, have) }; })
      .filter(function (row) {
        if (onlyComplete) return row.score.missing.length === 0;
        return row.score.matched > 0;
      })
      .sort(function (a, b) {
        return b.score.pct - a.score.pct ||
               b.score.matched - a.score.matched ||
               a.recipe.name.localeCompare(b.recipe.name);
      });

    const complete = ranked.filter(function (r) { return r.score.missing.length === 0; }).length;

    countEl.innerHTML = onlyComplete
      ? "<strong>" + ranked.length + "</strong> recipe" + (ranked.length === 1 ? "" : "s") +
        " you can make right now"
      : "<strong>" + ranked.length + "</strong> recipe" + (ranked.length === 1 ? "" : "s") +
        " use something you have" +
        (complete ? ", and <strong>" + complete + "</strong> need" + (complete === 1 ? "s" : "") +
         " nothing else" : "");

    if (!ranked.length) {
      resultsEl.innerHTML =
        '<div class="empty" style="grid-column:1/-1">' +
          "<h3>" + (onlyComplete ? "Nothing is quite complete yet" : "No matches yet") + "</h3>" +
          "<p>" + (onlyComplete
            ? "Untick &ldquo;only show recipes I can make&rdquo; to see the near misses &mdash; " +
              "most of them are one or two items away."
            : "Try ticking a few more ingredients.") + "</p>" +
        "</div>";
      return;
    }

    resultsEl.innerHTML = ranked.map(function (row) {
      const s = row.score;
      const partial = s.missing.length > 0;
      const extra =
        '<div class="match-head">' +
          "<span>You have " + s.matched + " of " + s.total + "</span>" +
          '<span class="match-pct' + (partial ? " is-partial" : "") + '">' + s.pct + "% match</span>" +
        "</div>" +
        '<div class="match-bar' + (partial ? " is-partial" : "") + '">' +
          '<span style="width:' + s.pct + '%"></span></div>' +
        (partial
          ? '<p class="match-missing">Still need: <strong>' +
            TK.esc(s.missing.slice(0, 4).join(", ")) +
            (s.missing.length > 4 ? " and " + (s.missing.length - 4) + " more" : "") +
            "</strong></p>"
          : '<p class="match-missing"><strong>You have everything for this.</strong></p>');

      return TK.recipeCard(row.recipe, { extraHtml: extra, className: "match-card" });
    }).join("");
  }

  /* ---------- Events --------------------------------------------------- */
  groupsEl.addEventListener("click", function (e) {
    const btn = e.target.closest(".js-ing");
    if (!btn) return;
    const key = btn.getAttribute("data-key");
    const have = TK.getFridge();
    const i = have.indexOf(key);
    if (i === -1) have.push(key); else have.splice(i, 1);
    TK.setFridge(have);
    btn.setAttribute("aria-pressed", i === -1 ? "true" : "false");
    renderResults();
  });

  onlyBox.addEventListener("change", renderResults);

  document.getElementById("fridge-clear").addEventListener("click", function () {
    if (!TK.getFridge().length) { TK.toast("Nothing is ticked yet."); return; }
    TK.setFridge([]);
    renderPicker();
    renderResults();
    TK.toast("Fridge cleared.");
  });

  renderPicker();
  renderResults();
})();
