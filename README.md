# The 1,200 Kitchen

Small portions. Big flavour. Meals that actually satisfy.

A static recipe site with a meal planner, calorie calculator, grocery-list
generator and ingredient matcher. Plain HTML, CSS and vanilla JavaScript —
no framework, no build step, no dependencies, no API keys, nothing to pay for.

---

## Running it locally

**The quick way.** Double-click `index.html`. Everything works from the file
system, including saving.

**The better way.** Serve it over HTTP, which is closer to how it will behave
once it's live:

```bash
cd the-1200-kitchen
python3 -m http.server 8000
```

Then open `http://localhost:8000`. Any of these work equally well:

```bash
npx serve .          # if you have Node installed
php -S localhost:8000
```

To edit, open the folder in VS Code, install the **Live Server** extension and
click "Go Live". It reloads the page every time you save.

---

## Putting it online with GitHub Pages

Free, and takes about five minutes.

1. **Create the repository.** On GitHub, click *New repository*. Name it
   whatever you like, set it to **Public**, and don't add a README (there's one
   here already).

2. **Upload the files.** Either drag the contents of this folder into the
   upload box on GitHub, or from the command line:

   ```bash
   cd the-1200-kitchen
   git init
   git add .
   git commit -m "The 1,200 Kitchen, version 1"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
   git push -u origin main
   ```

   Upload the *contents* of the folder, not the folder itself — `index.html`
   must sit at the top level of the repository.

3. **Turn Pages on.** In the repository, go to **Settings → Pages**. Under
   *Source*, choose **Deploy from a branch**. Set the branch to `main` and the
   folder to `/ (root)`. Save.

4. **Wait a minute.** The site appears at
   `https://YOUR-USERNAME.github.io/YOUR-REPO/`. GitHub shows the link on that
   same settings page once it's built.

To update it afterwards, edit a file and push again — or edit it directly on
GitHub and commit. The live site updates within a minute.

**A custom domain** (like `the1200kitchen.com`) works too: buy the domain, add
it under Settings → Pages → Custom domain, and point a CNAME record at
`YOUR-USERNAME.github.io` with your registrar. HTTPS is free and automatic.

Netlify and Cloudflare Pages both work identically — drag the folder onto their
dashboard and it deploys. No build command, no output directory.

---

## The files

```
index.html          Home — hero, live day panel, featured recipes
recipes.html        The library — search, filters, sorting
recipe.html         A single recipe (uses ?id=recipe-name)
build.html          Build My Day — the meal planner
calculator.html     Calorie needs calculator
grocery.html        Grocery list
fridge.html         What's In My Fridge?
nutrition.html      Nutrition basics
about.html          The introduction and philosophy

css/
  style.css         Everything visual. Numbered sections, colours at the top.

js/
  recipes.js        ← THE ONLY FILE YOU NEED TO EDIT TO ADD FOOD
  app.js            Shared: storage, the day, recipe cards, dialogs, toasts
  home.js           Home page
  recipes-page.js   Search, filter, sort
  recipe-detail.js  Recipe pages, scaling, printing, structured data
  build.js          Meal planner and suggestions
  calculator.js     Mifflin-St Jeor and the safety limits
  grocery.js        List building, ticking, printing
  fridge.js         Ingredient matching

images/             One SVG per recipe. Swap these for photographs.
.nojekyll           Tells GitHub Pages to serve the files as they are
```

---

## Adding a recipe

Open `js/recipes.js`, copy any existing recipe object, paste it into the
`RECIPES` array and change the values. Save, refresh.

That's the whole process. The new recipe appears automatically in the library,
the search index, the meal planner's picker, the fridge matcher's ingredient
list and the grocery list. Nothing else needs touching.

The top of `recipes.js` documents every field. The important ones:

- **`id`** — lowercase with hyphens. This becomes the page URL, so keep it
  readable and don't change it once you've shared a link.
- **`nutritionStatus`** — `"verified"` if the numbers came off actual packaging,
  `"estimated"` otherwise. Estimated figures display with a `~` in front so
  readers know they're approximate. Round them to the nearest 5 kcal.
- **`group`** on each ingredient — which aisle it belongs to on the grocery
  list. Must match one of the strings in `GROCERY_GROUPS` at the bottom of
  the file.
- **`staple: true`** — for salt, pepper, oil and seasonings. Staples are
  ignored by What's In My Fridge, so "90% match" means ninety per cent of the
  things you'd actually need to buy.

### Adding a category

Add the name to the `CATEGORIES` array at the bottom of `recipes.js`. The
navigation, filters and home page tiles all read from that list.

---

## Replacing the images

The pictures are placeholder SVG illustrations so the site has something to
show before you shoot any food. To swap one in:

1. Put your photograph in `images/`.
2. Change that recipe's `image` field to the new filename.
3. Update `imageAlt` to describe what's actually in the photograph.

Cards use a 4:3 crop. Around 1200 × 900 px is plenty; anything larger just
slows the page down. Save as WebP or JPEG at about 80% quality.

Please do write real alt text. It's what screen-reader users get instead of the
picture, and search engines read it too.

---

## What gets saved, and where

Everything lives in the browser's `localStorage` on the visitor's own device.
No account, no server, no cookies, nothing sent anywhere.

| Key | What it holds |
|---|---|
| `tk.target` | Daily calorie target |
| `tk.day` | The meals currently planned |
| `tk.grocery` | Recipes on the list, manual items, what's ticked |
| `tk.favourites` | Saved recipes |
| `tk.fridge` | Ingredients ticked on the fridge page |

If storage is unavailable — some browsers block it in private mode — the site
still works normally, it just forgets between visits.

To wipe everything while testing, open the browser console and run
`localStorage.clear()`.

---

## Two things built in on purpose

**Nutrition is labelled, not invented.** Every recipe declares whether its
numbers came from a packet or from generic ingredient values, and estimates
display as `~360 kcal` rather than `361.47 kcal`. False precision is worse than
admitted uncertainty.

**The calculator won't produce a very low target.** It uses a gentle 15%
reduction for weight loss rather than the 20–25% many calculators default to,
and it will not return a figure below 1,200 kcal for women or 1,500 for men. If
the arithmetic lands lower, it stops at the floor and suggests speaking to a GP
or dietitian instead. The floors are set in one place — `LOWER_LIMIT` at the top
of `js/calculator.js` — should you ever need to look at them.

---

## Things you might add next

The code is structured so these don't need a rewrite:

- **More recipes** — hundreds, if you like. Nothing loops over the array in a
  way that would slow down.
- **Weekly planning** — `tk.day` is a plain object. Store seven of them, keyed
  by date.
- **Recipe images at multiple sizes** — swap `<img src>` for `<picture>` in the
  `recipeCard` function in `app.js`; one change covers every card on the site.
- **A sitemap** — once you have a domain, list the nine pages plus one
  `recipe.html?id=…` URL per recipe.
- **PDF export** — the print stylesheet already produces a clean recipe sheet;
  "Print → Save as PDF" works today.
- **User accounts** — every read and write goes through the storage functions
  at the top of `app.js`. Point those at an API and the rest of the site
  doesn't notice.

Version 1 deliberately stops short of all of it.

---

## Browser support

Anything current: Chrome, Edge, Firefox, Safari, and their mobile versions.
Uses `aspect-ratio`, CSS custom properties and `Element.closest()`, all of
which have been widely supported for years.

---

## A note on the numbers

The nutrition information on this site is for general information only.
Calorie and nutrient requirements vary between individuals. The calculator
provides an estimate, not medical or dietary advice. If you have specific
nutritional, medical or dietary needs, consult an appropriately qualified
healthcare professional.
