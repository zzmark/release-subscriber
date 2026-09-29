# ClickHouse OSS monthly version

Use only with .release-monitor/software/clickhouse.yaml. The unit is YY.M, not a full patch release.

1. Map YY to the four-digit year according to selection.year_mapping. Read the configured official annual OSS Markdown and extract the exact section for the target YY.M. Keep the original section text in changelog.md. Apply only source_text_corrections explicitly listed in the config; preserve their provenance.
2. Obtain the UTC date in processing.published_date_source_order: first the changelog version section, then presentation metadata. If neither provides a date, do not guess or publish an incomplete page.
3. Fetch the matching presentation source from the configured ClickHouse-presentations repository directory. Translate visible slide text and any speaker notes while retaining slide order, layout, images, code, links, and attribution. Write the static translated presentation to <version>/presentation.zh/index.html; reference official absolute resource URLs rather than committing copies.
4. Build the Release Card with the official changelog page URL, original presentation URL, translated presentation link, configured season accent, and LTS label for months 3 and 8. Derive season from the version month, not the run date.
5. Add the landing row with version, LTS/常规 type, UTC date, three report links, and both presentation links. Follow report-format.md for the bilingual text and final checks. Confirm the translated presentation exists in the built site.

The configured presentation is required for every ClickHouse version. If it or the source section is unavailable, hold the version rather than publishing a partial report.
