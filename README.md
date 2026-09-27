# Education Tool Project 2026

An open-access textbook maintained by Brandon. The canonical edition is published at https://social-research-methods.confused4now.org.

This repository is the single source of truth for the textbook's content. The published reading site is generated from these Markdown files; department editions are maintained as forks.

## Reading

Read the textbook at the published site above. Each page carries a margin-annotation layer (Hypothes.is) and an "Edit this page" control that proposes a change to its source file here.

## Contributing

Three ways in, lightest to heaviest: leave a margin comment via Hypothes.is, use the suggest-an-edit form, or fork the repo and open a pull request. See CONTRIBUTING.md for which to use.

## This book

**Audience: the maintainer and the technical contact.** This book is one of several on a shared platform. Its facts (address, title, summary, maintainer, licence, repo and branches) are its entry in [`textbook-registry/registry.json`](https://github.com/textbookproject2026-alt/textbook-registry/blob/main/registry.json), slug **`social-research-methods`**. Changing one is a pull request to the registry, made or approved by the platform owner, not an edit here. `textbook.config.json` holds only the slug.

| Piece | What it is |
|---|---|
| This repository | the book: `index.md`, `chapters/`, `assets/`, `glossary.md` and `community/` are what readers see. `main` is live and needs a pull request; `drafts` is the editors' holding area, and `backups` holds the annotation backups |
| The reading site | Cloudflare Pages project `social-research-methods`, built from `main` by the platform's builder, [`quartz-book`](https://github.com/textbookproject2026-alt/quartz-book), within about 15 minutes of a push. `drafts` is previewed, not indexed, at <https://drafts.social-research-methods.pages.dev>. The built site's `/.well-known/textbook.json` names the commit it was built from |
| `publish.js`, `publish.css`, `.obsidian/`, `tests/` | the Obsidian Publish site that served readers until 26 Sep 2026. Kept only so a rollback can republish; they go when Publish is cancelled (BOOK-ONE-TO-QUARTZ §8 step 20) |
| The browser editor | `admin/`, served by the Pages project `textbook-admin` at <https://textbook-admin.pages.dev>. `admin/config.yml` is kept by hand, and the registry's parity job checks it |
| Analytics | the platform's one Plausible site, `confused4now.org`. This book's pageviews are its `social-research-methods.confused4now.org` hostname |
| Annotation backups | the weekly workflow, with the repo secret `HYPOTHESIS_API_TOKEN` (the Hypothes.is account `AlecGordon`, a person's: transfer it at handover) |
| Weekly workflows | `.github/workflows/`: short callers of the platform's reusable workflows in `quartz-book` (snapshot, backup, contributors, derivatives, dashboard, link check, lint). Times are in [SCHEDULED-JOBS.md](https://github.com/textbookproject2026-alt/textbook-registry/blob/main/docs/SCHEDULED-JOBS.md) |
| Department editions | forks of [`textbook-edition-template`](https://github.com/textbookproject2026-alt/textbook-edition-template) |

**Address history.** Annotations stay on the address they were made on: `bptext2026.xyz` until 14 Sep 2026 (eight annotations, still backed up), `confused4now.org` from 14 to 20 Sep (now the platform portal; none made there), and `social-research-methods.confused4now.org` since 20 Sep. Read `textbook-registry/design/PORTAL-CUTOVER.md` before agreeing to any further move.

**Guides.** The maintainer's guides are the platform's generalised set in [`textbook-template/docs/`](https://github.com/textbookproject2026-alt/textbook-template/tree/main/docs). The platform's own services, accounts and schedules are in [`textbook-registry/docs/`](https://github.com/textbookproject2026-alt/textbook-registry/tree/main/docs). The author's Mac keeps the console's sign-in in the login Keychain (service `Authoring Assistant`) and pushes with `~/.ssh/id_ed25519_textbook` through the `github-textbook` SSH alias.

## Licence

Released under Creative Commons Attribution-ShareAlike 4.0 (CC-BY-SA-4.0). Share and adapt freely, including commercially, with attribution and under the same terms. Full text in LICENSE.
