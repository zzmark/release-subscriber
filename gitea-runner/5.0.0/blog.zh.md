---
title: Gitea Runner 5.0.0 官方发布博客（中文）
description: Gitea Runner 5.0.0 官方发布博客的完整简体中文翻译。
---

# Gitea Runner 5.0.0 正式发布

作者：bircni、silverwind · 博客发布日期：2026-10-08

> 本文为 [Gitea 官方发布博客](https://blog.gitea.com/release-of-runner-5.0.0/) 的非官方简体中文翻译，由 ChatGPT 翻译，保留原文结构、代码与链接。原文及源代码来自 [Gitea Blog](https://gitea.com/gitea/blog/src/branch/main/content/post/runner/release-of-runner-5.0.0.md)，按 [Apache-2.0](../../licenses/gitea-blog-apache-2.0.md) 许可使用。本译文的修改为中文翻译；原作者署名如上。文中的历史版本更新日志属于博客原文，博客日期与 Gitea Release 日期分别保留。

![Gitea Runner 5.0.0 发布博客封面](https://blog.gitea.com/img/runner-5.0.0-cover.svg)

我们很高兴地宣布 **Gitea Runner 5.0.0** 正式发布。

这是一个改动相对平缓的主版本。少量较小的破坏性变更要求提升主版本号，但大多数部署无需修改即可升级。主要功能是能力显著增强的 `builtin:checkout`。

<!--more-->

## 5.0.0 亮点

### `builtin:checkout` 的行为与 `actions/checkout` 一致

在 4.0.0 中，`builtin:checkout` 仅支持 `actions/checkout` 的一小部分功能。现在它会在作业运行的位置执行 `git`，并支持几乎全部功能 ([#1277](https://gitea.com/gitea/runner/pulls/1277)):

- **SSH：** `ssh-key`、`ssh-known-hosts`、`ssh-strict` 和 `ssh-user`
- **LFS 和子模块：** `lfs: true`、`submodules: true` 或 `recursive`
- **稀疏检出与部分克隆：** `sparse-checkout`、`sparse-checkout-cone-mode` 和 `filter`，例如 `blob:none`
- **其他输入：** `fetch-tags`、`clean`、`show-progress`、`persist-credentials` 和 `set-safe-directory`
- **输出：** 与 `actions/checkout` 一样，提供 `ref` 和 `commit`

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: builtin:checkout
        with:
          lfs: true
          submodules: recursive
          fetch-depth: 0
      - run: make test
```

分支会被检出为跟踪 `origin` 的本地分支，因此后续步骤可以使用保留的令牌或 SSH 密钥进行拉取和推送。作业结束时会移除凭据。

完整输入列表见 [docs/builtin-actions.md](https://gitea.com/gitea/runner/src/branch/main/docs/builtin-actions.md)。

Runner 还改用 Git CLI 下载 Action 和可复用工作流，不再使用 go-git。这增加了对 SHA-256 仓库的支持，并使完整 Action 克隆速度提升数倍。

### 其他新增功能

- **双向 TLS：** `runner.client_cert_file` 和 `runner.client_key_file` 用于设置连接 Gitea 时使用的客户端证书 ([#1273](https://gitea.com/gitea/runner/pulls/1273)).
- **反向代理请求头：** `runner.extra_headers` 用于添加 Gitea 前置代理所要求的请求头 ([#1269](https://gitea.com/gitea/runner/pulls/1269)).
- **配置中的环境变量：** 配置值可以包含 `${NAME}`，以读取 Runner 环境中对应变量的值 ([#1274](https://gitea.com/gitea/runner/pulls/1274)).
- **只读卷：** `valid_volumes` 中以 `:ro` 结尾的条目只允许只读挂载 ([#1272](https://gitea.com/gitea/runner/pulls/1272)).
- **`container.sweep: false`：** 作业结束后，保留作业在 Runner 的 Docker 守护进程上启动的服务 ([#1275](https://gitea.com/gitea/runner/pulls/1275)).
- **`gitea_runner_state` 指标：** 报告 Runner 处于忙碌、空闲还是不可用状态 ([#1282](https://gitea.com/gitea/runner/pulls/1282)).

Gitea Runner 4.1.0 增加了 [Kubernetes 后端](https://gitea.com/gitea/runner/src/branch/main/docs/kubernetes.md)，无需 Docker 守护进程即可将每个作业作为 Pod 运行 ([#1260](https://gitea.com/gitea/runner/pulls/1260))，并支持通过 OTLP 导出 Prometheus 指标 ([#1248](https://gitea.com/gitea/runner/pulls/1248))。

## 破坏性变更

**1. 要求 Git 2.34.1 或更新版本 ([#1277](https://gitea.com/gitea/runner/pulls/1277)).**
Runner 需要通过 `PATH` 找到 `git`，以下载 Action 和可复用工作流。使用 `builtin:checkout` 的作业镜像也需要安装 Git，并且这些作业必须能够访问 Gitea 且信任其证书。`gitea/runner` 镜像已包含 Git。

**2. `builtin:checkout` 会清理检出目录并检查标签 ([#1277](https://gitea.com/gitea/runner/pulls/1277)).**
与 `actions/checkout` 一样，除非设置 `clean: false`，否则会删除检出目录中未跟踪和被忽略的文件。如果触发工作流的标签在工作流启动后被移动，该步骤也会失败。

**3. 配置值会展开 `${NAME}` ([#1274](https://gitea.com/gitea/runner/pulls/1274)).**
如果配置值包含 `${NAME}`，但对应变量未设置，配置将无法加载。如果需要保留字面量 `${NAME}`，例如 Kubernetes `pod_template` 内的 shell 命令，请写为 `$${NAME}`。

**4. 作业必须设置 `runs-on` ([#1271](https://gitea.com/gitea/runner/pulls/1271)).**
如果工作流中的某个作业没有 `runs-on` 或其值为空，现在会失败，而不再使用 `runner.default_image` 运行该作业。这与 GitHub 一致。调用可复用工作流的作业不受此限制。

**5. 指标遵循 OpenTelemetry 语义约定 ([#1282](https://gitea.com/gitea/runner/pulls/1282)).**
OTLP 指标的名称、单位、类型和属性均已调整，详见[指标文档](https://gitea.com/gitea/runner/src/branch/main/docs/telemetry.md#metrics)。Prometheus `/metrics` 端点中的 `gitea_runner_client_errors_total` 新增 `code` 标签，`gitea_runner_job_total` 将因 `runner.timeout` 而停止的作业计为 `timeout`。

**6. 非特权 Runner 忽略工作流中的日志和 OOM 选项 ([#1283](https://gitea.com/gitea/runner/pulls/1283)).**
除非设置 `container.privileged`，否则 Runner 会移除工作流容器 `options` 中的 `--log-driver`、`--log-opt`、`--oom-score-adj` 和 `--oom-kill-disable`，并记录警告。

## 升级说明

- 将 Docker Compose、Kubernetes 清单和服务单元中的 `gitea/runner:4.x` 替换为 `gitea/runner:5.0.0`。
- 如果直接运行二进制文件，请确保宿主机安装了 Git 2.34.1 或更新版本。使用 `builtin:checkout` 的作业镜像也应包含 Git。
- 在配置中查找字面量 `${`，对不应展开的部分使用 `$${` 转义。
- 为原先依赖 `runner.default_image`、未指定运行环境的作业补上 `runs-on`。
- 如果仪表盘或告警依赖 OTLP 指标，请按新名称更新。

## 下载

预编译二进制文件可从 [Gitea Runner 下载页面](https://dl.gitea.com/gitea-runner/5.0.0/) 获取。

也可以从 [Gitea Runner 发布页面](https://gitea.com/gitea/runner/releases/tag/v5.0.0) 获取本次发布。

## 致谢

感谢自 4.0.0 发布以来为代码、测试、问题报告、文档和反馈作出贡献的每一位参与者。

---

## 更新日志

### [5.0.0](https://gitea.com/gitea/runner/releases/tag/v5.0.0) - 2026-10-08

* 破坏性变更
  * 使用 Git CLI 克隆 Action，并使 `builtin:checkout` 与 `actions/checkout` 保持一致，要求 Git 2.34.1 或更新版本 ([#1277](https://gitea.com/gitea/runner/pulls/1277))
  * 展开配置值中的 `${NAME}` ([#1274](https://gitea.com/gitea/runner/pulls/1274))
  * 拒绝包含未设置 `runs-on` 的作业的工作流 ([#1271](https://gitea.com/gitea/runner/pulls/1271))
  * 按 OpenTelemetry 语义约定发送 OTLP 指标 ([#1282](https://gitea.com/gitea/runner/pulls/1282))
  * 非特权模式下移除日志驱动和 OOM 选项 ([#1283](https://gitea.com/gitea/runner/pulls/1283))

* 新功能
  * 在 `builtin:checkout` 中支持 SSH 密钥、LFS、子模块、稀疏检出和部分克隆 ([#1277](https://gitea.com/gitea/runner/pulls/1277))
  * 为 Action、可复用工作流和 `builtin:checkout` 支持 SHA-256 仓库 ([#1277](https://gitea.com/gitea/runner/pulls/1277))
  * 支持双向 TLS 客户端证书 ([#1273](https://gitea.com/gitea/runner/pulls/1273))
  * 增加 `runner.extra_headers` ([#1269](https://gitea.com/gitea/runner/pulls/1269))
  * 支持 `valid_volumes` 中的 `:ro` 条目 ([#1272](https://gitea.com/gitea/runner/pulls/1272))
  * 增加 `container.sweep` 选项 ([#1275](https://gitea.com/gitea/runner/pulls/1275))
  * 增加 `gitea_runner_state` 指标 ([#1282](https://gitea.com/gitea/runner/pulls/1282))

* 问题修复
  * 识别 Gitea 对未注册 Runner 返回的 401 响应，修复临时 Runner 重启问题 ([#1287](https://gitea.com/gitea/runner/pulls/1287))
  * 在 Kubernetes Pod 中，将复制的目录解压到目标位置 ([#1286](https://gitea.com/gitea/runner/pulls/1286))
  * 允许在容器选项中使用 tmpfs 挂载 ([#1289](https://gitea.com/gitea/runner/pulls/1289))
  * 匹配矩阵的 `include` 和 `exclude` 条目时忽略大小写 ([#1278](https://gitea.com/gitea/runner/pulls/1278))
  * 将 `runner.insecure` 应用于可复用工作流下载和作业总结上传 ([#1273](https://gitea.com/gitea/runner/pulls/1273))
  * 将 Docker 守护进程的 `mtu` 应用于作业网络 ([#1270](https://gitea.com/gitea/runner/pulls/1270))

### [4.1.0](https://gitea.com/gitea/runner/releases/tag/v4.1.0) - 2026-10-01

* 新功能
  * 增加用于运行作业的 Kubernetes 后端 ([#1260](https://gitea.com/gitea/runner/pulls/1260))
  * 通过 OpenTelemetry 导出 Prometheus 指标 ([#1248](https://gitea.com/gitea/runner/pulls/1248))
  * 任务启动时记录任务、作业和运行的标识符 ([#1257](https://gitea.com/gitea/runner/pulls/1257))

* 问题修复
  * 使 Docker Action、作业环境变量和宿主机模式与 GitHub 保持一致 ([#1268](https://gitea.com/gitea/runner/pulls/1268))
  * 丢弃克隆 Action 时停滞的 HTTP/2 连接 ([#1266](https://gitea.com/gitea/runner/pulls/1266))
  * 注册失败时尽早退出，并遵循 `GITEA_MAX_REG_ATTEMPTS` ([#1197](https://gitea.com/gitea/runner/pulls/1197))
  * 修复 dind 镜像的就绪状态、退出码和关闭顺序 ([#1265](https://gitea.com/gitea/runner/pulls/1265))
  * 清除已使用的临时注册状态 ([#1256](https://gitea.com/gitea/runner/pulls/1256))

### [4.0.1](https://gitea.com/gitea/runner/releases/tag/v4.0.1) - 2026-09-29

* 问题修复
  * 通过 `PATH` 解析容器中的 `sleep` 命令 ([#1255](https://gitea.com/gitea/runner/pulls/1255))
  * 正确使用配置的 Docker 注册文件 ([#1259](https://gitea.com/gitea/runner/pulls/1259))
  * 将未指定 `image` 的作业容器配置应用于 `runs-on` 镜像 ([#1252](https://gitea.com/gitea/runner/pulls/1252))
  * 在可复用工作流作业中恢复调用方的事件和输入 ([#1250](https://gitea.com/gitea/runner/pulls/1250))
  * 其他问题修复与改进 ([#1253](https://gitea.com/gitea/runner/pulls/1253))
