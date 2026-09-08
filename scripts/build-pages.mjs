import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "public");
const output = path.join(root, "dist-pages");
const pagesUrl = "https://tomersy.github.io/Gathered-The-Recipe-Archive/";

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });

const sourceHtml = await readFile(path.join(source, "recipes.html"), "utf8");
const pagesHtml = sourceHtml
  .replace(/(href|src)="\/(?!\/)/g, '$1="./')
  .replace(
    /<input type="hidden" name="_next" value="[^"]+" \/>/,
    '<input type="hidden" name="_next" value="' + pagesUrl + '?sent=1" />',
  );

const sourceCss = await readFile(path.join(source, "gathered.css"), "utf8");
const pagesCss = sourceCss.replace(/url\("\/(?!\/)/g, 'url("./');

const sourceJs = await readFile(path.join(source, "gathered.js"), "utf8");
const pagesJs = sourceJs.replace(/(["\'\x60])\/(images\/)/g, "$1./$2");

await Promise.all([
  writeFile(path.join(output, "index.html"), pagesHtml),
  writeFile(path.join(output, "recipes.html"), pagesHtml),
  writeFile(path.join(output, "gathered.css"), pagesCss),
  writeFile(path.join(output, "gathered.js"), pagesJs),
  writeFile(path.join(output, ".nojekyll"), ""),
]);

const remainingRootAsset = /(?:href|src)="\/(?!\/)|url\("\/(?!\/)|["\'\x60]\/images\//;
for (const [name, contents] of [
  ["index.html", pagesHtml],
  ["gathered.css", pagesCss],
  ["gathered.js", pagesJs],
]) {
  if (remainingRootAsset.test(contents)) {
    throw new Error(name + " still contains a root-relative asset URL");
  }
}

console.log("GitHub Pages site built in " + output);
