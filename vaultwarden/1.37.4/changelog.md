## Security Fixes
This release contains security fixes for the following advisories. We strongly advise updating as soon as possible.
- Organization member revocation [[GHSA-69q9-v8p6-xvx3]](https://github.com/dani-garcia/vaultwarden/security/advisories/GHSA-69q9-v8p6-xvx3) (**High**, 8.1)
- Two-factor authentication [[GHSA-7jg8-8m5x-6j9r]](https://github.com/dani-garcia/vaultwarden/security/advisories/GHSA-7jg8-8m5x-6j9r) (**Medium**, 6.8)
- Organization invitations [[GHSA-v576-3wvq-xh3c]](https://github.com/dani-garcia/vaultwarden/security/advisories/GHSA-v576-3wvq-xh3c) (**Medium**, 6.8)
- Attachments [[GHSA-q5x6-grh5-fqgc]](https://github.com/dani-garcia/vaultwarden/security/advisories/GHSA-q5x6-grh5-fqgc) (**Medium**, 6.5)
- Organization event logs [[GHSA-64mc-4p6f-r7x9]](https://github.com/dani-garcia/vaultwarden/security/advisories/GHSA-64mc-4p6f-r7x9) (**Medium**, 4.3)
- Cipher sharing [[GHSA-7ccc-c43j-4p36]](https://github.com/dani-garcia/vaultwarden/security/advisories/GHSA-7ccc-c43j-4p36) (**Medium**, 4.3)
- Organization API key [[GHSA-qwx4-wcv4-mpcv]](https://github.com/dani-garcia/vaultwarden/security/advisories/GHSA-qwx4-wcv4-mpcv) (**Low**, 3.8)
- Additional dependency updates and minor security enhancements

These are private for now, pending CVE assignment and publishing at a later date.

> [!NOTE]
> If an organization has Admins you don't fully trust, consider rotating its API key after updating (Admin Console → Settings → Rotate API key). Before this release, Admins could also view the key.

## Upgrade notes
- **Reverse proxies:** with `IP_HEADER=X-Forwarded-For`, the client IP is now the rightmost address that isn't in `IP_HEADER_TRUSTED_PROXIES` (it used to be the leftmost). If you have several proxies in a row, for example a CDN in front of nginx, add all of them to `IP_HEADER_TRUSTED_PROXIES`. Otherwise the address of the proxy in front is used for rate limiting and logs.
- **Sends:** `bw send receive` on CLI 2026.4.2 and older no longer works, the same as against Bitwarden's own servers since v2026.8.0. Creating and managing Sends works on all clients.
- **Feature flags:** these flags were removed because no client reads them anymore: `ssh-agent`, `ssh-key-vault-item`, `mutual-tls`, `anon-addy-self-host-alias`, `simple-login-self-host-alias`, `pm-25373-windows-biometrics-v2`, `pm-26340-linux-biometrics-v2`, `desktop-ui-migration-milestone-1` to `-4`, `cxp-import-mobile` and `cxp-export-mobile`. If `EXPERIMENTAL_CLIENT_FEATURE_FLAGS` still lists one of them, startup logs a warning and saving settings in the admin panel fails until it's removed.
- **Duo:** `DUO_USE_IFRAME` (the deprecated Traditional Prompt) is removed and ignored if set.
- **Custom templates:** there's a new email template, `email/recover_twofactor`, sent after a login with a two-step recovery code.
- The legacy `POST /identity/accounts/register` and `POST /api/accounts/prelogin` endpoints are removed. No current client uses them.

## What's Changed
* [Web 2026.9.0] Support the vault banner policy by @tom27052006 in https://github.com/dani-garcia/vaultwarden/pull/7748
* Add support for basic auth response client feature flag by @tom27052006 in https://github.com/dani-garcia/vaultwarden/pull/7745
* [web-v2026.8.1] store the user key ID by @Timshel in https://github.com/dani-garcia/vaultwarden/pull/7693
* Add organizationsNew and policiesNew to sync response by @tom27052006 in https://github.com/dani-garcia/vaultwarden/pull/7666
* Add `pm-32009-new-item-types` feature flag by @bdd in https://github.com/dani-garcia/vaultwarden/pull/7478
* Update Crates, GHA and JS by @BlackDex in https://github.com/dani-garcia/vaultwarden/pull/7751
* Add `pm-34171-card-scanner` feature flag by @bdd in https://github.com/dani-garcia/vaultwarden/pull/7477
* set user_created bool for each separate invitation by @stefan0xC in https://github.com/dani-garcia/vaultwarden/pull/7753
* Fix revoked org members retaining access to org ciphers by @abhiShandy in https://github.com/dani-garcia/vaultwarden/pull/7554
* Ensure all user checked routes are confirmed by @dani-garcia in https://github.com/dani-garcia/vaultwarden/pull/7763
* Fix cortex-a53 build issues when using xx-cargo by @BlackDex in https://github.com/dani-garcia/vaultwarden/pull/7774
* Add `undetermined-cipher-scenario-logic` feature flag (closes #7801) by @cad0p in https://github.com/dani-garcia/vaultwarden/pull/7802
* Add Windows native credential sync to supported feature flags by @KingIronMan2011 in https://github.com/dani-garcia/vaultwarden/pull/7798
* Hide the whole change-email section when EMAIL_CHANGE_ALLOWED is false by @tom27052006 in https://github.com/dani-garcia/vaultwarden/pull/7759
* Fix Clippy warnings across all targets by @tom27052006 in https://github.com/dani-garcia/vaultwarden/pull/7782
* Admin reset: 2fa email fallback need a verified email by @Timshel in https://github.com/dani-garcia/vaultwarden/pull/7770
* Sends cleanup: remove legacy endpoints and align with upstream by @dani-garcia in https://github.com/dani-garcia/vaultwarden/pull/7806
* Remove legacy API endpoints and compatibility code by @dani-garcia in https://github.com/dani-garcia/vaultwarden/pull/7809
* Align API with upstream and remove unwraps by @dani-garcia in https://github.com/dani-garcia/vaultwarden/pull/7810
* Update crates, Rust and other dependencies by @BlackDex in https://github.com/dani-garcia/vaultwarden/pull/7814

## New Contributors
* @bdd made their first contribution in https://github.com/dani-garcia/vaultwarden/pull/7478
* @abhiShandy made their first contribution in https://github.com/dani-garcia/vaultwarden/pull/7554
* @cad0p made their first contribution in https://github.com/dani-garcia/vaultwarden/pull/7802
* @KingIronMan2011 made their first contribution in https://github.com/dani-garcia/vaultwarden/pull/7798

**Full Changelog**: https://github.com/dani-garcia/vaultwarden/compare/1.37.3...1.37.4