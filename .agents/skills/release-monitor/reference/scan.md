# Scan for eligible versions

Use this target when the user asks whether anything new exists, or as the discovery stage of a publication request. A scan-only request produces findings, not version files.

1. Read the catalog and each requested software config. Determine source type, minimum version, exclusions, prerelease policy, and existing directories.
2. Query the official upstream source. For paginated GitHub/Gitea APIs, continue until all potentially eligible versions have been accounted for; one page is not a completeness guarantee. For HyperDX and ClickHouse, apply their source-specific release-unit rules before calling a version eligible.
3. Exclude drafts, disallowed prereleases/tags, versions below the inclusive minimum, and versions already stored. Preserve the upstream tag and URL alongside the normalized directory version.
4. Return a compact candidate table: product, upstream tag, directory version, UTC publication date, source URL, and why it qualifies. Report uncertainty when the source does not expose a required field. Never infer a date from the current day or a search-result timestamp.

If access fails, try the official public API or another authorized read path. Gitea tea requires a configured login; a public Gitea API can be read without tea when network access is available. Do not publish from snippets or invent missing release bodies.
