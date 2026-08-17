# How versioning works here

The textbook is published once per academic year. Each yearly release is marked
with a **git tag** — a permanent, named bookmark on the project's history. Once
a tag exists, the exact state of every chapter at that moment stays reachable
forever, even as the live textbook keeps evolving.

One thing to understand up front: **the live textbook site always shows the
latest published version.** It has no version switcher and cannot display old
editions. Past versions live on GitHub, where every tagged snapshot of the
source text remains readable at a permanent link. So "the 2026–2027 edition"
is not a different website — it's a permanent GitHub link to the text as it
stood when that year's tag was created.

## How a tag maps to a permalink

When a version is tagged (for example `v0.1`), GitHub automatically gives that
snapshot a set of permanent URLs. Nothing anyone does later — edits, new
chapters, even next year's release — changes what these links show.

All tags that exist, at a glance:

    https://github.com/textbookproject2026-alt/textbook/tags

Browse the whole textbook exactly as it was at a tag:

    https://github.com/textbookproject2026-alt/textbook/tree/v0.1

A single chapter as it was at that tag (swap in the real file path):

    https://github.com/textbookproject2026-alt/textbook/blob/v0.1/index.md

Download the entire tagged version as a zip:

    https://github.com/textbookproject2026-alt/textbook/archive/refs/tags/v0.1.zip

See everything that changed since a tag:

    https://github.com/textbookproject2026-alt/textbook/compare/v0.1...main

The pattern is always the same: replace `v0.1` with any tag name from the tags
page. (`main` in these URLs means "the latest state" — a moving target, the
opposite of a tag.)

## How a course coordinator pins a teaching year

There are two mechanisms, depending on which site your students use.

**If your students read the canonical textbook site:** the site itself always
shows the latest version, so you pin by *reference*, not by site. In your
syllabus and course materials, cite the year's tag and link to its GitHub
permalink (the `tree/<tag>` URL above) as the version of record. Mid-year edits
to the live site won't move your reference — anything you need to check against
the pinned text is on GitHub, unchanged. In practice mid-year drift is small,
because new versions are published once a year, at the boundary between
academic years.

**If your department runs its own edition:** your edition is a fork — an
independent copy that only changes when *you* pull in updates from the
canonical textbook. So pinning is even simpler: **don't sync during the
teaching year.** Your site stays frozen at whatever state you last synced,
your students see a stable text all year, and when the year ends you run the
sync to catch up to the new release, review the changes, and republish for
the next cohort.

Use the tag-permalink mechanism when you point students at the canonical site
and just need a fixed version of record. Run your own edition when you need
the *rendered site itself* to stay frozen (or you've customised the content) —
that's the only way students browse a stable site all year.

## How a reader reaches a past version

A reader on the live textbook site is always reading the current version.
To see an earlier one, they go to GitHub: open the tags page (first URL above),
pick the year they want, and browse the chapters there. GitHub renders the
markdown source, so the text is perfectly readable — it just looks like plain
document pages rather than the styled textbook site. For offline use, the zip
link above hands them the complete tagged edition as files.

## Cadence

One tagged version per academic year, created as part of the annual release
(see `releasing-versions.md`). Between releases, the live site may receive
fixes; the tags never move.
