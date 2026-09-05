# Turning a Word chapter into a textbook chapter

This guide is for you — no technical background needed. It covers writing a
chapter in Word so that it converts cleanly, running the conversion in the
authoring app, checking that nothing got lost, and publishing it.

There is no terminal here, nothing to install and no commands to type. The app
does the conversion itself, and it shows you what it did before anything is
written.

The guide has five parts:

1. **Write it right in Word** — habits that make conversion painless (read this before writing)
2. **Converting a chapter** — what the app asks for, and in what order
3. **Check it worked** — reading the app's report, plus a tick-box list per chapter
4. **When something looks wrong** — the common problems and their fixes
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
WordArt, and shapes drawn in Word — none of these come through as usable content.
The app flags each of them in its report (Part 3), and they have to be redone.

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
  textbook folder holds only the converted versions. The Word document is read
  and left exactly where it is: never changed, never moved.
- **The chapter** goes into whichever folder you choose — for this textbook, that
  is `chapters`.
- **The chapter's pictures** go into the textbook folder's own `assets/`, in a
  folder named after the chapter. A chapter saved as `chapters/chapter-05.md`
  gets `assets/chapter-05/`, and the picture links inside the chapter point
  there. This is the same convention `docs/editing-the-textbook.md` describes for
  hand-made chapters, so converted and hand-made chapters keep their pictures in
  the same place. The app does not ask you where the pictures should go.

### The steps

1. **Choose "A Word document"** on the app's opening screen (*What would you like
   to work on?*), alongside "One chapter" and "My whole vault".

   The first time only, you may get a screen headed **One thing is missing**: the
   converter itself, a free program called pandoc, isn't on this Mac yet. Press
   the button and the app downloads pandoc's own installer, checks that it really
   is signed by the people who make it, and opens it for you — press **Continue**,
   then **Install**, give the Mac's password when the installer asks, then come
   back and press **Check again**. It is about a 40 MB download. Nothing in your
   vault is touched.

2. **Choose the Word document.** A file picker opens. It has to be a `.docx` —
   the kind Word has saved since 2007. If yours is an older `.doc`, the app says
   so and asks you to open it in Word and use **File → Save As** to save it as a
   `.docx` first.

3. **Choose where it should go in your vault.** A folder picker opens; choose the
   textbook folder's `chapters`. The app confirms your choice and says how many
   chapters are already in that folder, which is a quick way to tell you picked
   the right one.

   **It has to be a folder inside the textbook folder.** Because the pictures go
   into the textbook's own `assets/`, the app looks upwards from the folder you
   chose for the top of the textbook — the folder holding `chapters`, `assets`
   and `glossary.md`. If it cannot find one it says so there and then, before any
   converting happens, and asks you to choose a folder inside your textbook.

4. **Name the chapter.** The app fills this in for you from the Word file's own
   name, and you can edit it. This is the name you will see in Obsidian.

   **What the app enforces:** the name must end in `.md` (if you leave it off,
   the app adds it); it must be a plain name, not a path with folders in it; it
   cannot contain `/ \ : * ? " < > |`; no file of that name may already exist in
   that folder; and this chapter's folder under `assets/` must not already hold
   anything. **The app never writes over an existing file and has no undo**, so
   either kind of clash stops the conversion and asks you for a different name.

   **What the app does not enforce — but you should still do.** Name chapters
   `chapter-05`, `chapter-12`: the word `chapter`, a dash, and the two-digit
   number. Nothing in the app checks this, so the responsibility is yours, and it
   matters for three reasons:

   - the chapters already in the book are named this way, and the website builds
     its page addresses out of the file names;
   - links between chapters are written from the name — `[[chapter-04]]` only
     works if the file really is `chapter-04.md`;
   - the picture folder is named after the chapter, so a distinctive chapter name
     is what keeps chapters' pictures apart. Word calls its images `image1`,
     `image2` in *every* document, so two chapters sharing one picture folder
     would overwrite each other's figures. (The app will not let that happen
     silently: if `assets/<chapter-name>/` already has something in it, it stops
     before writing anything and asks you to rename the chapter. An empty folder
     of that name is fine.)

5. **Press "Convert and show me", and read what comes back.** The conversion
   happens in a temporary folder — **nothing is written into your vault at this
   point**. The screen that follows, *Here is what came out*, shows four things:

   - a one-line summary: `Chapter 5.docx became a chapter of 4,312 words,
     18 headings, 2 tables, 9 footnotes, 6 pictures`;
   - **What to check** — the app's notes on this document. Part 3 explains them;
   - **The chapter as it will be saved** — the whole converted text, and the path
     it will be written to;
   - **The pictures** — every picture file that came out, with its kind and size,
     and the name of the folder they will go into.

   This is the moment when a problem is cheapest to fix. If something is wrong,
   press **Go back and change something**, fix the Word document (Part 4), and
   convert again — nothing has been written, so there is nothing to undo.

6. **Confirm and save.** Tick *I have looked at the chapter above and I want to
   save it* — the **Save this chapter** button stays greyed out until you do —
   and press it. The app writes the pictures first and the chapter last, so a
   chapter never ends up in the vault pointing at pictures that failed to copy.
   The screen that follows tells you exactly where the chapter and its pictures
   were written, and reminds you that your Word document has not been touched.

   It then offers **Go through this chapter now** — the app's three linking
   questions (citations, concept-page mentions, glossary terms) run over the new
   chapter straight away. A chapter fresh out of Word has no links in it at all,
   so this is worth doing, but it is not part of the conversion and you can leave
   it for another day.

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

The report is not a table of counts to tick off. It is **a list of notes written
about your document**, under the heading *What to check*, and the app writes only
the ones that apply — a plain chapter with no tables and no maths produces a
short report, and that is the report working correctly.

Each note has a headline, a paragraph explaining what happened and why, and a
**What to check** line telling you what to do about it. Notes come at three
levels, and the level is the thing to read first:

| Level | What it means |
|---|---|
| **ok** | This went as it should. Nothing to do. |
| **look** | It converted, and nothing is lost — but go and look at it, because markdown holds it differently from Word. |
| **warn** | Something is probably wrong. These are the ones to act on before saving. |

Above the notes sits a single summary line — *`Chapter 5.docx` became a chapter of
4,312 words, 18 headings, 2 tables, 9 footnotes, 6 pictures* — which is where the
counts live. Anything that came out as zero is left out of that line, so a
missing count is itself the signal: no "headings" in the summary means no
headings were found.

**What the notes cover.** Roughly in the order they appear:

- **Pictures** — how many came out and the folder they went into; pictures in
  formats nothing can display; pictures the chapter refers to that never
  arrived; pictures written as `<img>` tags rather than markdown (normal, and
  fine in reading view).
- **Tables** — how many converted cleanly into markdown tables, and how many had
  to be written as blocks of web markup instead.
- **Footnotes** — how many came across, and whether any number in the text has no
  note at the bottom, or any note at the bottom has no number pointing to it.
- **Headings** — how many, and at which levels; whether there are several
  top-level headings; whether a level was skipped; and whether any lines look
  like headings that were made by hand rather than styled.
- **Everything else worth a look** — Word bookmarks left as `[]{#something}`;
  underlining and other formatting markdown cannot hold, left as
  `[text]{.underline}`; mathematics; forced line breaks; text boxes and sidebars
  that came out as blocks of web markup; and whether the chapter has a
  **References** section (without one, the citation check has nothing to match
  against).
- **What the converter itself said** — usually nothing. When it does say
  something, the note quotes it verbatim and treats it as a warning, because it
  normally means part of the document was skipped rather than converted.
- **The shape of the chapter** — a confirmation that each paragraph is on a
  single line, which is what keeps your vault's history readable (see Part 2).

There is **no "leftovers" summary**: things that could not be converted are not
gathered into one field. Each surfaces as its own note, and Part 4 lists the ones
that matter.

### The checklist

Then open the textbook folder in **Obsidian**, click the new chapter, and read
it. Tick these off:

- [ ] **No warnings left unread** — every `warn`-level note in the report has
      either been dealt with or consciously accepted.
- [ ] **Headings** — the chapter title and all section headings are there, at the
      right levels. Open Obsidian's outline panel and compare it to Word's
      Navigation Pane: same headings, same order, same nesting.
- [ ] **Footnotes** — the count in the summary line matches the last footnote
      number in Word, the notes are listed at the bottom of the file, and the
      numbers in the text are clickable.
- [ ] **Tables** — each one displays as a proper grid with its header row, not as
      a run-together block of text.
- [ ] **Pictures** — every figure from the Word document shows in the chapter,
      and the files are in this chapter's own folder under `assets/`. Same count
      as Word. None shows as a broken image.
- [ ] **Skim the full chapter once** for anything that looks off — stray symbols,
      a gap where something used to be, a formula that turned to gibberish.

If everything ticks, go to Part 5. If not, Part 4 below.

---

## Part 4 — When something looks wrong

Almost every conversion problem traces back to how the Word document was built,
and the fix is always the same shape: **fix it in Word, then convert again.**
Converting again is cheap and safe — until you tick the box and press *Save this
chapter*, nothing has been written — so never patch problems in the converted
chapter while the Word document still has the flaw. Your patches would be lost
the next time you convert, and the flaw would come back.

Each heading below is the app's own wording, so you can match a note on screen to
the fix for it.

**"N tables could not be made into proper tables"** — a `warn` note. Cause: cells
in the table have been merged, or a single cell holds more than one paragraph.
Markdown tables can do neither, so the table is written out as a block of web
markup instead. None of your text is lost, and Obsidian still shows it as a table
in reading view — but it is unpleasant to edit, and the app's citation and
concept-page checks skip over it entirely, so nothing inside it will ever be
linked. Fix: in Word, unmerge the cells (**Layout → Split Cells**) or rebuild the
table as two or three simple grids, and convert again. If the table is genuinely
complicated, the app's own advice is to leave it and accept that its contents
won't be linked.

**"No headings came across at all"** — a `warn` note, and it also tells you how
many lines in the chapter *look* like headings written by hand. Cause: the
headings in Word were made by making text bigger and bold rather than with Word's
Heading styles, so Word records them as ordinary paragraphs. Fix: in Word, apply
**Heading 1 / 2 / 3** from the Styles gallery (Part 1), save, and convert again.
The app also offers the alternative of typing `#` in front of each heading in
Obsidian afterwards; going back to Word is quicker if there are many.

**"N lines may be headings that did not convert"** — a `look` note, which appears
when *some* headings converted. These are lines standing alone and entirely in
bold, which is what a hand-made heading looks like after conversion — though they
may equally be genuine emphasis. Fix: find them in the preview, and where one
really is a heading, either put the right number of `#` marks in front of it in
Obsidian or restyle it in Word and convert again.

**Footnotes are missing from the report entirely.** There is no note claiming
zero footnotes — if the document plainly has footnotes and no footnote note
appears at all, they were typed by hand rather than inserted with Word's footnote
tool, and have converted to loose text. Fix: in Word, delete the hand-made
version and re-create each note with **References → Insert Footnote**, pasting
the note's text into the footnote area Word creates. Tedious, but only ever
needed once per chapter. Convert again.

**"Some footnotes do not match up"** — a `warn` note, listing footnote numbers in
the text with no note at the bottom, and notes at the bottom nothing points to.
Cause: usually a footnote deleted in Word without its number being removed, or
the other way round. Fix: the app's advice is to find them in the preview and
tidy them up after saving.

**"N pictures came out in a format nothing can display"** — a `warn` note naming
the file types, which will be `.emf`, `.wmf`, `.bin` or `.vml`. This is what
charts, SmartArt diagrams, WordArt and pasted spreadsheet ranges become: Word
draws them itself, so nothing outside Word can show them, and they appear as
broken pictures in Obsidian. Fix: in Word, right-click each chart or diagram,
choose **Copy**, then **Paste Special** as a Picture (PNG), and save. Converting
again then produces a picture that works everywhere.

**"Pictures were mentioned but none came out"** — a `warn` note. The chapter
refers to pictures but no picture files were produced, which happens when the
pictures are linked to files elsewhere on the Mac rather than stored inside the
Word document. Fix: open the Word document and check the pictures show up there;
if they do, copy each one and paste it back in, save, and convert again.

**"Some blocks of the document have no markdown equivalent"** — a `look` note.
Text boxes, sidebars and content controls come across as blocks of web markup
rather than plain paragraphs. Nothing is lost, but they read awkwardly. Fix:
decide whether the text inside should simply become ordinary paragraphs — and if
so, make it ordinary paragraphs in Word and convert again.

**"The converter reported a problem"** — a `warn` note that quotes the
converter's own words verbatim, because they are not written for you. The
converter is usually silent, so when it speaks it nearly always means a part of
the document was skipped rather than converted. Fix: compare the chapter in the
preview against the Word document, looking for anything missing. If the wording
means nothing to you, send it to the technical contact — the note says so itself.

**"The paragraphs may have been broken up"** — a `warn` note, and the one problem
on this list that is not yours to fix. It means the one-paragraph-per-line rule
the whole tool depends on (Part 2) did not hold. Tell the technical contact; the
conversion needs looking at.

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

2. **Add the chapter to the front page — in `templates/index.md`, not
   `index.md`.** Open **`templates/index.md`** and add a bullet under
   **Contents**, copying the shape of the one already there:

       - **[[chapter-05|Chapter 5 — Photosynthesis]]**
         One sentence saying what the chapter covers.

   The front page readers see at `index.md` is *generated* from
   `templates/index.md` by an automatic step that fills in the book's title, web
   address, maintainer and licence. **Anything typed directly into `index.md` is
   wiped the next time that runs.** The same is true of `README.md` and
   `CONTRIBUTING.md`. `docs/editing-the-textbook.md` and
   `docs/changing-settings.md` both cover this; the short version is: edit the
   template, then check at publish time that `index.md` has caught up. If it
   hasn't, the rewrite hasn't run yet — publish the chapter itself and tell the
   technical contact the front page is waiting.

3. **Nothing to sync or commit.** There is no source-control step in this workflow
   and you don't need one — saving the file in Obsidian is all the storing it
   needs. Getting the chapter in front of readers is the publish step, and that
   routine lives in one place: **Publishing** in `docs/editing-the-textbook.md`.
   Read it there if anything below is unclear; the next step is the short version.

4. **Publish to the website.** Click the **Publish** icon in Obsidian's left
   sidebar. Obsidian shows a list of files that are new or changed since the last
   publish — your new chapter, the files in its `assets/<chapter-name>` folder,
   and `index.md`.
   Read the list before confirming: anything ticked will go live, anything
   unticked won't. Click **Publish** and wait; the site updates within a minute
   or two.

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
steps, tick Part 3's list, publish with Part 5. For a chapter written the way
Part 1 describes, the whole thing takes a few minutes end to end.
