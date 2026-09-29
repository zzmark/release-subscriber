# HyperDX app release cycle

Use only with .release-monitor/software/hyperdx.yaml. The report version is the app package version, not the umbrella release tag or a CLI version.

1. Find release cycles at or above selection.minimum_version. A cycle produces a report only if it contains an app package version. Record the app Release URL and its upstream publication date for the Release Card.
2. In the same cycle, discard cli and hdx-eval sections entirely. Keep app and all other allowed package sections. Put app first; keep the remaining sections in upstream order. Do not combine packages from different cycles.
3. Write changelog.md as the selected package sections with their package headings, complete original body, and a blank line between heading and paragraph/next section. The output directory is the app package version without its package prefix.
4. Translate each retained section under its package heading in changelog.zh.md. The summary should lead with app changes but include relevant aggregated package changes; avoid presenting a secondary package version as the product version.
5. Follow report-format.md for the Release Card, landing row, and checks. The source release-url is the app Release URL, including any URL-encoded package tag.

If the cycle membership or package identity cannot be verified, hold that candidate. Do not publish an app report from a cli-only release.
