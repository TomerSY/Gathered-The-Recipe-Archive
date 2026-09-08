# Contributing to Gathered

GitHub is the source of truth for Gathered. GitHub Pages publishes the static
site from `main`; OpenAI Sites remains an available fallback.

## Everyday workflow

1. Start from an up-to-date `main` branch.
2. Create a short, descriptive branch such as `simplify-fonts`.
3. Make and review the change locally.
4. Run `npm test` and `npm run build:pages`.
5. Push the branch and open a pull request.
6. Merge only after the GitHub `Verify site` check passes.
7. GitHub Pages publishes the tested commit from `main` automatically.

## Local setup

The primary working copy is expected at:

```text
~/Downloads/codex/simple sites/Gathered-The-Recipe-Archive
```

Install and preview the project with:

```bash
npm ci
npm run dev
```

Before proposing a change, run:

```bash
npm test
```

## Publishing rules

- Publish only committed code from GitHub `main`.
- Keep the GitHub Pages workflow enabled and deploy only from `main`.
- Keep `.openai/hosting.json` and its existing project ID unchanged.
- Build and test before publishing.
- Record the originating GitHub commit when a release is published.
- Never edit GitHub and the OpenAI Sites source independently.
- Never commit passwords, API keys, private email addresses, or deployment
  credentials.

The GitHub Pages URL is
[Tomersy.github.io/Gathered-The-Recipe-Archive](https://tomersy.github.io/Gathered-The-Recipe-Archive/).
