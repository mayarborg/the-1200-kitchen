/* ==========================================================================
   THE 1,200 KITCHEN — RECIPE DATA
   ==========================================================================

   This is the only file you need to edit to add, change or remove a recipe.
   Nothing in the design depends on how many recipes are in here.

   TO ADD A RECIPE
   ---------------
   Copy any object below, paste it into the RECIPES array, change the values.
   Save. Refresh the browser. It appears everywhere automatically:
   the recipe library, Build My Day, the grocery list and What's In My Fridge.

   FIELD REFERENCE
   ---------------
   id              Unique, lowercase, hyphens only. Used in the page URL.
   name            Display name.
   category        Must match one of the CATEGORIES list at the bottom.
   kind            "recipe" for a full recipe, "quick" for a simple entry
                   (a biscuit, a bowl of cereal). Quick entries look different
                   on the page and don't show a method.
   description     One or two sentences. Shown on cards and recipe pages.
   image           Path to the picture. Swap these for your own photos.
   imageAlt        Describes the picture for screen readers. Always write one.
   servings        How many portions the whole recipe makes.
   servingNote     Optional. What one portion actually looks like.
   nutrition       Per serving: calories, protein, carbs, fat, fibre (grams).
   nutritionStatus "verified"  = taken from actual product nutrition labels
                   "estimated" = generic ingredient values, shown with a ~
   nutritionNote   Optional. Explains where the numbers came from.
   prepTime        Minutes.
   cookTime        Minutes. Use 0 for no-cook.
   difficulty      "Easy", "Moderate" or "Confident".
   dietary         Badges: "Vegetarian", "Vegan", "Pescatarian",
                   "Gluten-free", "High protein", "Lactose-free"
   tags            Free-form words used by search. Add whatever helps.
   ingredients     One object per ingredient, for the WHOLE recipe:
                     item    What it's called on the shelf.
                     qty     A number, or null for "to taste".
                     unit    "g", "ml", "tbsp", "tsp", "" (for whole items).
                     group   Grocery aisle. One of: "Produce",
                             "Protein & Dairy", "Pantry", "Bakery & Chilled",
                             "Herbs & Spices".
                     note    Optional. Brand, prep instruction, anything.
                     staple  true for salt, pepper, oil, seasonings. Staples
                             are ignored by What's In My Fridge, because
                             everyone has them.
   method          Array of steps, in order. Leave empty [] for quick entries.

   A NOTE ON THE NUMBERS
   ---------------------
   Don't invent precision. If you haven't read the figure off a packet,
   leave nutritionStatus as "estimated" and round to the nearest 5 kcal.
   The site shows a ~ in front of estimated numbers so readers know.
   ========================================================================== */

const RECIPES = [

  /* ------------------------------------------------------------------
     RECIPE 01
     ------------------------------------------------------------------ */
  {
    id: "feta-tomato-pesto-tart",
    name: "Feta, Tomato & Pesto Pastry Tart",
    category: "Bakes & Savoury",
    kind: "recipe",
    description: "Puff pastry with a layer of pesto, a soft baked feta and yoghurt filling, and tomatoes that go jammy in the oven. Cuts into four generous slices.",
    image: "images/feta-tomato-pesto-tart.svg",
    imageAlt: "A rectangular puff pastry tart topped with baked feta filling and roasted tomato halves",
    servings: 4,
    servingNote: "¼ of the tart, roughly 100–110 g",
    nutrition: { calories: 400, protein: 10, carbs: 23, fat: 30, fibre: 2 },
    nutritionStatus: "estimated",
    nutritionNote: "Built from the puff pastry label (396 kcal per 100 g) and the lactose-free 2% Greek yoghurt label (70 kcal per 100 g). The feta, pesto and tomato figures are generic values and will shift depending on the brands you buy.",
    prepTime: 15,
    cookTime: 30,
    difficulty: "Easy",
    dietary: ["Vegetarian"],
    tags: ["tart", "pastry", "sharing", "oven", "make ahead", "feta", "pesto"],
    ingredients: [
      { item: "Puff pastry", qty: 230, unit: "g", group: "Bakery & Chilled", note: "1 × True Mulini Pasta Sfoglia Fresca Rotonda" },
      { item: "Feta", qty: 100, unit: "g", group: "Protein & Dairy", note: "half a standard block" },
      { item: "Eggs", qty: 2, unit: "", group: "Protein & Dairy" },
      { item: "Greek yoghurt", qty: 2, unit: "tbsp", group: "Protein & Dairy", note: "lactose-free 2%" },
      { item: "Pesto", qty: 50, unit: "g", group: "Pantry" },
      { item: "Tomatoes", qty: 200, unit: "g", group: "Produce", note: "diced" },
      { item: "Salt", qty: null, unit: "", group: "Herbs & Spices", staple: true },
      { item: "Black pepper", qty: null, unit: "", group: "Herbs & Spices", staple: true }
    ],
    method: [
      "Heat the oven to 200°C. Lay the puff pastry into a tart dish and roll the edges in on themselves to make a rim.",
      "Bake the empty case until it's lightly golden, about 10 minutes.",
      "While it bakes, mash the feta with the eggs and yoghurt until you have a rough, spoonable mixture. Season with pepper — the feta brings enough salt on its own.",
      "Spread the pesto over the base of the warm pastry, right up to the rim.",
      "Spoon the feta mixture over the pesto and level it out.",
      "Scatter the diced tomatoes across the top and press them in slightly.",
      "Back into the oven at 200°C for 18–20 minutes, until the filling is set and the edges are deep golden.",
      "Rest for five minutes, then cut into four."
    ]
  },

  /* ------------------------------------------------------------------
     RECIPE 02
     ------------------------------------------------------------------ */
  {
    id: "cajun-crunch-bowl",
    name: "Cajun Crunch Bowl",
    category: "Bowls & Salads",
    kind: "recipe",
    description: "Charred beans and sweetcorn, Cajun beef, a quick Greek salad and a spiced yoghurt drizzle. Everything hits a different texture.",
    image: "images/cajun-crunch-bowl.svg",
    imageAlt: "A bowl of rice topped with spiced minced beef, charred beans, chopped cucumber and tomato, and a yoghurt drizzle",
    servings: 1,
    servingNote: "One full bowl",
    nutrition: { calories: 325, protein: 28, carbs: 30, fat: 10, fibre: 6 },
    nutritionStatus: "estimated",
    nutritionNote: "Generic ingredient values. The 5% minced beef and the lactose-free 2% Greek yoghurt are the two figures most worth replacing with your own labels.",
    prepTime: 10,
    cookTime: 15,
    difficulty: "Easy",
    dietary: ["High protein", "Lactose-free"],
    tags: ["cajun", "beef", "bowl", "high protein", "meal prep", "lunch", "spicy"],
    ingredients: [
      { item: "Rice", qty: 50, unit: "g", group: "Pantry", note: "cooked weight" },
      { item: "Minced beef", qty: 70, unit: "g", group: "Protein & Dairy", note: "5% lean" },
      { item: "Chickpeas", qty: 20, unit: "g", group: "Pantry", note: "drained" },
      { item: "Kidney beans", qty: 20, unit: "g", group: "Pantry", note: "drained" },
      { item: "Sweetcorn", qty: 20, unit: "g", group: "Pantry", note: "drained" },
      { item: "Cucumber", qty: 70, unit: "g", group: "Produce", note: "diced" },
      { item: "Cherry tomatoes", qty: 70, unit: "g", group: "Produce", note: "halved" },
      { item: "Feta", qty: 15, unit: "g", group: "Protein & Dairy", note: "crumbled" },
      { item: "Greek yoghurt", qty: 40, unit: "g", group: "Protein & Dairy", note: "lactose-free 2%" },
      { item: "Cajun seasoning", qty: null, unit: "", group: "Herbs & Spices", staple: true },
      { item: "Soy sauce", qty: null, unit: "", group: "Pantry", note: "a dash", staple: true },
      { item: "Salt", qty: null, unit: "", group: "Herbs & Spices", staple: true },
      { item: "Black pepper", qty: null, unit: "", group: "Herbs & Spices", staple: true }
    ],
    method: [
      "Brown the minced beef in a dry pan with a good shake of Cajun seasoning, breaking it up as it cooks.",
      "Take the pan off the heat and stir through a dash of soy sauce, salt, pepper and a little more Cajun. Tip the beef into a bowl and set aside.",
      "In the same pan, still over a high heat, dry-fry the chickpeas, kidney beans and sweetcorn until they blister and char at the edges.",
      "Cook the rice, or reheat it if you've got some ready.",
      "Start the bowl with the rice.",
      "Add the seasoned beef alongside it.",
      "Toss the cucumber and tomatoes together with most of the feta.",
      "Add the salad to the bowl, then the charred beans and corn.",
      "Loosen the Greek yoghurt with a pinch of Cajun seasoning and drizzle it over.",
      "Finish with the last of the feta."
    ]
  },

  /* ------------------------------------------------------------------
     RECIPE 03
     ------------------------------------------------------------------ */
  {
    id: "golden-hour-bowl",
    name: "Golden Hour Bowl",
    category: "Bowls & Salads",
    kind: "recipe",
    description: "Grilled halloumi, roasted sweet potato, crispy chickpeas and fresh vegetables with a creamy tahini-lime yoghurt dressing.",
    image: "images/golden-hour-bowl.svg",
    imageAlt: "A bowl of roasted sweet potato, grilled halloumi, crispy chickpeas, couscous and salad with a pale dressing",
    servings: 2,
    servingNote: "Half the bowl, dressing on the side",
    nutrition: { calories: 360, protein: 18, carbs: 36, fat: 18, fibre: 7 },
    nutritionStatus: "estimated",
    nutritionNote: "These figures are a working estimate until the exact product labels are entered. Halloumi in particular varies a lot between brands — worth checking yours.",
    prepTime: 15,
    cookTime: 25,
    difficulty: "Easy",
    dietary: ["Vegetarian"],
    tags: ["halloumi", "sweet potato", "chickpeas", "tahini", "packed lunch", "meal prep", "bowl"],
    ingredients: [
      { item: "Halloumi", qty: 60, unit: "g", group: "Protein & Dairy" },
      { item: "Sweet potato", qty: 150, unit: "g", group: "Produce", note: "cubed" },
      { item: "Couscous", qty: 30, unit: "g", group: "Pantry", note: "dry weight" },
      { item: "Chickpeas", qty: 50, unit: "g", group: "Pantry", note: "drained and patted dry" },
      { item: "Peppers", qty: 100, unit: "g", group: "Produce", note: "sliced" },
      { item: "Cherry tomatoes", qty: 100, unit: "g", group: "Produce", note: "halved" },
      { item: "Cucumber", qty: 100, unit: "g", group: "Produce", note: "diced" },
      { item: "Iceberg lettuce", qty: 80, unit: "g", group: "Produce", note: "shredded" },
      { item: "Feta", qty: 20, unit: "g", group: "Protein & Dairy", note: "crumbled" },
      { item: "Greek yoghurt", qty: 60, unit: "g", group: "Protein & Dairy", note: "lactose-free 2%, for the dressing" },
      { item: "Tahini", qty: 10, unit: "g", group: "Pantry", note: "for the dressing" },
      { item: "Lime", qty: 1, unit: "", group: "Produce", note: "juice only" },
      { item: "Cajun seasoning", qty: null, unit: "", group: "Herbs & Spices", staple: true },
      { item: "Salt", qty: null, unit: "", group: "Herbs & Spices", staple: true },
      { item: "Black pepper", qty: null, unit: "", group: "Herbs & Spices", staple: true }
    ],
    method: [
      "Cube the sweet potato into pieces about the size of a dice.",
      "Toss them with Cajun seasoning, salt and pepper.",
      "Roast at 200°C or air-fry at 190°C for 20–25 minutes, until the edges are properly golden.",
      "Season the drained chickpeas and pan-fry them over a high heat until they crisp and pop.",
      "Grill or pan-fry the halloumi until deep golden on both sides. Don't move it around — let it sit and colour.",
      "Throw the peppers into the same pan for two minutes, just to soften and catch a little colour.",
      "Cover the couscous with boiling water, put a plate over it and leave it for five minutes, then fork it through.",
      "Chop the lettuce, cucumber and tomatoes.",
      "Divide everything between two bowls, keeping the components in their own sections rather than mixing.",
      "For the dressing, whisk the Greek yoghurt, tahini, lime juice, Cajun seasoning, salt and pepper with a splash of water until it pours off the spoon.",
      "If you're taking this to work, keep the dressing in a separate pot and add it just before eating."
    ]
  },

  /* ------------------------------------------------------------------
     BONUS FOOD DATABASE — simple entries rather than full recipes.
     These show up with a lighter card and no method.
     ------------------------------------------------------------------ */
  {
    id: "weetabix-and-milk",
    name: "Weetabix & Zymil Milk",
    category: "Breakfasts",
    kind: "quick",
    description: "One Weetabix with lactose-free milk. The default breakfast when you don't want to think about breakfast.",
    image: "images/weetabix-and-milk.svg",
    imageAlt: "A bowl containing a single wheat biscuit with milk poured over it",
    servings: 1,
    servingNote: "1 biscuit",
    nutrition: { calories: 140, protein: 6, carbs: 22, fat: 2, fibre: 3 },
    nutritionStatus: "estimated",
    nutritionNote: "Approximate. The exact milk quantity hasn't been fixed, and that's most of the variation here — an extra 50 ml is roughly another 25 kcal.",
    prepTime: 2,
    cookTime: 0,
    difficulty: "Easy",
    dietary: ["Vegetarian", "Lactose-free"],
    tags: ["breakfast", "quick", "cereal", "no cook", "under 200"],
    ingredients: [
      { item: "Weetabix", qty: 1, unit: "", group: "Pantry" },
      { item: "Lactose-free milk", qty: 125, unit: "ml", group: "Protein & Dairy", note: "Zymil, quantity approximate" }
    ],
    method: []
  },

  {
    id: "gullon-fibre-biscuits",
    name: "Gullón Sugar Free Fibre Biscuits",
    category: "Snacks & Sweet Things",
    kind: "quick",
    description: "The reliable one. Four biscuits with a coffee comes in under 150 kcal, which is why they live in the cupboard.",
    image: "images/gullon-fibre-biscuits.svg",
    imageAlt: "Four round wholemeal biscuits fanned out on a small plate",
    servings: 1,
    servingNote: "1 biscuit, 8.5 g",
    nutrition: { calories: 37, protein: 1, carbs: 5, fat: 1, fibre: 1 },
    nutritionStatus: "verified",
    nutritionNote: "Weight and calories are straight off the packet: 8.5 g and 37 kcal per biscuit, 34 g and 148 kcal for four. The protein, carb and fat split is rounded and approximate.",
    prepTime: 1,
    cookTime: 0,
    difficulty: "Easy",
    dietary: ["Vegetarian"],
    tags: ["snack", "biscuit", "sugar free", "fibre", "no cook", "under 100"],
    ingredients: [
      { item: "Gullón Sugar Free Fibre Biscuits", qty: 1, unit: "", group: "Pantry", note: "8.5 g per biscuit" }
    ],
    method: []
  },

  /* ==================================================================
     STARTER RECIPES
     ==================================================================
     Everything below this line was added to give the site enough food
     to actually work with — Build My Day can't build a day from three
     recipes, and What's In My Fridge needs a decent ingredient pool
     before the matching means anything.

     They're written in the same house style and use your pantry
     (lactose-free Greek yoghurt, feta, halloumi, Cajun seasoning,
     couscous, chickpeas) so they sit alongside yours rather than
     feeling bolted on.

     Every one is marked "estimated". Delete any you don't want —
     just remove the object. Nothing else needs changing.
     ================================================================== */

  {
    id: "vanilla-yoghurt-berry-jar",
    name: "Vanilla Yoghurt & Berry Jar",
    category: "Breakfasts",
    kind: "recipe",
    description: "Layered yoghurt, honey and berries with a spoonful of oats for texture. Make it the night before and it's better.",
    image: "images/vanilla-yoghurt-berry-jar.svg",
    imageAlt: "A glass jar layered with thick white yoghurt, oats and dark mixed berries",
    servings: 1,
    nutrition: { calories: 210, protein: 13, carbs: 28, fat: 3, fibre: 4 },
    nutritionStatus: "estimated",
    prepTime: 5,
    cookTime: 0,
    difficulty: "Easy",
    dietary: ["Vegetarian", "High protein", "Lactose-free"],
    tags: ["breakfast", "no cook", "make ahead", "berries", "yoghurt", "quick", "under 300"],
    ingredients: [
      { item: "Greek yoghurt", qty: 150, unit: "g", group: "Protein & Dairy", note: "lactose-free 2%" },
      { item: "Mixed berries", qty: 80, unit: "g", group: "Produce", note: "fresh or frozen" },
      { item: "Porridge oats", qty: 10, unit: "g", group: "Pantry" },
      { item: "Honey", qty: 10, unit: "g", group: "Pantry" },
      { item: "Vanilla extract", qty: null, unit: "", group: "Pantry", note: "a few drops", staple: true }
    ],
    method: [
      "Stir the vanilla and half the honey through the yoghurt.",
      "If you're using frozen berries, let them sit for ten minutes so they release some juice.",
      "Layer yoghurt, oats and berries in a jar or glass, finishing with berries.",
      "Trickle the rest of the honey over the top. Eat now, or leave it overnight — the oats soften and it turns into something closer to a dessert."
    ]
  },

  {
    id: "whipped-feta-tomato-toast",
    name: "Whipped Feta & Tomato Toast",
    category: "Breakfasts",
    kind: "recipe",
    description: "Feta beaten with yoghurt until it's smooth and cloud-like, piled onto sourdough with tomatoes and cracked pepper.",
    image: "images/whipped-feta-tomato-toast.svg",
    imageAlt: "A thick slice of toasted sourdough spread with whipped white cheese and topped with halved cherry tomatoes",
    servings: 1,
    nutrition: { calories: 290, protein: 12, carbs: 28, fat: 14, fibre: 3 },
    nutritionStatus: "estimated",
    prepTime: 7,
    cookTime: 3,
    difficulty: "Easy",
    dietary: ["Vegetarian"],
    tags: ["breakfast", "brunch", "quick", "feta", "toast", "under 300", "vegetarian"],
    ingredients: [
      { item: "Sourdough bread", qty: 50, unit: "g", group: "Bakery & Chilled", note: "1 thick slice" },
      { item: "Feta", qty: 40, unit: "g", group: "Protein & Dairy" },
      { item: "Greek yoghurt", qty: 20, unit: "g", group: "Protein & Dairy", note: "lactose-free 2%" },
      { item: "Cherry tomatoes", qty: 80, unit: "g", group: "Produce", note: "halved" },
      { item: "Olive oil", qty: null, unit: "", group: "Pantry", note: "a drizzle", staple: true },
      { item: "Black pepper", qty: null, unit: "", group: "Herbs & Spices", staple: true }
    ],
    method: [
      "Beat the feta and yoghurt together hard with a fork, or blitz them, until the mixture turns pale and smooth. It takes longer than you think.",
      "Toast the sourdough well — it needs to hold the weight.",
      "Spread the whipped feta thickly over the toast.",
      "Pile the tomatoes on, drizzle with olive oil and grind over plenty of black pepper. No salt: the feta has it covered."
    ]
  },

  {
    id: "spinach-scramble-toast",
    name: "Spinach Scramble on Toast",
    category: "Breakfasts",
    kind: "recipe",
    description: "Soft scrambled eggs with wilted spinach. The trick is taking them off the heat while they still look slightly underdone.",
    image: "images/spinach-scramble-toast.svg",
    imageAlt: "Softly scrambled eggs with green spinach served on a slice of brown toast",
    servings: 1,
    nutrition: { calories: 285, protein: 19, carbs: 19, fat: 15, fibre: 4 },
    nutritionStatus: "estimated",
    prepTime: 3,
    cookTime: 6,
    difficulty: "Easy",
    dietary: ["Vegetarian", "High protein"],
    tags: ["breakfast", "eggs", "quick", "high protein", "under 300", "spinach"],
    ingredients: [
      { item: "Eggs", qty: 2, unit: "", group: "Protein & Dairy" },
      { item: "Spinach", qty: 50, unit: "g", group: "Produce" },
      { item: "Wholemeal bread", qty: 40, unit: "g", group: "Bakery & Chilled", note: "1 slice" },
      { item: "Butter", qty: 5, unit: "g", group: "Protein & Dairy" },
      { item: "Salt", qty: null, unit: "", group: "Herbs & Spices", staple: true },
      { item: "Black pepper", qty: null, unit: "", group: "Herbs & Spices", staple: true }
    ],
    method: [
      "Wilt the spinach in a dry pan for a minute, then tip it into a sieve and press out the water. Wet spinach ruins scrambled eggs.",
      "Beat the eggs with salt and pepper.",
      "Melt the butter in the pan over a low heat — lower than feels right — and add the eggs.",
      "Stir slowly and constantly. When they're about three-quarters set, fold the spinach through and take the pan off the heat. They'll finish cooking on their own.",
      "Pile onto the toast."
    ]
  },

  {
    id: "peanut-butter-overnight-oats",
    name: "Peanut Butter Overnight Oats",
    category: "Breakfasts",
    kind: "recipe",
    description: "Oats soaked overnight with a swirl of peanut butter and sliced banana. Two minutes of work the night before.",
    image: "images/peanut-butter-overnight-oats.svg",
    imageAlt: "A jar of soaked oats topped with sliced banana and a swirl of peanut butter",
    servings: 1,
    nutrition: { calories: 360, protein: 14, carbs: 45, fat: 13, fibre: 6 },
    nutritionStatus: "estimated",
    prepTime: 5,
    cookTime: 0,
    difficulty: "Easy",
    dietary: ["Vegetarian", "Lactose-free"],
    tags: ["breakfast", "make ahead", "no cook", "oats", "peanut butter", "banana"],
    ingredients: [
      { item: "Porridge oats", qty: 40, unit: "g", group: "Pantry" },
      { item: "Lactose-free milk", qty: 150, unit: "ml", group: "Protein & Dairy" },
      { item: "Peanut butter", qty: 15, unit: "g", group: "Pantry" },
      { item: "Banana", qty: 60, unit: "g", group: "Produce", note: "about half" },
      { item: "Cinnamon", qty: null, unit: "", group: "Herbs & Spices", note: "a pinch", staple: true }
    ],
    method: [
      "Stir the oats, milk and cinnamon together in a jar.",
      "Drop the peanut butter on top and drag a spoon through it once or twice — you want streaks, not a mixture.",
      "Lid on, fridge, overnight.",
      "Slice the banana over it in the morning. If it's stiffened up too much, loosen it with a splash more milk."
    ]
  },

  {
    id: "tomato-basil-pasta",
    name: "Ten-Minute Tomato & Basil Pasta",
    category: "Pasta & Grains",
    kind: "recipe",
    description: "The sauce is done before the pasta is. Garlic, passata, a lot of basil and enough pasta water to make it cling.",
    image: "images/tomato-basil-pasta.svg",
    imageAlt: "A bowl of pasta coated in red tomato sauce with fresh basil leaves and grated cheese",
    servings: 1,
    nutrition: { calories: 375, protein: 13, carbs: 58, fat: 9, fibre: 5 },
    nutritionStatus: "estimated",
    prepTime: 3,
    cookTime: 10,
    difficulty: "Easy",
    dietary: ["Vegetarian"],
    tags: ["pasta", "quick", "tomato", "basil", "storecupboard", "weeknight", "vegetarian"],
    ingredients: [
      { item: "Pasta", qty: 70, unit: "g", group: "Pantry", note: "dry weight" },
      { item: "Passata", qty: 150, unit: "g", group: "Pantry" },
      { item: "Garlic", qty: 2, unit: "", group: "Produce", note: "cloves, sliced thin" },
      { item: "Parmesan", qty: 10, unit: "g", group: "Protein & Dairy", note: "grated" },
      { item: "Fresh basil", qty: null, unit: "", group: "Produce", note: "a good handful" },
      { item: "Olive oil", qty: 5, unit: "g", group: "Pantry" },
      { item: "Salt", qty: null, unit: "", group: "Herbs & Spices", staple: true },
      { item: "Black pepper", qty: null, unit: "", group: "Herbs & Spices", staple: true }
    ],
    method: [
      "Get the pasta on in well-salted water.",
      "Warm the olive oil in a wide pan and cook the garlic gently until it smells sweet. Don't let it brown or the whole thing turns bitter.",
      "Pour in the passata, season, and let it bubble and thicken while the pasta cooks.",
      "Drain the pasta but keep a mugful of the water.",
      "Tip the pasta into the sauce with a splash of the cooking water and toss hard for a minute — that's what makes the sauce coat rather than sit.",
      "Tear the basil in at the last second, off the heat, and finish with the parmesan."
    ]
  },

  {
    id: "lemon-tuna-pasta",
    name: "Lemon Tuna Pasta",
    category: "Pasta & Grains",
    kind: "recipe",
    description: "Tuna, lemon and yoghurt make a sauce that tastes far richer than it is. Ready in the time the pasta takes.",
    image: "images/lemon-tuna-pasta.svg",
    imageAlt: "Pasta in a pale creamy sauce with flakes of tuna, cherry tomatoes and lemon zest",
    servings: 1,
    nutrition: { calories: 380, protein: 32, carbs: 50, fat: 6, fibre: 3 },
    nutritionStatus: "estimated",
    prepTime: 5,
    cookTime: 10,
    difficulty: "Easy",
    dietary: ["Pescatarian", "High protein", "Lactose-free"],
    tags: ["pasta", "tuna", "fish", "lemon", "quick", "high protein", "storecupboard"],
    ingredients: [
      { item: "Pasta", qty: 65, unit: "g", group: "Pantry", note: "dry weight" },
      { item: "Tuna", qty: 80, unit: "g", group: "Pantry", note: "in spring water, drained" },
      { item: "Greek yoghurt", qty: 40, unit: "g", group: "Protein & Dairy", note: "lactose-free 2%" },
      { item: "Cherry tomatoes", qty: 60, unit: "g", group: "Produce", note: "halved" },
      { item: "Feta", qty: 10, unit: "g", group: "Protein & Dairy" },
      { item: "Lemon", qty: 1, unit: "", group: "Produce", note: "zest and juice" },
      { item: "Black pepper", qty: null, unit: "", group: "Herbs & Spices", staple: true },
      { item: "Salt", qty: null, unit: "", group: "Herbs & Spices", staple: true }
    ],
    method: [
      "Cook the pasta in salted water.",
      "While it cooks, flake the tuna into a bowl with the yoghurt, lemon zest, half the juice and plenty of pepper.",
      "Drain the pasta, keeping a few tablespoons of the water.",
      "Take the pan off the heat before you add the yoghurt mixture — direct heat will split it. Stir it through the hot pasta with a splash of the cooking water.",
      "Fold in the tomatoes, crumble the feta over and add the rest of the lemon juice if it needs sharpening."
    ]
  },

  {
    id: "couscous-chickpea-herb-salad",
    name: "Couscous, Chickpea & Herb Salad",
    category: "Pasta & Grains",
    kind: "recipe",
    description: "Fluffy couscous with chickpeas, chopped salad and a lot of parsley. Keeps well, so it's a good Sunday-night job.",
    image: "images/couscous-chickpea-herb-salad.svg",
    imageAlt: "A bowl of couscous mixed with chickpeas, diced cucumber, tomato, feta and chopped green herbs",
    servings: 1,
    nutrition: { calories: 370, protein: 14, carbs: 48, fat: 13, fibre: 8 },
    nutritionStatus: "estimated",
    prepTime: 12,
    cookTime: 0,
    difficulty: "Easy",
    dietary: ["Vegetarian"],
    tags: ["couscous", "chickpeas", "salad", "packed lunch", "meal prep", "no cook", "vegetarian"],
    ingredients: [
      { item: "Couscous", qty: 40, unit: "g", group: "Pantry", note: "dry weight" },
      { item: "Chickpeas", qty: 80, unit: "g", group: "Pantry", note: "drained" },
      { item: "Cucumber", qty: 80, unit: "g", group: "Produce", note: "diced small" },
      { item: "Cherry tomatoes", qty: 80, unit: "g", group: "Produce", note: "quartered" },
      { item: "Feta", qty: 20, unit: "g", group: "Protein & Dairy", note: "crumbled" },
      { item: "Fresh parsley", qty: null, unit: "", group: "Produce", note: "a large handful, chopped" },
      { item: "Lemon", qty: 1, unit: "", group: "Produce", note: "juice only" },
      { item: "Olive oil", qty: 5, unit: "g", group: "Pantry" },
      { item: "Salt", qty: null, unit: "", group: "Herbs & Spices", staple: true },
      { item: "Black pepper", qty: null, unit: "", group: "Herbs & Spices", staple: true }
    ],
    method: [
      "Put the couscous in a bowl, pour over just enough boiling water to cover it by a few millimetres, cover with a plate and leave for five minutes.",
      "Fork it through to separate the grains, then let it cool.",
      "Dice the cucumber and tomatoes small — about the same size as the chickpeas.",
      "Mix everything together with the lemon juice, olive oil, salt and pepper.",
      "Add the parsley last and taste. It usually wants more lemon than you'd expect."
    ]
  },

  {
    id: "cajun-chicken-rice-bowl",
    name: "Cajun Chicken & Rice Bowl",
    category: "Chicken & Meat",
    kind: "recipe",
    description: "Blackened chicken, charred peppers and a cool yoghurt drizzle over rice. The weeknight version of the Cajun Crunch Bowl.",
    image: "images/cajun-chicken-rice-bowl.svg",
    imageAlt: "A bowl of rice topped with sliced spiced chicken, charred peppers, sweetcorn and a yoghurt drizzle",
    servings: 1,
    nutrition: { calories: 370, protein: 33, carbs: 42, fat: 9, fibre: 3 },
    nutritionStatus: "estimated",
    prepTime: 8,
    cookTime: 15,
    difficulty: "Easy",
    dietary: ["High protein", "Lactose-free"],
    tags: ["chicken", "cajun", "rice", "bowl", "high protein", "weeknight", "meal prep"],
    ingredients: [
      { item: "Chicken breast", qty: 100, unit: "g", group: "Protein & Dairy" },
      { item: "Rice", qty: 120, unit: "g", group: "Pantry", note: "cooked weight" },
      { item: "Peppers", qty: 60, unit: "g", group: "Produce", note: "sliced" },
      { item: "Sweetcorn", qty: 20, unit: "g", group: "Pantry", note: "drained" },
      { item: "Greek yoghurt", qty: 40, unit: "g", group: "Protein & Dairy", note: "lactose-free 2%" },
      { item: "Olive oil", qty: 5, unit: "g", group: "Pantry" },
      { item: "Cajun seasoning", qty: null, unit: "", group: "Herbs & Spices", staple: true },
      { item: "Salt", qty: null, unit: "", group: "Herbs & Spices", staple: true },
      { item: "Black pepper", qty: null, unit: "", group: "Herbs & Spices", staple: true }
    ],
    method: [
      "Flatten the chicken breast slightly so it cooks evenly, then coat it all over in Cajun seasoning.",
      "Get a pan properly hot with the oil and cook the chicken for 5–6 minutes a side, until the crust is dark and it's cooked through. Rest it for five minutes before slicing.",
      "In the same pan, char the peppers and sweetcorn over a high heat.",
      "Loosen the yoghurt with a splash of water and a pinch of Cajun.",
      "Rice into the bowl, sliced chicken on top, peppers and corn alongside, yoghurt drizzled over."
    ]
  },

  {
    id: "honey-soy-chicken-traybake",
    name: "Honey-Soy Chicken Traybake",
    category: "Chicken & Meat",
    kind: "recipe",
    description: "Chicken, sweet potato and broccoli in a sticky honey-soy glaze, all on one tray. Makes two, and the second one reheats well.",
    image: "images/honey-soy-chicken-traybake.svg",
    imageAlt: "A roasting tray of glazed chicken pieces with sweet potato chunks and broccoli florets",
    servings: 2,
    nutrition: { calories: 355, protein: 32, carbs: 38, fat: 7, fibre: 6 },
    nutritionStatus: "estimated",
    prepTime: 10,
    cookTime: 30,
    difficulty: "Easy",
    dietary: ["High protein", "Lactose-free"],
    tags: ["chicken", "traybake", "one pan", "sweet potato", "broccoli", "high protein", "meal prep"],
    ingredients: [
      { item: "Chicken breast", qty: 240, unit: "g", group: "Protein & Dairy", note: "cut into large chunks" },
      { item: "Sweet potato", qty: 300, unit: "g", group: "Produce", note: "cubed" },
      { item: "Broccoli", qty: 160, unit: "g", group: "Produce", note: "in florets" },
      { item: "Honey", qty: 20, unit: "g", group: "Pantry" },
      { item: "Soy sauce", qty: 2, unit: "tbsp", group: "Pantry" },
      { item: "Garlic", qty: 2, unit: "", group: "Produce", note: "cloves, crushed" },
      { item: "Olive oil", qty: 8, unit: "g", group: "Pantry" },
      { item: "Black pepper", qty: null, unit: "", group: "Herbs & Spices", staple: true }
    ],
    method: [
      "Heat the oven to 200°C. Toss the sweet potato with half the oil and roast for 15 minutes on its own — it needs the head start.",
      "Mix the honey, soy sauce, garlic, remaining oil and plenty of pepper.",
      "Add the chicken to the tray, pour over two-thirds of the glaze and toss everything together.",
      "Roast for 12 minutes, then add the broccoli and the rest of the glaze.",
      "Back in for 8 minutes, until the broccoli has crisp brown edges and the glaze has gone sticky.",
      "Divide between two plates, scraping up everything from the bottom of the tray."
    ]
  },

  {
    id: "garlic-yoghurt-chicken-wrap",
    name: "Garlic Yoghurt Chicken Wrap",
    category: "Chicken & Meat",
    kind: "recipe",
    description: "Warm chicken, cold salad and a sharp garlic yoghurt in a soft tortilla. Assembles in about four minutes if the chicken's already cooked.",
    image: "images/garlic-yoghurt-chicken-wrap.svg",
    imageAlt: "A folded tortilla wrap filled with sliced chicken, shredded lettuce, tomato and white sauce",
    servings: 1,
    nutrition: { calories: 315, protein: 30, carbs: 30, fat: 8, fibre: 3 },
    nutritionStatus: "estimated",
    prepTime: 6,
    cookTime: 8,
    difficulty: "Easy",
    dietary: ["High protein", "Lactose-free"],
    tags: ["chicken", "wrap", "quick", "lunch", "high protein", "under 400"],
    ingredients: [
      { item: "Tortilla wrap", qty: 45, unit: "g", group: "Bakery & Chilled", note: "1 wrap" },
      { item: "Chicken breast", qty: 90, unit: "g", group: "Protein & Dairy", note: "cooked and sliced" },
      { item: "Greek yoghurt", qty: 40, unit: "g", group: "Protein & Dairy", note: "lactose-free 2%" },
      { item: "Iceberg lettuce", qty: 40, unit: "g", group: "Produce", note: "shredded" },
      { item: "Cherry tomatoes", qty: 40, unit: "g", group: "Produce", note: "sliced" },
      { item: "Feta", qty: 15, unit: "g", group: "Protein & Dairy" },
      { item: "Garlic", qty: 1, unit: "", group: "Produce", note: "clove, crushed" },
      { item: "Lemon", qty: null, unit: "", group: "Produce", note: "a squeeze" },
      { item: "Salt", qty: null, unit: "", group: "Herbs & Spices", staple: true },
      { item: "Black pepper", qty: null, unit: "", group: "Herbs & Spices", staple: true }
    ],
    method: [
      "Mix the yoghurt with the crushed garlic, a squeeze of lemon, salt and pepper. Let it sit for a few minutes so the garlic comes through.",
      "Warm the tortilla in a dry pan for 20 seconds a side — it makes it fold instead of crack.",
      "Spread the garlic yoghurt down the middle, leaving the edges clear.",
      "Layer on the lettuce, then the chicken, then the tomatoes, and crumble the feta over.",
      "Fold the bottom up, then roll it tightly from one side."
    ]
  },

  {
    id: "harissa-salmon-couscous",
    name: "Harissa Salmon with Couscous",
    category: "Fish & Seafood",
    kind: "recipe",
    description: "Salmon roasted under a harissa crust on a bed of lemony couscous. Feels like a restaurant plate for fifteen minutes' work.",
    image: "images/harissa-salmon-couscous.svg",
    imageAlt: "A fillet of salmon with a red spice crust resting on couscous with courgette and lemon",
    servings: 1,
    nutrition: { calories: 420, protein: 28, carbs: 32, fat: 20, fibre: 3 },
    nutritionStatus: "estimated",
    prepTime: 8,
    cookTime: 14,
    difficulty: "Easy",
    dietary: ["Pescatarian", "High protein", "Lactose-free"],
    tags: ["salmon", "fish", "harissa", "couscous", "high protein", "dinner"],
    ingredients: [
      { item: "Salmon fillet", qty: 100, unit: "g", group: "Protein & Dairy" },
      { item: "Couscous", qty: 40, unit: "g", group: "Pantry", note: "dry weight" },
      { item: "Courgette", qty: 80, unit: "g", group: "Produce", note: "sliced into half-moons" },
      { item: "Harissa paste", qty: 10, unit: "g", group: "Pantry" },
      { item: "Lemon", qty: 1, unit: "", group: "Produce", note: "zest and juice" },
      { item: "Olive oil", qty: 5, unit: "g", group: "Pantry" },
      { item: "Salt", qty: null, unit: "", group: "Herbs & Spices", staple: true },
      { item: "Black pepper", qty: null, unit: "", group: "Herbs & Spices", staple: true }
    ],
    method: [
      "Heat the oven to 200°C. Rub the harissa over the top and sides of the salmon.",
      "Toss the courgette with the oil, salt and pepper and spread it on a small tray. Sit the salmon on top.",
      "Roast for 12–14 minutes, until the salmon flakes when you press it.",
      "Meanwhile, cover the couscous with boiling water, put a plate over it and leave for five minutes. Fork it through with the lemon zest and half the juice.",
      "Couscous down first, courgette over it, salmon on top, and the rest of the lemon juice over everything."
    ]
  },

  {
    id: "tuna-sweetcorn-jacket-potato",
    name: "Tuna & Sweetcorn Jacket Potato",
    category: "Fish & Seafood",
    kind: "recipe",
    description: "Tuna mixed with Greek yoghurt rather than mayonnaise, which keeps it light without making it taste like a compromise.",
    image: "images/tuna-sweetcorn-jacket-potato.svg",
    imageAlt: "A split baked potato filled with tuna and sweetcorn mixture, topped with melted cheese",
    servings: 1,
    nutrition: { calories: 345, protein: 30, carbs: 40, fat: 6, fibre: 5 },
    nutritionStatus: "estimated",
    prepTime: 5,
    cookTime: 55,
    difficulty: "Easy",
    dietary: ["Pescatarian", "High protein", "Lactose-free"],
    tags: ["tuna", "fish", "potato", "high protein", "lunch", "comfort"],
    ingredients: [
      { item: "Baking potato", qty: 200, unit: "g", group: "Produce", note: "1 medium" },
      { item: "Tuna", qty: 80, unit: "g", group: "Pantry", note: "in spring water, drained" },
      { item: "Sweetcorn", qty: 40, unit: "g", group: "Pantry", note: "drained" },
      { item: "Greek yoghurt", qty: 40, unit: "g", group: "Protein & Dairy", note: "lactose-free 2%" },
      { item: "Cheddar", qty: 10, unit: "g", group: "Protein & Dairy", note: "grated" },
      { item: "Spring onion", qty: 1, unit: "", group: "Produce", note: "sliced" },
      { item: "Black pepper", qty: null, unit: "", group: "Herbs & Spices", staple: true },
      { item: "Salt", qty: null, unit: "", group: "Herbs & Spices", staple: true }
    ],
    method: [
      "Prick the potato all over, rub it with salt and bake at 200°C for 50–60 minutes, until the skin is crisp and it gives when squeezed.",
      "Flake the tuna into a bowl with the sweetcorn, yoghurt, spring onion and lots of pepper.",
      "Split the potato, fork the inside up a little, and pile the tuna mixture in.",
      "Scatter the cheddar over and put it back in the oven for three minutes, just to melt."
    ]
  },

  {
    id: "garlic-prawn-tomato-orzo",
    name: "Garlic Prawn & Tomato Orzo",
    category: "Fish & Seafood",
    kind: "recipe",
    description: "Orzo cooked straight in the tomato sauce so it goes creamy on its own, with garlic prawns stirred through at the end.",
    image: "images/garlic-prawn-tomato-orzo.svg",
    imageAlt: "A pan of orzo in tomato sauce with pink prawns and chopped parsley",
    servings: 1,
    nutrition: { calories: 350, protein: 26, carbs: 46, fat: 7, fibre: 3 },
    nutritionStatus: "estimated",
    prepTime: 5,
    cookTime: 15,
    difficulty: "Moderate",
    dietary: ["Pescatarian", "High protein", "Lactose-free"],
    tags: ["prawns", "fish", "orzo", "one pan", "tomato", "high protein", "dinner"],
    ingredients: [
      { item: "Orzo", qty: 60, unit: "g", group: "Pantry", note: "dry weight" },
      { item: "Prawns", qty: 90, unit: "g", group: "Protein & Dairy", note: "raw, peeled" },
      { item: "Cherry tomatoes", qty: 120, unit: "g", group: "Produce", note: "halved" },
      { item: "Garlic", qty: 2, unit: "", group: "Produce", note: "cloves, sliced" },
      { item: "Fresh parsley", qty: null, unit: "", group: "Produce", note: "chopped" },
      { item: "Olive oil", qty: 5, unit: "g", group: "Pantry" },
      { item: "Chilli flakes", qty: null, unit: "", group: "Herbs & Spices", staple: true },
      { item: "Lemon", qty: null, unit: "", group: "Produce", note: "a squeeze" },
      { item: "Salt", qty: null, unit: "", group: "Herbs & Spices", staple: true }
    ],
    method: [
      "Cook the garlic and chilli flakes gently in the oil for a minute.",
      "Add the tomatoes and a pinch of salt and press them down with a spoon as they collapse.",
      "Stir in the orzo and about 200 ml of water. Simmer, stirring often, for 9–10 minutes, adding a splash more water if it tightens up. It should end up loose and glossy.",
      "Push the orzo aside, add the prawns, and cook for two minutes until they turn pink and curl. Don't go further than that.",
      "Stir everything together off the heat with the parsley and a squeeze of lemon."
    ]
  },

  {
    id: "halloumi-tomato-flatbread",
    name: "Halloumi & Tomato Flatbread",
    category: "Quick Meals",
    kind: "recipe",
    description: "Griddled halloumi on a warm flatbread with tomatoes, rocket and yoghurt. Ten minutes, one pan.",
    image: "images/halloumi-tomato-flatbread.svg",
    imageAlt: "A flatbread topped with golden griddled halloumi slices, tomatoes and rocket leaves",
    servings: 1,
    nutrition: { calories: 380, protein: 22, carbs: 34, fat: 18, fibre: 3 },
    nutritionStatus: "estimated",
    prepTime: 4,
    cookTime: 6,
    difficulty: "Easy",
    dietary: ["Vegetarian", "High protein"],
    tags: ["halloumi", "flatbread", "quick", "vegetarian", "lunch", "under 400"],
    ingredients: [
      { item: "Flatbread", qty: 60, unit: "g", group: "Bakery & Chilled", note: "1 flatbread" },
      { item: "Halloumi", qty: 60, unit: "g", group: "Protein & Dairy", note: "sliced" },
      { item: "Cherry tomatoes", qty: 60, unit: "g", group: "Produce", note: "halved" },
      { item: "Rocket", qty: 20, unit: "g", group: "Produce" },
      { item: "Greek yoghurt", qty: 20, unit: "g", group: "Protein & Dairy", note: "lactose-free 2%" },
      { item: "Lemon", qty: null, unit: "", group: "Produce", note: "a squeeze" },
      { item: "Black pepper", qty: null, unit: "", group: "Herbs & Spices", staple: true }
    ],
    method: [
      "Dry-fry the halloumi in a hot pan for two minutes a side, until it's deep golden and squeaks less.",
      "Warm the flatbread in the same pan for 30 seconds.",
      "Spread the yoghurt over the flatbread and grind pepper over it.",
      "Layer on the rocket, then the tomatoes, then the hot halloumi.",
      "Squeeze lemon over the top while the cheese is still hot."
    ]
  },

  {
    id: "five-minute-chickpea-bowl",
    name: "Five-Minute Chickpea Bowl",
    category: "Quick Meals",
    kind: "recipe",
    description: "No cooking at all. A tin of chickpeas, whatever salad is in the fridge, feta and lemon. The fallback lunch.",
    image: "images/five-minute-chickpea-bowl.svg",
    imageAlt: "A bowl of chickpeas with diced cucumber, tomato and crumbled feta",
    servings: 1,
    nutrition: { calories: 280, protein: 14, carbs: 28, fat: 12, fibre: 8 },
    nutritionStatus: "estimated",
    prepTime: 5,
    cookTime: 0,
    difficulty: "Easy",
    dietary: ["Vegetarian"],
    tags: ["chickpeas", "no cook", "quick", "salad", "vegetarian", "under 300", "storecupboard"],
    ingredients: [
      { item: "Chickpeas", qty: 120, unit: "g", group: "Pantry", note: "drained and rinsed" },
      { item: "Cucumber", qty: 80, unit: "g", group: "Produce", note: "diced" },
      { item: "Cherry tomatoes", qty: 80, unit: "g", group: "Produce", note: "halved" },
      { item: "Feta", qty: 20, unit: "g", group: "Protein & Dairy", note: "crumbled" },
      { item: "Greek yoghurt", qty: 40, unit: "g", group: "Protein & Dairy", note: "lactose-free 2%" },
      { item: "Lemon", qty: 1, unit: "", group: "Produce", note: "juice only" },
      { item: "Olive oil", qty: 3, unit: "g", group: "Pantry" },
      { item: "Salt", qty: null, unit: "", group: "Herbs & Spices", staple: true },
      { item: "Black pepper", qty: null, unit: "", group: "Herbs & Spices", staple: true }
    ],
    method: [
      "Crush about a quarter of the chickpeas with a fork — it thickens everything and stops the bowl feeling loose.",
      "Mix all the chickpeas with the cucumber, tomatoes, lemon juice, oil, salt and pepper.",
      "Spoon the yoghurt over one side of the bowl rather than stirring it in.",
      "Crumble the feta over the top."
    ]
  },

  {
    id: "yoghurt-honey-walnuts",
    name: "Greek Yoghurt with Honey & Walnuts",
    category: "Snacks & Sweet Things",
    kind: "recipe",
    description: "Cold thick yoghurt, warm honey, toasted walnuts. Three ingredients and it still feels like a proper dessert.",
    image: "images/yoghurt-honey-walnuts.svg",
    imageAlt: "A small bowl of thick yoghurt drizzled with honey and scattered with walnut pieces",
    servings: 1,
    nutrition: { calories: 175, protein: 11, carbs: 13, fat: 8, fibre: 1 },
    nutritionStatus: "estimated",
    prepTime: 3,
    cookTime: 2,
    difficulty: "Easy",
    dietary: ["Vegetarian", "High protein", "Lactose-free"],
    tags: ["snack", "dessert", "yoghurt", "honey", "no cook", "under 200", "quick"],
    ingredients: [
      { item: "Greek yoghurt", qty: 120, unit: "g", group: "Protein & Dairy", note: "lactose-free 2%" },
      { item: "Honey", qty: 8, unit: "g", group: "Pantry" },
      { item: "Walnuts", qty: 10, unit: "g", group: "Pantry", note: "roughly broken" }
    ],
    method: [
      "Toast the walnuts in a dry pan for a couple of minutes until they smell nutty. This is the whole difference between this and a bowl of yoghurt.",
      "Spoon the yoghurt into a bowl and make a dip in the middle with the back of the spoon.",
      "Honey into the dip, walnuts over the top."
    ]
  },

  {
    id: "dark-chocolate-almond-plate",
    name: "Dark Chocolate & Almond Plate",
    category: "Snacks & Sweet Things",
    kind: "quick",
    description: "Two squares of dark chocolate and a small handful of almonds. Eaten slowly, this handles most evening cravings.",
    image: "images/dark-chocolate-almond-plate.svg",
    imageAlt: "Two squares of dark chocolate beside a small pile of whole almonds",
    servings: 1,
    servingNote: "2 squares of chocolate and about 8 almonds",
    nutrition: { calories: 115, protein: 4, carbs: 6, fat: 9, fibre: 2 },
    nutritionStatus: "estimated",
    nutritionNote: "Based on 70% dark chocolate. Milk chocolate will push this higher — check your bar.",
    prepTime: 1,
    cookTime: 0,
    difficulty: "Easy",
    dietary: ["Vegetarian"],
    tags: ["snack", "chocolate", "no cook", "under 200", "evening", "quick"],
    ingredients: [
      { item: "Dark chocolate", qty: 10, unit: "g", group: "Pantry", note: "70% cocoa" },
      { item: "Almonds", qty: 10, unit: "g", group: "Pantry" }
    ],
    method: []
  },

  {
    id: "cucumber-feta-chilli-plate",
    name: "Cucumber, Feta & Chilli Plate",
    category: "Snacks & Sweet Things",
    kind: "quick",
    description: "Cold cucumber, salty feta, chilli flakes and olive oil. Salty and sharp rather than sweet, for when that's what you want.",
    image: "images/cucumber-feta-chilli-plate.svg",
    imageAlt: "Thick cucumber slices topped with crumbled feta and red chilli flakes",
    servings: 1,
    nutrition: { calories: 100, protein: 5, carbs: 3, fat: 7, fibre: 1 },
    nutritionStatus: "estimated",
    prepTime: 3,
    cookTime: 0,
    difficulty: "Easy",
    dietary: ["Vegetarian", "Gluten-free"],
    tags: ["snack", "savoury", "no cook", "under 100", "feta", "quick"],
    ingredients: [
      { item: "Cucumber", qty: 100, unit: "g", group: "Produce", note: "cut into thick coins" },
      { item: "Feta", qty: 25, unit: "g", group: "Protein & Dairy", note: "crumbled" },
      { item: "Olive oil", qty: 2, unit: "g", group: "Pantry" },
      { item: "Chilli flakes", qty: null, unit: "", group: "Herbs & Spices", staple: true },
      { item: "Black pepper", qty: null, unit: "", group: "Herbs & Spices", staple: true }
    ],
    method: []
  },

  {
    id: "frozen-berry-yoghurt-bark",
    name: "Frozen Berry Yoghurt Bark",
    category: "Snacks & Sweet Things",
    kind: "recipe",
    description: "Sweetened yoghurt spread thin, studded with berries and frozen, then snapped into shards. Keeps for weeks in the freezer.",
    image: "images/frozen-berry-yoghurt-bark.svg",
    imageAlt: "Shards of frozen white yoghurt bark studded with pieces of red and purple berries",
    servings: 4,
    servingNote: "A quarter of the tray, a few shards",
    nutrition: { calories: 80, protein: 5, carbs: 9, fat: 1, fibre: 1 },
    nutritionStatus: "estimated",
    prepTime: 10,
    cookTime: 0,
    difficulty: "Easy",
    dietary: ["Vegetarian", "Gluten-free", "Lactose-free"],
    tags: ["snack", "dessert", "frozen", "make ahead", "berries", "under 100", "batch"],
    ingredients: [
      { item: "Greek yoghurt", qty: 300, unit: "g", group: "Protein & Dairy", note: "lactose-free 2%" },
      { item: "Mixed berries", qty: 100, unit: "g", group: "Produce", note: "roughly chopped" },
      { item: "Honey", qty: 20, unit: "g", group: "Pantry" },
      { item: "Vanilla extract", qty: null, unit: "", group: "Pantry", note: "a few drops", staple: true }
    ],
    method: [
      "Line a small tray with baking paper, leaving an overhang so you can lift it out later.",
      "Stir the honey and vanilla through the yoghurt.",
      "Spread it over the tray to about half a centimetre thick — thinner and it shatters, thicker and it's hard to bite.",
      "Press the berries into the surface, spacing them so every piece gets some.",
      "Freeze for at least four hours, then lift out and snap into shards. Store them in a bag in the freezer."
    ]
  }

];

/* --------------------------------------------------------------------------
   CATEGORIES
   The order here is the order they appear in the navigation and on the
   recipe page. Add a category here before using it on a recipe.
   -------------------------------------------------------------------------- */
const CATEGORIES = [
  "Breakfasts",
  "Bowls & Salads",
  "Pasta & Grains",
  "Bakes & Savoury",
  "Chicken & Meat",
  "Fish & Seafood",
  "Quick Meals",
  "Snacks & Sweet Things"
];

/* --------------------------------------------------------------------------
   GROCERY AISLES
   The order the grocery list groups things into. Match these strings
   exactly in the "group" field of an ingredient.
   -------------------------------------------------------------------------- */
const GROCERY_GROUPS = [
  "Produce",
  "Protein & Dairy",
  "Bakery & Chilled",
  "Pantry",
  "Herbs & Spices"
];
