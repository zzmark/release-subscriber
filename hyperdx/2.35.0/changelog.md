## @hyperdx/app@2.35.0

### Minor Changes

- 88f62274: Add an alert detail page (/alerts/:id) with the alert's query charted against
  its threshold, a widened evaluation-history strip, and a paginated evaluation
  event stream (per-group breakdown for group-by alerts, evaluation analytics
  columns, time-range-scoped cursor pagination). The alerts page history strip
  renders errored evaluation windows with per-window error details. Gated behind
  NEXT_PUBLIC_ENABLE_ALERT_DETAILS (default off).
- 8508b6c7: Terraform export now emits team-scoped import ids (`<team_id>/<resource_id>`),
  so resources can be imported from a ClickStack deployment that backs more than
  one team. Each imported resource gains a `team` attribute, which the provider
  marks as forcing replacement — the generated file now says to keep it. The
  provider floor moves to `>= 3.25.0`, which drops server-only dashboard ids when
  importing, so the generated dashboard config no longer churns tile ids (and the
  tile alerts attached to them) on apply.
- 72269ece: Hovering a release marker now lists every release in its cluster with the
  service that shipped it, its version, and the time. Colour alone could not
  identify a service once a chart had more series than the legend shows, and a
  collapsed "N releases" cluster named none of them.
- 08b8783b: Overlay release markers on dashboard tile charts, showing when each version of a
  service first appeared so a deployment can be lined up against a change in the
  data. Markers are scoped to the data each tile is charting and tinted to match
  their service's series color, and are suppressed on charts where they can't be
  tied to a visible line, so an aggregate line spanning many services isn't
  annotated with releases you can't attribute to it.
- d201b71f: Add an optional `serviceVersionExpression` to log and trace sources, identifying
  the running release of a service. Defaults to the OpenTelemetry
  `service.version` resource attribute; teams whose release identifier lives
  elsewhere, such as a container image tag under GitOps, can point it there
  instead of changing instrumentation.

### Patch Changes

- 05a3fd81: Add the AlertHistory evaluations read model and GET /alerts/:id/evaluations
  endpoint: per-window evaluation history scoped to a time range (clamped to the
  retention window) with per-group breakdown for group-by alerts, evaluation
  analytics fields, deduped error surfacing for ERROR-state windows, and
  cursor-based pagination that always advances across gaps. Adds read-side
  schema/type support for ERROR-state AlertHistory rows and evaluation analytics.
- c46ddaee: Require confirmation before deleting a dashboard from its detail page.
- b9430a62: feat: Add broadcast and variable settings to dashboard filters
- 546dd442: feat: Improve SQL Editor validations and autocomplete for variables
- cab98c7c: feat: Substitute dashboard variables in raw SQL tiles
- 90729734: Name `useRef` values consistently with a `Ref` suffix and enforce it via ESLint.
  Renames the 10 flagged refs (in `DOMPlayer`, `EditTimeChartForm`, `useMetadata`,
  `sessions`, and `utils`) to end in `Ref`, promotes
  `@eslint-react/naming-convention/ref-name` to `error`, and lowers the app's
  `--max-warnings` ceiling. Behavior is unchanged.
- 018a6486: Clean up ESLint warnings and tighten lint enforcement. Resolved all
  `no-unused-vars` and `@typescript-eslint/ban-ts-comment` warnings (removing dead
  code and converting `@ts-ignore` to described `@ts-expect-error`), then promoted
  those rules to `error` in the api/app/common-utils/cli/hdx-eval configs, disabled
  the noisy `@typescript-eslint/no-empty-function` rule in app, and lowered each
  package's `--max-warnings` ceiling so the counts can't regress. Behavior is
  unchanged.
- 582f3940: Show password requirements on the Join Team page and align the checklist with the server policy. When a user accepts a team invite and sets their password, the same live password policy checklist used on the auth/register page is now displayed, so users no longer have to guess the required length, casing, number, and special-character rules. The checklist previously diverged from the server in two ways that could show all-green checks for a password the server rejects: its special-character rule used a broader pattern than the backend (so a password whose only special character was e.g. `~`, a backtick, or a space passed the checklist but failed on submit), and it never surfaced the 72-character maximum (so an over-long password passed the checklist but failed on submit). The length rule now enforces both the minimum and maximum, and the password policy checks (length bounds, casing, number, and the accepted special-character set) live in a single shared module in `@hyperdx/common-utils` used by both the frontend checklist and the backend `passwordSchema`, so they can no longer drift. Finally, when the server rejects a password the Join Team page now shows the specific reason(s) it failed (e.g. "Password must include at least one special character (!@#$%^&\*(),.?\":{}|<>;-+=)") instead of a generic "Password is invalid", so users are told exactly what to change — including which special characters are accepted.
- 69a89aa9: fix: Restore Lucene autocomplete
- aedb514f: Multi-series metric charts now run as a single composed ClickHouse query instead of one query per series joined client-side. The per-series queries are combined via UNION ALL and pivoted back into one row per (group, time bucket) in SQL, including ratio charts (`seriesReturnType: 'ratio'`) and both `ratioMode` variants, which previously divided the two result sets in the browser/node. Result shape, column naming (including same-alias `__{index}` disambiguation), gap semantics, and ratio semantics are unchanged; charts with many series render with fewer round trips, and "View SQL" for multi-series metric charts now shows the full query instead of only the first series.
- 463fd6a1: Preserve literal percent sequences in legacy JSON URL parameters.
- Updated dependencies [fd54ac78]
- Updated dependencies [05a3fd81]
- Updated dependencies [b9430a62]
- Updated dependencies [546dd442]
- Updated dependencies [cab98c7c]
- Updated dependencies [b6196031]
- Updated dependencies [de783063]
- Updated dependencies [018a6486]
- Updated dependencies [8508b6c7]
- Updated dependencies [582f3940]
- Updated dependencies [2d33b83b]
- Updated dependencies [4fa4975a]
- Updated dependencies [f891eb19]
- Updated dependencies [4c5ccfc4]
- Updated dependencies [6662379e]
- Updated dependencies [0ed72ddf]
- Updated dependencies [aedb514f]
- Updated dependencies [f34cfaed]
- Updated dependencies [d201b71f]
- Updated dependencies [711b905d]
- Updated dependencies [908b27ed]
  - @hyperdx/common-utils@0.26.0
  - @hyperdx/api@2.35.0

## @hyperdx/otel-collector@2.35.0

### Minor Changes

- 8351d632: Add OIDC-based bearer token authentication for the OTLP receiver in standalone mode, as an alternative to the existing static `OTLP_AUTH_TOKEN`. Set `OIDC_ISSUER_URL` and `OIDC_AUDIENCE` to validate incoming OTLP requests against an OIDC provider's published JWKS instead of a single long-lived shared secret.

### Patch Changes

- 58a467ae: Use the OpAMP supervisor's native `passthrough_logs` for collector log
  forwarding instead of a background `tail` process. The old approach had
  the supervisor and the tailer writing to the same stdout fd with no
  synchronization, so log lines were getting mangled by the two streams
  interleaving mid-line. The native approach has the supervisor re-emitting
  the collector's output through its own logger to avoid this.

## @hyperdx/common-utils@0.26.0

### Minor Changes

- fd54ac78: Persist alert evaluation errors (query errors, timeouts, webhook failures) as
  ERROR-state AlertHistory records instead of only a latest-only snapshot,
  upserted per evaluation window so retries collapse into a single row. Query
  timeouts are classified separately (QUERY_TIMEOUT, including timeouts wrapped
  by the ClickHouse query client) with an actionable message. ERROR rows are
  excluded from scheduling/backfill computations so failed windows are still
  retried and backfilled, and once a failed window recovers (via a same-window
  retry or a later tick's backfill) its stale ERROR row is removed. Evaluation
  analytics (query/webhook durations, backfilled buckets) are recorded on every
  history row.
- 05a3fd81: Add the AlertHistory evaluations read model and GET /alerts/:id/evaluations
  endpoint: per-window evaluation history scoped to a time range (clamped to the
  retention window) with per-group breakdown for group-by alerts, evaluation
  analytics fields, deduped error surfacing for ERROR-state windows, and
  cursor-based pagination that always advances across gaps. Adds read-side
  schema/type support for ERROR-state AlertHistory rows and evaluation analytics.
- 8508b6c7: Terraform export now emits team-scoped import ids (`<team_id>/<resource_id>`),
  so resources can be imported from a ClickStack deployment that backs more than
  one team. Each imported resource gains a `team` attribute, which the provider
  marks as forcing replacement — the generated file now says to keep it. The
  provider floor moves to `>= 3.25.0`, which drops server-only dashboard ids when
  importing, so the generated dashboard config no longer churns tile ids (and the
  tile alerts attached to them) on apply.
- 0ed72ddf: Add the metric formula expression model: a `formulas` entry on chart configs (letter-based series refs — `A`, `B`, `C` map to `select` positions) plus an arithmetic-only parser/validator (`core/formula.ts`) that produces a validated AST and structured validation errors (unknown series ref, empty expression, malformed syntax, invalid tokens). Groundwork for metric formulas like `A / (A + B + C) * 100`; no query rendering or UI changes yet.

### Patch Changes

- b9430a62: feat: Add broadcast and variable settings to dashboard filters
- 546dd442: feat: Improve SQL Editor validations and autocomplete for variables
- cab98c7c: feat: Substitute dashboard variables in raw SQL tiles
- 018a6486: Clean up ESLint warnings and tighten lint enforcement. Resolved all
  `no-unused-vars` and `@typescript-eslint/ban-ts-comment` warnings (removing dead
  code and converting `@ts-ignore` to described `@ts-expect-error`), then promoted
  those rules to `error` in the api/app/common-utils/cli/hdx-eval configs, disabled
  the noisy `@typescript-eslint/no-empty-function` rule in app, and lowered each
  package's `--max-warnings` ceiling so the counts can't regress. Behavior is
  unchanged.
- 2d33b83b: Escape the Map subscript once in numeric and Bool field searches

  The three equality branches for `Bool` and numeric value types escaped the
  column expression as an identifier even when it was already a rendered map
  subscript, so `Measures.latency_ms:250` wrapped `` `Measures`['latency_ms'] ``
  in a second layer of backticks that ClickHouse reads as one identifier rather
  than a map lookup. Quoting the term worked around it for numeric maps; for
  `Map(String, Bool)` columns both spellings were affected.

- aedb514f: Multi-series metric charts now run as a single composed ClickHouse query instead of one query per series joined client-side. The per-series queries are combined via UNION ALL and pivoted back into one row per (group, time bucket) in SQL, including ratio charts (`seriesReturnType: 'ratio'`) and both `ratioMode` variants, which previously divided the two result sets in the browser/node. Result shape, column naming (including same-alias `__{index}` disambiguation), gap semantics, and ratio semantics are unchanged; charts with many series render with fewer round trips, and "View SQL" for multi-series metric charts now shows the full query instead of only the first series.

## @hyperdx/api@2.35.0

### Minor Changes

- fd54ac78: Persist alert evaluation errors (query errors, timeouts, webhook failures) as
  ERROR-state AlertHistory records instead of only a latest-only snapshot,
  upserted per evaluation window so retries collapse into a single row. Query
  timeouts are classified separately (QUERY_TIMEOUT, including timeouts wrapped
  by the ClickHouse query client) with an actionable message. ERROR rows are
  excluded from scheduling/backfill computations so failed windows are still
  retried and backfilled, and once a failed window recovers (via a same-window
  retry or a later tick's backfill) its stale ERROR row is removed. Evaluation
  analytics (query/webhook durations, backfilled buckets) are recorded on every
  history row.
- 05a3fd81: Add the AlertHistory evaluations read model and GET /alerts/:id/evaluations
  endpoint: per-window evaluation history scoped to a time range (clamped to the
  retention window) with per-group breakdown for group-by alerts, evaluation
  analytics fields, deduped error surfacing for ERROR-state windows, and
  cursor-based pagination that always advances across gaps. Adds read-side
  schema/type support for ERROR-state AlertHistory rows and evaluation analytics.
- 4fa4975a: Add a `clickstack_query_tiles` MCP tool that validates many dashboard tiles in
  a single call. It accepts a dashboard ID and an optional list of tile IDs
  (default: every non-markdown tile), runs the tile queries with bounded
  concurrency, and returns a compact per-tile success/failure summary
  (status, row count, errors, and raw-SQL macro warnings) plus an aggregate
  count. A tile that fails to query is reported inline without failing the whole
  call, so an agent can validate an entire dashboard in one or two calls instead
  of one `clickstack_query_tile` call per tile. The `clickstack_save_dashboard`
  guidance now points at the batch tool for post-save validation.
- d201b71f: Add an optional `serviceVersionExpression` to log and trace sources, identifying
  the running release of a service. Defaults to the OpenTelemetry
  `service.version` resource attribute; teams whose release identifier lives
  elsewhere, such as a container image tag under GitOps, can point it there
  instead of changing instrumentation.

### Patch Changes

- b9430a62: feat: Add broadcast and variable settings to dashboard filters
- b6196031: Treat a session whose user no longer exists as logged out instead of failing the
  request. Deleting a team member left that person's browser holding a session
  cookie pointing at a user document that was gone, and `deserializeUser` reported
  the missing user as an error rather than as an unauthenticated session. Because
  `passport.session()` runs ahead of every router, each request carrying the
  cookie came back `500 Something went wrong :(` regardless of path or method,
  including public routes such as `POST /team/setup/:token` and `GET /logout`, so
  a removed person could neither accept a fresh invite nor clear their own
  session. The stale id is now dropped from the session and the request continues
  unauthenticated, so protected routes answer 401 and the browser is sent back to
  the login page.
- de783063: Clear the remaining small api ESLint warnings and enforce their rules. Merges
  the duplicate Express `declare global` namespace blocks in the auth middleware
  (the `namespace` + empty-interface augmentation pattern is required, so it
  carries a scoped disable with a comment), and scopes `n/no-process-exit` off for
  the process entry points (`src/index.ts`, `src/tasks/index.ts`) where exiting
  with a status code is intended. `@typescript-eslint/no-namespace`,
  `no-empty-object-type`, and `n/no-process-exit` are promoted to `error` and the
  api `--max-warnings` ceiling is lowered. Behavior is unchanged.
- 018a6486: Clean up ESLint warnings and tighten lint enforcement. Resolved all
  `no-unused-vars` and `@typescript-eslint/ban-ts-comment` warnings (removing dead
  code and converting `@ts-ignore` to described `@ts-expect-error`), then promoted
  those rules to `error` in the api/app/common-utils/cli/hdx-eval configs, disabled
  the noisy `@typescript-eslint/no-empty-function` rule in app, and lowered each
  package's `--max-warnings` ceiling so the counts can't regress. Behavior is
  unchanged.
- 582f3940: Show password requirements on the Join Team page and align the checklist with the server policy. When a user accepts a team invite and sets their password, the same live password policy checklist used on the auth/register page is now displayed, so users no longer have to guess the required length, casing, number, and special-character rules. The checklist previously diverged from the server in two ways that could show all-green checks for a password the server rejects: its special-character rule used a broader pattern than the backend (so a password whose only special character was e.g. `~`, a backtick, or a space passed the checklist but failed on submit), and it never surfaced the 72-character maximum (so an over-long password passed the checklist but failed on submit). The length rule now enforces both the minimum and maximum, and the password policy checks (length bounds, casing, number, and the accepted special-character set) live in a single shared module in `@hyperdx/common-utils` used by both the frontend checklist and the backend `passwordSchema`, so they can no longer drift. Finally, when the server rejects a password the Join Team page now shows the specific reason(s) it failed (e.g. "Password must include at least one special character (!@#$%^&\*(),.?\":{}|<>;-+=)") instead of a generic "Password is invalid", so users are told exactly what to change — including which special characters are accepted.
- f891eb19: fix(mcp): steer agents toward builder query tools instead of raw SQL (HDX-4892). Telemetry showed agents (notebook investigations) using `clickstack_sql` for ~73% of data queries — usually for single-source aggregations, top-N, and time-series that the builder tools express more reliably (raw SQL also had ~2x the error rate). Reworded the `clickstack_sql` description to mark it a last resort, added a reciprocal "prefer me over SQL" nudge to `clickstack_table`, `clickstack_timeseries`, and `clickstack_search`, and added a server-level `instructions` tool-selection policy so the guidance is surfaced on `initialize` rather than only via the opt-in `query_guide` prompt.
- 4c5ccfc4: Add MCP tool annotations (readOnlyHint, destructiveHint) to every MCP tool so
  clients can distinguish read-only query tools from mutating ones. Read/query
  tools are marked read-only; save/patch and delete tools are marked destructive
  since they can overwrite or remove existing resources. Hints that would be
  redundant against the MCP spec defaults are omitted (e.g. destructiveHint is
  left off read-only tools, where it has no meaning).
- 6662379e: feat: expose summary metrics through the mcp
- f34cfaed: Remove the non-functional `GET /ext/silence-alert/:token` endpoint and its dead code path.
- 711b905d: Guide dashboard MCP agents to filter builder tiles (table, line, stacked_bar,
  number, pie, bar) with the per-series `where` on each select item, which the
  chart editor surfaces as the tile's visible "Where" box. The dashboard prompt
  and the select-item `where` tool description now steer toward it, and the save
  and patch tools reject a tile-config-level `where`/`whereLanguage` on these
  types with an actionable message (the editor does not render a tile-level filter
  for them, so it would be invisible and uneditable). Search, heatmap, and
  event_patterns tiles keep their tile-level `where`.
- 908b27ed: Reject source writes that reference malformed, missing, or another team's
  connection.
- Updated dependencies [fd54ac78]
- Updated dependencies [05a3fd81]
- Updated dependencies [b9430a62]
- Updated dependencies [546dd442]
- Updated dependencies [cab98c7c]
- Updated dependencies [018a6486]
- Updated dependencies [8508b6c7]
- Updated dependencies [2d33b83b]
- Updated dependencies [0ed72ddf]
- Updated dependencies [aedb514f]
  - @hyperdx/common-utils@0.26.0
