## Features

- Add a Kubernetes backend for running jobs (#1260)

## Enhancements

- Prometheus metrics can now also be exported through OpenTelemetry (#1248)
- Include task, job and run identifiers in logs when a task starts (#1257)
- Recommend Docker-in-Docker for container jobs in the documentation (#1258)

## Bug fixes

- Align Docker actions, job environment handling and host mode more closely with GitHub Actions (#1268)
- Prevent action clones from hanging on stalled HTTP/2 connections (#1266)
- Fail registration attempts faster and honor `GITEA_MAX_REG_ATTEMPTS` (#1197)
- Fix Docker-in-Docker image readiness checks, exit code propagation and shutdown ordering (#1265)
- Clear consumed ephemeral registration state to prevent it from being reused (#1256)

## Contributors
* @silverwind
* @bircni
* @wmTJc9IK0Q

**Full Changelog**: [v4.0.1...v4.1.0](https://gitea.com/gitea/runner/compare/v4.0.1...v4.1.0)
