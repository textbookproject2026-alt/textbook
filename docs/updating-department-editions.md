# Updating department editions

**Audience: the technical contact.** How a change you make reaches the department
editions — and why, most of the time, it doesn't until somebody asks for it.

`docs/troubleshooting.md` ("A department edition didn't pick up a fix") tells the
author to hand this to you and says "the technical contact gives them the exact
update step". This is that step, plus the model behind it.

The coordinator-facing versions live in the template repository:
`textbook-edition-template/docs/department-edition-setup.md` ("Keeping your edition
up to date") and `textbook-edition-template/docs/resolving-sync-conflicts.md`. Send
coordinators there; this page is for you.

---

## The one thing to understand: three channels, three mechanisms

A department edition is a fork. **Nothing propagates automatically** — that is the
design, not a defect, because a coordinator teaching from a frozen site all year is
the behaviour the whole system is built around
(`docs/how-versioning-works.md`).

Three different kinds of change reach an edition three different ways, and they
never travel together. Getting these confused is the single biggest source of
"I updated it and nothing changed".

| What changed | Where you change it | How it reaches an edition | Who runs it |
|---|---|---|---|
| **Site machinery** — layout, build config, workflows, the Quartz engine | `textbook-edition-template` | the coordinator runs `./sync-upstream.sh` | coordinator |
| **Plugins** — the sidebar, search, table of contents, *Edit on GitHub*, the annotation and analytics integration | `quartz-edition-extras` (ours) or upstream `quartz-community` | the coordinator runs `npx quartz plugin update <name>` | coordinator |
| **Chapter content** | `textbook` (this repo) | the coordinator copies files by hand, yearly | coordinator |

Note what is *not* in that table: nothing you can do reaches a live edition on its
own. Every row ends with the coordinator running something. Your job in all three
cases is to publish the change and then **tell coordinators, naming which channel
it is and which command to run.**

---

## Channel 1 — site machinery

**You publish it by:** merging to `main` on
`textbookproject2026-alt/textbook-edition-template`.

**They collect it by:** running `./sync-upstream.sh` in their edition folder.

That script fetches the template as a remote, merges it into their copy, and
pushes, so their Cloudflare Pages build kicks off on its own a couple of minutes
later. Things worth knowing before you tell someone to run it:

- **It needs command-line git.** GitHub Desktop on its own does not provide it.
  The script says so, but coordinators who installed only GitHub Desktop during
  setup will hit this.
- **`content/` is theirs, always.** The script treats everything under `content/`
  as the coordinator's: if the template and their content disagree, their version
  wins and it prints `kept your version of: …`. Machinery files are the only place
  a conflict surfaces and waits for a human — most often `quartz.config.yaml`,
  because that is the one machinery file they deliberately edited during setup.
- **`bash sync-upstream.sh --abort`** cancels a half-finished merge and returns the
  edition to exactly where it was. Give coordinators this line at the same time as
  the update instruction; it is the difference between a stuck edition and a
  two-minute retry.
- **The script can update itself.** Its body is wrapped in `main()` with the call on
  the last line, deliberately, because bash reads scripts incrementally and the
  merge can rewrite the file mid-run. If you edit `sync-upstream.sh`, keep that
  shape.

**If a coordinator gets stuck in a conflict**, point them at
`textbook-edition-template/docs/resolving-sync-conflicts.md` rather than talking
them through it — it is written for someone using Obsidian and GitHub Desktop and
covers the back-out route.

---

## Channel 2 — plugins, and the pinning model

**This is the channel people miss, and it costs the most.**

`sync-upstream.sh` does **not** update plugins, and nothing else does either. They
never change on their own.

Every edition pins each plugin to an exact commit in `quartz.lock.json`. Forty-five
plugins are pinned there; forty-three come from the upstream `quartz-community`
organisation, and two are ours:

| Plugin | What it does |
|---|---|
| `edition-integrations` | injects Hypothes.is and the per-site Plausible script |
| `edit-on-github` | the *Edit on GitHub* link under every page title |

Both are installed at build time from
`https://github.com/textbookproject2026-alt/quartz-edition-extras.git`, by subdir.
See that repository's `README.md`.

The pinning is deliberate — an edition's site cannot change under its coordinator
without warning. The price is that a fix only arrives when somebody asks for it:

```
npx quartz plugin update <plugin-name>
```

run in the edition folder, then committed and pushed. **The updated pin *is* the
change** — a coordinator who runs the command but doesn't push keeps building the
old version. `npm install` must have been run in that folder at least once or the
command fails with `Cannot find package '...'`, which reads as though the template
is broken.

### How you publish a plugin change

1. Commit to `quartz-edition-extras` on `main`.
2. Update the pin in the **template's** `quartz.lock.json` — otherwise every new
   edition forked from that point still starts on the old commit.
3. Announce it, naming the plugin, so coordinators can run the update command with
   the right name.

Step 2 is easy to forget and invisible when it is. Which brings us to:

> **Live discrepancy, as of 4 September 2026 — not yet fixed.**
> `textbook-edition-template/quartz.lock.json` pins both `edition-integrations` and
> `edit-on-github` at `eece8e6`, which is **7 commits behind**
> `quartz-edition-extras` `main` (`487b814`). Everything since is unreleased to
> every edition, including the whole Hypothes.is-across-SPA-navigation fix series
> and the correction removing the Publisher-tier group-lock references. The
> template's demo site and any edition forked from it are building the old plugin.
> Bumping the pin is a config change, so it is tracked as a code-side item in
> `docs/DOCS-REMEDIATION.md` (3.5) rather than done here.

---

## Channel 3 — chapter content

**You publish it by:** the yearly release (`docs/releasing-versions.md`).

**They collect it by:** copying the changed chapter files and the `assets` folder
into their `content/` by hand. `sync-upstream.sh` deliberately leaves `content/`
alone.

Nothing here is yours to run. The one thing worth saying in the release email, and
the one coordinators most often get wrong, is that **a localised chapter that was
overwritten needs its localisation re-applied** — which is why the coordinators'
guide tells them to keep a `LOCAL-CHANGES.md` in their `content/` folder.

---

## Diagnosing "the fix didn't arrive"

Work down this list; it separates the three channels quickly.

1. **Has their site rebuilt at all recently?** Check the Deployments list in their
   Cloudflare Pages project. If the newest deployment predates your change, nothing
   has been picked up regardless of channel, and the question is why their build
   stopped — not which command to run.
2. **Is it text, or is it behaviour?** Text is channel 3 and may well be
   deliberate: a frozen site during a teaching year is what
   `docs/how-versioning-works.md` recommends.
3. **Is it a button, the sidebar, the annotation layer, or analytics?** That is
   channel 2, a plugin, and the answer is `npx quartz plugin update <name>` plus a
   push. Nine times in ten this is the one, because it is the channel nothing
   prompts them about.
4. **Is it layout, styling or the build itself?** Channel 1, `./sync-upstream.sh`.
5. **Still nothing?** Check that the pin you expect actually shipped — see the
   discrepancy note above. It is possible the fix never left the plugin repo.

---

## Announcing an update

Whatever the channel, an announcement that doesn't name the channel produces a
round of confused email. Include:

- **which of the three** it is, in plain words ("this is a plugin fix");
- **the exact command**, copy-pasteable, including the plugin name;
- **`bash sync-upstream.sh --abort`** as the escape hatch, if it is channel 1;
- **that the change is only live once they push**, for channels 1 and 2 both.

---

## Open question that touches this page

`docs/DOCS-REMEDIATION.md` item **3.4** is undecided and affects one thing here:
`docs/for-course-coordinators.md` promises coordinators they will never type a
terminal command, while both update channels above require one. The mechanics on
this page are unaffected by how that is resolved — `sync-upstream.sh` works over a
git remote either way — but *who* runs them may move from the coordinator to you.
Read this page as "what has to happen", not "who has to do it".
