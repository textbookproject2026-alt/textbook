# Annotation backups, and what restoring them actually involves

Every Sunday at 03:00 UTC, an automated job takes a copy of the textbook's
Hypothes.is annotations and commits it to this repository. This page explains
what those copies contain, where to find them, and — the part people usually
want to know at the worst possible moment — what it would really take to get
annotations back if something went wrong.

The short version of the honest answer: **the backups are complete and
trustworthy, but Hypothes.is has no "restore" button.** Getting annotations back
is a re-creation job, not an upload. Read on for why, and what that would look
like.

---

## What gets backed up

Three separate collections ("scopes"), in one file per week:

| Scope | What it is |
|---|---|
| `public` | Every public annotation on any page under `https://bptext2026.xyz` — the layer readers see without logging in |
| `group:ZGY29zLM` | The **test-group** private group |
| `group:L9KgjVPa` | The **Biology edition** private group |

Each annotation is stored **exactly as the Hypothes.is API returned it** —
nothing is trimmed, renamed, or reformatted. That means the highlighted text,
the surrounding context used to re-locate the highlight on the page, the comment
body, tags, author, timestamps, replies, and permissions are all preserved.

When more groups exist (a production group, and one per edition), they are added
to a single list at the top of `scripts/backup-annotations.mjs` and start being
backed up on the next run. Nothing else needs to change.

### What is *not* backed up

- Annotations on pages that are not under `bptext2026.xyz`.
- Private annotations belonging to individual readers ("Only Me" notes). These
  are invisible to the API for anyone but their author, by design.
- Group membership lists, group names, or account settings — annotations only.

---

## Where the backups live, and why not on `main`

Backups are committed to a separate branch called **`backups`**. They are not on
`main`.

This is deliberate. `main` is protected: changes have to arrive through a pull
request. The automated job runs as GitHub's built-in bot account, which cannot
bypass that rule and cannot approve its own pull requests. If the job pushed to
`main`, it would simply be rejected — every Sunday, quietly, in a log nobody
reads, and we would discover we had no backups at the moment we needed them.

Committing to an unprotected `backups` branch sidesteps that without weakening
`main`'s protection at all. It has a useful side effect too: a few hundred
kilobytes of annotation JSON each week stays out of the textbook's own history,
so `main` stays about the book.

The `backups` branch holds *only* backups. It shares no history with `main`, so
you will not find chapters or scripts there.

### Getting at a backup

```bash
# list what's available
git fetch origin backups
git ls-tree --name-only origin/backups:backups

# read one without changing your working copy
git show origin/backups:backups/annotations-2026-08-16.json > /tmp/annotations.json
```

Or just browse to the `backups` branch on GitHub and click the file.

### How long they are kept

The **12 most recent** files are kept — roughly three months. Older ones are
deleted automatically in the same commit that adds the new one. A run on a day
that already has a backup overwrites that day's file rather than adding a
second.

Twelve weeks is a deliberate trade-off: long enough to notice and recover from a
problem, short enough that the branch does not grow without limit. If annotation
volume grows and three months starts to feel thin, change `KEEP` in
`.github/workflows/backup-annotations.yml`.

---

## What a backup file looks like

Filename: `backups/annotations-YYYY-MM-DD.json`

```json
{
  "meta": {
    "generatedAt": "2026-08-16T03:01:12.482Z",
    "runDate": "2026-08-16",
    "account": "acct:AlecGordon@hypothes.is",
    "complete": true,
    "totalAnnotations": 143,
    "scopes": {
      "public":          { "count": 118, "method": "wildcard_uri", "pages": 1, "params": [ ... ] },
      "group:ZGY29zLM":  { "count": 20,  "method": "group",        "pages": 1, "params": { ... } },
      "group:L9KgjVPa":  { "count": 5,   "method": "group",        "pages": 1, "params": { ... } }
    }
  },
  "scopes": {
    "public":         [ /* raw annotation objects */ ],
    "group:ZGY29zLM": [ /* ... */ ],
    "group:L9KgjVPa": [ /* ... */ ]
  }
}
```

Two things in `meta` are worth knowing about:

- **`complete`** — `false` means at least one scope failed to download. The file
  is still written (better to keep what did work than throw it away), but the
  job deliberately fails so somebody sees it. Check `meta.scopes[...].error`.
- **`warnings`** — plain-English notes about anything odd, such as a scope
  coming back empty, or the backup account no longer being a member of a group
  it is supposed to be backing up.

The `params` fields record the exact queries used. If a backup ever looks wrong,
that is where you find out what was actually asked for.

---

## The restore story

### There is no bulk restore

This is the important part, and it is worth being blunt about it: **Hypothes.is
provides no import, no bulk upload, and no "restore from backup" feature.** The
API can create annotations one at a time and that is all. Our backup files are a
complete and faithful record, but they are not something you can hand back to
Hypothes.is and have it undo a loss.

So a backup here buys you two real things:

1. **The content is never lost.** Every highlight, comment, tag, and reply
   survives independently of Hypothes.is. If the service disappeared tomorrow,
   the intellectual work of the annotators would still exist.
2. **You have options.** You can re-create the annotations, or take the JSON to
   a different tool entirely.

What it does not buy you is a one-click undo.

### Option A — re-create them via the API

Annotations can be re-created one at a time by POSTing to
`https://api.hypothes.is/api/annotations` with a token belonging to the account
doing the restoring. Every backed-up annotation already contains the fields a
create call needs.

**This has not been built.** It is not needed until it is needed, and building it
speculatively would mean maintaining untested code against an API that may
change. The sketch below is enough to write it in an afternoon if that day
comes.

Roughly, for each annotation in the scope you are restoring:

```
POST https://api.hypothes.is/api/annotations
Authorization: Bearer <token of the account doing the restore>

{
  "uri":      <copied from the backup>,
  "document": <copied from the backup>,
  "text":     <the comment body>,
  "tags":     <the tags>,
  "group":    <target group id, or "__world__" for public>,
  "target":   <copied verbatim — this is what re-anchors the highlight>,
  "references": <for replies: the ids of the annotations being replied to>
}
```

The `target` field is the one that matters most and the one you must copy
untouched. It holds the selectors — the exact quoted text plus its surrounding
prefix and suffix — that Hypothes.is uses to find the highlight on the page
again. Copy it verbatim and highlights land back where they belong.

**Five things that will bite whoever builds this:**

1. **Authorship is lost.** Re-created annotations belong to whichever account
   made the API call. If twenty students annotated a chapter, a restore turns
   all twenty into annotations by the restoring account. The original author is
   still recorded in the backup file's `user` field, so nothing is *forgotten* —
   but it cannot be restored as authorship. For a class where attribution
   matters, this is the difference between a real restore and an archive.
2. **Timestamps reset.** `created` and `updated` become the moment of the
   restore. The originals remain readable in the backup.
3. **Replies must be handled parent-first.** A reply points at its parent through
   `references`, which holds annotation IDs — and every re-created annotation
   gets a brand-new ID. So you must restore parents before replies, keep a map of
   old ID to new ID as you go, and rewrite `references` through that map.
   Restoring in the file's own order without doing this produces orphaned
   replies.
4. **Highlights can land as "orphans."** Selectors match against the page text as
   it is *now*. If a chapter was edited after the annotation was made, some
   highlights will not find their anchor and will show up in the sidebar as
   orphaned. The comment survives; the link to a specific phrase does not.
5. **Rate limits.** Restoring hundreds of annotations means hundreds of API
   calls. Go gently and handle `429` responses, or the restore will stall
   part-way through — which is worse than not starting, because now you have a
   half-restored group and duplicates if you retry naively.

### Option B — take the JSON somewhere else

The backup files are ordinary JSON with a documented, stable shape. If the
project moves off Hypothes.is — to a different annotation tool, or to something
purpose-built — this is the migration input. The selectors follow the W3C Web
Annotation model, which most annotation tools understand, so the highlights are
portable and not just the text.

For a project that may outlive its choice of annotation vendor, this is arguably
the more valuable of the two options.

---

## Keeping the automation healthy

**It depends on one secret.** The repository secret `HYPOTHESIS_API_TOKEN` holds
an API token belonging to a Hypothes.is account that is a member of every group
being backed up. Get one from <https://hypothes.is/account/developer>, and set it
under Settings → Secrets and variables → Actions.

**A dead token is the failure mode to watch for.** The Hypothes.is API does
something unhelpful here: a request with an invalid or expired token does not
return an error. It returns success and zero results. Left unhandled, that
produces a backup file that looks perfectly healthy and contains nothing.

The script guards against exactly this. Before fetching anything, it checks the
token against the API and refuses to run if it is not recognised, and it warns
if the account has lost access to a group it is meant to be backing up. If the
person holding that account leaves the project, or the token is revoked, the job
fails loudly instead of quietly writing empty files.

**Running it by hand:** Actions → "Backup annotations" → "Run workflow". Useful
before anything risky, like a bulk edit of chapter text that might orphan
highlights.

**Running it locally:**

```bash
export HYPOTHESIS_API_TOKEN=<your token>
node scripts/backup-annotations.mjs --dry-run   # fetch and report, write nothing
node scripts/backup-annotations.mjs             # writes into ./backups
```

**If the weekly run fails,** the Actions log names the scope and the reason. The
most common causes, in order of likelihood: the token expired, the backup
account was removed from a group, or Hypothes.is had an outage (the script
retries transient failures on its own, so an outage has to be sustained to fail
the run).

---

## A note on what backups do not protect against

Backups protect against *loss*. They do not protect against *damage you do not
notice*. If annotations are deleted and nobody spots it for four months, the
backups will have rotated past the last good copy. If a chapter is rewritten and
every highlight on it is orphaned, the backups faithfully record the annotations
but cannot re-anchor them to text that no longer exists.

The practical implication: before any large-scale edit to published chapters, run
the workflow by hand so there is a fresh copy from immediately before the change.
