import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("renders the Gathered site metadata", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  assert.match(html, /Gathered — The Recipe Archive/);
  assert.match(html, /property="og:image" content="https:\/\/hebrew-recipes\.tony2timez\.chatgpt\.site\/og\.png"/);
});

test("keeps recipe submissions private and image-enabled", async () => {
  const html = await readFile(new URL("../public/recipes.html", import.meta.url), "utf8");

  assert.match(html, /formsubmit\.co\/d21170b2af05c59e1cde35c675b5e85d/);
  assert.doesNotMatch(html, /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  assert.match(html, /enctype="multipart\/form-data"/);
  assert.match(html, /type="file" accept="image\/\*"/);
});

test("uses a scalable, data-driven archive", async () => {
  const html = await readFile(new URL("../public/recipes.html", import.meta.url), "utf8");
  const script = await readFile(new URL("../public/gathered.js", import.meta.url), "utf8");
  const styles = await readFile(new URL("../public/gathered.css", import.meta.url), "utf8");

  assert.match(script, /const recipes = \[/);
  assert.match(script, /footnotes: \[/);
  assert.match(script, /class="recipe-footnotes"/);
  assert.match(script, /renderFilters\(\)/);
  assert.match(script, /renderRecipes\(\)/);
  assert.match(script, /10 \* 1024 \* 1024/);
  assert.match(styles, /font-family: "Rachel Hand"/);
  assert.match(styles, /font-family: "Noto Sans Hebrew"/);
  assert.match(styles, /font-family: "Noto Serif Hebrew"/);
  assert.match(styles, /--font-hebrew: "Noto Sans Hebrew", Arial, sans-serif/);
  assert.match(styles, /--font-hebrew-display: "Noto Serif Hebrew", Georgia, serif/);
  assert.match(styles, /font-family: var\(--font-hebrew\)/);
  assert.match(styles, /font-family: var\(--font-hebrew-display\)/);
  assert.match(styles, /\.memory-note[\s\S]*font-family: "Rachel Hand", cursive/);
  assert.match(html, /NotoSansHebrew-Variable\.ttf/);
  assert.match(html, /NotoSerifHebrew-Variable\.ttf/);
  await access(new URL("../public/fonts/NotoSansHebrew-Variable.ttf", import.meta.url));
  await access(new URL("../public/fonts/NotoSerifHebrew-Variable.ttf", import.meta.url));
  await access(new URL("../public/fonts/OFL-NotoSansHebrew.txt", import.meta.url));
  await access(new URL("../public/fonts/OFL-NotoSerifHebrew.txt", import.meta.url));
  await access(new URL("../public/fonts/Rachel-Regular.ttf", import.meta.url));
});
