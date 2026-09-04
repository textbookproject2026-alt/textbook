# Editing Chapters in the Browser

**A guide for trusted contributors**

You have been given access to edit the textbook. This guide shows you how, using
nothing but a web browser. **You do not need Obsidian, you do not need Git, and
you never need to type a command into a terminal.** If a tutorial elsewhere tells
you to install something, stop and check with the technical contact first.

Reading this takes ten minutes. Your first edit will take about five.

---

## What this is

The textbook lives as a set of plain text files. Normally those files are edited
in a desktop app called Obsidian, which is a lot of setup for someone who wants
to fix a paragraph.

So there is a second door: a web page called the **CMS** (content management
system). It shows you the same chapters in an editing box in your browser. When
you save, it writes your change back to the same place Obsidian would have — you
are editing the real textbook, not a copy.

The important thing to understand, and the thing this whole guide is really
about, is this:

> **Nothing you do in the CMS goes live on the website.**

Your edits go into a holding area called `drafts`. The maintainer reviews what
is in that holding area and decides what gets published. There is no button
anywhere in the CMS that publishes to the live site. You cannot break the book.

---

## The address

The CMS is at:

`https://textbook-cms.pages.dev`

Bookmark it. Note that this is **not** the same address as the textbook itself —
the book is at `https://bptext2026.xyz`. They look nothing alike on purpose. The
CMS is a tool; it is not part of the book, and it is not published with it.

---

## Signing in

You need a free GitHub account. GitHub is where the textbook files are stored.
If you do not have one, make one at `https://github.com` first, and give the
technical contact the username you chose so they can grant you access. Until
they do, you will be able to sign in but not to save.

Then:

1. Go to `https://textbook-cms.pages.dev`.
2. Click **Sign in with GitHub**.
3. A GitHub window pops up asking whether to authorise "Textbook CMS". Click
   **Authorize**.
4. The popup closes and you land in the editor.

[SCREENSHOT: The CMS sign-in screen, showing the single "Sign in with GitHub" button on an otherwise empty page.]

[SCREENSHOT: The GitHub authorisation dialog for "Textbook CMS", with the green Authorize button highlighted.]

You are signing in **as yourself**. There is no shared account and no shared
password. This matters: every change you make is recorded under your own name,
so the maintainer can see who wrote what and ask you about it. It also means you
can never be blamed for someone else's edit.

You should only have to authorise once per browser.

**If the popup opens and closes and you are still signed out**, it is a
configuration problem, not something you did wrong. Message the technical
contact.

---

## Finding a chapter

After signing in you will see a list on the left called **Chapters and concept
pages**. Click it and you get the chapter files — `chapter-01`, `chapter-03`, and
the rest as they are written.

[SCREENSHOT: The CMS entry list, showing the chapter files.]

Click the one you want.

**About the concept pages.** These are the short definitions readers see pop up
when they hover a term in a chapter: `Critical Realism`, `Emergence`, `Monism`,
`Retroduction`, `The Three Domains`, `Unobservables`. They used to sit alongside
the chapters, and they were listed here with them. They have since moved into a
`Definitions` folder inside `chapters/`, and the list only shows files sitting
directly in `chapters/` — so they do not appear in it at the moment.

If you have been asked to edit one, tell the technical contact rather than
hunting for it. It is a setting on their side, not anything you are doing wrong.

---

## Editing

You get one large text box containing the whole page. That is deliberate — these
files are plain text from top to bottom, so you are looking at the entire chapter
exactly as it is stored.

[SCREENSHOT: The editor open on chapter-03, showing the full chapter text in a single editing box, with the Save button at the top right.]

Most of it is ordinary prose. Type into it as you would into any text box. A few
marks scattered through the text mean something, and it is worth knowing what
before you edit around them.

### The marks that mean something

**`#` at the start of a line makes a heading.** One `#` is the chapter title, two
`##` is a section, three `###` is a subsection. Keep the number of hashes
consistent with the sections around it.

**`**text**` makes text bold** and `*text*` makes it *italic*. The asterisks
themselves do not appear to readers.

**`[[Double square brackets]]` are links to concept pages.** When a chapter says
`[[Retroduction]]`, a reader hovering over that word sees the definition pop up.
These are fragile in one specific way: the words inside the brackets must match
the name of the concept page exactly, including capitals. `[[Retroduction]]`
works; `[[retroduction]]` and `[[Retroductions]]` are broken links. If you want
the sentence to read differently from the page name, write
`[[Retroduction|the retroductive move]]` — the part before the bar is the page,
the part after it is what the reader sees.

**Lines beginning with `>` are quote blocks and callouts.** The box at the top of
chapter 3 that begins `> [!abstract]` is one of these. Every line of it starts
with `>`. If you edit inside one, keep the `>` at the start of each line.

**Blank lines separate paragraphs.** One blank line between paragraphs. Two or
more do nothing extra.

If you are unsure whether a mark is doing something, leave it alone and mention
it in your description when you save. Nothing you can type will damage anything
permanently — everything is recoverable, and the maintainer sees the change
before it reaches a reader.

### Adding an image

Use the image button in the toolbar and upload the file. It goes into the book's
`assets` folder automatically. Give it a real filename, not `Screenshot 2026-08-19
at 14.32.png`.

---

## Saving your work

Saving happens in two motions, because the CMS treats a save as "I have made a
change" rather than "publish this".

1. Click **Save**. Your edit is stored and given a status of **Draft**.
2. When you are happy with it, change the status to **In review**. That is the
   signal to the maintainer that it is finished and ready to be looked at.

[SCREENSHOT: The editor toolbar showing the workflow status control with Draft, In review, and Ready.]

You can save as many times as you like while a piece is a Draft. Leaving
something in Draft overnight is fine; it stays exactly where you left it and
nobody else is affected.

There is a third status, **Ready**. Setting it does not put anything on the
website — it marks the entry as approved within the holding area. Leave it to
the maintainer.

---

## What happens next

The moment you save, the CMS does some bookkeeping on GitHub on your behalf. You
do not have to do any of it, but you will see traces of it, so here is what they
are.

Your edit becomes a **pull request** — GitHub's term for "here is a proposed
change, please look at it". You will see it on GitHub with your name on it and a
list of exactly what you changed, line by line.

That pull request points at `drafts`, the holding area. It does not point at the
live book, and nothing in the CMS can make it point at the live book.

Then:

- **You will get an email from GitHub**, and a notification on the bell icon at
  `https://github.com`, whenever the maintainer comments on your change or
  accepts it.
  If the email is unwelcome, turn it off in GitHub's notification settings — the
  bell will still work.
- **The maintainer reviews the holding area** and, when satisfied, publishes a
  batch of accepted changes to the live site. This is a separate, deliberate
  step that only the maintainer can take.
- **You may get a comment** asking a question or suggesting a rewording. You
  reply on GitHub, or just go back into the CMS, make the change, and save again.

So the full path of a sentence you write is: your browser → the holding area →
the maintainer's review → the live book. Two people and one deliberate decision
stand between your text box and a reader.

[SCREENSHOT: A pull request on GitHub showing the contributor's name, the changed lines highlighted in green and red, and the target branch reading "drafts".]

---

## Things worth knowing

**Two people editing the same chapter at once will conflict.** The CMS is not
Google Docs. If you and someone else edit chapter 3 simultaneously, one of you
will get an error when saving. Say in the group chat what you are picking up
before you start.

**Your work is never lost.** Every save is recorded permanently with your name
and the time. Even a change the maintainer rejects stays in the history and can
be brought back.

**You cannot edit the live site directly, and neither can the maintainer by
accident.**
This is by design and it is not a comment on your judgement — it is the same for
everyone, including the people who set the system up.

**If something looks wrong, it probably is not your fault.** Sign-in failures,
missing chapters and save errors are almost always configuration. Ask the
technical contact.

---

## Why the CMS is not part of the website

You may wonder why the CMS lives at its own address rather than somewhere on
`https://bptext2026.xyz`.

The book's website is built by Obsidian Publish, which takes the chapter files
and turns them into readable pages. The CMS is not a chapter — it is a tool, and
it is deliberately kept out of the set of files Obsidian Publish is allowed to
touch. If it were included, it would appear to readers as a strange broken page
in the middle of the textbook.

That is why the editor is hosted separately, and why its address looks nothing
like the book's.

---

## Getting help

- **Something is broken, or you cannot sign in** — the technical contact.
- **A question about the content itself, or whether an edit is a good idea** —
  the maintainer.
- **You made a mess and want it undone** — either of them. It is genuinely easy
  to undo. Say what you were editing and roughly when.

---

## Related guides

- **`docs/how-to-comment.md`** — the annotation sidebar as readers meet it.
  Worth a skim even though it is written for students: the margin comments are
  where a good number of the copy-edits you will be asked to make start out.
- **`docs/for-course-coordinators.md`** — for anyone publishing a department
  edition of the book at its own web address, from its own copy of the chapters.
- **`docs/editing-the-textbook.md`** — the maintainer's route into the same
  files, through Obsidian rather than the CMS. You do not need it; it is there if
  you want to see what happens to your change after it is accepted.
