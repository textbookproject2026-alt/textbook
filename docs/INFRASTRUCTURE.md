# Infrastructure inventory

**Audience: the technical contact.** Every service the textbook depends on, what
it does, what breaks if it disappears, and where its credential lives. This is
the doc to read first when inheriting the project, and the doc to check when
something is broken and it isn't obvious which system owns it.

**This file never records a secret value** — only the *place* a secret is kept.
If you find a token, key or password written into this file, that is a bug:
remove it and rotate the credential.

Two things this file deliberately does not do. It does not explain how to *use*
any of these systems — each row points at the guide that does. And where account
ownership could not be established from the repositories, it says
**confirm at handover** rather than guessing. Those rows are the ones to resolve
first.

---

## At a glance

| # | Service | What it is | Breaks if gone |
|---|---|---|---|
| 1 | GitHub org `textbookproject2026-alt` | Five repositories; the source of truth for everything | Everything |
| 2 | Obsidian Publish | The reading site at `bptext2026.xyz` | The book is offline |
| 3 | Cloudflare Worker `sveltia-cms-auth` | OAuth relay for the browser editor | Contributors cannot sign in to the CMS |
| 4 | Cloudflare Pages `textbook-cms` | Hosts the browser editor | The CMS is offline |
| 5 | Cloudflare Pages `textbook-edition-template` | The template's demo site | Coordinators lose the preview link |
| 6 | Vercel `suggest-edit-function` | Backend for the *Suggest an edit* button | The button fails for every reader |
| 7 | Plausible | Visitor analytics, per site | No readership figures; project health page loses a link |
| 8 | Hypothes.is | The margin annotation layer | Annotation stops; the weekly backup fails |
| 9 | GitHub OAuth App *Textbook CMS* | Identity for the browser editor | Contributors cannot sign in |
| 10 | GitHub OAuth App *Textbook Author Console* | Identity for the app's console | The author cannot see the queue |
| 11 | The bot account + `BOT_TOKEN` | Files reader suggestions as issues | Suggestions vanish silently |
| 12 | Apple Developer ID | Signs and notarises the authoring app | No new releases of the app |
| 13 | DeepSeek (optional) | Extra glossary suggestions | Nothing — the app carries on without it |

---

## 1. GitHub organisation — `textbookproject2026-alt`

The root of everything. Five repositories:

| Repo | What it holds | Notes |
|---|---|---|
| `textbook` | The book, the workflows, the scripts, the CMS config, this doc | The canonical repo. `main` is **branch-protected**: pull request required. |
| `textbook-edition-template` | The Quartz site machinery department editions build from | Editions are **forks** of this. See the open question in `docs/DOCS-REMEDIATION.md` (3.4). |
| `quartz-edition-extras` | Two Quartz plugins every edition installs at build time | See its `README.md`. |
| `suggest-edit-function` | The Vercel serverless function behind the suggest-edit form | |
| `authoring-assistant` | The macOS app the author writes and reviews in | Cloned over **HTTPS**, unlike the others. Operator guide: `docs/the-authoring-app-operations.md`. |

**Push identity.** The other four repos are pushed over SSH using an alias:
`github-textbook` → key `~/.ssh/id_ed25519_textbook`, configured in
`~/.ssh/config` on the maintainer's machine. A fresh machine needs that alias set
up before any `git push` will work; the remotes are written as
`git@github-textbook:textbookproject2026-alt/<repo>.git`, so a plain
`git@github.com:` clone will not match what the working copies expect.

**Repository secrets** (Settings → Secrets and variables → Actions, on
`textbook`):

| Secret | Used by | If it expires |
|---|---|---|
| `HYPOTHESIS_API_TOKEN` | `backup-annotations.yml`, `dashboard.yml` | The Sunday backup fails loudly at 03:00 UTC; the dashboard job refuses to run rather than publishing zeros. Issued at <https://hypothes.is/account/developer> **while signed in as the account that owns the annotation groups** (see §8). |

`GITHUB_TOKEN` is GitHub's built-in per-run token; nothing to manage.

**Branch protection.** `main` requires a pull request. `drafts` and `backups` are
deliberately unprotected — the CMS merges its own entry pull requests into
`drafts`, and the backup job pushes straight to `backups`. Leave both as they are;
`.github/workflows/backup-annotations.yml` carries the reasoning in a header
comment.

**Auto-merge.** Three weekly workflows arm GitHub auto-merge on the pull requests
they open. That requires **"Allow auto-merge" switched on in repository settings**.
If it is off, the step logs a warning and leaves the pull request open rather than
failing — so the symptom is chore pull requests quietly piling up. See
`docs/scheduled-actions-health-check.md`.

---

## 2. Obsidian Publish — the reading site

- **Address:** <https://bptext2026.xyz> (staging; see *The domain cutover* below)
- **Site record:** `.obsidian/publish.json` — `siteId 1443b409a84e491249da35fdd4b91de6`,
  host `publish-01.obsidian.md`
- **Account owner:** **confirm at handover.** A paid Obsidian Publish subscription
  sits behind this and the repositories do not record whose it is.
- **How content reaches it:** the author's Publish dialog in Obsidian, and nothing
  else. Committing to GitHub does not publish. This catches everyone once —
  `publish.css` and `publish.js` in particular reach the live site *only* through
  that dialog.
- **Excluded from publishing:** `admin/` and `OAUTH-SETUP.md`, via the `excluded`
  array in `.obsidian/publish.json`. Keep them there; the CMS config would expose
  the repository layout and the Worker URL to readers, and the admin page would
  render as a broken note in the middle of the book.
- **Breaks if gone:** the book is offline. The source text is unaffected — the site
  can be republished from the vault.
- **Guides:** `docs/editing-the-textbook.md` (author-facing), `docs/troubleshooting.md`.

> **Open gap.** How the author's vault reaches GitHub at all is undocumented —
> there is no obsidian-git plugin installed, and Obsidian Sync is enabled in
> `.obsidian/core-plugins.json` but described nowhere. Tracked as 3.2 in
> `docs/DOCS-REMEDIATION.md`.

---

## 3. Cloudflare Worker — `sveltia-cms-auth`

- **URL:** `https://sveltia-cms-auth.brandonproject2026.workers.dev`
- **Account owner:** **confirm at handover.** The `workers.dev` subdomain is
  `brandonproject2026`, which identifies the Cloudflare account but not the person
  holding its login.
- **What it does:** OAuth relay for the browser editor. It swaps GitHub's one-time
  code for an access token and hands it back to the browser. It is *not* an
  identity provider and it stores nothing.
- **Secrets, held as Worker variables** (Cloudflare dashboard → Workers & Pages →
  `sveltia-cms-auth` → Settings → Variables and Secrets):
  - `GITHUB_CLIENT_ID` — plain text
  - `GITHUB_CLIENT_SECRET` — **encrypted**
  - `ALLOWED_DOMAINS` — currently `textbook-cms.pages.dev`. This is what stops
    another site pointing at this Worker and borrowing the OAuth app to mint tokens
    against the textbook repo. Setting it to the production hostname only also
    means Cloudflare's per-deployment preview URLs cannot sign in, which is
    intended.
- **Referenced from:** `admin/config.yml` (`base_url`). If the Worker is
  redeployed at a different subdomain, that line must change too.
- **Breaks if gone:** every contributor's "Sign in with GitHub" fails — the popup
  opens and closes and they stay signed out.
- **Guide:** `OAUTH-SETUP.md`.

---

## 4. Cloudflare Pages — `textbook-cms`

- **URL:** <https://textbook-cms.pages.dev>
- **Account owner:** **confirm at handover** (same Cloudflare account as §3, as far
  as the repositories show).
- **What it does:** serves the browser editor (Sveltia CMS). Built from the
  `textbook` repository with **build output directory `admin`** and no build
  command, so only `admin/` is uploaded — the chapters never reach the Pages host.
  Production branch `main`.
- **Version pin:** `admin/index.html` pins `@sveltia/cms@0.193.1` on purpose.
  Sveltia is pre-1.0 and ships several releases a week. Bump it deliberately and
  re-test editing a chapter afterwards.
- **Breaks if gone:** trusted contributors lose the editor. Nothing else — the
  chapters are unaffected.
- **Known failure mode:** the Pages project disconnecting from Git and silently
  ceasing to rebuild. The symptom is "the editor loads but looks old, or a chapter
  that exists isn't listed" (`docs/troubleshooting.md`). It has happened before.
- **Guide:** `OAUTH-SETUP.md`.

---

## 5. Cloudflare Pages — `textbook-edition-template`

- **URL:** <https://textbook-edition-template.pages.dev>
- **Account owner:** **confirm at handover.**
- **What it does:** a live preview of an unmodified department edition. It is the
  link `docs/for-course-coordinators.md` gives coordinators before they start.
- **Breaks if gone:** coordinators lose the preview. Nothing functional.

> **There is at least one second Cloudflare account in play.** A complete
> end-to-end coordinator test run produced a Pages project at
> `textbook-edition-template-5cm.pages.dev` — the `-5cm` suffix is what Cloudflare
> appends when the project name is already taken elsewhere. That test artefact is
> not in any repository. **Confirm at handover** whether that second account is
> still live, who holds it, and whether it should be shut down.

Every *department edition* is its own Cloudflare Pages project under the
**coordinator's own** Cloudflare account, not the project's. Those are outside the
project's control by design and are not listed here.

---

## 6. Vercel — `suggest-edit-function`

- **URL:** `https://suggest-edit-function.vercel.app/api/suggest-edit`
- **Account owner:** **confirm at handover.**
- **What it does:** receives the *Suggest an edit* form, validates it, and files a
  GitHub issue on `textbook` labelled `suggested-edit` and `needs-triage`. Zero
  dependencies, Node 22, a single handler file.
- **Called from:** `publish.js` (`SUGGEST_EDIT_ENDPOINT`, near the top). Both sides
  are a fixed contract — do not change one alone.
- **Secret:** `BOT_TOKEN`, set as a Vercel environment variable in both
  `production` and `preview`. A fine-grained personal access token on the bot
  account (§11) scoped to `textbookproject2026-alt/textbook` with **Issues: read
  and write** and **Metadata: read-only**. Rotate by replacing the Vercel variable
  and redeploying; no code change.
- **Deploys:** pushing to `main` deploys production; other branches get previews.
- **Where its logs are:** `vercel logs <deployment-url>`. Validation rejections,
  honeypot hits, rate-limit trips and GitHub failures all land there with detail
  the HTTP response deliberately withholds. This is the only place to look.
- **Breaks if gone:** every reader who presses *Suggest an edit* gets the generic
  failure message. Nothing is queued or retried — the suggestion is lost.
- **Two standing caveats**, both recorded in `suggest-edit-function/README.md`:
  - The rate limit (5/hour/IP) lives in an in-memory `Map` inside **one serverless
    instance** and resets on every cold start. It is a speed bump, not a control.
    Real hardening is deferred.
  - `ALLOWED_ORIGIN` is hardcoded to `https://bptext2026.xyz` and **must be changed
    at the domain cutover**.
- **Guides:** `docs/the-authoring-app-operations.md` (*The suggest-edit
  function* — what to watch and where to look), `suggest-edit-function/README.md`,
  `TESTING.md`.

---

## 7. Plausible — analytics

- **Public dashboard:** <https://plausible.io/bptext2026.xyz> — genuinely public,
  no login needed. `community/dashboard.md` links to it rather than fetching
  figures, and `textbook.config.json` holds the URL as `plausible_public_url`.
- **Account owner:** **confirm at handover.** One account holds a *site* per
  edition.
- **How it is installed:** the per-site `pa-….js` script, injected by `publish.js`
  for the canonical site. Department editions get their own script address pasted
  into `plausibleScriptSrc` in their `quartz.config.yaml`.
- **Coordinator dependency:** a coordinator cannot finish their setup without
  somebody with Plausible access adding their site (Sites → Add website) and
  sending them the script line. `docs/for-course-coordinators.md` tells them to
  email the maintainer for it. **Whoever inherits this must have Plausible access**
  or department editions cannot be onboarded.
- **Breaks if gone:** no readership figures anywhere, and the project health page's
  readership link dead-ends. Nothing on the book itself changes.
- **Watch for:** an edition left pointing at *another* edition's script files its
  traffic in someone else's dashboard, invisibly. The template's setup guide has a
  pre-announcement checklist item for exactly this.

---

## 8. Hypothes.is — the annotation layer

- **Account:** `AlecGordon` (recorded as `acct:AlecGordon@hypothes.is` in the
  backup files' `meta.account`). **This account must be transferred or replaced at
  handover** — it owns the groups and issues the API token.
- **Standard tier, permanently.** The Publisher tier was considered and **not
  bought**, so there are no per-cohort or per-edition groups and there never will
  be. All reader discussion is in the public layer. Five documents state this
  correctly; treat it as settled.
- **Groups that exist**, both leftovers from testing, both still backed up weekly:
  - `ZGY29zLM` — *test-group*
  - `L9KgjVPa` — *Biology edition*

  They are listed in `scripts/backup-annotations.mjs` (`ANNOTATION_GROUPS`). A
  group added later — a coordinator running one for their own cohort — is added to
  that array and starts being backed up on the next run. Nothing else changes.
- **Secret:** `HYPOTHESIS_API_TOKEN` (see §1). Note the failure mode: an expired
  token returns **HTTP 200 with empty results**, not an error, which is why
  `scripts/gen-dashboard.mjs` pre-flights `/api/profile` and refuses to run when
  that comes back without a user.
- **Handover step, not yet done:** the textbook's maintainer is to be made
  moderator/owner of all annotation groups. Recorded in
  `docs/moderating-comments.md`.
- **Breaks if gone:** the margin disappears from every page and the badge under
  each chapter title stops rendering. Existing annotations are held by Hypothes.is,
  not by us — and **there is no bulk restore**. Read
  `docs/annotation-restore.md` before assuming the weekly backup is a safety net;
  it is a faithful record, but re-creating from it is a one-annotation-at-a-time
  job.
- **Guides:** `docs/annotation-restore.md`, `docs/moderating-comments.md`,
  `docs/how-to-comment.md`.

---

## 9. GitHub OAuth App — *Textbook CMS*

- **Registered under:** an individual GitHub account rather than the organisation,
  so that other org owners cannot rotate the secret. **Confirm at handover** which
  account, and move it if that account is leaving.
- **Client ID and secret:** live only in the Worker's variables (§3). The secret is
  shown once by GitHub at creation; if lost, generate a new one and delete the old.
- **Callback URL:** the Worker URL with `/callback` appended. The suffix is not
  optional.
- **Homepage URL:** `https://textbook-cms.pages.dev`.
- **Contributor access is separate.** Signing in proves identity; it grants
  nothing. A contributor also needs **Write** access on the `textbook` repo
  (Settings → Collaborators and teams). Write is the correct level — it permits the
  `cms/…` review branches and the pull requests the CMS opens, and nothing about
  branch protection or repository settings.
- **If the secret leaks:** delete it on GitHub, generate a new one, update
  `GITHUB_CLIENT_SECRET` in the Worker. Nothing in any repository changes.
- **Guide:** `OAUTH-SETUP.md`.

---

## 10. GitHub OAuth App — *Textbook Author Console*

A **separate** app from §9, deliberately. Sharing one would mean revoking the
console also revokes the CMS, and the two flows have nothing in common.

- **Device flow**, so there is no client secret, no callback in use, and no relay
  to keep running. **"Enable Device Flow" must be ticked** on the app or sign-in
  fails with `incorrect_client_credentials`.
- **Client ID:** not a secret. It is pasted into the app's own Settings screen
  ("Signing in to see what is waiting") and stored in `state.json` under
  `~/Library/Application Support/Authoring Assistant/`. Done once per Mac.
  **Without it the console shows a one-off-setup screen and cannot sign in** — this
  is the single most likely thing to strand a new author.
- **Scope:** `public_repo`, not `repo`. The textbook is public and that scope still
  allows closing a suggestion, replying, and accepting a draft change, while giving
  no access to any private repository the author owns. Do not widen it.
- **The author's token** goes into the macOS Keychain (§Local credentials below),
  never a file, never the vault.
- **Revoking:** <https://github.com/settings/applications>. The app treats a
  revoked token exactly like an expired one and offers to sign in again.
- **Guides:** `docs/the-authoring-app-operations.md` (*The sign-in identifier* —
  what the author is being asked for, and how to create it),
  `authoring-assistant/BUILD.md`, "One-time sign-in setup".

---

## 11. The bot account and `BOT_TOKEN`

- **Account:** recorded as `aldogo-bot`. **Confirm at handover** — nothing this
  project can read proves the account exists. The name survives here and in one
  code comment (`EXTRA_BOTS` in `scripts/gen-contributors.mjs`, which keeps the bot
  out of the contributors table); it was recovered from a planning document since
  deleted (`docs/DOCS-REMEDIATION.md`, 2.2), which is why this entry exists.
- **Why it exists:** so reader suggestions filed by the Vercel function are
  visually distinct from human commits and issues.
- **Credential:** a fine-grained PAT, stored as `BOT_TOKEN` in Vercel (§6) and
  nowhere else in this project. Not in any repository, not in GitHub Actions.
- **Scope needed:** `textbookproject2026-alt/textbook` — Issues: read and write;
  Metadata: read-only.
- **Breaks if gone:** the suggest-edit function returns 500 and every reader
  suggestion is lost at the door.
- **Note:** the function also creates the `suggested-edit` and `needs-triage`
  labels via the API if they are missing, which needs the same access. A label
  failure is non-fatal by design.

---

## 12. Apple Developer ID — signing the authoring app

Needed only to cut a **new release** of the Authoring Assistant. Nothing about the
book or the website depends on it.

- **A Developer ID Application certificate** on the build machine, for signing.
- **An App Store Connect key or app-specific password**, for notarisation, stored
  as a `notarytool` keychain profile (`xcrun notarytool store-credentials`) so it
  never appears in a script or shell history. The build reads it via
  `NOTARY_PROFILE`.
- **Account owner:** **confirm at handover.** A paid Apple Developer account sits
  behind this.
- **Breaks if gone:** existing installs keep working; no new version can be shipped
  without Gatekeeper refusing it on the author's Mac.
- **Guides:** `docs/the-authoring-app-operations.md` (*Building, signing and
  notarising*), `authoring-assistant/BUILD.md`.

---

## 13. DeepSeek — optional

- **What it is:** an optional extra pass over a chapter that suggests additional
  glossary terms. `authoring-assistant/app/llm.py` posts to
  `https://api.deepseek.com/chat/completions` (model `deepseek-chat`).
- **Key:** the author's own, pasted into the app's Settings and held in the macOS
  Keychain. There is no project-level DeepSeek account.
- **Breaks if gone:** nothing. Every failure path — no key, no network, rate limit,
  timeout, malformed answer — falls back to the deterministic checks and says so on
  screen.
- **Worth knowing:** this sends the text of a chapter to a third party, and only
  when the author ticks the box, and only when a key has been configured at all.
- **Nobody has recorded who approved book text going to a third-party LLM, or who
  pays for the key.** That is an open question for the maintainer, not an
  assumption for a technical contact to make either way.
- **Guides:** `docs/the-authoring-app-operations.md` (*DeepSeek: book text leaving
  the university*), `docs/the-authoring-app.md` (*Settings*, for the author),
  `authoring-assistant/README.md`.

---

## Local credentials on the author's Mac

Not services, but they strand the author if lost, and none of them are recoverable
from a repository.

| Item | Where | Notes |
|---|---|---|
| GitHub token for the console | macOS **login Keychain**, service `Authoring Assistant`, account `github-token` | Written via `/usr/bin/security` on standard input. A refused Keychain prompt shows as "signing in worked, but the token could not be stored". |
| DeepSeek key | Same service, account `deepseek-key` | Optional. |
| Console client ID | `~/Library/Application Support/Authoring Assistant/state.json` | Not a secret. Per Mac. |
| App log | `~/Library/Application Support/Authoring Assistant/log.txt` | The app has no window; anything it prints goes here. First place to look. |
| SSH key | `~/.ssh/id_ed25519_textbook`, via the `github-textbook` alias | See §1. |

---

## The domain cutover

`bptext2026.xyz` is a **staging** domain. Production moves to an Erasmus address
at launch, late-stage. When that happens, at minimum these all change, and they
are in five different places:

- `textbook.config.json` → `site_url` (and `plausible_public_url`), which
  regenerates `index.md`, `README.md` and `CONTRIBUTING.md` via
  `configure.mjs` — see `docs/changing-settings.md`
- `publish.js` → the baked-in Plausible script, re-registered to the new
  Plausible site
- `suggest-edit-function/api/suggest-edit.js` → `ALLOWED_ORIGIN`
- `scripts/backup-annotations.mjs` → `DEFAULT_SITE`, or every annotation search
  quietly returns nothing for the new domain
- `docs/moderating-comments.md` → the two bookmarked Hypothes.is search URLs

Annotations are anchored to page **URLs**. Moving the domain without a plan
detaches the entire existing margin. Work out what happens to them *before* the
cutover, not after.

---

## What is not written down anywhere

Kept honest and visible rather than left to be rediscovered. Each is tracked in
`docs/DOCS-REMEDIATION.md`.

- **Who holds the Cloudflare, Vercel, Plausible, Obsidian Publish and Apple
  Developer accounts.** Marked *confirm at handover* above. This is the single
  most important thing to resolve.
- **How the author's vault reaches GitHub** (3.2).
- **Who moves accepted contributor work from `drafts` to `main`** (3.3) — there is
  no automation and no named owner.
- **Whether the second Cloudflare account from the coordinator test is still live**
  (§5).
- **Whether the deferred rate-limit hardening on the suggest-edit function was ever
  done** (1.6).
- **Who approved sending book text to a third-party LLM, and who pays for the
  key** (§13, 1.3). The path is off by default and the key is the author's own, so
  nothing happens by accident — but the decision itself was never recorded, and it
  is the maintainer's to make.
