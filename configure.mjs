// Render everything under templates/ into the repo, filling tokens from textbook.config.json
// and from this book's entry in the platform registry (textbook-registry/registry.json).
// Re-runnable: edit the config or the registry, run again, the managed files regenerate.
//
// The registry is read from a sibling checkout (../textbook-registry) unless TEXTBOOK_REGISTRY
// points at a registry.json. A fresh clone needs the registry next to it:
//   git clone https://github.com/textbookproject2026-alt/textbook-registry ../textbook-registry
import { readFile, writeFile, readdir, mkdir } from "node:fs/promises";
import { join, dirname, relative, resolve } from "node:path";

const ROOT = process.cwd();
const TEMPLATES = join(ROOT, "templates");
const REGISTRY = resolve(process.env.TEXTBOOK_REGISTRY ?? join(ROOT, "..", "textbook-registry", "registry.json"));

function fail(message) {
  console.error(`configure: ${message}\nNothing was written.`);
  process.exit(1);
}

const config = JSON.parse(await readFile(join(ROOT, "textbook.config.json"), "utf8"));

let registry;
try {
  registry = JSON.parse(await readFile(REGISTRY, "utf8"));
} catch (err) {
  fail(
    `cannot read the registry at ${REGISTRY} (${err.code ?? err.message}).\n` +
      "Clone textbookproject2026-alt/textbook-registry next to this repo, or set TEXTBOOK_REGISTRY to its registry.json.",
  );
}

if (!config.slug) fail('textbook.config.json has no "slug", so the book cannot be found in the registry.');
const book = registry.books?.find((b) => b.slug === config.slug);
if (!book) fail(`no book with slug "${config.slug}" in ${REGISTRY}.`);
if (book.status === "retired") fail(`book "${config.slug}" is retired.`);
if (book.status === "live" && !book.site?.domain) fail(`book "${config.slug}" is live but has no site domain.`);
// admin/config.yml's `branch:` is the line that keeps the browser editor off the live book.
// The registry's CI enforces this too; checked again here because this is where it is written.
if (!book.content?.drafts_branch) fail(`book "${config.slug}" has no content.drafts_branch.`);
if (book.content.drafts_branch === book.content.live_branch)
  fail(`book "${config.slug}" has drafts_branch equal to live_branch ("${book.content.live_branch}").`);

// Unset values (missing, null or "") are left out, so their placeholder stays in the output
// untouched and is reported below. Blanking it would defeat checks like publish.js's
// "no suggest-edit backend configured yet" test, which looks for the unfilled token.
const isSet = (v) => v !== undefined && v !== null && v !== "";

// config key "site_url" -> token "__SITE_URL__". Add a key, use its token in any template, no code change.
const tokens = Object.fromEntries(
  Object.entries(config)
    .filter(([, v]) => isSet(v))
    .map(([k, v]) => [`__${k.toUpperCase()}__`, String(v)]),
);

// Registry values. Adding one is a line here plus its token in a template.
const registryTokens = {
  __CONTENT_REPO__: book.content?.repo,
  __DRAFTS_BRANCH__: book.content?.drafts_branch,
  __SITE_DOMAIN__: book.site?.domain,
  __SUGGEST_EDIT_ENDPOINT__: registry.platform?.suggest_edit_endpoint,
  __CMS_AUTH_RELAY__: registry.platform?.cms_auth_relay,
  __PLAUSIBLE_SCRIPT_SRC__: book.analytics?.plausible?.script_src,
};
for (const [token, value] of Object.entries(registryTokens)) {
  if (token in tokens) fail(`${token} is set by both textbook.config.json and the registry.`);
  if (isSet(value)) tokens[token] = String(value);
}

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

// Render everything first, then write, so a bad config or registry leaves the repo untouched.
const rendered = [];
const leftovers = new Set();

// Files that must render completely. A placeholder left in the CMS config would ship a broken
// editor (a branch or repo named __SOMETHING__), so it stops the run instead of warning.
const STRICT = new Set(["admin/config.yml"]);

for (const src of await walk(TEMPLATES)) {
  let text = await readFile(src, "utf8");
  for (const [token, value] of Object.entries(tokens)) text = text.split(token).join(value);
  const unfilled = text.match(/__[A-Z0-9_]+__/g) ?? []; // catch anything unfilled
  const rel = relative(TEMPLATES, src);
  if (STRICT.has(rel) && unfilled.length) fail(`${rel} has unfilled placeholders: ${[...new Set(unfilled)].join(", ")}.`);
  for (const m of unfilled) leftovers.add(m);
  rendered.push([join(ROOT, rel), text]);
}

for (const [dest, text] of rendered) {
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, text);
  console.log("wrote", relative(ROOT, dest));
}

if (leftovers.size)
  console.warn(
    "\nUnfilled placeholders, left in place. Set them in textbook.config.json or the registry:",
    [...leftovers].join(", "),
  );
