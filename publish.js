// publish.js — production (D8). Replaces the spike file.
// Obsidian Publish is a SPA: this file runs ONCE per hard load; note clicks are
// pushState navigations. Scripts load once; on every navigation we fire exactly
// one Plausible pageview and re-run the per-page injections (the content pane
// is re-rendered on nav, so anything injected into it is destroyed each time).
//
// Deploy note: Publish serves ONLY the copy uploaded via its own publish
// dialog. The repo copy is version control, not the deploy path. (Day-7 lesson.)

const DEBUG = false; // single switch for all console output

const REPO = 'textbookproject2026-alt/textbook';
const BRANCH = 'main';

// Suggest-an-edit endpoint. Placeholder until the Day-27 backend exists; the
// convention is configure.mjs's — an unfilled token is __UPPER_SNAKE__, and the
// modal below tests for exactly that shape before it will POST anything.
//
// PAYLOAD CONTRACT (fixed here so D27 has something to build against):
//   POST <SUGGEST_EDIT_ENDPOINT>
//   Content-Type: application/json
//   {
//     "name":       string,  // required, reader's display name
//     "email":      string,  // required, validated client-side (not verified)
//     "suggestion": string,  // required, <= 5000 chars — the proposed change
//     "reasoning":  string,  // optional, may be "" — why the change
//     "path":       string,  // repo-relative .md path, e.g. "chapters/Chapter 3.md"
//     "website":    string   // honeypot: ALWAYS "" from a human. Non-empty =>
//                            // discard server-side, still answer 201 (never
//                            // tell a bot it was caught).
//   }
//   201 -> { "issueUrl": string }   // link shown to the reader on success
//   4xx/5xx -> { "error": string, "userMessage"?: string }
//     "error"       diagnostic, LOG-ONLY. Never rendered — assume it may name
//                   internals, and the reader can't act on it.
//     "userMessage" OPTIONAL and user-facing: a safe, self-contained sentence
//                   the reader should actually see, e.g. "You're sending
//                   suggestions too quickly — try again in a minute." Omit it
//                   and the modal falls back to its own friendly retry copy,
//                   so only send it when it beats that. Plain text: the modal
//                   renders it with textContent (never innerHTML) and caps it
//                   at 200 chars, so no markup, links or long prose.
// No credentials, no cookies: this is a plain cross-origin JSON POST.
const SUGGEST_EDIT_ENDPOINT = 'https://suggest-edit-function.vercel.app/api/suggest-edit';

// ---------------------------------------------------------------------------
// Path mapping: live Publish URL -> repo .md path (vault root == repo root).
//
// Observed Obsidian Publish URL scheme (same as help.obsidian.md, confirmed
// against the live site at bptext2026.xyz):
//   - The URL path mirrors the vault-relative file path, minus the ".md"
//     extension. Folder nesting maps 1:1 to path segments.
//     e.g.  /chapters/page-a            -> chapters/page-a.md
//   - Case is PRESERVED. Publish does not lowercase anything; the repo path
//     must match the vault filename's exact casing.
//   - Spaces are encoded as "+" (form-style), NOT "%20".
//     e.g.  /chapters/Chapter+3         -> chapters/Chapter 3.md
//     A LITERAL "+" in a filename is percent-encoded as "%2B", so it is safe
//     to translate raw "+" to space before percent-decoding — this ordering
//     is load-bearing: decoding first would turn %2B into "+" and we could no
//     longer tell it apart from an encoded space.
//   - All other reserved characters arrive percent-encoded in
//     location.pathname (é -> %C3%A9, & -> %26, etc.). One
//     decodeURIComponent pass per segment restores them.
//   - The site home is served at "/" (and the file itself at "/index"); the
//     configured home note in this vault is the root index.md.
//   - Numbers and hyphens pass through untouched.
//
// Returns the DECODED repo path ("chapters/Chapter 3.md"). Callers building
// GitHub URLs must re-encode per segment (encodeGithubPath below) because
// GitHub wants %20 for spaces, not "+".
function urlToRepoPath(pathname) {
  // Strip query/hash defensively (callers should pass location.pathname,
  // which never contains them, but D8.2 feeds this raw strings).
  let p = pathname.split(/[?#]/)[0];

  p = p.replace(/^\/+/, '').replace(/\/+$/, ''); // trim slashes both ends

  if (p === '') return 'index.md'; // home page: "/" -> root index.md

  const decoded = p
    .split('/')
    .map((seg) => decodeURIComponent(seg.replace(/\+/g, '%20')))
    .join('/');

  return decoded + '.md';
}

// Repo path (decoded, with real spaces) -> path suitable for a github.com URL.
// encodeURIComponent per segment: spaces -> %20, keeps "/" as separator.
function encodeGithubPath(repoPath) {
  return repoPath.split('/').map(encodeURIComponent).join('/');
}

// Expose for D8.2 isolation tests: in the browser on window, in Node via
// CommonJS (the file is a plain script on Publish, so no `export` keyword).
if (typeof globalThis !== 'undefined') {
  globalThis.__tbUrlToRepoPath = urlToRepoPath;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { urlToRepoPath, encodeGithubPath };
}

// ---------------------------------------------------------------------------
// Everything below is browser-only (guarded so D8.2 can require() this file
// in Node without touching the DOM).
if (typeof document !== 'undefined') {
  (() => {
    if (window.__tbPublish) return; // run-once guard (spike-inherited)
    window.__tbPublish = true;

    const log = (...args) => { if (DEBUG) console.log('[tb]', ...args); };
    log('publish.js init');

    // Assigned by the annotation-badge IIFE below; called by the tag helper on
    // an open->closed sidebar transition (the reader may have just annotated,
    // so this page's cached count is the one entry most likely to be wrong).
    // Declared here because the tag helper is defined before the badge.
    let invalidateAnnoCache = null;

    // --- Hypothes.is (first-party flow) ---------------------------------
    // Sidebar collapsed by default; highlights always visible. No group lock:
    // on the standard tier, a `services` block switches the client into
    // third-party auth mode and 404s for a private group. First-party it is,
    // until Publisher access lands (R1, Week-4 decision).
    window.hypothesisConfig = function () {
      return {
        openSidebar: false,
        showHighlights: 'always',
        // --- Publisher-tier group lock — ENABLE WHEN PUBLISHER ACCESS LANDS.
        // Requires the Publisher-Groups partnership (R1): an authority
        // assigned by Hypothes.is and a grantToken minted server-side.
        // On the standard tier this exact block 404s — do not enable early.
        // services: [{
        //   apiUrl: 'https://hypothes.is/api/',
        //   authority: '__AUTHORITY__',
        //   grantToken: '__GRANT_TOKEN__',
        //   groups: ['__GROUP_ID__'],
        // }],
      };
    };
    {
      const s = document.createElement('script');
      s.src = 'https://hypothes.is/embed.js';
      s.async = true;
      document.head.appendChild(s);
      log('hypothes.is embed injected');
    }

    // --- Annotation tag helper --------------------------------------------
    // The Hypothes.is composer lives in the sidebar iframe (hypothes.is/
    // app.html — cross-origin), so we cannot inject UI into it, pre-fill the
    // Tags field, or intercept submission. Achievable version: while the
    // sidebar is open, float a small panel by its left edge that teaches the
    // tag convention, with copy-to-clipboard chips.
    //
    // Failure-safe BY CONSTRUCTION: the helper only READS client state — two
    // MutationObservers, no listeners on Hypothes.is elements, no DOM writes
    // inside hypothesis-* elements — and every callback funnels through
    // safely(), which tears the whole helper down on any throw. Worst case is
    // "helper absent"; annotating itself is untouched.
    (() => {
      try {
        const PANEL_ID = 'tb-tag-helper';
        const STYLE_ID = 'tb-tag-helper-style';
        // Locked vocabulary — these exact strings feed tag-filtered tooling
        // later. Do not restyle or rename.
        const TAGS = ['copy-edit', 'discussion'];

        // Dismissal scope: the whole hard load. This script runs once and the
        // panel is body-mounted (the content pane is what Publish re-renders
        // on SPA nav), so an in-memory flag naturally spans navigations — a
        // reader who closed it once meant it. Reappears on the next hard load.
        let dismissed = false;

        let arrivalObserver = null; // waits for <hypothesis-sidebar> to exist
        let arrivalTimer = null;    // give-up timer for that wait
        let probeTimer = null;      // bounded probe for a host that exists but isn't upgraded
        let probeAttempts = 0;
        let stateObserver = null;   // watches open/closed inside its shadow root
        let attachedHost = null;    // the host stateObserver is currently bound to
        let sidebarOpen = false;
        let flashTimer = null;
        // Declared before teardown so the safety path can't hit a TDZ
        // ReferenceError inside the very handler meant to make failures safe.
        let onResize = null;

        const teardown = () => {
          if (arrivalObserver) { arrivalObserver.disconnect(); arrivalObserver = null; }
          if (stateObserver) { stateObserver.disconnect(); stateObserver = null; }
          attachedHost = null;
          clearTimeout(flashTimer);
          clearTimeout(arrivalTimer);
          clearTimeout(probeTimer);
          if (onResize) window.removeEventListener('resize', onResize);
          const p = document.getElementById(PANEL_ID);
          if (p) p.remove();
        };

        const safely = (fn) => (...args) => {
          try { fn(...args); } catch (e) { log('tag helper degraded to absent:', e); teardown(); }
        };

        const injectStyle = () => {
          if (document.getElementById(STYLE_ID)) return; // survives SPA nav; id-guard like the panel
          const style = document.createElement('style');
          style.id = STYLE_ID;
          // Theme tokens throughout (declared on :root in publish.css, so they
          // reach this body-mounted panel); fallbacks mirror the token values.
          style.textContent = `
            #${PANEL_ID} {
              position: fixed;
              top: 6rem;
              right: var(--tb-tag-right, 444px); /* JS measures the sidebar edge; fallback = client's default 428px width + margin */
              z-index: 9999; /* above content, below the client's own layers */
              max-width: 15rem;
              padding: 0.75rem 0.85rem;
              border: 1px solid var(--tb-border, #E6E6E6);
              border-radius: 10px;
              background: var(--tb-bg, #FFFFFF);
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
              font-family: var(--tb-font-text, sans-serif);
              font-size: var(--tb-size-controls, 0.85rem);
              line-height: 1.4;
              color: var(--tb-ink, #2B2B2B);
            }
            #${PANEL_ID} p { margin: 0; }
            #${PANEL_ID} .tb-tag-title {
              font-weight: 600;
              margin: 0 1.25rem 0.5rem 0; /* right margin clears the × */
            }
            #${PANEL_ID} .tb-tag-chips {
              display: flex;
              gap: 0.5rem;
              margin-bottom: 0.5rem;
            }
            #${PANEL_ID} button.tb-tag-chip {
              font-family: var(--tb-font-mono, monospace);
              font-size: 0.8rem;
              padding: 0.15rem 0.6rem;
              border: 1px solid var(--tb-border, #E6E6E6);
              border-radius: 999px;
              background: var(--tb-bg-soft, #F7F7F5);
              color: var(--tb-ink, #2B2B2B);
              cursor: pointer;
            }
            #${PANEL_ID} button.tb-tag-chip:hover {
              border-color: var(--tb-accent, #7C6CF0);
              color: var(--tb-accent, #7C6CF0);
              background: var(--tb-accent-wash, #EEEBFD);
            }
            #${PANEL_ID} .tb-tag-hint { color: var(--tb-muted, #6E6E73); }
            #${PANEL_ID} .tb-tag-status {
              color: var(--tb-accent, #7C6CF0);
              margin-top: 0.35rem;
              min-height: 1.4em; /* reserve the line so the flash doesn't reflow */
            }
            #${PANEL_ID} button.tb-tag-close {
              position: absolute;
              top: 0.3rem;
              right: 0.45rem;
              font: inherit;
              line-height: 1;
              padding: 0.1rem 0.25rem;
              border: 0;
              background: none;
              color: var(--tb-faint, #9B9BA1);
              cursor: pointer;
            }
            #${PANEL_ID} button.tb-tag-close:hover { color: var(--tb-ink, #2B2B2B); }
            @media (max-width: 768px) {
              /* Below the site breakpoint the sidebar takes ~full width, so
                 there is no left edge to hug — bottom-anchor instead. */
              #${PANEL_ID} { top: auto; bottom: 0.75rem; left: 0.75rem; right: 0.75rem; max-width: none; }
            }
            @media print {
              #${PANEL_ID} { display: none !important; } /* screen-only, like .tb-page-controls */
            }
          `;
          document.head.appendChild(style);
        };

        // execCommand fallback for engines where the async clipboard API is
        // missing or permission-blocked. Textarea goes on body, never inside
        // hypothesis-* elements.
        const copyLegacy = (text) => {
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.setAttribute('readonly', '');
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          let ok = false;
          try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
          ta.remove();
          return ok;
        };

        const flash = (msg) => {
          const status = document.querySelector(`#${PANEL_ID} .tb-tag-status`);
          if (!status) return;
          status.textContent = msg;
          clearTimeout(flashTimer);
          flashTimer = setTimeout(() => { status.textContent = ''; }, 3000);
        };

        const copyTag = (tag) => {
          const done = () => flash('copied — paste into the Tags field');
          // On total failure the tag text is still visible on the chip; the
          // message repeats it so the user can type it.
          const fail = () => flash(`couldn't copy — type "${tag}" in the Tags field`);
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(tag).then(done, () => (copyLegacy(tag) ? done() : fail()));
          } else {
            copyLegacy(tag) ? done() : fail();
          }
        };

        const buildPanel = () => {
          const panel = document.createElement('div');
          panel.id = PANEL_ID;
          panel.setAttribute('role', 'note');

          const close = document.createElement('button');
          close.type = 'button';
          close.className = 'tb-tag-close';
          close.textContent = '×';
          close.setAttribute('aria-label', 'Dismiss tag helper');
          close.addEventListener('click', safely(() => { dismissed = true; teardown(); }));

          const title = document.createElement('p');
          title.className = 'tb-tag-title';
          title.textContent = 'Tag your annotation:';

          const chips = document.createElement('div');
          chips.className = 'tb-tag-chips';
          for (const tag of TAGS) {
            const chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'tb-tag-chip';
            chip.textContent = tag;
            chip.addEventListener('click', safely(() => copyTag(tag)));
            chips.append(chip);
          }

          const hint = document.createElement('p');
          hint.className = 'tb-tag-hint';
          hint.textContent = 'Add it in the Tags field under your comment.';

          const status = document.createElement('p');
          status.className = 'tb-tag-status';

          panel.append(close, title, chips, hint, status);
          return panel;
        };

        // Anchor just left of the sidebar, in the dead margin outside the
        // reading column (the selection-adder popup appears at the selection,
        // inside the column). getComputedStyle width on the host is 'auto' in
        // both states (verified live) — the bounding rect is what's real.
        const positionPanel = (host) => {
          const panel = document.getElementById(PANEL_ID);
          if (!panel) return;
          const rect = host.getBoundingClientRect();
          const fromRight = window.innerWidth - rect.left;
          const usable = fromRight > 0 && fromRight < window.innerWidth;
          panel.style.setProperty('--tb-tag-right', (usable ? fromRight + 16 : 444) + 'px');
        };

        onResize = safely(() => {
          const host = document.querySelector('hypothesis-sidebar');
          if (sidebarOpen && host) positionPanel(host);
        });

        const showPanel = (host) => {
          if (dismissed) return;
          injectStyle();
          if (!document.getElementById(PANEL_ID)) document.body.appendChild(buildPanel());
          positionPanel(host);
        };

        const hidePanel = () => {
          const p = document.getElementById(PANEL_ID);
          if (p) p.remove();
        };

        // aria-expanded on the toggle button is the primary signal (more
        // stable than utility classes); the sidebar-collapsed class is the
        // fallback. Neither exists until embed.js finishes booting → closed.
        const isOpen = (shadow) => {
          // Nothing enforces that the toggle is the only aria-expanded button in
          // there; if a client update adds another, the first match could pin
          // our state. Surface that in testing rather than narrowing the
          // selector (a narrower one would break silently on a class rename).
          if (DEBUG && shadow.querySelectorAll('button[aria-expanded]').length !== 1) {
            log('WARN expected exactly one button[aria-expanded] in sidebar shadow root, got',
              shadow.querySelectorAll('button[aria-expanded]').length);
          }
          const btn = shadow.querySelector('button[aria-expanded]');
          if (btn) return btn.getAttribute('aria-expanded') === 'true';
          const container = shadow.querySelector('.sidebar-container');
          if (container) return !container.classList.contains('sidebar-collapsed');
          return false;
        };

        const update = safely(() => {
          const host = document.querySelector('hypothesis-sidebar');
          const open = !!(host && host.shadowRoot && isOpen(host.shadowRoot));
          if (open === sidebarOpen) return;
          sidebarOpen = open;
          log('hypothesis sidebar', open ? 'open' : 'closed');
          if (open) { showPanel(host); window.addEventListener('resize', onResize); }
          else {
            hidePanel();
            window.removeEventListener('resize', onResize);
            // Just-closed sidebar is the likeliest moment for this page's count
            // to have changed (the reader annotated); drop the cached entry.
            if (invalidateAnnoCache) invalidateAnnoCache();
          }
        });

        // The sidebar is a React app: subtree+childList+attributes fires on every
        // hover, focus and annotation render, and each update() does a document
        // query plus two shadow queries. Coalesce to one read per frame.
        let updateQueued = false;
        const scheduleUpdate = () => {
          if (updateQueued) return;
          updateQueued = true;
          requestAnimationFrame(() => { updateQueued = false; update(); });
        };

        const attach = (host) => {
          if (stateObserver && host === attachedHost) return true; // already attached
          const shadow = host.shadowRoot;  // OPEN shadow root (verified live)
          if (!shadow) return false;       // element not upgraded yet — keep waiting
          // Host replaced (client teardown/reload path): stop observing the
          // detached shadow root, otherwise state freezes at its last value.
          if (stateObserver) { stateObserver.disconnect(); stateObserver = null; }
          attachedHost = host;
          stateObserver = new MutationObserver(scheduleUpdate);
          // childList too: .sidebar-container and the toggle button arrive
          // async as the client boots, and their arrival must trigger a read.
          stateObserver.observe(shadow, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ['aria-expanded', 'class'],
          });
          update();
          return true;
        };

        // embed.js boots async: <hypothesis-sidebar> is usually absent when
        // this runs. Watch the document for its arrival, then move observation
        // into its shadow root.
        //
        // If the host exists but has no shadowRoot yet, we do NOT rely on the
        // arrival observer: shadow attachment emits no mutation, and mutations
        // *inside* a shadow root are invisible to a light-DOM observer, so on a
        // page with no public annotations (no highlight spans) there may be no
        // further light-DOM write at all. Bounded probe instead — 25 tries at
        // 200 ms, then we stop for good.
        const PROBE_LIMIT = 25;

        const stopWaiting = () => {
          if (arrivalObserver) { arrivalObserver.disconnect(); arrivalObserver = null; }
          clearTimeout(arrivalTimer); arrivalTimer = null;
          clearTimeout(probeTimer); probeTimer = null;
        };

        const startShadowProbe = () => {
          if (probeTimer || stateObserver || probeAttempts >= PROBE_LIMIT) return;
          probeTimer = setTimeout(safely(() => {
            probeTimer = null;
            probeAttempts++;
            if (stateObserver) return;
            if (tryAttach()) stopWaiting();
            else if (probeAttempts >= PROBE_LIMIT) log('sidebar host never upgraded — probe exhausted');
          }), 200);
        };

        const tryAttach = () => {
          const host = document.querySelector('hypothesis-sidebar');
          if (!host) return false;
          if (attach(host)) return true;
          startShadowProbe(); // host present, not upgraded yet
          return false;
        };
        if (!tryAttach()) {
          arrivalObserver = new MutationObserver(safely(() => {
            if (tryAttach()) stopWaiting();
          }));
          arrivalObserver.observe(document.documentElement, { childList: true, subtree: true });
          // If embed.js is blocked (adblock, CSP, offline) the host never
          // appears and this observer would otherwise re-run on every Publish
          // pane re-render for the whole session. Give up after 15s.
          arrivalTimer = setTimeout(safely(() => {
            arrivalTimer = null;
            if (!stateObserver && arrivalObserver) {
              arrivalObserver.disconnect();
              arrivalObserver = null;
              log('hypothesis-sidebar never appeared — released arrival observer');
            }
          }), 15000);
        }
        log('tag helper armed');
      } catch (e) {
        // Degrade to "helper absent" — everything else in this file untouched.
        log('tag helper failed to arm:', e);
      }
    })();

    // --- Annotation count badge -------------------------------------------
    // Per-page count of PUBLIC-layer annotations from the unauthenticated
    // Hypothes.is search API. Public layer only is CORRECT for launch mode:
    // private test-group annotations won't appear in the count — that is the
    // expected behaviour, not a bug. No token in this file, ever.
    //
    // Endpoint (verified against the live API, 2026-07): GET
    //   https://api.hypothes.is/api/search?limit=0&uri=<page URL>
    // accepts limit=0 and returns { total: N, rows: [] } — total is the full
    // match count regardless of limit, so we never transfer annotation bodies.
    // URI note: we query origin + pathname exactly as served (Publish note
    // URLs carry no query/hash); Hypothes.is normalises URIs server-side, so
    // this matches what the embedded client anchors against.
    //
    // Publisher seam (R1): when Publisher access lands, the group-scoped
    // count goes here — add `group=<GROUP_ID>` (+ auth) to this same query.
    //
    // Failure-safe like the tag helper: armed inside try/catch, every async
    // path caught, worst case is "badge absent" — annotation, Plausible, and
    // the page controls are untouched.
    const injectAnnoBadge = (() => {
      try {
        const API = 'https://api.hypothes.is/api/search';
        const BADGE_CLASS = 'tb-anno-badge';
        const STYLE_ID = 'tb-anno-badge-style';
        const CACHE_PREFIX = 'tb-anno-count:'; // sessionStorage, keyed by repo path
        const CACHE_TTL = 5 * 60 * 1000;       // 5 minutes
        const FETCH_TIMEOUT = 6000;            // ms; adblock stalls hit this too

        let controller = null; // in-flight request; aborted only on a real path change
        let inflight = null;   // { path, promise } — re-injections of the same page share it

        // Keyed by the CANONICAL repo path, so "/" and "/index" (and trailing-
        // slash variants) share one entry instead of splitting the home note's
        // count across two. The "v1:" is the query schema version: bump it when
        // the uri=/group= shape changes (Publisher seam) so counts cached under
        // the old public-layer query aren't served after deploy.
        const cacheKey = (path) => CACHE_PREFIX + 'v1:' + path;

        // sessionStorage can throw (privacy modes, quota) — treat as cache-miss.
        const cacheGet = (path) => {
          try {
            const raw = sessionStorage.getItem(cacheKey(path));
            if (!raw) return null;
            const { t, n } = JSON.parse(raw);
            // age >= 0 rejects entries from the future: a backwards clock
            // adjustment would otherwise pin a stale count indefinitely.
            const age = Date.now() - t;
            return age >= 0 && age < CACHE_TTL && Number.isFinite(n) ? n : null;
          } catch (e) { return null; }
        };
        const cachePut = (path, n) => {
          try {
            sessionStorage.setItem(cacheKey(path), JSON.stringify({ t: Date.now(), n }));
          } catch (e) { /* cache is an optimisation; losing it is fine */ }
        };
        // Finding 11: called by the tag helper when the sidebar closes.
        invalidateAnnoCache = () => {
          try { sessionStorage.removeItem(cacheKey(urlToRepoPath(location.pathname))); }
          catch (e) { /* nothing to do; the TTL still bounds staleness */ }
        };

        // Canonical page URL for uri=. Derived from the canonical repo path so
        // the duplicate URLs collapse to one query — but re-expanded to the URL
        // form Publish actually serves (".md" dropped, spaces back to "+", home
        // note back to "/"), because that is what the embedded client anchors
        // against. Querying the literal repo path would match nothing.
        const canonicalUri = (repoPath) => {
          const bare = repoPath.replace(/\.md$/, '');
          if (bare === 'index') return location.origin + '/';
          const encoded = bare
            .split('/')
            .map((seg) => encodeURIComponent(seg).replace(/%20/g, '+'))
            .join('/');
          return location.origin + '/' + encoded;
        };

        const injectStyle = () => {
          if (document.getElementById(STYLE_ID)) return;
          const style = document.createElement('style');
          style.id = STYLE_ID;
          // Same theme tokens (and fallbacks) as the tag-helper chips, so the
          // badge reads as part of the existing control row. It lives inside
          // .tb-page-controls, so mobile layout follows the row's own rules.
          style.textContent = `
            button.${BADGE_CLASS} {
              font-family: var(--tb-font-text, sans-serif);
              font-size: var(--tb-size-controls, 0.85rem);
              line-height: 1.4;
              padding: 0.15rem 0.7rem;
              border: 1px solid var(--tb-border, #E6E6E6);
              border-radius: 999px;
              background: var(--tb-bg-soft, #F7F7F5);
              color: var(--tb-muted, #6E6E73);
              cursor: pointer;
            }
            button.${BADGE_CLASS}:hover {
              border-color: var(--tb-accent, #7C6CF0);
              color: var(--tb-accent, #7C6CF0);
              background: var(--tb-accent-wash, #EEEBFD);
            }
          `;
          document.head.appendChild(style);
        };

        // Open the sidebar via the client's own toggle button in the OPEN
        // shadow root of <hypothesis-sidebar> (same access path the tag
        // helper reads state from — host element only, never the iframe).
        // Only click when collapsed: the badge is an "open" affordance, not
        // a blind toggle.
        //
        // The client can be absent at click time (embed.js blocked, or still
        // booting — api.hypothes.is answers first on a warm cache). Report that
        // on the badge itself instead of doing nothing visible. The handler
        // stays attached and the label is restored on any later click that
        // finds a host, so a slow boot recovers without a navigation.
        const BLOCKED_TEXT = 'annotation tools blocked';
        const openSidebar = (badge, label) => {
          try {
            const host = document.querySelector('hypothesis-sidebar');
            if (!host) {
              if (badge) badge.textContent = BLOCKED_TEXT;
              log('anno badge: no sidebar host at click time');
              return;
            }
            if (badge && badge.textContent === BLOCKED_TEXT) badge.textContent = label;
            // Same single-toggle assumption as the tag helper's isOpen();
            // assert rather than narrow, so a client update surfaces in testing.
            if (DEBUG && host && host.shadowRoot &&
                host.shadowRoot.querySelectorAll('button[aria-expanded]').length !== 1) {
              log('WARN expected exactly one button[aria-expanded] in sidebar shadow root, got',
                host.shadowRoot.querySelectorAll('button[aria-expanded]').length);
            }
            const btn = host && host.shadowRoot &&
              host.shadowRoot.querySelector('button[aria-expanded]');
            if (btn && btn.getAttribute('aria-expanded') !== 'true') btn.click();
          } catch (e) { log('anno badge: sidebar toggle unavailable', e); }
        };

        const place = (wrap, count) => {
          if (!wrap.isConnected) return; // pane re-rendered while we fetched
          injectStyle();
          const old = wrap.querySelector('.' + BADGE_CLASS);
          if (old) old.remove();
          const b = document.createElement('button');
          b.type = 'button';
          b.className = BADGE_CLASS;
          // N=0 is an invitation, not emptiness.
          // Always a button: the host is routinely absent at place time (a
          // cached count renders before embed.js finishes booting), so gating
          // the affordance on it here would strip a working client's badge.
          // Whether the client is reachable is decided at click time instead.
          const label = count === 0 ? 'Annotate this page'
            : count === 1 ? '1 annotation'
            : count + ' annotations';
          b.textContent = label;
          b.addEventListener('click', () => openSidebar(b, label));
          wrap.append(b);
          log('anno badge:', count, 'for', wrap.dataset.path);
        };

        const fetchCount = async (uri) => {
          const c = (controller = new AbortController());
          const timer = setTimeout(() => c.abort(), FETCH_TIMEOUT);
          try {
            const res = await fetch(API + '?limit=0&uri=' + encodeURIComponent(uri), {
              signal: c.signal,
            });
            if (!res.ok) throw new Error('search API HTTP ' + res.status);
            const n = Number((await res.json()).total);
            if (!Number.isFinite(n) || n < 0) throw new Error('no usable total');
            return n;
          } finally {
            clearTimeout(timer);
            if (controller === c) controller = null;
          }
        };

        // Re-injections of the SAME page (Publish wipes the pane, or the target
        // chain flips to a more specific element) must not cancel the request
        // already running for it — a search round trip routinely outlives the
        // re-render window, so cancel-and-restart could loop without ever
        // resolving. Share the in-flight promise instead; abort only when the
        // canonical path actually changed, i.e. a real navigation.
        const countFor = (path, uri) => {
          if (inflight && inflight.path === path) return inflight.promise;
          if (controller) controller.abort(); // different page now — newest wins
          const promise = fetchCount(uri).finally(() => {
            if (inflight && inflight.path === path) inflight = null;
          });
          inflight = { path, promise };
          return promise;
        };

        // Called by injectControls with the freshly injected controls row.
        // Fire-and-forget: nothing awaits it, nothing downstream depends on it.
        return (wrap) => {
          (async () => {
            try {
              // Canonical repo path: cache key, dedupe key and staleness guard.
              const path = urlToRepoPath(location.pathname);
              const cached = cacheGet(path);
              if (cached !== null) { place(wrap, cached); return; } // no API hit
              const n = await countFor(path, canonicalUri(path));
              if (urlToRepoPath(location.pathname) !== path) return; // raced a rapid nav — drop
              cachePut(path, n);
              place(wrap, n);
            } catch (e) {
              // API error, timeout, CORS surprise, adblock, abort: no badge,
              // nothing else affected.
              log('anno badge quiet fail:', e);
            }
          })();
        };
      } catch (e) {
        log('anno badge failed to arm:', e);
        return () => {}; // feature absent; call sites stay valid
      }
    })();

    // --- Plausible (new per-site hashed script) --------------------------
    // Site identity lives in the hashed filename — no data-domain, and the
    // legacy script.js / script.manual.js variants are gone. Queue stub first
    // so early calls buffer; init with auto pageviews OFF because we fire
    // them ourselves on SPA nav (exactly-once guarantee via URL dedupe).
    {
      window.plausible =
        window.plausible ||
        function () { (window.plausible.q = window.plausible.q || []).push(arguments); };
      window.plausible.init =
        window.plausible.init || function (i) { window.plausible.o = i || {}; };

      const s = document.createElement('script');
      s.async = true;
      s.src = 'https://plausible.io/js/pa-eii3VlmU1ClI0VxGOsCTe.js';
      document.head.appendChild(s);

      window.plausible.init({ autoCapturePageviews: false });
      log('plausible injected (manual pageviews)');
    }

    const firePageview = () => {
      window.plausible('pageview');
      log('pageview:', location.pathname);
    };


    // --- Suggest-an-edit modal --------------------------------------------
    // Tier-1 contribution path: readers who won't touch GitHub type a change
    // here, and the D27 backend turns it into an issue. Opened by the
    // "Suggest an edit" button in the controls row.
    //
    // Same structural safety pattern as the tag helper and the badge: armed
    // once inside try/catch, and any failure means the feature is simply
    // ABSENT — this returns null, the button keeps its previous behaviour, and
    // annotation / Plausible / the controls row are untouched. The module runs
    // once per hard load; the dialog itself is built per open and torn down on
    // close, so no state survives a navigation.
    const openSuggestModal = (() => {
      try {
        const OVERLAY_ID = 'tb-suggest-overlay';
        const STYLE_ID = 'tb-suggest-style';
        const TITLE_ID = 'tb-suggest-title';
        const MAX_SUGGESTION = 5000;
        const FETCH_TIMEOUT = 10000; // ms, via AbortController

        // Unfilled placeholder => no backend yet => the submit path skips the
        // network but still renders the success pane (so that path is exercised
        // and the reader gets a straight answer instead of a silent no-op).
        const endpointReady = !/^__[A-Z0-9_]+__$/.test(SUGGEST_EDIT_ENDPOINT);

        // Deliberately loose: this catches typos, not invalid addresses. Real
        // verification is the backend's problem; input type=email gives the
        // mobile keyboard and the browser's own hint.
        const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        // Optional user-facing string from an error response (see the contract
        // at the top of this file). Treated as untrusted TEXT: type-checked,
        // trimmed, capped, and rendered via textContent — never innerHTML —
        // so a compromised or sloppy backend can inject copy at worst, not
        // markup. Anything that isn't a non-empty string means "no message",
        // and the pane's own copy stands in.
        const USER_MESSAGE_MAX = 200;
        const safeUserMessage = (data) => {
          const m = data && typeof data.userMessage === 'string' ? data.userMessage.trim() : '';
          return m ? m.slice(0, USER_MESSAGE_MAX) : null;
        };

        const injectStyle = () => {
          if (document.getElementById(STYLE_ID)) return; // id-guard, like the badge/helper
          const style = document.createElement('style');
          style.id = STYLE_ID;
          // Theme tokens with literal fallbacks, same convention as the tag
          // helper and badge — the overlay is body-mounted, so it depends on
          // the :root declarations in publish.css and degrades to the fallbacks
          // if that cascade ever fails to reach it.
          style.textContent = `
            #${OVERLAY_ID} {
              position: fixed;
              inset: 0;
              z-index: 10000; /* above the tag helper (9999) and the client's layers */
              display: flex;
              align-items: flex-start;
              justify-content: center;
              padding: 3rem 1rem;
              overflow-y: auto;
              background: rgba(0, 0, 0, 0.45);
              font-family: var(--tb-font-text, sans-serif);
              font-size: var(--tb-size-controls, 0.85rem);
              line-height: 1.5;
              color: var(--tb-ink, #2B2B2B);
            }
            #${OVERLAY_ID} [hidden] { display: none !important; }
            #${OVERLAY_ID} .tb-sg-dialog {
              width: 100%;
              max-width: 34rem;
              padding: 1.5rem 1.5rem 1.25rem;
              border: 1px solid var(--tb-border, #E6E6E6);
              border-radius: 12px;
              background: var(--tb-bg, #FFFFFF);
              box-shadow: 0 8px 30px rgba(0, 0, 0, 0.18);
            }
            #${OVERLAY_ID} .tb-sg-head {
              display: flex;
              align-items: baseline;
              justify-content: space-between;
              gap: 1rem;
              margin-bottom: 0.75rem;
            }
            #${OVERLAY_ID} h2 {
              margin: 0;
              font-family: var(--tb-font-text, sans-serif);
              font-size: 1.15rem;
              font-weight: 600;
              color: var(--tb-ink, #2B2B2B);
            }
            #${OVERLAY_ID} .tb-sg-intro {
              margin: 0 0 1rem;
              color: var(--tb-muted, #6E6E73);
            }
            #${OVERLAY_ID} .tb-sg-field { margin-bottom: 0.9rem; }
            #${OVERLAY_ID} label {
              display: block;
              margin-bottom: 0.25rem;
              font-weight: 600;
            }
            #${OVERLAY_ID} .tb-sg-opt {
              font-weight: 400;
              color: var(--tb-muted, #6E6E73);
            }
            #${OVERLAY_ID} input,
            #${OVERLAY_ID} textarea {
              display: block;
              width: 100%;
              box-sizing: border-box;
              padding: 0.45rem 0.6rem;
              border: 1px solid var(--tb-border, #E6E6E6);
              border-radius: 8px;
              background: var(--tb-bg, #FFFFFF);
              color: var(--tb-ink, #2B2B2B);
              font-family: inherit;
              font-size: 1rem; /* >=16px equivalent: stops iOS zooming on focus */
              line-height: 1.45;
            }
            #${OVERLAY_ID} textarea { resize: vertical; min-height: 6rem; }
            #${OVERLAY_ID} input:focus-visible,
            #${OVERLAY_ID} textarea:focus-visible,
            #${OVERLAY_ID} button:focus-visible,
            #${OVERLAY_ID} a:focus-visible {
              outline: 2px solid var(--tb-accent, #7C6CF0);
              outline-offset: 2px;
            }
            #${OVERLAY_ID} input[readonly] {
              background: var(--tb-bg-soft, #F7F7F5);
              color: var(--tb-muted, #6E6E73);
              font-family: var(--tb-font-mono, monospace);
              font-size: 0.9rem;
            }
            #${OVERLAY_ID} [aria-invalid="true"] { border-color: #B3261E; }
            #${OVERLAY_ID} .tb-sg-err {
              margin: 0.25rem 0 0;
              min-height: 0;
              color: #B3261E;
            }
            #${OVERLAY_ID} .tb-sg-count {
              margin: 0.25rem 0 0;
              color: var(--tb-muted, #6E6E73);
            }
            /* Honeypot: visually hidden the screen-reader-only way, NOT
               display:none — bots skip display:none fields, and this one only
               works if it looks fillable. aria-hidden + tabindex=-1 keep every
               human (pointer, keyboard, AT) away from it. */
            #${OVERLAY_ID} .tb-sg-hp {
              position: absolute;
              width: 1px;
              height: 1px;
              padding: 0;
              margin: -1px;
              overflow: hidden;
              clip: rect(0 0 0 0);
              clip-path: inset(50%);
              white-space: nowrap;
              border: 0;
            }
            #${OVERLAY_ID} .tb-sg-actions {
              display: flex;
              align-items: center;
              gap: 0.75rem;
              margin-top: 1.1rem;
            }
            #${OVERLAY_ID} button.tb-sg-btn {
              font: inherit;
              font-weight: 600;
              padding: 0.45rem 1.1rem;
              border: 1px solid var(--tb-accent, #7C6CF0);
              border-radius: 999px;
              background: var(--tb-accent, #7C6CF0);
              color: #FFFFFF;
              cursor: pointer;
            }
            #${OVERLAY_ID} button.tb-sg-btn:hover:not(:disabled) {
              background: var(--tb-accent-hover, #6A57E0);
              border-color: var(--tb-accent-hover, #6A57E0);
            }
            #${OVERLAY_ID} button.tb-sg-btn:disabled { opacity: 0.6; cursor: default; }
            #${OVERLAY_ID} button.tb-sg-quiet {
              font: inherit;
              padding: 0.45rem 0.6rem;
              border: 0;
              background: none;
              color: var(--tb-muted, #6E6E73);
              cursor: pointer;
            }
            #${OVERLAY_ID} button.tb-sg-quiet:hover { color: var(--tb-ink, #2B2B2B); }
            #${OVERLAY_ID} button.tb-sg-close {
              font: inherit;
              font-size: 1.25rem;
              line-height: 1;
              padding: 0.15rem 0.35rem;
              border: 0;
              background: none;
              color: var(--tb-faint, #9B9BA1);
              cursor: pointer;
            }
            #${OVERLAY_ID} button.tb-sg-close:hover { color: var(--tb-ink, #2B2B2B); }
            #${OVERLAY_ID} .tb-sg-pane:focus { outline: none; } /* programmatic focus target */
            #${OVERLAY_ID} .tb-sg-pane-title {
              margin: 0 0 0.5rem;
              font-size: 1.05rem;
              font-weight: 600;
            }
            #${OVERLAY_ID} .tb-sg-pane p { margin: 0 0 0.75rem; }
            #${OVERLAY_ID} .tb-sg-pane a { color: var(--tb-accent, #7C6CF0); }
            @media (max-width: 768px) {
              /* Full-width sheet: the dialog IS the screen below the breakpoint. */
              #${OVERLAY_ID} { padding: 0; align-items: stretch; }
              #${OVERLAY_ID} .tb-sg-dialog {
                max-width: none;
                min-height: 100%;
                border: 0;
                border-radius: 0;
              }
            }
            @media print {
              #${OVERLAY_ID} { display: none !important; } /* screen-only, like .tb-page-controls */
            }
          `;
          document.head.appendChild(style);
        };

        // One labelled field: <label for> + control + its error paragraph.
        // aria-describedby is recomputed (never blindly overwritten) so the
        // character counter and an error message can coexist on the textarea.
        const makeField = (id, labelText, control, optional) => {
          const wrap = document.createElement('div');
          wrap.className = 'tb-sg-field';

          const label = document.createElement('label');
          label.setAttribute('for', id);
          label.textContent = labelText;
          if (optional) {
            const opt = document.createElement('span');
            opt.className = 'tb-sg-opt';
            opt.textContent = ' (optional)';
            label.append(opt);
          }

          const err = document.createElement('p');
          err.className = 'tb-sg-err';
          err.id = id + '-err';

          control.id = id;
          if (!optional && !control.readOnly) control.required = true;
          wrap.append(label, control, err);
          return { wrap, control, err, hintId: null };
        };

        const describe = (f) => {
          const ids = [];
          if (f.err.textContent) ids.push(f.err.id);
          if (f.hintId) ids.push(f.hintId);
          if (ids.length) f.control.setAttribute('aria-describedby', ids.join(' '));
          else f.control.removeAttribute('aria-describedby');
        };
        const invalidate = (f, msg) => {
          f.control.setAttribute('aria-invalid', 'true');
          f.err.textContent = msg;
          describe(f);
        };
        const clearInvalid = (f) => {
          if (!f.control.hasAttribute('aria-invalid')) return;
          f.control.removeAttribute('aria-invalid');
          f.err.textContent = '';
          describe(f);
        };

        // Only one modal at a time; set while open so the nav handler can shut
        // it (Publish wipes the content pane on navigation, which destroys the
        // button we return focus to and makes the shown path a lie).
        let close = null;

        const open = (repoPath, trigger) => {
          if (close) return; // already open — id-guard equivalent for a body-mounted modal
          injectStyle();

          const previouslyFocused =
            trigger || (document.activeElement instanceof HTMLElement ? document.activeElement : null);
          const bodyOverflow = document.body.style.overflow;
          let controller = null; // in-flight submit
          let submitting = false;

          const overlay = document.createElement('div');
          overlay.id = OVERLAY_ID;

          const dialog = document.createElement('div');
          dialog.className = 'tb-sg-dialog';
          dialog.tabIndex = -1; // fallback focus target for the trap
          dialog.setAttribute('role', 'dialog');
          dialog.setAttribute('aria-modal', 'true');
          dialog.setAttribute('aria-labelledby', TITLE_ID);

          const head = document.createElement('div');
          head.className = 'tb-sg-head';
          const title = document.createElement('h2');
          title.id = TITLE_ID;
          title.textContent = 'Suggest an edit';
          const closeBtn = document.createElement('button');
          closeBtn.type = 'button';
          closeBtn.className = 'tb-sg-close';
          closeBtn.textContent = '×';
          closeBtn.setAttribute('aria-label', 'Close suggestion form');
          head.append(title, closeBtn);

          // A real <form>: Enter-to-submit and native validation UI come free,
          // and the submit handler is the single entry point for both.
          const form = document.createElement('form');
          form.noValidate = true; // our messages, in our panes — not the browser's bubbles

          const intro = document.createElement('p');
          intro.className = 'tb-sg-intro';
          intro.textContent =
            'Spotted something to fix or improve? Describe the change and it goes to the maintainers as an issue.';

          const nameInput = document.createElement('input');
          nameInput.type = 'text';
          nameInput.name = 'name';
          nameInput.autocomplete = 'name';
          const nameField = makeField('tb-sg-name', 'Your name', nameInput);

          const emailInput = document.createElement('input');
          emailInput.type = 'email';
          emailInput.name = 'email';
          emailInput.autocomplete = 'email';
          const emailField = makeField('tb-sg-email', 'Your email', emailInput);

          const pathInput = document.createElement('input');
          pathInput.type = 'text';
          pathInput.name = 'path';
          pathInput.readOnly = true;
          pathInput.value = repoPath;
          // Readonly, not disabled: it stays focusable and copyable, and the
          // reader can see exactly which page they are editing.
          const pathField = makeField('tb-sg-path', 'Page you are editing', pathInput);

          const suggestion = document.createElement('textarea');
          suggestion.name = 'suggestion';
          suggestion.rows = 6;
          suggestion.maxLength = MAX_SUGGESTION;
          const suggestionField = makeField('tb-sg-suggestion', 'Your suggested change', suggestion);
          const count = document.createElement('p');
          count.className = 'tb-sg-count';
          count.id = 'tb-sg-count';
          suggestionField.hintId = count.id;
          const renderCount = () => {
            const left = MAX_SUGGESTION - suggestion.value.length;
            count.textContent = left + ' character' + (left === 1 ? '' : 's') + ' remaining';
          };
          renderCount();
          describe(suggestionField);
          // No live region on the counter: announcing on every keystroke makes
          // the field unusable with a screen reader. aria-describedby means it
          // is read on focus, and the maxlength attribute is the real backstop.
          suggestion.addEventListener('input', () => { renderCount(); clearInvalid(suggestionField); });
          suggestionField.wrap.append(count);

          const reasoning = document.createElement('textarea');
          reasoning.name = 'reasoning';
          reasoning.rows = 3;
          const reasoningField = makeField('tb-sg-reasoning', 'Why', reasoning, true);

          for (const f of [nameField, emailField]) {
            f.control.addEventListener('input', () => clearInvalid(f));
          }

          // Honeypot. The input NAME is the bait — "website" is what naive
          // form-fillers look for — and clipping (see .tb-sg-hp) keeps it
          // visually gone while a bot reading the computed style still
          // believes it is a live field.
          //
          // Hiding it from assistive tech is a correctness requirement, not
          // polish: a screen-reader user who reaches this field and fills it
          // in honestly would have their suggestion silently discarded as
          // spam. Four independent guards, because one of them failing is
          // invisible from the outside:
          //   - aria-hidden on the WRAPPER  -> hides the whole subtree
          //   - aria-hidden on the INPUT    -> survives any restructuring of
          //                                    the wrapper (the input is the
          //                                    element a live probe checks)
          //   - tabindex=-1                 -> unreachable by keyboard, which
          //                                    is what makes aria-hidden on a
          //                                    form control legitimate here
          //   - label "Leave this field empty" -> plain-text last resort if
          //                                    every ARIA guard is ignored
          const hpWrap = document.createElement('div');
          hpWrap.className = 'tb-sg-hp';
          hpWrap.setAttribute('aria-hidden', 'true');
          const hpLabel = document.createElement('label');
          hpLabel.setAttribute('for', 'tb-sg-website');
          hpLabel.textContent = 'Leave this field empty';
          const hp = document.createElement('input');
          hp.type = 'text';
          hp.name = 'website';
          hp.id = 'tb-sg-website';
          hp.tabIndex = -1;
          hp.autocomplete = 'off';
          hp.setAttribute('aria-hidden', 'true');
          hpWrap.append(hpLabel, hp);

          const actions = document.createElement('div');
          actions.className = 'tb-sg-actions';
          const submitBtn = document.createElement('button');
          submitBtn.type = 'submit';
          submitBtn.className = 'tb-sg-btn';
          submitBtn.textContent = 'Send suggestion';
          const cancelBtn = document.createElement('button');
          cancelBtn.type = 'button';
          cancelBtn.className = 'tb-sg-quiet';
          cancelBtn.textContent = 'Cancel';
          actions.append(submitBtn, cancelBtn);

          form.append(
            intro,
            nameField.wrap,
            emailField.wrap,
            pathField.wrap,
            suggestionField.wrap,
            reasoningField.wrap,
            hpWrap,
            actions,
          );

          // Result panes replace the form in place (form is hidden, not
          // destroyed) so a failed send can go back with every field intact.
          const pane = document.createElement('div');
          pane.className = 'tb-sg-pane';
          pane.tabIndex = -1; // focus target: moving focus here is what announces it
          pane.hidden = true;

          dialog.append(head, form, pane);
          overlay.append(dialog);

          const backToForm = () => {
            pane.hidden = true;
            form.hidden = false;
            suggestion.focus();
          };

          const showPane = (paneTitle, message, link, retry) => {
            if (!overlay.isConnected) return; // closed while a send was in flight
            pane.textContent = '';
            const h = document.createElement('p');
            h.className = 'tb-sg-pane-title';
            h.textContent = paneTitle;
            const p = document.createElement('p');
            p.textContent = message;
            pane.append(h, p);
            if (link) {
              const a = document.createElement('a');
              a.href = link;
              a.target = '_blank';
              a.rel = 'noopener';
              a.textContent = 'View your suggestion on GitHub';
              const wrapA = document.createElement('p');
              wrapA.append(a);
              pane.append(wrapA);
            }
            const b = document.createElement('button');
            b.type = 'button';
            b.className = retry ? 'tb-sg-btn' : 'tb-sg-quiet';
            b.textContent = retry ? 'Back to my suggestion' : 'Close';
            b.addEventListener('click', retry ? backToForm : () => close());
            pane.append(b);
            form.hidden = true;
            pane.hidden = false;
            pane.focus();
          };

          // --- focus trap ---------------------------------------------------
          // Recomputed per Tab: the dialog swaps between form and pane, so a
          // cached list would trap focus on detached nodes.
          const focusables = () =>
            Array.prototype.filter.call(
              dialog.querySelectorAll('a[href], button, input, textarea, select, [tabindex]'),
              (el) => !el.disabled && el.tabIndex >= 0 && el.offsetParent !== null,
            );

          const onKeydown = (e) => {
            if (e.key === 'Escape') { e.preventDefault(); close(); return; }
            if (e.key !== 'Tab') return;
            const items = focusables();
            if (!items.length) { e.preventDefault(); dialog.focus(); return; }
            // idx === -1 covers focus sitting on the pane (tabindex=-1) or
            // having escaped the dialog entirely — both get pulled back in.
            const idx = items.indexOf(document.activeElement);
            if (e.shiftKey) {
              if (idx <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
            } else if (idx === -1 || idx === items.length - 1) {
              e.preventDefault();
              items[0].focus();
            }
          };

          close = () => {
            close = null;
            if (controller) { try { controller.abort(); } catch (e) { /* already settled */ } }
            document.removeEventListener('keydown', onKeydown, true);
            overlay.remove();
            document.body.style.overflow = bodyOverflow; // release the scroll lock
            // Focus returns to the trigger. If the pane was re-rendered under
            // us (SPA nav) the button is gone — don't yank focus to a corpse.
            if (previouslyFocused && previouslyFocused.isConnected) previouslyFocused.focus();
          };

          overlay.addEventListener('mousedown', (e) => { if (e.target === overlay) close(); });
          closeBtn.addEventListener('click', () => close());
          cancelBtn.addEventListener('click', () => close());
          // Capture phase: the Hypothes.is client also listens for keys at the
          // document level, and ESC must belong to the modal while it is open.
          document.addEventListener('keydown', onKeydown, true);

          const validate = () => {
            let firstBad = null;
            const fail = (f, msg) => { invalidate(f, msg); if (!firstBad) firstBad = f.control; };
            for (const f of [nameField, emailField, suggestionField]) clearInvalid(f);
            if (!nameInput.value.trim()) fail(nameField, 'Please add your name.');
            const email = emailInput.value.trim();
            if (!email) fail(emailField, 'Please add your email.');
            else if (!EMAIL_RE.test(email)) fail(emailField, 'That does not look like an email address.');
            if (!suggestion.value.trim()) fail(suggestionField, 'Please describe the change you would like.');
            else if (suggestion.value.length > MAX_SUGGESTION) {
              fail(suggestionField, 'Please keep the suggestion under ' + MAX_SUGGESTION + ' characters.');
            }
            if (firstBad) firstBad.focus();
            return !firstBad;
          };

          const setBusy = (busy) => {
            submitting = busy;
            submitBtn.disabled = busy;
            submitBtn.textContent = busy ? 'Sending…' : 'Send suggestion';
          };

          form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (submitting || !validate()) return;

            const payload = {
              name: nameInput.value.trim(),
              email: emailInput.value.trim(),
              suggestion: suggestion.value.trim(),
              reasoning: reasoning.value.trim(),
              path: repoPath,
              website: hp.value,
            };

            // Honeypot tripped: behave exactly like success, send nothing.
            // Never tell a bot it was caught.
            if (payload.website) {
              showPane('Thank you', 'Your suggestion has been received.');
              return;
            }

            if (!endpointReady) {
              showPane(
                'Nearly there',
                'The suggestion box opens shortly — this feature goes live within days. ' +
                  'In the meantime, "Edit on GitHub" above takes your change straight to the source.',
              );
              return;
            }

            setBusy(true);
            const c = (controller = new AbortController());
            const timer = setTimeout(() => c.abort(), FETCH_TIMEOUT);
            fetch(SUGGEST_EDIT_ENDPOINT, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
              signal: c.signal,
            })
              .then(async (res) => {
                // Body may be empty or not JSON on an error path; the pane copy
                // never depends on it.
                let data = null;
                try { data = await res.json(); } catch (err) { data = null; }
                if (!res.ok) {
                  // `error` is log material only; `userMessage`, if present,
                  // rides along on the rejection for the pane to show.
                  const failure = new Error((data && data.error) || 'HTTP ' + res.status);
                  failure.userMessage = safeUserMessage(data);
                  throw failure;
                }
                return data;
              })
              .then((data) => {
                showPane(
                  'Thank you — suggestion sent',
                  'A maintainer will pick this up. You can follow it here:',
                  data && typeof data.issueUrl === 'string' ? data.issueUrl : null,
                );
              })
              .catch((err) => {
                log('suggest modal send failed:', err);
                // Network failures and the 10s abort have no userMessage, so
                // they always land on the fixed copy.
                showPane(
                  'That did not go through',
                  (err && err.userMessage) ||
                    'Something went wrong sending your suggestion — nothing was lost. ' +
                      'Try again in a moment, or use "Edit on GitHub" above.',
                  null,
                  true,
                );
              })
              .finally(() => {
                clearTimeout(timer);
                if (controller === c) controller = null;
                if (submitBtn.isConnected) setBusy(false);
                else submitting = false;
              });
          });

          document.body.style.overflow = 'hidden'; // scroll lock while modal is up
          document.body.appendChild(overlay);
          nameInput.focus(); // focus moves into the modal on open
          log('suggest modal opened for', repoPath, endpointReady ? '(live endpoint)' : '(placeholder endpoint)');
        };

        // Wrapped so a throw anywhere in open() can't escape into the click
        // handler: the half-built overlay is reaped and the page carries on.
        const guarded = (repoPath, trigger) => {
          try {
            open(repoPath, trigger);
          } catch (e) {
            log('suggest modal failed to open:', e);
            close = null;
            const stuck = document.getElementById(OVERLAY_ID);
            if (stuck) stuck.remove();
            document.body.style.overflow = '';
          }
        };
        // Exposed for the nav handler: a modal left open across an SPA nav
        // would show a stale path and hold the scroll lock.
        guarded.closeIfOpen = () => { if (close) close(); };
        return guarded;
      } catch (e) {
        log('suggest modal failed to arm:', e);
        return null; // feature absent; the button falls back to its old handler
      }
    })();

    // --- Per-page injections ---------------------------------------------
    // Edit / history / suggest controls, appended to the page header inside
    // the reading view. Publish re-renders the content pane on every SPA nav,
    // which destroys previous injections — so this re-runs per navigation.
    // Target chain (most to least specific); the winner is logged in DEBUG:
    //   .page-header             Publish's note-title element
    //   .markdown-preview-sizer  content sizer wrapping the rendered note
    //   .markdown-preview-view   outer reading-view container
    const CONTROLS_CLASS = 'tb-page-controls';

    function buildControls(repoPath) {
      const gh = encodeGithubPath(repoPath);
      const wrap = document.createElement('div');
      wrap.className = CONTROLS_CLASS;
      wrap.dataset.path = repoPath; // duplicate/staleness guard key

      const link = (href, text, cls) => {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = text;
        a.className = cls;
        a.target = '_blank';
        a.rel = 'noopener';
        return a;
      };
      wrap.append(
        link(`https://github.com/${REPO}/edit/${BRANCH}/${gh}`, 'Edit on GitHub', 'tb-edit-link'),
        link(`https://github.com/${REPO}/commits/${BRANCH}/${gh}`, 'View revision history', 'tb-history-link'),
      );

      const btn = document.createElement('button');
      btn.textContent = 'Suggest an edit';
      btn.className = 'tb-suggest-btn';
      // Modal absent (module failed to arm) => the button keeps its previous
      // behaviour rather than becoming a dead control.
      btn.addEventListener('click', openSuggestModal
        ? () => openSuggestModal(repoPath, btn)
        : () => alert('Suggest-an-edit is coming soon.'));
      wrap.append(btn);
      return wrap;
    }

    let injectTimer = null;
    function injectControls() {
      clearTimeout(injectTimer); // cancel pending retry/verify from a previous nav
      const repoPath = urlToRepoPath(location.pathname);
      let attempts = 0; // finding the target
      let verifies = 0; // confirming the injection survives Publish's re-render

      const tryInject = () => {
        // A newer navigation owns the page now — abandon this cycle.
        if (urlToRepoPath(location.pathname) !== repoPath) return;

        const target =
          document.querySelector('.page-header') ||
          document.querySelector('.markdown-preview-sizer') ||
          document.querySelector('.markdown-preview-view');

        if (!target) {
          // Content pane renders async after nav — retry briefly, then give up
          // quietly (e.g. non-note views like search results).
          if (attempts++ < 40) injectTimer = setTimeout(tryInject, 125);
          else log('injection target never appeared for', repoPath);
          return;
        }

        // Reap document-wide, not just inside the chosen target: the chain can
        // resolve differently across retries (pane renders progressively, so
        // .markdown-preview-view can win before .page-header exists), leaving a
        // live row inside a previously-chosen ancestor that a target-scoped
        // lookup can't see — a duplicate row and a duplicate badge fetch.
        const existing = target.querySelector(`.${CONTROLS_CLASS}`);
        for (const el of document.querySelectorAll(`.${CONTROLS_CLASS}`)) {
          if (el !== existing) el.remove();
        }
        if (!existing || existing.dataset.path !== repoPath) {
          if (existing) existing.remove(); // stale controls from a reused element
          const wrap = buildControls(repoPath);
          target.appendChild(wrap);
          log('controls injected into', target.className, '->', repoPath);
          injectAnnoBadge(wrap); // async, self-contained; never throws
        }

        // Publish can re-render the pane AFTER a successful injection (initial
        // load, popstate), destroying it. Keep watching briefly; re-inject if
        // wiped. Cheap: within the badge's cache TTL a re-inject reads
        // sessionStorage, so no extra API calls.
        if (verifies++ < 16) injectTimer = setTimeout(tryInject, 250); // ~4s window
      };
      tryInject();
    }
    // --- SPA navigation handler (spike-inherited) -------------------------
    // Publish navigates via the History API. Patch pushState/replaceState and
    // listen for popstate; dedupe on the CANONICAL repo path so redundant
    // history calls for the same page can't double-count a pageview or thrash
    // the injections. Canonical, not raw pathname: the home note is served at
    // both "/" and "/index" and trailing slashes occur, so a normalising
    // replaceState during Publish's boot is one page, not two.
    let lastPath = null;
    function onNavigate(source) {
      // BEFORE the dedupe: a route change ALWAYS closes an open modal, even one
      // the dedupe is about to drop. All three routes (pushState, replaceState,
      // popstate) funnel through here, so this covers every one of them — but
      // when it sat below the early return, a same-canonical-path popstate (a
      // hash jump within a note, or Publish normalising the URL on Back) left
      // the modal up with a stale path and the body scroll lock still held.
      // Closing is idempotent and cheap when nothing is open.
      if (openSuggestModal) openSuggestModal.closeIfOpen();

      const canonical = urlToRepoPath(location.pathname);
      if (canonical === lastPath) return;
      lastPath = canonical;
      log('navigate (' + source + '):', lastPath);
      firePageview(); // exactly one per real navigation
      injectControls(); // re-run per page: previous DOM is gone after nav
    }

    for (const fn of ['pushState', 'replaceState']) {
      const orig = history[fn];
      history[fn] = function (...args) {
        const ret = orig.apply(this, args);
        onNavigate(fn);
        return ret;
      };
    }
    window.addEventListener('popstate', () => onNavigate('popstate'));

    onNavigate('initial'); // count + inject the landing page itself
  })();
}