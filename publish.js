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
      btn.addEventListener('click', () => alert('Suggest-an-edit is coming soon.')); // Tier 1 form, Week 6
      wrap.append(btn);
      return wrap;
    }

    let injectTimer = null;
    function injectControls() {
      clearTimeout(injectTimer); // cancel a pending retry from a previous nav
      const repoPath = urlToRepoPath(location.pathname);
      let attempts = 0;

      const tryInject = () => {
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

        const existing = target.querySelector(`.${CONTROLS_CLASS}`);
        if (existing && existing.dataset.path === repoPath) return; // already current
        if (existing) existing.remove(); // stale controls from a reused element

        target.appendChild(buildControls(repoPath));
        log('controls injected into', target.className, '->', repoPath);
      };
      tryInject();
    }

    // --- SPA navigation handler (spike-inherited) -------------------------
    // Publish navigates via the History API. Patch pushState/replaceState and
    // listen for popstate; dedupe on pathname so redundant history calls for
    // the same page can't double-count a pageview or thrash the injections.
    let lastPath = null;
    function onNavigate(source) {
      if (location.pathname === lastPath) return;
      lastPath = location.pathname;
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