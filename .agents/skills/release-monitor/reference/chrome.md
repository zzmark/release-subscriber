# Chrome stable major release

Use for software/chrome.yaml when processing.release_unit is stable_major_version. The unit is one Chrome Stable major milestone such as 140, not a patch build or a Beta/Dev/Canary announcement.

## Discover and select

1. Start at selection.minimum_version, inclusive. Use the official release-notes index and the versioned pages at source.release_url_template. The index can be rendered dynamically, so a sparse index response is not proof that no versions exist. Check consecutive major pages and cross-check the newest Stable milestone against the official source.
2. Count a page as eligible only when it identifies that major version, explicitly says it applies to the Stable channel, and gives a Stable release date that has passed. A published Beta preview or future-dated Stable article is not yet a release. Do not use a page's last-updated date, search-result timestamp, or the task date as the release date.
3. Compare each eligible major with existing chrome/<major>/ directories. Treat a missing page or inaccessible source as uncertainty rather than evidence that no release exists. Never infer a release from a blog highlight alone.

## Build each report

1. Fetch the official English article with `hl=en`. Omit account-specific `authuser` parameters. Use the article body from its Chrome title through the release-note sections; exclude site navigation, account controls, related-content chrome, and footer.
2. Convert that body faithfully to Markdown in changelog.md. Preserve every substantive heading, paragraph, list, code sample, link, image, and caveat in source order. Use absolute official URLs for site-relative assets and links. Identify the official page as the source; the Markdown is a format conversion of the English article, not a separately published upstream Markdown file. The page footer licenses article text under CC BY 4.0 and code samples under Apache 2.0, so retain source and license attribution in both language files. Inspect the HTML against the converted Markdown for malformed inline markup that disappears during parsing and for invalid upstream links such as a `Spec` URL ending in `/None`; restore lost text and annotate an invalid upstream link without publishing it as a working URL.
3. Translate the complete converted article with ChatGPT into changelog.zh.md, preserving structure, links, code, identifiers, and feature availability qualifiers. The site's `hl=zh-cn` rendering is useful for comparison but is not the translation source for this repository.
4. Write index.md for the same major and the article's Stable release date. Summarize developer-impacting changes and real migration risks only. Some official articles mention features still limited to non-Stable channels; keep those caveats in both changelogs and do not present such features as already Stable in the summary.
5. Follow report-format.md to update the landing table, homepage, and checks. Only after the complete requested initial backfill is done should history.initial_backfill_status become completed. A shell without reports remains planned.

If an article cannot be read completely or its Stable status/date cannot be confirmed, hold that version and report the gap.
