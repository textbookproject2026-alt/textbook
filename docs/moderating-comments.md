# Moderating reader comments

Readers can highlight any sentence on the textbook site and attach a comment. This page describes a **15-minute weekly routine** for keeping on top of those comments. Fifteen minutes is the whole budget — when the time is up, stop. Anything left will still be there next week, and nothing breaks if a comment waits.

Pick a fixed slot (Monday morning works well) and treat it as the only time you look. Comments are a slow-moving conversation, not a support queue.

Two other things arrive from readers and contributors: **suggested edits** sent from the form on each page, and **draft edits** written by trusted contributors in the browser editor. Both are covered at the end of this page. Neither is part of the fifteen minutes — they turn up in batches, not continuously — and for both, the machinery is the maintainer's job and the judgement is yours.

---

## What you can and can't do right now

All reader comments currently live on Hypothes.is's **public layer**. That means anyone on the internet can read them, and it also means something important: **you have no power to hide, delete, or unhide anyone else's comment.** Hide/unhide only exists for moderators inside a private Hypothes.is group, and the textbook does not use groups for reader comments — a settled decision, not a pending one (see the last section).

So honest moderation, today, is four moves and no more:

- **Read** — see what's been left.
- **Reply** — answer, thank, or clarify, in the sidebar.
- **Fix** — change the textbook itself when the comment points at a real error.
- **Flag** — report genuine abuse to Hypothes.is using the comment's own menu (the **⋮** at the top-right of the comment → **Flag**). That goes to Hypothes.is staff, who decide. It does not remove anything from the page, and it isn't instant.

Deleting your *own* replies is always possible. Someone else's comment is theirs.

[SCREENSHOT: a single annotation in the sidebar with its ⋮ menu open, showing the Flag option]

---

## Where to look

**1. Everything on the site at once.** This link lists every public comment on every page of the textbook, newest first:

https://hypothes.is/search?q=url:https://bptext2026.xyz/*

Bookmark it. This is the starting point of the weekly routine. The `*` at the end means "any page on this site" — don't drop it, or the search returns nothing.

To see just one kind of comment, add a tag to the end of the same link:

- https://hypothes.is/search?q=url:https://bptext2026.xyz/*+tag:copy-edit
- https://hypothes.is/search?q=url:https://bptext2026.xyz/*+tag:discussion

[SCREENSHOT: the hypothes.is search page showing the site-wide result list, with the "N Matching Annotations" count visible at the top]

**2. One page at a time.** Every page of the textbook shows a small badge in the row under the title, after "Edit on GitHub · View revision history · Suggest an edit" — it reads **"3 annotations"**, or **"Annotate this page"** when there are none. Click it to open the sidebar on that page and read the comments in context. Use this when you're already reading a chapter, or when the site-wide search points you at a page and you want to see the highlight in place.

Three things about the count, so it never misleads you. It counts the **public layer only** — the two leftover private test groups are not in it. It is read when the page loads, so after you reply the number does not tick up until you reload. And if it cannot reach Hypothes.is at all, the badge simply doesn't appear: a missing badge means the count failed, never that the count is zero.

[SCREENSHOT: the row under a chapter title showing "Edit on GitHub · View revision history · Suggest an edit" and the annotation count badge]

---

## What to do with each comment

Readers are asked to tag their comment with one of two words. A small helper panel floats to the left of the sidebar while it is open, showing both tags as chips; clicking one copies it, and the reader pastes it into the Tags field under their comment. That is as far as it can go — the Hypothes.is composer sits in a frame the site cannot write into, so nothing can tag a comment on the reader's behalf. **Expect most comments to arrive with no tag at all.** There are two tags, and they mean different things:

**`copy-edit`** — the reader is reporting a typo, a broken link, a wrong number, a clumsy sentence. Treat it as a small correction:

1. Open the chapter in Obsidian and make the fix.
2. Publish.
3. Reload the page and glance at the comment's highlight — see below for why.
4. Reply to the comment: "fixed — thanks". One line is plenty.

**What happens to a comment when you edit the text it's attached to.** Hypothes.is remembers the exact wording a comment was left on, plus a little of the text either side, and searches for that when the page loads. Editing the wording therefore has three possible outcomes:

- **It re-anchors correctly.** The usual result for small edits — a fixed typo, a reworded clause nearby. Enough of the surrounding text still matches, and the highlight lands where it should.
- **It orphans.** If the passage is substantially gone, the comment can't find its place and moves to an "orphans" area of the sidebar. That's fine — the comment did its job. Don't preserve the anchor by leaving the typo in.
- **It re-anchors to a different occurrence of the same wording.** The one to watch for. If you change the exact phrase the comment was left on, and that phrase appears again later on the page, the search can settle on the *next* occurrence. No orphan, no warning — the comment is simply now highlighting the wrong text. Seen live: changing "the chapter" to "this chapter" moved the highlight to the following "the chapter" further down.

That third case is why step 3 exists. It costs a few seconds and doesn't need fixing from your side — the highlight is cosmetic and the reply is what the reader sees. If it has jumped, just say so in the reply: *"fixed — thanks. Heads up, your highlight has shifted to another spot on the page."*

**`discussion`** — the reader is raising a question, a disagreement, or a point of interpretation. Nothing needs fixing. Reply if you have something worth saying; leave it alone if you don't. An unanswered discussion comment is not a failure, and a thoughtful reply next week beats a hurried one today.

**No tag at all** — treat it as `discussion`. Most readers won't tag anything. Only act as if it were a copy-edit if the comment is plainly reporting an error.

---

## Keeping to 15 minutes

Open the site-wide search, work down from the newest comment, and stop when the time is up. If a copy-edit will take more than a couple of minutes to fix, don't fix it now — note it and come back outside the moderation slot. The point of the routine is that nothing accumulates unseen, not that everything is resolved the same week.

---

## Handling suggested edits sent from the website

Every page carries a **Suggest an edit** button in the row under the title. A reader clicks it, gets a small form — their name, their email, the page (filled in for them), what they'd change, and optionally why — and sends it. No account, no login, no GitHub. It is the lightest way into the book and the one most readers will ever use.

[SCREENSHOT: the "Suggest an edit" form open over a chapter page, showing the name, email, page, suggested change and why fields]

**Where it goes, and what isn't yours.** Each submission is filed automatically as an issue on the project's GitHub repository, labelled `suggested-edit` and `needs-triage`. You do not need a GitHub account and you never open the issue yourself. Labelling it, replying to the reader, and closing it when it's dealt with are the maintainer's job — `needs-triage` is simply the maintainer's marker for "nobody has looked at this yet", and it comes off once someone has. The words are here only so they aren't a mystery if you see them.

**What reaches you** is the substance: the page, what the reader says is wrong, and what they think it should say. One decision per suggestion, and there are only three:

- **Fix it.** Open the chapter in Obsidian, make the change, publish. Exactly the same move as a `copy-edit` comment above, including the reload-and-glance step if the passage carries an annotation.
- **Don't change it.** The reader misread, or the wording is a deliberate choice. Say so in a line — "this is intentional, because…" — and the maintainer replies to them. A declined suggestion answered is a good outcome; it is the silence that costs something.
- **Too big for now.** A real gap that needs a rewrite rather than a fix. Say that, and it gets parked. It doesn't belong in a weekly slot.

**Watching the queue without GitHub.** The project health page — `community/dashboard.md`, rebuilt weekly — carries a *Suggested edits* section: how many have been filed and how many are still waiting. That is your view of the queue, and it is the number to care about. An open suggestion isn't lost, but it is unanswered, and an unanswered suggestion teaches a reader that the button does nothing.

---

## Reviewing draft edits from the web editor

A handful of trusted contributors can edit chapters in a web page instead of Obsidian. Their guide is `docs/for-trusted-contributors.md`, and the one thing to know about it is the safety property: **nothing anyone does in that editor reaches the live site.** Every save goes into a holding area. There is no publish button in it, for them or for you.

**Where you look.** The editor is at `https://textbook-cms.pages.dev`. You sign in with your own GitHub login — the technical contact sets that up once, and it is the only place in your routine where such an account is used; you never visit GitHub itself. Inside, entries sit in three columns: **Draft**, **In review**, **Ready**.

**In review** is your column. It means a contributor has finished and would like your eyes on it.

[SCREENSHOT: the browser editor's workflow view, with the Draft, In review and Ready columns and one entry sitting in In review]

**What you do per entry.** Open it and read the proposed text against the chapter it changes. Then one of two things:

- **Ask for a change.** Leave the contributor a note; they go back into the editor, revise, and save again. It stays in *In review*.
- **Accept it.** Move the entry to **Ready**. That is your yes. It publishes nothing and changes nothing on the site — it marks the work as approved inside the holding area.

**What happens after Ready is not yours.** The maintainer takes the approved entries out of the holding area and into the textbook itself, in batches. Pull requests, branches and merges all live at that step, and none of it needs anything from you. The accepted text then shows up in your Obsidian vault like any other change, and it reaches readers when you next publish — so the final gate is still the Publish dialog on your own machine.

Two things worth knowing. Every edit is recorded under its author's own name, so you can always see who wrote what and ask them about it. And a draft left sitting in *In review* harms nothing — the contributor's work is saved, nobody else is blocked, and it will still be there whenever you get to it. This is not a weekly obligation; look when you're told something is waiting, or once a fortnight.

---

## Why there are no per-cohort groups

Per-cohort comment isolation was considered and **not adopted**. It would have needed Hypothes.is's Publisher tier, and the project has decided not to buy it. That decision is settled rather than deferred, so the four moves above are the whole of moderation, permanently: no hide/unhide, no membership control, no per-edition groups arriving later. All reader discussion happens in the public layer, and that is the launch model.

One private group exists from earlier testing — the **Biology edition** group — created under the technical contact's account, and the weekly annotation backup still covers it. **At handover, the textbook's maintainer is made moderator/owner of all annotation groups**; that transfer is a handover checklist step, not something to do now.
