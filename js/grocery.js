/* ==========================================================================
   GROCERY LIST
   Combines ingredients from every selected recipe. The combining itself
   lives in app.js (buildGroceryList); this file draws it and handles
   ticking, adding, removing and printing.
   ========================================================================== */
(function () {
  "use strict";

  const output = document.getElementById("grocery-output");
  if (!output) return;

  const sourcesEl = document.getElementById("grocery-sources");

  function render() {
    const groups = TK.buildGroceryList();
    const g = TK.getGrocery();

    if (!groups.length) {
      output.innerHTML =
        '<div class="empty">' +
          "<h3>Your list is empty</h3>" +
          "<p>Add ingredients from any recipe page, or send a whole day across from " +
          "the meal planner. Recipes that share an ingredient are combined into one line.</p>" +
          '<div class="btn-row" style="justify-content:center">' +
            '<a class="btn btn-primary" href="recipes.html">Browse recipes</a>' +
            '<a class="btn btn-secondary" href="build.html">Build my day</a>' +
          "</div>" +
        "</div>";
    } else {
      const total = groups.reduce(function (n, gr) { return n + gr.items.length; }, 0);
      const done = groups.reduce(function (n, gr) {
        return n + gr.items.filter(function (i) { return TK.isChecked(i.key); }).length;
      }, 0);

      output.innerHTML =
        '<p class="result-count" role="status" aria-live="polite" style="margin-bottom:1.5rem">' +
          "<strong>" + done + "</strong> of <strong>" + total + "</strong> items ticked off" +
        "</p>" +
        groups.map(function (gr) {
          return (
            '<div class="grocery-group">' +
              "<h2>" + TK.esc(gr.group) + "</h2>" +
              '<ul class="grocery-items">' +
                gr.items.map(function (item) { return itemRow(item); }).join("") +
              "</ul>" +
            "</div>"
          );
        }).join("");
    }

    renderSources(g);
  }

  function itemRow(item) {
    const checked = TK.isChecked(item.key);
    const id = "gi-" + item.key.replace(/[^a-z0-9]/gi, "-");

    let amount = "";
    if (item.qty != null && item.qty > 0) amount = TK.formatQty(item.qty, item.unit);
    if (item.toTaste) amount = amount ? amount + " + to taste" : "to taste";

    return (
      '<li class="grocery-item' + (checked ? " is-checked" : "") + '">' +
        "<label>" +
          '<input type="checkbox" data-key="' + TK.esc(item.key) + '" id="' + id + '"' +
            (checked ? " checked" : "") + ">" +
          "<span>" +
            '<span class="grocery-name">' + TK.esc(item.item) + "</span>" +
            (amount ? ' &mdash; <span class="grocery-qty">' + TK.esc(amount) + "</span>" : "") +
            (item.from.length
              ? '<span class="grocery-from">' + TK.esc(item.from.join(", ")) + "</span>"
              : (item.manual ? '<span class="grocery-from">Added by you</span>' : "")) +
          "</span>" +
        "</label>" +
        (item.manual
          ? '<button type="button" class="icon-btn no-print js-del-manual" data-i="' + item.manualIndex +
            '" aria-label="Remove ' + TK.esc(item.item) + '">&times;</button>'
          : "") +
      "</li>"
    );
  }

  function renderSources(g) {
    if (!g.recipes.length) {
      sourcesEl.innerHTML = '<p class="small muted">No recipes added yet.</p>';
      return;
    }
    sourcesEl.innerHTML = g.recipes.map(function (sel) {
      const r = TK.getRecipe(sel.id);
      return (
        '<div class="grocery-source">' +
          "<div>" +
            '<div class="grocery-source-name">' +
              '<a href="recipe.html?id=' + encodeURIComponent(r.id) + '" style="color:inherit">' +
              TK.esc(r.name) + "</a></div>" +
            '<div class="grocery-source-meta">' + sel.servings +
              " serving" + (sel.servings === 1 ? "" : "s") + " &middot; " +
              TK.kcal(r) + " kcal each</div>" +
          "</div>" +
          '<button type="button" class="icon-btn js-remove-source" data-id="' + TK.esc(r.id) +
            '" aria-label="Remove ' + TK.esc(r.name) + ' from the list">&times;</button>' +
        "</div>"
      );
    }).join("");
  }

  /* ---------- Events -------------------------------------------------- */
  output.addEventListener("change", function (e) {
    const box = e.target.closest('input[type="checkbox"]');
    if (!box) return;
    TK.setChecked(box.getAttribute("data-key"), box.checked);
  });

  output.addEventListener("click", function (e) {
    const del = e.target.closest(".js-del-manual");
    if (!del) return;
    const g = TK.getGrocery();
    g.manual.splice(Number(del.getAttribute("data-i")), 1);
    TK.saveGrocery(g);
  });

  sourcesEl.addEventListener("click", function (e) {
    const btn = e.target.closest(".js-remove-source");
    if (!btn) return;
    const id = btn.getAttribute("data-id");
    const name = TK.getRecipe(id).name;
    TK.removeRecipeFromGrocery(id);
    TK.toast(name + " removed from the list.");
  });

  document.getElementById("add-manual").addEventListener("click", addManual);
  document.getElementById("manual-item").addEventListener("keydown", function (e) {
    if (e.key === "Enter") { e.preventDefault(); addManual(); }
  });

  function addManual() {
    const input = document.getElementById("manual-item");
    const value = input.value.trim();
    if (!value) { input.focus(); return; }
    const g = TK.getGrocery();
    g.manual.push(value);
    TK.saveGrocery(g);
    input.value = "";
    input.focus();
  }

  document.getElementById("print-list").addEventListener("click", function () { window.print(); });

  document.getElementById("uncheck-all").addEventListener("click", function () {
    const g = TK.getGrocery();
    g.checked = {};
    TK.saveGrocery(g);
    TK.toast("Everything unticked.");
  });

  document.getElementById("clear-list").addEventListener("click", function () {
    const g = TK.getGrocery();
    if (!g.recipes.length && !g.manual.length) { TK.toast("The list is already empty."); return; }
    if (window.confirm("Clear the whole grocery list? This cannot be undone.")) {
      TK.clearGrocery();
      TK.toast("Grocery list cleared.");
    }
  });

  document.addEventListener("tk:change", function (e) {
    if (e.detail && e.detail.key === TK.KEYS.grocery) render();
  });

  render();
})();
