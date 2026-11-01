## @hyperdx/app@2.43.1

### Patch Changes

- @hyperdx/api@2.43.1

## @hyperdx/otel-collector@2.43.1

### Patch Changes

- 7a9fe57d3: Disable Multipath TCP in the collector image by setting `GODEBUG=multipathtcp=0`
  at startup, mitigating CVE-2026-98432. Go 1.24+ opens MPTCP listeners by
  default. Any other `GODEBUG` settings you pass are kept, and an explicit
  `multipathtcp=` value is left as is. This also applies to the all-in-one image.
  Patching the host kernel is still the actual fix.

## @hyperdx/api@2.43.1


