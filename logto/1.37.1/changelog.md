### Patch Changes

This is a patch release to fix a missing version bump for `@logto/core-kit`.

In v1.37.0, extended ID token claims exports (`extendedIdTokenClaims`, `ExtendedIdTokenClaim`, `extendedIdTokenClaimsByScope`) were added to `@logto/core-kit` (#8317), but the changeset was missing, causing `@logto/core-kit` not to be bumped. This resulted in downstream packages (`@logto/schemas`, `@logto/console`) referencing exports that didn't exist in the published version.

#### @logto/core-kit@2.7.1

- Add extended id token claims exports
