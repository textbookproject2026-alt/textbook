# Scheduled Actions — health check

Four workflows run on a weekly schedule, all Sundays, all times **UTC** (GitHub cron is always UTC; in Amsterdam these are one or two hours later depending on the season). They are staggered so that each one runs against a repository the previous one has finished writing to.

| Time (Sun, UTC) | Workflow | Writes |
|---|---|---|
| 03:00 | `backup-annotations.yml` | `backups/annotations-YYYY-MM-DD.json` |
| 07:00 | `contributors.yml` | `community/contributors.md` |
| 11:00 | `derivatives.yml` | `community/derivatives.md` |
| 15:00 | `dashboard.yml` | `community/dashboard.md` |

**Where to look, for all four:** the repository's **Actions** tab → pick the workflow in the left sidebar → the most recent run. A green tick is a pass; a red cross is a failure; a run that never appears at all is its own symptom (see *Nothing ran*, below). Open the failed step to see the log. Every workflow also has **Run workflow** (`workflow_dispatch`) — after a fix, re-run manually rather than waiting a week.

---

## 03:00 — `backup-annotations`

**Success:** a new `backups/annotations-YYYY-MM-DD.json` committed by the bot, valid JSON, containing one section per configured Hypothes.is group. Check the commit exists and the file is not zero-length.

**Failure:** red run at the export step (bad or expired `HYPOTHESIS_API_TOKEN`, a group ID that no longer exists, Hypothes.is API 5xx), or a green run that commits nothing — meaning the export produced an empty file and the commit step found no change.

**Look at:** the run log's export step for the HTTP status; `backups/` for the newest filename; repo secrets if the failure is a 401/403.

**Pruning caveat:** the workflow keeps the 12 most recent backups and deletes the rest. With one backup per week, the delete branch has never executed — the first run that has a 13th file to remove is **week 13**. Until that run passes, treat pruning as untested code, not proven behaviour. On that run, confirm the file count in `backups/` is 12, not 13, and that the deletion is in the commit diff.

---

## 07:00 — `contributors`

**Success:** the run is green, and either `community/contributors.md` shows a new commit or the run reports no changes to commit.

**Failure:** red at the GitHub API step (rate limit, or a bot token missing `contents: write`), or a page that renders as raw or half-empty on the live site — that is a template failure, not a fetch failure, and it will still show green.

**Look at:** the run log for the API response; the file's commit history for the last time it actually changed; the rendered page on the site to confirm it looks like a page and not a stack trace.

---

## 11:00 — `derivatives`

**Success:** green run; `community/derivatives.md` lists every fork of **`textbookproject2026-alt/textbook-edition-template`** — the edition template, NOT the canonical textbook repo — with owner, description, last-updated and link. Department editions are forks of the template; a fork of the canonical repo is not an edition and is not listed.

**Failure:** red at the forks API call, or a page that has lost entries that were there last week. A fork disappearing is usually real (someone deleted or privatised theirs) but is worth one look before assuming.

**Look at:** the run log; the **Forks** count on `textbook-edition-template` as ground truth — the page should match it. Entries are sparse when a fork has not set a description or homepage; that is the fork's metadata missing, not a workflow fault.

---

## 15:00 — `dashboard`

**Success:** green run; `community/dashboard.md` shows both live sources populated — annotation counts from Hypothes.is, contribution counts from GitHub — plus a working link to the public Plausible dashboard. Reading figures are linked, not fetched.

**Failure:** it depends on two APIs and exactly one secret — `HYPOTHESIS_API_TOKEN` (the same one the backup job uses); GitHub access uses the built-in token, and there is no Plausible key by design. The script throws before writing on any API failure, so a broken fetch fails the run rather than publishing a page of zeros. Still read the page, not just the tick.

**Look at:** the run log per-source. If annotation counts look wrong, check the token first — an expired Hypothes.is token returns HTTP 200 with empty results rather than an error, which is why the script pre-flights `/api/profile` and refuses to run when that comes back without a user.

---

## Two known-quiet cases — these are not failures

**No commit when nothing changed.** All three generator workflows commit only when their output differs from what is already in the repo. A week in which no one contributed, no fork appeared, and the numbers held steady produces a green run and no commit. That is the workflow working correctly. The failure signature to look for is a *red* run, or a green run whose output page is visibly broken — not the absence of a commit.

**Annotation groups showing zero.** Zero annotations in a group is an accurate reading of an empty group. Until the book is announced and students start commenting, zero is the true number, and the backup for that group will legitimately contain an empty array. Do not treat it as a broken API call. The way to tell the difference: an empty group returns a well-formed response with a zero count; a broken call fails the step outright, or writes a file with no group section at all rather than an empty one.

---

## If nothing ran at all

GitHub disables scheduled workflows in a repository with no activity for 60 days, and cron runs can be delayed by tens of minutes during peak load — a run that appears at 03:40 is normal. If a scheduled run is missing entirely for a week, check the Actions tab for a "scheduled workflows disabled" banner and re-enable, then trigger each workflow manually to confirm the schedule is live again.
