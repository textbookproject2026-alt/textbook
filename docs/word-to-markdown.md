# Turning a Word chapter into a textbook chapter

This guide is for you, Brandon — no technical background needed. It walks you through converting a chapter you've written in Word into the format the textbook website uses, checking that nothing got lost, and publishing it.

You'll copy and paste a few commands into an app called Terminal. You never need to *write* commands — only paste the ones in this guide. Everything here works the same way every time.

The guide has six parts:

1. **Write it right in Word** — habits that make conversion painless (read this before writing)
2. **One-time setup** — installing the conversion tool (you only ever do this once)
3. **Converting a chapter** — the command you run each time
4. **Check it worked** — a tick-box list per chapter
5. **When something looks wrong** — the three most common problems and their fixes
6. **Getting it into the textbook** — from converted file to live website

---

## Part 1 — Write it right in Word

Ten minutes of good habits in Word saves an hour of cleanup later. The converter is literal-minded: it reads the *structure* Word records behind the scenes, not what the page looks like. Two headings can look identical on screen but be completely different underneath — and only one of them converts.

**Use real heading styles.** When you start a new section, don't make the text big and bold by hand. Instead, click on the line and choose a style from the **Styles** gallery on Word's Home ribbon:

- **Heading 1** — the chapter title (use exactly once, at the top)
- **Heading 2** — main sections
- **Heading 3** — subsections

[SCREENSHOT: Word's Home ribbon with the Styles gallery, Heading 1/2/3 highlighted]

A quick way to check yourself: open Word's **View → Navigation Pane** (called the sidebar or document map). If all your headings appear there, in the right order and nesting, you're set. If a heading is missing from that pane, the converter won't see it either.

**Use Word's footnote tool.** For footnotes, go to **References → Insert Footnote**. Word numbers it, formats it, and keeps it attached to the right sentence. Never type a superscript number yourself and add a numbered list at the end of the document — that *looks* like footnotes but converts to loose text.

[SCREENSHOT: References ribbon with Insert Footnote highlighted]

**Keep tables simple.** Tables convert well when they're a plain grid: one header row at the top, then rows of cells, with nothing merged or split. If you're tempted to merge cells to make a complicated layout, break it into two smaller tables instead — it will also read better on phones.

**Insert pictures the plain way.** Use **Insert → Picture** and place the image on its own line, "In Line with Text" (Word's default). Avoid text boxes, SmartArt, WordArt, and shapes drawn in Word — none of these survive conversion.

**Before converting, tidy up:**

- If you had Track Changes on, accept all changes (**Review → Accept → Accept All Changes**) and turn tracking off. The converter otherwise sees both the old and new text.
- Delete any leftover comments (**Review → Delete All Comments**).
- Avoid multi-column layouts, headers/footers with content in them, and manual page numbers — the website handles layout and navigation itself.

---

## Part 2 — One-time setup

You'll install two things: **Homebrew** (an installer for tools like this) and **pandoc** (the actual converter). This takes 10–20 minutes, mostly waiting. You only ever do it once per computer.

### Step 1 — Open Terminal

Press **⌘ + Space**, type `terminal`, press **Return**. A plain window opens with a blinking cursor. That's it — this is just a place to paste commands.

[SCREENSHOT: Spotlight search showing Terminal, and the empty Terminal window]

### Step 2 — Install Homebrew

Copy this entire line, paste it into Terminal, and press **Return**:

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Three things will happen, all normal:

- It asks for your **Mac login password**. Type it and press Return. **Nothing appears while you type** — no dots, no stars. That's a security feature, not a freeze. Type it blind and press Return.
- It may say it needs to install "Command Line Tools" and sit there for a while. Let it. This can take 10+ minutes.
- At the end it may print a short **"Next steps"** section containing two commands. If it does, copy those two lines exactly as printed, paste them into Terminal, and press Return. Then quit Terminal (⌘Q) and open it again.

**What success looks like:** paste this and press Return:

```
brew --version
```

You should see something like `Homebrew 4.x.x`. If you see `command not found: brew`, the "Next steps" commands from the installer were missed — scroll up in the Terminal window, find them, and run them.

[SCREENSHOT: Terminal showing brew --version output]

### Step 3 — Install pandoc

Paste this and press Return:

```
brew install pandoc
```

Wait for the text to stop scrolling and the cursor to come back. Then check:

```
pandoc --version
```

**What success looks like:** the first line says something like `pandoc 3.x`. You're done with setup, forever.

---

## Part 3 — Converting a chapter

### Where things live

- **Your Word files** stay wherever you like — for example a folder called `Word chapters` in your Documents. They do **not** go inside the textbook folder; the textbook folder holds only the converted versions.
- **The textbook folder** is the folder you open in Obsidian (the one containing `chapters` and `assets`). The conversion puts its output there:
  - the chapter text goes into `chapters`
  - the images go into `assets`, in a subfolder named after the chapter

### The command, step by step

**1. Point Terminal at the textbook folder.** Type `cd ` (c, d, then one space — don't press Return yet), then **drag the textbook folder from Finder onto the Terminal window**. Its full location appears automatically. Now press **Return**.

[SCREENSHOT: dragging the textbook folder onto the Terminal window after typing "cd "]

You do this once each time you open Terminal, before converting.

**2. Run the conversion.** The command is always the same shape:

```
pandoc "YOUR-WORD-FILE" -t gfm --wrap=none --extract-media=assets/chapter-NN -o chapters/chapter-NN.md
```

You change two things each time: the Word file, and the chapter number (both places `NN` appears).

### A real worked example

Say you've written **Chapter 5, "Photosynthesis"**, saved as `Chapter_05_Photosynthesis.docx` in your `Word chapters` folder. In Terminal (after the `cd` step above), type `pandoc ` then a quote character `"`, drag the Word file from Finder onto the Terminal window, type the closing quote `"`, then type the rest:

```
pandoc "/Users/brandon/Documents/Word chapters/Chapter_05_Photosynthesis.docx" -t gfm --wrap=none --extract-media=assets/chapter-05 -o chapters/chapter-05.md
```

(Your file's location will look different — dragging the file in fills it in correctly, so you never type it by hand.)

Press **Return**.

**What success looks like: nothing.** The command prints no message and the cursor comes back on an empty line. Silence means it worked. If something went wrong, you'll see an error message instead — usually "openBinaryFile: does not exist", which means the file location has a typo; re-do it with drag-and-drop.

Afterwards you'll find:

- `chapters/chapter-05.md` — the converted chapter
- `assets/chapter-05/media/image1.png`, `image2.png`, … — the chapter's images

**Naming rules for the output file:** the word `chapter`, a dash, the two-digit chapter number, ending in `.md`. So: `chapter-05.md`, `chapter-12.md`. This matches `chapter-03.md`, the chapter already in the textbook, and the website uses these names in its links.

**Always use a fresh chapter folder for the images** (`assets/chapter-05` for chapter 5, `assets/chapter-06` for chapter 6). Word names images `image1`, `image2`, … inside every document — if two chapters shared one folder, the second chapter's pictures would silently overwrite the first's.

### Why `--wrap=none` is in the command — please don't remove it

It keeps each paragraph on one long line in the file, which is what lets the website's history show *exactly which words* changed when someone edits a sentence — without it, changing one word lights up the whole paragraph as changed, and nobody can review edits anymore. The line looks odd if you ever open the raw file, but it's deliberate.

### Cross-references to other chapters

A reference such as "see Chapter 4" converts as ordinary prose and can stay exactly as it is; if you'd rather it were a clickable link, write it as `[[chapter-04|the light reactions]]` — the part before the `|` is the target chapter's file name without `.md`, and the part after is the text readers see.

---

## Part 4 — Check it worked

Open the textbook folder in **Obsidian** and click the new chapter. Reading it there, tick these off:

- [ ] **The chapter title and all section headings are there**, at the right sizes. Open Obsidian's outline panel and compare it to Word's Navigation Pane — same headings, same order, same nesting.
- [ ] **Footnotes are intact.** Note the number of the last footnote in the Word document; the converted chapter should have the same count, with the notes listed at the bottom of the file and clickable numbers in the text.
- [ ] **Tables survived.** Each table displays as a proper grid with its header row — not as a run-together block of text.
- [ ] **Images landed.** Every figure from the Word document shows in the chapter, and the files are in `assets/chapter-NN` for this chapter. Same count as in Word.
- [ ] **Skim the full chapter once** for anything that looks off — stray symbols, text that was in a text box in Word and is now missing, a formula that turned to gibberish.

If everything ticks, go to Part 6. If not, Part 5 below.

---

## Part 5 — When something looks wrong

Almost every conversion problem traces back to how the Word document was built, and the fix is always the same shape: **fix it in Word, then run the conversion command again.** Re-running is cheap and safe — it simply replaces the output file, so never patch problems in the converted file while the Word document still has the flaw (your patches would be lost on the next conversion, and the flaw would come back).

**A table came out scrambled** — text run together, columns misaligned, rows missing. Cause: merged or split cells. Fix: in Word, click the table, look for merged cells (one cell spanning several columns or rows). Unmerge them (**Layout → Split Cells**) or rebuild that table as two or three simple grids. Re-run the command.

**Headings are missing** — sections that were clearly headed in Word show up as ordinary bold text, and the chapter's outline in Obsidian is empty or patchy. Cause: the headings were made by hand (bold + bigger font) instead of with Word's Heading styles. Fix: in Word, click each heading line and apply **Heading 1/2/3** from the Styles gallery (see Part 1). The text won't visibly change much, but the structure will now be recorded. Re-run.

**Footnotes turned into plain text** — the notes appear as a numbered list mid-document or the numbers in the text aren't clickable. Cause: the footnotes were typed by hand rather than inserted with Word's footnote tool. Fix: in Word, delete the hand-made version and re-create each note with **References → Insert Footnote** (paste the note's text into the footnote area Word creates). Tedious, but only ever needed once per chapter. Re-run.

If you hit something not on this list, don't sink time into it — save the Word file and the converted file side by side and note what looks wrong. The difference between the two files usually makes the cause obvious to whoever looks next.

---

## Part 6 — Getting it into the textbook

Once the checklist passes:

1. **Check the top of the file.** The chapter should begin with its title as a Heading 1 (`# Chapter 5: Photosynthesis`) and nothing above it. Chapters in this textbook carry no front-matter block — `chapter-03.md` starts straight in with its title, and yours should too. If pandoc left a stray blank line or a duplicate title at the very top, delete it.
2. **Add the chapter to the front page.** Open `index.md` (the textbook's table of contents) and add a line for the new chapter, written the same way as the existing entries.
3. **Sync your work to GitHub.** In Obsidian's left sidebar, click the **Git** icon (the source-control panel). Type a short description of what you did into the message box — `Add chapter 5` is plenty — and click **commit-and-sync**. This saves a snapshot of your changes and sends it to GitHub. It is your backup and your history; it does **not** put anything on the website.

4. **Publish to the website.** Click the **Publish** icon in the left sidebar. Obsidian shows a list of files that are new or changed since the last publish — your new chapter, its images in `assets/chapter-NN`, and `index.md`. Read the list before confirming: anything ticked will go live, anything unticked won't. Click **Publish** and wait; the site updates within a minute or two.

   **The two steps are separate, and only the second one reaches readers.** commit-and-sync sends files to GitHub; the Publish dialog sends them to the live site. A chapter that's been synced but not published is safely stored and invisible to the world.

   This matters most for the site's two design files, **`publish.css`** and **`publish.js`**, which sit at the top level of the textbook folder. They reach the live site *only* through the Publish dialog — pushing them to GitHub does nothing for the website. If you (or anyone) change how the site looks and the change doesn't show up, this is nearly always why: the file was synced but never ticked in the Publish list.

<!-- TO RECONCILE (Weeks 8–9 handover): steps 3–4 above duplicate the sync-and-publish
     routine that docs/editing-the-textbook.md will own once written. When that doc
     exists, decide whether to keep this inline copy or replace it with a pointer —
     but do not leave both to drift. The publish.css / publish.js caveat must survive
     in whichever version remains. The same applies to docs/troubleshooting.md and the
     end of Part 5. -->

5. **Check the live site.** Open the website, find the new chapter from the front page, and give it one last skim — especially the images and tables.

That's the whole cycle: write in Word with Part 1's habits, convert with Part 3's command, tick Part 4's list, publish with Part 6. After the one-time setup, a clean chapter takes a few minutes end to end.
