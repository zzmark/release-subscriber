## Highlights

- **Self-hosted license-based entitlements (Self-Hosted Pro)**: Unlock premium features on self-hosted Logto deployments with a license key—including team collaboration with Console members & email invitations, removing Logto branding, custom sign-in UI (Bring your UI) and CSP, higher SAML application limits, and tenant-wide Console MFA enforcement.
- **Resource and scope query optimizations**: `GET /api/resources?includeScopes=true` now matches scopes in linear time, fixing slowdowns and database parameter limit errors for tenants with large numbers of resources. The Management API also supports `excludeManagementApis=true` to prevent timeouts in Console permission pickers.

## New features & enhancements

### Self-hosted license entitlements (Self-Hosted Pro)

Self-hosted Logto deployments can now install and activate subscription licenses (such as Self-Hosted Pro) to unlock advanced capabilities while running entirely within their own infrastructure.

- **Installing and managing licenses**: Install or replace a license directly in Console under **Tenant settings > License**, or automate it via the Management API (`PUT /api/systems/license` and `GET /api/systems/license`). The installed key is verified offline using ES256 signatures against Logto's embedded public key.
- **License status and grace period**: View the current plan, environment (production or non-production), expiration date, and automatic weekly refresh status. If a license expires or cannot be refreshed, a 30-day grace period keeps features running while alerting admins with global warnings in Console before falling back to OSS defaults.
- **Retrieve keys from Cloud Console**: Users with an active self-hosted subscription can view their licenses and copy production and non-production keys directly from the account menu in Logto Cloud Console, without needing to provision a Cloud tenant.
- **Unlocked entitlements**:
  - **Console members & invitations**: Invite other administrators to manage the self-hosted deployment. Invitations are delivered by email using the default tenant's email connector with secure one-time account setup links.
  - **Remove Logto branding**: Hide "Powered by Logto" on the sign-in experience.
  - **Custom sign-in UI and CSP**: Upload custom sign-in UI bundles using your own storage, and customize Content Security Policy headers.
  - **Expanded SAML applications**: Increase the SAML application limit beyond open-source defaults.
  - **Mandatory Console MFA**: Enforce multi-factor authentication for all administrators accessing the Console.

See [Self-hosted license](https://docs.logto.io/logto-oss/self-hosted-license) for setup and details.

### API resource query optimizations

- **Linear-time scope matching**: In `GET /api/resources?includeScopes=true`, matching scopes to API resources now runs in linear time using `Map.groupBy` and PostgreSQL array binding (`= ANY(...)`). This eliminates quadratic slowdowns and resolves failures on tenants with more than 65,535 resources ([#9715](https://github.com/logto-io/logto/pull/9715)).
- **Exclude Management API resources**: `GET /api/resources` now accepts an `excludeManagementApis` query parameter to filter out internal Logto Management API resources at the database level. Console permission pickers for third-party apps, dynamic apps, organization roles, and user roles now use this filter instead of loading every resource into the browser, preventing UI timeouts on resource-heavy tenants ([#9716](https://github.com/logto-io/logto/pull/9716)).

## Bug fixes & stability

### Documentation

- **Next.js App Router guide**: Updated the `app/page.tsx` example in the Next.js App Router quick start to declare `Home` as an `async` component, fixing TypeScript error `TS1308` ([#9692](https://github.com/logto-io/logto/pull/9692)). Thanks to [@timokoethe](https://github.com/timokoethe).

## Contributors

Huge thanks to the community members whose work shipped in this release:

- [@timokoethe](https://github.com/timokoethe) - correct async home component in Next.js App Router guide ([#9692](https://github.com/logto-io/logto/pull/9692)) (first contribution)

**Full Changelog**: https://github.com/logto-io/logto/compare/v1.44.0...v1.45.0
