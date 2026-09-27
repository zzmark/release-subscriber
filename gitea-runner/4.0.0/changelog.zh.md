## ⚠️ 破坏性变更

### 作业通过 Runner 访问缓存 (https://gitea.com/gitea/runner/pulls/1229)

配置 `cache.external_server` 后，作业会向 Runner 发送缓存请求，由 Runner 转发。对于使用远程 `DOCKER_HOST` 等无法访问 Runner 的作业，需要把 `cache.host` 和 `cache.port` 设为作业可访问的地址。

使用 `container.network: bridge` 的作业无法访问 `bridge` 网络之外的 Runner 容器，因此缓存和构件上传会失败。请将 `container.network` 留空，或使用用户自定义网络。

### `valid_volumes` 中的 `*` 不再跨 `/` 匹配 (https://gitea.com/gitea/runner/pulls/1214)

依赖 `*` 匹配多级路径的主机路径模式需要改用 `**`，例如将 `/data/*` 改成 `/data/**`。

## 新功能

- 新增 `builtin:checkout` Action，作业镜像无需下载 Action，也无需安装 Node (https://gitea.com/gitea/runner/pulls/871)
- 在步骤的 `uses` 中新增 `self:` 前缀，从 Runner 所连接的 Gitea 实例解析引用 (https://gitea.com/gitea/runner/pulls/1233)
- 通过 `cache.s3` 支持 S3 兼容存储作为缓存后端，无需缓存服务器即可在多个 Runner 之间共享 (https://gitea.com/gitea/runner/pulls/1244)
- 通过 `OTEL_EXPORTER_OTLP_ENDPOINT` 启用作业和步骤的 OpenTelemetry 追踪 (https://gitea.com/gitea/runner/pulls/1206)

## 改进

- 与作业使用同一 Docker 守护进程的 Runner 容器会加入每个作业的网络，使作业无需设置 `cache.host` 即可访问其缓存 (https://gitea.com/gitea/runner/pulls/1229)
- 现在只有 Runner 需要访问 `cache.external_server`，该服务器不再需要访问 Gitea (https://gitea.com/gitea/runner/pulls/1229)
- 加快容器内 Runner 的作业启动速度 (https://gitea.com/gitea/runner/pulls/1231)
- `container.options` 支持 `--umask` (https://gitea.com/gitea/runner/pulls/1238)

## 问题修复

- 与 GitHub 一致，`if:` 求值失败时跳过作业，而不再让作业失败 (https://gitea.com/gitea/runner/pulls/1247)
- 阻止复合 Action 中的 `actions/cache` 保存失败作业的缓存 (https://gitea.com/gitea/runner/pulls/1242)
- 对容器内运行的 Podman Runner，为作业提供 Docker 套接字，而不是空目录 (https://gitea.com/gitea/runner/pulls/1231)
- 修复 `valid_volumes` 模式中的 Windows 路径处理 (https://gitea.com/gitea/runner/pulls/1214)
- 消除 dind 镜像中 `docker-init` 的子进程回收警告 (https://gitea.com/gitea/runner/pulls/1241)

**完整变更记录**：https://gitea.com/gitea/runner/compare/v3.5.0...v4.0.0
