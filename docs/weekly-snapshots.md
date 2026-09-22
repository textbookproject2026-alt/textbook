# Weekly snapshots: getting back an earlier week's text

Early every Sunday morning, the whole book is saved as a **snapshot**: a copy of
every chapter exactly as it stood that day, with the date in its name. Think of
it as *Save As…* with the date added, done for you and kept for good. Nobody has
to start it, and snapshots are never deleted.

If nothing in the book changed during the week, no new snapshot is made. It would
only be a copy of the last one, and the last one still stands for that week.

You don't need a GitHub account for anything on this page.

---

## Where they are

All of them are listed here, newest first:

    https://github.com/textbookproject2026-alt/textbook/tags

Each one is named `snapshot-` followed by the date it was taken, year first:
`snapshot-2026-09-27` is the book as it stood on the morning of Sunday
27 September 2026.

The same list also has a few names starting with **v**, like `v0.1`. Those are
the yearly **versions**, the editions students are taught from. They're a
different thing, made once a year on purpose; see
[`how-versioning-works.md`](how-versioning-works.md).

To go straight to one week, put its date on the end of this address:

    https://github.com/textbookproject2026-alt/textbook/tree/snapshot-2026-09-27

If a date you try doesn't exist, the book didn't change that week. Use the
snapshot before it: it's the same text.

## Downloading a whole week

On the list of snapshots, each one has a **zip** link underneath it. Or use this
address, with the date changed:

    https://github.com/textbookproject2026-alt/textbook/archive/refs/tags/snapshot-2026-09-27.zip

You get one folder holding every chapter as it was that week. The chapters are
plain-text files ending `.md`. They open in Obsidian, in TextEdit, or in Word
(**File → Open**, and choose to show all files). Word shows the words and the
formatting marks, such as `#` before a heading, rather than the formatting
itself.

## Getting a chapter's text back

Usually you want one passage back, not the whole book. To get it:

1. Open that week's snapshot (the `tree/` address above).
2. Click **chapters**, then the chapter you want. GitHub shows it as it was that
   week.
3. Either select the passage and copy it, or click the **Copy raw file** button
   (two overlapping squares, above the text on the right) to copy the whole
   chapter exactly as it was written.
4. In Obsidian, open the chapter and paste it where it belongs, then publish as
   usual.

Paste back only what you need. Pasting a whole chapter over the current one
brings back the old passage, and it also undoes every later edit to that
chapter.

**To see what changed between two weeks,** put both names in this address:

    https://github.com/textbookproject2026-alt/textbook/compare/snapshot-2026-09-20...snapshot-2026-09-27

It works like tracked changes in Word: red for text taken out, green for text
added.

**To cite a week,** use its `tree/` address. It shows the same text forever,
however much the book changes afterwards.

## When to ask the technical contact instead

- **Putting the whole book back** to an earlier week.
- **Reader comments from the same week.** The margin comments are backed up
  separately, on the same Sunday morning, so a week's snapshot and its comment
  backup share a date. Getting comments back is a different job; see
  [`annotation-restore.md`](annotation-restore.md).
- **A week is missing that shouldn't be:** you know the book changed during a
  week, but there is no snapshot dated the Sunday after it.
