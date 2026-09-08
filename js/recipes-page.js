/* ==========================================================================
   RECIPE LIBRARY — search, filter and sort
   Everything happens in the browser against the RECIPES array. No requests.
   ========================================================================== */
(function () {
  "use strict";

  const grid = document.getElementById("recipe-grid");
  if (!grid) return;

  const qInput      = document.getElementById("q");
  const catSelect   = document.getElementById("f-category");
  const kcalSelect  = document.getElementById("f-kcal");
  const protSelect  = document.getElementById("f-protein");
  const timeSelect  = document.getElementById("f-time");
  const sortSelect  = document.getElementById("f-sort");
  const chipWrap    = document.getElementById("tag-chips");
  const countEl     = document.getElementById("result-count");
  const noResults   = document.getElementById("no-results");
  const clearBtn    = document.getElementById("clear-filters");

  /* Quick-filter chips. "test" decides whether a recipe qualifies. */
  const CHIPS = [
    { id: "vegetarian",  label: "Vegetarian",   test: function (r) { return has(r.dietary, "Vegetarian") || has(r.dietary, "Vegan"); } },
    { id: "highprotein", label: "High protein", test: function (r) { return r.nutrition.protein >= 20; } },
    { id: "chicken",     label: "Chicken",      test: function (r) { return text(r).indexOf("chicken") !== -1; } },
    { id: "meat",        label: "Meat",         test: function (r) { return r.category === "Chicken & Meat" || text(r).indexOf("beef") !== -1; } },
    { id: "fish",        label: "Fish",         test: function (r) { return r.category === "Fish & Seafood" || has(r.dietary, "Pescatarian"); } },
    { id: "quick",       label: "Quick meals",  test: function (r) { return TK.totalTime(r) <= 15; } },
    { id: "lowcal",      label: "Under 300 kcal", test: function (r) { return r.nutrition.calories < 300; } },
    { id: "favourites",  label: "My favourites",  test: function (r) { return TK.isFavourite(r.id); } }
  ];

  const activeChips = {};

  function has(list, value) { return Array.isArray(list) && list.indexOf(value) !== -1; }

  /* One lowercase blob per recipe, cached, so searching is instant */
  const textCache = {};
  function text(r) {
    if (textCache[r.id]) return textCache[r.id];
    const parts = [r.name, r.description, r.category, r.difficulty]
      .concat(r.tags || [])
      .concat(r.dietary || [])
      .concat(r.ingredients.map(function (i) { return i.item + " " + (i.note || ""); }))
      .concat(r.method || []);
    textCache[r.id] = parts.join(" ").toLowerCase();
    return textCache[r.id];
  }

  /* Understand a few phrases people actually type, then treat whatever is
     left as ordinary keywords. "chicken under 400 kcal" does both. */
  function parseQuery(raw) {
    let q = (raw || "").toLowerCase().trim();
    const parsed = { maxKcal: null, minProtein: null, maxTime: null, words: [] };
    if (!q) return parsed;

    q = q.replace(/(?:under|below|less than|max)\s*(\d{2,4})\s*(?:kcal|cal|calories)?/g,
      function (m, n) { parsed.maxKcal = Number(n); return " "; });

    q = q.replace(/(?:over|above|more than|at least)\s*(\d{1,3})\s*g?\s*(?:of\s*)?protein/g,
      function (m, n) { parsed.minProtein = Number(n); return " "; });

    if (/high[\s-]?protein/.test(q)) { parsed.minProtein = Math.max(parsed.minProtein || 0, 20); q = q.replace(/high[\s-]?protein/g, " "); }
    if (/low[\s-]?cal(orie)?/.test(q)) { parsed.maxKcal = Math.min(parsed.maxKcal || 9999, 300); q = q.replace(/low[\s-]?cal(orie)?/g, " "); }

    q = q.replace(/(?:under|within)?\s*(\d{1,3})\s*(?:min|mins|minutes)/g,
      function (m, n) { parsed.maxTime = Number(n); return " "; });

    parsed.words = q.split(/[\s,]+/).filter(function (w) {
      return w.length > 1 && ["kcal", "cal", "calories", "recipe", "recipes", "with", "and"].indexOf(w) === -1;
    });
    return parsed;
  }

  function matches(r, parsed) {
    if (parsed.maxKcal != null && r.nutrition.calories >= parsed.maxKcal) return false;
    if (parsed.minProtein != null && r.nutrition.protein < parsed.minProtein) return false;
    if (parsed.maxTime != null && TK.totalTime(r) > parsed.maxTime) return false;
    const blob = text(r);
    return parsed.words.every(function (w) { return blob.indexOf(w) !== -1; });
  }

  function currentFilters() {
    return {
      parsed:  parseQuery(qInput.value),
      cat:     catSelect.value,
      maxKcal: kcalSelect.value ? Number(kcalSelect.value) : null,
      minProt: protSelect.value ? Number(protSelect.value) : null,
      maxTime: timeSelect.value ? Number(timeSelect.value) : null,
      sort:    sortSelect.value
    };
  }

  function apply() {
    const f = currentFilters();

    let list = TK.allRecipes().filter(function (r) {
      if (f.cat && r.category !== f.cat) return false;
      if (f.maxKcal != null && r.nutrition.calories >= f.maxKcal) return false;
      if (f.minProt != null && r.nutrition.protein < f.minProt) return false;
      if (f.maxTime != null && TK.totalTime(r) > f.maxTime) return false;
      if (!matches(r, f.parsed)) return false;
      return CHIPS.every(function (c) { return !activeChips[c.id] || c.test(r); });
    });

    const sorters = {
      "name":         function (a, b) { return a.name.localeCompare(b.name); },
      "kcal-asc":     function (a, b) { return a.nutrition.calories - b.nutrition.calories; },
      "kcal-desc":    function (a, b) { return b.nutrition.calories - a.nutrition.calories; },
      "protein-desc": function (a, b) { return b.nutrition.protein - a.nutrition.protein; },
      "time-asc":     function (a, b) { return TK.totalTime(a) - TK.totalTime(b); }
    };
    list.sort(sorters[f.sort] || sorters.name);

    grid.innerHTML = list.map(function (r) { return TK.recipeCard(r); }).join("");

    const total = RECIPES.length;
    countEl.innerHTML = list.length === total
      ? "Showing all <strong>" + total + "</strong> recipes"
      : "Showing <strong>" + list.length + "</strong> of " + total + " recipes";

    if (list.length === 0) {
      noResults.hidden = false;
      noResults.innerHTML =
        '<div class="empty"><h3>Nothing matches that yet</h3>' +
        "<p>Try removing a filter, or search for an ingredient instead of a dish &mdash; " +
        '&ldquo;feta&rdquo; and &ldquo;chickpeas&rdquo; both turn up several recipes.</p>' +
        '<button type="button" class="btn btn-secondary" id="empty-clear">Clear all filters</button></div>';
      document.getElementById("empty-clear").addEventListener("click", clearAll);
    } else {
      noResults.hidden = true;
      noResults.innerHTML = "";
    }
  }

  function clearAll() {
    qInput.value = "";
    catSelect.value = "";
    kcalSelect.value = "";
    protSelect.value = "";
    timeSelect.value = "";
    sortSelect.value = "name";
    Object.keys(activeChips).forEach(function (k) { delete activeChips[k]; });
    chipWrap.querySelectorAll(".chip").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
    history.replaceState(null, "", location.pathname);
    apply();
    qInput.focus();
  }

  /* ---------- Set-up ------------------------------------------------ */
  CATEGORIES.forEach(function (c) {
    const o = document.createElement("option");
    o.value = c;
    o.textContent = c + " (" + TK.countInCategory(c) + ")";
    catSelect.appendChild(o);
  });

  chipWrap.innerHTML = CHIPS.map(function (c) {
    return '<button type="button" class="chip" data-chip="' + c.id + '" aria-pressed="false">' +
      TK.esc(c.label) + "</button>";
  }).join("");

  chipWrap.addEventListener("click", function (e) {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    const id = btn.getAttribute("data-chip");
    const on = !activeChips[id];
    if (on) activeChips[id] = true; else delete activeChips[id];
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    apply();
  });

  /* Read ?category= and ?q= so the footer and home page links land
     on a pre-filtered view */
  const params = new URLSearchParams(location.search);
  if (params.get("category")) catSelect.value = params.get("category");
  if (params.get("q")) qInput.value = params.get("q");

  let debounce;
  qInput.addEventListener("input", function () {
    clearTimeout(debounce);
    debounce = setTimeout(apply, 160);
  });
  [catSelect, kcalSelect, protSelect, timeSelect, sortSelect].forEach(function (el) {
    el.addEventListener("change", apply);
  });
  clearBtn.addEventListener("click", clearAll);
  document.getElementById("filter-bar").addEventListener("submit", function (e) { e.preventDefault(); });
  document.addEventListener("tk:change", function (e) {
    if (e.detail && e.detail.key === TK.KEYS.favourites && activeChips.favourites) apply();
  });

  apply();
})();
