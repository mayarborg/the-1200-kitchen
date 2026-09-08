/* ==========================================================================
   BUILD MY DAY
   The meal planner. Four slots, a target you set yourself, running totals,
   and suggestions sized to whatever is left.
   ========================================================================== */
(function () {
  "use strict";

  const slotsEl = document.getElementById("slots");
  if (!slotsEl) return;

  const DIAL_CIRCUMFERENCE = 2 * Math.PI * 50;

  const SUGGESTION_FILTERS = [
    { id: "all",  label: "Anything",      test: function () { return true; } },
    { id: "u100", label: "Under 100 kcal", test: function (r) { return r.nutrition.calories < 100; } },
    { id: "u200", label: "Under 200 kcal", test: function (r) { return r.nutrition.calories < 200; } },
    { id: "u300", label: "Under 300 kcal", test: function (r) { return r.nutrition.calories < 300; } },
    { id: "u400", label: "Under 400 kcal", test: function (r) { return r.nutrition.calories < 400; } },
    { id: "prot", label: "High protein",   test: function (r) { return r.nutrition.protein >= 20; } }
  ];
  let activeSuggestion = "all";

  /* ---------- Slots -------------------------------------------------- */
  function renderSlots() {
    const day = TK.getDay();

    slotsEl.innerHTML = TK.SLOTS.map(function (slot) {
      const items = day[slot.key];
      const total = TK.slotTotal(slot.key);

      const rows = items.length
        ? items.map(function (entry, i) { return slotItem(slot, entry, i); }).join("")
        : '<li class="slot-empty">' + emptyCopy(slot.key) + "</li>";

      return (
        '<section class="meal-slot">' +
          '<div class="meal-slot-head">' +
            "<h2>" + slot.label + "</h2>" +
            '<span class="meal-slot-kcal">' + (total ? total.toLocaleString() + " kcal" : "&mdash;") + "</span>" +
          "</div>" +
          '<ul class="slot-items">' + rows + "</ul>" +
          '<div class="slot-foot">' +
            '<button type="button" class="btn btn-secondary btn-sm js-pick" data-slot="' + slot.key + '">' +
              (items.length ? "Add another" : "Choose a " + slot.label.toLowerCase().replace(/s$/, "")) +
            "</button>" +
          "</div>" +
        "</section>"
      );
    }).join("");
  }

  function emptyCopy(key) {
    return {
      breakfast: "No breakfast yet. Something small counts.",
      lunch:     "No lunch yet.",
      dinner:    "No dinner yet.",
      snacks:    "No snacks yet. Add as many as you like."
    }[key];
  }

  function slotItem(slot, entry, index) {
    const r = TK.getRecipe(entry.id);
    const q = entry.qty;
    return (
      '<li class="slot-item">' +
        '<img src="' + TK.esc(r.image) + '" alt="" width="64" height="52">' +
        "<div>" +
          '<div class="slot-item-name">' +
            '<a href="recipe.html?id=' + encodeURIComponent(r.id) + '">' + TK.esc(r.name) + "</a>" +
            (q > 1 ? " &times;" + q : "") +
          "</div>" +
          '<div class="slot-item-macros">' +
            TK.kcal(r, q) + " kcal &middot; " +
            TK.approx(r, r.nutrition.protein * q) + " g protein &middot; " +
            TK.approx(r, r.nutrition.carbs * q) + " g carbs &middot; " +
            TK.approx(r, r.nutrition.fat * q) + " g fat" +
          "</div>" +
        "</div>" +
        '<div class="slot-item-tools">' +
          '<button type="button" class="icon-btn js-qty" data-slot="' + slot.key + '" data-i="' + index +
            '" data-delta="-1" aria-label="One fewer serving of ' + TK.esc(r.name) + '">&minus;</button>' +
          '<button type="button" class="icon-btn js-qty" data-slot="' + slot.key + '" data-i="' + index +
            '" data-delta="1" aria-label="One more serving of ' + TK.esc(r.name) + '">+</button>' +
          '<button type="button" class="icon-btn js-move" data-slot="' + slot.key + '" data-i="' + index +
            '" aria-label="Move ' + TK.esc(r.name) + ' to another meal">&#8646;</button>' +
          '<button type="button" class="icon-btn js-remove" data-slot="' + slot.key + '" data-i="' + index +
            '" aria-label="Remove ' + TK.esc(r.name) + '">&times;</button>' +
        "</div>" +
      "</li>"
    );
  }

  /* ---------- Summary ------------------------------------------------ */
  function renderSummary() {
    const totals = TK.dayTotals();
    const target = TK.getTarget();
    const remaining = target - totals.calories;

    const dial = document.getElementById("build-dial");
    const pct = target > 0 ? Math.min(totals.calories / target, 1) : 0;
    dial.style.strokeDasharray = DIAL_CIRCUMFERENCE.toFixed(1);
    dial.style.strokeDashoffset = (DIAL_CIRCUMFERENCE * (1 - pct)).toFixed(1);
    dial.classList.toggle("is-over", totals.calories > target);

    document.getElementById("build-kcal").textContent = totals.calories.toLocaleString();
    document.getElementById("build-of").textContent = "of " + target.toLocaleString() + " kcal";
    document.getElementById("build-protein").textContent = totals.protein + " g";
    document.getElementById("build-carbs").textContent = totals.carbs + " g";
    document.getElementById("build-fat").textContent = totals.fat + " g";

    const line = document.getElementById("remaining-line");
    const value = document.getElementById("remaining-value");
    line.classList.remove("is-over", "is-met");
    if (remaining > 0) {
      line.querySelector(".remaining-label").textContent = "Remaining";
      value.textContent = remaining.toLocaleString() + " kcal";
    } else if (remaining === 0) {
      line.classList.add("is-met");
      line.querySelector(".remaining-label").textContent = "Target";
      value.textContent = "Exactly met";
    } else {
      line.classList.add("is-over");
      line.querySelector(".remaining-label").textContent = "Over target by";
      value.textContent = Math.abs(remaining).toLocaleString() + " kcal";
    }

    document.getElementById("build-live").textContent =
      totals.calories + " of " + target + " kilocalories planned. " +
      (remaining >= 0 ? remaining + " remaining." : Math.abs(remaining) + " over.");

    const targetInput = document.getElementById("target-input");
    if (document.activeElement !== targetInput) targetInput.value = target;
  }

  /* ---------- Suggestions -------------------------------------------- */
  function renderSuggestions() {
    const totals = TK.dayTotals();
    const target = TK.getTarget();
    const remaining = target - totals.calories;
    const intro = document.getElementById("suggestions-intro");
    const list = document.getElementById("suggestions");

    document.getElementById("suggestion-filters").innerHTML = SUGGESTION_FILTERS.map(function (f) {
      return '<button type="button" class="chip js-sug" data-f="' + f.id + '"' +
        ' aria-pressed="' + (activeSuggestion === f.id ? "true" : "false") + '">' + f.label + "</button>";
    }).join("");

    if (remaining <= 0) {
      intro.textContent = totals.items
        ? "Your day is full. Remove or swap something to make room."
        : "Add a meal and suggestions will appear here.";
      list.innerHTML = "";
      return;
    }

    intro.textContent = "You have about " + remaining.toLocaleString() +
      " kcal left. These fit.";

    const filter = SUGGESTION_FILTERS.filter(function (f) { return f.id === activeSuggestion; })[0];

    /* Things that fit come first, largest first — using the space well is
       more useful than a list of tiny snacks. Anything that doesn't fit
       follows, so the panel is never empty. */
    const candidates = TK.allRecipes()
      .filter(filter.test)
      .map(function (r) {
        return { r: r, fits: r.nutrition.calories <= remaining };
      })
      .sort(function (a, b) {
        if (a.fits !== b.fits) return a.fits ? -1 : 1;
        return a.fits
          ? b.r.nutrition.calories - a.r.nutrition.calories
          : a.r.nutrition.calories - b.r.nutrition.calories;
      })
      .slice(0, 6);

    if (!candidates.length) {
      list.innerHTML = '<li class="suggestion"><span class="suggestion-name">' +
        "Nothing matches that filter.</span></li>";
      return;
    }

    list.innerHTML = candidates.map(function (c) {
      const r = c.r;
      return (
        '<li class="suggestion">' +
          "<div>" +
            '<div class="suggestion-name">' +
              '<a href="recipe.html?id=' + encodeURIComponent(r.id) + '" style="color:inherit;text-decoration:none">' +
              TK.esc(r.name) + "</a></div>" +
            '<div class="suggestion-meta">' + TK.kcal(r) + " kcal &middot; " +
              TK.approx(r, r.nutrition.protein) + " g protein" +
              (c.fits ? "" : " &middot; over what's left") + "</div>" +
          "</div>" +
          '<button type="button" class="btn btn-primary btn-sm js-add-day" data-id="' + TK.esc(r.id) + '">Add</button>' +
        "</li>"
      );
    }).join("");
  }

  /* ---------- The recipe picker -------------------------------------- */
  function openPicker(slotKey) {
    const slot = TK.SLOTS.filter(function (s) { return s.key === slotKey; })[0];

    const head =
      '<div class="search-field">' +
        '<label class="visually-hidden" for="picker-q">Search recipes</label>' +
        '<input type="search" id="picker-q" placeholder="Search by name or ingredient" autocomplete="off">' +
      "</div>";

    TK.openDialog("Add to " + slot.label.toLowerCase(), '<ul class="picker-list" id="picker-list"></ul>', head);

    const input = document.getElementById("picker-q");
    const listEl = document.getElementById("picker-list");

    /* Recipes that suit this slot float to the top, but everything stays
       reachable — a bowl for breakfast is a legitimate choice. */
    function score(r) {
      if (slotKey === "breakfast") return r.category === "Breakfasts" ? 0 : 1;
      if (slotKey === "snacks") return r.category === "Snacks & Sweet Things" ? 0 : (r.nutrition.calories <= 200 ? 1 : 2);
      if (r.category === "Breakfasts" || r.category === "Snacks & Sweet Things") return 2;
      return 0;
    }

    function draw() {
      const q = (input.value || "").toLowerCase().trim();
      const list = TK.allRecipes()
        .filter(function (r) {
          if (!q) return true;
          const blob = (r.name + " " + r.category + " " + (r.tags || []).join(" ") + " " +
            r.ingredients.map(function (i) { return i.item; }).join(" ")).toLowerCase();
          return blob.indexOf(q) !== -1;
        })
        .sort(function (a, b) {
          const d = score(a) - score(b);
          return d !== 0 ? d : a.name.localeCompare(b.name);
        });

      listEl.innerHTML = list.length
        ? list.map(function (r) {
            return "<li>" +
              '<button type="button" class="picker-option js-pick-one" data-id="' + TK.esc(r.id) + '">' +
                '<img src="' + TK.esc(r.image) + '" alt="" width="72" height="58">' +
                "<span>" +
                  '<span class="po-name">' + TK.esc(r.name) + "</span><br>" +
                  '<span class="po-meta">' + TK.kcal(r) + " kcal &middot; " +
                    TK.approx(r, r.nutrition.protein) + " g protein &middot; " +
                    TK.esc(r.category) + "</span>" +
                "</span>" +
                '<span class="po-add">Add</span>' +
              "</button></li>";
          }).join("")
        : '<li class="slot-empty">Nothing matches that. Try an ingredient instead.</li>';
    }

    input.addEventListener("input", draw);
    listEl.addEventListener("click", function (e) {
      const btn = e.target.closest(".js-pick-one");
      if (!btn) return;
      const id = btn.getAttribute("data-id");
      TK.addToDay(id, slotKey);
      TK.closeDialog();
      TK.toast(TK.getRecipe(id).name + " added to " + slot.label.toLowerCase() + ".");
    });
    draw();
    input.focus();
  }

  function openMove(fromSlot, index) {
    const day = TK.getDay();
    const entry = day[fromSlot][index];
    if (!entry) return;
    const r = TK.getRecipe(entry.id);

    const body = '<ul class="picker-list">' + TK.SLOTS.map(function (s) {
      if (s.key === fromSlot) return "";
      return "<li><button type=\"button\" class=\"picker-option js-move-to\" data-to=\"" + s.key + "\">" +
        '<span aria-hidden="true" style="width:72px;text-align:center;font-size:1.4rem">&#8646;</span>' +
        '<span><span class="po-name">Move to ' + s.label.toLowerCase() + "</span></span>" +
        '<span class="po-add">Move</span></button></li>';
    }).join("") + "</ul>";

    TK.openDialog("Move " + r.name, body);

    TK.dialogBody().addEventListener("click", function (e) {
      const btn = e.target.closest(".js-move-to");
      if (!btn) return;
      TK.moveInDay(fromSlot, index, btn.getAttribute("data-to"));
      TK.closeDialog();
      TK.toast(r.name + " moved.");
    });
  }

  /* ---------- Events -------------------------------------------------- */
  slotsEl.addEventListener("click", function (e) {
    const pick = e.target.closest(".js-pick");
    if (pick) { openPicker(pick.getAttribute("data-slot")); return; }

    const qty = e.target.closest(".js-qty");
    if (qty) {
      const slot = qty.getAttribute("data-slot");
      const i = Number(qty.getAttribute("data-i"));
      const delta = Number(qty.getAttribute("data-delta"));
      const current = TK.getDay()[slot][i];
      if (current) TK.setDayQty(slot, i, current.qty + delta);
      return;
    }

    const move = e.target.closest(".js-move");
    if (move) { openMove(move.getAttribute("data-slot"), Number(move.getAttribute("data-i"))); return; }

    const remove = e.target.closest(".js-remove");
    if (remove) {
      const slot = remove.getAttribute("data-slot");
      const i = Number(remove.getAttribute("data-i"));
      const entry = TK.getDay()[slot][i];
      const name = entry ? TK.getRecipe(entry.id).name : "That";
      TK.removeFromDay(slot, i);
      TK.toast(name + " removed.");
    }
  });

  document.getElementById("suggestion-filters").addEventListener("click", function (e) {
    const btn = e.target.closest(".js-sug");
    if (!btn) return;
    activeSuggestion = btn.getAttribute("data-f");
    renderSuggestions();
  });

  const targetInput = document.getElementById("target-input");
  targetInput.addEventListener("input", function () {
    const v = Number(targetInput.value);
    if (v >= 800 && v <= 6000) TK.setTarget(v);
  });
  targetInput.addEventListener("blur", function () {
    const v = Number(targetInput.value);
    if (!(v >= 800 && v <= 6000)) {
      targetInput.value = TK.getTarget();
      TK.toast("Targets on this planner run from 800 to 6,000 kcal.");
    }
  });

  document.getElementById("reset-day").addEventListener("click", function () {
    if (TK.dayTotals().items === 0) { TK.toast("There is nothing to reset yet."); return; }
    if (window.confirm("Clear every meal from today? Your target and grocery list are kept.")) {
      TK.resetDay();
      TK.toast("The day has been reset.");
    }
  });

  document.getElementById("day-to-grocery").addEventListener("click", function () {
    const entries = TK.dayEntries();
    if (!entries.length) { TK.toast("Add a meal first, then send the day to your list."); return; }
    const seen = {};
    entries.forEach(function (row) {
      if (seen[row.entry.id]) return;
      seen[row.entry.id] = true;
      const totalQty = entries
        .filter(function (x) { return x.entry.id === row.entry.id; })
        .reduce(function (s, x) { return s + x.entry.qty; }, 0);
      TK.addRecipeToGrocery(row.entry.id, totalQty);
    });
    TK.toast("Today's ingredients added to your grocery list.", "grocery.html", "See the list");
  });

  /* ---------- Go ------------------------------------------------------ */
  function renderAll() {
    renderSlots();
    renderSummary();
    renderSuggestions();
  }
  document.addEventListener("tk:change", function (e) {
    if (e.detail && e.detail.key === TK.KEYS.grocery) return; // grocery changes don't affect this page
    renderAll();
  });
  renderAll();
})();
