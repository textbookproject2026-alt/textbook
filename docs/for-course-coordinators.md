# Setting Up Your Department Edition

**A guide for course coordinators**

This guide walks you through creating your own department edition of the textbook: a copy of the chapters you choose, on your own web address, sharing the textbook's public annotation layer with every other edition. You do everything through websites and one free desktop app.

**Setting up needs no terminal, and neither does the yearly content update.** Steps 1–8 below, and the yearly copy of revised chapters, are all browser and GitHub Desktop. If a tutorial elsewhere tells you to type a command as part of *this* work, stop and check with the maintainer first — generic Quartz tutorials in particular can damage your settings file (see the warning in Step 7).

**Two later jobs do need one, and there is no browser way to do them.** Updating the site machinery (`./sync-upstream.sh`) and updating a plugin (`npx quartz plugin update`) are terminal commands run against a copy of your fork on your own computer. They are not part of setup, they are occasional, and they only happen when the maintainer announces one. If you would rather not run them, agree with the maintainer or your technical contact that they do it for you — but somebody has to, because nothing reaches a live edition on its own. Both are written up in `textbook-edition-template/docs/department-edition-setup.md`, under "Keeping your edition up to date"; see [When the machinery updates](#when-the-machinery-updates-occasional) near the end of this guide.

Budget an afternoon (2–3 hours) the first time. Yearly updates after that take under an hour.

You can preview what a fresh, unmodified edition looks like here: **https://textbook-edition-template.pages.dev**

---

## The one idea to hold onto: there are TWO repositories

A *repository* (repo) is a project folder hosted on GitHub. This setup involves two of them, and they play very different roles:

| | The textbook | The site template |
|---|---|---|
| **Address** | `github.com/textbookproject2026-alt/textbook` | `github.com/textbookproject2026-alt/textbook-edition-template` |
| **What it is** | The book itself — every chapter, figure, and reference, maintained by the textbook maintainer | The website machinery that turns markdown chapters into a readable site |
| **What you do with it** | **Copy from it.** You take the chapters you want. You never edit this repo directly. | **Fork it.** Your fork becomes *your* repo, *your* site. This is where all your work happens. |

Think of the textbook repo as the manuscript and the template repo as the printing press. You take your own copy of the press, feed it the pages you want, and adjust the examples for your own course.

Here is how content flows through the system, including the yearly update cycle:

```mermaid
flowchart TD
    canon["Canonical textbook repo<br/>(maintained by the textbook maintainer)"] -- "yearly release" --> rel["Updated chapters"]
    rel -- "you copy the changed files (Step 3, repeated yearly)" --> fork["YOUR fork of the template<br/>content/ folder"]
    fork -- "commit + push (GitHub Desktop)" --> cf["Cloudflare Pages<br/>rebuilds automatically"]
    cf --> site["Your department site<br/>your-name.pages.dev"]
    site -- "readers click 'Edit on GitHub'" --> fork
    fork -. "fixes that belong in the book itself:<br/>report upstream via an issue or suggest-an-edit" .-> canon
```

Read it top to bottom: the book updates yearly → you copy the changes into your fork → Cloudflare rebuilds your site. Edits suggested by *your* readers land in *your* fork. Anything that should improve the book for everyone gets reported back to the canonical repo — see "Improving the textbook itself" near the end.

---

## Before you start

You need, in this order:

1. **A free GitHub account** — sign up at https://github.com
2. **GitHub Desktop** installed — free download at https://desktop.github.com (this is the one desktop app; it moves files between your computer and GitHub with buttons instead of commands)
3. **A free Cloudflare account** — sign up at https://dash.cloudflare.com/sign-up (this hosts your site, at no cost)
4. **A free Hypothes.is account** — sign up at https://hypothes.is (this powers the annotation sidebar)
5. **Your analytics line from the maintainer** — email the maintainer the web address you plan to use (you'll choose it in Step 6; something like `bio-edition-2027.pages.dev`). They will register it and send back a single line of text you'll paste in Step 7. You can request this at any point before Step 7.
6. *(Optional)* **Obsidian** — free at https://obsidian.md. A pleasant editor for the chapters. Any text editor works; Obsidian just shows links and formatting nicely.

---

## Step 1 — Fork the template (~5 min)

"Forking" creates your own copy of the template repo under your GitHub account. Your fork is fully yours: you can edit it without affecting anyone else.

1. Log in to GitHub, then open `github.com/textbookproject2026-alt/textbook-edition-template`.
2. Click the **Fork** button, top right.

   [SCREENSHOT: template repo page with the Fork button highlighted, top right]

3. On the "Create a new fork" page:
   - **Owner:** your account.
   - **Repository name:** pick something that identifies your edition, e.g. `textbook-bio-edition`. Write this name down — you'll type it again in Step 7.
   - Leave everything else as it is.
4. Click **Create fork**.

> **⚠️ Fork it — do not use the "Use this template" button.** GitHub shows both on that page and the copies look identical to you. Only a fork is recorded by GitHub as descended from the template, and the project's department-editions page is built from the template's list of forks. An edition made with "Use this template" never appears on that page, and the maintainer reads its absence as something broken. If you have already made one that way, tell the maintainer rather than working around it.

You land on your copy: `github.com/YOUR-USERNAME/textbook-bio-edition`. Bookmark it.

---

## Step 2 — Clone your fork with GitHub Desktop (~10 min)

"Cloning" downloads your fork to your computer so you can add and edit files. GitHub Desktop then syncs your changes back up with one button.

1. Open GitHub Desktop and sign in with your GitHub account (**File → Options → Accounts** on Windows, **GitHub Desktop → Settings → Accounts** on Mac).
2. **File → Clone repository…**
3. Your fork appears in the list under your username. Select it.
4. Note the **Local path** (where the folder will live on your computer — the default is fine), then click **Clone**.

   [SCREENSHOT: GitHub Desktop clone dialog with the fork selected and the Local path field visible]

You now have the repo as a normal folder on your computer. **Show in Explorer / Reveal in Finder** (in the Repository menu) opens it. Inside you'll see a `content` folder (nearly empty — that's expected), a `quartz` folder (the machinery — never touch it), and a file called `quartz.config.yaml` (you'll edit exactly four lines of it in Step 7 — nothing else, ever).

---

## Step 3 — Add the textbook content (~20 min)

Now you fill the empty `content` folder with the chapters you want, copied from the canonical textbook.

1. In your web browser, open `github.com/textbookproject2026-alt/textbook`.
2. Click the green **Code** button, then **Download ZIP**.

   [SCREENSHOT: canonical textbook repo with the green Code button open and Download ZIP highlighted]

3. Unzip the download. Inside you'll find the book's folders, including `chapters` and `assets`.
4. Using your normal file manager (Explorer / Finder), copy into your fork's `content` folder:
   - the **`chapters` folder** — copy the whole folder, then delete the chapter files you *don't* want from your copy. Keeping whole chapters intact is safer than picking paragraphs.

     **Leave the `Definitions` folder inside `chapters` completely alone.** It holds the short concept pages (`Critical Realism`, `Emergence`, `Monism`, `Retroduction`, `The Three Domains`, `Unobservables`) that every chapter links to for its hover definitions. Keep all six even if you keep only one chapter — they are small, and a missing one turns a link in the text into dead bracketed words.
   - the **`assets` folder**, complete. This holds every figure and image. Don't trim it — unused images cost nothing, but a missing one breaks a page.
   - **any top-level pages you want to carry over**, such as `glossary.md`. Nothing in the chapters links to these, so they are genuinely optional — unlike `Definitions`, which is not.

   Your fork should now look like: `content/chapters/…`, `content/chapters/Definitions/…`, `content/assets/…` — the same folder names as the textbook, just nested inside `content`.

   [SCREENSHOT: file manager showing chapters and assets folders inside the fork's content folder]

5. Open `content/index.md` in any text editor. This is your site's front page. Replace the placeholder text with your edition's title, your course/department name, and a short list of the chapters you've included. Keep the lines starting with `#` — those are headings.

**Attribution note:** the textbook is licensed CC-BY-SA-4.0, which travels with every copy. Keep the `LICENSE` file in your fork as-is, and credit the original textbook (with a link) on your front page. One sentence is enough.

*(Optional but recommended)* Open the `content` folder in Obsidian: **Open folder as vault → select the `content` folder**. You'll see the chapters exactly as readers will, with working links between pages.

---

## Step 4 — Worked example: swap a chapter's examples for your own (~20 min)

This is the whole point of a department edition: same textbook, examples your students recognise. Let's localise one.

**Scenario:** Chapter 3 illustrates its argument with general social-science examples. You teach a health-sciences cohort and want a clinical example instead.

1. Open the Chapter 3 file from `content/chapters/` in Obsidian or any text editor (Notepad, TextEdit).
2. Before editing, four formatting rules — the file is plain text with light markup:
   - Lines starting with `#`, `##`, `###` are headings. Edit the words, keep the `#` marks.
   - Text in `[[double square brackets]]` is a link to another page. Keep the brackets intact, or delete the brackets *and* the text together.
   - The block between two `---` lines at the very top of the file is metadata. Leave it alone.
   - Paragraphs are separated by one blank line. Keep it that way.
3. Find the example paragraph. Rewrite it: keep the *point* the example makes, swap the *case*. E.g. where the text illustrates emergence with a generic group-behaviour example, describe how a hospital ward's safety culture isn't reducible to any individual nurse's behaviour.
4. Save the file.

**Two things not to do:** don't rename chapter files (other pages link to them by filename), and don't move files between folders. Change what's *inside* files, not the files themselves.

---

## Step 5 — Publish your changes to GitHub (~5 min)

Your edits so far exist only on your computer. GitHub Desktop pushes them up to your fork.

1. Open GitHub Desktop. The left panel lists every file you added or changed, with the changes highlighted on the right. Skim it — this is your chance to catch accidents.
2. In the **Summary** box, bottom left, write a one-line description: `Add content, localise ch3 examples`.
3. Click **Commit to main**.
4. Click **Push origin** (the button at the top).

   [SCREENSHOT: GitHub Desktop with changed files listed, summary filled in, and the Push origin button visible]

Refresh your fork's page on github.com — your files are there. This save-describe-commit-push rhythm is the only GitHub skill you need, and it's the same every time.

From Step 6 onward, every push also rebuilds your live site automatically, in about 2–3 minutes.

---

## Step 6 — Put it on the web with Cloudflare Pages (~20 min)

> **⚠️ Pages, not Workers.** Cloudflare offers two similarly-named products in the same dashboard section. Your site is a **Pages** project. If you end up on a screen about "Workers," go back — it will not build correctly.

1. Log in at https://dash.cloudflare.com.
2. In the left sidebar, open **Workers & Pages**, then click **Create**.
3. Select the **Pages** tab.

   [SCREENSHOT: the Create screen with the Pages tab selected, Workers tab visible but NOT selected]

4. Choose **Connect to Git** (it may say "Import an existing Git repository"). Authorise Cloudflare to access your GitHub account when asked, and select your fork.
5. On the build-settings screen, enter *exactly* this — copy-paste the build command rather than retyping it:

   | Field | Value |
   |---|---|
   | **Project name** | your site's address-to-be, e.g. `bio-edition-2027` → the site will live at `bio-edition-2027.pages.dev`. Write the full address down; you need it in Step 7 (and it's what you emailed the maintainer for analytics). |
   | **Production branch** | `main` |
   | **Framework preset** | None |
   | **Build command** | copy-paste the command from the box below this table |
   | **Build output directory** | `public` |

   The build command, exactly:

   ```
   git fetch --unshallow || true && npx quartz plugin install && npx quartz build
   ```

6. Still on this screen, find **Environment variables** and add one:
   - Variable name: `NODE_VERSION`
   - Value: `22`

   [SCREENSHOT: filled-in build settings form with the build command, output directory, and NODE_VERSION variable all visible]

7. Click **Save and Deploy**. The first build takes a few minutes. When the log shows **Success**, click your site's link.

   [SCREENSHOT: successful first deployment with the pages.dev link highlighted]

Your edition is live. If the build fails instead, it's almost always one of the five values above mistyped — see "If something goes wrong" at the end.

---

## Step 7 — Set your four settings (~10 min)

Your site works, but four settings still point at placeholder values. All four live in **one file**: `quartz.config.yaml`, at the top level of your fork. The four lines are clearly marked with comments inside the file — change those four lines and nothing else.

> **A note on the numbering in the file.** The `← EDIT` comments read *"guide step 3a"*, *"3b"* and so on. Those numbers belong to the template repository's technical guide (`textbook-edition-template/docs/department-edition-setup.md`), where the same four settings are its Step 3. They are the same four lines, in the same file, with the same values — only the step number differs. In *this* guide they are all Step 7.

The easiest way to edit it is directly on github.com (no download/upload dance, and the site rebuilds itself when you save):

1. On your fork's page, click `quartz.config.yaml`, then the **pencil icon** (top right of the file view).

   [SCREENSHOT: quartz.config.yaml open on github.com with the pencil/edit icon highlighted]

2. Set the four marked values:

   | Setting | What to put there | Why |
   |---|---|---|
   | **`pageTitle`** | your edition's name, e.g. `"Biology Edition — <Textbook Title>"` | it is the heading on every page and the text in the browser tab. Leave it and your site is publicly titled *EDITION TITLE - Department Edition* — which looks entirely normal to you and tells every reader the site is unfinished |
   | **`baseUrl`** | your Pages address from Step 6, *without* `https://` — e.g. `bio-edition-2027.pages.dev` | so internal links, previews, and the sitemap point at your site |
   | **Edit-on-GitHub `repo` and `branch`** | `YOUR-USERNAME/your-repo-name` and `main` — *your fork*, from Step 1 | every page has an "Edit on GitHub" button; this makes it open *your* copy of the chapter, not someone else's |
   | **Plausible script** | the single line the maintainer emailed you (it contains `plausible.io/js/pa-…`) | your visitor statistics, privacy-friendly (no cookies, no personal data) |

   For orientation, the relevant lines look roughly like this once filled in (the comments in your actual file are the authority):

   ```yaml
   pageTitle: "Biology Edition — <Textbook Title>"

   baseUrl: bio-edition-2027.pages.dev

   # edit-on-github plugin
   repo: your-username/textbook-bio-edition
   branch: main

   # edition-integrations plugin — analytics
   # paste the pa-….js line from the maintainer here
   ```

3. Click **Commit changes**, keep the defaults, confirm. Cloudflare rebuilds automatically; two minutes later the buttons and links point at the right places.

> **⚠️ Two hard rules about this file.**
> **Never delete `quartz.config.yaml` or remove it from the repo** — the site cannot build without it, and it must stay in GitHub, not just on your computer.
> **Never run terminal commands from generic Quartz tutorials against this repo** — in particular, a command called `quartz plugin remove` silently strips every explanatory comment out of this file, including the markers this guide relies on. Nothing in *setup* requires a terminal, so a tutorial that tells you to type something here is a tutorial about a different site. The two commands that are genuinely part of running an edition — `./sync-upstream.sh` and `npx quartz plugin update` — come from the maintainer, not from a search result, and are never needed during setup. If you're ever told otherwise, ask the maintainer first.

---

## Step 8 — Annotation: the public layer, and an optional group of your own (~10 min)

Every page of your site carries an annotation sidebar: readers can highlight any sentence and attach a comment or question. Those comments go to Hypothes.is's **public layer**, which every edition shares with the canonical textbook — your edition does not get a discussion space of its own, and the platform does not create or configure one for you. This is the final arrangement, not a temporary one: per-cohort isolation was considered and not adopted.

If you would rather your cohort talked among themselves, you can set up a **private Hypothes.is group** yourself. It is entirely manual and entirely optional — nothing in the site enforces it, and students choose the group in the sidebar each time they annotate.

1. Log in at https://hypothes.is.
2. From your account menu, choose **Create new private group**.
3. Name it after the course and year, e.g. `BIO-201 2027–28` (make a fresh group each year — annotations stay with the group, so old cohorts' discussions don't bleed into new ones).
4. On the group's page, copy the **invitation link**.

   [SCREENSHOT: Hypothes.is group page with the invitation link visible]

5. Share the invitation link with your students (course intro email / LMS). Following it creates their account and joins them to the group in one step.
6. Tell students: when annotating on the site, **select the group by name in the dropdown at the top of the annotation sidebar** — the dropdown says "Public" until they change it. Annotations made in the group are visible only to group members; annotations left in "Public" are visible to everyone on the internet.

   [SCREENSHOT: annotation sidebar open on the site with the group selector dropdown expanded]

There is no way to pre-select the group for them. Doing that would need Hypothes.is's Publisher tier, which the project has decided not to buy, so a student who forgets the dropdown posts to "Public" — say so plainly when you brief them. If you do run a group, it is worth **emailing the maintainer its name and link** so the weekly annotation backup can cover it.

**Briefing your students.** There is a short student-facing guide to the annotation sidebar — reading comments, leaving one, and the two things students reliably get wrong (that comments are public, and that previous cohorts' comments are still on the page). Point them at it rather than writing your own: [[how-to-comment|Commenting in the margins]] (`docs/how-to-comment.md`). It assumes the default public layer, so if you do run a private group, add the dropdown instruction from point 6 yourself.

---

## When the textbook updates (yearly)

Each year the maintainer publishes a new edition of the canonical textbook and emails coordinators a summary of which chapters changed. Look back at the diagram at the top of this guide — the yearly update is the top edge of that loop. To bring your edition up to date:

1. Download a fresh ZIP of the canonical textbook (Step 3, points 1–3).
2. Copy the **changed** chapter files over your copies in `content/chapters/`, and copy the `assets` folder over again (new figures arrive there).
3. If a changed chapter is one you localised: your localisation was just overwritten — re-apply it to the new version of the file.
4. Commit and push in GitHub Desktop (Step 5). Your site rebuilds itself.

**Make step 3 painless for future-you:** keep a file called `LOCAL-CHANGES.md` in your `content` folder listing every localisation — which file, which section, what you changed. Five minutes of notes now saves an hour of archaeology every summer. Keep localisations few and chunky (a swapped example, an added local case study) rather than scattered one-word tweaks.

None of that needs a terminal. The next section is the part that does.

---

## When the machinery updates (occasional)

The yearly content copy above is one of **three** things that can fall out of date, and it is the only one you can do from the browser. The other two are the site machinery and the plugins, and each has exactly one command:

| What changed | How it reaches your edition |
|---|---|
| **Chapter content** — the book's text | you copy the files by hand, yearly (above). No terminal. |
| **Site machinery** — layout, styling, build fixes | `./sync-upstream.sh`, run in a copy of your fork on your computer |
| **Plugins** — the sidebar, search, contents list, *Edit on GitHub*, the annotation and analytics integration | `npx quartz plugin update <plugin-name>`, then commit and push |

Three things are worth knowing before the first announcement lands:

- **Nothing arrives on its own.** Your fork pins every plugin to a fixed version, deliberately, so your site can't change under you mid-term. The price is that a fix only reaches you when somebody runs the command — the maintainer cannot push it to you. An edition nobody ever updates keeps its bugs indefinitely, and nothing anywhere tells you so.
- **These are the two terminal jobs.** They need a local copy of your fork, Node.js 22 or newer, `npm install` run once in that folder, and command-line Git — which GitHub Desktop does *not* install on its own. The full instructions, including that first-time setup, are in `textbook-edition-template/docs/department-edition-setup.md` under "Keeping your edition up to date". If a sync stops with a conflict, `textbook-edition-template/docs/resolving-sync-conflicts.md` walks through it, and `bash sync-upstream.sh --abort` returns everything to how it was.
- **You do not have to be the one who runs them.** If a terminal isn't for you, say so to the maintainer and agree that they or a technical contact handle these two; then treat update announcements as something you forward. What doesn't work is assuming somebody else is already doing it.

---

## Improving the textbook itself

Found a typo, a factual error, or an unclear passage — something wrong with the *book*, not specific to your edition? Don't just fix your copy; your fix would vanish at the next yearly update and nobody else would benefit. Instead, report it upstream:

- the simplest route: use the **suggest-an-edit button on the canonical textbook site** and describe the fix, or
- on `github.com/textbookproject2026-alt/textbook`, open the **Issues** tab → **New issue** and describe it there.

The maintainer folds accepted fixes into the next edition, and they flow back to every department edition through the yearly update.

---

## If something goes wrong

**The Cloudflare build fails.** Nine times out of ten one of the Step 6 values is mistyped. Open the failed deployment's log in Cloudflare and check, character for character: the build command, output directory `public`, and the `NODE_VERSION` = `22` variable. Also confirm you created a **Pages** project, not a Workers one — if you're unsure, delete the project and redo Step 6 on the Pages tab.

**The site loads but images are missing.** The `assets` folder isn't inside `content`, or wasn't copied completely. Re-do Step 3, point 4, and push.

**A page shows a link that leads nowhere.** The chapter links to a page you didn't copy. Nine times out of ten it is a concept page — check that `content/chapters/Definitions/` still holds all six files. Otherwise copy the missing file from the canonical textbook into `content` too, or remove the `[[link]]` (brackets and text together) from the chapter.

**Your site is called "EDITION TITLE - Department Edition".** `pageTitle` (the first setting in Step 7) is still the placeholder. Nothing breaks, which is why this one survives to launch — check the browser tab before you send the address to anyone.

**"Edit on GitHub" opens the wrong repo or a 404.** The Edit-on-GitHub setting in Step 7 still has the placeholder, or has a typo in your username/repo name.

**You pushed changes but the site didn't change.** Check the deployments list in your Cloudflare Pages project — a build may have failed (see above). If the newest deployment says Success, hard-refresh your browser: `Ctrl+Shift+R` (Windows) / `Cmd+Shift+R` (Mac).

**Analytics dashboard shows nothing.** The Plausible line from Step 7 isn't pasted in yet, or your own browser's ad-blocker is hiding your own visits — check from a phone on mobile data.

---

## Getting help

Contact the textbook maintainer: **[MAINTAINER EMAIL — fill in at handover]**. For build problems, include the link to the failed deployment log in Cloudflare (open the deployment, copy the page URL) — it turns a guessing game into a two-minute fix.
