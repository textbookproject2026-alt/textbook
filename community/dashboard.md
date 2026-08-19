# Project health

This page is *Education Tool Project 2026* in numbers: how many people are reading it, how much conversation is happening in its margins, and how much of it is being written or corrected. It exists so that none of that has to be guessed at, or asked for, or assembled by hand.

It rebuilds itself every Sunday from the systems that already hold the data — Hypothes.is for the annotations, GitHub for the repository — and proposes the new version as a pull request. A week in which nothing moved produces no pull request at all, so this page changing is itself a signal.

Nothing on this page names a reader. The margin is a place where people think out loud, and it stays usable because nobody is being scored in it, so the annotation figures below are totals — how many notes, on how many pages, from how many accounts — and never a list of who wrote them.

## Readership

Visitor numbers are not repeated here — they live in the site's own analytics dashboard, which is public. Anyone can open it, with no login and no account: **[the readership dashboard for bptext2026.xyz](https://plausible.io/bptext2026.xyz)**.

It shows how many people have visited the book, which pages they spent time on, and where they arrived from, over whatever period you select. It counts visits rather than identities — no cookies, nothing that follows a reader from one site to another — which is why it is a fair measure of interest and a poor one of anything else.

## Discussion in the margins

Every page of the book can be annotated: a reader selects a passage, writes a note, and the note stays attached to that exact sentence for everyone who comes after. Those notes are held by Hypothes.is rather than in the book's own files, which is why they are counted here rather than being visible in the repository.

There are **6 annotations** in total. All of them are in the public layer at bptext2026.xyz, where anyone can read them without an account. The course groups — test-group and Biology edition — are empty, and that is the intended state rather than a fault. Giving each cohort a margin of its own depends on a decision about the annotation provider's paid tier that has not been taken yet, so until it is, every conversation happens in the open — which is how the book was always meant to launch.

They are spread across 3 pages of the book, and all come from a single account. One of them is a reply to somebody else's note, which is the part that matters: a margin that only accumulates notes is a comment box, and a margin that accumulates replies is a seminar.

The first arrived on 17 June 2026 and the most recent on 19 August 2026.

These are small numbers and, at this stage, unalarming ones. What is worth watching is not the total but its shape during a term: annotations arriving in the weeks a chapter is being taught, and replies arriving after them.

## Contribution

The book is a public Git repository, so every change to it — a rewritten section, a corrected apostrophe, a workflow like the one that builds this page — is a recorded commit by a named author. That makes the writing of the book countable in a way a document circulated by email is not.

**One person** has written the book so far. That is what an early book looks like — it is written before it is contributed to — and the [[contributors|contributors page]], which is the standing record of who has changed what, is where a second name would appear.

One department is running its own edition of the book — the same chapters with its own margin. It is listed on the [[derivatives|department editions page]].

Nothing is currently open against the repository: no issues waiting, no proposed changes unreviewed. On a project this size that means the queue is clear rather than that nobody is looking.

### Suggested edits

Every page of the book carries a **Suggest an edit** link. It needs no GitHub account and no knowledge of Git: a reader describes what is wrong and what it should say, and the suggestion is filed as an issue labelled `suggested-edit`. It is the lightest route into the book, and the one most readers will ever use, so it is worth watching on its own.

5 suggestions have been filed. None are waiting now: every one filed so far has been dealt with.

A suggestion left open is not lost, but it is unanswered, and an unanswered suggestion is the one thing on this page that costs the project something: it teaches a reader that the link does nothing.

---

Where these figures come from: annotation counts from the Hypothes.is API, covering the public layer for the site and each course group; everything else from the GitHub API. Visitor numbers are not read programmatically and are linked instead. If any of those calls fails, the rebuild stops and this page is left exactly as it was — it will never quietly report a zero that means "the job broke".

*This page is rebuilt weekly, and is dated by the most recent thing it counts rather than by the day it ran: 19 August 2026.*
