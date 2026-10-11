---
title: Gitea Runner 4.0.0 官方发布博客（中文）
description: Gitea Runner 4.0.0 官方发布博客的完整简体中文翻译。
---

# Gitea Runner 4.0.0 正式发布

作者：bircni · 博客发布日期：2026-09-24

> 本文为 [Gitea 官方发布博客](https://blog.gitea.com/release-of-runner-4.0.0/) 的非官方简体中文翻译，由 ChatGPT 翻译，保留原文结构、代码与链接。原文及源代码来自 [Gitea Blog](https://gitea.com/gitea/blog/src/branch/main/content/post/runner/release-of-runner-4.0.0.md)，按 [Apache-2.0](../../licenses/gitea-blog-apache-2.0.md) 许可使用。本译文的修改为中文翻译；原作者署名如上。文中的历史版本更新日志属于博客原文，博客日期与 Gitea Release 日期分别保留。

![Gitea Runner 4.0.0 发布博客封面](https://blog.gitea.com/img/runner-4.0.0-cover.svg)

我们很高兴地宣布 **Gitea Runner 4.0.0** 正式发布。

这是 Runner 端的更新，在通信协议层面仍与现有 Gitea 版本兼容；此次主版本号升级源于两项破坏性变更，并未引入新的服务端依赖。

<!--more-->

## 4.0.0 亮点

### 内置 Action —— `builtin:checkout`

Runner 现在自带用 Go 编写的原生 Action，通过 `uses: builtin:<name>` 选择。作业无需下载 Action，镜像中也无需安装 Node ([#871](https://gitea.com/gitea/runner/pulls/871)):

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: builtin:checkout
      - run: make test
```

首个内置 Action 是 `builtin:checkout`，它实现了 `actions/checkout` 的部分功能，支持 `repository`、`ref`、`token`、`path` 和 `fetch-depth`。传入其他输入参数会使步骤失败。Runner 在宿主机上进行浅克隆，然后将目录树复制到作业中；对于工作流自身的引用，`gitea-runner exec` 会复制本地工作目录。

`actions/checkout` 等远程 Action 保持不变。

### 共享的 S3 兼容缓存

Runner 可以将 Action 缓存存储在兼容 S3 的存储桶中，例如 AWS S3、MinIO、RustFS 等，无需单独部署 `cache-server` ([#1244](https://gitea.com/gitea/runner/pulls/1244)):

```yaml
cache:
  s3:
    endpoint: "http://minio:9000"
    bucket: "runner-cache"
    prefix: "gitea-runner-cache"
    path_style: true
    access_key_file: "/run/secrets/cache-s3-access-key"
    secret_key_file: "/run/secrets/cache-s3-secret-key"
```

配置相同的 Runner 共享同一缓存池。某个 Runner 保存的缓存在大约 30 秒内即可被其他 Runner 访问。`cache.s3` 不能与 `cache.external_server` 同时使用；应为存储桶设置生命周期规则，以清理过期缓存并终止未完成的分段上传。

### OpenTelemetry 追踪

运维人员可以将每个作业的 Trace 发送到 OTLP 收集器。每个作业对应一个 Trace，每个步骤对应一个 Span，通过标准 `OTEL_*` 环境变量配置，在设置端点之前默认关闭 ([#1206](https://gitea.com/gitea/runner/pulls/1206)):

```sh
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

作业只会收到 `TRACEPARENT`，因此作业内接入追踪的工具可以加入该 Trace，而不会看到收集器的凭据。指标仍通过 Prometheus 端点提供。配置与安全说明见 [docs/telemetry.md](https://gitea.com/gitea/runner/src/branch/main/docs/telemetry.md)。

### `self:` Action 引用

`uses: self:{owner}/{repo}[/{path}]@{ref}` 会在 Runner 所属的 Gitea 实例上解析，因此 Action 可以引用同一实例上的其他仓库，无需写死主机名 ([#1233](https://gitea.com/gitea/runner/pulls/1233)):

```yaml
- uses: self:org/shared-actions/setup@v1
```

此版本随附 actionslib v1.2.x：当 Gitea 发送相关值时，`strategy.job-index` 和 `strategy.job-total` 由 Gitea 提供；container、services 和 `with` 仅求值一次，而不再每次使用时都求值。

### 作业条件与容器选项

当作业的 `if:` 求值失败时，例如对无效的作业输出调用 `fromJSON`，现在会跳过该作业并在日志中记录错误，而不再使整个运行失败，这与 GitHub Actions 一致 ([#1247](https://gitea.com/gitea/runner/pulls/1247))。对于 Runner 自行读取的工作流（例如通过 `exec`），如果表达式无法解析，则会拒绝该工作流。

`container.options` 还支持 `--umask` ([#1238](https://gitea.com/gitea/runner/pulls/1238))。复合 Action 中的 `actions/cache` 不再保存失败作业的缓存；dind 镜像不再显示 `docker-init` 的 subreaper 警告；容器内运行的 Podman Runner 会获得真正的 Docker 套接字，而非空目录 ([#1242](https://gitea.com/gitea/runner/pulls/1242), [#1241](https://gitea.com/gitea/runner/pulls/1241), [#1231](https://gitea.com/gitea/runner/pulls/1231))。

## 破坏性变更

**1. 缓存请求经由 Runner 转发 ([#1229](https://gitea.com/gitea/runner/pulls/1229)).**
作业不再直接访问 `cache.external_server` 或内置缓存服务器，而是将缓存请求发送给 Runner，由 Runner 转发。只有 Runner 需要能够访问 `cache.external_server`，该缓存服务器也不再需要访问 Gitea。如果作业可以访问外部缓存，却无法访问其 Runner（使用远程 `DOCKER_HOST` 时较为常见），请将 `cache.host` 和 `cache.port` 设置为这些作业可以访问的地址。如果 Runner 容器运行在作业使用的 Docker 守护进程上，它会自动加入每个作业网络，因此作业无需设置 `cache.host` 即可访问其缓存。使用 `container.network: bridge` 的作业无法访问 `bridge` 之外的 Runner；应将 `container.network` 留空，或指定用户自定义网络。内置缓存一直要求作业能够访问 Runner，现在两种模式的要求一致。

**2. `valid_volumes` 改用 doublestar 匹配 ([#1214](https://gitea.com/gitea/runner/pulls/1214)).**
`valid_volumes` 模式现在使用 doublestar，替代 gobwas/glob；后者编译时未配置分隔符，导致 `*` 可以跨越斜杠。现在 `*` 仅匹配单个路径段，宿主机路径使用操作系统的分隔符，同时修复了 Windows 模式中反斜杠被当作转义符的问题。原先依赖 `*` 匹配嵌套路径的宿主机路径模式需要改用 `**`，例如用 `/data/**` 替代 `/data/*`。命名卷与单独使用的 `**` 不受影响。

## 升级说明

- 将 Docker Compose、Kubernetes 清单和服务单元中的 `gitea/runner:3.x` 替换为 `gitea/runner:4.0.0`。
- 如果作业使用远程 Docker 守护进程或 `container.network: bridge`，请在部署前检查缓存的网络可达性（破坏性变更 1）。
- 检查 `valid_volumes` 中用 `*` 匹配嵌套宿主机路径的条目，必要时改为 `**`（破坏性变更 2）。
- 可选：配置 `cache.s3`，无需 `cache-server` 即可在 Runner 之间共享缓存；在没有 Node 的镜像上试用 `builtin:checkout`；或设置 `OTEL_EXPORTER_OTLP_ENDPOINT`，将作业 Trace 发送到收集器。
- 全面部署之前，请在预发布环境测试产物上传和下载、缓存恢复，以及使用日常网络模式的作业。

## 下载

预编译二进制文件可从 [Gitea Runner 下载页面](https://dl.gitea.com/gitea-runner/4.0.0/) 获取。

也可以从 [Gitea Runner 发布页面](https://gitea.com/gitea/runner/releases/tag/v4.0.0) 获取本次发布。

## 致谢

感谢自 3.0.0 发布以来为代码、测试、问题报告、文档和反馈作出贡献的每一位参与者。

---

## 更新日志

### [4.0.0](https://gitea.com/gitea/runner/releases/tag/v4.0.0) - 2026-09-24

* 破坏性变更
  * 由 Runner 提供 Action 缓存；作业不再直接访问缓存服务器 ([#1229](https://gitea.com/gitea/runner/pulls/1229))
  * 使用 doublestar 匹配 `valid_volumes`，使 `*` 仅匹配单个路径段 ([#1214](https://gitea.com/gitea/runner/pulls/1214))

* 新功能
  * 增加内置 Action 框架及 `builtin:checkout` ([#871](https://gitea.com/gitea/runner/pulls/871))
  * 通过 `cache.s3` 支持以兼容 S3 的存储作为共享缓存后端 ([#1244](https://gitea.com/gitea/runner/pulls/1244))
  * 通过标准 `OTEL_*` 变量增加 OpenTelemetry 追踪 ([#1206](https://gitea.com/gitea/runner/pulls/1206))
  * 在 Runner 所属的 Gitea 实例上解析 `self:{owner}/{repo}` Action 引用 ([#1233](https://gitea.com/gitea/runner/pulls/1233))
  * 在 `container.options` 中支持 `--umask` ([#1238](https://gitea.com/gitea/runner/pulls/1238))

* 问题修复
  * 跳过 `if:` 求值失败的作业，与 GitHub Actions 保持一致 ([#1247](https://gitea.com/gitea/runner/pulls/1247))
  * 防止复合 Action 中的 `actions/cache` 保存失败作业的缓存 ([#1242](https://gitea.com/gitea/runner/pulls/1242))
  * 为容器内运行的 Podman Runner 提供 Docker 套接字，而非空目录 ([#1231](https://gitea.com/gitea/runner/pulls/1231))
  * 不再显示 dind 镜像中的 `docker-init` subreaper 警告 ([#1241](https://gitea.com/gitea/runner/pulls/1241))
  * 修复 `valid_volumes` 模式中的 Windows 路径 ([#1214](https://gitea.com/gitea/runner/pulls/1214))

### [3.5.0](https://gitea.com/gitea/runner/releases/tag/v3.5.0) - 2026-09-14

* 新功能
  * 允许通过作业 Docker 套接字启动的容器绑定挂载 `$PWD` 等作业路径，无需 `bind_workdir` ([#1226](https://gitea.com/gitea/runner/pulls/1226))
  * 在 `exec` 中为 `strategy`、`env`、`with`、`services` 和 `outputs` 支持整个值为 `${{ }}` 的表达式 ([#1221](https://gitea.com/gitea/runner/pulls/1221))

* 问题修复
  * 将工作区挂载在仓库目录的上一级，修复 pnpm 的 `EXDEV` / `EBUSY` 错误 ([#1224](https://gitea.com/gitea/runner/pulls/1224))
  * 作业无法访问缓存服务器时，直接向 Gitea 上传产物 ([#1225](https://gitea.com/gitea/runner/pulls/1225))
  * 加快作业的初始化、清理及缓存请求 ([#1218](https://gitea.com/gitea/runner/pulls/1218), [#1222](https://gitea.com/gitea/runner/pulls/1222))

### [3.4.2](https://gitea.com/gitea/runner/releases/tag/v3.4.2) - 2026-09-09

* 问题修复
  * 修复 IPv6 URL、缓存服务器 SIGTERM 处理和任务准入的原子性 ([#1217](https://gitea.com/gitea/runner/pulls/1217))
  * 消除产物上传对缓存服务器能够访问 Gitea 的依赖 ([#1216](https://gitea.com/gitea/runner/pulls/1216))

### [3.4.1](https://gitea.com/gitea/runner/releases/tag/v3.4.1) - 2026-09-08

* 问题修复
  * 防止作业的 Docker 套接字变成目录 ([#1215](https://gitea.com/gitea/runner/pulls/1215))

### [3.4.0](https://gitea.com/gitea/runner/releases/tag/v3.4.0) - 2026-09-07

* 新功能
  * 增加 `GITEA_DOCKER_WORKSPACE`，供 Compose 绑定挂载使用 ([#1204](https://gitea.com/gitea/runner/pulls/1204))

* 问题修复
  * 作业结束时清理其创建的容器、网络和卷 ([#1204](https://gitea.com/gitea/runner/pulls/1204))
  * 当表达式无法插值时，使对应步骤或作业失败 ([#1199](https://gitea.com/gitea/runner/pulls/1199))
  * 加快 Action 下载速度 ([#1209](https://gitea.com/gitea/runner/pulls/1209))
  * 更新 `golang.org/x/crypto`（CVE-2026-78662、CVE-2026-56855） ([#1205](https://gitea.com/gitea/runner/pulls/1205))

### [3.3.2](https://gitea.com/gitea/runner/releases/tag/v3.3.2) - 2026-08-31

* 新功能
  * 增加 `exec --input` / `--input-file`，用于传入 workflow_dispatch 和 workflow_call 的输入 ([#1173](https://gitea.com/gitea/runner/pulls/1173))

* 问题修复
  * 拒绝工作流传入的 `NODE_OPTIONS`，与 GitHub 保持一致 ([#1194](https://gitea.com/gitea/runner/pulls/1194))
  * 注册密钥的所有编码形式 ([#1194](https://gitea.com/gitea/runner/pulls/1194))
  * 保留通过符号链接指定的 Node Action 入口 ([#1202](https://gitea.com/gitea/runner/pulls/1202))

### [3.3.1](https://gitea.com/gitea/runner/releases/tag/v3.3.1) - 2026-08-26

* 问题修复
  * 非特权模式下保留 Runner 自身的 `container.options` ([#1151](https://gitea.com/gitea/runner/pulls/1151))
  * 在密钥离开作业的所有输出路径上进行脱敏 ([#1188](https://gitea.com/gitea/runner/pulls/1188))
  * 防止步骤自身的 `with:` 值进入其 `inputs` 上下文 ([#1192](https://gitea.com/gitea/runner/pulls/1192))
  * 正确应用服务容器声明的卷 ([#1186](https://gitea.com/gitea/runner/pulls/1186))
  * 刷新日志时一并报告步骤日志范围 ([#1189](https://gitea.com/gitea/runner/pulls/1189))
  * 矩阵展开失败时，使整个运行失败 ([#1187](https://gitea.com/gitea/runner/pulls/1187))

### [3.3.0](https://gitea.com/gitea/runner/releases/tag/v3.3.0) - 2026-08-21

* 新功能
  * 增加 `log.job.dir`，用于将任务日志副本保存到磁盘 ([#1165](https://gitea.com/gitea/runner/pulls/1165))
  * 为不匹配任何标签的作业增加 `runner.default_image` ([#1164](https://gitea.com/gitea/runner/pulls/1164))

* 问题修复
  * 防止失败步骤禁用 toolkit 补丁 ([#1177](https://gitea.com/gitea/runner/pulls/1177))

### [3.2.0](https://gitea.com/gitea/runner/releases/tag/v3.2.0) - 2026-08-19

* 新功能
  * 增加按大小淘汰缓存和按最后访问时间保留缓存的机制 ([#1170](https://gitea.com/gitea/runner/pulls/1170))
  * 在 `uses:` 中支持 GitHub 的 `$/` 当前仓库前缀 ([#1150](https://gitea.com/gitea/runner/pulls/1150))
  * 将 `runner.tool_cache_mode` 默认值设为 `none`（共享工具缓存需显式启用） ([#1171](https://gitea.com/gitea/runner/pulls/1171))

* 问题修复
  * 为每次访问 Gitea 的 RPC 设置边界限制，避免静默失败 ([#1174](https://gitea.com/gitea/runner/pulls/1174))
  * 使用 Runner 注册时的地址构造缓存作业 URL ([#1153](https://gitea.com/gitea/runner/pulls/1153))

### [3.1.0](https://gitea.com/gitea/runner/releases/tag/v3.1.0) - 2026-08-06

* 新功能
  * 等待服务健康后继续执行，并填充 `job` 上下文 ([#1107](https://gitea.com/gitea/runner/pulls/1107))
  * 增加用于编辑配置文件的 `config` 命令 ([#1140](https://gitea.com/gitea/runner/pulls/1140))
  * 仅在显式启用后允许使用 `::set-env::` / `::add-path::` ([#1109](https://gitea.com/gitea/runner/pulls/1109))

* 问题修复
  * 分别求值每个 `${{ }}` 部分 ([#1146](https://gitea.com/gitea/runner/pulls/1146))
  * 去除注册输入两端的空白字符 ([#1147](https://gitea.com/gitea/runner/pulls/1147))

### [3.0.2](https://gitea.com/gitea/runner/releases/tag/v3.0.2) - 2026-08-03

* 问题修复
  * 由缓存服务器提供完整的 results 服务 ([#1141](https://gitea.com/gitea/runner/pulls/1141))

### [3.0.1](https://gitea.com/gitea/runner/releases/tag/v3.0.1) - 2026-08-02

* 问题修复
  * 将所有类型的表达式值转换为字符串，并消除 `format()` 引发的 panic ([#1135](https://gitea.com/gitea/runner/pulls/1135))
