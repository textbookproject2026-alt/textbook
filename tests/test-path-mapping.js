// test-path-mapping.js — D8.2. Locks urlToRepoPath() before anything builds on it.
// Run from the vault/repo root (next to publish.js):  node test-path-mapping.js
// Exits 0 on all-pass, 1 on any failure.

const assert = require('assert');
const { urlToRepoPath } = require('./publish.js');

// [input pathname, expected repo path, label]
//
// Inputs are given as location.pathname would deliver them: spaces as "+",
// non-ASCII percent-encoded. For the two non-ASCII pages the ADDRESS BAR shows
// the decoded form (what Alec pasted), so those run twice — encoded and
// decoded — because both forms reach the function in practice and must agree.
const cases = [
  ['/index', 'index.md', 'home page (served at /index)'],
  ['/', 'index.md', 'home page (site root /)'],
  ['/path-test/simple', 'path-test/simple.md', 'flat baseline'],
  ['/path-test/with+spaces', 'path-test/with spaces.md', 'spaces (+ encoding)'],
  ['/path-test/numbers-01-intro', 'path-test/numbers-01-intro.md', 'numbers + hyphens'],
  ['/path-test/MixedCase+Title', 'path-test/MixedCase Title.md', 'capitalisation + spaces'],
  ['/path-test/nested/level-two', 'path-test/nested/level-two.md', 'one folder level'],
  ['/path-test/nested/deeper/level-three', 'path-test/nested/deeper/level-three.md', 'three folder levels'],
  ['/path-test/special-%26-(parens)', 'path-test/special-&-(parens).md', 'ampersand + parentheses'],
  ['/path-test/caf%C3%A9-r%C3%A9sum%C3%A9', 'path-test/café-résumé.md', 'diacritics (pathname-encoded)'],
  ['/path-test/café-résumé', 'path-test/café-résumé.md', 'diacritics (address-bar decoded)'],
  ["/path-test/em%E2%80%94dash-and-apostrophe's", "path-test/em—dash-and-apostrophe's.md", 'em-dash + apostrophe (pathname-encoded)'],
  ["/path-test/em—dash-and-apostrophe's", "path-test/em—dash-and-apostrophe's.md", 'em-dash + apostrophe (address-bar decoded)'],
];

let failures = 0;

for (const [input, expected, label] of cases) {
  let got, err;
  try {
    got = urlToRepoPath(input);
    assert.strictEqual(got, expected);
  } catch (e) {
    err = e;
  }
  if (err) {
    failures++;
    console.log(`FAIL  ${label}`);
    console.log(`      in:   ${input}`);
    console.log(`      got:  ${got !== undefined ? got : `<threw: ${err.message}>`}`);
    console.log(`      want: ${expected}`);
  } else {
    console.log(`pass  ${label}  (${input} -> ${got})`);
  }
}

console.log(`\n${cases.length - failures}/${cases.length} passed`);
process.exit(failures === 0 ? 0 : 1);
