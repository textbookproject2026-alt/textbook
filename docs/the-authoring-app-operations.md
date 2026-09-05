# The authoring app — operations

**Audience: the technical contact.** What you have to build, create and hold for
the author's app to work, plus the two things running behind it that nothing else
in `docs/` owns: the DeepSeek egress path, and the Vercel function behind the
book's *Suggest an edit* button.

The author's own guide is
[`docs/the-authoring-app.md`](the-authoring-app.md). The service-by-service
inventory — accounts, credentials, what breaks if each disappears — is
[`docs/INFRASTRUCTURE.md`](INFRASTRUCTURE.md). This file is the operator's path
between them and does not repeat either.

---

## The repository

`https://github.com/textbookproject2026-alt/authoring-assistant` — a sibling of the
book's own repository in the same organisation (`INFRASTRUCTURE.md` §1).

Two things to know before you clone it:

- **It is cloned over HTTPS, not the `github-textbook` SSH alias** the other
  repositories use. Nothing depends on that; it is simply how it was set up, and
  it is worth knowing before you wonder why the alias does not resolve.
- **Its two docs are the real reference.** `README.md` is the author-facing text
  the app was written against; `BUILD.md` is the developer documentation. The
  author never sees either.

Tests before you ship anything: `python3 -m tests.test_all` and
`node tests/ui_flow.js`. Both are described at the end of `BUILD.md`, including how
to run the Python suite against the interpreter inside the built bundle rather than
the system one.

---

## Building, signing and notarising

The author gets a signed, notarised `.dmg` and nothing else. There is no update
mechanism: a new version means a new disk image, sent to them.

**The whole procedure is `authoring-assistant/BUILD.md`** — requirements on the
build machine, the one-time `notarytool` credential setup, `./packaging/build.sh`,
the build options, how the bundle is assembled, and the release checklist. Follow
it there rather than from memory; it is current and it explains the parts that are
not obvious (why the launcher exits immediately, why pandoc is bundled, how the app
shuts down).

What you need to have, in outline — the detail is `INFRASTRUCTURE.md` §12:

- Xcode command line tools on the build machine.
- A **Developer ID Application** certificate, for signing.
- An App Store Connect key or app-specific password, for notarisation, stored as a
  `notarytool` keychain profile and read by the build via `NOTARY_PROFILE`.

The app is around 255 MB because it carries its own copy of Python **and** its own
copy of pandoc, so the author's Mac needs nothing installed. That is deliberate;
`--no-pandoc` trades 190 MB for making the author install pandoc themselves the
first time they convert a Word document.

**If the Developer ID lapses, existing installs keep working** — nothing about the
book or the website depends on it — but no new version can be shipped without
Gatekeeper refusing it.

---

## The sign-in identifier: creating the OAuth app

The author will at some point say the app is asking for an **identifier** and they
do not have one. This is what that is.

The console half of the app signs the author in to GitHub **as themselves**, using
the OAuth **device flow**. Device flow needs no client secret, no callback address
and no relay — which is why it was chosen for a desktop app — but it does need an
OAuth app to exist, and its **Client ID** is the "identifier" the author is asked
to paste into Settings.

**Create a new OAuth app. Do not reuse "Textbook CMS".** Sharing one would mean
revoking the console also revokes the browser editor for every contributor, and the
two flows have nothing in common.

At <https://github.com/settings/developers> → **New OAuth App**:

| Field | Value |
|---|---|
| Application name | `Textbook Author Console` — the author sees this name when approving and in their list of authorised apps, so it must be recognisable |
| Homepage URL | the book's address |
| Authorization callback URL | the book's address (the form demands one; device flow never uses it) |
| **Enable Device Flow** | **ticked** |

**If Device Flow is not ticked, sign-in fails with `incorrect_client_credentials`**
and the author sees *"The sign-in identifier in Settings is not recognised."* That
is the single most likely way to strand a new author.

Do **not** generate a client secret. The app neither needs one nor has anywhere
safe to keep one.

### Giving it to the author

Copy the **Client ID** — it is not a secret — and send it to them. In the app:
**Settings → Signing in to see what is waiting →** paste **→ Save identifier**. It
is stored in `state.json` under `~/Library/Application Support/Authoring
Assistant/`, so this is once per Mac, not once per person.

Until it is set, the console shows a plain one-off-setup card rather than failing.

The scope requested is **`public_repo`**, not `repo` — enough to close a
suggestion, post a reply and accept a draft change, and no access at all to any
private repository the author owns. Do not widen it without a reason.
`BUILD.md`, *One-time sign-in setup*, has the full rationale, including why the
CMS's own OAuth app and Cloudflare relay were not reused. Revocation is at
<https://github.com/settings/applications>; the app treats a revoked token exactly
like an expired one.

---

## DeepSeek: book text leaving the university

`authoring-assistant/app/llm.py` posts to
`https://api.deepseek.com/chat/completions` (model `deepseek-chat`) with **the full
text of the chapter the author is working on**, and asks for up to 25 glossary
terms with one-sentence definitions. The answer is merged into the glossary
suggestions the deterministic checks already produced, and the author still
approves or rejects each one individually.

What is true about it today:

- **It is off unless a key is configured**, and off unless the author ticks *Also
  ask DeepSeek for glossary suggestions* when starting a chapter. There is no
  other path to it, and the tick box does not appear without a key.
- **The key is the author's own**, pasted into the app's Settings and held in the
  macOS **login Keychain** (service `Authoring Assistant`, account
  `deepseek-key`). There is no project-level DeepSeek account. A key left over
  from an older version in a file under Application Support is migrated into the
  Keychain the first time it is read.
- **It cannot break anything.** No key, no network, a rate limit, a timeout, a
  malformed answer — every failure path returns to the deterministic result and
  says so on screen.
- The chapter is truncated at 90,000 characters, and the author is told when it
  was.

**The open question, stated plainly rather than papered over.** Nothing in either
repository records **who approved sending book text to a third-party LLM**, or
**who pays for the key**. It is not covered by any of the project's other
decisions, it is not in the ethics or licensing material, and it was found by
reading the code rather than by being documented anywhere. If the book carries
material that cannot leave the institution — unpublished student work, interview
data, anything under a data agreement — this is the path it would leave by.

This is for the maintainer to settle, not for a technical contact to assume either
way. Until it is settled, the honest position is the one in the author's guide:
the feature exists, it is off by default, and it should be discussed before it is
used. Tracked as **1.3** in `docs/DOCS-REMEDIATION.md` and as §13 in
`INFRASTRUCTURE.md`.

---

## The weekly-jobs strip duplicates the health-check doc

The console's **Weekly jobs** strip shows one line per weekly workflow, saying
whether each last finished successfully. That list is **hardcoded in the app**, as
`WEEKLY_JOBS` in `authoring-assistant/app/github.py`:

| Workflow | Shown to the author as |
|---|---|
| `backup-annotations.yml` | Saving a copy of reader comments |
| `contributors.yml` | Updating the contributors page |
| `derivatives.yml` | Updating the department editions page |
| `dashboard.yml` | Rebuilding the project health page |

It is a second copy of the list in
[`docs/scheduled-actions-health-check.md`](scheduled-actions-health-check.md), and
the two have no mechanical link.

**So: adding, renaming or retiring a weekly workflow means changing both** — the
health-check doc *and* `WEEKLY_JOBS`, which needs a new build of the app to reach
the author. A workflow renamed in the repository but not in `WEEKLY_JOBS` shows the
author a job that has apparently never run; one added and not listed is simply
invisible to them.

Note the strip covers only the **four weekly** workflows. There are eight in total,
and the other four (`link-check.yml`, `lint.yml`, `apply-config.yml`, `stats.yml`)
are the health-check doc's alone — the author is not shown them and does not need
to be.

---

## The suggest-edit function

The *Suggest an edit* button on every page of the book posts to a **Vercel
serverless function**, which files the suggestion as a GitHub issue on the book's
repository as the bot account. Those issues are what the author then sees in the
console's *Suggestions from readers* queue — the two halves of this file are the
same pipeline, seen from each end.

`INFRASTRUCTURE.md` §6 is the inventory entry (URL, secret, deploys, what breaks).
`suggest-edit-function/README.md` is the full contract and behaviour, and
`TESTING.md` records the abuse-test pass. What follows is what you actually have to
watch.

### Where to look when it fails

**`vercel logs <deployment-url>` is the only place** validation rejections,
honeypot hits, rate-limit trips and GitHub failures are visible. The HTTP response
deliberately withholds that detail — the reader can read it — so there is nothing
to see from the outside and nothing is queued or retried. A failed suggestion is
lost at the door.

`docs/troubleshooting.md`, *The suggest-edit form shows an error*, tells the author
how to distinguish "the backend answered and refused" from "nothing answered at
all". That distinction is the useful thing they can give you; the logs are the rest.

### The rate limit is best-effort, and known to be

5 submissions per hour per IP, held in an **in-memory `Map` inside one serverless
instance**. Vercel runs many instances and recycles them freely, so the counter is
per-instance and **resets on every cold start**. Someone hitting different
instances gets more than five an hour.

`suggest-edit-function/README.md` calls this "a speed bump against casual
form-mashing, not a control", and defers real hardening — a shared KV or Redis
counter plus edge-level limits — to a "Day 28" that **no record shows ever
happened**. Treat the limit as protection against an enthusiastic reader, not
against anyone deliberate. Tracked as **1.6** in `docs/DOCS-REMEDIATION.md`.

The honeypot is the other half of the defence: a submission with the hidden
`website` field filled in is discarded, the sender still gets a `201`, and the hit
is logged. A bot is never told it was caught.

### `ALLOWED_ORIGIN` and the domain cutover

`ALLOWED_ORIGIN` is **hardcoded** at the top of `api/suggest-edit.js` to the
staging domain. At the production-domain cutover it must change, or every browser
POST from the new domain gets a `403` and the button fails for every reader while
looking perfectly healthy from the outside.

It is one of five places that change together at the cutover, all listed under
*The domain cutover* in [`INFRASTRUCTURE.md`](INFRASTRUCTURE.md) — read that list
before touching any of them, particularly the part about reader annotations being
anchored to page URLs. **The cutover is still nobody's named task.**

### Rotating `BOT_TOKEN`

The function authenticates as the bot account with `BOT_TOKEN`, a fine-grained
personal access token set as a Vercel environment variable in **both `production`
and `preview`**. It needs, on the book's repository only: **Issues: read and
write**, and **Metadata: read-only**.

To rotate: issue a new token on the bot account, replace the Vercel variable in
both environments, and redeploy. **No code change, and nothing else in the project
holds a copy** — it is not in any repository and not in GitHub Actions.

If it is missing or invalid the function returns `500` and every reader suggestion
is lost silently, so verify with a real submission after rotating rather than
assuming. The smoke-test commands are at the end of
`suggest-edit-function/README.md`.

---

## See also

- [`docs/the-authoring-app.md`](the-authoring-app.md) — the author's own guide.
- [`docs/INFRASTRUCTURE.md`](INFRASTRUCTURE.md) — every service, credential and
  owner; §6, §10, §12, §13 are this file's entries.
- [`docs/troubleshooting.md`](troubleshooting.md) — the author-visible failure
  modes, with the exact wording of each message.
- [`docs/scheduled-actions-health-check.md`](scheduled-actions-health-check.md) —
  the workflows behind the console's weekly-jobs strip.
- `authoring-assistant/BUILD.md` — building, signing, notarising, releasing.
- `suggest-edit-function/README.md` and `TESTING.md` — the function's contract.
