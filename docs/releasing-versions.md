# Releasing a version

The textbook is published once per academic year. A release is not a technical
event so much as a decision: you decide the book is in the state you want
students to meet in September, and it gets marked so that anyone can point at
exactly that state forever afterwards.

This guide is for you, Brandon. It covers what you check, what you decide, and
what you send — and it is explicit about the parts that are not yours, so you
are never waiting on something you didn't know you had to ask for.

---

## Who does what

A release has two halves and they belong to two people.

| Yours | Alec's |
|---|---|
| Deciding the book is ready | Creating the tag |
| Reading the chapters and the front page | Anything involving git, branches or the repository |
| Confirming links and the concept pages are right | Point releases when something has to be fixed after the fact |
| Writing and sending the announcement | Backporting a fix into an already-released version |
| Deciding whether a post-release error is serious | Telling you what the tag ended up being called |

Nothing on the right-hand column needs anything from you except a sentence
saying you're ready. You will not be asked to run a command, and if a
conversation starts heading that way, say so — it means the split has slipped.

---

## The pre-release checklist

Work through this in the week before you want to announce. None of it is
urgent, and none of it needs anything installed. Give it an afternoon.

**1. Read the book.** Not skim — read. This is the one moment in the year when
the whole text gets looked at as a whole rather than a chapter at a time. You
are looking for the things that only show up in sequence: a term defined twice,
a chapter that promises something the next one doesn't deliver, an example that
was topical two years ago.

**2. Every chapter is the version you mean to ship.** Open each one and check
the top: the title heading is right, and nothing is half-finished below it.
Anything still in the browser editor's holding area is *not* in the book — if
there is accepted work sitting in **Ready** that you want in this release, tell
Alec now rather than after the tag exists. See `docs/moderating-comments.md`.

**3. The front page is accurate.** Every chapter in the book is listed, in the
right order, with a description that still describes it. Remember this is
`templates/index.md`, not `index.md` — see *Adding a new chapter* in
`docs/editing-the-textbook.md`. Check that `index.md` has actually caught up
before you release; if the template is right and the front page still isn't,
that is one to raise.

**4. The concept pages and the glossary agree with the chapters.** Every
`[[link]]` in a chapter should land on a page that exists in
`chapters/Definitions/`, and every term in `glossary.md` should still be used in
the chapter it says it was. New concepts added during the year are the ones that
get missed here.

**5. Links work.** Click through them — the concept links inside chapters, the
chapter-to-chapter links, and the external references. A broken external link is
worth fixing before a year's worth of students meet it.

**6. The community pages are current.** `community/contributors.md`,
`community/derivatives.md` and `community/dashboard.md` rebuild themselves every
Sunday. Open all three and check they look like pages rather than something
half-written, and that the contributor list includes the people who worked on the
book this year. If one is visibly stale or broken, that is Alec's — the details
are in `docs/scheduled-actions-health-check.md`.

**7. Publish everything.** The last thing before you hand over is a publish, so
that the live site and the text about to be tagged are the same thing. Read the
list in the dialog properly; this is the publish where an unticked file matters
most.

[SCREENSHOT: the Publish dialog before a release, with the full list of changed files visible]

Then tell Alec you're ready. One line is enough — "chapter review done, published,
ready to tag". He will tell you what the version ended up being called.

---

## What tagging actually means

Alec creates a **tag** — a permanent bookmark on the project's history, with a
name like `v0.1`. It doesn't change the book, it doesn't change the website, and
nobody has to do anything with it. What it does is make one particular state of
the text permanently reachable at a fixed web address, no matter how much the
book changes afterwards.

That is the whole point, and it exists for one reason: **so that a citation or a
syllabus can point at a version of the text that will still say the same thing in
three years.** A lecturer who writes "Chapter 3, 2026–27 edition" in a reading
list needs that reference to survive every edit you make during the year. The
live site can't give them that — it always shows the newest version — so the tag
does.

`docs/how-versioning-works.md` has the mechanics: what the permanent links look
like, how a coordinator pins a teaching year, and how a reader gets back to an
older edition. Read it once; you don't need it in your head.

The one thing worth carrying: **tags never move.** Once a version is tagged, that
snapshot is fixed. Fixing something on the live site afterwards does not change
what the tagged version says. That fact is the whole of the post-release section
further down.

---

## The announcement

Two audiences, two messages. Send them after Alec confirms the tag exists —
the coordinator one needs the tag's link in it.

Fill in the bracketed parts. Alec gives you the tag name; everything else you
already know.

### To course coordinators

```
Subject: Textbook — [2026–27] edition now released

Hello all,

The [2026–27] edition of the textbook is released. This is the version to
teach from and to cite this year.

Version of record:
https://github.com/textbookproject2026-alt/textbook/tree/[v0.1]

That link is permanent. It shows the text exactly as it stands today and
will keep showing that, unchanged, whatever gets edited on the live site
during the year — so it is safe to put in a syllabus.

The live textbook is at https://bptext2026.xyz as always. It always shows
the newest version rather than a fixed edition, which is why the link
above exists.

What changed this year:
- [chapter or section, one line on what changed]
- [chapter or section, one line on what changed]

If you run your own department edition: this is the release to sync to.
The steps are under "When the textbook updates" in the coordinators'
guide. If you have localised any of the chapters listed above, expect to
re-apply those localisations — the guide says how to make that painless.

If you spot something wrong, use the "Suggest an edit" button on the page
in question. It reaches me directly.

[Your name]
```

### To students

```
Subject: Your textbook for [module / year]

The textbook for this module is online and free to read:

https://bptext2026.xyz

Nothing to install, no account, no login. It works on a phone.

Two things worth knowing:

You can annotate it. Highlight any sentence and leave a comment or a
question — click the highlight icon in the sidebar to start. Comments are
public: your classmates can see them, and so can anyone else reading the
book. Comments from previous years are there too, so you may find your
question already asked and answered. Have a look before you post.

If you find a mistake, say so. Every page has a "Suggest an edit" button
under the title. Describe what's wrong; it comes straight to me. Typos,
broken links, a sentence that doesn't parse — all of it is worth
reporting, and it is how the book gets better each year.

[Your name]
```

Say "public" plainly in the student message. It is the one thing students
consistently do not expect, and finding out afterwards is worse than being told.

---

## Annotations carry across years

There is one consequence of the yearly cycle that has nothing to do with tags,
and it is worth understanding before the second cohort arrives rather than
during it.

**Reader comments accumulate in the public layer and are never rotated.** They
are attached to the pages of the live site, not to a version of the text, so a
student arriving in year three sees the annotations left by the students in
years one and two, all in the same sidebar, oldest to newest. Nothing resets at
a release.

This was a decision, not an oversight. Giving each cohort its own space would
have needed Hypothes.is's Publisher tier, which the project chose not to buy —
`docs/moderating-comments.md` has the reasoning. It is settled, so the honest
thing is to plan around it rather than wait for it to change.

**It can be genuinely good.** A chapter that has been read by three cohorts
carries three years of questions, and the good ones are already answered — often
by you. It makes the book feel inhabited rather than issued, and a student who
sees last year's confusion about the same paragraph learns they aren't the only
one. For a text about interpretation, an argument running across years in the
margin is not the worst thing that could happen to it.

**It can also be noise.** The volume only ever grows. Questions get asked for the
fourth time. Comments pinned to sentences you have since rewritten drift or fall
into the sidebar's orphans area, so old threads slowly lose the text they were
about. And a comment tied to a particular year's assignment is meaningless to
everyone who comes after it.

**What you can actually do about it, without paying for anything:**

- **Nothing.** The default, and defensible. Let it accumulate and treat the
  margin as a long conversation. Revisit in a couple of years when you can see
  the real volume rather than guessing at it.
- **Tell students at the start.** One line in the announcement above — comments
  are public, they persist, previous years are already there. That converts the
  surprise into a feature.
- **Leave your own dated note.** At release, annotate the top of each chapter
  with something like "comments below span several cohorts — dates are on each
  one". Costs you ten minutes a year and orients every reader afterwards.
- **Ask for a year tag.** Students can tag their comments with the year, and the
  site-wide search then filters by it. Free, but it depends on people
  remembering: the annotation composer sits in a frame the site cannot write
  into, so nothing can add the tag for them. Expect patchy adoption.
- **A coordinator can run a private group for their cohort.** Entirely manual,
  entirely optional, and set up by the coordinator rather than by you — Step 8 of
  `docs/for-course-coordinators.md`. Students must pick the group from a dropdown
  each time they annotate, and one who forgets posts publicly anyway.

**What you cannot do:** delete, hide, or archive anyone else's comment. You have
four moves — read, reply, fix the book, flag genuine abuse — and that is the
whole of it, permanently. `docs/moderating-comments.md` is the detail.

---

## If a serious error is found after release

First: most errors are not this. A typo, a broken link, a clumsy sentence —
fix it in Obsidian and publish, exactly as you would any other week. The live
site updates and that is the end of it. Nothing about a release changes the
normal fixing routine.

The situation this section is about is narrower: **an error serious enough that
somebody teaching from the released version needs to know.** A wrong claim in an
argument, a figure that says the opposite of what the text says, a reference that
sends readers to the wrong source. The test is whether a student who read it
would come away with something false.

When that happens:

**1. Fix the live site first.** Obsidian, publish, done. Everyone reading the
book at `bptext2026.xyz` is now reading the corrected text, and that is most
readers. Do this before anything else; the rest can take a day.

**2. Tell Alec, and say it's serious.** This is the sentence that matters,
because it is what separates this from a normal fix. The released version still
contains the error — tags never move — so anybody who followed a syllabus link
to the tagged edition still sees it. Whether that needs a **point release** (a
second tag, `v0.1.1`, carrying the fix) is Alec's call and Alec's work. So is
backporting the fix into it. You do not need to know what either involves.

**3. Email the coordinators.** They are the people who will otherwise keep
teaching the error. Say what was wrong, what it now says, and — if Alec made a
point release — give them the new link to cite. Coordinators running their own
department edition need this most: their site is a fork and does not update
itself, so their students keep seeing the old text until the coordinator syncs.

**4. Say so in the margin, if the passage carries comments.** If students have
annotated the paragraph you just corrected, a one-line reply saying it was wrong
and is now fixed is worth more than a silent edit. It also warns you if the
highlight has drifted — see `docs/troubleshooting.md`.

One thing to ask Alec for *before* a large correction rather than after: a fresh
annotation backup. Rewriting a passage can orphan every comment attached to it,
and there is no undo. It takes him two minutes and only helps if it happens
first.
