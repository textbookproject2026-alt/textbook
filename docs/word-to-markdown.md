# Turning a Word chapter into a textbook chapter

This guide is for you — no technical background needed. It covers writing a
chapter in Word so that it converts cleanly, running the conversion in the
authoring app, checking that nothing got lost, and publishing it.

There is no terminal here, nothing to install and no commands to type. The app
does the conversion itself, and it shows you what it did before anything is
written.

The guide has five parts:

1. **Write it right in Word** — habits that make conversion painless (read this before writing)
2. **Converting a chapter** — the six clicks, each time
3. **Check it worked** — reading the app's report, plus a tick-box list per chapter
4. **When something looks wrong** — the three most common problems and their fixes
5. **Getting it into the textbook** — from converted chapter to live website

Part 1 is the one that matters most. Everything after it is quick when the Word
document is built the way Part 1 describes, and fiddly when it isn't.

---

## Part 1 — Write it right in Word

Ten minutes of good habits in Word saves an hour of cleanup later. Conversion is
literal-minded: it reads the *structure* Word records behind the scenes, not what
the page looks like. Two headings can look identical on screen but be completely
different underneath — and only one of them converts.

**Use real heading styles.** When you start a new section, don't make the text
big and bold by hand. Instead, click on the line and choose a style from the
**Styles** gallery on Word's Home ribbon:

- **Heading 1** — the chapter title (use exactly once, at the top)
- **Heading 2** — main sections
- **Heading 3** — subsections

A quick way to check yourself: open Word's **View → Navigation Pane** (called the
sidebar or document map). If all your headings appear there, in the right order
and nesting, you're set. If a heading is missing from that pane, the conversion
won't see it either.

**Use Word's footnote tool.** For footnotes, go to **References → Insert
Footnote**. Word numbers it, formats it, and keeps it attached to the right
sentence. Never type a superscript number yourself and add a numbered list at the
end of the document — that *looks* like footnotes but converts to loose text.

**Keep tables simple.** Tables convert well when they're a plain grid: one header
row at the top, then rows of cells, with nothing merged or split. If you're
tempted to merge cells to make a complicated layout, break it into two smaller
tables instead — it will also read better on phones.

**Insert pictures the plain way.** Use **Insert → Picture** and place the image on
its own line, "In Line with Text" (Word's default). Avoid text boxes, SmartArt,
WordArt, and shapes drawn in Word — none of these survive conversion. Anything
built out of them is reported as a leftover and has to be redone.

**Before converting, tidy up:**

- If you had Track Changes on, accept all changes (**Review → Accept → Accept All
  Changes**) and turn tracking off. Otherwise both the old and the new text come
  through.
- Delete any leftover comments (**Review → Delete All Comments**).
- Avoid multi-column layouts, headers/footers with content in them, and manual
  page numbers — the website handles layout and navigation itself.

---

## Part 2 — Converting a chapter

### Where things live

- **Your Word files** stay wherever you like — for example a folder called `Word
  chapters` in your Documents. They do **not** go inside the textbook folder; the
  textbook folder holds only the converted versions.
- **The textbook folder** holds the result: the chapter text in `chapters`, and
  the chapter's images in `assets`, in a subfolder named after the chapter.

### The six steps

1. **Choose Chapters → A Word document** in the authoring app.
2. **Pick the .docx file.** A file picker opens; find the chapter you wrote and
   choose it. Nothing is changed in the Word file itself — it is only read.
3. **Pick the destination.** The app asks where the converted chapter should go.
   Choose the textbook folder's `chapters`; the app puts the images alongside it
   in `assets` for you.
4. **Name the chapter.** Use the word `chapter`, a dash, and the two-digit chapter
   number: `chapter-05`, `chapter-12`. This matches the chapters already in the
   book, and the website builds its links out of these names, so the shape is not
   optional. Each chapter also gets its own image folder under this name —
   Word calls its images `image1`, `image2` in *every* document, so two chapters
   sharing one folder would silently overwrite each other's pictures.
5. **Read the preview.** The app shows what it found — headings, pictures,
   tables, footnotes — and anything it could not convert. Read it before
   confirming; this is the moment when a problem is cheapest to fix. If something
   looks wrong, cancel, fix the Word document (Part 4), and start again.
6. **Confirm.** The app writes the chapter and its images, and shows the finished
   report. Part 3 is what to do with it.

### Cross-references to other chapters

A reference such as "see Chapter 4" converts as ordinary prose and can stay
exactly as it is. If you'd rather it were a clickable link, write it as
`[[chapter-04|the light reactions]]` — the part before the `|` is the target
chapter's file name without `.md`, and the part after is the text readers see.

### One thing that looks odd but is deliberate

Each paragraph in the converted chapter sits on a single very long line. That is
on purpose: it is what lets the change history show exactly which words changed
when someone edits a sentence. Without it, changing one word marks the whole
paragraph as changed and edits become impossible to review. Leave it as it is,
and type new sentences the same way.

---

## Part 3 — Check it worked

### The report

When the conversion finishes, the app reports five things:

| The report says | What it means |
|---|---|
| **Headings** | How many headings it found, and their levels. This should match Word's Navigation Pane. |
| **Pictures** | How many images it pulled out, and the folder they went into. |
| **Tables** | How many tables it converted as grids. |
| **Footnotes** | How many real footnotes it found — hand-typed ones are not counted here. |
| **Leftovers** | Anything it could not convert: text boxes, SmartArt, WordArt, drawn shapes. **This should be empty.** Anything listed here is missing from the chapter. |

Compare those numbers against the Word document. A count that is lower than you
expect is the earliest sign of the problems in Part 4 — usually headings made by
hand, or footnotes typed by hand.

### The checklist

Then open the textbook folder in **Obsidian**, click the new chapter, and read
it. Tick these off:

- [ ] **Headings** — the chapter title and all section headings are there, at the
      right levels. Open Obsidian's outline panel and compare it to Word's
      Navigation Pane: same headings, same order, same nesting.
- [ ] **Footnotes** — the count in the report matches the last footnote number in
      Word, the notes are listed at the bottom of the file, and the numbers in the
      text are clickable.
- [ ] **Tables** — each one displays as a proper grid with its header row, not as
      a run-together block of text.
- [ ] **Pictures** — every figure from the Word document shows in the chapter, and
      the files are in this chapter's own image folder. Same count as Word.
- [ ] **Leftovers** — the report listed none. If it listed something, that content
      is not in the chapter; go to Part 4.
- [ ] **Skim the full chapter once** for anything that looks off — stray symbols,
      a gap where something used to be, a formula that turned to gibberish.

If everything ticks, go to Part 5. If not, Part 4 below.

---

## Part 4 — When something looks wrong

Almost every conversion problem traces back to how the Word document was built,
and the fix is always the same shape: **fix it in Word, then convert again.**
Converting again is cheap and safe — it simply replaces the chapter — so never
patch problems in the converted chapter while the Word document still has the
flaw. Your patches would be lost the next time, and the flaw would come back.

**A table came out scrambled** — text run together, columns misaligned, rows
missing, or the report counted fewer tables than the document has. Cause: merged
or split cells. Fix: in Word, click the table and look for merged cells (one cell
spanning several columns or rows). Unmerge them (**Layout → Split Cells**) or
rebuild that table as two or three simple grids. Convert again.

**Headings are missing** — sections that were clearly headed in Word show up as
ordinary bold text, the report's heading count is low, and the outline panel in
Obsidian is empty or patchy. Cause: the headings were made by hand (bold and a
bigger font) instead of with Word's Heading styles. Fix: in Word, click each
heading line and apply **Heading 1/2/3** from the Styles gallery (see Part 1). The
text won't visibly change much, but the structure will now be recorded. Convert
again.

**Footnotes turned into plain text** — the notes appear as a numbered list
mid-document, the numbers in the text aren't clickable, or the report says there
are no footnotes when the document plainly has some. Cause: the footnotes were
typed by hand rather than inserted with Word's footnote tool. Fix: in Word, delete
the hand-made version and re-create each note with **References → Insert
Footnote**, pasting the note's text into the footnote area Word creates. Tedious,
but only ever needed once per chapter. Convert again.

**The report listed leftovers** — a text box, SmartArt, WordArt or a drawn shape.
None of these can be converted, so whatever was inside them is simply not in the
chapter. Fix: in Word, retype the text as ordinary paragraphs, or export the
diagram as a picture and insert it with **Insert → Picture**. Convert again.

If you hit something not on this list, don't sink time into it — keep the Word
file and the converted chapter side by side and note what looks wrong. The
difference between the two usually makes the cause obvious to whoever looks next.

---

## Part 5 — Getting it into the textbook

Once the checklist passes:

1. **Check the top of the file.** The chapter should begin with its title as a
   Heading 1 (`# Chapter 5: Photosynthesis`) and nothing above it. Chapters in
   this textbook carry no front-matter block — `chapter-03.md` starts straight in
   with its title, and yours should too. If a stray blank line or a duplicate
   title has been left at the very top, delete it.
2. **Add the chapter to the front page.** Open `index.md` (the textbook's table of
   contents) and add a line for the new chapter, written the same way as the
   existing entries.
3. **Nothing to sync or commit.** There is no source-control step in this workflow
   and you don't need one — saving the file in Obsidian is all the storing it
   needs. Getting the chapter in front of readers is the publish step, and that
   routine lives in one place: **Publishing** in `docs/editing-the-textbook.md`.
   Read it there if anything below is unclear; the next step is the short version.

4. **Publish to the website.** Click the **Publish** icon in Obsidian's left
   sidebar. Obsidian shows a list of files that are new or changed since the last
   publish — your new chapter, its images, and `index.md`. Read the list before
   confirming: anything ticked will go live, anything unticked won't. Click
   **Publish** and wait; the site updates within a minute or two.

   **Saving and publishing are separate, and only publishing reaches readers.**
   Saving in Obsidian stores the chapter; the Publish dialog is what sends it to
   the live site. A chapter that's been saved but not published is safely stored
   and invisible to the world.

   This matters most for the site's two design files, **`publish.css`** and
   **`publish.js`**, which sit at the top level of the textbook folder. They reach
   the live site *only* through the Publish dialog — saving them does nothing for
   the website. If a change to how the site looks doesn't show up, this is nearly
   always why: the file was saved but never ticked in the Publish list.

5. **Check the live site.** Open the website, find the new chapter from the front
   page, and give it one last skim — especially the images and tables.

That's the whole cycle: write in Word with Part 1's habits, convert with Part 2's
six steps, tick Part 3's list, publish with Part 5. For a chapter written the way
Part 1 describes, the whole thing takes a few minutes end to end.
