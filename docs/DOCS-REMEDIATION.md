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

1. Read the **Decisions required** section first. One item (3.3) is still blocked on
   a human decision and everything downstream of it is unsafe to write until it is
   settled. 3.4 was decided on 4 Sep 2026 and its decision box is kept there as the
   record of what was chosen.
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

Nothing downstream of an *open* item here should be written until it is answered:
these affect what the correct documentation actually *says*, so writing the doc
first would mean writing it twice. **3.3 is open. 3.4 was decided on 4 Sep 2026**
and is kept below, decision first, question second, as the record.

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

### 3.4 — DECIDED (4 Sep 2026) — fork is canonical

> **Decision, 4 September 2026.** **Forking is the canonical way to create a
> department edition**, and "Use this template" is warned against by name in both
> guides. `gen-derivatives.mjs` keeps its forks-API discovery — no FIX-CODE. The
> no-terminal promise is **scoped, not dropped**: setup and the yearly content copy
> stay terminal-free, the two machinery channels are stated as needing a terminal,
> and a coordinator may hand them to the technical contact. **Both guides survive**
> with an explicit audience split — vault = coordinator walkthrough, template repo =
> technical companion — each naming the other. Settings count is **four** in both
> (the vault guide was missing `pageTitle`); build command is
> `git fetch --unshallow || true && …` in both. Written up under 3.4 in the worklist
> below. The original question is kept here for the record.

**The question (as posed).** Two live guides gave incompatible instructions:

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

**Blocked (now released):** 2.6, and any correction to
`docs/for-course-coordinators.md` — both free to proceed as of the decision above.
It never blocked 3.5 — `sync-upstream.sh` works over a git remote whether the
edition is a fork or a template copy, so the update mechanics were the same either
way. What 3.4 decided is *who runs them*, not what they are.

---

## Worklist

### Maintainer-blocking

#### 3.1 — FIX-DOC — No single doc records what runs where, under which account, and who owns it

- **Status:** DONE (4 Sep 2026 — `docs/INFRASTRUCTURE.md`)
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

#### 3.4 — DECIDE → FIX-DOC — Which coordinator setup path is canonical

- **Status:** DONE (4 Sep 2026 — decision taken, both guides reconciled)
- **Decision:** see the box under *Decisions required* above.
- **Repos/files changed:**
  - `textbook-edition-template/docs/department-edition-setup.md` — rewritten around
    forking; new "Who this guide is for" section; local clone + Node + `npm install`
    moved out of Step 1 into the maintenance section; build command gains `|| true`;
    `--unshallow` note explains both halves; announce-checklist and troubleshooting
    gain a department-editions-page item.
  - `Obsidian Vault/docs/for-course-coordinators.md` — terminal promise scoped;
    "Use this template" warned against in Step 1; Step 7 goes from three settings to
    **four** (adds `pageTitle`, with the placeholder's consequence spelled out); new
    "When the machinery updates (occasional)" section; new troubleshooting entry for
    a site still titled *EDITION TITLE*.
  - `Obsidian Vault/docs/updating-department-editions.md` — "Open question" section
    replaced with what the decision settled; "Who runs it" column now
    "coordinator, or you on their behalf" for the two machinery channels.

**How each of the five contradictions was resolved:**

| Contradiction | Resolution |
|---|---|
| Copy method | **Fork**, in both. Both guides warn against "Use this template" by name and say why (forks-API discovery). |
| Terminal | **Scoped.** Setup and the yearly content copy: no terminal, in both. Machinery + plugin updates: terminal, in both, and explicitly reassignable to the technical contact. |
| Settings count | **Four**, in both. The vault guide was missing `pageTitle` — the omission that ships a site titled *EDITION TITLE - Department Edition*. |
| Build command | `git fetch --unshallow \|\| true && …`, in both. The `\|\| true` is correct (`--unshallow` errors on a complete clone) and the template guide now explains it rather than only explaining `--unshallow`. |
| Config step markers | **Left as `guide step 3a`–`3d`.** They match the template guide's numbering; the vault guide now says so explicitly and maps them to its own Step 7. Rewriting the markers would put a conflicting edit on the four lines every fork has already changed, for no gain. |

- **Audience split, made explicit rather than removed:** the vault guide is the
  coordinator walkthrough (screenshots, a worked localisation example, the yearly
  routine); the template guide is the technical companion (condensed setup, then the
  terminal work). Each names the other, and each states where the numbering and the
  step order differ so the difference doesn't read as disagreement.
- **Follow-up worth doing, not actioned here (repo setting, not a doc):** the
  template repository still has GitHub's *template repository* flag set, so the
  "Use this template" button is still offered next to Fork. Turning that flag off
  (Settings → General → Template repository) would enforce the decision instead of
  documenting it. Recorded as **3.4a**.

#### 3.4a — FIX-CODE — the "Use this template" button is still offered on the template repo

- **Status:** TODO — found 4 Sep 2026 while writing 3.4; needs repo-admin access
- **Repo:** `textbookproject2026-alt/textbook-edition-template` (GitHub repository
  setting, nothing in the tree)
- **What's wrong:** 3.4 decided forking is canonical and both guides now warn
  against "Use this template" — but GitHub still renders that button, because the
  repository's *template repository* flag is on. Documentation is the only thing
  stopping a coordinator from clicking it, and an edition created that way is
  invisible to `scripts/gen-derivatives.mjs` with no error anywhere.
- **Fix:** clear Settings → General → **Template repository** on the template repo.
  Forking is unaffected. Check first whether anything else relies on the flag (no
  automation in these repos reads it).

#### 3.5 — FIX-DOC — No doc for `sync-upstream.sh`, plugin pinning, or publishing a template update

- **Status:** DONE (4 Sep 2026 — `docs/updating-department-editions.md`; pointer
  added from `docs/troubleshooting.md`)
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
- **Found while writing it — FIX-CODE — DONE (4 Sep 2026):**
  `textbook-edition-template/quartz.lock.json` pinned both `edition-integrations`
  and `edit-on-github` at `eece8e6`, behind `quartz-edition-extras` `main`.
  Everything since was unreleased to every edition, including the whole
  Hypothes.is-across-SPA-navigation fix series and the commit removing the
  Publisher-tier group-lock references. Both pins are now bumped to `8f4e323`.
  - **Correction to the original finding:** it recorded `main` as `487b814` and the
    gap as 7 commits. `main` was in fact `8f4e323` — `487b814` plus the 3.6 README
    commit (`docs(3.6): add a repository README (#1)`), so the gap was 8 commits.
    The pins were bumped to actual `main`, not to the SHA named in the finding.
  - **Mechanism:** the pin lives only in `quartz.lock.json`
    (`plugins.<name>.commit`, lockfile `version` 1.0.0); there are no integrity
    hashes and `.quartz/plugins/` is gitignored, so the lockfile is the sole
    committed pin. Bumped with `npx quartz plugin install --latest
    edition-integrations edit-on-github` (the CLI rewrites `commit` and
    `installedAt`); `npx quartz plugin update` is the deprecated alias. Scoping to
    the two names matters — an unscoped run bumps all ~45 plugins, as every one
    currently reports an update available.
  - **Verified:** `npx quartz build -d docs -v` succeeds and the emitted HTML now
    carries the run-once guard and the `<head>`-injected `embed.js`
    (`data-edition-hypothesis`) that survives SPA navigation. `tsc --noEmit`
    passes. (`npx prettier . --check` flags `content/index.md`,
    `docs/department-edition-setup.md` and `docs/resolving-sync-conflicts.md` in
    the template — pre-existing, untouched by this change, but it does gate
    `npm run check` in `deploy-v5.yaml`.)
  - **Spawned a further FIX-CODE item — see 3.5a below.**

#### 3.5a — FIX-CODE — `plugin install` cannot detect a stale plugin cache, so a pin bump may not reach a deploy

- **Status:** PARTIAL (5 Sep 2026) — the `restore-keys` fallback is removed from
  `deploy-v5.yaml`. The two other workflows, the `gitLoader` defect underneath, and
  the Cloudflare build cache are all still open; see *What was done* below.
- **Repos/files:** `textbook-edition-template/.github/workflows/deploy-v5.yaml`
  (also `ci.yaml`, `build-preview.yaml`);
  `textbook-edition-template/quartz/plugins/loader/gitLoader.ts`
- **The defect:** for `subdir` plugin installs — which both edition plugins are —
  `installPlugin` strips `.git` after extraction, so its already-installed check
  tests only for the presence of `package.json` and never compares the checkout to
  the lockfile commit. A stale directory is therefore kept, and the CLI *reports
  the lockfile commit it did not install*.
- **Reproduced:** replacing `.quartz/plugins/edition-integrations` with `eece8e6`
  content and running `npx quartz plugin install` printed
  `✓ edition-integrations@8f4e323 already installed (subdir)` while the old code
  stayed on disk.
- **Why it bites deploys:** `deploy-v5.yaml` keys the plugin cache on
  `hashFiles('quartz.lock.json')` but carries `restore-keys: ${{ runner.os }}-plugins-`.
  A pin bump misses the exact key and then *restores the previous cache anyway*,
  which `plugin install` declines to correct — so the build ships the old plugin
  behind a green log.
- **Fix options:** drop the `restore-keys` fallback so the lockfile hash alone keys
  the cache (smallest change, keeps caching); or make the subdir branch record and
  compare the installed commit. Workaround until then: delete the plugin
  directories (or the Actions cache) before building.

**What was done (5 Sep 2026).** The first fix option, in `deploy-v5.yaml` only:
the `Cache Quartz plugins` step keeps its exact key
(`${{ runner.os }}-plugins-${{ hashFiles('quartz.lock.json') }}`) and no longer
carries `restore-keys`. A lockfile bump now misses the cache outright and the
plugins are re-fetched, so `plugin install` is never handed a stale directory it
cannot detect. A comment above the key records why the fallback must not come back.
The `Cache dependencies` (npm) step above it is untouched — `npm ci` verifies what
it installs against `package-lock.json`, so a partial `~/.npm` restore is safe.

**Still open — this did not close 3.5a:**

1. **`ci.yaml` and `build-preview.yaml` carry the identical plugin-cache block**
   (`ci.yaml:43-45`, `build-preview.yaml:35-37`) and were left alone, so the same
   stale restore is still reachable through them. Same one-line fix; not applied
   here only because this change was scoped to `deploy-v5.yaml`.
2. **The `gitLoader.ts` defect is untouched.** Dropping `restore-keys` removes the
   most likely *way* a stale checkout arrives on a runner; it does not make
   `installPlugin` able to notice one. Any other route to a populated
   `.quartz/plugins` — a warm local clone, a restored Cloudflare build cache — still
   ships the old plugin and still reports the lockfile commit it did not install.
   The durable fix is the second option above.
3. **None of these three workflows run for a department edition, or for this
   template.** All three are guarded `if: github.repository == 'jackyzha0/quartz'`
   — they are upstream's own pipelines, inherited by the fork. Editions build on
   **Cloudflare Pages**, whose build command is
   `git fetch --unshallow || true && npx quartz plugin install && npx quartz build`
   (`docs/for-course-coordinators.md`, `department-edition-setup.md` Step 4). So the
   deploy path that actually reaches readers is not covered by this change at all;
   whether Cloudflare's build cache can preserve `.quartz/plugins` across a pin bump
   is **unverified** and is the question that decides how much of 3.5a is real for
   editions. Worth answering before this item is closed.
4. **The edit is on an upstream-owned file.** `deploy-v5.yaml` came from upstream
   (`5ec3f4a`, saberzero1) and the cache block with it, so this is now a local
   divergence that `sync-upstream.sh` can conflict on. It is a small, well-commented
   hunk; `docs/resolving-sync-conflicts.md` covers the resolution. Worth reporting
   upstream — the defect is upstream's, not this template's.

#### 3.6 — FIX-DOC — `quartz-edition-extras` has no README

- **Status:** DONE (4 Sep 2026 — `quartz-edition-extras/README.md`, branch
  `docs/repo-readme`)
- **Repos/files:** `quartz-edition-extras/` — new `README.md`
- **What's absent:** the repo has no top-level README. It holds
  `plugins/edition-integrations` (Hypothes.is + Plausible injection) and
  `plugins/edit-on-github`, which **every department edition installs from this
  repo at build time** (`textbook-edition-template/quartz.config.yaml:294,314`).
  Nothing in the vault's docs mentions the repo exists.
- **What a new maintainer hits:** a live build-time dependency of every department
  site with no entry point. Delete, rename or privatise it and every edition's next
  build fails with nothing pointing at the cause.
- **Also found:** each plugin's own `README.md` is the unmodified upstream
  `quartz-community/plugin-template` boilerplate, and their `package.json` files
  still carry the template's `author`, `homepage` and `repository` values. Nothing
  depends on those, and the new repo README says so rather than editing them.

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

- **Status:** DONE (4 Sep 2026 — `docs/scheduled-actions-health-check.md`, new
  section *The other four workflows*)
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
- **Done together with 2.4** — same file, one commit.
- **Found while writing it: `docs/` is excluded from BOTH CI checks.**
  `link-check.yml` runs lychee with `--exclude-path docs`, and
  `.markdownlint-cli2.yaml` lists `docs/**` under `ignores`. So neither a broken
  link between the guides nor malformed markdown in them is ever caught. Recorded
  in the health-check doc. Relevant to every doc fix in this worklist:
  cross-references and table syntax have to be checked by hand. Running
  `markdownlint-cli2` over `docs/` with the repo's rules found one real defect
  (fixed under 2.5) and otherwise only MD060 table-style nits from a newer
  markdownlint than CI pins, which fire on the whole existing doc set and are
  house style, not errors.

### Stale references

#### 2.1 — FIX-DOC — `word-to-markdown.md` Parts 2 and 3 describe an app that doesn't exist

- **Status:** DONE (5 Sep 2026 — `docs/word-to-markdown.md`, Parts 2–5 rewritten
  against the code; Part 1 kept). The hold was lifted by the maintainer.
- **Repos/files:** `Obsidian Vault/docs/word-to-markdown.md`;
  verified against `authoring-assistant/app/convert.py`,
  `app/server.py:378-470`, `app/web/index.html`, `app/web/app.js:520-700`
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
- **What was done:** Part 1 (the Word writing habits) was kept, minus one clause
  that pointed at the non-existent "leftover" report field. Part 2 now describes
  the real screens — the front-screen *A Word document* button, the one-off pandoc
  install screen, the three-part setup screen, *Convert and show me*, the tick-box
  confirmation and the *Save this chapter* button — and states the naming rules the
  code actually enforces (`.md` extension added if absent, plain name not a path,
  no `/ \ : * ? " < > |`, no collision) separately from the `chapter-NN`
  convention, which is now given as a convention with its three reasons. Part 3 is
  rewritten as what `report()` returns: a summary line of counts plus notes at
  `ok`/`look`/`warn`, with no "Leftovers" field, and a checklist keyed to
  warn-level notes. Part 4's entries are now headed with the app's verbatim note
  headlines. Part 5 step 2 now says `templates/index.md` and explains why, citing
  `editing-the-textbook.md` and `changing-settings.md`.
- **Still open (not a doc item):** the image-destination divergence itself. The doc
  now documents the code — pictures go to `<chapter-stem>-media/` next to the
  chapter — and carries a short note that `docs/editing-the-textbook.md` states the
  vault convention as `assets/chapter-NN/` and that the converter does not follow
  it. The three-way disagreement between `app/convert.py`, that guide, and the
  CMS's `media_folder: assets` (`admin/config.yml`) is a **FIX-CODE/DECIDE** matter
  and was deliberately not resolved by prose.

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

- **Status:** DONE (4 Sep 2026 — `docs/scheduled-actions-health-check.md`, new
  section *Auto-merge, and when it silently doesn't*)
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
- **Done together with 1.7** — same file, one commit.

#### 2.5 — FIX-DOC — `editing-the-textbook.md` vault-organisation table is incomplete

- **Status:** DONE (4 Sep 2026 — `docs/editing-the-textbook.md`)
- **What was done:** added rows for `images/` and `textbook.config.json`; corrected
  `templates/` to say it also holds `README.md` and `CONTRIBUTING.md`; added
  `configure.mjs` and `OAUTH-SETUP.md` to the machinery row. The `assets/` row was
  left as written — it describes the intended convention, and the fact that it is
  currently empty is a state, not a doc error. Whether the authoring app should
  write there instead of `<chapter>-media/` is part of 2.1 and was not touched.
  Also inserted the missing blank line before `![[File_index.png]]`, which sat
  directly against the last table row and parsed as a malformed extra row.
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
  `[SCREENSHOT: …]` markers, counted 4 Sep 2026:
  `docs/for-course-coordinators.md` (11), `docs/for-trusted-contributors.md` (6),
  `docs/moderating-comments.md` (5), `docs/editing-the-textbook.md` (1),
  `docs/releasing-versions.md` (1) — 24 in total.
- **What's pending:**
  - `**[MAINTAINER EMAIL — fill in at handover]**` is the only contact route in the
    coordinators' guide, and "Before you start" step 5 requires the coordinator to
    email the maintainer for their Plausible line before they can finish setup.
    Needs the real address at handover.
  - The `[SCREENSHOT: …]` markers are unshot images, not broken text. Only
    `docs/editing-the-textbook.md` currently has real images (four, in `images/`).
    Several of the remaining 24 need access nobody in a doc session has — the
    Cloudflare dashboard mid-setup, the CMS signed in as a contributor, a live
    annotation sidebar with comments in it.
- **Reviewed 4 Sep 2026** and deliberately left as placeholders. A placeholder that
  reads as a placeholder is better than prose pretending the image is there.

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
| 3.1 | FIX-DOC | DONE — `docs/INFRASTRUCTURE.md` |
| 3.2 | FIX-DOC | BLOCKED — needs mechanism confirmed |
| 3.3 | DECIDE | BLOCKED — decision |
| 3.4 | DECIDE → FIX-DOC | DONE — fork is canonical; both setup guides reconciled (spawned 3.4a) |
| 3.4a | FIX-CODE | TODO — turn off the template-repository flag so "Use this template" is no longer offered |
| 3.5 | FIX-DOC | DONE — `docs/updating-department-editions.md`; spawned FIX-CODE (pin bump) DONE — pins at `8f4e323` |
| 3.5a | FIX-CODE | PARTIAL — `restore-keys` dropped from `deploy-v5.yaml`; `ci.yaml`/`build-preview.yaml`, the `gitLoader` defect and the Cloudflare build cache still open |
| 3.6 | FIX-DOC | DONE — `quartz-edition-extras/README.md` |
| 1.1 | FIX-DOC | TODO |
| 1.2 | FIX-DOC | TODO |
| 1.3 | FIX-DOC | TODO |
| 1.4 | FIX-DOC | BLOCKED on 3.3 |
| 1.5 | FIX-DOC | BLOCKED on 3.2 |
| 1.6 | FIX-DOC | TODO (carries one PARKED and one FIX-CODE item) |
| 1.7 | FIX-DOC | DONE — `docs/scheduled-actions-health-check.md` |
| 2.1 | FIX-DOC | DONE — `docs/word-to-markdown.md` (image destination still FIX-CODE/DECIDE) |
| 2.2 | FIX-DOC | HELD — maintainer review, may be deleted |
| 2.3 | FIX-CODE | HELD — code + test together |
| 2.4 | FIX-DOC | DONE — `docs/scheduled-actions-health-check.md` |
| 2.5 | FIX-DOC | DONE — `docs/editing-the-textbook.md` |
| 2.6 | PARKED | Recorded; left as placeholders |
