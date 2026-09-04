## @hyperdx/app@2.37.0

### Minor Changes

- db6ee45f: feat(alerts): tidy the alert detail header and its properties block

  Edit, Delete and Terraform export move behind the same overflow menu the
  alerts list uses, so the header no longer spreads four buttons across the top
  and both surfaces offer the same actions. The link to what the alert watches
  becomes an icon beside the alert name, where it reads as part of the alert's
  identity rather than another action.

  The properties block splits configuration from provenance: the creator now
  sits with the created and updated timestamps in a dimmed line beneath, instead
  of competing with the alert's settings.

- 0558f77e: Record and show which notification target an evaluation's delivery time went to. `webhookDurationMs` was a single number covering the whole delivery, and because targets are dispatched concurrently the slowest one sets it — so a multi-target alert reported a figure with no way to tell which webhook was responsible, or that the other targets were fine.

  Each dispatch is now timed individually and aggregated per target across the evaluation, since a grouped alert notifies the same target once per firing group and again on resolve. One entry per distinct target carries its webhook id, display name, summed duration, how many dispatches it took, and how many failed. The evaluation history's "Notification duration" cell expands in place to show the breakdown.

  Stored per evaluation rather than per dispatch: a 50-group alert notifying 10 targets would otherwise write 500 entries onto every history row. The array is capped at `ALERT_NOTIFICATION_TARGETS_LIMIT` and sorted slowest-first, so the cap drops the least interesting rows. Records written before this change keep rendering their total with nothing to expand.

- db6ee45f: feat(alerts): edit from the alerts list, filter by alert source, and label the source icons

  The alerts page row menu now opens the alert editor directly, so changing a
  threshold no longer means navigating to the alert first. The source icon on
  each row gets a tooltip and accessible label naming what it watches ("Saved
  search" / "Dashboard tile"), and a new filter narrows the list by that source
  — free-text search matches it too, so typing "tile" works without touching the
  dropdown. Team settings tabs gain icons.

- 8f3126f0: Add a metrics explorer to the chart editor, so you no longer have to already know a metric's name to chart it. A browse control beside the metric select opens a modal with a prefix hierarchy over the metric namespace — `system` → `cpu` → `utilization` — plus search across every name and description the source is reporting. Each row carries the metric's kind and its description, and the detail pane shows the unit (rendered from its UCUM code), reporting services, and tag keys drilling into their values. Previously the picker was a flat 3,000-entry dropdown and that metadata only appeared after you had already committed to a metric.

  Names are split per metric: on `.` when the name has one (OpenTelemetry), otherwise on `_` (Prometheus exporters). Deciding per name rather than per source matters in practice — a real deployment carries thousands of underscore-style collector self-telemetry names alongside dozens of dotted application metrics, and a single source-wide separator flattened whichever family was outnumbered. Single-child chains collapse so the tree does not become a corridor, and the unfiltered tree is never truncated, so no namespace can go missing.

  While browsing a metric's tags you can stage filters and group-bys the same way the chart editor's inline attribute panel allows; they are shown as removable chips and applied together with the metric. Applying also sets an aggregation appropriate to the kind — average for a gauge, sum for a counter, p95 for a histogram — instead of inheriting whatever the previous series used. Both replace rather than merge, since they were written against the newly chosen metric: staged filters replace the series condition, and staged group-bys replace the chart's.

  The chart editor's inline attribute panel now also shows the metric's kind. Only chartable kinds are listed (gauge, sum, histogram, exponential histogram); `summary` is omitted because the query renderer cannot translate it. The browser is a self-contained component, so the modal is one shell around it rather than the only possible home.

- 6b7ca4ab: Show reverse span links and resolved span-link details in the span detail Overview panel.
- e0d29328: feat: rebuild the Help menu's "What's new" around the release notes. Replaces
  the full-changelog modal with an inline section, a "View all releases" drawer,
  and a sparkle on the Help icon when the running version hasn't been acknowledged
  in this browser.

  Everything shown now comes from the root CHANGELOG.md, the release-level summary
  written during each release: its headline and opening paragraph lead the
  release, breaking changes and new features are listed individually and badged
  apart, and the remaining sections are summed up as counts linking to that
  release's section of the changelog. Nothing is hand-authored in the app. The
  whole changelog is no longer shipped as a fetched asset either — next.config.mjs
  parses it at build time and emits a small public/whats-new.json instead.

### Patch Changes

- cb48c46a: Show every notification target an alert is configured with. The alerts page rows and the alert detail header only ever rendered the legacy singular `channel`, so an alert notifying three webhooks read as if it notified one, and the label was the generic "Webhook" rather than the webhook's name. Both surfaces now resolve all of an alert's channels: the detail page names each target with its service icon (Slack, incident.io, generic), keeping the first two inline and collapsing the rest into a `+N more` tooltip, while the alerts-page rows show the icons only with the names on hover, since spelling out up to ten names wrapped the row into an unreadable block. The hover-only names are also placed in the accessibility tree rather than left to an `aria-label` on a role-less wrapper.

  The evaluation history's "Webhook Duration" column is renamed "Notification duration" and gains a tooltip. The value was always the wall time of the whole delivery, which fans out to every target concurrently, so a single slow webhook sets the figure — but the singular heading read as one webhook's latency. Per-target attribution is not available yet; nothing records it. The remaining column headings are corrected to sentence case.

- cf8e7e72: Give every alerts-page row the same trailing controls. The row's Terraform import button, source link, and acknowledgement button were each independently conditional — import needs a saved-search alert _and_ the export feature, and `AckAlert` renders nothing for an OK alert that has never been acknowledged — so the flex row collapsed differently per alert and no two rows lined up. The conditional actions move into an overflow menu that always renders, alongside a new "Delete alert" item, and the acknowledgement button gets a reserved slot so its absence no longer shifts everything to its left.

  The Terraform snippet building is extracted into a `useTerraformSnippets` hook so the row menu can present the same snippets in a modal without duplicating it, or moving `ResourceTerraformPopover` off the two other pages that use it. Snippets are still built lazily on open, which is what keeps `window.location.origin` out of the render path and the ClickStack static export building.

- bb320db6: fix: Confirm before discarding unsaved changes when closing the dashboard filter editor
- f11038ef: feat: Persist variable-keyed dashboard filter value state
- f9f7d5bc: feat: Add completions for PromQL variables
- 82180780: feat: Enable dashboard variables for everyone by removing the feature toggle
- 2ba1b25b: fix: Expand variables prior to navigating to search page via drill-down
- 9155b436: Fix session replays rendering empty, unstyled, or freezing mid-session when a recorded rrweb event exceeds the recorder's ~950KB chunk size. All chunks of a split event share one timestamp, and the replay query ordered by timestamp alone, so ClickHouse could return chunks in arbitrary order — the scrambled reassembly failed to parse and the event (often the full DOM snapshot carrying all inlined CSS) was silently dropped. The replay stream is now ordered deterministically (`rr-web.offset` and `rr-web.chunk` tiebreaks), chunks are reassembled by explicit chunk index per event, and dropped events are reported in the console and flagged with a warning indicator in the player instead of being swallowed. Existing recordings are replayed correctly without re-ingestion. Replaced replay streams are now also cancelled instead of streaming to completion in the background, and the player imports `Replayer` from `@rrweb/replay` (the replay-only package rrweb recommends over the deprecated combined `rrweb` package).
- de9038e7: feat: Distribute exact-match lucene variable references
- 7662fae8: feat: Show warnings for invalid promql variable usage
- 93b51b13: feat: Add generated PromQL preview
- 64326d09: feat: Support variable substitution in PromQL charts
- 7f3878bc: refactor: Split `DashboardFiltersModal` into smaller components
- 210a3fb7: Release markers now show a distinct "couldn't load release markers" notification when the underlying query fails (e.g. a source's version expression references a column, such as `ResourceAttributes`, that the table doesn't have), instead of silently rendering no markers indistinguishable from "no releases found in this time range."
- e995c393: feat(app): mask secrets in API key and MCP install snippets with a shared reveal-to-copy component
- 057a6845: perf: Virtualize the alerts page list
- Updated dependencies [3c81bb96]
- Updated dependencies [0558f77e]
- Updated dependencies [f11038ef]
- Updated dependencies [df4a7a55]
- Updated dependencies [f9f7d5bc]
- Updated dependencies [892cc653]
- Updated dependencies [82852c3a]
- Updated dependencies [b52a6fa8]
- Updated dependencies [de9038e7]
- Updated dependencies [5fc33413]
- Updated dependencies [7662fae8]
- Updated dependencies [93b51b13]
- Updated dependencies [64326d09]
  - @hyperdx/api@2.37.0
  - @hyperdx/common-utils@0.28.0

## @hyperdx/common-utils@0.28.0

### Minor Changes

- 0558f77e: Record and show which notification target an evaluation's delivery time went to. `webhookDurationMs` was a single number covering the whole delivery, and because targets are dispatched concurrently the slowest one sets it — so a multi-target alert reported a figure with no way to tell which webhook was responsible, or that the other targets were fine.

  Each dispatch is now timed individually and aggregated per target across the evaluation, since a grouped alert notifies the same target once per firing group and again on resolve. One entry per distinct target carries its webhook id, display name, summed duration, how many dispatches it took, and how many failed. The evaluation history's "Notification duration" cell expands in place to show the breakdown.

  Stored per evaluation rather than per dispatch: a 50-group alert notifying 10 targets would otherwise write 500 entries onto every history row. The array is capped at `ALERT_NOTIFICATION_TARGETS_LIMIT` and sorted slowest-first, so the cap drops the least interesting rows. Records written before this change keep rendering their total with nothing to expand.

- df4a7a55: Add a new `inline` alert source that persists its own chart config directly on the alert, so alerts no longer require a saved search (logs) or a dashboard tile (metrics). The config is the same shape a dashboard tile stores — builder configs on log/trace/metric sources plus raw SQL (Line/Stacked Bar/Number display types); PromQL is rejected. The internal alerts API accepts and returns the new source, and the check-alerts task evaluates inline alerts through the same code path as tile alerts (including group-by and multi-window behavior). Notifications for inline alerts link to the chart explorer seeded with the alert's config over the alerting window, and default their title to the config's name. Backend only — the creation/edit UI and external API v2 support land separately.

### Patch Changes

- f11038ef: feat: Persist variable-keyed dashboard filter value state
- f9f7d5bc: feat: Add completions for PromQL variables
- 82852c3a: fix: Fix `@/*` aliases leaking into the local type declarations
- de9038e7: feat: Distribute exact-match lucene variable references
- 5fc33413: feat: Support dashboard variables in the MCP server
- 7662fae8: feat: Show warnings for invalid promql variable usage
- 93b51b13: feat: Add generated PromQL preview
- 64326d09: feat: Support variable substitution in PromQL charts

## @hyperdx/api@2.37.0

### Minor Changes

- 0558f77e: Record and show which notification target an evaluation's delivery time went to. `webhookDurationMs` was a single number covering the whole delivery, and because targets are dispatched concurrently the slowest one sets it — so a multi-target alert reported a figure with no way to tell which webhook was responsible, or that the other targets were fine.

  Each dispatch is now timed individually and aggregated per target across the evaluation, since a grouped alert notifies the same target once per firing group and again on resolve. One entry per distinct target carries its webhook id, display name, summed duration, how many dispatches it took, and how many failed. The evaluation history's "Notification duration" cell expands in place to show the breakdown.

  Stored per evaluation rather than per dispatch: a 50-group alert notifying 10 targets would otherwise write 500 entries onto every history row. The array is capped at `ALERT_NOTIFICATION_TARGETS_LIMIT` and sorted slowest-first, so the cap drops the least interesting rows. Records written before this change keep rendering their total with nothing to expand.

- df4a7a55: Add a new `inline` alert source that persists its own chart config directly on the alert, so alerts no longer require a saved search (logs) or a dashboard tile (metrics). The config is the same shape a dashboard tile stores — builder configs on log/trace/metric sources plus raw SQL (Line/Stacked Bar/Number display types); PromQL is rejected. The internal alerts API accepts and returns the new source, and the check-alerts task evaluates inline alerts through the same code path as tile alerts (including group-by and multi-window behavior). Notifications for inline alerts link to the chart explorer seeded with the alert's config over the alerting window, and default their title to the config's name. Backend only — the creation/edit UI and external API v2 support land separately.

### Patch Changes

- 3c81bb96: Build alert notifications for an alert's configured channels directly, instead of encoding them as `@webhook-<id>` mention strings and parsing them back out. That round-trip carried only `type` and `webhookId`, and it appended the channels _after_ whatever the user wrote in the message body — so a body containing `MAX_NOTIFICATIONS_PER_EVENT` mentions consumed every slot of the per-event cap and the alert's own configured channel, the one target it was set up to notify, was silently never reached. Configured channels are now queued first and are exempt from that cap, which only ever meant to bound ad hoc mentions; `channels` is already bounded by `MAX_ALERT_CHANNELS`. Mentions written into the message body are unchanged, still capped, and still deduplicated against the configured channels so naming one twice notifies it once. This also removes the lossiness that prevented a channel from carrying any field beyond its webhook id through to delivery, which downstream forks with richer channel types (e.g. an `email` channel, or a Slack-app channel that also needs a Slack channel id) could not work around. `getDefaultExternalActions` is removed, as nothing needs the mention-string form of a configured channel any more.
- f11038ef: feat: Persist variable-keyed dashboard filter value state
- 892cc653: feat(mcp): improve metric discovery, add quiet-saturation eval scenario
- b52a6fa8: Advertise the MCP quantile `level` field as a string enum so Gemini-backed clients can use the server at all. `z.union([z.literal(0.5), ...])` renders as `{ "type": "number", "enum": [0.5, 0.9, 0.95, 0.99] }`, and Gemini's function declarations only accept `enum` alongside `type: "string"` — so a client that forwards MCP tool schemas to the provider had its entire tool list rejected because of this one field, surfacing as a generic "trouble connecting to the model provider" error that named neither the tool nor the property. Affected `clickstack_timeseries`, `clickstack_table`, `clickstack_save_dashboard` and `clickstack_patch_dashboard`. Only the advertised wire type changes: numeric input is still accepted for callers working from a cached schema, the value is coerced back to a number before any consumer sees it, and out-of-set values are still rejected. The external REST API's own `level` contract is untouched. A new test asserts that no advertised tool schema carries a non-string `enum` or an array-form `items`, complementing the draft-2020-12 metaschema check.
- 5fc33413: feat: Support dashboard variables in the MCP server
- Updated dependencies [0558f77e]
- Updated dependencies [f11038ef]
- Updated dependencies [df4a7a55]
- Updated dependencies [f9f7d5bc]
- Updated dependencies [82852c3a]
- Updated dependencies [de9038e7]
- Updated dependencies [5fc33413]
- Updated dependencies [7662fae8]
- Updated dependencies [93b51b13]
- Updated dependencies [64326d09]
  - @hyperdx/common-utils@0.28.0
