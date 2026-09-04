# CMS OAuth setup — manual steps

**Operator guide. Audience: Alec.** Everything in this file has to be done by hand
in a browser: GitHub will not issue an OAuth client secret to a script, and the
secret has to be typed into Cloudflare rather than committed anywhere. Budget
about 30 minutes.

The contributor-facing guide is [docs/for-trusted-contributors.md](docs/for-trusted-contributors.md).
Do not send contributors here.

## Why Sveltia CMS and not Decap CMS

Both are alive, and the common claim that Decap is abandoned is not accurate as of
August 2026: `decap-cms-app` shipped 3.15.1 on 24 July 2026 and the repository saw
commits this week. The difference is pace and fit. Sveltia published six releases in
the four days to 18 August 2026 (currently 0.193.1) against 59 open issues; Decap
ships every few weeks against roughly 590. Two specifics decided it for this repo.
First, Netlify Identity and Git Gateway are closed to new sites, so *both* tools now
need an external OAuth relay — and Sveltia ships one it maintains itself
([sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth), a Cloudflare Worker
with a documented GitHub OAuth flow), whereas Decap leaves you choosing among
community forks of the old `netlify-cms-oauth-provider`. Second, and decisively: our
chapters have **no frontmatter** — `chapters/chapter-03.md` opens straight onto its
`#` heading. Sveltia's `format: raw` handles a body-only markdown file natively;
Decap has no equivalent, its folder collections assume a frontmatter block, and it
would start writing `---` delimiters into files that Obsidian and the Publish
pipeline expect to be plain prose. Sveltia also keeps Decap's config format, so if
the single-maintainer risk ever materialises, the migration back is a backend swap
rather than a rewrite. The cost accepted knowingly: Sveltia is pre-1.0 (GA expected
late 2026), which is why the version is pinned in `admin/index.html`.

## What you are building

Three pieces:

1. A **Cloudflare Worker** running [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth).
   It is a relay, not an identity provider. It holds the OAuth client secret,
   swaps GitHub's one-time code for an access token, and hands that token back
   to the browser. It stores nothing.
2. A **GitHub OAuth App** that the Worker authenticates against. Contributors
   authorise it with their own GitHub account, so every commit carries their
   name — there is no bot account and no shared password.
3. A **Cloudflare Pages** site serving `admin/` from this repository. Obsidian
   Publish will not serve it, and it must not try to.

Order matters, because each step needs a URL from the one before it. Steps 1
and 2 are circular, so step 1 starts with a throwaway placeholder.

## Step 0 — prerequisites

- A Cloudflare account (the free plan covers all of this).
- Admin access to `github.com/textbookproject2026-alt/textbook`.
- The `drafts` branch must exist on the remote. See "The drafts branch" below.

## Step 1 — deploy the auth Worker

1. Open <https://github.com/sveltia/sveltia-cms-auth> and use the
   **Deploy to Cloudflare Workers** button, which forks the script and deploys
   it in one pass. (Equivalent: clone it and run `wrangler deploy`.)
2. When it finishes, copy the Worker URL from the Cloudflare dashboard. It looks
   like `https://sveltia-cms-auth.YOUR-SUBDOMAIN.workers.dev`. Write it down —
   it is needed in steps 2, 3 and 5.

The Worker will not work yet. It has no credentials until step 3.

## Step 2 — register the GitHub OAuth App

Go to GitHub → your profile **Settings** → **Developer settings** →
**OAuth Apps** → **New OAuth App**. Register it under your own account rather
than the organisation unless you want other org owners to be able to rotate the
secret.

Fill in exactly:

| Field | Value |
| --- | --- |
| Application name | `Textbook CMS` |
| Homepage URL | `https://textbook-cms.pages.dev` (the Pages URL from step 4) |
| Application description | leave empty |
| Authorization callback URL | **the Worker URL from step 1, with `/callback` appended** |

So the callback is `https://sveltia-cms-auth.YOUR-SUBDOMAIN.workers.dev/callback`.
The `/callback` suffix is not optional — the Worker only listens for the OAuth
redirect on that path.

You do not have the Pages URL yet if you are following in order. Put a
placeholder in Homepage URL now and correct it after step 4; only the callback
URL is enforced by GitHub.

Then, on the app's page:

1. Copy the **Client ID**.
2. Click **Generate a new client secret** and copy it immediately. GitHub shows
   it once. If you lose it, generate another and delete the old one.

Do not commit either value. Neither belongs in this repository.

## Step 3 — give the Worker its credentials

In the Cloudflare dashboard: **Workers & Pages** → `sveltia-cms-auth` →
**Settings** → **Variables and Secrets**. Add:

| Name | Value | Notes |
| --- | --- | --- |
| `GITHUB_CLIENT_ID` | Client ID from step 2 | plain text |
| `GITHUB_CLIENT_SECRET` | Client secret from step 2 | **click Encrypt before saving** |
| `ALLOWED_DOMAINS` | `textbook-cms.pages.dev` | optional but strongly recommended |

`ALLOWED_DOMAINS` is what stops someone else's website from pointing at your
Worker and borrowing your OAuth app to mint tokens against this repo. Set it to
the production Pages hostname only. Cloudflare's per-deployment preview URLs
(`<hash>.textbook-cms.pages.dev`) will not be able to sign in as a result, which
is the behaviour we want.

Save, and let the Worker redeploy.

## Step 4 — host `admin/` on Cloudflare Pages

Obsidian Publish serves markdown notes; it will not serve an HTML application.
`admin/` therefore needs its own host. A Pages project pointed at this same
repository is the least moving parts: no second repo, no copy step, and the CMS
updates whenever `admin/` changes on `main`.

Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** →
**Connect to Git** → authorise GitHub if prompted → pick
`textbookproject2026-alt/textbook`. Then:

| Setting | Value |
| --- | --- |
| Project name | `textbook-cms` |
| Production branch | `main` |
| Framework preset | None |
| Build command | *(leave empty)* |
| Build output directory | `admin` |
| Root directory | *(leave as `/`)* |

**Build output directory: `admin`** is the important one. It means Cloudflare
uploads the contents of `admin/` and nothing else — the chapters, the Obsidian
vault config and the rest of the repository are never copied to the Pages host.
The CMS then lives at the root of the site:

- `https://textbook-cms.pages.dev/` serves `admin/index.html`
- `https://textbook-cms.pages.dev/config.yml` serves `admin/config.yml`

which is where Sveltia looks for its config by default.

If you set a placeholder Homepage URL in step 2, go back and correct it now.

## Keep `admin/` out of Obsidian Publish

`admin/index.html` and `admin/config.yml` are committed to `main` on purpose — they
are versioned alongside the book and Cloudflare Pages deploys them from there. They
must not be **published**. They are tooling, not content; a reader who stumbled onto
the config file would see the repository layout and the Worker URL, and the admin
page itself would render as a broken note in the middle of the textbook.

Two things keep it out:

1. `admin/` is listed in the `excluded` array of `.obsidian/publish.json`, which is
   committed to this repository. This operator guide (`OAUTH-SETUP.md`) is excluded
   there too — it *is* markdown, so Obsidian will happily offer it, and it describes
   the repository's plumbing rather than its subject.
2. Obsidian Publish's own file picker. The `publish.json` entry is the durable
   record, but the site's published set is ultimately whatever is ticked in the
   **Publish changes** dialog. Open it once after this change and confirm that
   nothing under `admin/` is listed for upload. If anything is, untick it.

Neither file is markdown, so Obsidian is unlikely to offer them in the first place.
Check anyway — it costs one glance and the failure mode is public.

The contributor guide explains this in plain language under "Why the CMS is not part
of the website", so contributors are not confused by the two different addresses.

## Step 5 — point the CMS at the Worker

In `admin/config.yml`, replace the placeholder on the `base_url` line with the
Worker URL from step 1:

```yaml
backend:
  name: github
  repo: textbookproject2026-alt/textbook
  branch: drafts
  base_url: https://sveltia-cms-auth.YOUR-SUBDOMAIN.workers.dev
```

`base_url` is the Worker's origin only — no `/callback`, no trailing slash.
Commit and push to `main`; Pages redeploys on its own.

## Step 6 — grant contributors access

Signing in with GitHub proves who someone is. It does not grant them anything.
For a contributor to save work they need push access to the repository:

**Repo → Settings → Collaborators and teams → Add people → role: Write.**

Write is the correct level. It permits the `cms/...` review branches and the
pull requests the CMS opens; it does not permit changing branch protection or
repository settings.

## Step 7 — protect `main` (recommended)

`branch: drafts` in `admin/config.yml` is the primary guarantee, and it holds as
long as nobody edits that line. A branch protection rule makes it hold even if
somebody does.

**Repo → Settings → Branches → Add branch ruleset** targeting `main`:

- Require a pull request before merging.
- Restrict deletions, and block force pushes.

Leave `drafts` unprotected — the CMS needs to merge its own entry PRs into it.

## The drafts branch

The CMS cannot start until `drafts` exists on the remote; it is the branch every
write is scoped to. It was created from `main` with a normal (non-force) push:

```sh
git branch drafts main
git push -u origin drafts
```

No force was needed, so this is already done. If you ever need to reset `drafts`
to match `main` after a merge, that *does* rewrite history and should be done
deliberately by hand, never from a script.

## Checking it works

1. Open `https://textbook-cms.pages.dev/` in a private window.
2. Click **Sign in with GitHub** and authorise the app. A popup that closes and
   leaves you signed out usually means `ALLOWED_DOMAINS` does not match the
   hostname you are actually on.
3. Open **Chapters** → `chapter-03` and make a trivial edit.
4. Save. Confirm on GitHub that a `cms/chapters/chapter-03` branch and a pull
   request appeared, that the PR targets **`drafts`**, and that `main` is
   untouched.

Step 4 is the one that matters. If a PR ever targets `main`, stop and re-read
the `branch` block in `admin/config.yml`.

## Troubleshooting

| Symptom | Cause |
| --- | --- |
| Sign-in popup opens then closes, still signed out | `ALLOWED_DOMAINS` does not include the hostname you are browsing, or `base_url` has a trailing slash or `/callback` on it |
| "Server not found" after authorising | Worker URL mismatch between the GitHub callback URL and `base_url` |
| Signs in, but saving fails | The contributor has read access, not Write. See step 6 |
| Editor shows the whole chapter as one text box | Correct. `format: raw` means these files have no frontmatter and the whole file is the body |
| Save adds a `---` block at the top of a chapter | `format: raw` was changed or dropped. Revert it |

## What to do if the client secret leaks

Delete the OAuth App's secret on GitHub and generate a new one, then update
`GITHUB_CLIENT_SECRET` in the Worker. Nothing in this repository needs to change.
The secret alone cannot grant repository access without a contributor completing
a GitHub sign-in, but rotate it anyway.
