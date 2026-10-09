## ⚠️ 不兼容变更

### 需要 Git 2.34.1 或更高版本 (https://gitea.com/gitea/runner/pulls/1277)

Runner 现在使用 Git 下载 Action 和可复用工作流，因此其 `PATH` 中必须能找到 `git`。`builtin:checkout` 现在在作业内运行 Git。作业镜像也需要安装 Git，而且作业必须能够访问 Gitea 并信任其证书。官方 Runner 镜像已包含 Git。

### `builtin:checkout` 的行为与 `actions/checkout` 一致 (https://gitea.com/gitea/runner/pulls/1277)

现在支持 SSH 密钥、LFS、子模块、稀疏检出和部分克隆。它还接受 `fetch-tags`、`clean`、`show-progress` 和 `set-safe-directory` 输入，并设置 `ref` 和 `commit` 输出。分支会检出为跟踪 `origin` 的本地分支，后续步骤可使用持久保存的令牌或 SSH 密钥执行 fetch 和 push。

有两项变化可能导致现有工作流失效。除非设置 `clean: false`，否则它会删除检出目录中未跟踪的文件以及被忽略的文件。此外，如果触发工作流的标签在工作流启动后被移动，检出也会失败。

### 配置值会展开 `${NAME}` (https://gitea.com/gitea/runner/pulls/1274)

包含 `${NAME}` 的配置值现在会读取 Runner 环境中的对应变量；如果该变量未设置，配置将无法加载。要保留字面量 `${NAME}`，请写成 `$${NAME}`，例如 Kubernetes `pod_template` 中的 shell 命令就可能需要这样处理。

### 作业必须指定 `runs-on` (https://gitea.com/gitea/runner/pulls/1271)

如果工作流中的作业没有 `runs-on`，或其值为空，现在会报错，而不再使用 `runner.default_image` 运行该作业。这与 GitHub 的行为一致。调用可复用工作流的作业不受此限制。

### 指标遵循 OpenTelemetry 语义约定 (https://gitea.com/gitea/runner/pulls/1282)

OTLP 指标的名称、单位、类型和属性均有变化，参见[指标文档](https://gitea.com/gitea/runner/src/branch/main/docs/telemetry.md#metrics)。在 `/metrics` 端点中，`gitea_runner_client_errors_total` 新增了 `code` 标签，`gitea_runner_job_total` 会将因 `runner.timeout` 而停止的作业计为 `timeout`。

### 非特权 Runner 会忽略工作流中的日志和 OOM 选项 (https://gitea.com/gitea/runner/pulls/1283)

除非设置了 `container.privileged`，否则 Runner 会从工作流的容器 `options` 中移除 `--log-driver`、`--log-opt`、`--oom-score-adj` 和 `--oom-kill-disable`，并记录一条警告。

## 新功能

- 支持通过 `runner.client_cert_file` 和 `runner.client_key_file` 与 Gitea 进行双向 TLS 认证 (https://gitea.com/gitea/runner/pulls/1273)
- Action、可复用工作流和 `builtin:checkout` 支持 SHA-256 仓库 (https://gitea.com/gitea/runner/pulls/1277)
- 支持在配置值中使用 `${NAME}` 环境变量 (https://gitea.com/gitea/runner/pulls/1274)
- 支持在 `valid_volumes` 中使用 `:ro` 条目，仅允许只读挂载 (https://gitea.com/gitea/runner/pulls/1272)
- 新增 `runner.extra_headers`，用于设置 Gitea 前置反向代理所要求的请求头 (https://gitea.com/gitea/runner/pulls/1269)
- 新增 `container.sweep: false`，用于保留作业部署到 Runner 的 Docker 守护进程中的服务 (https://gitea.com/gitea/runner/pulls/1275)
- 新增 `gitea_runner_state` 指标，用于报告 Runner 处于忙碌、空闲还是不可用状态 (https://gitea.com/gitea/runner/pulls/1282)

## 错误修复

- 修复使用较新 Gitea 版本时，一次性 Runner 每次重启都会失败的问题 (https://gitea.com/gitea/runner/pulls/1287)
- 修复使用基于 Ubuntu 的镜像时，Action 无法连接到 Kubernetes 作业 Pod 的问题 (https://gitea.com/gitea/runner/pulls/1286)
- 匹配矩阵中的 `include` 和 `exclude` 条目时不区分大小写，与 GitHub 保持一致 (https://gitea.com/gitea/runner/pulls/1278)
- 将 `runner.insecure` 应用于可复用工作流的下载和作业总结的上传 (https://gitea.com/gitea/runner/pulls/1273)
- 将 Docker 守护进程的 `mtu` 应用于作业网络 (https://gitea.com/gitea/runner/pulls/1270)

**完整变更日志**: https://gitea.com/gitea/runner/compare/v4.1.0...v5.0.0
