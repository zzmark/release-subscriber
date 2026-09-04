## Note

This patch release resolves the issues with invites.
If you have applied any workaround to fix this locally, please revert those fixes to prevent possible other issues.

I'm sorry that it took some time to check and validate this fix.

Also, this release fixes an issue (#7475) with all the Alpine based images which are build using https://github.com/BlackDex/rust-musl/.
An issue with the build image OpenSSL compilation is resolved and those are used to build the new `alpine` tagged containers.

## What's Changed
* Always send initOrganization and orgUserHasExistingUser in invite URL by @vikfox in https://github.com/dani-garcia/vaultwarden/pull/7482
* Indirectly resolved #7475 by using newer rust-musl build images which had a compilation issue with OpenSSL.

## New Contributors
* @vikfox made their first contribution in https://github.com/dani-garcia/vaultwarden/pull/7482

**Full Changelog**: https://github.com/dani-garcia/vaultwarden/compare/1.37.0...1.37.1
