/* ==========================================================================
   CALORIE NEEDS CALCULATOR
   Mifflin-St Jeor for resting metabolic rate, then an activity multiplier.
   --------------------------------------------------------------------------
   Two things this deliberately does NOT do:

   1. It never presents a single exact number. Equations estimate; bodies
      vary. Everything is shown as a range.
   2. It never generates a very low target. If the arithmetic lands below
      the floor set in LOWER_LIMIT, it stops there and points the person
      towards a healthcare professional instead.
   ========================================================================== */
(function () {
  "use strict";

  const form = document.getElementById("calc-form");
  if (!form) return;

  /* Widely used lower bounds for unsupervised intake in adults.
     Below these, the right answer is a conversation with a professional,
     not a number from a website. */
  const LOWER_LIMIT = { female: 1200, male: 1500, unspecified: 1350 };

  const ACTIVITY_LABELS = {
    "1.2":   "sedentary",
    "1.375": "lightly active",
    "1.55":  "moderately active",
    "1.725": "very active",
    "1.9":   "extremely active"
  };

  const results     = document.getElementById("calc-results");
  const placeholder = document.getElementById("calc-placeholder");
  const noticesEl   = document.getElementById("calc-notices");

  let lastSuggestion = null;

  /* ---------- Validation -------------------------------------------- */
  function validate() {
    const fields = [
      { id: "age",    min: 16,  max: 100, label: "age",
        hint: "Enter an age between 16 and 100. This calculator is written for adults." },
      { id: "height", min: 120, max: 230, label: "height",
        hint: "Enter a height in centimetres, between 120 and 230." },
      { id: "weight", min: 35,  max: 300, label: "weight",
        hint: "Enter a weight in kilograms, between 35 and 300." }
    ];

    let firstBad = null;
    const values = {};

    fields.forEach(function (f) {
      const input = document.getElementById(f.id);
      const error = document.getElementById(f.id + "-error");
      const raw = input.value.trim();
      const n = Number(raw);
      const ok = raw !== "" && isFinite(n) && n >= f.min && n <= f.max;

      if (ok) {
        input.removeAttribute("aria-invalid");
        error.textContent = "";
        values[f.id] = n;
      } else {
        input.setAttribute("aria-invalid", "true");
        error.textContent = raw === ""
          ? "Please enter your " + f.label + "."
          : f.hint;
        if (!firstBad) firstBad = input;
      }
    });

    return { ok: !firstBad, values: values, firstBad: firstBad };
  }

  /* ---------- The maths ---------------------------------------------- */
  function bmr(sex, weight, height, age) {
    const base = 10 * weight + 6.25 * height - 5 * age;
    if (sex === "male") return base + 5;
    if (sex === "female") return base - 161;
    return base - 78; // midpoint of the two, for "prefer not to say"
  }

  function round10(n) { return Math.round(n / 10) * 10; }

  function calculate(v, sex, activity, goal) {
    const restingRate = bmr(sex, v.weight, v.height, v.age);
    const maintenance = restingRate * activity;
    const floor = LOWER_LIMIT[sex];

    let centre, note, flags = { clamped: false, belowResting: false, lowMaintenance: false };

    if (goal === "lose") {
      /* A gentle 15% reduction. Deliberately not the 20-25% that many
         calculators reach for by default. */
      centre = maintenance * 0.85;
      note = "A reduction of around 15% below your estimated maintenance, which is a " +
             "gradual pace. Faster is not better, and is harder to keep up.";
    } else if (goal === "gain") {
      centre = maintenance * 1.10;
      note = "A modest increase above your estimated maintenance.";
    } else {
      centre = maintenance;
      note = "Roughly what would keep your weight where it is.";
    }

    if (maintenance < floor) flags.lowMaintenance = true;

    if (centre < floor) {
      centre = floor;
      flags.clamped = true;
    }
    if (centre < restingRate) flags.belowResting = true;

    const spread = goal === "maintain" ? 100 : 75;
    return {
      resting: Math.round(restingRate),
      maintenance: Math.round(maintenance),
      low: round10(centre - spread),
      high: round10(centre + spread),
      centre: round10(centre),
      note: note,
      flags: flags,
      floor: floor
    };
  }

  /* ---------- Output -------------------------------------------------- */
  function show(r, goal, activity) {
    document.getElementById("r-bmr").textContent = r.resting.toLocaleString() + " kcal";
    document.getElementById("r-tdee").textContent = r.maintenance.toLocaleString() + " kcal";
    document.getElementById("r-range").textContent =
      r.low.toLocaleString() + "–" + r.high.toLocaleString() + " kcal";

    document.getElementById("r-range-note").textContent =
      r.note + " Shown as a range because no equation can know your body exactly; " +
      "as an " + (ACTIVITY_LABELS[String(activity)] || "active") +
      " person, the figure will also move with how your week actually goes.";

    const notices = [];

    if (r.flags.clamped) {
      notices.push(
        '<div class="notice notice-care">' +
          "<h3>This is as low as this calculator goes</h3>" +
          "<p>The arithmetic for that goal came out below " + r.floor.toLocaleString() +
          " kcal, so the suggestion has been held there rather than going lower.</p>" +
          "<p>Intakes below that level are generally not something to take on without " +
          "supervision &mdash; they make it hard to get enough protein, iron, calcium and " +
          "the rest, whatever the total says. If you are aiming for something in that " +
          "region, please talk it through with a GP or a registered dietitian who can " +
          "look at your full picture. That is a better use of your effort than a smaller " +
          "number from a website.</p>" +
        "</div>"
      );
    }

    if (r.flags.lowMaintenance) {
      notices.push(
        '<div class="notice notice-warn">' +
          "<h3>Worth checking with someone</h3>" +
          "<p>Your estimated maintenance came out unusually low. That can happen with " +
          "the equation at certain combinations of height, weight and age, but it is " +
          "worth having a professional look at rather than planning around it.</p>" +
        "</div>"
      );
    } else if (r.flags.belowResting) {
      notices.push(
        '<div class="notice notice-warn">' +
          "<h3>Below your resting needs</h3>" +
          "<p>This suggestion sits under the energy your body uses at complete rest. " +
          "That is not automatically wrong for a short period, but it is a reason to " +
          "check in with a healthcare professional rather than run with it indefinitely.</p>" +
        "</div>"
      );
    }

    if (goal === "lose" && !r.flags.clamped) {
      notices.push(
        '<div class="notice">' +
          "<h3>Adjust from here, don&rsquo;t chase it</h3>" +
          "<p>Treat this as a starting point for a few weeks, then look at how you " +
          "actually feel &mdash; energy, hunger, sleep, mood, whether you can train and " +
          "concentrate. Those tell you more than the equation does. Keeping protein and " +
          "fibre up makes a smaller total considerably easier to live with.</p>" +
        "</div>"
      );
    }

    noticesEl.innerHTML = notices.join("");
    results.hidden = false;
    placeholder.hidden = true;
    lastSuggestion = r.centre;

    results.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  /* ---------- Events --------------------------------------------------- */
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const check = validate();
    if (!check.ok) {
      check.firstBad.focus();
      results.hidden = true;
      placeholder.hidden = false;
      return;
    }
    const sex = form.querySelector('input[name="sex"]:checked').value;
    const activity = Number(document.getElementById("activity").value);
    const goal = document.getElementById("goal").value;
    show(calculate(check.values, sex, activity, goal), goal, activity);
  });

  document.getElementById("calc-reset").addEventListener("click", function () {
    form.reset();
    ["age", "height", "weight"].forEach(function (id) {
      document.getElementById(id).removeAttribute("aria-invalid");
      document.getElementById(id + "-error").textContent = "";
    });
    results.hidden = true;
    placeholder.hidden = false;
    lastSuggestion = null;
  });

  document.getElementById("use-target").addEventListener("click", function () {
    if (!lastSuggestion) return;
    TK.setTarget(lastSuggestion);
    TK.toast("Planning target set to " + lastSuggestion.toLocaleString() + " kcal.",
             "build.html", "Build my day");
  });

  /* Clear an error as soon as the person starts fixing it */
  ["age", "height", "weight"].forEach(function (id) {
    document.getElementById(id).addEventListener("input", function () {
      const input = document.getElementById(id);
      if (input.getAttribute("aria-invalid")) {
        input.removeAttribute("aria-invalid");
        document.getElementById(id + "-error").textContent = "";
      }
    });
  });
})();
