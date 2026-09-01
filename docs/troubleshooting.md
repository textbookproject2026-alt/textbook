# Troubleshooting

Ten things that have actually gone wrong on this project, what to check when
each one happens, and what fixes it.

Each entry says who fixes it. **You** means you can finish it yourself in
Obsidian or a browser. **The technical contact** means it is configuration —
report it and stop; there is nothing you can do from your side, and nothing you
can make worse by having looked.

Nothing here is damage. The site can always be republished from your vault, and
every version of every file is kept.

| What you see | Who fixes it |
|---|---|
| [The site doesn't show a change I published](#the-site-doesnt-show-a-change-i-published) | You |
| [`publish.css` / `publish.js` changes did nothing](#publishcss--publishjs-changes-did-nothing) | You |
| [An annotation vanished or moved to the wrong text](#an-annotation-vanished-or-moved-to-the-wrong-text) | You |
| [Edit on GitHub gives a 404](#edit-on-github-gives-a-404) | The technical contact |
| [The suggest-edit form shows an error](#the-suggest-edit-form-shows-an-error) | The technical contact |
| [Analytics show no data](#analytics-show-no-data) | You, then the technical contact |
| [A weekly job failed](#a-weekly-job-failed) | The technical contact |
| [The browser editor won't sign in](#the-browser-editor-wont-sign-in) | The technical contact |
| [A department edition didn't pick up a fix](#a-department-edition-didnt-pick-up-a-fix) | The coordinator |
| [The author's console won't sign in, or shows nothing waiting](#the-authors-console-wont-sign-in-or-shows-nothing-waiting) | You, then the technical contact |

---

## The site doesn't show a change I published

**You fix this.**

**Check:**

- Was the file ticked in the Publish dialog? Open it again — if the file is
  still listed as changed, it never went.
- Hard-refresh the page: **⌘ + Shift + R**. If the change appears, it was your
  browser's cache and nothing is wrong with the site.
- If it still doesn't appear, open the browser's developer tools
  (**⌥ + ⌘ + I**), go to the **Network** tab, reload, click the page's own
  request in the list and read the **Response** tab. That is the text the server
  actually sent. If your change isn't in there, the site genuinely doesn't have
  it; if it is, the problem is display, not deployment.

**Fix:** publish again with the file ticked, and read the list before
confirming. A stale deploy is almost always an unticked file, not a failure.

---

## `publish.css` / `publish.js` changes did nothing

**You fix this.**

These two files control how the site looks and the extra things its pages do —
the annotation badge, the *Suggest an edit* button, the controls row under each
title. They behave differently from every other file in the vault, and this trips
everyone up exactly once.

**Check:**

- Were they ticked in the Publish dialog? They sit at the top level of the vault
  and are easy to scroll past.
- **They reach the live site only through the Publish dialog.** Saving them does
  nothing. Committing them to GitHub does nothing. The copy on GitHub is version
  control, not the thing the website serves.
- Network tab again: reload the page, find `publish.js` (or `publish.css`) in the
  request list, and read the **Response**. That is the copy being served, and it
  is the only opinion that counts.

**Fix:** publish again with both files ticked. If the served copy still doesn't
contain the change after a hard refresh, that one is the technical contact's.

---

## An annotation vanished or moved to the wrong text

**You fix this — and usually there is nothing to fix.**

Hypothes.is remembers the exact wording a comment was left on plus a little of
the text either side, then goes looking for it each time the page loads. Editing
that text has three possible outcomes, and all three are normal.

**Check:**

- **Did you edit the passage it was attached to?** If yes, this is expected
  behaviour, not a fault.
- **Is it in the orphans area of the sidebar?** If the passage is substantially
  gone, the comment can't find its place and moves there. The comment survives;
  the link to a specific phrase doesn't.
- **Does the phrase you changed appear more than once on the page?** This is the
  one to watch. The search can settle on the *next* occurrence — no orphan, no
  warning, the highlight is simply now on the wrong text. Seen live: changing
  "the chapter" to "this chapter" moved a highlight to the following "the
  chapter" further down.

**Fix:** nothing to repair. Don't leave a typo in to preserve an anchor. If the
highlight has jumped, say so in your reply — *"fixed, thanks. Heads up, your
highlight has shifted to another spot on the page."* Before a **large** rewrite
of a chapter that carries comments, ask the technical contact to run the
annotation backup by hand first; it takes two minutes and only helps beforehand.

---

## Edit on GitHub gives a 404

**The technical contact fixes this.**

The button builds a GitHub address out of the page's web address. A 404 means the
two have stopped matching.

**Check:**

- **Has the file been renamed or moved since it was published?** This is the
  cause nine times in ten. Chapter filenames are load-bearing — renaming one
  breaks every link pointing at it, which is why the editing guide says to ask
  before renaming.
- **Does the capitalisation match?** The address is built from the filename
  exactly, capitals included. `Critical Realism.md` and `critical realism.md` are
  different files as far as the button is concerned.
- **Is the page one you've published but whose file isn't in the repository
  yet?** A page can be live and still not be on GitHub.

**Fix:** report it to the technical contact with the address of the page and
what the button did. If you know the file was renamed, say what it was called
before — that turns it into a one-minute fix.

---

## The suggest-edit form shows an error

**The technical contact fixes this. You can say which of the three it is.**

There are three different failures behind that one message, and the form tells
you which if you read the wording.

**Check:**

- **A specific sentence** — something like *"You're sending suggestions too
  quickly, try again in a minute"* — means the backend answered and refused. It's
  working; it rejected this particular submission. Usually a rate limit, sometimes
  a validation rejection.
- **The generic message** — *"Something went wrong sending your suggestion —
  nothing was lost. Try again in a moment, or use Edit on GitHub above."* — means
  nothing answered at all: the backend is down, the network dropped, or the
  ten-second timeout ran out.
- **Did it actually land anyway?** Check the *Suggested edits* count on
  `community/dashboard.md`. A submission can succeed while the reader still sees
  a timeout.

**Fix:** the technical contact's, either way. Say which of the two messages
appeared — that alone separates "the backend is down" from "the backend is fine
and rate-limiting someone", which are completely different problems.

---

## Analytics show no data

**Check it yourself first; the technical contact fixes it if it's real.**

**Check:**

- **Your own browser is probably blocking it.** Ad-blockers and Safari's tracking
  protection hide your own visits. Check from a phone on mobile data with the
  blocker off — if numbers appear, nothing is wrong.
- **Are you looking at the right site?** Each department edition has its own
  analytics line and its own dashboard. The canonical textbook's figures are for
  `bptext2026.xyz` only.
- **Is it genuinely quiet?** Out of term, on a book that hasn't been announced to
  a cohort, zero is the true number. Compare against a week you know had traffic
  rather than against nothing.

**Fix:** if it is none of those three, it's the technical contact's — the
tracking line is missing or wrong on the site. Say which site and which dates
you were looking at.

---

## A weekly job failed

**The technical contact fixes this.**

Four jobs run unattended every Sunday: the annotation backup, and the three pages
under `community/`.

**Check:**

- **Is a `community/` page visibly broken on the live site** — raw text, half
  empty, a stack trace where a table should be? That is worth reporting even
  though the job itself may have finished green.
- **Is a page simply unchanged?** That is not a failure. All three rebuild only
  when their content differs from last week; a quiet week produces no change at
  all, correctly.
- **Are the contributor or annotation numbers obviously wrong** rather than just
  small? Zero annotations on a book nobody has annotated yet is accurate.

**Fix:** report it to the technical contact and say which page and what looked
wrong. `docs/scheduled-actions-health-check.md` is the full diagnostic guide —
it is written for whoever is looking at the Actions tab, which is not you.

---

## The browser editor won't sign in

**The technical contact fixes this.**

The editor at `https://textbook-cms.pages.dev` signs people in with their own
GitHub account through a relay the technical contact runs. Two things break it,
and they look different.

**Check:**

- **The GitHub popup opens and closes and you're still signed out.** That's the
  relay — the sign-in never completed. It is configuration, not the contributor.
- **The editor loads but looks old, or a chapter that exists isn't listed.** That
  is the other one: the Cloudflare Pages project has disconnected from Git and
  stopped rebuilding. It has happened before and it will happen again.
- **Can they sign in but not save?** Different thing entirely — they have a
  GitHub account but haven't been granted access to the repository yet. The
  technical contact grants it; the contributor needs to have supplied their
  GitHub username.

**Fix:** all three are the technical contact's. Say which of the three it looks
like, and include the contributor's GitHub username if it's the third.

---

## A department edition didn't pick up a fix

**The coordinator fixes this, not you.**

A department edition is a fork — an independent copy that only changes when its
coordinator pulls the change in. Nothing propagates automatically, by design.
There are two separate reasons a fix hasn't arrived, and they need different
answers.

**Check:**

- **Is it a change to the book's text?** Then the coordinator simply hasn't done
  the yearly copy yet. That is the "When the textbook updates" section of
  `docs/for-course-coordinators.md`, and during a teaching year it may well be
  deliberate — a frozen site all year is exactly what that guide recommends.
- **Is it a change to how the site works** — a button, the annotation sidebar,
  the analytics line — rather than to the text? Then copying chapters won't help.
  The site machinery is installed from a lockfile that pins one specific version,
  so the fix does not arrive until the coordinator runs the plugin update.
- **Has their site rebuilt at all recently?** If their most recent deployment is
  older than the fix, nothing has been picked up regardless of which kind it is.

**Fix:** tell the coordinator which of the two it is. If it is the second, the
technical contact gives them the exact update step. Their guide is emphatic that
nothing in that setup should be improvised from a generic tutorial, and this is
precisely the case it means.

---

## The author's console won't sign in, or shows nothing waiting

**Work through the checks yourself; the technical contact fixes anything past
them.**

The console is the **Waiting for you** tab in the Authoring Assistant, beside
**Chapters**. Signing in is GitHub's device flow and there is no relay of the
technical contact's involved: you press **Sign in**, the app shows a code and
opens a web page, you type the code there and approve, and the sign-in is kept
in this Mac's Keychain. Once it has worked the tab reads **Signed in as** and
your name.

**Check:**

- **Does the tab show a card headed "One-off setup" instead of a Sign in
  button?** Then no sign-in identifier has been saved on this Mac, and there is
  nothing to sign in with. Press **Open Settings**, and under **Signing in to see
  what is waiting** paste the identifier the technical contact gives you into
  **Sign-in identifier**, then press **Save identifier**. It should answer
  _Saved. You can now sign in from "Waiting for you"._ The technical contact
  supplies that identifier, and it is done once per Mac.
- **Did the code run out?** The code box says _Waiting for you to approve… this
  code lasts about 15 minutes._ Past that you get _That code ran out before it
  was used. Please start again._ Press **Sign in** again and take the code
  straight to the page.
- **Did the web page never open?** The app opens it in a new tab, which a popup
  blocker will stop without saying so. The address is printed under the code —
  _If the page did not open, go to https://github.com/login/device yourself._
- **Did an error box appear?** Errors come up in a box headed **Something needs
  your attention**, with one button, **All right**. Three of the messages are
  configuration and belong to the technical contact: _This copy has not been set
  up for signing in yet. Ask Alec to add the sign-in identifier in Settings._,
  _Signing in could not be started. Check the sign-in identifier in Settings, and
  that Device Flow is switched on for it._, and _The sign-in identifier in
  Settings is not recognised. Ask Alec to check it._ Two are yours: _Sign-in was
  refused on the web page. Nothing was changed._ means Cancel was pressed on the
  web page, and
  _This Mac is not online, so signing in cannot start._ means what it says.
- **Did it sign in and then ask again?** _Signing in worked, but the token could
  not be stored in this Mac's Keychain…_ means a Keychain prompt was refused, or
  the Keychain is locked; sign in again and allow the prompt when it appears.
  _Your sign-in is no longer accepted. Please sign in again._ is the ordinary
  case of a sign-in withdrawn or aged out — press **Sign in** again.
- **Is the list empty with a green note?** _Nothing is waiting. Everything sent
  in has been dealt with._, above headings reading **Suggestions from readers
  (none)** and **Draft changes (none)**, is the truth and not a fault. Press
  **Check again** before assuming otherwise.
- **Is the list empty with no note at all?** That note is deliberately withheld
  when something failed, so an empty screen without it means a fetch broke rather
  than that nothing is there. Look above the lists for the banner: its lines
  begin **Suggestions:**, **Draft changes:** or **Weekly jobs:**, or, offline,
  _This Mac is not online, so this list may be incomplete. Nothing can be
  accepted or declined until it is back._
- **Is the thing you are waiting for even in this queue?** It holds two kinds of
  item and no others: reader suggestions, described on the screen as _Sent from
  the “Suggest an edit” button on the website._, and draft changes _Written by
  trusted contributors in the browser editor._ Comments left in the margins of
  the book are not in it — those are under **Elsewhere**, behind **Open the
  discussion list**.

Signing in as a different GitHub account does not empty the queue. Everyone sees
the same list, because it is the whole repository's open suggestions and draft
changes rather than anything belonging to your account. The wrong account shows
up as the wrong name after **Signed in as**, and it bites later, at the moment
you accept or decline: _Your sign-in does not have permission to do that. Signing
in again may fix it; if not, ask Alec._

**Fix:** yours are the expired code, the blocked page, the refused Keychain
prompt and being offline — press **Sign in** again and finish it in one go.
The identifier messages, the permission message, and a list still empty when you
know it should not be, are the technical contact's. Say which message you saw,
word for word, and the name shown after **Signed in as**.

---

## When you report something

Three things turn a guessing game into a two-minute fix:

- **The address of the page** you were looking at.
- **Roughly when** — "this morning", "since Tuesday" — because most of these have
  a scheduled job or a deploy behind them.
- **What you expected instead.** "The change isn't there" and "the change is
  there but the styling is gone" are different problems with the same first
  sentence.

Screenshots help more than descriptions for anything visual. You never need to
apologise for reporting something that turns out to be nothing; the cheap ones
are cheap precisely because they got looked at early.
