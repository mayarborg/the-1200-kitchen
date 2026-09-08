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

/* ==========================================================================
   MULTIPLE LISTS, AISLE ORDER, AND SENDING A LIST TO ANOTHER DEVICE
   Added after v1. Everything below is self-contained — the original list
   rendering above is untouched.
   ========================================================================== */
(function () {
  "use strict";

  const tabsEl  = document.getElementById("list-tabs");
  if (!tabsEl) return;
  const aisleEl = document.getElementById("aisle-order");

  /* ---------- The list tabs ------------------------------------------ */
  function renderTabs() {
    const lists = TK.groceryLists();
    tabsEl.innerHTML = lists.map(function (l) {
      const count = l.recipes + l.manual;
      return '<button type="button" role="tab" class="list-tab' +
        (l.active ? " is-active" : "") + '" data-id="' + TK.esc(l.id) + '"' +
        ' aria-selected="' + (l.active ? "true" : "false") + '">' +
        TK.esc(l.name) +
        (count ? ' <span class="list-tab-count">' + count + "</span>" : "") +
        "</button>";
    }).join("");
  }

  tabsEl.addEventListener("click", function (e) {
    const tab = e.target.closest(".list-tab");
    if (!tab) return;
    TK.setActiveList(tab.getAttribute("data-id"));
    renderTabs();
  });

  document.getElementById("new-list").addEventListener("click", function () {
    const name = window.prompt("What shall we call this list?", "New list");
    if (name === null) return;
    TK.createList(name.trim() || "New list");
    renderTabs();
    TK.toast("List created.");
  });

  /* Rename, duplicate and delete, in one small dialog. */
  document.getElementById("manage-list").addEventListener("click", function () {
    const id = TK.activeListId();
    const current = TK.groceryLists().filter(function (l) { return l.id === id; })[0];

    TK.openDialog("This list", (
      '<label class="field" for="rename-input">Name</label>' +
      '<input type="text" id="rename-input" value="' + TK.esc(current.name) + '" maxlength="60">' +
      '<div class="btn-row" style="margin-top:1.25rem">' +
        '<button type="button" class="btn btn-primary btn-sm" id="do-rename">Save name</button>' +
        '<button type="button" class="btn btn-secondary btn-sm" id="do-duplicate">Duplicate</button>' +
        '<button type="button" class="btn btn-ghost btn-sm" id="do-delete">Delete list</button>' +
      "</div>" +
      '<p class="small muted" style="margin-top:1rem">Duplicating copies the ' +
      "recipes and items but starts everything unticked.</p>"
    ));

    const body = TK.dialogBody();
    const input = body.querySelector("#rename-input");
    input.focus();
    input.select();

    body.querySelector("#do-rename").addEventListener("click", function () {
      if (TK.renameList(id, input.value)) {
        renderTabs();
        TK.closeDialog();
        TK.toast("Renamed.");
      }
    });
    body.querySelector("#do-duplicate").addEventListener("click", function () {
      TK.duplicateList(id);
      renderTabs();
      TK.closeDialog();
      TK.toast("List duplicated.");
    });
    body.querySelector("#do-delete").addEventListener("click", function () {
      const only = TK.groceryLists().length === 1;
      const msg = only
        ? "This is your only list, so it will be emptied rather than removed. Continue?"
        : "Delete \u201c" + current.name + "\u201d? This cannot be undone.";
      if (!window.confirm(msg)) return;
      TK.deleteList(id);
      renderTabs();
      TK.closeDialog();
      TK.toast(only ? "List emptied." : "List deleted.");
    });
  });

  /* ---------- Aisle order -------------------------------------------- */
  function renderAisles() {
    const order = TK.getAisleOrder();
    aisleEl.innerHTML = order.map(function (group, i) {
      return "<li>" +
        '<span class="aisle-name">' + TK.esc(group) + "</span>" +
        '<span class="aisle-moves">' +
          '<button type="button" class="icon-btn js-aisle" data-g="' + TK.esc(group) +
            '" data-d="-1"' + (i === 0 ? " disabled" : "") +
            ' aria-label="Move ' + TK.esc(group) + ' earlier">&uarr;</button>' +
          '<button type="button" class="icon-btn js-aisle" data-g="' + TK.esc(group) +
            '" data-d="1"' + (i === order.length - 1 ? " disabled" : "") +
            ' aria-label="Move ' + TK.esc(group) + ' later">&darr;</button>' +
        "</span></li>";
    }).join("");
  }

  aisleEl.addEventListener("click", function (e) {
    const btn = e.target.closest(".js-aisle");
    if (!btn) return;
    TK.moveAisle(btn.getAttribute("data-g"), Number(btn.getAttribute("data-d")));
    renderAisles();
  });

  document.getElementById("reset-aisles").addEventListener("click", function () {
    TK.setAisleOrder(GROCERY_GROUPS.slice());
    renderAisles();
    TK.toast("Aisle order reset.");
  });

  /* ---------- Sending a list to another device ------------------------
     The list rides in the part of the URL after the #, which browsers
     never send to a server. It goes only where the person sends it. */
  document.getElementById("share-list").addEventListener("click", function () {
    const list = TK.getGrocery();
    if (!list.recipes.length && !list.manual.length) {
      TK.toast("This list is empty — add something first.");
      return;
    }
    const url = location.origin + location.pathname + "#list=" + TK.encodeList(list);

    TK.openDialog("Send this list to your phone", (
      "<p>Open this link on your other device and the list arrives as a new " +
      "list there. Ticked items are left behind, so you start the shop fresh.</p>" +
      '<label class="field" for="share-url">Link</label>' +
      '<input type="text" id="share-url" readonly value="' + TK.esc(url) + '">' +
      '<div class="btn-row" style="margin-top:1rem">' +
        '<button type="button" class="btn btn-primary btn-sm" id="copy-url">Copy link</button>' +
        '<button type="button" class="btn btn-ghost btn-sm" id="share-native" hidden>Share&hellip;</button>' +
      "</div>" +
      '<p class="small muted" style="margin-top:1rem">The link contains the list ' +
      "itself, so it works without an account. Anyone you send it to can open it.</p>"
    ));

    const body = TK.dialogBody();
    const field = body.querySelector("#share-url");

    body.querySelector("#copy-url").addEventListener("click", function () {
      field.select();
      const done = function () { TK.toast("Link copied."); TK.closeDialog(); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done, function () {
          document.execCommand("copy"); done();
        });
      } else {
        try { document.execCommand("copy"); done(); }
        catch (e) { TK.toast("Press Ctrl+C to copy the link."); }
      }
    });

    /* Phones can hand straight off to Messages, WhatsApp and so on. */
    if (navigator.share) {
      const nativeBtn = body.querySelector("#share-native");
      nativeBtn.hidden = false;
      nativeBtn.addEventListener("click", function () {
        navigator.share({ title: list.name, url: url }).catch(function () {});
      });
    }
  });

  /* ---------- Arriving from a shared link -----------------------------
     Never imported silently. The person is asked first. */
  function checkIncoming() {
    const m = location.hash.match(/^#list=(.+)$/);
    if (!m) return;

    const data = TK.decodeList(m[1]);
    history.replaceState(null, "", location.pathname);   // tidy the address bar

    const banner = document.getElementById("import-banner");
    if (!data || (!data.recipes.length && !data.manual.length)) {
      document.getElementById("import-title").textContent = "That link could not be read";
      document.getElementById("import-detail").textContent =
        "It may have been shortened or cut off in the message. Ask for it again.";
      document.getElementById("import-accept").hidden = true;
      banner.hidden = false;
      return;
    }

    const n = data.recipes.length + data.manual.length;
    document.getElementById("import-title").textContent = "\u201c" + data.name + "\u201d was shared with you";
    document.getElementById("import-detail").textContent =
      n + (n === 1 ? " item" : " items") + ". Adding it keeps your own lists as they are.";
    banner.hidden = false;

    document.getElementById("import-accept").addEventListener("click", function () {
      TK.importList(data);
      banner.hidden = true;
      renderTabs();
      TK.toast("List added.");
    });
    document.getElementById("import-dismiss").addEventListener("click", function () {
      banner.hidden = true;
    });
  }

  renderTabs();
  renderAisles();
  checkIncoming();
})();
