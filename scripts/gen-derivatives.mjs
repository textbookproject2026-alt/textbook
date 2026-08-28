#!/usr/bin/env node
// scripts/gen-derivatives.mjs
//
// Regenerates community/derivatives.md — the map of department editions — from
// the GitHub API and writes it back into the checkout.
//
// Run:  node scripts/gen-derivatives.mjs
// Flags:
//   --out <path>   write somewhere other than community/derivatives.md
//   --stdout       print the page instead of writing it
//   --check        write nothing; exit 1 if the file on disk is out of date
//
// Node 22, no dependencies. Uses global fetch. GITHUB_TOKEN is used if the
// environment sets one; unauthenticated works fine for a public repo, at 60
// requests an hour.
//
// ---------------------------------------------------------------------------
// FOUR THINGS TO KNOW BEFORE CHANGING THIS FILE
//
//  1. A DEPARTMENT EDITION IS A FORK OF THE TEMPLATE, NOT OF THE BOOK.
//     Coordinators fork textbookproject2026-alt/textbook-edition-template —
//     the site machinery — and copy chapters into it (docs/for-course-
//     coordinators.md, Step 1). Nobody forks the textbook repository to make an
//     edition; someone forking *that* is taking a copy of the manuscript, which
//     is a different thing and does not belong on this page. So UPSTREAM below
//     is the template repo, and pointing it at this repository would fill the
//     page with strangers' snapshots of the book.
//
//  2. The output must be a pure function of what the API returns. The weekly
//     workflow opens a pull request only when the regenerated page differs
//     byte-for-byte from the committed one, so anything that moves on its own —
//     a `new Date()` stamp, an unsorted list — turns a quiet job into a pull
//     request every Sunday for the rest of time. That is why the page is dated
//     from the most recent edition's own last change and not from today, and
//     why editions are sorted on their data rather than left in API order.
//
//  3. Never write a page from a failed or partial fetch. A rate-limited run
//     that "found no editions" would silently propose deleting every entry, and
//     the pull request would look plausible. Any network or API failure throws
//     before anything is written.
//
//  4. Site URLs are discovered, never guessed — see findSiteUrl(). A fork
//     inherits the template's description and homepage at the moment it is
//     created, so both are checked against the upstream values and ignored when
//     they match: inherited metadata says what the *template* is, not what the
//     edition is. And an untouched fork still carries Quartz's own README, full
//     of Quartz's links, which is why README scanning accepts only static-host
//     addresses and refuses hosts belonging to the template or the canonical
//     book. An edition with no findable address gets none printed.
//
// NO DIAGRAM HERE, ON PURPOSE: a mermaid graph of canonical-book-to-editions
// would be one box pointing at one other box, which tells a reader less than
// the sentence above it does. Past roughly five editions — enough for clusters,
// shared ancestry, or editions of editions to be visible — a diagram starts
// earning its space, and docs/for-course-coordinators.md already has one to
// match in style.
// ---------------------------------------------------------------------------

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// --- Configuration ---------------------------------------------------------

// The site template. Forks of THIS are department editions. See note 1.
const UPSTREAM = 'textbookproject2026-alt/textbook-edition-template';

// Forks owned by the project itself are test copies and staging, not editions.
const SKIP_OWNERS = new Set(['textbookproject2026-alt']);

// Hosts that a README link must sit on to count as an edition's live site.
// Coordinators are sent to Cloudflare Pages by the setup guide; the rest are
// here so an edition hosted somewhere ordinary is still found.
const SITE_HOSTS = [/\.pages\.dev$/i, /\.github\.io$/i, /\.netlify\.app$/i, /\.vercel\.app$/i];

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

// --- Small helpers ---------------------------------------------------------

function parseArgs(argv) {
  const opts = { out: path.join(REPO_ROOT, 'community', 'derivatives.md'), stdout: false, check: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--out') opts.out = path.resolve(argv[++i] ?? '');
    else if (a === '--stdout') opts.stdout = true;
    else if (a === '--check') opts.check = true;
    else if (a === '--help' || a === '-h') opts.help = true;
    else throw new Error(`Unknown argument: ${a}`);
  }
  return opts;
}

/** "2026-07-24T12:18:59Z" -> "24 July 2026". */
function longDate(iso) {
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}`;
}

const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/** Trim, collapse whitespace, and finish the sentence if the author didn't. */
function asSentence(text) {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (!clean) return '';
  return /[.!?]$/.test(clean) ? clean : `${clean}.`;
}

// --- Talking to GitHub -----------------------------------------------------

async function api(url, { raw = false } = {}) {
  const headers = {
    accept: raw ? 'application/vnd.github.raw' : 'application/vnd.github+json',
    'user-agent': 'gen-derivatives (textbook)',
    'x-github-api-version': '2022-11-28',
  };
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const res = await fetch(url, { headers });

  // 404 on a README is an answer ("this fork has none"), not a failure. Every
  // other bad status is a failure, and failures must not reach the page — see
  // note 3 — so they throw rather than resolving to null.
  if (res.status === 404) return null;
  if (!res.ok) {
    const remaining = res.headers.get('x-ratelimit-remaining');
    const hint = res.status === 403 && remaining === '0'
      ? ' — rate limited; set GITHUB_TOKEN and retry'
      : '';
    throw new Error(`GitHub API ${res.status} ${res.statusText} for ${url}${hint}`);
  }
  return raw ? res.text() : res.json();
}

/** Every fork of a repository, following pagination. */
async function fetchForks(repo) {
  const forks = [];
  let url = `https://api.github.com/repos/${repo}/forks?per_page=100&sort=oldest`;

  while (url) {
    const res = await fetch(url, {
      headers: {
        accept: 'application/vnd.github+json',
        'user-agent': 'gen-derivatives (textbook)',
        'x-github-api-version': '2022-11-28',
        ...(process.env.GITHUB_TOKEN ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
      },
    });
    if (!res.ok) throw new Error(`GitHub API ${res.status} ${res.statusText} listing forks of ${repo}`);
    forks.push(...(await res.json()));

    // Link: <...>; rel="next" — the only pagination cursor the API gives us.
    url = /<([^>]+)>;\s*rel="next"/.exec(res.headers.get('link') ?? '')?.[1] ?? null;
  }
  return forks;
}

// --- Finding an edition's live site ----------------------------------------

const hostIsSite = (host) => SITE_HOSTS.some((re) => re.test(host));

function normaliseUrl(raw, forbiddenHosts) {
  let url;
  try {
    url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return null;
  }
  const host = url.hostname.toLowerCase().replace(/^www\./, '');
  if (forbiddenHosts.has(host)) return null;
  return { host, href: `${url.origin}${url.pathname === '/' ? '' : url.pathname}` };
}

/**
 * The edition's public address, or null.
 *
 * Order is homepage, then README, then nothing — deliberately no fourth step.
 * (If editions ever move to GitHub Pages, GET /repos/{o}/{r}/pages returns the
 * real address and would be a legitimate third source. Deriving a URL from the
 * repository name would not be: it produces a link that 404s.)
 */
async function findSiteUrl(fork, upstream, forbiddenHosts) {
  // Set by the owner — but forks are created carrying the template's homepage,
  // and that inherited value points at the template's demo site, not theirs.
  if (fork.homepage && fork.homepage.trim() && fork.homepage.trim() !== (upstream.homepage ?? '').trim()) {
    const found = normaliseUrl(fork.homepage.trim(), forbiddenHosts);
    if (found) return { url: found.href, source: 'homepage' };
  }

  const readme = await api(`https://api.github.com/repos/${fork.full_name}/readme`, { raw: true });
  if (!readme) return null;

  // An unmodified fork still has Quartz's README, so a first-URL-wins scan
  // would publish quartz.jzhao.xyz as somebody's department edition. Only
  // static-host addresses count, and never the template's or the book's own.
  for (const match of readme.matchAll(/https?:\/\/[^\s<>()[\]"'`]+/g)) {
    const found = normaliseUrl(match[0].replace(/[.,;:!?)]+$/, ''), forbiddenHosts);
    if (found && hostIsSite(found.host)) return { url: found.href, source: 'README' };
  }
  return null;
}

// --- Collecting the editions -----------------------------------------------

async function collectEditions(config) {
  const upstream = await api(`https://api.github.com/repos/${UPSTREAM}`);
  if (!upstream) throw new Error(`Template repository ${UPSTREAM} not found.`);

  const forks = await fetchForks(UPSTREAM);

  // Addresses that are never an edition's own: the template's demo site and
  // the canonical book. Both turn up in READMEs copied from the template.
  const forbiddenHosts = new Set();
  for (const candidate of [upstream.homepage, config.site_url]) {
    const parsed = candidate ? normaliseUrl(candidate, new Set()) : null;
    if (parsed) forbiddenHosts.add(parsed.host);
  }
  forbiddenHosts.add(`${upstream.name}.pages.dev`.toLowerCase()); // the guide's preview site

  const editions = [];
  for (const fork of forks) {
    if (fork.archived || fork.disabled) continue;
    if (SKIP_OWNERS.has(fork.owner.login.toLowerCase())) continue;

    // A fork inherits the template's description too; if it still matches, the
    // coordinator has not said what their edition is.
    const own = (fork.description ?? '').trim();
    const description = own && own !== (upstream.description ?? '').trim() ? own : null;

    const site = await findSiteUrl(fork, upstream, forbiddenHosts);

    editions.push({
      owner: fork.owner.login,
      repo: fork.name,
      fullName: fork.full_name,
      description,
      // pushed_at, not updated_at: the date the *content* last moved. updated_at
      // also ticks when someone stars the repo or edits its description.
      lastChanged: fork.pushed_at ?? fork.created_at,
      created: fork.created_at,
      repoUrl: fork.html_url,
      siteUrl: site?.url ?? null,
    });
  }

  // Most recently changed first; ties broken on data, never on API order.
  editions.sort((a, b) =>
    b.lastChanged.localeCompare(a.lastChanged) || a.fullName.localeCompare(b.fullName));

  return editions;
}

// --- Rendering -------------------------------------------------------------

function renderIntro(editions, config) {
  const { title } = config;
  const lines = [
    `A department edition is a copy of *${title}* that a course runs as its own site. The text is the same — the chapters come from this book and stay in step with it — but the edition has its own web address and its own front page. Margin discussion is not separated per edition: every edition shares the public annotation layer with this book, and per-cohort isolation was considered and not adopted. Coordinators can also cut chapters they are not teaching and add examples that suit their students.`,
    '',
    'This page lists the editions that exist. It is rebuilt weekly from the forks of the edition template, so an edition appears here on its own once it is published — there is nothing to submit.',
    '',
  ];

  if (editions.length === 0) {
    lines.push('No department editions have been published yet. The first one to appear will be listed here.');
    return lines;
  }

  lines.push(editions.length === 1
    ? 'So far there is one, listed below.'
    : `There are ${plural(editions.length, 'edition')}, listed below with the most recently changed first.`);
  return lines;
}

function renderEdition(edition) {
  const { owner, repo, description, lastChanged, repoUrl, siteUrl } = edition;

  // Each entry reads as a sentence or two, not a row of fields.
  const what = description
    ? asSentence(description)
    : 'The repository does not yet say what the edition is for.';

  const where = siteUrl
    ? `Published at [${siteUrl.replace(/^https?:\/\//, '')}](${siteUrl}), from [${repo}](${repoUrl}).`
    : `Kept at [${repo}](${repoUrl}); no public address is listed on the repository yet.`;

  return `- **${owner}** — ${what} Last changed ${longDate(lastChanged)}. ${where}`;
}

function renderPage({ editions, config, generatedOn }) {
  const out = ['# Department editions', ''];

  out.push(...renderIntro(editions, config), '');

  if (editions.length > 0) {
    out.push('## The editions', '');
    out.push(...editions.map(renderEdition), '');
    out.push('An edition that has not changed in a while is not necessarily abandoned — a course that has finished teaching a chapter has no reason to touch its copy until the next term. Where no public address is shown, the edition exists as a repository but has not told us where it is published; its coordinator can add the address to the repository\'s homepage field and it will appear here at the next rebuild.', '');
  }

  out.push('## Running your own', '');
  out.push('Any department can publish an edition, and doing so needs no permission and no terminal — the whole setup runs through GitHub and Cloudflare in an afternoon. The walkthrough is [[for-course-coordinators|Setting up a department edition]].', '');
  out.push(`Editions are separate sites, not mirrors: what a course changes in its own copy stays there. Corrections that belong in the book itself travel the other way, as a suggested edit or an issue against the canonical repository, and from there into every edition that takes the next update. Everyone who has made one is credited on the [[contributors|contributors page]].`, '');

  out.push('---', '');
  out.push(`*Editions carry ${config.licence}, the same licence as the book: share and adapt freely, with attribution, under the same terms. Each edition is maintained by its own department, not by ${config.maintainer}.*`, '');
  out.push(generatedOn
    ? `*This page is rebuilt weekly from the forks of \`${UPSTREAM}\`, and is dated by the most recent change to any edition: ${generatedOn}.*`
    : `*This page is rebuilt weekly from the forks of \`${UPSTREAM}\`. Nothing to date yet.*`, '');

  return `${out.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd()}\n`;
}

// --- Main ------------------------------------------------------------------

async function readConfig() {
  const fallback = { title: 'this textbook', maintainer: 'the maintainer', licence: 'CC-BY-SA-4.0', site_url: '' };
  try {
    const raw = JSON.parse(await fs.readFile(path.join(REPO_ROOT, 'textbook.config.json'), 'utf8'));
    return { ...fallback, ...raw };
  } catch {
    console.warn('WARNING: textbook.config.json could not be read; using defaults.');
    return fallback;
  }
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    console.log('usage: node scripts/gen-derivatives.mjs [--out <path>] [--stdout] [--check]');
    return 0;
  }

  const config = await readConfig();
  const editions = await collectEditions(config);

  // The stamp is the newest edition's own last change, never today's date:
  // see note 2 at the top of this file. With no editions there is no date to
  // take, and the "last updated" line is left off rather than invented.
  const newest = editions.reduce((acc, e) => (acc && acc > e.lastChanged ? acc : e.lastChanged), null);
  const generatedOn = newest ? longDate(newest) : null;

  const page = renderPage({ editions, config, generatedOn });

  if (opts.stdout) {
    process.stdout.write(page);
    return 0;
  }

  let current = null;
  try { current = await fs.readFile(opts.out, 'utf8'); } catch { /* not written yet */ }

  if (opts.check) {
    if (current === page) {
      console.log(`${path.relative(REPO_ROOT, opts.out)} is up to date.`);
      return 0;
    }
    console.error(`${path.relative(REPO_ROOT, opts.out)} is out of date — run: node scripts/gen-derivatives.mjs`);
    return 1;
  }

  if (current === page) {
    console.log(`${path.relative(REPO_ROOT, opts.out)} unchanged (${plural(editions.length, 'edition')}).`);
    return 0;
  }

  await fs.mkdir(path.dirname(opts.out), { recursive: true });
  await fs.writeFile(opts.out, page);
  const withSites = editions.filter((e) => e.siteUrl).length;
  console.log(`wrote ${path.relative(REPO_ROOT, opts.out)} — ${plural(editions.length, 'edition')}, ${withSites} with a known site.`);
  return 0;
}

process.exitCode = await main();
