# Changing the textbook's title and settings

The book's title, maintainer, web address and licence are not set in this
repository any more. They're facts about the book that the whole platform uses:
the portal lists the book by its title, the suggest-an-edit form accepts
suggestions only from the book's address, and the author's app finds the book by
them. So they live in one place every service reads: this book's entry in the
platform registry,
[`textbook-registry/registry.json`](https://github.com/textbookproject2026-alt/textbook-registry/blob/main/registry.json).

You never edit the pages themselves. This book's own pages (the front page,
`README.md` and `CONTRIBUTING.md`) are filled in from a second copy of the same
values, kept in this repository's `textbook.config.json`. So a change is made in
both places, and the platform checks every day that the two agree.

## To change the title, maintainer or licence

1. **Ask the platform owner**, saying what you want the new value to be. They
   change the registry by a reviewed pull request. That's what changes the book's
   listing on the portal, and what the author's app shows.
2. **The technical contact makes the same change in `textbook.config.json`**,
   the same week (steps below). That's what rewrites the front page, `README.md`
   and `CONTRIBUTING.md`. Until both are done, the platform's daily check flags
   the book, and the portal and the book's own pages disagree.
3. The next time you publish, the front page on the site changes too.

## To change the web address

**Don't, unless the platform owner has planned it with you.** Every reader
comment is attached to the address it was made on, and nothing can move them,
so a new address starts the margin again. This book has moved twice already (see
[`what-this-book-runs-on.md`](what-this-book-runs-on.md), *The address
history*). A move is a registry change, plus the Obsidian Publish custom domain,
plus the analytics site's name, all at once. It's planned in the platform
owner's docs, not done from here.

## Editing `textbook.config.json` (the technical contact)

1. On GitHub, open `textbook.config.json` in the main folder of the repository.
2. Click the pencil (edit) icon near the top right.
3. Change the value so it matches the registry exactly, for example the text in
   quotes after `"title":`. Keep the quotes and the comma.
4. At the bottom, choose **"Create a new branch for this commit and start a pull
   request"**, then **Propose changes** and **Create pull request**.
5. Wait about a minute. An automated step rewrites the affected pages and adds
   them to your pull request. You'll see a new commit appear from
   "github-actions".
6. Once that automated commit has shown up, click **Merge pull request**.

`slug` is the book's permanent name on the platform. **Never change it.**

## Important

Don't edit `README.md`, `CONTRIBUTING.md`, `index.md`, `publish.js` or
`admin/config.yml` directly. They're written automatically,
and any direct change is overwritten. To change their wording (not just the
title), edit the matching file in the `templates` folder instead, in the same
way.
