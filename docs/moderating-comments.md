# Moderating reader comments

Readers can highlight any sentence on the textbook site and attach a comment. This page describes a **15-minute weekly routine** for keeping on top of those comments. Fifteen minutes is the whole budget — when the time is up, stop. Anything left will still be there next week, and nothing breaks if a comment waits.

Pick a fixed slot (Monday morning works well) and treat it as the only time you look. Comments are a slow-moving conversation, not a support queue.

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

**2. One page at a time.** Every page of the textbook shows a small badge in the row under the title, next to "Edit on GitHub" — it reads **"3 annotations"**, or **"Annotate this page"** when there are none. Click it to open the sidebar on that page and read the comments in context. Use this when you're already reading a chapter, or when the site-wide search points you at a page and you want to see the highlight in place.

[SCREENSHOT: the row under a chapter title showing "Edit on GitHub · View revision history · Suggest an edit" and the annotation count badge]

---

## What to do with each comment

Readers are asked to tag their comment with one of two words, using the small helper panel that appears beside the sidebar while they write. There are only two, and they mean different things:

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

*(added when this feature goes live)*

---

## Reviewing draft edits from the web editor

*(added when this feature goes live)*

---

## Why there are no per-cohort groups

Per-cohort comment isolation was considered and **not adopted**. It would have needed Hypothes.is's Publisher tier, and the project has decided not to buy it. That decision is settled rather than deferred, so the four moves above are the whole of moderation, permanently: no hide/unhide, no membership control, no per-edition groups arriving later. All reader discussion happens in the public layer, and that is the launch model.

One private group exists from earlier testing — the **Biology edition** group — created under Alec's account, and the weekly annotation backup still covers it. **At handover, Brandon is made moderator/owner of all annotation groups**; that transfer is a handover checklist step, not something to do now.
