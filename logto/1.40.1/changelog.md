### Patch Changes

This is a patch release to correct a missed version bump for `@logto/core-kit`, again...

In v1.40.0, new `@logto/core-kit` exports were introduced for Custom UI CSP utilities and protected app additional scopes, but the changeset did not make it into the release. As a result, `@logto/core-kit` stayed at `2.9.0` while downstream packages were already expecting the new exports. JavaScript package graphs are forgiving about many things; missing exports are not one of them.

v1.40.1 publishes `@logto/core-kit@2.10.0` so the released packages are back in sync.

#### @logto/core-kit@2.10.0

- Add custom CSP utility methods
