<img width="1060" height="596" alt="logto-changelog-2026-09" src="https://github.com/user-attachments/assets/16b11f26-0c2a-4601-8562-174e5015519b" />



## Highlights



- **MFA trusted devices**: After completing MFA, users can trust their browser and skip repeated MFA prompts on it. Admins set the policy for the whole tenant, restrict it per organization, and manage devices from Console, Account Center, and the APIs.

- **Keep your user IDs when migrating**: User IDs can now be up to 128 characters, and self-hosted Logto accepts a custom `id` when creating a user, so IDs such as `auth0|abc123` survive a migration. The Management API can also look up users by their external identity.

- **Cap, a self-hosted CAPTCHA**: Use [Cap](https://capjs.js.org) for bot protection where Cloudflare Turnstile and Google reCAPTCHA are unreachable or unreliable. reCAPTCHA Enterprise also gets a configurable score threshold.

- **Authentication policies for SAML applications**: Let a SAML application reuse an existing Logto session, require signed authentication requests, and get the actual authentication time in assertions.

- **`theme` authentication parameter**: Pass `theme=light` or `theme=dark` to keep the sign-in experience in sync with your app's own theme toggle.

- **Refresh tokens for dynamic app clients**: A new client compatibility setting for dynamic apps (CIMD) lets MCP clients such as ChatGPT and Codex receive refresh tokens, so users stop having to sign in again every time the access token expires. Applications registered in Logto are not affected.



## New features & enhancements



### MFA trusted devices



Users who complete MFA can now choose to trust their browser and skip repeated MFA prompts there.



- **Tenant policy**: Enable trusted devices in **Console > Multi-factor authentication** and set a trust duration from 1 to 365 days (default: 30). The policy is off by default.

- **Organization restrictions**: An organization can disallow trusted devices for its members. This only tightens the tenant policy.

- **Trust this device page**: After an eligible MFA verification or setup, users see a dedicated page at the end of sign-in or sign-up, where they can trust the browser for the configured duration or skip.

- **Device management**: Admins view and remove a user's trusted devices in **Console > User management** or through `GET /api/users/{userId}/trusted-devices` and `DELETE /api/users/{userId}/trusted-devices/{trustedDeviceId}`. Users manage their own devices in Account Center (field control: Off, Read-only, or Edit) or through the Account API at `/api/my-account/trusted-devices` with the `urn:logto:scope:trusted_devices` scope.

- **Webhooks and audit logs**: Subscribe to `TrustedDevice.Created` and `TrustedDevice.Deleted` webhooks. Audit logs record `TrustedDevice.Created` and `TrustedDevice.Used`.



A trusted device only fulfills the MFA step of a sign-in. It does not satisfy identity verification, account recovery, or other sensitive account operations. See [MFA trusted devices](https://docs.logto.io/end-user-flows/mfa/trusted-devices).



### Keep existing user IDs when migrating



- **Longer user IDs**: `users.id` and every column that references it were limited to 12 or 21 characters. They now accept up to 128 characters.

- **Custom user ID on create** (Logto OSS only): `POST /api/users` accepts an optional `id` of up to 128 characters (letters, numbers, and `_ - . @ : + = |`). Use it to preserve IDs such as `auth0|abc123` or UUIDs when migrating from another identity provider. If the ID is taken, the request fails with `user.id_already_in_use`. Logto Cloud does not support this. See [Keep existing user IDs](https://docs.logto.io/user-management/user-migration#keep-existing-user-ids).

- **Look up users by external identity**: `GET /api/users` accepts `identityType`, `identityProvider`, and `identityId` for exact lookup. Use `identityType=social` with a connector target (such as `dingtalk`), or `identityType=sso` with an enterprise SSO issuer, together with the user identifier issued by that provider. The identity filter combines with other search filters using AND logic. See [Look up by external identity](https://docs.logto.io/user-management/advanced-user-search#look-up-by-external-identity). Thanks to [@JunWang666](https://github.com/JunWang666) ([#9572](https://github.com/logto-io/logto/pull/9572)).



### Bot protection



#### Cap as a self-hosted CAPTCHA provider



[Cap](https://capjs.js.org) is an open-source, self-hosted proof-of-work CAPTCHA. It needs no third-party service, so bot protection keeps working in regions where Cloudflare Turnstile and Google reCAPTCHA are unreachable or unreliable.



1. Deploy a publicly reachable [Cap Standalone](https://capjs.js.org/guide/standalone/) instance and create a site key.

2. Go to **Console > Security > CAPTCHA** and add Cap with the instance endpoint, site key, and secret key. The same configuration is available through `PUT /api/captcha-provider` with `type: "Cap"`.



While Cap is the CAPTCHA provider, the sign-in page's Content Security Policy allows the Cap instance and dynamic JavaScript evaluation, which Cap's instrumentation challenge requires. Thanks to [@imJack6](https://github.com/imJack6) for the request ([#9404](https://github.com/logto-io/logto/issues/9404)).



#### reCAPTCHA Enterprise score threshold



Set the minimum accepted score (0.0 to 1.0) for reCAPTCHA Enterprise in **Console > Security > CAPTCHA** to control how strict verification is. The threshold was previously fixed at 0.5. It applies to invisible mode. Checkbox mode is unaffected.



### Authentication policies for SAML applications



- **Session reuse**: SAML applications still force fresh authentication by default. To let an application reuse an existing Logto session, turn off **Always force authentication** in the application settings, or set `authnRequestConfig.forceAuthn` to `false` through the SAML application Management API. The service provider can still require fresh authentication for a single sign-in with `ForceAuthn="true"`.

- **Actual authentication time**: SAML assertions now report when the user actually authenticated.

- **Signed authentication requests**: Set `authnRequestConfig.requireSignedAuthnRequests` to `true` and provide the service provider's PEM-encoded RSA X.509 certificate in `authnRequestConfig.signingCertificate`. Both HTTP-POST and HTTP-Redirect signatures are verified, and the IdP metadata advertises the requirement. Unsigned requests remain accepted by default.



### `theme` authentication parameter



Pass `theme=light` or `theme=dark` as an extra authentication parameter to render the sign-in experience in that theme instead of following the end user's OS setting. Applications with their own light/dark toggle can now keep Logto in sync.



The override lasts for the whole authentication flow, including page reloads, social and SSO callbacks, and the consent page. It is ignored when dark mode is disabled in the sign-in experience settings, and unsupported values are ignored.



### Refresh tokens for dynamic app clients



This setting applies only to dynamic apps: clients that use an OAuth Client ID Metadata Document (CIMD) URL as their `client_id`. Applications registered in Logto are not affected.



MCP clients such as ChatGPT and Codex follow the MCP authorization spec, which only asks them to request the `offline_access` scope. They don't send `prompt=consent`, and without it Logto drops `offline_access` as OpenID Connect Core requires. These clients get no refresh token, so users have to sign in again whenever the access token expires.



Turn on **Add consent prompt for offline access** under **Client compatibility** in the dynamic app settings. Logto then adds `consent` to the `prompt` of dynamic app authorization requests that ask for `offline_access` without it. Requests with `prompt=none` are left unchanged. The setting is experimental and off by default, and audit logs show the added `consent` in `prompt`.



### Management API SDK (`@logto/api`)



- **Pagination iterator**: `paginate()` returns a typed async iterator over paginated `GET` endpoints, following the Management API pagination headers.



  ```ts

  for await (const user of apiClient.paginate('/api/users')) {

    console.log(user);

  }

  ```



- **Reliability**:

  - Token requests reject redirects, support custom abort signals and a configurable 10-second timeout, and concurrent requests share one token fetch.

  - A rejected cached token is invalidated once, without fetching tokens over and over for permanent `401` responses.

  - Management API network requests get a configurable 10-second timeout while keeping per-request cancellation.

  - Scope mismatch warnings are emitted once per distinct scope, and token request failures keep their cause.

- **Ergonomics**:

  - Object-style Management API client configuration with a tenant ID, or an explicit base URL and API indicator.

  - Lowercase client methods such as `.get()` and `.post()`, with the uppercase methods still available.

  - Trailing slashes in custom base URLs are normalized.



## Bug fixes & stability



### Sign-in experience



- **Browser auto-translation no longer blanks the page**: When a browser auto-translated the sign-in page, React's DOM updates could fail and leave the user on a blank page mid sign-in. The experience is already localized per tenant, so the page now opts out of browser auto-translation with `translate="no"` and `<meta name="google" content="notranslate">`.

- **Social account linking**: When a required secondary identifier (such as a phone number) is already used by another account during social sign-up, the "link and continue" option now only appears if that identifier can sign in with a verification code. Previously, linking failed with `user.sign_in_method_not_enabled` and left the user stuck.



### Enterprise SSO and OIDC



- **Trailing slash in OIDC SSO issuers**: `https://idp.example.com/` and `https://idp.example.com` now resolve to the same discovery URL. The stored issuer stays exactly as configured, so existing SSO identities keep resolving. Failed outbound requests from OIDC SSO connectors now report a concise reason.

- **`none` prompt validation**: OIDC configuration no longer allows combining the `none` prompt with other prompt values.

- **API error message language**: API error messages fall back to the base language when the requested regional language is unavailable.



### Console



- **Webhook test results**: Test results are now stored per webhook, so a result from one webhook no longer appears on another webhook's details page.



## Connectors



- **Apple**: The identifier field is now labeled **Services ID** and explains that an App ID (bundle ID) is rejected by Apple with `invalid_client`. Setup instructions cover the Apple Developer portal, so Sign in with Apple no longer appears to require Xcode. Troubleshooting covers `invalid_client` and `invalid_request`, including Apple's identifier configuration cache, which can take up to 24 hours to refresh.

- **DingTalk (web)**: `corpId` from the DingTalk token response is now preserved in the social user information `rawData`.

- **Twilio SMS**: New optional API host configuration, for example to send through a Twilio region other than the default `api.twilio.com`.



## Self-hosting & OSS notes



- **Database migration required**: This release ships two schema alterations. One adds an authentication request configuration column to SAML application configs. The other widens `users.id` and every column that references it to `varchar(128)`. After upgrading, run the database alteration command (`npm run alteration deploy` in the `@logto/cli`/core image, or `logto db alteration deploy`) before starting the new version. See the [upgrade guide](https://docs.logto.io/logto-oss/upgrading-oss-version).

- **Rolling back the user ID alteration**: Reverting the user ID alteration fails if any stored user ID is longer than the previous 12 or 21 character limit.

- **Custom user IDs are OSS only**: Passing `id` to `POST /api/users` works in self-hosted Logto only.

- **Cap requires your own instance**: Cap needs a publicly reachable Cap Standalone instance. The Content Security Policy is relaxed only while Cap is the active CAPTCHA provider.

- **Database seeding checks for leftover roles**: `logto db seed` now checks for the PostgreSQL roles it needs before creating tables. If roles from a previous Logto database remain in the cluster, the command reports the conflict and explains why dropping the database did not remove them, so you can clean them up safely before retrying.



## Contributors



Huge thanks to the community members whose work shipped in this release:



- [@JunWang666](https://github.com/JunWang666) - user lookup by external identity ([#9572](https://github.com/logto-io/logto/pull/9572)) (first contribution)

- [@Igor-Techsee](https://github.com/Igor-Techsee) - authentication policies for SAML applications ([#9563](https://github.com/logto-io/logto/pull/9563)) (first contribution)

- [@konlanx](https://github.com/konlanx) - `theme` authentication parameter ([#9645](https://github.com/logto-io/logto/pull/9645))

- [@Kathircpe](https://github.com/Kathircpe) - reCAPTCHA Enterprise score threshold ([#9323](https://github.com/logto-io/logto/pull/9323))

- [@nicolaj0](https://github.com/nicolaj0) - browser auto-translation opt-out ([#9591](https://github.com/logto-io/logto/pull/9591)) (first contribution)

- [@Tyagiquamar](https://github.com/Tyagiquamar) - OIDC `none` prompt validation ([#9596](https://github.com/logto-io/logto/pull/9596)) and DingTalk `corpId` in `rawData` ([#9622](https://github.com/logto-io/logto/pull/9622)) (first contribution)

- [@ryanchou1994](https://github.com/ryanchou1994) - leftover PostgreSQL role check before database seeding ([#9573](https://github.com/logto-io/logto/pull/9573)) (first contribution)

- [@toyeshhm](https://github.com/toyeshhm) - Kakao and Naver connector README fixes ([#9666](https://github.com/logto-io/logto/pull/9666)) (first contribution)

- [@darcyYe](https://github.com/darcyYe) - per-webhook test results ([#9664](https://github.com/logto-io/logto/pull/9664))



**Full Changelog**: https://github.com/logto-io/logto/compare/v1.43.0...v1.44.0

