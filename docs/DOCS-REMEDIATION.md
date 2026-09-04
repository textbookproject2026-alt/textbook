# Documentation remediation worklist

The tracked output of the September 2026 documentation audit. Every gap the audit
found is recorded here with an ID, a category, the files it touches, and a status.
Fix sessions work from this file and tick items off; **this file is the source of
truth for what is left**, not the audit transcript.

The IDs are the audit's own (`3.1`, `2.4`, …) and never get renumbered. Category
numbering reflects the audit's three groups — 3 = maintainer-blocking, 1 =
undocumented features, 2 = stale references — and the list below is ordered by
severity, not by ID.

## How to use this file

1. Read the **Decisions required** section first. Two items are blocked on a human
   decision and everything downstream of them is unsafe to write until they are
   settled.
2. Pick the highest-severity item whose status is `TODO` and whose category is
   `FIX-DOC`.
3. Do one gap per commit, with the gap ID in the commit message
   (`docs(3.1): add the infrastructure inventory`).
4. Update this file in the same commit: flip the status, add the date, and name
   the file you created or changed.

## Category tags

| Tag | Meaning |
|---|---|
| **FIX-DOC** | Pure documentation. No decision needed, no code or config change. Safe for any fix session. |
| **FIX-CODE** | Requires a code or config change. **Riskier** — it can change running behaviour, and in one case it breaks a passing test suite. Do not action these from a documentation session. |
| **DECIDE** | Blocked on a human decision. The decision is stated in full under *Decisions required*. |
| **PARKED** | Belongs to deferred platform work, or is waiting on information nobody in a fix session has. Recorded so it is not rediscovered; left alone. |

## Status values

`TODO` · `DONE (date — file)` · `HELD` (explicitly withheld from the current
session, with the reason) · `BLOCKED` (waiting on a DECIDE item or on information)

---

## Decisions required

Nothing downstream of these two should be written until they are answered. Both
affect what the correct documentation actually *says*, so writing the doc first
would mean writing it twice.

### 3.3 — DECIDE — Who moves accepted contributor work from `drafts` to `main`, and when?

**The question.** Three sources describe the same handoff and none of them agree,
and the code has since diverged from all three:

- `docs/moderating-comments.md` ("Reviewing draft edits") says the moderator moves
  the entry to **Ready** in the CMS, and "the maintainer takes the approved entries
  out of the holding area… in batches."
- `OAUTH-SETUP.md` says "`main` is updated by exactly one route: a human opening a
  `drafts` → `main` pull request."
- `authoring-assistant/app/github.py:316` (`accept_change`) squash-merges the
  contributor's entry pull request **into `drafts`** the moment the author presses
  Accept in the console. It never touches the CMS "Ready" column.
  `authoring-assistant/app/server.py:765` then tells the author *"It reaches
  readers when you next publish."*

That last sentence is wrong as written: the accepted text is on `drafts`, and the
author's Obsidian vault tracks `main`. Nothing automates `drafts` → `main`, and no
document says who opens that pull request, on what cadence, or how `drafts` is
reset afterwards.

**What has to be decided.** Which of these is the real workflow:

- **(a)** The CMS "Ready" column is the approval gate and the console's Accept
  button should not exist, or should set Ready rather than merge; or
- **(b)** The console's Accept button is the approval gate, the "Ready" column is
  vestigial, and `docs/moderating-comments.md` and
  `docs/for-trusted-contributors.md` are wrong about the workflow; or
- **(c)** Both are legitimate entry points into `drafts`, and the missing piece is
  only the `drafts` → `main` step.

And in every case: **who opens the `drafts` → `main` pull request, how often, and
what resets `drafts` afterwards?**

**Why it can't wait.** Accepted contributor work currently lands on `drafts` and
stops there. Both the moderator and the author believe the handoff is complete.

**Blocks:** 1.4 (console guide), and corrections to `docs/moderating-comments.md`
and `docs/for-trusted-contributors.md`. Also implies a FIX-CODE change to the
console's "It reaches readers when you next publish" string whichever way it goes.

### 3.4 — DECIDE — Which coordinator setup path is canonical: fork, or "Use this template"?

**The question.** Two live guides give incompatible instructions:

| | `Obsidian Vault/docs/for-course-coordinators.md` | `textbook-edition-template/docs/department-edition-setup.md` |
|---|---|---|
| How to copy the template | **Fork** | **Use this template** |
| Terminal | "You never need to type commands into a terminal. If a tutorial elsewhere tells you to, **stop and check with the maintainer first**." | Requires Node 22, `npm install`, `./sync-upstream.sh`, `npx quartz plugin update` |
| Settings to change | **three** | **four** (adds `pageTitle`) |
| Build command | `git fetch --unshallow \|\| true && …` | `git fetch --unshallow && …` |
| Config-file step markers | referred to as "Step 7" | the file's own markers read `← EDIT (guide step 3a/3b/3c/3d)` |

**Why it matters beyond tidiness.** `scripts/gen-derivatives.mjs:140` builds
`community/derivatives.md` from `GET /repos/textbookproject2026-alt/textbook-edition-template/forks`.
An edition created via **"Use this template" is not a fork** and will never appear
on the department-editions page — while
`docs/scheduled-actions-health-check.md` tells the maintainer to check that page
against the template's Forks count as ground truth, so the absence reads as a
workflow fault rather than a setup choice.

Separately, a coordinator who follows only the vault guide never sets `pageTitle`
and launches a site titled *EDITION TITLE - Department Edition*
(`textbook-edition-template/quartz.config.yaml:9`).

**What has to be decided.** Three things:

1. **Fork or template-copy?** If template-copy is kept, `gen-derivatives.mjs` needs
   a different discovery mechanism (a registry file, a topic, or a naming
   convention) — that is FIX-CODE, not a doc fix.
2. **Is the "no terminal" promise still true?** Plugin updates and
   `sync-upstream.sh` both require one. Either the promise is dropped, or those
   operations move to the maintainer.
3. **Which guide is canonical**, and does the other become a pointer to it or get
   deleted?

**Blocks:** 3.5 (the plugin-update doc must describe whichever path is real), 2.6,
and any correction to `docs/for-course-coordinators.md`.

---

## Worklist

### Maintainer-blocking

#### 3.1 — FIX-DOC — No single doc records what runs where, under which account, and who owns it

- **Status:** TODO
- **Repos/files:** `Obsidian Vault/` — new file `docs/INFRASTRUCTURE.md`
- **Sources to consolidate:** `admin/config.yml`, `OAUTH-SETUP.md`,
  `.obsidian/publish.json`, `publish.js`, `scripts/backup-annotations.mjs`,
  `docs/file-tree-reference.md` (the only record of the bot account and the SSH
  push identity), `suggest-edit-function/README.md`,
  `authoring-assistant/BUILD.md`, `textbook-edition-template/quartz.config.yaml`
- **What a new maintainer hits:** they cannot answer "what breaks, and whose
  dashboard do I log into?" for any incident. Two docs refer to "handover" as
  though a checklist exists (`docs/moderating-comments.md`,
  `docs/for-course-coordinators.md`); none exists.
- **Constraint:** record *where* each secret lives, never a secret value.
- **Note:** account ownership for Cloudflare, Vercel and Plausible cannot be
  determined from the repositories. The doc records what is known and marks the
  rest as *confirm at handover* rather than guessing.

#### 3.2 — FIX-DOC — How the author's vault reaches GitHub is undocumented

- **Status:** BLOCKED — needs the actual mechanism confirmed with the current
  maintainer before anything can be written.
- **Repos/files:** `Obsidian Vault/docs/editing-the-textbook.md`;
  new doc likely needed
- **What's wrong:** `docs/editing-the-textbook.md` promises "every version of every
  chapter is stored off your machine automatically" and that accepted contributor
  edits "show up in your Obsidian vault". No doc says how. `.obsidian/plugins/`
  does not exist (no obsidian-git); `.obsidian/core-plugins.json` has
  `"sync": true` (Obsidian Sync — a paid service mentioned nowhere). The vault is
  a local git repo with an SSH-aliased remote, so somebody pushes by hand.
- **What a new maintainer hits:** the only link between the author's Mac and the
  repository is undocumented and unowned. If Sync lapses or the manual push stops,
  the guide's promise is silently false.

#### 3.3 — DECIDE — The `drafts` → `main` handoff

See *Decisions required* above. **Status:** BLOCKED on decision.

#### 3.4 — DECIDE — Which coordinator setup path is canonical

See *Decisions required* above. **Status:** BLOCKED on decision.

#### 3.5 — FIX-DOC — No doc for `sync-upstream.sh`, plugin pinning, or publishing a template update

- **Status:** TODO
- **Repos/files:** `Obsidian Vault/` — new maintainer-facing doc;
  cross-references `textbook-edition-template/sync-upstream.sh`,
  `textbook-edition-template/quartz.lock.json`,
  `textbook-edition-template/docs/department-edition-setup.md`,
  `textbook-edition-template/docs/resolving-sync-conflicts.md`
- **What's absent:** `docs/troubleshooting.md` ("A department edition didn't pick
  up a fix") says "the technical contact gives them the exact update step" — and
  no doc in the vault says what that step is, that plugins are pinned in
  `quartz.lock.json`, or that `sync-upstream.sh` deliberately does *not* update
  them. There is also no doc on how the maintainer *publishes* a template update,
  which is the event coordinators are told to react to.
- **Scope note:** this doc describes the maintainer's side and points at the
  template repo's guides for the coordinator's side. It deliberately does not
  restate the fork-vs-template question — that is 3.4.

#### 3.6 — FIX-DOC — `quartz-edition-extras` has no README

- **Status:** TODO
- **Repos/files:** `quartz-edition-extras/` — new `README.md`
- **What's absent:** the repo has no top-level README. It holds
  `plugins/edition-integrations` (Hypothes.is + Plausible injection) and
  `plugins/edit-on-github`, which **every department edition installs from this
  repo at build time** (`textbook-edition-template/quartz.config.yaml:294,314`).
  Nothing in the vault's docs mentions the repo exists.
- **What a new maintainer hits:** a live build-time dependency of every department
  site with no entry point. Delete, rename or privatise it and every edition's next
  build fails with nothing pointing at the cause.

### Undocumented features

#### 1.1 — FIX-DOC — The Authoring Assistant is not documented anywhere in `docs/`

- **Status:** TODO (not in the current session's scope)
- **Repos/files:** `Obsidian Vault/docs/` — new doc; `authoring-assistant/README.md`,
  `authoring-assistant/BUILD.md`
- **What's absent:** `docs/` contains zero occurrences of "Authoring Assistant" or
  the repo URL. `docs/word-to-markdown.md` says "the authoring app" without naming
  it, saying where it comes from, or who builds it. `docs/troubleshooting.md`
  names it once in passing. The repo also uses a different remote protocol from
  the others (HTTPS rather than the `github-textbook` SSH alias) — undocumented.
- **Depends on:** 3.1 (the inventory gives it a home).

#### 1.2 — FIX-DOC — The three analyses (citations, concept links, glossary generation) are undocumented

- **Status:** TODO (not in the current session's scope)
- **Repos/files:** `Obsidian Vault/docs/`;
  `authoring-assistant/app/references.py`, `app/terms.py`, `app/glossary.py`
- **What's absent:** the app's main function is documented only in
  `authoring-assistant/README.md`. `docs/editing-the-textbook.md` describes
  `glossary.md` as "the list of terms" with no hint that a tool writes it, and
  `docs/releasing-versions.md` asks the maintainer to check glossary/chapter
  agreement by hand.
- **What a new maintainer hits:** they don't know `glossary.md` is machine-appended,
  so a hand edit to it is at risk.

#### 1.3 — FIX-DOC — DeepSeek is mentioned nowhere in `docs/`

- **Status:** TODO (not in the current session's scope)
- **Repos/files:** `Obsidian Vault/docs/`; `authoring-assistant/app/llm.py`,
  `authoring-assistant/app/keychain.py`
- **What's absent:** `app/llm.py` sends the full text of a chapter to
  `https://api.deepseek.com/chat/completions` (model `deepseek-chat`) for extra
  glossary suggestions, keyed by a user-supplied API key in the macOS Keychain.
  Documented only in `authoring-assistant/README.md`.
- **Flag:** the doc itself is writable straight from the code, but writing it will
  surface a question for the maintainer — an undocumented third-party LLM egress
  path for book text, with no record of who approved it or who pays for the key.
  Expect this to turn into a decision.

#### 1.4 — FIX-DOC — The author's console has no guide, and its operator setup is recorded only in a sibling repo

- **Status:** BLOCKED on 3.3 (the draft-review half cannot be described correctly
  until the handoff is settled)
- **Repos/files:** `Obsidian Vault/docs/`; `authoring-assistant/app/console.py`,
  `app/github.py`, `app/server.py`, `authoring-assistant/BUILD.md`
- **What is already covered:** `docs/troubleshooting.md` covers device-flow sign-in
  failure modes thoroughly and accurately. That part is good and should be kept.
- **What's absent:** the **suggested-edit queue** (accept/decline, the
  auto-generated thank-you and decline replies posted to GitHub under the author's
  own name, and the one case where the app rewrites a chapter line itself); the
  **draft-review queue**; the **weekly-jobs strip** (`app/github.py:39`
  `WEEKLY_JOBS` — a second copy of the job list that must stay in sync with
  `docs/scheduled-actions-health-check.md`); and **operator setup** — creating the
  "Textbook Author Console" OAuth app with Device Flow ticked and giving the author
  its client ID, which lives only in `authoring-assistant/BUILD.md`.

#### 1.5 — FIX-DOC — No backup story for the vault or the repo, only for annotations

- **Status:** BLOCKED on 3.2 (can't describe vault backup without knowing the sync
  mechanism)
- **Repos/files:** `Obsidian Vault/docs/annotation-restore.md` (good, keep),
  `docs/editing-the-textbook.md`
- **What's absent:** `docs/annotation-restore.md` is thorough on Hypothes.is.
  Nothing covers backing up the **vault itself**, the Obsidian Publish site, or the
  repository. `docs/editing-the-textbook.md` lists `backups/` as a vault folder to
  "ignore entirely" — the real backups are on the `backups` orphan branch, where
  that folder on `main` holds only `.gitkeep`.

#### 1.6 — FIX-DOC — No operator doc for `suggest-edit-function`

- **Status:** TODO (not in the current session's scope)
- **Repos/files:** `Obsidian Vault/docs/troubleshooting.md` (needs a pointer);
  `suggest-edit-function/README.md`, `TESTING.md`, `api/suggest-edit.js`
- **What's absent:** nothing in `docs/` acknowledges Vercel exists.
  `docs/troubleshooting.md` correctly triages the two user-visible error messages
  and then says "the technical contact's, either way" with no pointer to where to
  look — logs are only visible via `vercel logs <deployment-url>`.
- **Carries two non-doc items, recorded here so they are not lost:**
  - **PARKED** — the rate limit is per-serverless-instance and resets on cold
    start; `suggest-edit-function/README.md` calls it "a speed bump, not a control"
    and defers real hardening (shared KV/Redis counter plus edge limits) to
    "Day 28". No record exists of whether Day 28 happened.
  - **FIX-CODE** — `ALLOWED_ORIGIN` is hardcoded to `https://bptext2026.xyz` in
    `api/suggest-edit.js` and must change at the production-domain cutover, as must
    the Plausible site registration and `publish.js`'s baked-in script. The cutover
    is referenced in `suggest-edit-function/README.md` and
    `docs/file-tree-reference.md` and is tracked nowhere else.

#### 1.7 — FIX-DOC — `scheduled-actions-health-check.md` omits four of the eight workflows

- **Status:** TODO
- **Repos/files:** `Obsidian Vault/docs/scheduled-actions-health-check.md`;
  `.github/workflows/link-check.yml`, `lint.yml`, `apply-config.yml`, `stats.yml`
- **What's wrong:** the doc opens "Four workflows run on a weekly schedule, all
  Sundays." There are eight workflows. Missing entirely:
  - `link-check.yml` — push, pull request, **and weekly on Mondays at 06:00 UTC**
    (`cron: "0 6 * * 1"`), so "all Sundays" is wrong and a Monday failure has no
    diagnostic entry;
  - `lint.yml` — push and pull request (markdownlint);
  - `apply-config.yml` — regenerates `index.md`, `README.md` and `CONTRIBUTING.md`
    inside a pull request. Both `docs/editing-the-textbook.md` and
    `docs/changing-settings.md` depend on this working and tell the author to
    escalate when it hasn't run, and there is no diagnostic entry for it anywhere;
  - `stats.yml` — still present as a `workflow_dispatch`-only stub.
- **Do together with 2.4** — same file.

### Stale references

#### 2.1 — FIX-DOC — `word-to-markdown.md` Parts 2 and 3 describe an app that doesn't exist

- **Status:** HELD — explicitly withheld pending maintainer review. Do not edit.
- **Repos/files:** `Obsidian Vault/docs/word-to-markdown.md`;
  verified against `authoring-assistant/app/convert.py`
- **What's wrong:**
  - Step 3 says the app "puts the images alongside it in `assets`".
    `app/convert.py:286,415` writes them to `<chapter-stem>-media/` **next to the
    chapter**. Nothing ever writes to `assets/`.
  - Step 4 says the `chapter-NN` name "is not optional". `app/convert.py:380-398`
    validates only the `.md` extension, path separators, illegal characters and
    collision. The name is prefilled from the `.docx` filename; nothing enforces
    the convention.
  - Part 3 documents a five-row report table (**Headings / Pictures / Tables /
    Footnotes / Leftovers**, "Leftovers… should be empty"). `app/convert.py:486`
    produces a list of narrative notes at three levels (`ok`/`look`/`warn`) plus a
    counts dict. There is no "Leftovers" field, and Part 4's fixes are keyed to it.
  - **Internal contradiction:** Part 5 step 2 says "Open `index.md` … and add a
    line". `docs/editing-the-textbook.md` and `docs/changing-settings.md` both say
    `index.md` is generated and any direct edit is wiped — edit
    `templates/index.md`.
- **Note for the fix session:** the image-destination divergence may be a FIX-CODE
  item rather than a doc one — the app's `<name>-media` convention also conflicts
  with the CMS's `media_folder: assets` (`admin/config.yml`). Decide which is right
  before rewriting the doc.

#### 2.2 — FIX-DOC — `file-tree-reference.md` is a build-plan artefact presented as a reference

- **Status:** HELD — explicitly withheld pending maintainer review; **may be
  deleted rather than fixed**. Do not edit.
- **Repos/files:** `Obsidian Vault/docs/file-tree-reference.md`
- **What's wrong (partial list):** `chapters/main.md`, `page-a.md`, `page-b.md`
  (none exist); `chapters/Definitions/` absent from the tree entirely — the one doc
  the folder move never reached; `community/forks.md` (the file is
  `derivatives.md`); `stats.yml` shown as the generator of all three community
  pages; backups shown on `main` rather than the `backups` branch; `docs/` lists two
  files that don't exist and omits eight that do; workflows list omits
  `contributors.yml`, `derivatives.yml`, `dashboard.yml`, `apply-config.yml`;
  `admin/`, `scripts/`, `templates/`, `configure.mjs`, `textbook.config.json`,
  `images/` and `OAUTH-SETUP.md` all missing; `quartz.config.ts` / `quartz.layout.ts`
  (the template uses `quartz.config.yaml`); `suggest-edit-function/lib/*.js` (none
  exist — it is a single zero-dependency handler) and a Resend email confirmation
  that was never built.
- **Contradicts a settled decision:** "Each fork gets its own Plausible site and
  **its own Hypothes.is group ID** … the one-group-per-edition rule expressed in
  config." Per-cohort isolation was not adopted; five other docs say so correctly,
  and this doc's own header says so before the body contradicts it.
- **If deleted:** it is the **only** record of the `aldogo-bot` account name and of
  the SSH push identity `github-textbook` → `~/.ssh/id_ed25519_textbook`. Both must
  land in `docs/INFRASTRUCTURE.md` (3.1) first.

#### 2.3 — FIX-CODE — De-personalisation is incomplete: the app still says "Alec", and a test asserts on it

- **Status:** HELD — explicitly withheld. Requires code and test changes together.
  Do not edit.
- **Repos/files:** `authoring-assistant/app/github.py:113,139,207`,
  `app/convert.py:888,913`, `app/web/index.html:368,529`, `app/web/app.js:1063`,
  `tests/test_all.py:838,840`; `Obsidian Vault/OAUTH-SETUP.md:3`,
  `admin/config.yml:28`; `authoring-assistant/BUILD.md:229,272`;
  `Obsidian Vault/docs/annotation-restore.md:106`;
  `Obsidian Vault/docs/troubleshooting.md:290-330`
- **Why it is FIX-CODE:** user-facing strings in the app still say "ask Alec".
  `tests/test_all.py` **asserts on those exact strings** — the test was added to
  keep them in sync with `docs/troubleshooting.md`, so de-personalising the app
  fails the suite until the test is updated in the same change.
  `docs/troubleshooting.md` quotes the strings verbatim, so it says "the technical
  contact" in prose and "ask Alec" in its quotes.
- **Also:** `BUILD.md` assumes the author's gender ("as himself", "his authorised-apps
  list"). `admin/config.yml` names "Brandon" in a comment.
- **Not a defect:** `README.md`, `CONTRIBUTING.md` and `index.md` saying "Brandon"
  is correct — that is the `__MAINTAINER__` token rendered from
  `textbook.config.json`, and `docs/changing-settings.md` documents how to change
  it.

#### 2.4 — FIX-DOC — `scheduled-actions-health-check.md` predates auto-merge

- **Status:** TODO
- **Repos/files:** `Obsidian Vault/docs/scheduled-actions-health-check.md`;
  `.github/workflows/contributors.yml:191`, `derivatives.yml:200`,
  `dashboard.yml:228`
- **What's stale:** the doc never mentions that three workflows open a pull request
  and arm GitHub auto-merge (`gh pr merge --auto --squash`), nor the guard that
  makes it safe (author must be `github-actions[bot]`, exactly one changed file,
  and that file must be the page the workflow generates), nor that **"Allow
  auto-merge" must be switched on in repository settings** or the step logs a
  warning and silently leaves the pull request open.
- **Correction to the audit brief:** it is **three** workflows that auto-merge, not
  four. `backup-annotations.yml` pushes directly to the unprotected `backups`
  branch and opens no pull request — the doc already describes that correctly, but
  anyone looking for a fourth auto-merging pull request will not find one.
- **What a new maintainer hits:** weekly chore pull requests pile up unmerged with
  a green run and no failure signal.
- **Do together with 1.7** — same file.

#### 2.5 — FIX-DOC — `editing-the-textbook.md` vault-organisation table is incomplete

- **Status:** TODO
- **Repos/files:** `Obsidian Vault/docs/editing-the-textbook.md`
- **What's wrong:** `images/` has no row, although it holds the four screenshots the
  guide itself embeds (`Vault.png`, `File_index.png`, `Publish-dialog.png`,
  `Dummy-site.png`). `assets/` is described as "Every image in the book, in one
  subfolder per chapter" but is currently empty but for `.gitkeep`.
  `templates/` is described as "The source of the front page" but also holds
  `README.md` and `CONTRIBUTING.md`. `configure.mjs`, `textbook.config.json` and
  `OAUTH-SETUP.md` sit at the top level with no row.

#### 2.6 — PARKED — Unfilled placeholders across the guides

- **Status:** PARKED — recorded, deliberately left as placeholders. These are real
  pending items, not stale text, and each needs something a fix session cannot
  supply.
- **Repos/files:** `Obsidian Vault/docs/for-course-coordinators.md:299` and the
  `[SCREENSHOT: …]` markers in `docs/for-course-coordinators.md` (~12),
  `docs/for-trusted-contributors.md` (5), `docs/moderating-comments.md` (5),
  `docs/editing-the-textbook.md` (1)
- **What's pending:**
  - `**[MAINTAINER EMAIL — fill in at handover]**` is the only contact route in the
    coordinators' guide, and "Before you start" step 5 requires the coordinator to
    email the maintainer for their Plausible line before they can finish setup.
    Needs the real address at handover.
  - The `[SCREENSHOT: …]` markers are unshot images, not broken text. Only
    `docs/editing-the-textbook.md` currently has real images.

---

## Verified current — do not re-audit

Recorded so fix sessions don't spend time re-checking these. All confirmed against
the code on 4 September 2026.

- **The `drafts` branch.** `admin/config.yml` is `branch: drafts` with
  `publish_mode: editorial_workflow`. `docs/for-trusted-contributors.md` and
  `docs/moderating-comments.md` describe the two-gate model correctly. (The
  *onward* handoff is 3.3; the CMS side is right.)
- **`chapters/Definitions/`.** Correct in `docs/editing-the-textbook.md`,
  `docs/for-course-coordinators.md`, `docs/releasing-versions.md`, and in the CMS's
  two-collection config. Stale only in `docs/file-tree-reference.md` (2.2).
- **Publisher tier / no per-cohort groups.** Correctly and consistently stated in
  `docs/moderating-comments.md`, `docs/releasing-versions.md`,
  `docs/for-course-coordinators.md`, `docs/how-to-comment.md`,
  `docs/annotation-restore.md`, and
  `textbook-edition-template/docs/department-edition-setup.md`. Stale only in
  `docs/file-tree-reference.md` (2.2).
- **The two CMS collections.** `docs/for-trusted-contributors.md` correctly
  describes "Chapters" and "Concept pages" as two lists, matching the current
  `admin/config.yml`.
- **`OAUTH-SETUP.md`.** Accurate against `admin/config.yml` and `admin/index.html`,
  including the pinned `@sveltia/cms@0.193.1`.
- **`docs/annotation-restore.md`.** Matches `.github/workflows/backup-annotations.yml`
  and `scripts/backup-annotations.mjs`, including `KEEP=12`, the orphan-branch
  rationale, and the honesty about the untested pruning path.
- **`docs/troubleshooting.md`, device-flow section.** Matches
  `authoring-assistant/app/github.py` and `app/web/index.html` string for string.
  (Its "Alec" quotes are accurate; the app is what needs changing — 2.3.)

---

## Progress

| ID | Category | Status |
|---|---|---|
| 3.1 | FIX-DOC | TODO |
| 3.2 | FIX-DOC | BLOCKED — needs mechanism confirmed |
| 3.3 | DECIDE | BLOCKED — decision |
| 3.4 | DECIDE | BLOCKED — decision |
| 3.5 | FIX-DOC | TODO |
| 3.6 | FIX-DOC | TODO |
| 1.1 | FIX-DOC | TODO |
| 1.2 | FIX-DOC | TODO |
| 1.3 | FIX-DOC | TODO |
| 1.4 | FIX-DOC | BLOCKED on 3.3 |
| 1.5 | FIX-DOC | BLOCKED on 3.2 |
| 1.6 | FIX-DOC | TODO (carries one PARKED and one FIX-CODE item) |
| 1.7 | FIX-DOC | TODO |
| 2.1 | FIX-DOC | HELD — maintainer review |
| 2.2 | FIX-DOC | HELD — maintainer review, may be deleted |
| 2.3 | FIX-CODE | HELD — code + test together |
| 2.4 | FIX-DOC | TODO |
| 2.5 | FIX-DOC | TODO |
| 2.6 | PARKED | Recorded; left as placeholders |
