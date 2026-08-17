# Annotation backups

This branch holds nothing but weekly Hypothes.is annotation snapshots,
written by `.github/workflows/backup-annotations.yml` on `main`.

Backups live here rather than on `main` because `main` requires pull
requests and `github-actions[bot]` cannot bypass that rule.

See `docs/annotation-restore.md` on `main` for what these files contain
and what restoring from them actually involves.
