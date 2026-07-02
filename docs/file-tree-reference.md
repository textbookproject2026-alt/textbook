# Textbook Platform — Production File Tree (Reference)

Planned file structure for the canonical textbook and its two satellite repos,
annotated with who creates each file and when. Adapted from Appendix A of the
technical plan to the locked decisions (Scenario B, CC-BY-SA-4.0, test-domain
build, Plausible per-site, Hypothes.is first-party → Publisher later, Tier 3 out).

## Coordinates

- **Canonical repo:** `github.com/textbookproject2026-alt/textbook` (public)
- **Default branch:** `main`
- **Push identity:** SSH alias `github-textbook` → key `~/.ssh/id_ed25519_textbook`
- **Staging domain:** `bptest2026.xyz` (production = Erasmus, late-stage DNS cutover)

## Legend

- **DONE** — created and committed
- **NOW** — create by hand at repo init (Week 2 / Day 6)
- **GEN Dn** — Claude generates on build day *n*
- **RUNTIME** — written by a workflow, not committed by hand
- **CONTENT** — pilot migration (M3)
- **HANDOVER** — Weeks 8–9 docs

---

## Canonical textbook repo (Obsidian Publish)

```
textbook/
├── .github/
│   ├── workflows/
│   │   ├── lint.yml                       # GEN D6 (markdownlint)            [pending]
│   │   ├── link-check.yml                 # GEN D6 (lychee + weekly cron)    [pending]
│   │   ├── stats.yml                       # GEN D6 stub → filled M5          [pending]
│   │   └── backup-annotations.yml          # GEN ~M4 (Hypothes.is export)     [pending]
│   └── ISSUE_TEMPLATE/
│       ├── typo.md                         # GEN D6                           [pending]
│       ├── suggestion.md                   # GEN D6                           [pending]
│       └── question.md                     # GEN D6                           [pending]
├── .obsidian/                              # DONE (vault config committed)
│   ├── app.json                            # DONE
│   ├── appearance.json                     # DONE
│   ├── core-plugins.json                   # DONE
│   ├── graph.json                          # DONE
│   ├── publish.json                        # DONE
│   └── workspace.json                      # IGNORED (.gitignore; deviates from Appendix A)
├── chapters/
│   ├── main.md                             # DONE (placeholder)
│   ├── page-a.md                           # DONE (placeholder)
│   ├── page-b.md                           # DONE (placeholder)
│   └── 01-…, 02-… .md                       # CONTENT (M3 pandoc migration)
├── assets/                                 # DONE (empty) → CONTENT (M3 figures)
├── community/
│   ├── contributors.md                     # RUNTIME (stats.yml, M5)
│   ├── forks.md                            # RUNTIME (stats.yml, M5)
│   └── dashboard.md                        # RUNTIME (stats.yml, M5)
├── docs/                                   # HANDOVER (Weeks 8–9)
│   ├── editing-the-textbook.md
│   ├── handling-contributions.md
│   ├── releasing-versions.md
│   ├── troubleshooting.md
│   ├── for-course-coordinators.md
│   └── starting-a-new-textbook.md
├── backups/
│   └── annotations-YYYY-MM-DD.json         # RUNTIME (backup-annotations.yml)
├── publish.css                             # DONE (placeholder) → GEN D7 (visual direction v1)
├── publish.js                              # DONE (placeholder) → GEN D8 (Hypothes.is + Plausible)
├── LICENSE                                 # DONE (CC-BY-SA-4.0, SPDX text)
├── README.md                               # DONE
├── CONTRIBUTING.md                         # DONE (3 paths: Hypothes.is / suggest-edit / fork-PR)
├── .gitignore                              # DONE (macOS + Obsidian + Node)
└── index.md                                # DONE (Publish front page)
```

Notes on the locked decisions, where they bite:
- `publish.js` (D8) embeds Hypothes.is via a `__GROUP_ID__` placeholder with a
  commented seam for the Publisher-tier swap later; Plausible uses the per-site
  `script.manual.js` variant with the staging domain baked in, re-registered to
  the Erasmus site at cutover.
- No Tier-3 artifacts appear. The Tier 2 web editor lives in the satellite
  repos, not here.
- `backup-annotations.yml` only does real work once the production Hypothes.is
  group exists (Day 12).

---

## Quartz department-edition template (separate repo, fork base for editions)

```
textbook-edition-template/
├── content/                                # synced from canonical (manual upstream merge)
│   └── .gitkeep                            # NOW (empty; coordinators populate)
├── quartz/                                 # NOW (vendored from Quartz upstream)
├── quartz.config.ts                        # GEN (theme + per-site Plausible + Hypothes.is group)
├── quartz.layout.ts                        # GEN (inject Hypothes.is embed, edition footer)
├── .github/workflows/deploy.yml            # GEN (build → Cloudflare/GitHub Pages)
├── package.json                            # NOW (Quartz deps)
├── README.md                               # GEN (how to fork, set group, deploy)
└── LICENSE                                 # GEN (CC-BY-SA-4.0, inherited)
```

Whole template repo is **~M4 (department-edition milestone)**. Each fork gets its
own Plausible site and its own Hypothes.is group ID in `quartz.config.ts` — the
one-group-per-edition rule expressed in config.

---

## Vercel suggest-edit function (separate repo, Tier 1)

```
suggest-edit-function/
├── api/
│   └── submit.js                           # GEN (endpoint: form → GitHub issue/PR via bot)
├── lib/
│   ├── github.js                           # GEN (octokit wrapper, bot PAT)
│   ├── email.js                            # GEN (Resend confirmation)
│   ├── validate.js                         # GEN (form validation)
│   └── ratelimit.js                        # GEN (abuse guard)
├── package.json                            # GEN
├── vercel.json                             # GEN
└── .env.local                              # NOW (local secrets; never committed)
```

Whole function repo is **~M4 (Tier 1 milestone)**. Commits as the `aldogo-bot`
account so suggest-edit submissions stay visually distinct from human commits.
The bot account + fine-scoped PAT are created at this point, not earlier.

---

*M4 placements for the two satellite repos are a read of the milestone map, not
pinned days — correct against the build manual if it specifies otherwise.*
