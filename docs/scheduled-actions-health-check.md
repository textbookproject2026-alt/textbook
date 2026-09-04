# Scheduled Actions — health check

The repository runs **eight** workflows. Four are the Sunday jobs this guide is
mostly about; the other four are covered in *The other four workflows* at the end,
because they fail differently and one of them runs on a Monday.

The Sunday four, all times **UTC** (GitHub cron is always UTC; in Amsterdam these
are one or two hours later depending on the season). They are staggered so that
each one runs against a repository the previous one has finished writing to.

| Time (Sun, UTC) | Workflow | Writes | How it lands |
|---|---|---|---|
| 03:00 | `backup-annotations.yml` | `backups/annotations-YYYY-MM-DD.json` | pushes straight to the `backups` branch |
| 07:00 | `contributors.yml` | `community/contributors.md` | opens a pull request, **auto-merges** |
| 11:00 | `derivatives.yml` | `community/derivatives.md` | opens a pull request, **auto-merges** |
| 15:00 | `dashboard.yml` | `community/dashboard.md` | opens a pull request, **auto-merges** |

**Where to look, for all of them:** the repository's **Actions** tab → pick the workflow in the left sidebar → the most recent run. A green tick is a pass; a red cross is a failure; a run that never appears at all is its own symptom (see *Nothing ran*, below). Open the failed step to see the log. Each of the Sunday four also has **Run workflow** (`workflow_dispatch`) — after a fix, re-run manually rather than waiting a week.

**Three auto-merge, not four.** `backup-annotations` opens no pull request at all: `main` is branch-protected and `github-actions[bot]` cannot bypass that, so the backup pushes to the unprotected `backups` branch instead. Looking for a fourth chore pull request is looking for something that does not exist. The three generator jobs *do* need a pull request, because their pages have to be on `main` to appear in the book — so they open one and arm auto-merge on it. See *Auto-merge, and when it silently doesn't* below.

---

## Auto-merge, and when it silently doesn't

The three generator jobs each rebuild their page, and — only if it differs from
what is already on `main` — push a machine-owned branch, open a pull request, and
arm GitHub's auto-merge so the squash lands on its own. Nobody shepherds a weekly
chore pull request.

**What makes that safe** is the check the final step runs before arming anything.
It re-reads the pull request from the API and requires all three of:

1. the author is `github-actions[bot]` (type `Bot`);
2. exactly one file changed;
3. that file is the page this workflow generates.

Anything failing any of the three is left open for a human. The branch name is
deliberately *not* part of the test — anyone with write access can push a branch
called `chore/contributors-update`, so trusting the name would trust the pusher. A
content pull request carrying prose somebody wrote is refused by construction, and
required review on `main` is what protects those. It must stay in place.

**The failure mode to know about is a quiet one.** Arming auto-merge needs
**"Allow auto-merge" switched on** under *Settings → General*, and needs `main`'s
protection to let `github-actions[bot]` satisfy it. If either is missing, the step
logs a **warning** and leaves the pull request open — **it never fails the run**.
So the symptom is not a red cross. It is a green tick, a correct page, and chore
pull requests quietly accumulating in the Pull requests tab.

**Check for it like this:** open the repository's **Pull requests** tab. More than
one open `chore/…-update` pull request, or one older than a week, means auto-merge
is not arming. Read the warning in the most recent run's final step; it names which
of the three checks refused, or says it could not arm at all.

Two related behaviours that are correct and can look wrong:

- **A pull request that was already mergeable gets merged outright.** GitHub
  refuses to *arm* auto-merge on a pull request with nothing left to wait for, so
  the step falls back to merging it directly when `mergeable_state` is `clean`.
- **An open pull request is not re-pushed with an identical page.** If last
  Sunday's pull request is still open and this week's regenerated page is
  byte-identical to it, the job leaves it alone rather than re-notifying its
  reviewers.

---

## 03:00 — `backup-annotations`

**Success:** a new `backups/annotations-YYYY-MM-DD.json` committed by the bot, valid JSON, containing one section per configured Hypothes.is group. Check the commit exists and the file is not zero-length.

**Failure:** red run at the export step (bad or expired `HYPOTHESIS_API_TOKEN`, a group ID that no longer exists, Hypothes.is API 5xx), or a green run that commits nothing — meaning the export produced an empty file and the commit step found no change.

**Look at:** the run log's export step for the HTTP status; `backups/` for the newest filename; repo secrets if the failure is a 401/403.

**Pruning caveat:** the workflow keeps the 12 most recent backups and deletes the rest. With one backup per week, the delete branch has never executed — the first run that has a 13th file to remove is **week 13**. Until that run passes, treat pruning as untested code, not proven behaviour. On that run, confirm the file count in `backups/` is 12, not 13, and that the deletion is in the commit diff.

---

## 07:00 — `contributors`

**Success:** the run is green, and either the page's pull request opened and auto-merged (so `community/contributors.md` shows a new commit on `main`) or the run reports the page is already current and opens nothing.

**Failure:** red at the GitHub API step (rate limit, or a bot token missing `contents: write`), or a page that renders as raw or half-empty on the live site — that is a template failure, not a fetch failure, and it will still show green.

**Look at:** the run log for the API response; the file's commit history for the last time it actually changed; the rendered page on the site to confirm it looks like a page and not a stack trace.

---

## 11:00 — `derivatives`

**Success:** green run, pull request opened and auto-merged where the page changed; `community/derivatives.md` lists every fork of **`textbookproject2026-alt/textbook-edition-template`** — the edition template, NOT the canonical textbook repo — with owner, description, last-updated and link. Department editions are forks of the template; a fork of the canonical repo is not an edition and is not listed.

**Failure:** red at the forks API call, or a page that has lost entries that were there last week. A fork disappearing is usually real (someone deleted or privatised theirs) but is worth one look before assuming.

**Look at:** the run log; the **Forks** count on `textbook-edition-template` as ground truth — the page should match it. Entries are sparse when a fork has not set a description or homepage; that is the fork's metadata missing, not a workflow fault.

---

## 15:00 — `dashboard`

**Success:** green run, pull request opened and auto-merged where the page changed; `community/dashboard.md` shows both live sources populated — annotation counts from Hypothes.is, contribution counts from GitHub — plus a working link to the public Plausible dashboard. Reading figures are linked, not fetched.

**Failure:** it depends on two APIs and exactly one secret — `HYPOTHESIS_API_TOKEN` (the same one the backup job uses); GitHub access uses the built-in token, and there is no Plausible key by design. The script throws before writing on any API failure, so a broken fetch fails the run rather than publishing a page of zeros. Still read the page, not just the tick.

**Look at:** the run log per-source. If annotation counts look wrong, check the token first — an expired Hypothes.is token returns HTTP 200 with empty results rather than an error, which is why the script pre-flights `/api/profile` and refuses to run when that comes back without a user.

---

## Two known-quiet cases — these are not failures

**No commit when nothing changed.** All three generator workflows commit only when their output differs from what is already in the repo. A week in which no one contributed, no fork appeared, and the numbers held steady produces a green run, no branch, no pull request and no commit. That is the workflow working correctly. The failure signature to look for is a *red* run, a green run whose output page is visibly broken, or a chore pull request left open — not the absence of a commit.

**Annotation groups showing zero.** Zero annotations in a group is an accurate reading of an empty group. Until the book is announced and students start commenting, zero is the true number, and the backup for that group will legitimately contain an empty array. Do not treat it as a broken API call. The way to tell the difference: an empty group returns a well-formed response with a zero count; a broken call fails the step outright, or writes a file with no group section at all rather than an empty one.

---

## If nothing ran at all

GitHub disables scheduled workflows in a repository with no activity for 60 days, and cron runs can be delayed by tens of minutes during peak load — a run that appears at 03:40 is normal. If a scheduled run is missing entirely for a week, check the Actions tab for a "scheduled workflows disabled" banner and re-enable, then trigger each workflow manually to confirm the schedule is live again.

That applies to the Monday link check as much as to the Sunday four — it is on the
same cron scheduler and gets disabled by the same 60-day rule.

---

## The other four workflows

These are not on the Sunday schedule and mostly announce themselves by failing a
pull request rather than by needing to be looked for. They are here because "four
weekly jobs" is what everyone remembers, and these four are the ones nobody
mentions until one of them is the problem.

### `link-check.yml` — **runs Mondays**, not Sundays

Lychee, on every push and pull request touching a `.md` file, **and on a weekly
cron at 06:00 UTC every Monday** (`0 6 * * 1`). The weekly run is the one that
matters: it catches links that rot over time with no code change behind them.

**Failure:** red run listing the dead URLs. Usually a genuinely dead external link
in a chapter, which is worth fixing before a year of students meets it (the
pre-release checklist in `docs/releasing-versions.md` asks for the same thing by
hand).

**Two things it deliberately does not check.** `--exclude-path docs` and
`--exclude-path templates`: the operator guides link to auth-walled Cloudflare and
Hypothes.is pages that return 403 to any checker, and `templates/` holds unrendered
placeholders. So **a broken link inside `docs/` will never be caught by CI** —
including links between the guides themselves. Check those by hand.

It also runs the `lychee` binary directly rather than `lychee-action`, because the
action's entrypoint evals its command line and crashes on filenames containing
apostrophes — which pandoc-converted chapter titles will contain. Don't switch it
back.

### `lint.yml`

`markdownlint-cli2` over `**/*.md`, on pushes to `main` and on every pull request.
Rules are in `.markdownlint-cli2.yaml`.

**Failure:** red check on a pull request, naming file and line. It blocks nothing
by itself; it is a nag, and a useful one.

### `apply-config.yml` — the one with a user-visible failure

Triggered by a **pull request** touching `textbook.config.json`, `templates/**` or
`configure.mjs`. It runs `configure.mjs`, regenerates `index.md`, `README.md` and
`CONTRIBUTING.md`, and commits the result back **into the pull request's own
branch** so the change lands complete.

This is the job behind two things the author is told to expect: the front page
rewriting itself after `templates/index.md` is edited (`docs/editing-the-textbook.md`,
"Adding a new chapter") and the settings change flow in
`docs/changing-settings.md`, which tells them to wait about a minute for a commit
from `github-actions` before merging.

**Failure looks like:** a pull request that never receives its `Apply config to
generated files` commit. The author's symptom is *"the front page still hasn't
caught up"* — they are told to escalate exactly that, and this workflow is where it
lands. Check the run on the pull request, and check the trigger paths: an edit that
touches none of the three paths does not fire it at all.

**Note it only runs on `pull_request`.** A direct push to `main` that changed a
template would not regenerate anything — which is academic while `main` requires a
pull request, but stops being academic if that protection is ever relaxed.

### `stats.yml` — a stub, not a job

`workflow_dispatch` only, and its single step echoes
`TODO - contributor/annotation stats (Week 5)`. The work it was a placeholder for
was done by `contributors.yml`, `derivatives.yml` and `dashboard.yml` instead. It
does nothing, has never run on a schedule, and is safe to delete. It is described
here only so that finding it in the Actions sidebar does not start an
investigation.
