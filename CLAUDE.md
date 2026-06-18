# Launch Kit — project instructions

## Pull requests & issues — ALWAYS use the templates

When opening a PR or issue in this repo, you MUST populate it from the templates in
`.github/`, never ad-hoc or single-line text.

- **Pull requests** → use `.github/pull_request_template.md`. Fill in every section:
  _What & why_, _How it was tested_ (tick only the checks you actually ran), _Checklist_,
  and _Screenshots / notes_. Create with `gh pr create --body-file <file>` (or `--body`)
  using a body derived from that template.
- **Bug reports** → follow `.github/ISSUE_TEMPLATE/bug_report.yml`.
- **Feature requests** → follow `.github/ISSUE_TEMPLATE/feature_request.yml`.

If a section genuinely doesn't apply, write `n/a` — do not delete it. Never open a PR or
issue with an empty body.

## Before opening a PR

Run and pass all four: `pnpm test && pnpm typecheck && pnpm lint && pnpm build` — the same
gates CI enforces (`.github/workflows/ci.yml`).
