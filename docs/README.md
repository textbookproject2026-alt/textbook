# The documentation set

A signpost, not a summary. Every file in this folder, grouped by who it is for.

## Start here

Inheriting this project cold, read three files in this order:

1. **[`INFRASTRUCTURE.md`](INFRASTRUCTURE.md)** — every service the book depends
   on, what breaks if it disappears, and where its credential lives.
2. **[`editing-the-textbook.md`](editing-the-textbook.md)** — what the author
   actually does all day, which is what the rest of the machinery exists to serve.
3. **[`DOCS-REMEDIATION.md`](DOCS-REMEDIATION.md)** — what is known to be broken,
   undecided or unwritten, so you do not rediscover it the hard way.

## For the author

- **[`editing-the-textbook.md`](editing-the-textbook.md)** — the day-to-day guide:
  how the vault is organised, how to add a chapter, and what changes without you.
- **[`the-authoring-app.md`](the-authoring-app.md)** — the Mac app that links
  citations and concept pages, builds the glossary, and shows what people sent in.
- **[`word-to-markdown.md`](word-to-markdown.md)** — writing a chapter in Word so
  it converts cleanly, and getting the result onto the website.
- **[`moderating-comments.md`](moderating-comments.md)** — the weekly fifteen
  minutes on reader comments, suggested edits and draft edits.
- **[`changing-settings.md`](changing-settings.md)** — changing the title,
  maintainer, address or licence, all of which live in one small file.

## For course coordinators

- **[`for-course-coordinators.md`](for-course-coordinators.md)** — creating and
  running a department edition, browser and GitHub Desktop only. Budget an
  afternoon.
- **[`updating-department-editions.md`](updating-department-editions.md)** — how a
  change reaches those editions, and why it usually doesn't until asked. Written
  for the technical contact, and the counterpart to the guide above.

## For trusted contributors and students

- **[`for-trusted-contributors.md`](for-trusted-contributors.md)** — editing
  chapters in the browser editor, for people given access. Ten minutes to read.
- **[`how-to-comment.md`](how-to-comment.md)** — the margin comments on every
  page, for students. Five minutes.

## For the technical contact

- **[`INFRASTRUCTURE.md`](INFRASTRUCTURE.md)** — the service-by-service inventory.
  Read it first when inheriting, and when it isn't obvious which system is broken.
- **[`the-authoring-app-operations.md`](the-authoring-app-operations.md)** —
  building and signing the app, its OAuth app, the DeepSeek egress path, and the
  Vercel function behind *Suggest an edit*.
- **[`troubleshooting.md`](troubleshooting.md)** — ten things that have actually
  gone wrong, each saying whether the author or you fixes it. The author reads
  this one too.
- **[`scheduled-actions-health-check.md`](scheduled-actions-health-check.md)** —
  the eight workflows, when each runs, and how to tell a real failure from a quiet
  week.
- **[`annotation-restore.md`](annotation-restore.md)** — what the Sunday
  annotation backups contain, and what restoring them would really involve.
- **[`releasing-versions.md`](releasing-versions.md)** — the yearly release: what
  the maintainer decides, what you do, and what gets sent to whom.
- **[`how-versioning-works.md`](how-versioning-works.md)** — how a tag becomes a
  permanent link, and how a coordinator pins a teaching year.
- **[`DOCS-REMEDIATION.md`](DOCS-REMEDIATION.md)** — the audit worklist and the
  source of truth for what is still open. Read *Decisions required* first.

## Also in this folder

`Chapter_03.docx` is a sample Word chapter kept for testing the conversion. It is
not documentation and nothing links to it.
