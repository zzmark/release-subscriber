## @hyperdx/app@2.47.0

### Minor Changes

- c6657aa0c: Show RED metrics (Throughput, Errors, Duration) above the trace search results instead of the single count histogram. The three charts share a synced hover cursor, Errors toggles between rate and volume, and clicking a status series on the volume chart filters the results. Logs and other sources keep the existing histogram.
- 81000d0ce: Add a RED/Heatmap switch to the trace search results view. Heatmap shows the duration distribution over time as the same tile the dashboard renders, and the choice is kept in the URL so a reload or a shared link reopens the same view.

### Patch Changes

- 6e7ee8366: feat: Removing the NEXT_PUBLIC_ENABLE_ADHOC_FILTERS flag
- 6e7c77247: fix: run an edited Order By on a chart table instead of the last column header sort
- 1a4c116b2: perf: load search filter values faster in exact mode by reading several keys on
  one Map column with a single `groupUniqArrayMap`, and by querying plain columns
  and each Map or JSON column separately so slow attribute maps don't hold up the
  rest
- 351f19400: feat: allow up to 10,000 in the team "Filter Keys Fetch Limit" setting

  The setting's input in Team settings stopped at 1,000 keys per column; it now
  accepts up to 10,000. Map key discovery returns up to the setting's value per
  Map column, and never fewer than 1,000.

- 0c77d52a3: fix: stop the previous filter type's validation from blocking a save after switching types

  Switching a dashboard filter from "PromQL label values" to another type no longer fails with "Select a PromQL source".

- 661a5a139: fix: address JSON array elements by index in row-panel filters

  "Add to Filters" on a value inside an array in a native JSON column now uses
  1-based array subscripts, for example `events[1]`, instead of quoted keys such
  as `events.0`, so the filter matches rows instead of silently returning none.

  The same applies to arrays inside a JSON string (for example a String `Body`
  column), which now pass 1-based integer indexes to `JSONExtract*`. JSON strings
  stored in a native JSON column are wrapped in `toString()` so `JSONExtract*`
  accepts them.

- 3d12509ef: fix: keep JSON-column filter keys in JSON form when another filter is added

  Adding a second filter, or clicking "Load more" on a filter, no longer rewrites
  an earlier filter on a key inside a native JSON column to `col['key']`, which
  ClickHouse rejects (`Illegal type Dynamic of argument of function in`, or
  `First argument for function 'arrayElement' must be array, got 'JSON'` on older
  versions).

- 86acf27c0: perf: read only 20 median-sized parts for text index key and value lookups

  Map key discovery and "all values" lookups on text indexes read the index
  dictionary of every part in the time range, which is slow on tables with many
  parts. They now read the 20 parts closest to the median size. Log and trace
  sources can change the count with the new "Map key index parts" setting
  (`mapKeyIndexMaxParts`), and which parts are read with "Map key index part size"
  (`mapKeyIndexPartSelection`: median, smallest, or largest). "Load more" on a
  single filter key still reads every part in the time range.

- 2f61137e2: fix: return partial rows from `clickstack_search` instead of timing out

  The MCP search tool now scans newest-first over the same progressive time
  windows as the app's search page, under a 25s budget. When time runs out it
  returns the rows found so far with a `partial` block (requested range, the range
  fully covered, and the window that was cut off) and a hint for the next call,
  instead of failing after 30s. The time-window helpers moved from the app to
  `@hyperdx/common-utils/core/searchWindows`; the app's behavior is unchanged.

- 64a55d5b7: fix: allow grouping gauge and sum metric charts by an expression over the time column

  A table, pie or bar chart on a gauge or sum metric grouped by a time expression
  such as `toStartOfHour(TimeUnix)` or `toDate(TimeUnix)` failed with
  `Unknown identifier TimeUnix`, because the bucketed CTE the outer query reads
  did not carry the time column. When the group-by references it, `TimeUnix` now
  resolves to each metric bucket's start, so values are the same as the chart
  without the time group-by.

- e8d1d9add: fix: return the actual earliest/latest time for min/max on a date or time column

  `min` and `max` on a Date, DateTime, or DateTime64 column (for example
  `Timestamp`) returned 0, because every aggregation cast its value to Float64
  first. Tables, number tiles, and the MCP `clickstack_table` tool now return the
  timestamp itself. Line, bar, pie, and other charts, ratios, formulas, and number
  tiles with several series keep the numeric cast.

- 0c77d52a3: feat: rename the "Queried values" dashboard filter type to "SQL expression values"

  The new name separates it from "SQL query values" and "PromQL label values".

- e58329c87: fix: require the password when changing a connection's host

  Updating a connection's host without sending its password used to keep the stored password, so it would be sent to the new host on the next query. Both `PUT /connections/:id` and `PUT /api/v2/connections/:id` now return 400 in that case. Prometheus endpoints never use the stored password, so it is cleared instead. The connection form asks for the password when the host is edited and shows the API's error message.

- a0732b175: feat: save a temporary dashboard with its content intact
- 67e2eb36e: Use the sidebar layout icons for showing and hiding search filters
- 2cec94f7d: feat: let SQL query dashboard filters use an optional source

  A SQL query filter can now pick a source on its connection, or a data source variable, and can do so on a connection variable too. With one, its SQL can use `$__sourceTable` and `$__filters`, which applies the dashboard's filter selections for that source, the same way raw SQL tiles do. The external API and MCP read and write it as `sourceId`.

- 0c77d52a3: feat: autocomplete table and column names in the SQL query filter editor

  The SQL query dashboard filter's editor now suggests the tables and columns of
  the selected connection's sources, like the Raw SQL tile editor.

- 7afa31c71: feat: Add a team-wide default (All or Exact) for the search filters "Show All Values" setting
- 6a5fd1127: In dark mode, the field background now has opacity so it works on different
  backgrounds, such as popovers. It is set directly in the theme tokens instead of
  through a Click UI token that resolved to a solid color.
- Updated dependencies [22377dfcf]
- Updated dependencies [ef81fe6d8]
- Updated dependencies [b129ec1ac]
- Updated dependencies [e36cec3a2]
- Updated dependencies [1a4c116b2]
- Updated dependencies [351f19400]
- Updated dependencies [86acf27c0]
- Updated dependencies [e80fc1ba2]
- Updated dependencies [2f61137e2]
- Updated dependencies [64a55d5b7]
- Updated dependencies [e8d1d9add]
- Updated dependencies [d99be7650]
- Updated dependencies [e58329c87]
- Updated dependencies [2cec94f7d]
- Updated dependencies [7afa31c71]
- Updated dependencies [f11b9f58b]
- Updated dependencies [7905721bc]
  - @hyperdx/api@2.47.0
  - @hyperdx/common-utils@0.36.1

## @hyperdx/otel-collector@2.47.0

### Patch Changes

- d945d7ea8: fix(security): bump `clickhouse-go/v2` to v2.51.0 in the migration tool

  Pulls in `github.com/andybalholm/brotli` v1.2.7, which fixes GO-2026-6888
  (CVE-2026-111497), a denial of service in the brotli decompressor.

- f11b9f58b: perf: use 8,192-token text index dictionary blocks on the seeded tables

  On ClickHouse 26.6 and later, the collector's schema migration now sets
  `text_index_dictionary_block_size = 8192` (the default is 512) on `otel_logs`,
  `otel_traces` and `hyperdx_sessions`, with `ALTER TABLE … MODIFY SETTING` after
  the seed. Each part's text index sparse index is 16x smaller. Reading filter
  values with `mergeTreeTextIndex()` loads that index for every part on every
  read, and on a 537M-row table 4,096-token blocks already made those reads about
  10x cheaper per part, made searches for a rare attribute value 3-7x faster, and
  made searches for a common value 10-30% faster.

  Because it's an `ALTER`, existing installs get it too: new parts use 8,192-token
  blocks, and existing parts keep theirs until they're merged. A table that
  already sets `text_index_dictionary_block_size` is left alone, and operators who
  manage these tables themselves can turn the change off with
  `HYPERDX_OTEL_EXPORTER_SET_TEXT_INDEX_BLOCK_SIZE=false`. ClickHouse 26.2–26.5
  doesn't have the setting, so those servers keep 512-token blocks.

## @hyperdx/common-utils@0.36.1

### Patch Changes

- e36cec3a2: perf: share one Map key read between concurrent callers

  The search page's filter panel, search bar and group-by each load the same Map
  keys when the page opens. Each sent its own text index read, which on large
  tables can use several GiB of memory. Concurrent requests for the same keys now
  share one query.

- 1a4c116b2: perf: load search filter values faster in exact mode by reading several keys on
  one Map column with a single `groupUniqArrayMap`, and by querying plain columns
  and each Map or JSON column separately so slow attribute maps don't hold up the
  rest
- 351f19400: feat: allow up to 10,000 in the team "Filter Keys Fetch Limit" setting

  The setting's input in Team settings stopped at 1,000 keys per column; it now
  accepts up to 10,000. Map key discovery returns up to the setting's value per
  Map column, and never fewer than 1,000.

- 86acf27c0: perf: read only 20 median-sized parts for text index key and value lookups

  Map key discovery and "all values" lookups on text indexes read the index
  dictionary of every part in the time range, which is slow on tables with many
  parts. They now read the 20 parts closest to the median size. Log and trace
  sources can change the count with the new "Map key index parts" setting
  (`mapKeyIndexMaxParts`), and which parts are read with "Map key index part size"
  (`mapKeyIndexPartSelection`: median, smallest, or largest). "Load more" on a
  single filter key still reads every part in the time range.

- 2f61137e2: fix: return partial rows from `clickstack_search` instead of timing out

  The MCP search tool now scans newest-first over the same progressive time
  windows as the app's search page, under a 25s budget. When time runs out it
  returns the rows found so far with a `partial` block (requested range, the range
  fully covered, and the window that was cut off) and a hint for the next call,
  instead of failing after 30s. The time-window helpers moved from the app to
  `@hyperdx/common-utils/core/searchWindows`; the app's behavior is unchanged.

- 64a55d5b7: fix: allow grouping gauge and sum metric charts by an expression over the time column

  A table, pie or bar chart on a gauge or sum metric grouped by a time expression
  such as `toStartOfHour(TimeUnix)` or `toDate(TimeUnix)` failed with
  `Unknown identifier TimeUnix`, because the bucketed CTE the outer query reads
  did not carry the time column. When the group-by references it, `TimeUnix` now
  resolves to each metric bucket's start, so values are the same as the chart
  without the time group-by.

- e8d1d9add: fix: return the actual earliest/latest time for min/max on a date or time column

  `min` and `max` on a Date, DateTime, or DateTime64 column (for example
  `Timestamp`) returned 0, because every aggregation cast its value to Float64
  first. Tables, number tiles, and the MCP `clickstack_table` tool now return the
  timestamp itself. Line, bar, pie, and other charts, ratios, formulas, and number
  tiles with several series keep the numeric cast.

- d99be7650: fix: MCP `event_patterns`, `emerging_signals` and search denoise, and the CLI,
  no longer split the same log line by its date. Before mining, the Drain miner
  masks the date of a timestamp (weekday, day, month, year) to `<DATE>`, so dated
  lines from different days, months or years get the same template instead of one
  "new" and one "gone". Times and ids are not masked. Within one day lines group
  as before, except that klog lines with different severity letters are no longer
  merged. No mask changes a line's token count: the `event_patterns` drill-down
  predicate matches `<DATE>` as one or more non-whitespace characters, also inside
  a token (the new `masks` option of the pattern predicate builders, which only
  the MCP drill-down sets), and search denoise masks bodies the same way before
  matching. Masking instructions get an optional `perWord` flag (default off, as
  in drain3). The web app's Event patterns view uses its own drain3 config and is
  unchanged.
- 2cec94f7d: feat: let SQL query dashboard filters use an optional source

  A SQL query filter can now pick a source on its connection, or a data source variable, and can do so on a connection variable too. With one, its SQL can use `$__sourceTable` and `$__filters`, which applies the dashboard's filter selections for that source, the same way raw SQL tiles do. The external API and MCP read and write it as `sourceId`.

- 7afa31c71: feat: Add a team-wide default (All or Exact) for the search filters "Show All Values" setting
- f11b9f58b: perf: read large-block Map text index values per key, most frequent first

  "All values" lookups on Map key=value text indexes with large dictionary blocks
  (2048 or more, e.g. `text_index_dictionary_block_size = 8192`, which the
  collector's migration now sets on ClickHouse 26.6+)
  now read each key separately, in parallel queries of at most 10 keys, and stop
  after 20,000 tokens per key, so a key with a value per row (request IDs, UUIDs)
  can't hold up the others. Values come from `topKWeighted(limit)` weighted by
  each token's row count, so a capped list holds the most common values, most
  common first. These reads no longer apply `max_rows_to_read`: the index is read
  in sorted token order, so the cap left every key that sorts after a
  high-cardinality key with no values.

  Indexes with smaller blocks, including ClickHouse's default of 512, keep the
  previous query shape (one read for all of a query's keys, the alphabetically
  first values, and the `max_rows_to_read` cap), now in parallel queries of at
  most 10 keys, so the cap's cut-off affects at most 9 other keys. Every read loads
  each part's sparse index, which is large with small blocks, so one read per key
  would multiply that cost. The block size comes from the index definition, then
  the table's `text_index_dictionary_block_size`, then the server's.

  Text indexes on plain columns now return the most frequent values with
  `topKWeighted`, in parallel queries of at most 10 columns, without the row cap.

## @hyperdx/api@2.47.0

### Minor Changes

- 7905721bc: feat: Silence and unsilence alerts through the external API with POST and DELETE /api/v2/alerts/{id}/silenced

### Patch Changes

- 22377dfcf: perf: bound the check-alerts previous-history lookup by the alert interval

  The check-alerts task no longer scans 7 days of alert history per alert on
  every tick. A one-row lookup per alert skips alerts already evaluated in the
  current window. Non-grouped alerts take their previous state from that row,
  and grouped alerts scan a window sized to their interval (1 to 7 days).

- ef81fe6d8: feat: add `ENABLE_INGESTION_API_KEY` to honor `INGESTION_API_KEY` on the app image

  The app image ignores `INGESTION_API_KEY`, so an external collector has to use
  the team's generated key, which changes whenever the team is recreated. Set
  `ENABLE_INGESTION_API_KEY=true` on the API to accept a preset key alongside the
  team key. Behavior is unchanged when unset.

- b129ec1ac: feat: Classify failed ClickHouse proxy requests on the server span and the
  `clickhouse_proxy.query` SLI (`error_category`), including errors ClickHouse
  writes after a 200 response. The span also records the upstream status, the
  ClickHouse error code and type, and the body of upstream errors that carry no
  ClickHouse code.
- 86acf27c0: perf: read only 20 median-sized parts for text index key and value lookups

  Map key discovery and "all values" lookups on text indexes read the index
  dictionary of every part in the time range, which is slow on tables with many
  parts. They now read the 20 parts closest to the median size. Log and trace
  sources can change the count with the new "Map key index parts" setting
  (`mapKeyIndexMaxParts`), and which parts are read with "Map key index part size"
  (`mapKeyIndexPartSelection`: median, smallest, or largest). "Load more" on a
  single filter key still reads every part in the time range.

- e80fc1ba2: fix(mcp): explain hasToken() separator errors in query tools

  When a SQL filter calls `hasToken()` with a needle that contains `_`, `-`, `.`,
  `@`, `:` or spaces, ClickHouse fails with "Needle must not contain whitespace or
  separator characters". MCP query tools now append a hint pointing to a Lucene
  term, or in SQL to `position()` for the exact term (with `hasAllTokens()` as an
  optional text-index speed-up), and the `whereLanguage` description warns about
  it.

- 2f61137e2: fix: return partial rows from `clickstack_search` instead of timing out

  The MCP search tool now scans newest-first over the same progressive time
  windows as the app's search page, under a 25s budget. When time runs out it
  returns the rows found so far with a `partial` block (requested range, the range
  fully covered, and the window that was cut off) and a hint for the next call,
  instead of failing after 30s. The time-window helpers moved from the app to
  `@hyperdx/common-utils/core/searchWindows`; the app's behavior is unchanged.

- 64a55d5b7: fix: allow grouping gauge and sum metric charts by an expression over the time column

  A table, pie or bar chart on a gauge or sum metric grouped by a time expression
  such as `toStartOfHour(TimeUnix)` or `toDate(TimeUnix)` failed with
  `Unknown identifier TimeUnix`, because the bucketed CTE the outer query reads
  did not carry the time column. When the group-by references it, `TimeUnix` now
  resolves to each metric bucket's start, so values are the same as the chart
  without the time group-by.

- e8d1d9add: fix: return the actual earliest/latest time for min/max on a date or time column

  `min` and `max` on a Date, DateTime, or DateTime64 column (for example
  `Timestamp`) returned 0, because every aggregation cast its value to Float64
  first. Tables, number tiles, and the MCP `clickstack_table` tool now return the
  timestamp itself. Line, bar, pie, and other charts, ratios, formulas, and number
  tiles with several series keep the numeric cast.

- d99be7650: fix: MCP `event_patterns`, `emerging_signals` and search denoise, and the CLI,
  no longer split the same log line by its date. Before mining, the Drain miner
  masks the date of a timestamp (weekday, day, month, year) to `<DATE>`, so dated
  lines from different days, months or years get the same template instead of one
  "new" and one "gone". Times and ids are not masked. Within one day lines group
  as before, except that klog lines with different severity letters are no longer
  merged. No mask changes a line's token count: the `event_patterns` drill-down
  predicate matches `<DATE>` as one or more non-whitespace characters, also inside
  a token (the new `masks` option of the pattern predicate builders, which only
  the MCP drill-down sets), and search denoise masks bodies the same way before
  matching. Masking instructions get an optional `perWord` flag (default off, as
  in drain3). The web app's Event patterns view uses its own drain3 config and is
  unchanged.
- e58329c87: fix: require the password when changing a connection's host

  Updating a connection's host without sending its password used to keep the stored password, so it would be sent to the new host on the next query. Both `PUT /connections/:id` and `PUT /api/v2/connections/:id` now return 400 in that case. Prometheus endpoints never use the stored password, so it is cleared instead. The connection form asks for the password when the host is edited and shows the API's error message.

- 2cec94f7d: feat: let SQL query dashboard filters use an optional source

  A SQL query filter can now pick a source on its connection, or a data source variable, and can do so on a connection variable too. With one, its SQL can use `$__sourceTable` and `$__filters`, which applies the dashboard's filter selections for that source, the same way raw SQL tiles do. The external API and MCP read and write it as `sourceId`.

- 7afa31c71: feat: Add a team-wide default (All or Exact) for the search filters "Show All Values" setting
- Updated dependencies [e36cec3a2]
- Updated dependencies [1a4c116b2]
- Updated dependencies [351f19400]
- Updated dependencies [86acf27c0]
- Updated dependencies [2f61137e2]
- Updated dependencies [64a55d5b7]
- Updated dependencies [e8d1d9add]
- Updated dependencies [d99be7650]
- Updated dependencies [2cec94f7d]
- Updated dependencies [7afa31c71]
- Updated dependencies [f11b9f58b]
  - @hyperdx/common-utils@0.36.1
