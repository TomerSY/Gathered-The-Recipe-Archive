const recipes = [
  {
    id: "moms-pickled-beets",
    title: "סלק של אמא",
    category: "חמוצים",
    tags: ["חמוצים", "ירקות", "מתכון משפחתי"],
    description: "סלק חמוץ־מתוק עם שום, סלרי ופלפל חריף — בדיוק כמו בבית.",
    story: "הסלק שאמא מכינה ושמגיע כמעט לכל ארוחה משפחתית. מתכון פשוט, צבעוני ומלא בזיכרונות.",
    image: "/images/beet-card.webp",
    gallery: ["/images/beet-jar.webp", "/images/beet-prep.webp"],
    cookTime: "כ־60 דק׳",
    waitTime: "1–2 ימים",
    yield: "צנצנת גדולה",
    ingredients: [
      ["סלק בינוני–גדול", "4"],
      ["גבעולי סלרי ארוכים + עלים", "4"],
      ["פלפלים חריפים ארוכים", "4"],
      ["שיני שום", "10"],
      ["מלח", "4 כפיות גדושות"],
      ["חומץ", "כ־3 כוסות"],
      ["מי בישול הסלק", "כ־3 כוסות"],
    ],
    steps: [
      "רוחצים היטב את הסלקים ומבשלים אותם בשלמותם במים, על אש נמוכה, כ־60 דקות — עד שמזלג ננעץ בהם בקלות, אך הם עדיין לא רכים מדי.",
      "שומרים את מי הבישול. מצננים מעט ומקלפים את הסלקים.",
      "חותכים את הסלק לקוביות או לפרוסות גדולות. חותכים גם את הסלרי והפלפל החריף, ומוסיפים את שיני השום.",
      "מעבירים הכול לצנצנת גדולה ומוסיפים 4 כפיות גדושות של מלח.",
      "ממלאים את הצנצנת ביחס של חצי חומץ וחצי ממי בישול הסלק, עד לשפת הצנצנת — בערך 3 כוסות מכל נוזל.",
      "סוגרים ומניחים להחמצה. אחרי יום־יומיים הסלק מוכן.",
    ],
    footnotes: [
      {
        marker: "*",
        text: "אפשר לכתוש מעט את השום והפלפל החריף כדי לזרז את ההחמצה, לפעמים לכיום אחד בלבד.",
      },
      {
        text: "את מי הבישול שנשארו אפשר לשתות.",
      },
    ],
  },
];

const recipeGrid = document.querySelector("#recipeGrid");
const filterList = document.querySelector("#filterList");
const searchInput = document.querySelector("#recipeSearch");
const clearSearch = document.querySelector("#clearSearch");
const emptyState = document.querySelector("#emptyState");
const resultsSummary = document.querySelector("#resultsSummary");
const recipeCount = document.querySelector("#recipeCount");
const recipeDialog = document.querySelector("#recipeDialog");
const recipeDialogContent = document.querySelector("#recipeDialogContent");
const submitDialog = document.querySelector("#submitDialog");
const recipeImage = document.querySelector("#recipeImage");
const fileStatus = document.querySelector("#fileStatus");
const toast = document.querySelector("#toast");

let selectedCategory = "הכול";
let toastTimer;

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const normalize = (value) => String(value).trim().toLocaleLowerCase("he");

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 3500);
}

function recipeSearchText(recipe) {
  return normalize([
    recipe.title,
    recipe.category,
    recipe.description,
    recipe.story,
    ...recipe.tags,
    ...recipe.ingredients.flat(),
    ...recipe.footnotes.map((footnote) => footnote.text),
  ].join(" "));
}

function renderFilters() {
  const categories = ["הכול", ...new Set(recipes.map((recipe) => recipe.category))];
  filterList.innerHTML = categories.map((category) => `
    <button class="filter-button" type="button" data-category="${escapeHtml(category)}" aria-pressed="${category === selectedCategory}">
      ${escapeHtml(category)}
    </button>
  `).join("");
}

function recipeCard(recipe) {
  return `
    <article class="recipe-card">
      <div class="recipe-card-image">
        <img src="${escapeHtml(recipe.image)}" alt="${escapeHtml(recipe.title)}" loading="lazy" />
        <span class="recipe-card-badge">${escapeHtml(recipe.category)}</span>
      </div>
      <div class="recipe-card-body">
        <h3>${escapeHtml(recipe.title)}</h3>
        <p>${escapeHtml(recipe.description)}</p>
        <ul class="recipe-card-meta" aria-label="פרטי המתכון">
          <li><span aria-hidden="true">◷</span>${escapeHtml(recipe.cookTime)}</li>
          <li><span aria-hidden="true">◌</span>${escapeHtml(recipe.waitTime)}</li>
          <li><span aria-hidden="true">◇</span>${escapeHtml(recipe.yield)}</li>
        </ul>
        <div class="recipe-card-actions">
          <button class="text-button" type="button" data-recipe-id="${escapeHtml(recipe.id)}">למתכון המלא <span aria-hidden="true">←</span></button>
        </div>
      </div>
    </article>
  `;
}

function contributionCard() {
  return `
    <article class="contribution-card">
      <span class="plus" aria-hidden="true">＋</span>
      <h3>המתכון הבא יכול להיות שלכם</h3>
      <p>שתפו מתכון משפחתי, תמונה והסיפור שמאחוריו.</p>
      <button class="button button-primary" type="button" data-open-submit>הוספת מתכון</button>
    </article>
  `;
}

function filteredRecipes() {
  const query = normalize(searchInput.value);
  return recipes.filter((recipe) => {
    const categoryMatches = selectedCategory === "הכול" || recipe.category === selectedCategory;
    const searchMatches = !query || recipeSearchText(recipe).includes(query);
    return categoryMatches && searchMatches;
  });
}

function renderRecipes() {
  const visibleRecipes = filteredRecipes();
  recipeGrid.innerHTML = [
    ...visibleRecipes.map(recipeCard),
    ...(visibleRecipes.length ? [contributionCard()] : []),
  ].join("");

  emptyState.hidden = visibleRecipes.length !== 0;
  recipeGrid.hidden = visibleRecipes.length === 0;
  resultsSummary.textContent = visibleRecipes.length === recipes.length
    ? `${recipes.length} ${recipes.length === 1 ? "מתכון שמור" : "מתכונים שמורים"}`
    : `נמצאו ${visibleRecipes.length} מתכונים`;
}

function recipeDetail(recipe) {
  const ingredients = recipe.ingredients.map(([name, amount]) => `
    <li><span>${escapeHtml(name)}</span><strong>${escapeHtml(amount)}</strong></li>
  `).join("");
  const steps = recipe.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("");
  const gallery = recipe.gallery.map((image, index) => `
    <img src="${escapeHtml(image)}" alt="${escapeHtml(recipe.title)} — תמונת הכנה ${index + 1}" loading="lazy" />
  `).join("");
  const footnotes = recipe.footnotes.map((footnote) => `
    <p class="recipe-footnote">
      ${footnote.marker ? `<span class="recipe-footnote-marker" aria-hidden="true">${escapeHtml(footnote.marker)}</span>` : ""}
      ${escapeHtml(footnote.text)}
    </p>
  `).join("");

  return `
    <div class="recipe-detail-hero">
      <div class="recipe-detail-image"><img src="${escapeHtml(recipe.image)}" alt="${escapeHtml(recipe.title)}" /></div>
      <div class="recipe-detail-summary">
        <p class="kicker">${escapeHtml(recipe.category)} · מתכון משפחתי</p>
        <h2 id="recipeDialogTitle">${escapeHtml(recipe.title)}</h2>
        <p>${escapeHtml(recipe.story)}</p>
        <dl class="detail-meta">
          <div><dt>זמן בישול</dt><dd>${escapeHtml(recipe.cookTime)}</dd></div>
          <div><dt>זמן המתנה</dt><dd>${escapeHtml(recipe.waitTime)}</dd></div>
          <div><dt>כמות</dt><dd>${escapeHtml(recipe.yield)}</dd></div>
        </dl>
        <div class="detail-actions">
          <button class="button button-primary" type="button" data-copy-recipe="${escapeHtml(recipe.id)}">העתקת המתכון</button>
          <button class="button button-secondary" type="button" data-share-recipe="${escapeHtml(recipe.id)}">שיתוף</button>
        </div>
      </div>
    </div>
    <div class="recipe-detail-body">
      <section aria-labelledby="ingredientsTitle">
        <h3 id="ingredientsTitle">מצרכים</h3>
        <ul class="ingredients-list">${ingredients}</ul>
        <div class="detail-gallery">${gallery}</div>
      </section>
      <section aria-labelledby="stepsTitle">
        <h3 id="stepsTitle">אופן ההכנה</h3>
        <ol class="steps-list">${steps}</ol>
        <aside class="recipe-footnotes" aria-labelledby="footnotesTitle">
          <h4 id="footnotesTitle">הערות מהמטבח</h4>
          ${footnotes}
        </aside>
      </section>
    </div>
  `;
}

function openRecipe(recipeId) {
  const recipe = recipes.find((item) => item.id === recipeId);
  if (!recipe) return;
  recipeDialogContent.innerHTML = recipeDetail(recipe);
  recipeDialog.showModal();
  recipeDialog.querySelector("[data-close-recipe]").focus();
}

function recipeAsText(recipe) {
  const ingredients = recipe.ingredients.map(([name, amount]) => `• ${name}: ${amount}`).join("\n");
  const steps = recipe.steps.map((step, index) => `${index + 1}. ${step}`).join("\n");
  const footnotes = recipe.footnotes.map((footnote) => `• ${footnote.text}`).join("\n");
  return `${recipe.title}\n\nמצרכים\n${ingredients}\n\nאופן ההכנה\n${steps}\n\nהערות מהמטבח\n${footnotes}\n\nGathered — The Recipe Archive`;
}

async function copyRecipe(recipeId) {
  const recipe = recipes.find((item) => item.id === recipeId);
  if (!recipe) return;
  try {
    await navigator.clipboard.writeText(recipeAsText(recipe));
    showToast("המתכון הועתק ללוח");
  } catch {
    showToast("לא הצלחנו להעתיק. אפשר לסמן ולהעתיק ידנית.");
  }
}

async function shareRecipe(recipeId) {
  const recipe = recipes.find((item) => item.id === recipeId);
  if (!recipe) return;
  const shareData = {
    title: `${recipe.title} — Gathered`,
    text: recipe.description,
    url: window.location.href.split("?")[0],
  };
  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(`${shareData.title}\n${shareData.url}`);
      showToast("הקישור הועתק לשיתוף");
    }
  } catch (error) {
    if (error.name !== "AbortError") showToast("השיתוף לא הצליח. נסו שוב.");
  }
}

filterList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  selectedCategory = button.dataset.category;
  renderFilters();
  renderRecipes();
});

searchInput.addEventListener("input", () => {
  clearSearch.hidden = searchInput.value.length === 0;
  renderRecipes();
});

clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  clearSearch.hidden = true;
  searchInput.focus();
  renderRecipes();
});

document.addEventListener("click", (event) => {
  const recipeButton = event.target.closest("[data-recipe-id]");
  const submitButton = event.target.closest("[data-open-submit]");
  const copyButton = event.target.closest("[data-copy-recipe]");
  const shareButton = event.target.closest("[data-share-recipe]");

  if (recipeButton) openRecipe(recipeButton.dataset.recipeId);
  if (submitButton) submitDialog.showModal();
  if (copyButton) copyRecipe(copyButton.dataset.copyRecipe);
  if (shareButton) shareRecipe(shareButton.dataset.shareRecipe);
});

document.querySelectorAll("[data-close-recipe]").forEach((button) => {
  button.addEventListener("click", () => recipeDialog.close());
});

document.querySelectorAll("[data-close-submit]").forEach((button) => {
  button.addEventListener("click", () => submitDialog.close());
});

[recipeDialog, submitDialog].forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
});

recipeImage.addEventListener("change", () => {
  const file = recipeImage.files[0];
  if (!file) {
    fileStatus.textContent = "";
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    recipeImage.value = "";
    fileStatus.textContent = "התמונה גדולה מ־10MB. בחרו קובץ קטן יותר.";
    showToast("התמונה גדולה מדי");
    return;
  }
  fileStatus.textContent = `נבחרה התמונה: ${file.name}`;
});

recipeCount.textContent = String(recipes.length);
renderFilters();
renderRecipes();

const url = new URL(window.location.href);
if (url.searchParams.get("sent") === "1") {
  showToast("המתכון נשלח בהצלחה — תודה ששיתפתם!");
  url.searchParams.delete("sent");
  window.history.replaceState({}, "", url);
}
