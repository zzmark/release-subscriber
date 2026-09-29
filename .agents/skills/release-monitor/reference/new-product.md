# Add a monitored product

Use this after the user names a new product/source. Verify its upstream repository, Releases page or changelog source, official docs, tag format, and inclusive minimum version before writing configuration.

1. Add one catalog entry in .release-monitor/catalog.yaml. Create .release-monitor/software/<slug>.yaml with schema_version, software slug/display_name/status/output_directory, source type and URLs, selection minimum_version/minimum_inclusive/prerelease rules, processing release_unit/changelog_mode, history, and theme. Match the closest existing config; put exceptions in the new config rather than this reference.
2. Set source and processing together: GitHub uses source.type github_release plus processing.release_unit github_release; Gitea uses source.type gitea_release, source.api_releases_url, and processing.release_unit gitea_release. Both ordinary types use changelog_mode preserve_upstream_release_body. Record source.repository and source.releases_url where relevant. Do not substitute a GitHub mirror for a Gitea source. For HyperDX/ClickHouse, start from their specialized configs.
3. Create <slug>/index.md with product description, an “已收录版本” section, and links to upstream repository, Releases, and docs. Add the product to .vitepress/config.mts nav and sidebar with releaseItems('<slug>'); add a row to the homepage software table.
4. Keep catalog and config status planned if only the product shell exists. When the first complete version report is generated, switch both to active, add its landing-table row, and set history.initial_backfill_status according to the actual backfill state. Do not claim metadata verification completed until checked.
5. If the first version is part of the request, read the source-specific reference and report-format.md to publish it. Finish with the repository validation commands from report-format.md.

For ordinary Release sources, this compact config shape is a starting point; replace every value and add software-specific rules when needed:

~~~yaml
schema_version: 1
software:
  slug: <slug>
  display_name: <name>
  status: planned
  output_directory: <slug>
source:
  type: github_release
  repository: <owner/repo>
  releases_url: <official releases URL>
  documentation_url: <official docs URL>
selection:
  minimum_version: <version>
  minimum_inclusive: true
  include_drafts: false
  include_prereleases: false
processing:
  release_unit: github_release
  changelog_mode: preserve_upstream_release_body
history:
  initial_backfill_status: pending
  existing_versions_are_immutable: true
theme:
  strategy: pending
  accent: null
~~~

Use existing ClickHouse/HyperDX configs for their specialized fields. The software YAML, not this example, is the maintained source of truth after creation.
