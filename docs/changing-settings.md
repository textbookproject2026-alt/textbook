# Changing the textbook's title and settings

The title, maintainer name, web address, and licence are all set in one small file: `textbook.config.json`. You never edit the pages themselves — change a value here once and every page updates on its own.

## To change a setting

1. On GitHub, open `textbook.config.json` in the main folder of the repository.
2. Click the pencil (edit) icon near the top right.
3. Change the value you want — for example the text in quotes after `"title":`. Keep the quotes and the comma.
4. At the bottom, choose **"Create a new branch for this commit and start a pull request"**, then **Propose changes** and **Create pull request**.
5. Wait about a minute. An automated step rewrites the affected pages and adds them to your pull request — you'll see a new commit appear from "github-actions".
6. Once that automated commit has shown up, click **Merge pull request**. Your change is now live.

## What you can change here

- **title** — the textbook's name, shown on every page.
- **maintainer** — the person who looks after the textbook.
- **site_url** — the web address where the textbook is published.
- **licence** — the licence the textbook is shared under.

## Important

Don't edit `README.md`, `CONTRIBUTING.md`, or `index.md` directly — they are written automatically and any direct change is overwritten. To change their wording (rather than just the title), edit the matching file in the `templates` folder instead, the same way.
