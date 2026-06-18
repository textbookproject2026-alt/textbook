// Render everything under templates/ into the repo, filling tokens from textbook.config.json.
// Re-runnable: edit the config, run again, the managed files regenerate. The config is the source of truth.
import { readFile, writeFile, readdir, mkdir } from "node:fs/promises";
import { join, dirname, relative } from "node:path";

const ROOT = process.cwd();
const TEMPLATES = join(ROOT, "templates");

const config = JSON.parse(await readFile(join(ROOT, "textbook.config.json"), "utf8"));

// config key "site_url" -> token "__SITE_URL__". Add a key, use its token in any template, no code change.
const tokens = Object.fromEntries(
  Object.entries(config).map(([k, v]) => [`__${k.toUpperCase()}__`, String(v)]),
);

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

const leftovers = new Set();

for (const src of await walk(TEMPLATES)) {
  let text = await readFile(src, "utf8");
  for (const [token, value] of Object.entries(tokens)) text = text.split(token).join(value);
  for (const m of text.match(/__[A-Z0-9_]+__/g) ?? []) leftovers.add(m); // catch anything unfilled

  const dest = join(ROOT, relative(TEMPLATES, src));
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, text);
  console.log("wrote", relative(ROOT, dest));
}

if (leftovers.size)
  console.warn("\nUnfilled placeholders — add them to textbook.config.json:", [...leftovers].join(", "));
