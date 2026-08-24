# Gathered — The Recipe Archive

A small, mobile-friendly Hebrew family recipe archive. The public site is
[hebrew-recipes.tony2timez.chatgpt.site](https://hebrew-recipes.tony2timez.chatgpt.site/).

## What it does

- Presents a warm, searchable Hebrew recipe archive with right-to-left layout.
- Generates category filters from the recipe data as the collection grows.
- Lets visitors copy and share recipes.
- Accepts recipe submissions through FormSubmit.
- Allows one optional recipe image per submission, with FormSubmit's 10 MB
  total attachment limit.

## Project structure

- `public/recipes.html` contains the accessible page structure and submission
  form.
- `public/gathered.css` contains the responsive design system and layouts.
- `public/gathered.js` contains the recipe collection and archive interactions.
- `public/images/` contains compressed recipe photography.
- `public/fonts/NotoSansHebrew-Variable.ttf` is the self-hosted interface font
  used for Hebrew navigation, forms, recipes, and supporting text.
- `public/fonts/NotoSerifHebrew-Variable.ttf` is the self-hosted Hebrew
  headline and recipe-title font.
- `public/fonts/Rachel-Regular.ttf` is the family handwriting font used for
  recipe footnotes and the yellow family note.
- `public/fonts/OFL-NotoSansHebrew.txt` contains the Noto Sans Hebrew license.
- `public/fonts/OFL-NotoSerifHebrew.txt` contains the Noto Serif Hebrew license.
- `public/og.png` is the generated social-preview image.
- `app/page.tsx` displays that document in the site shell.
- `app/layout.tsx` defines the Hebrew/RTL page metadata.
- `.openai/hosting.json` connects the project to OpenAI Sites.
- `tests/` contains the rendered-output check.

## Local development

Requirements: Node.js 22.13 or newer and npm.

GitHub is the source of truth for this project. The primary working copy is
kept in `~/Desktop/Tomer/Gathered-The-Recipe-Archive`; OpenAI Sites remains the
production host. See [CONTRIBUTING.md](CONTRIBUTING.md) for the branch, review,
testing, and publishing workflow.

```bash
npm ci
npm run dev
```

Before publishing a change:

```bash
npm run build
npm test
```

The included lifecycle scripts target the Linux-based Sites build environment
and use GNU `timeout` and `flock`.

## Adding a recipe

Add one object to the `recipes` array at the top of `public/gathered.js`. Give
it a unique `id` and provide the same fields as the existing recipe. Categories,
the search index, recipe count, cards, and detail views update automatically.

Every recipe must include a `footnotes` array. Footnotes are short,
recipe-specific substitutions, warnings, timing corrections, or family
observations. They automatically render in Rachel's handwriting. Keep
ingredients, steps, navigation, buttons, and longer explanatory copy in the
interface font for readability.

Put compressed recipe images in `public/images/` and reference them with root
paths such as `/images/example.webp`.

## Recipe submissions

The form in `public/recipes.html` posts to FormSubmit using its random-looking
endpoint, so the destination email address is not exposed in the page source.
Keep the form configured with:

- `method="POST"`
- `enctype="multipart/form-data"` for image attachments
- an image input with `accept="image/*"`
- the absolute `_next` success URL for this site

The owner must activate the form from FormSubmit's confirmation email before
submissions are delivered. Uploaded files arrive as email attachments and are
not retained in FormSubmit's submission archive.

## Maintenance checklist

1. Add or edit recipe data in `public/gathered.js`; change page structure only
   when needed in `public/recipes.html`.
2. Preserve `lang="he"`, right-to-left layout, labels, and keyboard-accessible
   controls.
3. Keep images reasonably compressed so the page remains quick to
   load on phones.
4. Follow the design tokens in `public/gathered.css` and test at mobile and
   desktop widths. Preserve visible focus, readable contrast, clear feedback,
   and large touch targets.
5. Never replace the FormSubmit endpoint with a visible email address or commit
   passwords, API keys, or other secrets.
6. Run the build and tests.
7. Review the changed files, commit only the intended update, and merge it into
   GitHub `main` after the automated check passes.
8. Publish that tested GitHub commit to the existing OpenAI Sites project.
9. After publishing, test browsing, opening and closing both dialogs, search,
   filters,
   required-field validation, a text-only submission, and an image submission
   under 10 MB.

## Design notes

The visual system uses warm cream paper tones, terracotta accents, and deep
forest green. Noto Sans Hebrew handles practical interface and reading text;
Noto Serif Hebrew gives headlines and recipe titles a warmer editorial voice.
The custom `G`-and-leaf mark is implemented in HTML/CSS so it stays sharp at
every size. Layouts use responsive grids, semantic headings, native dialogs,
visible focus states, reduced-motion support, and concise feedback for
important actions. Rachel's handwriting is reserved for recipe footnotes and
the yellow family note so it retains its personal meaning and never competes
with practical cooking instructions.

## Deployment

Production is hosted by OpenAI Sites. `.openai/hosting.json` identifies the
existing Sites project; do not replace its project ID or create a second site.
GitHub `main` is the canonical source, and the Sites repository is only a
deployment destination. Public deployment should happen only from a tested,
committed GitHub revision after the build and tests pass.
