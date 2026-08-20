# “Gathered” — The Recipe Archive

A small, mobile-friendly Hebrew family recipe archive. The public site is
[hebrew-recipes.tony2timez.chatgpt.site](https://hebrew-recipes.tony2timez.chatgpt.site/).

## What it does

- Presents the recipe collection in Hebrew with right-to-left layout.
- Lets visitors copy and share recipes.
- Accepts recipe submissions through FormSubmit.
- Allows one optional recipe image per submission, with FormSubmit's 10 MB
  total attachment limit.

## Project structure

- `public/recipes.html` contains the recipe content, styling, interactions, and
  submission form.
- `app/page.tsx` displays that document in the site shell.
- `app/layout.tsx` defines the Hebrew/RTL page metadata.
- `.openai/hosting.json` connects the project to OpenAI Sites.
- `tests/` contains the rendered-output check.

## Local development

Requirements: Node.js 22.13 or newer and npm.

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

1. Edit recipe content or form markup in `public/recipes.html`.
2. Preserve `lang="he"`, right-to-left layout, labels, and keyboard-accessible
   controls.
3. Keep embedded images reasonably compressed so the page remains quick to
   load on phones.
4. Never replace the FormSubmit endpoint with a visible email address or commit
   passwords, API keys, or other secrets.
5. Run the build and tests.
6. Review the changed files, commit only the intended update, and push the same
   source revision to GitHub and OpenAI Sites.
7. After publishing, test browsing, opening and closing the submission modal,
   required-field validation, a text-only submission, and an image submission
   under 10 MB.

## Deployment

Production is hosted by OpenAI Sites. `.openai/hosting.json` identifies the
existing Sites project; do not replace its project ID or create a second site.
Public deployment should happen only after the build and tests pass.
