# Ordinary GitHub and Gitea Releases

Use for software whose processing.release_unit is github_release or gitea_release. For HyperDX and ClickHouse, use their dedicated references.

## Fetch

- GitHub: GET https://api.github.com/repos/{owner}/{repo}/releases?per_page=100&page=N, using source.repository from the software config.
- Gitea: GET source.api_releases_url?limit=50&page=N. Keep the repository on its configured Gitea instance; do not read a mirror.
- Relevant API fields are tag_name, draft, prerelease, published_at, body, and html_url. Preserve the body as source text. Use the upstream release page when the API body needs clarification.

## Select

1. Apply selection.minimum_version as an inclusive numeric boundary. Exclude draft and prerelease entries unless the config explicitly enables them, plus tags matching selection.exclude_tags_matching.
2. Derive the directory version from the tag and this product’s existing convention. For example, Gitea Runner v3.3.1 maps to 3.3.1, while the Release Card URL retains v3.3.1. Do not rename upstream tags in URLs.
3. Compare against existing directories; publish only missing versions unless history revision is requested. Convert published_at to UTC YYYY-MM-DD. If it is absent, seek an explicit upstream date rather than guessing.
4. For each selected release, pass body, directory version, date, html_url, repository URL and docs URL to report-format.md. Keep fetched payloads under .release-work.local/ while working.

Do not use a basic machine translator for changelog.zh.md; .release-monitor/README.md defines the translation requirement. Before finishing, compare source and translation line groups and link/code inventories.
