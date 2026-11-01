## @hyperdx/app@2.43.1

### 补丁变更

- @hyperdx/api@2.43.1

## @hyperdx/otel-collector@2.43.1

### 补丁变更

- 7a9fe57d3: 在采集器镜像中设置 `GODEBUG=multipathtcp=0`，
  在启动时禁用 Multipath TCP，以缓解 CVE-2026-98432。Go 1.24+ 默认打开 MPTCP 监听器。
  您传入的其他 `GODEBUG` 设置会保留，而显式设置的
  `multipathtcp=` 值保持不变。这同样适用于一体化镜像。
  真正的修复仍是为宿主机内核应用补丁。

## @hyperdx/api@2.43.1


