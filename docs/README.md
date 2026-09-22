# The documentation set

A signpost, not a summary. Every file in this folder, grouped by who it's for.

**These are this book's guides.** This book is one of several on a shared
platform. Everything that belongs to the platform rather than to this book (the
registry, the shared services, the accounts, the portal, adding and retiring
books) is documented by the platform owner in
[`textbook-registry/docs/`](https://github.com/textbookproject2026-alt/textbook-registry/tree/main/docs),
starting with its
[`INFRASTRUCTURE.md`](https://github.com/textbookproject2026-alt/textbook-registry/blob/main/docs/INFRASTRUCTURE.md)
(`textbook-registry/docs/INFRASTRUCTURE.md`). Nothing here repeats it.

## Start here

If you're inheriting this book cold, read these three files in this order:

1. **[`what-this-book-runs-on.md`](what-this-book-runs-on.md)**: what is this
   book's to look after, what is the platform's, and who to ask about each.
2. **[`editing-the-textbook.md`](editing-the-textbook.md)**: what the author
   actually does all day, which the rest of the machinery exists to serve.
3. **[`DOCS-REMEDIATION.md`](DOCS-REMEDIATION.md)**: what is known to be broken,
   undecided or unwritten in this book's docs, so you don't rediscover it the
   hard way.

## For the author

- **[`editing-the-textbook.md`](editing-the-textbook.md)**: the day-to-day guide.
  How the vault is organised, how to add a chapter, and what changes without you.
- **[`the-authoring-app.md`](the-authoring-app.md)**: the Mac app that links
  citations and concept pages, builds the glossary, and shows what people sent in.
- **[`word-to-markdown.md`](word-to-markdown.md)**: writing a chapter in Word so
  it converts cleanly, and getting the result onto the website.
- **[`moderating-comments.md`](moderating-comments.md)**: the weekly fifteen
  minutes on reader comments, suggested edits and draft edits.
- **[`changing-settings.md`](changing-settings.md)**: the title, maintainer,
  address and licence, which are the platform registry's to change, and what
  you ask for.
- **[`releasing-versions.md`](releasing-versions.md)**: the yearly release: what
  you decide, what the technical contact does, and what gets sent to whom.
- **[`troubleshooting.md`](troubleshooting.md)**: ten things that have actually
  gone wrong, each saying who fixes it.

## For course coordinators

- **[`for-course-coordinators.md`](for-course-coordinators.md)**: creating and
  running a department edition, with only a browser and GitHub Desktop. Budget an
  afternoon.
- **[`how-versioning-works.md`](how-versioning-works.md)**: how a tag becomes a
  permanent link, and how to pin a teaching year.

## For trusted contributors and students

- **[`for-trusted-contributors.md`](for-trusted-contributors.md)**: editing
  chapters in the browser editor, for people who've been given access. Ten
  minutes to read.
- **[`how-to-comment.md`](how-to-comment.md)**: the margin comments on every
  page, for students. Five minutes.

## For this book's technical contact

- **[`what-this-book-runs-on.md`](what-this-book-runs-on.md)**: the book-level
  inventory. Read it when inheriting, and when it isn't obvious whether a problem
  is this book's or the platform's.
- **[`the-browser-editor.md`](the-browser-editor.md)**: the editor's host, its
  generated config, and giving contributors access.
- **[`updating-department-editions.md`](updating-department-editions.md)**: how a
  change reaches the department editions, and why it usually doesn't until
  someone asks.
- **[`annotation-restore.md`](annotation-restore.md)**: what the Sunday
  annotation backups contain, and what restoring them would really involve.
- **[`DOCS-REMEDIATION.md`](DOCS-REMEDIATION.md)**: the September audit worklist
  for this book's docs. Read *Decisions required* first.

## Moved to the platform owner's docs

These used to be here. They describe services every book shares, so they moved
to `textbook-registry/docs/` on 22 September 2026:

| Was | Now |
|---|---|
| `docs/INFRASTRUCTURE.md` | [`INFRASTRUCTURE.md`](https://github.com/textbookproject2026-alt/textbook-registry/blob/main/docs/INFRASTRUCTURE.md) (the whole platform), with this book's half in [`what-this-book-runs-on.md`](what-this-book-runs-on.md) |
| `docs/scheduled-actions-health-check.md` | [`SCHEDULED-JOBS.md`](https://github.com/textbookproject2026-alt/textbook-registry/blob/main/docs/SCHEDULED-JOBS.md). This book's workflows are its Part 2 |
| `docs/the-authoring-app-operations.md` | [`AUTHORING-APP-OPERATIONS.md`](https://github.com/textbookproject2026-alt/textbook-registry/blob/main/docs/AUTHORING-APP-OPERATIONS.md) |
| `OAUTH-SETUP.md` | the relay half: [`CMS-RELAY.md`](https://github.com/textbookproject2026-alt/textbook-registry/blob/main/docs/CMS-RELAY.md); this book's half: [`the-browser-editor.md`](the-browser-editor.md) |

## Also in this folder

`Chapter_03.docx` is a sample Word chapter, kept for testing the conversion. It
isn't documentation, and nothing links to it.
