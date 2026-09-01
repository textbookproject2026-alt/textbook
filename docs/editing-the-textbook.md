# Editing the textbook

This is the day-to-day guide for you, Brandon. Everything in it happens in two
places: **Obsidian**, on your own Mac, and **a web browser**, to look at the
result. There is no terminal here, no GitHub, and nothing to install.

That is not a simplification. The textbook has a lot of machinery around it —
automated jobs, a repository, a review queue — but none of it is yours to
operate. Where a step is handled for you, this guide says so, so you are never
left wondering what you've forgotten. The last section is entirely about things
that change the vault without you touching it.

---

## Opening the vault

The whole textbook is one folder on your Mac. Obsidian calls a folder it has
opened a **vault**, and it opens folders rather than individual files.

The first time:

1. Open Obsidian.
2. Click **Open folder as vault**.
3. Choose the textbook folder — the one that contains `chapters`, `assets` and
   `docs`.
4. Obsidian asks whether you trust the folder. Say yes; it is your own book.

[SCREENSHOT: Obsidian's vault picker window with "Open folder as vault" highlighted]

After that, Obsidian reopens this vault on its own every time you launch it. The
icon at the very bottom of the narrow left-hand strip switches between vaults if
you ever have more than one.

Don't rename or move the textbook folder in Finder while Obsidian has it open.
If the vault ever does go missing from Obsidian, the folder itself is fine —
just open it as a vault again.

---

## How the vault is organised

Everything you write lives in one of the first four rows. The rest is machinery
that runs itself.

| Where | What it holds |
|---|---|
| `chapters/` | The book. One file per chapter: `chapter-03.md`, and later `chapter-04.md`, `chapter-05.md`. |
| `chapters/Definitions/` | The concept pages — one short, standalone page per idea, named for the idea itself (`Critical Realism.md`, `Emergence.md`). These are what a reader sees pop up when they hover a linked term inside a chapter. |
| `assets/` | Every image in the book, in one subfolder per chapter: `assets/chapter-05/`. |
| `glossary.md` | The list of terms with the chapter each was first used in. |
| `docs/` | These handover guides, including this one. |
| `templates/` | The source of the front page. See *Adding a new chapter*. |
| `index.md` | The front page as published. **Written automatically — do not edit it.** |
| `community/` | Three pages the weekly jobs write: contributors, department editions, project health. Don't edit them by hand; they get overwritten. |
| `publish.css`, `publish.js` | How the site looks and the extra things it does. Don't edit — but they matter at publish time, see below. |
| `backups/`, `scripts/`, `.github/`, `admin/` | Machinery. Ignore entirely. |

[SCREENSHOT: the Obsidian file explorer expanded to show chapters/, chapters/Definitions/, assets/, docs/, templates/ and index.md]

**Chapter file names are load-bearing.** The word `chapter`, a dash, two digits,
`.md` — `chapter-04.md`, `chapter-12.md`. The website builds its addresses from
those names and chapters link to each other by them; concept pages keep their
prose names, capitals and all. Renaming a file breaks every link pointing at it,
so if a page needs a new name, ask Alec rather than renaming it yourself.

---

## Writing and editing a chapter

Click a chapter in the left-hand file list and type into it. There is no Save
button and no save shortcut you need — Obsidian writes every keystroke to disk
as you go, and nothing you type reaches a reader until you publish.

Two things are worth keeping in view. **The outline panel** (right sidebar)
shows your heading structure live — if a section is missing from it, its heading
isn't a real heading. **Reading view** (the book/pencil toggle, top right) shows
the page roughly as a reader will see it, which is how you check that a callout
box or a link is actually working rather than sitting there as raw text.

Paragraphs in the converted chapters each sit on a single very long line. That
looks odd but it is deliberate — it is what lets the change history show exactly
which words moved when a sentence is edited. Type your new sentences the same
way, and don't press Return in the middle of a paragraph to "tidy" the line
lengths.

**Images.** Drag the file straight into the text where you want it. Put it in
the chapter's own folder under `assets/` and give it a real name —
`stratification-diagram.png`, not `Screenshot 2026-08-19 at 14.32.png`.

**Nothing you type is ever the only copy.** Obsidian keeps timed snapshots of
every file (**Settings → File recovery**), and every version of every chapter is
stored off your machine automatically. Deleting three paragraphs and wanting them
back tomorrow is a recoverable situation, not a lost one.

---

## The markdown you'll actually meet

The chapters are plain text with a handful of marks that mean something — five
kinds, each with one characteristic way of breaking.

**Headings — `#`.** One `#` for the chapter title, at the very top and used
exactly once. Two `##` for sections, three `###` for subsections. The hashes
need a space after them and must be the first thing on the line. *Breaks when:*
you make a heading by bolding a line instead. It looks right and is invisible to
the outline panel and to the website's navigation.

**Bold and italic — `**bold**` and `*italic*`.** *Breaks when:* a stray asterisk
is left behind after an edit, which turns a run of the following text bold until
the next asterisk turns up.

**Concept links — `[[double square brackets]]`.** `[[Retroduction]]` links to
the concept page of that name and gives readers a hover preview. The text inside
the brackets must match the page's file name exactly, capitals included:
`[[retroduction]]` and `[[Retroductions]]` are broken links. To make the
sentence read differently from the page name, put the display text after a
vertical bar: `[[Retroduction|the retroductive move]]` — page name first,
what the reader sees second. Chapter-to-chapter links use the file name without
`.md`: `[[chapter-04|the light reactions]]`. *Breaks when:* the name inside the
brackets is retyped from memory rather than copied. Obsidian offers a
completion list as soon as you type `[[` — use it and it is always right.

**Callouts — `> [!abstract]`.** The boxed panels, like the "Key concepts in this
chapter" box at the top of chapter 3. The first line is `> [!abstract] Title`,
and **every line after it, blank-looking ones included, must start with `>`**.
The types in use are `abstract`, `tip` and `info`. *Breaks when:* you add a
paragraph inside the box and forget the `>` — the box ends early and the rest
spills out as ordinary text.

**Footnotes and citations.** Two different things live in the chapters:

- Footnotes converted from your Word documents appear as `[^1]` in the text with
  a matching `[^1]: the note text` at the bottom of the file. The number is just
  a label — the two halves have to match, and that is all.
- Chapter 3's references work differently. A citation in the text is a link like
  `[Bhaskar, 1979](#^ref-bhaskar-1979)`, and the matching reference at the bottom
  ends with `^ref-bhaskar-1979`. The two strings must be identical. *Breaks
  when:* that marker is deleted while tidying the bibliography — the citation
  still looks like a link but lands nowhere.

**Blank lines separate paragraphs.** One is enough; more do nothing extra. A
heading, a list or a callout needs a blank line above it or it gets swallowed
into the paragraph before.

If you meet a mark you don't recognise, leave it alone and mention it to Alec.

---

## Adding a new chapter

1. **Create the file.** Right-click `chapters/` → **New note** and name it
   `chapter-05` (Obsidian adds the `.md`). If the chapter started in Word,
   convert it instead — `docs/word-to-markdown.md` puts the file here for you.
2. **Start it with its title as a heading:** `# Chapter 5: Photosynthesis`, with
   nothing above it. Chapters carry no settings block at the top; `chapter-03.md`
   opens straight on its title and yours should too.
3. **Put its images in `assets/chapter-05/`** — a fresh folder per chapter,
   always. Word names images `image1`, `image2` in every document, so chapters
   sharing a folder would overwrite each other's figures.
4. **Link it from the front page.** Open **`templates/index.md`** and add a
   bullet under **Contents**, copying the shape of the one already there:

       - **[[chapter-05|Chapter 5 — Photosynthesis]]**
         One sentence saying what the chapter covers.

5. Publish (next section).

[SCREENSHOT: templates/index.md open in Obsidian, with the Contents list and one chapter bullet selected]

**Why `templates/index.md` and not `index.md`.** The front page you see at
`index.md` is *generated*. An automatic step takes `templates/index.md`, fills in
the book's title, web address, maintainer and licence, and writes the result into
`index.md`. Anything you type directly into `index.md` is wiped the next time
that runs. The same is true of `README.md` and `CONTRIBUTING.md`.

That regeneration happens away from your Mac, and the finished `index.md` then
arrives in your vault on its own. In practice: edit `templates/index.md`, and
when you open the Publish dialog check that the new chapter's line is in
`index.md` too. If it isn't there yet, the rewrite hasn't run — publish the
chapter itself and tell Alec the front page is waiting. That is the one routine
step in this guide that isn't yours to run.

---

## Publishing

Publishing is the only action that changes what readers see. Everything else —
typing, saving, images landing in folders — is storage.

1. Click the **Publish** icon in the narrow left-hand strip.
2. Obsidian compares your vault against the live site and lists what is **new**,
   **changed** and **removed**, each with a tick box.
3. **Read the list before confirming.** Anything ticked goes live; anything
   unticked stays exactly as it is on the site. Unticking something does not
   delete anything — it just leaves that file out of this publish.
4. Click **Publish** and wait. The site updates within a minute or two.

[SCREENSHOT: the Obsidian Publish dialog listing changed files with their tick boxes and the Publish button]

A new chapter typically shows up as four kinds of entry: the chapter file, its
images under `assets/chapter-05/`, `index.md`, and any concept page you linked
to. If something you expected is missing, Obsidian thinks it hasn't changed —
check you edited the file you meant to.

**`publish.css` and `publish.js` reach the live site only through this dialog.**
Those two files control how the book looks and the extra things its pages do —
the annotation sidebar, the annotation count badge, the *Suggest an edit* button.
They are stored and backed up like everything else, but storage doesn't publish
them. If the site's appearance or one of those buttons changes and the change
doesn't show up, the answer is nearly always that the file was saved but never
ticked in the Publish list.

---

## Checking the live site

Open **https://bptext2026.xyz** and give it two minutes:

- The front page lists the new chapter, and the link opens it.
- The headings are there and nested the way the outline panel showed them.
- The images are all present, the right way up, in the right places.
- A concept link (`[[Critical Realism]]`) shows a preview on hover and opens
  the concept page on click.
- Under the chapter title there is a row reading **Edit on GitHub · View
  revision history · Suggest an edit**, plus a small badge saying either
  *"Annotate this page"* or *"N annotations"*.

If the page looks stale, force a fresh copy with **⌘ + Shift + R**.

[SCREENSHOT: a published chapter page showing the controls row and annotation badge under the title]

---

## When something looks wrong

| What you see | Almost always | What to do |
|---|---|---|
| The change isn't on the site | It wasn't ticked in the Publish dialog | Publish again and read the list |
| The site looks unstyled, or a button vanished | `publish.css` / `publish.js` weren't ticked | Publish again with them ticked |
| A `[[link]]` shows as plain bracketed text | The name inside doesn't match a page exactly | Retype it using Obsidian's `[[` completion list |
| A callout box ends halfway | A line inside it lost its `>` | Put the `>` back on every line of the box |
| A section is missing from the outline | Its heading is bold text, not a `#` heading | Replace the bolding with the right number of hashes |
| The front page didn't change | You edited `index.md` instead of `templates/index.md`, or the rewrite hasn't run yet | Move the edit to the template; tell Alec if the template is right and `index.md` still hasn't caught up |
| A file you didn't touch has changed | One of the automatic jobs, or a contributor's edit | Nothing — see the next section |
| Anything else | Configuration | Alec. Say what you were doing and roughly when |

Nothing on this list is damage: the site can always be republished from your
vault, and every past version of every file is kept.

---

## What happens around you

The vault is not only yours. Files will change that you didn't change. None of
it needs anything from you — this section exists so that a file with yesterday's
date on it never makes you wonder what you missed.

**Contributors' edits arrive as finished text.** Anyone can propose a change to
a chapter, and proposals are reviewed before they go anywhere near your vault —
by the time an edit shows up in Obsidian it has been checked and accepted.
Deciding whether a change is *right for the book* is yours; getting it into the
vault is not.

**The suggest-edit form files reader corrections.** Every page carries a
**Suggest an edit** button. A reader describes what's wrong — no account, no
login — and the suggestion goes into a review queue, not into the book. It
reaches you as a decision: fix it, or don't. Everything around that decision is
handled for you, and the running count sits on the project health page in
`community/`. `docs/moderating-comments.md` covers what to do with each one.

**Trusted contributors write in a browser editor.** A few people can edit
chapters in a web page instead of Obsidian. What they write goes into a holding
area — no button in that editor reaches the live site. You read their text and
decide whether it belongs in the book; moving it out of the holding area is the
maintainer's step, not yours.

**Four automated jobs run every Sunday, unattended.** They back up the reader
annotations and rewrite three pages under `community/`: the contributors list,
the department editions list, and the project health dashboard. That is why
`community/` files change on their own. Nobody starts them and nobody needs to
check them weekly — `docs/scheduled-actions-health-check.md` is there for
whoever does look.

**The front page and the README rewrite themselves** whenever the book's title,
address, maintainer or licence changes, or whenever `templates/` is edited. That
is the mechanism described under *Adding a new chapter*.

If a file changed and it wasn't you, it was one of these five, and the right
response is to carry on writing.
