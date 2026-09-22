# The browser editor: this book's side

**Audience: the book's technical contact.** Trusted contributors can edit
chapters in a web page instead of Obsidian: the browser editor (Sveltia CMS).
Two halves make that work:

- **This book's half**, which is this page. The editor page is hosted from
  `admin/`, reads a generated config, writes only to `drafts`, and needs
  contributors to have access to the repository.
- **The platform's half**: the sign-in relay every book shares, its OAuth App,
  and the allowlist of editor hosts. That half is the platform owner's, and is
  documented in
  [`textbook-registry/docs/CMS-RELAY.md`](https://github.com/textbookproject2026-alt/textbook-registry/blob/main/docs/CMS-RELAY.md).

The contributor's own guide is [`for-trusted-contributors.md`](for-trusted-contributors.md).
Don't send contributors here.

---

## What exists for this book

| Piece | Value |
|---|---|
| Editor address | <https://textbook-admin.pages.dev> (the registry's `cms.host`) |
| Pages project | `textbook-admin`, built from this repository, production branch `main`, **build output directory `admin`**, no build command |
| Editor version | pinned in `admin/index.html`: `@sveltia/cms@0.193.1` |
| Config | `admin/config.yml`, **generated**. Edit `templates/admin/config.yml` instead |
| Writes to | `drafts`, by pull request per entry (editorial workflow) |

**Build output directory `admin` is the important setting.** It means Cloudflare
uploads `admin/` and nothing else, so the chapters never reach the editor host,
and Sveltia finds `config.yml` at the root of the site.

---

## The generated config

`admin/config.yml` is rendered by `node configure.mjs` from
`templates/admin/config.yml`. Three values come from the platform registry:

| In `admin/config.yml` | From the registry |
|---|---|
| `repo` | this book's `content.repo` |
| `branch` | this book's `content.drafts_branch` |
| `base_url` | `platform.cms_auth_relay`, the shared relay |

A registry change reaches the rendered file through the Monday `apply-config`
run, which proposes the new render as a pull request. Nothing needs editing by
hand.

**`branch: drafts` is the line that keeps contributors off the live book.**
`configure.mjs` refuses to write a config whose drafts branch equals the live
branch, and so does the registry's CI. Protecting `main` (below) makes it hold
even if both were bypassed.

## Keep `admin/` out of Obsidian Publish

`admin/` is committed to `main` so it's versioned with the book, but it must
never be **published**: a reader would see the repository layout and the relay
URL, and the page would render as a broken note. `admin/` is in the `excluded`
list of `.obsidian/publish.json`. The published set is still whatever is ticked
in the Publish dialog, so check once that nothing under `admin/` is offered.

---

## Giving a contributor access

Signing in proves who someone is. It grants nothing. A contributor also needs:

**Repo → Settings → Collaborators and teams → Add people → role: Write.**

Write is the right level. It lets the editor cut its `cms/…` branches and open
pull requests, and it doesn't allow changing branch protection or settings.

**Tell them one thing before they sign in.** The shared relay asks GitHub for the
scope `repo,user`, and ignores any narrower request. So the token a contributor
hands the editor can read and write **every repository their GitHub account can
reach**, private ones included. Most contributors won't mind, but it's their
decision to make knowingly. The contributors' guide says the same.

## Protecting `main`

`main` requires a pull request (Settings → Branches), and `drafts` stays
unprotected, because the editor merges its own entry pull requests into it. The
backup job needs `backups` unprotected too.

## The drafts branch

`drafts` must exist on the remote, or the editor won't start. It was created from
`main` with a normal push. Resetting it to match `main` later rewrites history;
do that deliberately, by hand, never from a script.

---

## Checking it works

1. Open <https://textbook-admin.pages.dev> in a private window.
2. **Sign in with GitHub** and authorise *Textbook CMS*.
3. Open a chapter, make a trivial edit, and save.
4. On GitHub, confirm that a `cms/…` branch and a pull request appeared, that the
   pull request targets **`drafts`**, and that `main` is untouched.

Step 4 is the one that matters. If a pull request ever targets `main`, stop, and
read the `branch` line in `admin/config.yml` and the registry's
`content.drafts_branch`.

## When it doesn't work

| Symptom | Whose | Cause |
| --- | --- | --- |
| Popup opens and closes, still signed out | **platform owner** | `textbook-admin.pages.dev` is missing from the relay's `ALLOWED_DOMAINS`, or the relay is down |
| Signs in, but saving fails | yours | the contributor doesn't have **Write** |
| The editor looks old, or a chapter that exists isn't listed | yours | the `textbook-admin` Pages project has disconnected from Git and stopped rebuilding. It has happened before. Reconnect it in the Cloudflare dashboard |
| The whole chapter is one text box | nobody | correct. `format: raw`: the files have no frontmatter |
| A save adds a `---` block at the top | yours | `format: raw` was changed. Revert it in `templates/admin/config.yml` |
