<img width="4240" height="2384" alt="logto-changelog-2026-04" src="https://github.com/user-attachments/assets/0df96833-fdf4-4644-9931-11a5db796d06" />

## Highlights
- **Private signing key rotation grace period**: Logto now supports a grace period when rotating private signing keys, helping clients refresh cached JWKS without downtime.
- **Custom JWT script error handling**: Access token and client credentials JWT customization can now block token issuance when scripts fail.
- **Account Center security page**: End users can now manage social account linking, MFA, and account deletion from the Account Center.
- **WhatsApp connector**: A new WhatsApp SMS connector is available through the Meta Cloud API.
- **Security and compatibility fixes**: Forgot-password verification responses are now unified to reduce account enumeration risk, and in-app browser social / SSO redirects are more resilient.

## New features & enhancements

### Private signing key rotation grace period

Logto now supports a grace period during private signing key rotation.

This can be configured through:

- The `PRIVATE_KEY_ROTATION_GRACE_PERIOD` environment variable.
- The `--gracePeriod` CLI option.

During the grace period:

- The newly generated signing key is marked as **Next**.
- The existing signing key remains active as **Current**.
- Clients have time to refresh cached JWKS before the new key becomes active.

After the grace period ends:

- The new private signing key transitions to **Current**.
- The old signing key is marked as **Previous**.

This provides a smoother key rotation process and helps avoid authentication failures caused by stale JWKS caches.

Documentation: <https://docs.logto.io/logto-oss/using-cli/rotate-signing-keys>

### Custom JWT script error handling

Logto now supports configurable error handling for custom JWT scripts used in access token and client credentials flows.

Included changes:

- Custom JWT scripts can now block token issuance when execution fails.
- `api.denyAccess()` is preserved as an `access_denied` response.
- Other blocking-mode script failures are returned as localized `invalid_request` responses.
- Console adds a dedicated **Error handling** tab for configuring the behavior.
- Newly created scripts default `blockIssuanceOnError` to enabled.
- Existing scripts without a saved value keep the legacy disabled behavior.
- Related Console guidance, phrases, schemas, and integration coverage are updated.

This helps developers choose whether token customization failures should fail open or fail closed depending on their security requirements.

### Account Center security page

This release adds a new security page to the out-of-the-box Account Center.

End users can now manage account security from `/account/security`, including:

- Social account linking and unlinking.
- MFA 2-step verification.
- Account deletion.

Console support:

- The sign-in experience Account Center settings now expose the delete-account URL field.
- Console surfaces Account Center and social prebuilt UI entries.

### WhatsApp connector via Meta Cloud API

A new WhatsApp connector is added for sending messages through the Meta Cloud API.

This enables WhatsApp-based SMS / verification-code delivery scenarios using the official Meta Cloud API integration.

### Organization assignment API response bodies

Organization user and role assignment APIs now return response bodies.

Updated endpoints:

- `POST /organizations/:id/users` now returns `{ userIds: string[] }`, echoing the user IDs sent in the request.
- `POST /organizations/:id/users/:userId/roles` now returns `{ organizationRoleIds: string[] }`, containing the final deduplicated role IDs assigned to the user, including IDs resolved from provided role names.

### Console theme token update

Console themes now include the missing `--color-overlay-primary-subtle` token for both light and dark modes.

## Bug fixes & stability

### Forgot-password verification enumeration protection

Forgot-password verification now returns a unified `verification_code.code_mismatch` error.

This prevents the flow from exposing whether an email or phone number exists through different error responses.

### Social and SSO redirects in in-app browsers

Improved social and SSO redirect reliability in in-app browsers such as Instagram, Facebook, and LINE.

Some in-app browsers open OAuth identity provider pages in a new WebView, which can cause `sessionStorage` to be lost after redirecting back.

This release adds a `localStorage` fallback:

- Redirect state is still stored in `sessionStorage`.
- A fallback redirect context bundle is also stored in `localStorage`.
- On callback, Logto restores state from `localStorage` if `sessionStorage` is missing.
- Fallback entries are consumed on read and automatically swept after 10 minutes.
- If both storage locations are empty, the user sees an error toast.

### Verification code connector request IP

Fixed an issue where the request IP was not passed to connectors when sending verification codes.

This allows connectors to receive the correct request context for verification-code delivery.

## Contributors
Thanks to everyone who contributed to this release:

- @konlanx in #8626 
- @makisekuris in #8616 
- @MrMardel in #8458
