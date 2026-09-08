/* ==========================================================================
   THE 1,200 KITCHEN — SHARED APPLICATION CODE
   --------------------------------------------------------------------------
   Everything common to more than one page lives here: saving to the browser,
   the day plan, recipe cards, the header, dialogs and toasts.

   Loaded on every page, always AFTER recipes.js.

   Nothing here needs editing to add a recipe.
   ========================================================================== */

const TK = (function () {
  "use strict";

  /* ------------------------------------------------------------------
     STORAGE
     Everything is kept in the browser's localStorage. No account, no
     server, no cookies. If localStorage is unavailable (private mode in
     some browsers), the site still works — it just forgets between visits.
     ------------------------------------------------------------------ */
  const KEYS = {
    target:    "tk.target",
    day:       "tk.day",
    grocery:   "tk.grocery",
    favourites:"tk.favourites",
    fridge:    "tk.fridge"
  };

  let memoryFallback = {};
  let storageWorks = (function () {
    try {
      const t = "tk.test";
      window.localStorage.setItem(t, "1");
      window.localStorage.removeItem(t);
      return true;
    } catch (e) {
      return false;
    }
  })();

  function read(key, fallback) {
    try {
      const raw = storageWorks ? window.localStorage.getItem(key) : memoryFallback[key];
      if (raw == null) return structuredCopy(fallback);
      const parsed = JSON.parse(raw);
      return parsed == null ? structuredCopy(fallback) : parsed;
    } catch (e) {
      return structuredCopy(fallback);
    }
  }

  function write(key, value) {
    try {
      const raw = JSON.stringify(value);
      if (storageWorks) window.localStorage.setItem(key, raw);
      else memoryFallback[key] = raw;
    } catch (e) { /* quota or private mode — carry on without saving */ }
    document.dispatchEvent(new CustomEvent("tk:change", { detail: { key: key } }));
  }

  function structuredCopy(v) { return JSON.parse(JSON.stringify(v)); }

  /* ------------------------------------------------------------------
     DEFAULTS
     ------------------------------------------------------------------ */
  const DEFAULT_TARGET = 1200;
  const EMPTY_DAY = { breakfast: [], lunch: [], dinner: [], snacks: [] };
  const SLOTS = [
    { key: "breakfast", label: "Breakfast" },
    { key: "lunch",     label: "Lunch" },
    { key: "dinner",    label: "Dinner" },
    { key: "snacks",    label: "Snacks" }
  ];

  /* ------------------------------------------------------------------
     RECIPE LOOKUP
     ------------------------------------------------------------------ */
  const byId = {};
  RECIPES.forEach(function (r) { byId[r.id] = r; });

  function getRecipe(id) { return byId[id] || null; }
  function allRecipes() { return RECIPES.slice(); }

  function countInCategory(cat) {
    return RECIPES.filter(function (r) { return r.category === cat; }).length;
  }

  /* ------------------------------------------------------------------
     TARGET
     ------------------------------------------------------------------ */
  function getTarget() {
    const t = read(KEYS.target, DEFAULT_TARGET);
    const n = Number(t);
    return (isFinite(n) && n > 0) ? Math.round(n) : DEFAULT_TARGET;
  }
  function setTarget(n) {
    const v = Math.round(Number(n));
    if (!isFinite(v) || v <= 0) return;
    write(KEYS.target, Math.min(v, 10000));
  }

  /* ------------------------------------------------------------------
     THE DAY
     Shape: { breakfast:[{id, qty}], lunch:[...], dinner:[...], snacks:[...] }
     "qty" is how many servings of that recipe are being eaten.
     ------------------------------------------------------------------ */
  function getDay() {
    const d = read(KEYS.day, EMPTY_DAY);
    // Guard against old or damaged data
    SLOTS.forEach(function (s) {
      if (!Array.isArray(d[s.key])) d[s.key] = [];
      d[s.key] = d[s.key].filter(function (e) { return e && getRecipe(e.id); });
      d[s.key].forEach(function (e) { if (!(e.qty > 0)) e.qty = 1; });
    });
    return d;
  }
  function saveDay(d) { write(KEYS.day, d); }

  /* Which slot does a recipe naturally belong to? */
  function suggestSlot(recipe) {
    if (!recipe) return "lunch";
    if (recipe.category === "Breakfasts") return "breakfast";
    if (recipe.category === "Snacks & Sweet Things") return "snacks";
    if (recipe.nutrition.calories <= 200) return "snacks";
    const day = getDay();
    if (day.lunch.length === 0) return "lunch";
    if (day.dinner.length === 0) return "dinner";
    return "lunch";
  }

  function addToDay(id, slot, qty) {
    const recipe = getRecipe(id);
    if (!recipe) return null;
    const target = slot || suggestSlot(recipe);
    const day = getDay();
    if (!day[target]) return null;
    const existing = day[target].filter(function (e) { return e.id === id; })[0];
    if (existing) existing.qty += (qty || 1);
    else day[target].push({ id: id, qty: qty || 1 });
    saveDay(day);
    return target;
  }

  function removeFromDay(slot, index) {
    const day = getDay();
    if (!day[slot]) return;
    day[slot].splice(index, 1);
    saveDay(day);
  }

  function setDayQty(slot, index, qty) {
    const day = getDay();
    if (!day[slot] || !day[slot][index]) return;
    if (qty <= 0) day[slot].splice(index, 1);
    else day[slot][index].qty = Math.min(qty, 20);
    saveDay(day);
  }

  function moveInDay(fromSlot, index, toSlot) {
    const day = getDay();
    if (!day[fromSlot] || !day[fromSlot][index] || !day[toSlot]) return;
    const entry = day[fromSlot].splice(index, 1)[0];
    const existing = day[toSlot].filter(function (e) { return e.id === entry.id; })[0];
    if (existing) existing.qty += entry.qty;
    else day[toSlot].push(entry);
    saveDay(day);
  }

  function resetDay() { write(KEYS.day, structuredCopy(EMPTY_DAY)); }

  function dayEntries() {
    const day = getDay();
    const out = [];
    SLOTS.forEach(function (s) {
      day[s.key].forEach(function (e, i) {
        out.push({ slot: s.key, slotLabel: s.label, index: i, entry: e, recipe: getRecipe(e.id) });
      });
    });
    return out;
  }

  function dayTotals() {
    const t = { calories: 0, protein: 0, carbs: 0, fat: 0, fibre: 0, items: 0 };
    dayEntries().forEach(function (row) {
      const n = row.recipe.nutrition;
      t.calories += n.calories * row.entry.qty;
      t.protein  += n.protein  * row.entry.qty;
      t.carbs    += n.carbs    * row.entry.qty;
      t.fat      += n.fat      * row.entry.qty;
      t.fibre    += (n.fibre || 0) * row.entry.qty;
      t.items    += 1;
    });
    Object.keys(t).forEach(function (k) { t[k] = Math.round(t[k]); });
    return t;
  }

  function slotTotal(slotKey) {
    const day = getDay();
    return Math.round(day[slotKey].reduce(function (sum, e) {
      const r = getRecipe(e.id);
      return sum + (r ? r.nutrition.calories * e.qty : 0);
    }, 0));
  }

  /* ------------------------------------------------------------------
     FAVOURITES
     ------------------------------------------------------------------ */
  function getFavourites() { const f = read(KEYS.favourites, []); return Array.isArray(f) ? f : []; }
  function isFavourite(id) { return getFavourites().indexOf(id) !== -1; }
  function toggleFavourite(id) {
    const f = getFavourites();
    const i = f.indexOf(id);
    if (i === -1) f.push(id); else f.splice(i, 1);
    write(KEYS.favourites, f);
    return i === -1;
  }

  /* ------------------------------------------------------------------
     FRIDGE
     ------------------------------------------------------------------ */
  function getFridge() { const f = read(KEYS.fridge, []); return Array.isArray(f) ? f : []; }
  function setFridge(list) { write(KEYS.fridge, list); }

  /* ------------------------------------------------------------------
     GROCERY LIST
     Shape: { recipes:[{id, servings}], manual:[string], checked:{key:true} }
     ------------------------------------------------------------------ */
  const EMPTY_GROCERY = { recipes: [], manual: [], checked: {} };

  function getGrocery() {
    const g = read(KEYS.grocery, EMPTY_GROCERY);
    if (!Array.isArray(g.recipes)) g.recipes = [];
    if (!Array.isArray(g.manual)) g.manual = [];
    if (!g.checked || typeof g.checked !== "object") g.checked = {};
    g.recipes = g.recipes.filter(function (e) { return e && getRecipe(e.id); });
    return g;
  }
  function saveGrocery(g) { write(KEYS.grocery, g); }

  function addRecipeToGrocery(id, servings) {
    const recipe = getRecipe(id);
    if (!recipe) return false;
    const g = getGrocery();
    const existing = g.recipes.filter(function (e) { return e.id === id; })[0];
    const want = servings || recipe.servings;
    if (existing) existing.servings = existing.servings + want;
    else g.recipes.push({ id: id, servings: want });
    saveGrocery(g);
    return true;
  }

  function removeRecipeFromGrocery(id) {
    const g = getGrocery();
    g.recipes = g.recipes.filter(function (e) { return e.id !== id; });
    saveGrocery(g);
  }

  function clearGrocery() { write(KEYS.grocery, structuredCopy(EMPTY_GROCERY)); }

  /* Combine every ingredient from every selected recipe.
     Same item + same unit adds together. Different units stay apart,
     because 2 tbsp and 40 g aren't the same thing and pretending
     otherwise would put the wrong number on the list. */
  function buildGroceryList() {
    const g = getGrocery();
    const map = {};

    g.recipes.forEach(function (sel) {
      const recipe = getRecipe(sel.id);
      if (!recipe) return;
      const factor = sel.servings / recipe.servings;
      recipe.ingredients.forEach(function (ing) {
        const unit = ing.unit || "";
        const key = (ing.item.toLowerCase() + "|" + unit);
        if (!map[key]) {
          map[key] = {
            key: key,
            item: ing.item,
            unit: unit,
            qty: (ing.qty == null) ? null : 0,
            toTaste: ing.qty == null,
            group: ing.group,
            from: []
          };
        }
        const row = map[key];
        if (ing.qty == null) row.toTaste = true;
        else row.qty = (row.qty || 0) + ing.qty * factor;
        if (row.from.indexOf(recipe.name) === -1) row.from.push(recipe.name);
      });
    });

    /* One recipe may call for "5 g olive oil" and another simply for a drizzle.
       Those arrive as two entries because the units differ, which would put the
       same bottle on the list twice. Fold the vague one into the measured one
       so the shopper sees a single line: "Olive oil — 5 g + to taste". */
    Object.keys(map).forEach(function (k) {
      const row = map[k];
      if (row.qty != null || !row.toTaste) return;      // only pure to-taste rows
      const measured = Object.keys(map)
        .map(function (k2) { return map[k2]; })
        .filter(function (other) {
          return other !== row &&
                 other.item.toLowerCase() === row.item.toLowerCase() &&
                 other.qty != null;
        })[0];
      if (!measured) return;
      measured.toTaste = true;
      row.from.forEach(function (name) {
        if (measured.from.indexOf(name) === -1) measured.from.push(name);
      });
      delete map[k];
    });

    g.manual.forEach(function (name, i) {
      const key = "manual|" + i + "|" + name.toLowerCase();
      map[key] = { key: key, item: name, unit: "", qty: null, toTaste: false,
                   group: "Pantry", from: [], manual: true, manualIndex: i };
    });

    // Group into aisles, in the order set in recipes.js
    const grouped = [];
    GROCERY_GROUPS.forEach(function (groupName) {
      const items = Object.keys(map)
        .map(function (k) { return map[k]; })
        .filter(function (r) { return r.group === groupName; })
        .sort(function (a, b) { return a.item.localeCompare(b.item); });
      if (items.length) grouped.push({ group: groupName, items: items });
    });
    return grouped;
  }

  function isChecked(key) { return !!getGrocery().checked[key]; }
  function setChecked(key, on) {
    const g = getGrocery();
    if (on) g.checked[key] = true; else delete g.checked[key];
    saveGrocery(g);
  }

  /* ------------------------------------------------------------------
     FORMATTING
     ------------------------------------------------------------------ */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  /* Estimated numbers get a tilde. Verified ones don't.
     This is the whole point of the nutritionStatus field: never show
     precision that isn't really there. */
  function kcal(recipe, qty) {
    const n = Math.round(recipe.nutrition.calories * (qty || 1));
    return (recipe.nutritionStatus === "verified" ? "" : "~") + n;
  }
  function approx(recipe, value) {
    return (recipe.nutritionStatus === "verified" ? "" : "~") + Math.round(value);
  }

  /* Round sensibly and drop trailing zeros: 66.666 -> 67, 0.5 -> ½-ish */
  function formatQty(qty, unit) {
    if (qty == null) return "";
    let v = qty;
    if (unit === "g" || unit === "ml") {
      v = v >= 20 ? Math.round(v) : Math.round(v * 2) / 2;
    } else {
      v = Math.round(v * 100) / 100;
    }
    const text = (Math.abs(v - Math.round(v)) < 0.001) ? String(Math.round(v)) : String(v);
    return unit ? text + " " + unit : text;
  }

  function ingredientLine(ing, factor) {
    const qty = (ing.qty == null) ? null : ing.qty * (factor == null ? 1 : factor);
    const amount = (qty == null) ? "to taste" : formatQty(qty, ing.unit);
    return { amount: amount, item: ing.item, note: ing.note || "" };
  }

  function totalTime(r) { return (r.prepTime || 0) + (r.cookTime || 0); }

  function timeLabel(mins) {
    if (mins < 60) return mins + " min";
    const h = Math.floor(mins / 60), m = mins % 60;
    return m ? h + " hr " + m + " min" : h + " hr";
  }

  /* ------------------------------------------------------------------
     RECIPE CARD
     Used on the home page, the recipe library and the fridge results.
     ------------------------------------------------------------------ */
  function recipeCard(recipe, options) {
    const opt = options || {};
    const url = "recipe.html?id=" + encodeURIComponent(recipe.id);
    const quick = recipe.kind === "quick";

    const badge = quick
      ? '<span class="badge badge-quick">Quick entry</span>'
      : '<span class="badge badge-category">' + esc(recipe.category) + "</span>";

    let extra = opt.extraHtml || "";

    return (
      '<article class="card' + (quick ? " is-quick" : "") + (opt.className ? " " + opt.className : "") + '">' +
        '<div class="card-media">' +
          '<img src="' + esc(recipe.image) + '" alt="' + esc(recipe.imageAlt) + '" loading="lazy" width="800" height="600">' +
          badge +
          '<span class="card-kcal">' + kcal(recipe) + " kcal</span>" +
        "</div>" +
        '<div class="card-body">' +
          '<h3 class="card-title"><a href="' + url + '">' + esc(recipe.name) + "</a></h3>" +
          '<p class="card-desc">' + esc(recipe.description) + "</p>" +
          extra +
          '<p class="card-facts">' +
            "<span><strong>" + approx(recipe, recipe.nutrition.protein) + " g</strong> protein</span>" +
            "<span><strong>" + totalTime(recipe) + " min</strong> total</span>" +
            "<span><strong>" + recipe.servings + "</strong> serving" + (recipe.servings === 1 ? "" : "s") + "</span>" +
          "</p>" +
        "</div>" +
        '<div class="card-actions">' +
          '<a class="btn btn-secondary btn-sm" href="' + url + '">View recipe</a>' +
          '<button class="btn btn-primary btn-sm js-add-day" data-id="' + esc(recipe.id) + '">Add to my day</button>' +
        "</div>" +
      "</article>"
    );
  }

  /* One delegated listener handles every "Add to my day" button on the
     page, including cards rendered after load. */
  function bindAddButtons(root) {
    (root || document).addEventListener("click", function (ev) {
      const btn = ev.target.closest(".js-add-day");
      if (!btn) return;
      const id = btn.getAttribute("data-id");
      const recipe = getRecipe(id);
      if (!recipe) return;
      const slot = addToDay(id, btn.getAttribute("data-slot") || null);
      const label = SLOTS.filter(function (s) { return s.key === slot; })[0].label.toLowerCase();
      toast(recipe.name + " added to " + label + ".", "build.html", "See my day");
    });
  }

  /* ------------------------------------------------------------------
     TOASTS
     ------------------------------------------------------------------ */
  let toastStack = null;
  function toast(message, href, linkLabel) {
    if (!toastStack) {
      toastStack = document.createElement("div");
      toastStack.className = "toast-stack";
      toastStack.setAttribute("role", "status");
      toastStack.setAttribute("aria-live", "polite");
      document.body.appendChild(toastStack);
    }
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = "<span>" + esc(message) + "</span>" +
      (href ? '<a href="' + esc(href) + '">' + esc(linkLabel || "View") + "</a>" : "");
    toastStack.appendChild(el);
    window.setTimeout(function () {
      el.style.transition = "opacity .3s ease";
      el.style.opacity = "0";
      window.setTimeout(function () { el.remove(); }, 320);
    }, 3600);
  }

  /* ------------------------------------------------------------------
     DIALOG
     One reusable panel. Used to pick a recipe and to move a meal.
     Traps focus and closes on Escape.
     ------------------------------------------------------------------ */
  let dialogEl = null;
  let lastFocused = null;

  function ensureDialog() {
    if (dialogEl) return dialogEl;
    dialogEl = document.createElement("div");
    dialogEl.className = "picker";
    dialogEl.setAttribute("role", "dialog");
    dialogEl.setAttribute("aria-modal", "true");
    dialogEl.setAttribute("aria-labelledby", "tk-dialog-title");
    dialogEl.hidden = true;
    dialogEl.innerHTML =
      '<div class="picker-panel">' +
        '<div class="picker-head">' +
          '<div class="picker-head-top">' +
            '<h2 id="tk-dialog-title"></h2>' +
            '<button type="button" class="icon-btn js-dialog-close" aria-label="Close">&times;</button>' +
          "</div>" +
          '<div class="picker-head-extra"></div>' +
        "</div>" +
        '<div class="picker-body"></div>' +
      "</div>";
    document.body.appendChild(dialogEl);

    dialogEl.addEventListener("click", function (e) {
      if (e.target === dialogEl || e.target.closest(".js-dialog-close")) closeDialog();
    });
    document.addEventListener("keydown", function (e) {
      if (dialogEl.hidden) return;
      if (e.key === "Escape") { closeDialog(); return; }
      if (e.key !== "Tab") return;
      const focusable = dialogEl.querySelectorAll('button, [href], input, select, [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    return dialogEl;
  }

  function openDialog(title, bodyHtml, headExtraHtml) {
    const d = ensureDialog();
    lastFocused = document.activeElement;
    d.querySelector("#tk-dialog-title").textContent = title;
    d.querySelector(".picker-head-extra").innerHTML = headExtraHtml || "";
    d.querySelector(".picker-body").innerHTML = bodyHtml;
    d.hidden = false;
    document.body.style.overflow = "hidden";
    const focusTarget = d.querySelector(".picker-head-extra input") || d.querySelector(".js-dialog-close");
    if (focusTarget) focusTarget.focus();
    return d;
  }

  function closeDialog() {
    if (!dialogEl) return;
    dialogEl.hidden = true;
    document.body.style.overflow = "";
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  function dialogBody() { return dialogEl ? dialogEl.querySelector(".picker-body") : null; }

  /* ------------------------------------------------------------------
     HEADER
     Marks the current page in the navigation, wires the mobile menu,
     and keeps the calorie chip up to date.
     ------------------------------------------------------------------ */
  function initHeader() {
    const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    document.querySelectorAll(".nav-list a").forEach(function (a) {
      const href = (a.getAttribute("href") || "").toLowerCase();
      const matches = href === page ||
        (page === "" && href === "index.html") ||
        (page === "recipe.html" && href === "recipes.html");
      if (matches) a.setAttribute("aria-current", "page");
    });

    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".site-nav");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        const open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
      nav.addEventListener("click", function (e) {
        if (e.target.tagName === "A") {
          nav.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
    }

    updateDayChip();
    document.addEventListener("tk:change", updateDayChip);
  }

  function updateDayChip() {
    const chip = document.querySelector(".day-chip");
    if (!chip) return;
    const totals = dayTotals();
    const target = getTarget();
    if (totals.items === 0) {
      chip.classList.add("is-empty");
      chip.innerHTML = '<span class="chip-label">Today</span><span>Nothing planned</span>';
      chip.setAttribute("aria-label", "Build my day. Nothing planned yet.");
    } else {
      chip.classList.remove("is-empty");
      chip.innerHTML = '<span class="chip-label">Today</span><span>' +
        totals.calories.toLocaleString() + " / " + target.toLocaleString() + "</span>";
      chip.setAttribute("aria-label",
        "Build my day. " + totals.calories + " of " + target + " kilocalories planned.");
    }
  }

  /* Year in the footer, so it never goes stale */
  function initFooterYear() {
    document.querySelectorAll(".js-year").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  function init() {
    initHeader();
    initFooterYear();
    bindAddButtons(document);
  }

  document.addEventListener("DOMContentLoaded", init);

  /* ------------------------------------------------------------------
     PUBLIC API
     ------------------------------------------------------------------ */
  return {
    KEYS: KEYS, SLOTS: SLOTS, DEFAULT_TARGET: DEFAULT_TARGET,
    storageWorks: storageWorks,
    getRecipe: getRecipe, allRecipes: allRecipes, countInCategory: countInCategory,
    getTarget: getTarget, setTarget: setTarget,
    getDay: getDay, addToDay: addToDay, removeFromDay: removeFromDay,
    setDayQty: setDayQty, moveInDay: moveInDay, resetDay: resetDay,
    dayEntries: dayEntries, dayTotals: dayTotals, slotTotal: slotTotal,
    suggestSlot: suggestSlot,
    getFavourites: getFavourites, isFavourite: isFavourite, toggleFavourite: toggleFavourite,
    getFridge: getFridge, setFridge: setFridge,
    getGrocery: getGrocery, saveGrocery: saveGrocery, addRecipeToGrocery: addRecipeToGrocery,
    removeRecipeFromGrocery: removeRecipeFromGrocery, clearGrocery: clearGrocery,
    buildGroceryList: buildGroceryList, isChecked: isChecked, setChecked: setChecked,
    esc: esc, kcal: kcal, approx: approx, formatQty: formatQty,
    ingredientLine: ingredientLine, totalTime: totalTime, timeLabel: timeLabel,
    recipeCard: recipeCard, toast: toast,
    openDialog: openDialog, closeDialog: closeDialog, dialogBody: dialogBody,
    updateDayChip: updateDayChip
  };
})();
