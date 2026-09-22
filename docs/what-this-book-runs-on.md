# What this book runs on

**Audience: the book's maintainer and its technical contact.** This book is one of
several on a shared platform. This page separates what belongs to **this book**,
which you look after, from what belongs to **the platform**, which you use but
don't run. When something breaks, it tells you which side it's on, and who to ask.

**This page never records a secret value**, only where a secret is kept.

The platform's own inventory (every shared service, account and deploy pipeline)
is
[`textbook-registry/docs/INFRASTRUCTURE.md`](https://github.com/textbookproject2026-alt/textbook-registry/blob/main/docs/INFRASTRUCTURE.md).
It is kept there, not here, because it is the same for every book.

---

## Who is who

- **The maintainer** decides what the book says, and publishes it.
- **The technical contact** is whoever looks after this book's repository,
  workflows and accounts for the maintainer. On a small book, that is often the
  maintainer.
- **The platform owner** holds the registry, the shared services and the
  `confused4now.org` domain. They're the only person who can change the facts
  every service knows about this book: its address, title, maintainer, licence,
  and whether it is listed at all.

Today the platform owner and this book's technical contact are the same person.
The split still matters, because it says which hat a change needs.

---

## This book's facts, and where they live

The platform knows this book as slug **`social-research-methods`**. Its entry in
[`textbook-registry/registry.json`](https://github.com/textbookproject2026-alt/textbook-registry/blob/main/registry.json)
is the source of truth for:

| Fact | Value today |
|---|---|
| Status | `live`, listed on <https://confused4now.org> |
| Address | <https://social-research-methods.confused4now.org> |
| Title, summary, licence, maintainer | as rendered on the front page |
| Content repo | `textbookproject2026-alt/textbook`, live branch `main`, drafts branch `drafts` |
| Suggestions counted from | 2026-09-16. Everything filed before that was testing |
| Browser editor host | `textbook-admin.pages.dev` |
| Department editions | forks of `textbookproject2026-alt/textbook-edition-template` |

**Changing any of these is a pull request to the registry, made by or approved by
the platform owner.** It isn't an edit in this repository.
[`changing-settings.md`](changing-settings.md) says what that means in practice.

---

## What belongs to this book

| Piece | What it is | Held by | Breaks if gone | Guide |
|---|---|---|---|---|
| **This repository** | chapters, workflows, scripts, the CMS config, these guides. `main` needs a pull request. `drafts` (the editor's holding area) and `backups` (the annotation backups) are deliberately unprotected | `textbookproject2026-alt` | everything about the book except the live site | [`editing-the-textbook.md`](editing-the-textbook.md) |
| **The Obsidian Publish site** | the reading site. Site ID `1443b409a84e491249da35fdd4b91de6`, host `publish-01.obsidian.md` (`.obsidian/publish.json`) | a paid Publish subscription. **Whose is not recorded: confirm at handover** | the book is offline. It can be republished from the vault | [`editing-the-textbook.md`](editing-the-textbook.md), *Publishing* |
| **`publish.js`, `publish.css`** | the reader-side script (the suggest-an-edit form, the annotation embed and badge, analytics) and the theme | this repository, rendered from `templates/publish.js` | the buttons vanish from the site | [`troubleshooting.md`](troubleshooting.md) |
| **The browser editor's host** | Cloudflare Pages project `textbook-admin`, built from `admin/` on `main` | the platform's Cloudflare account, on this book's behalf | trusted contributors can't edit | [`the-browser-editor.md`](the-browser-editor.md) |
| **Analytics** | Plausible site `social-research-methods.confused4now.org`, public dashboard | a Plausible account. **Confirm at handover** | no readership figures | below |
| **The annotation backup's account** | Hypothes.is account `AlecGordon`, whose API token is the repo secret `HYPOTHESIS_API_TOKEN` | a person. **Transfer at handover** | the Sunday backup and the dashboard fail loudly | [`annotation-restore.md`](annotation-restore.md) |
| **The weekly workflows** | backup, contributors, derivatives, dashboard, link check, the weekly config render | this repository | `community/` pages go stale | [SCHEDULED-JOBS.md](https://github.com/textbookproject2026-alt/textbook-registry/blob/main/docs/SCHEDULED-JOBS.md), Part 2 |
| **The edition template** | `textbook-edition-template`, which department editions fork, and its demo at `textbook-edition-template.pages.dev` | `textbookproject2026-alt`. The demo's Cloudflare account is **not recorded** | coordinators can't start an edition | [`updating-department-editions.md`](updating-department-editions.md) |

**Repository settings the workflows need:** "Allow auto-merge" switched on
(it is), and the secret `HYPOTHESIS_API_TOKEN`. Nothing else. The workflows use
GitHub's built-in token.

**Plausible's site name must equal the registry's `analytics.plausible.site`.**
The dashboard's link is built from that field. So a domain move is two changes
that land together: the platform owner changes the registry, and whoever holds
Plausible renames the site. If they get out of step, the Sunday dashboard
publishes a dead link.

---

## What the platform provides, and what to do when it fails

You don't run any of these. When one fails, tell the platform owner and name the
row.

| Service | What this book gets from it | Symptom when it fails |
|---|---|---|
| **The registry** | the facts above, read by every service below | a change "made" in the registry hasn't reached a service yet |
| **The suggest-edit function**, with the GitHub App `textbook-suggest-edit` installed on this repo | the *Suggest an edit* form, filing issues labelled `suggested-edit` as `textbook-suggest-edit[bot]` | the form shows its generic failure message |
| **The CMS auth relay** | "Sign in with GitHub" on the browser editor | the sign-in popup opens and closes |
| **The portal** | the listing on `confused4now.org`, and the redirect that sends every old `confused4now.org/<page>` link here | old links land on the portal page instead of a chapter |
| **The DNS record** `social-research-methods.confused4now.org` | the address | the whole site stops answering |
| **The Authoring Assistant** | the author's app, and its queue of suggestions and drafts | [`the-authoring-app.md`](the-authoring-app.md) |

---

## The address history

Annotations stay on the address they were made on, so this history matters
whenever someone looks for old comments.

| Dates | Address | Now |
|---|---|---|
| until 14 Sep 2026 | `bptext2026.xyz` (staging) | eight annotations, still backed up as their own scope |
| 14–20 Sep 2026 | `confused4now.org` | the platform portal. No annotations were made there |
| from 20 Sep 2026 | `social-research-methods.confused4now.org` | current |

A third move would be the first to strand real annotations. If one is ever
proposed, read `textbook-registry/design/PORTAL-CUTOVER.md`, which is the plan
for move 2 and its record, before agreeing to it.

---

## On the author's Mac

These aren't services, but none of them can be recovered from a repository.

| Item | Where |
|---|---|
| The console's sign-in | login Keychain, service `Authoring Assistant`, account `github-token` |
| A DeepSeek key (optional) | the same service, account `deepseek-key` |
| The app's log | `~/Library/Application Support/Authoring Assistant/log.txt` |
| The push key for this repo | `~/.ssh/id_ed25519_textbook`, through the `github-textbook` SSH alias |

**How the vault itself reaches GitHub is still not written down** (item 3.2 in
[`DOCS-REMEDIATION.md`](DOCS-REMEDIATION.md)).
