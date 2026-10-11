# Gitea server releases

Read .release-monitor/software/gitea.yaml, github-gitea.md, report-format.md, and gitea-blogs.md. Gitea server is a GitHub Release target; its official blog source is hosted on Gitea. Do not use the Runner release API for server releases.

1. Fetch all relevant GitHub Release pages from go-gitea/gitea. Select formal releases at or above 1.26.0 inclusively, excluding drafts, prereleases and non-release tags. Verify pagination across the minimum boundary.
2. Remove only the leading v for comparison and directories. Preserve upstream 1.26.x and 1.27.x; the first version without the historical 1. prefix is 28.0.0. Do not rewrite 1.26.0 as 26.0.0 or invent 1.28.0. Numeric tuples naturally order 28.0.0 after 1.27.x. Check the upstream version announcement if the scheme changes again.
3. Keep the exact GitHub Release body as changelog.md, including warnings and all entries. Translate it independently of the blog; blog security explanations supplement rather than replace the Release text. In particular, preserve the 1.26.3 warning recommending 1.26.4.
4. Match official server release blogs, excluding Runner announcements. Prefer Markdown files in source.release_blog_source_directory and verify the public article. Follow the shared full-translation and attribution workflow in gitea-blogs.md.
5. If one article announces multiple versions (for example 1.26.3 and 1.26.4), provide the same complete translated article at each corresponding blog.zh.md. Keep each version's own Release body, summary and GitHub UTC date. A historical Changelog section alone does not establish a joint announcement.
6. Integrate catalog, software config, landing table, navigation and home table. Run releases:sync-home, releases:check and docs:build; independently audit original bodies, translated sections, links, code and security IDs. For scans, report candidates and missing/new blogs without publishing.
