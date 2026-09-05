# The authoring app

This guide is for you, the book's author. It covers the **Authoring Assistant** —
the small Mac app that tidies the links in your chapters, helps you build the
glossary, brings chapters in from Word, and shows you what other people have sent
in.

There is no terminal here and nothing to type. Installing it is dragging one icon
into your Applications folder, and after that the app shows you every change before
it makes one — nothing it does is hidden from you.

The guide has two halves, because the app has two:

- **Chapters** — the three questions it asks about a chapter you are working on.
- **Waiting for you** — reader suggestions, contributors' draft changes, and the
  one button that takes accepted work to readers.

---

## What it is, and where it comes from

**Authoring Assistant** is an ordinary Mac application, written for this book and
this book only. It is not something you can buy or download from an app store: the
technical contact builds it and sends you a disk image, and that is the only way
you ever get it or update it.

- It runs **entirely on your own Mac**. The chapter analysis needs no internet at
  all.
- It is **signed and notarised by Apple**, so it opens like any other app — no
  "unidentified developer" warning, no right-click-to-open trick.
- Its source lives in a repository called `authoring-assistant`, alongside the
  book's own. See `docs/INFRASTRUCTURE.md` for where that sits among everything
  else, and `docs/the-authoring-app-operations.md` for the technical contact's
  half.

### Installing and opening it

1. Open the disk image you were sent.
2. Drag **Authoring Assistant** onto **Applications**.
3. Double-click it in Applications. Drag it to your Dock if you want it to hand.

**Your web browser opens, and that is where you use it.** Nothing else appears on
screen — no window of its own, no black terminal, no bouncing icon. Closing the
browser tab, or pressing **Quit** in the top corner, stops it.

Double-clicking the icon while it is already running brings the page back rather
than starting a second copy.

**To update it** you are sent a new disk image and drag it over the old one. There
is no *Check for updates*.

### Two habits worth having

**Save and close the chapter in Obsidian first.** If a chapter is open in Obsidian
with unsaved edits, those edits are not on disk yet and the app cannot see them.
Press **Command-S** and close the tab before you start. The app watches for this:
if a file changes on disk while you are answering questions, it **refuses to save**
and tells you to start again, rather than overwriting what Obsidian wrote.

**There is no undo.** When you press save, the chapter is rewritten and the old
version is gone from your Mac. The app says so before you press, and you have to
tick a box. Every version is kept in the book's history, so nothing is ever truly
lost — but getting a version back is the technical contact's job, not a keystroke.

---

## Chapters: the three questions

Choose **Chapters**, then a single chapter, or your whole vault folder and pick a
chapter from the list. The app then asks you three kinds of question, one at a
time, with a counter at the top — *12 of 40*.

Every question shows you the sentence it found, with the proposed change
highlighted, and offers four answers:

- **Yes, make this change**
- **No, leave it alone**
- **Yes to every mention** of that term or citation
- **No to every mention** of it

At the end you are shown exactly what will change — the changed lines side by
side, and the whole chapter as it will be. You tick a box and press **Save these
changes**.

**It never reformats anything.** Only the exact lines being changed are rewritten.
Every other line is copied through character for character: no re-wrapping, no
tidied spacing, no reordering. Accept twelve changes across nine lines and exactly
nine lines change.

**Running it again is safe and quiet.** It skips citations already linked, concept
pages already linked, and terms already in the glossary — and tells you what it
skipped and why. A second run on the same chapter normally finds nothing to do.

### 1. Citations to the reference list

It finds citations in your running text — `(Bhaskar, 1975)`, or `Bhaskar (1975)` —
looks for a matching entry in **that chapter's own References section**, and offers
to turn the citation into a link that jumps straight down to the entry.

It only ever offers a citation when it has found the matching entry. A citation
with no entry is never invented and never guessed at: it is listed back to you at
the end as something to check, which is usually how you discover an entry missing
from your reference list.

### 2. Terms to concept pages

It finds places where a chapter mentions the title of one of your concept pages —
the short standalone pages in `chapters/Definitions/` — and offers to turn the
mention into a link to that page. Those links are what a reader sees pop up when
they hover a term.

It leaves alone anything in a heading, in a code block, in the reference list, or
already linked. It also reads a concept page's `aliases`, so a page can be found
under more than one wording.

If it says it found no concept pages, you almost certainly opened a single chapter
rather than the whole vault folder — it needs the vault to see the `Definitions`
folder.

### 3. Glossary terms

It looks for terms worth defining, using three ordinary signals:

- terms you introduce with a defining phrase — *"X is defined as"*, *"by X we
  mean"*, *"the term 'X'"*;
- terms you put in **bold** the first time you use them;
- capitalised terms of more than one word that come up more than once.

For each one it proposes the sentence that introduces it as the definition. Terms
already in the glossary are never offered again.

---

## `glossary.md` is written by the app

**This is the one thing in this guide to remember.** `glossary.md` at the top of
the vault is not a hand-kept file. Every term you approve in the third question is
written into it by the app, and that is the normal way entries get there.

What it does, exactly:

- Each approved term becomes a `## Term` heading with its definition underneath,
  followed by *(First used in chapter-05.md.)*
- New entries are **spliced into alphabetical position** among the ones already
  there. Every existing line is copied through untouched.
- A term already in the file — matched on the heading, ignoring capitals — is
  never added twice and never rewritten. The app leaves your wording alone.
- You see the whole before-and-after of `glossary.md` on the confirmation screen,
  the same as for a chapter, before anything is written.

**So you can safely edit a definition by hand** — reword it, expand it, correct it
— and the app will not undo your edit. What is *not* safe is reorganising the file
in a way that stops it looking like a list of `##` headings in alphabetical order:
grouping terms under sections, renumbering them, or turning the headings into bold
text. Do that and new entries land in the wrong place, and terms the app thinks are
missing get added again underneath your renamed ones.

If you want the glossary structured differently, say so to the technical contact
rather than restructuring it yourself.

---

## Bringing in a Word chapter

The app also converts a Word document into a chapter in your vault: press **A Word
document** on the opening screen. It never changes or moves your Word file.

That is a guide in its own right, and it is
**[`docs/word-to-markdown.md`](word-to-markdown.md)** — how to write in Word so it
converts cleanly, what the app asks for and in what order, how to read its report,
what to do when something looks wrong, and how to get the finished chapter onto the
website. Read it there; it is not repeated here.

Two things worth knowing from this side:

- The chapter's pictures go into the vault's own `assets/`, in a folder named
  after the chapter — the same convention as everything else in the book (see
  *How the vault is organised* in `docs/editing-the-textbook.md`).
- A chapter fresh out of Word has no links in it at all, so the app offers to go
  straight through it with the same three questions. You can say "not now" and do
  it another day.

---

## Waiting for you

The second place in the app, beside **Chapters** at the top of the window, is
**Waiting for you**. It exists so that you never have to visit a website to deal
with what other people have sent in.

Everything in this half needs the internet. If you are offline it says so plainly,
and **nothing can be accepted, declined or published** until you are back.
Everything under Chapters keeps working as normal.

### Signing in, once

The first time, press **Sign in**. The app shows you a short code and opens a web
page; you type the code in and approve it. That is the whole of it, and you should
not have to do it again on this Mac.

You are signing in **as yourself**. Everything you accept or decline is recorded
under your own name, and the replies described below are posted under your name
too — not a robot's. You can withdraw the app's access at any time from your
GitHub account settings. Your sign-in is kept in this Mac's Keychain, not in a file
and never in your vault.

If it shows a **One-off setup** card instead of a Sign in button, the technical
contact has not yet given you the sign-in identifier. There is nothing you can do
until they have; it is a one-off, once per Mac.

**When sign-in goes wrong**, every message you might see — the expired code, the
page that never opened, the unrecognised identifier, the refused Keychain prompt,
the list that stays empty — is triaged in
**[`docs/troubleshooting.md`](troubleshooting.md)**, under *The author's console
won't sign in, or shows nothing waiting*. Go there rather than guessing; it lists
the exact wording of each message and says which ones are yours and which are the
technical contact's.

### Suggestions from readers

These come from the **Suggest an edit** button on the website. A reader describes
what they think is wrong; they need no account, so most come from ordinary readers.

Open one and you see who sent it, which page it is about, and what they said.
Then:

- **Accept** — you are taking it on. A thank-you is posted as a reply, the
  suggestion is marked as dealt with, and it disappears from the list.
- **Decline, politely** — a courteous reply is posted saying the text is staying
  as it is, and the suggestion is closed. This is a perfectly good outcome; an
  answered "no" is far better than silence.
- **Open in my browser** — for anything unusual.

**The replies are posted publicly, under your own name.** Both are written for
you — you do not compose them — and both end with a line saying they were sent
from the author's console, so a reader can see it was a considered reply rather
than a robot. Anyone can read them on the book's repository.

**"Accept" does not mean the app rewrites the chapter.** Most suggestions are
prose — *"this paragraph contradicts chapter 2"* — and no machine can carry that
out. The app says so plainly and leaves the change to you, under Chapters, with
the suggestion in front of you.

The one exception is a reader who writes an exact replacement — *"the the domains"
should be "the three domains"*. If that old wording appears in the chapter
**exactly once**, the app offers to make the change itself: it shows you the line
as it is and as it will be, you tick a box, and only that one line changes. If the
wording appears twice, or has gone already, it says so and leaves it to you rather
than guessing which one you meant.

For that to work it needs to know where your chapters are — there is a **Choose my
chapters folder** button at the bottom of the list.

### Draft changes

These are written by trusted contributors in the browser editor. **Nothing here
has reached readers**; contributors have no way to publish, and everything they
write waits for you.

Open one and you see, in plain before/after form, the wording they propose to
change. Then:

- **Accept this change** — it is folded into the drafts area, and put in line for
  the live book. It has still reached no reader.
- **Decline it** — it is closed.
- **Open in my browser** — offered automatically when a change is too big to read
  comfortably here, rather than printing a wall of text at you.

Deciding whether a change is right for the book is yours. Everything around that
decision is handled for you.

### Going live

Underneath the two lists is **Going live**: everything you have accepted, gathered
in one place, waiting to go to readers.

The drafts area is **shared** — anything written in the browser editor is in there
too — so what you see here is all of it together, whoever wrote it, and all of it
is what goes. Open it and you are shown how many changes there are, which pages
they touch and who wrote them. Tick the box and press **Publish to the live book**.

Four things are worth knowing.

**The app never publishes on its own.** Accepting puts a change in line and stops
there. Nothing reaches a reader until you press that button — because what would
go includes other people's work as well as the change you just accepted, and you
should see it before it goes.

**Sometimes it will not let you.** If the same wording has been changed both in
the drafts area and in the live book — usually because you also edited that line
in Obsidian — it says so and refuses to choose between them. Nothing is lost and
nothing is undone. It also tells you when it is simply still working out whether
the change can go, or waiting on the book's own checks, and says so in those words
rather than pretending everything is fine.

**The site takes a few minutes to catch up.** It rebuilds itself after you
publish; readers see the change once it has.

**Your vault will be behind afterwards.** Publishing writes to the live book, and
your Obsidian vault does not know about it. Your copy and the live book now
disagree, and the next thing you write in that file is where it bites.
**How your vault gets the latest is not yet written down** — it is one of the open
items in `docs/DOCS-REMEDIATION.md` (3.2). Until it is, ask the technical contact
to bring your vault up to date after you publish from here, rather than carrying
on and hoping.

### The weekly jobs

Underneath is a line for each of the four jobs that run themselves every Sunday —
backing up reader comments, and rebuilding the contributors, department editions
and project health pages — saying whether each last finished properly.

There is nothing for you to do here. If one says it did not finish, tell the
technical contact; `docs/scheduled-actions-health-check.md` is the guide they will
use.

### Elsewhere

Two links out at the bottom, both read-only and both opening in your browser:
**Reader discussion**, every comment left in the margins of the book on one page,
and **History**, what changed, when and by whom, plus each year's published
edition.

---

## Settings

There is a **Settings** link in the top corner. There is nothing in it you have to
change, and it holds exactly two things.

**The sign-in identifier** for *Waiting for you*. The technical contact gives you
this once, per Mac. It is not a password and not a secret.

**A DeepSeek key**, which is entirely optional. If you have an account with
DeepSeek — an AI service — you can paste your key here, and a tick box then appears
when you start a chapter: *Also ask DeepSeek for glossary suggestions*. Ticked, the
app sends **the text of that chapter** to DeepSeek and adds whatever extra glossary
terms it suggests to the ones the ordinary checks found. You approve or reject each
one exactly as before.

Three things about it:

- **It is off unless you set it up, and off unless you tick the box each time.**
  Nothing is ever sent to DeepSeek otherwise.
- **It is never required.** No key, no internet, a busy service, a nonsensical
  answer — every one of those falls back to the ordinary checks and says so on
  screen. Nothing stops.
- **It sends your chapter text to a company outside the university.** That is a
  decision worth taking deliberately rather than by ticking a box. If it has not
  been discussed, ask the technical contact and the maintainer before using it.

Both the key and your sign-in live in this Mac's Keychain — not in a file, and
never in your vault. The first time the app reads either after an update, macOS
may ask whether **Authoring Assistant** is allowed to use your Keychain. Say yes:
it is asking about its own saved items, nothing else on the Mac.

---

## When something goes wrong

| What you see | Where to go |
|---|---|
| Sign-in fails, or *Waiting for you* is empty when it shouldn't be | `docs/troubleshooting.md` — *The author's console won't sign in* |
| Anything about converting a Word document | `docs/word-to-markdown.md`, Part 4 |
| *This chapter changed on disk* | Obsidian saved underneath you. Nothing was written. Close the chapter in Obsidian and start again |
| The browser page didn't open | Double-click the app icon again |
| A citation wasn't offered | The matching entry is missing from that chapter's References section — the app lists these at the end |
| No concept pages were found | You opened a single chapter; open the whole vault folder instead |
| Nothing at all was found | You have already run it on that chapter. The final screen says what was skipped |

The app keeps a log at
`~/Library/Application Support/Authoring Assistant/log.txt`. You never need to read
it, but it is the first thing the technical contact will ask for.

**Nothing the app does is damage.** The site can always be republished from your
vault, and every past version of every file is kept.

---

## For the technical contact

Building, signing and releasing the app, creating the sign-in identifier, the
DeepSeek egress path, and the suggest-edit backend are all in
**[`docs/the-authoring-app-operations.md`](the-authoring-app-operations.md)**.
