## @hyperdx/app@2.43.0

### Minor Changes

- 0212c7bd3: feat: Expose alert tags to Generic and incident.io webhook bodies as `{{tags}}` (comma-separated, or iterate with `{{#each tags}}`), and include them in the default incident.io body's `metadata.tags`, so one shared webhook can route alerts by owning team

### Patch Changes

- 4ea523a1b: Fix the alert preview chart highlighting the region below the threshold for "above" alerts. Recharts v3 flipped the default edge for open-ended reference areas, so "above" and "not between" alerts shaded the wrong side of the threshold line.
- e88f71695: fix: keep backtick-quoted column names that contain a comma intact when toggling search columns or editing group by
- 00768bbc1: fix: Use sentence case for sidebar nav labels, menus, and tooltips
- 5a3ad91c7: feat: Session replay shows clicks, navigations, console output and exceptions from OpenTelemetry browser SDKs
- 7d23f7922: feat: List and play session replays from OpenTelemetry browser SDKs that send `session.id`
- Updated dependencies [e88f71695]
- Updated dependencies [e5ba5dfde]
- Updated dependencies [f2b898684]
- Updated dependencies [0212c7bd3]
  - @hyperdx/common-utils@0.33.0
  - @hyperdx/api@2.43.0

## @hyperdx/otel-collector@2.43.0



## @hyperdx/common-utils@0.33.0

### Minor Changes

- 0212c7bd3: feat: Expose alert tags to Generic and incident.io webhook bodies as `{{tags}}` (comma-separated, or iterate with `{{#each tags}}`), and include them in the default incident.io body's `metadata.tags`, so one shared webhook can route alerts by owning team

### Patch Changes

- e88f71695: fix: keep backtick-quoted column names that contain a comma intact when toggling search columns or editing group by
- e5ba5dfde: fix: Keep string literals as written when rewriting `Map['key'] = 'value'` filters to the key-value items index, so values containing quotes or backslashes match instead of returning no rows

## @hyperdx/api@2.43.0

### Minor Changes

- 0212c7bd3: feat: Expose alert tags to Generic and incident.io webhook bodies as `{{tags}}` (comma-separated, or iterate with `{{#each tags}}`), and include them in the default incident.io body's `metadata.tags`, so one shared webhook can route alerts by owning team

### Patch Changes

- f2b898684: fix: pin bundled ClickHouse to 26.8.36.3 for a security fix

  The all-in-one image and the Docker Compose files now use
  `clickhouse/clickhouse-server:26.8.36.3-alpine` instead of the floating
  `26.8-alpine` tag.

- Updated dependencies [e88f71695]
- Updated dependencies [e5ba5dfde]
- Updated dependencies [0212c7bd3]
  - @hyperdx/common-utils@0.33.0
