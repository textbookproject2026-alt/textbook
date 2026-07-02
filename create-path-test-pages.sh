#!/usr/bin/env bash
# create-path-test-pages.sh
# Creates 9 throwaway pages under path-test/ to exercise the publish.js URL->path
# mapping. Run from your VAULT ROOT. Then publish the path-test/ folder, note each
# live URL, and feed (live URL -> expected path) pairs to the D8.2 test. Delete
# path-test/ once the mapping is locked.
set -euo pipefail

mk () {  # mk "<relative path>" "<what it tests>"
  local path="$1" tests="$2"
  mkdir -p "$(dirname "$path")"
  {
    printf '# %s\n\n' "$(basename "${path%.md}")"
    printf 'Path-mapping test page. Tests: %s\n\n' "$tests"
    printf 'Expected repo path (relative to vault root): `%s`\n' "$path"
  } > "$path"
}

mk "path-test/simple.md"                    "flat file, no tricks"
mk "path-test/with spaces.md"               "spaces in filename"
mk "path-test/numbers-01-intro.md"          "numbers and hyphens"
mk "path-test/MixedCase Title.md"           "capitalisation + spaces"
mk "path-test/nested/level-two.md"          "one folder level"
mk "path-test/nested/deeper/level-three.md" "three folder levels"
mk "path-test/special-&-(parens).md"        "ampersand and parentheses"
mk "path-test/café-résumé.md"               "diacritics / non-ASCII"
mk "path-test/em—dash-and-apostrophe's.md"  "em-dash and apostrophe"

echo "Created 9 pages under path-test/."
echo "Test #1 is your existing index.md (home -> served at /)."
