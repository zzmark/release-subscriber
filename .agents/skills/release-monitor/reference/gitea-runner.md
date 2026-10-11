# Gitea Runner release blogs

Use alongside github-gitea.md when publishing Runner releases, or alone when supplementing blog links. Read .release-monitor/software/gitea-runner.yaml first.

1. Fetch releases and apply selection rules through github-gitea.md. Gitea Releases remain authoritative for tags, stability, publication dates and original bodies.
2. Browse source.release_blog_index_url on the official blog; follow pagination when present. Inspect the actual article, not search snippets. Select Runner release announcements, excluding Gitea server release posts and unrelated tutorials.
3. Match the announcement title and opening text to the exact Runner version and verify its Gitea Release link. Do not construct an unverified URL from a version. A later article may contain older Changelog sections; those are not independent release announcements for the older versions.
4. For a verified match, add release-blog-url to that version's ReleaseCard and an official article link in the landing page's 发布博客 column. ReleaseCard displays the optional external link. Keep the existing Gitea release-url and date unchanged. If no matching article is found, omit the prop and use — in the table; an unavailable blog is uncertainty, not proof of absence, and does not block a complete Gitea Release report.
5. Check for newly published announcements for existing versions too. The configured supplementary-link policy permits adding these links without rewriting existing summaries or either Changelog. Do not copy a full blog article into changelog.md. Full local blog archiving/translation requires a separate request.
6. Run releases:sync-home, releases:check and docs:build. Verify the blog links in the rendered version cards and landing table. For a scan-only request, report newly matched articles without editing files.
