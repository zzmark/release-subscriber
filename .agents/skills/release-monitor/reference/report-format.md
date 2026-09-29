# Version report format and publication checks

Read this when writing a version, after its source-specific reference. The software config may require additional files or Release Card props.

## Three required files

- <slug>/<version>/changelog.md: full original upstream text, except configured extraction/aggregation. Preserve headings, item order, links, code, commands, identifiers, and version strings.
- <slug>/<version>/changelog.zh.md: translate every source section and item into simplified Chinese. Keep the same structure and all URLs, code, commands, identifiers, version strings, package names, and security IDs. Do not replace detailed text with a summary.
- <slug>/<version>/index.md: frontmatter, ReleaseCard, overview, then only the applicable categories in this order: Breaking Change, New Feature, Performance, Bugfix / Security. Leave out an empty category rather than adding a placeholder.

Use the repository’s existing pages as style examples. The minimum shape for index.md is:

~~~md
---
title: <软件名> <版本> 更新总结
description: <软件名> <版本> 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="<软件名>"
  version="<目录版本>"
  date="<UTC YYYY-MM-DD>"
  repository-url="<上游仓库 URL>"
  docs-url="<官方文档 URL>"
  release-url="<本次上游版本 URL>"
/>

## 概览

<主要变化和必要的升级注意事项>

## <实际有内容的分类>

- <有来源依据的具体变化>
~~~

ReleaseCard renders the two local changelog links. ClickHouse adds presentation links, LTS and accent props as specified in its config. Do not assign an unconfigured accent.

## Integrate

1. Insert a row for the version in <slug>/index.md, newest first, using the verified UTC date and links to all three files. Include software-specific columns such as ClickHouse presentation/LTS.
2. Run npm run releases:sync-home and review the homepage diff. It updates only the latest-version cells.
3. Run npm run releases:check and npm run docs:build. Fix missing files, metadata, landing rows, navigation, or dead links before finishing. CI runs the release check before deployment.
4. Independently compare original and translation section by section: headings, item counts, URL set, code spans, commands, IDs, meaning, and terminology. The script and build cannot validate translation quality or whether an upstream claim is true.

Temporary source downloads belong in .release-work.local/. Existing historical reports are immutable unless the user requested a correction.
