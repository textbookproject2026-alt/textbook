// publish.js — Obsidian Publish spike: Hypothes.is + Plausible.
// Obsidian Publish is a SPA: this file runs ONCE; note clicks are pushState
// navigations, not reloads. So we inject each script once and only re-fire a
// Plausible pageview on navigation.
//
// Hypothes.is note (spike finding): locking the embed to a PRIVATE group via the
// `services` config returns 404 on the standard account tier — supplying
// `services` switches the client into third-party-auth mode, which can't access
// a private group without a grant token. So this spike uses the FIRST-PARTY flow:
// the embed loads, and the reader logs in via the sidebar and selects the group
// manually. Production group-locking (services + authority + grant token) returns
// with the Hypothes.is Publisher-Groups tier. Group of record: ZGY29zLM (test-group).

(() => {
  if (window.__spikePublish) return;            // never double-run / double-load
  window.__spikePublish = true;
  console.log('[spike] publish.js init');

  // Plausible (hosted, per-site script). The site is identified by the hashed
  // filename, so there is no data-domain attribute. autoCapturePageviews:false
  // because we fire pageviews ourselves (trackPageview) for exact, once-per-SPA
  // -nav control. The stub queues calls made before the script finishes loading.
  const loadPlausible = () => {
    window.plausible = window.plausible || function () {
      (window.plausible.q = window.plausible.q || []).push(arguments);
    };
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://plausible.io/js/pa-eii3VlmU1ClI0VxGOsCTe.js';
    document.head.appendChild(s);
    plausible.init = plausible.init || function (i) { plausible.o = i || {}; };
    plausible.init({ autoCapturePageviews: false });
    console.log('[spike] Plausible loaded (per-site script)');
  };

  let lastTracked = null;

  // Publish serves the home note at both '/' and '/index' — collapse them so
  // Plausible doesn't split homepage stats across two entries. Hash stripped
  // too: heading anchors would otherwise register as distinct pages.
  const normalizedUrl = () => {
    const u = new URL(location.href);
    if (u.pathname === '/index') u.pathname = '/';
    u.hash = '';
    return u.href;
  };

  const trackPageview = () => {
    const url = normalizedUrl();
    if (url === lastTracked) return;             // dedup on the *normalized* URL
    lastTracked = url;
    // 'u' overrides the URL Plausible reads from location.href; supported by
    // script.manual.js and honoured by the pre-load queue stub.
    if (typeof window.plausible === 'function') window.plausible('pageview', { u: url });
    console.log('[spike] pageview ' + new URL(url).pathname);
  };

  // Patch the History API so client-side nav fires a pageview. pushState/
  // replaceState mutate location.* before our callback runs, so trackPageview
  // already sees the new URL. popstate covers back/forward.
  const onRouteChange = (cb) => {
    for (const m of ['pushState', 'replaceState']) {
      const orig = history[m];
      history[m] = function (...a) { const r = orig.apply(this, a); cb(); return r; };
    }
    window.addEventListener('popstate', cb);
  };

  // Hypothes.is — first-party flow (see header). No `services`/group lock, so the
  // client uses your normal Hypothes.is login: open the sidebar, log in, pick
  // "test-group" from the group selector, then annotate.
  // Production (Publisher tier) re-adds locking, roughly:
  //   services: [{ apiUrl: 'https://hypothes.is/api/', authority: '<publisher>',
  //               groups: ['<group-id>'], grantToken: '<token>' }]
  const loadHypothesis = () => {
    window.hypothesisConfig = () => ({
      openSidebar: false,                  // sidebar collapsed by default
      showHighlights: 'always',
    });
    const embed = document.createElement('script');
    embed.src = 'https://hypothes.is/embed.js';
    embed.async = true;
    document.head.appendChild(embed);
    console.log('[spike] Hypothes.is loaded (first-party flow; pick test-group in the sidebar)');
  };

  // Analytics + nav first so a Hypothes.is failure can't take them down; the
  // try/catch is the belt to those suspenders.
  loadPlausible();
  trackPageview();                           // initial view
  onRouteChange(() => { console.log('[spike] SPA navigation'); trackPageview(); });
  try { loadHypothesis(); }
  catch (e) { console.log('[spike] Hypothes.is error (ignored): ' + e.message); }
})();