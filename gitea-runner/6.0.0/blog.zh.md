---
title: Gitea Runner 6.0.0 官方发布博客（中文）
description: Gitea Runner 6.0.0 官方发布博客的完整简体中文翻译。
---

# Gitea Runner 6.0.0 正式发布

作者：bircni、silverwind · 博客发布日期：2026-11-11（UTC）

> 本文为 [Gitea 官方发布博客](https://blog.gitea.com/release-of-runner-6.0.0/) 的非官方简体中文翻译，由 ChatGPT 翻译。原文来自 [Gitea Blog](https://gitea.com/gitea/blog/src/branch/main/content/post/runner/release-of-runner-6.0.0.md)，按 [Apache-2.0](../../licenses/gitea-blog-apache-2.0.md) 许可使用。本译文的修改为中文翻译，原作者署名如上。

![Gitea Runner 6.0.0 发布博客封面](https://blog.gitea.com/img/runner-6.0.0-cover.svg)

我们很高兴地宣布 **Gitea Runner 6.0.0** 正式发布。

本版有两项破坏性变更：移除 `builtin:checkout`，以及将 Runner 所需的 Gitea 最低版本提高到 1.26.2。本版还让共享工具缓存在任意并发容量下可用，并修复了我们在 macOS 上亲自遇到的缓存地址问题。本文也回顾 5.0.0 之后各个 5.x 版本的更新，包括对 Windows 的支持。

<!--more-->

## 6.0.0 亮点

### 共享工具缓存支持任意并发容量

`runner.tool_cache_mode: shared` 会保留 `setup-go`、`setup-node` 等 Action 安装的工具，后续作业无需重新下载。此前只有在 `runner.capacity: 1` 时这样做才安全，因为并发作业会向同一个缓存安装工具，可能损坏缓存。

现在每个并发槽位都有自己的工具缓存（[#1401](https://gitea.com/gitea/runner/pulls/1401)）：

```yaml
runner:
  capacity: 4
  tool_cache_mode: shared
```

第一个槽位沿用现有的 `act-toolcache` 卷或主机目录，因此并发容量为 1 的 Runner 不受影响。其余槽位各自下载工具，所以磁盘用量会随并发容量增长。

### 选用 IPv6 地址不再导致缓存和制品步骤失败

Runner 会告诉每个作业如何访问其缓存和制品服务器。此前 Runner 只在启动时检测一次地址，并优先按以太网接口名称选择接口，而非优先选用 IPv4。如果 Runner 在 DHCPv4 完成之前启动，就可能选到一个全局 IPv6 地址，并把它交给仅支持 IPv4 的作业网络。此后所有缓存和制品步骤都会失败，直到重启 Runner。

我们在设置 macOS Runner 时亲自遇到了这个问题。Runner 在用户登录时启动，可能早于网络就绪。现在 Runner 优先选用 IPv4，并为每个作业重新检测地址，除非已通过 `cache.host` 指定地址。检测到 IPv6 地址时，Runner 会记录警告（[#1398](https://gitea.com/gitea/runner/pulls/1398)）。

### 在 macOS 上运行 Runner

除了现有的 systemd 示例，仓库还新增了一个 [launchd 示例](https://gitea.com/gitea/runner/src/branch/main/examples/launchd)，包含 plist 文件和配置步骤（[#1408](https://gitea.com/gitea/runner/pulls/1408)）。Runner 在执行作业的用户登录会话中运行，因此作业可以访问该用户的登录钥匙串和图形界面。

README 介绍了这种配置会遇到的两个问题：授予本地网络访问权限之前，macOS 会阻止 Runner 访问同一子网上的主机。Git 的钥匙串助手也可能弹出对话框，让作业停在那里。

### 其他改动

- **`ubuntu-26.04` 标签：** 新注册的 Runner 在现有默认标签之外，还会获得 `ubuntu-26.04` 标签（[#1396](https://gitea.com/gitea/runner/pulls/1396)）。镜像详情见 [Ubuntu 26.04 Runner 镜像](https://blog.gitea.com/runner-images-ubuntu-26.04/)一文。
- **非 root Runner 可清理绑定挂载的工作目录：** 启用 `container.bind_workdir` 时，以 root 身份运行的作业会留下非 root Runner 无法删除的文件。现在 Runner 会从作业容器内部清空工作目录（[#1399](https://gitea.com/gitea/runner/pulls/1399)）。
- **Docker 守护进程停止响应：** Docker 守护进程停止响应时，作业取消后不再继续挂起（[#1404](https://gitea.com/gitea/runner/pulls/1404)）。
- **`hashFiles()` 和 `::group::`：** `hashFiles()` 与 GitHub 一样接受数字、布尔值和 null 参数。Runner 也能识别混合大小写或带缩进的 `::group::` 命令（[#1394](https://gitea.com/gitea/runner/pulls/1394)）。

## 5.0.0 之后的更新

5.x 系列带来了许多更新，主要改动如下：

- **支持 Windows（5.4.0）。** 每项改动都会在 Windows 上测试。Runner 可作为 [Windows 原生服务](https://gitea.com/gitea/runner/src/branch/main/README.md#windows-service)运行，并发布了 Windows arm64 二进制文件（[#1348](https://gitea.com/gitea/runner/pulls/1348)）。
- **私有 CA 和全局卷（5.4.0）。** `runner.ca_file` 让 Runner 信任 Gitea 实例使用的私有 CA。`container.volumes` 将卷挂载到每个作业容器、服务容器和 Docker Action 容器（[#1366](https://gitea.com/gitea/runner/pulls/1366)）。
- **FreeBSD（5.4.0）。** FreeBSD 支持 Docker 作业、服务和 Action（[#1367](https://gitea.com/gitea/runner/pulls/1367)）。
- **签名校验和（5.4.0）。** 发布校验和的签名保存在 `checksums.txt.sig` 中（[#1382](https://gitea.com/gitea/runner/pulls/1382)）。
- **按引用划分缓存（5.3.0）。** 与 GitHub 一样，缓存条目按 Git 引用划分作用域（[#1361](https://gitea.com/gitea/runner/pulls/1361)）。
- **`GITEA_*` 变量（5.3.0）。** 内置的 `GITHUB_*` 环境变量有对应的 `GITEA_*` 别名（[#1358](https://gitea.com/gitea/runner/pulls/1358)）。
- **作业执行更快（5.1.1、5.2.1）。** 每个 Action 在一次作业中只以归档包形式下载一次（[#1316](https://gitea.com/gitea/runner/pulls/1316)）。作业准备也更快，单步 `exec` 从 1.70 秒降到 0.87 秒（[#1327](https://gitea.com/gitea/runner/pulls/1327)）。
- **`pre` 和 `post` 步骤（5.1.0）。** 在支持此功能的 Gitea 版本上，Action 的 `pre` 和 `post` 步骤会单独显示（[#1293](https://gitea.com/gitea/runner/pulls/1293)）。

## 破坏性变更

**1. 移除 `builtin:checkout`（[#1407](https://gitea.com/gitea/runner/pulls/1407)）。**
使用 `uses: builtin:checkout` 的步骤现在会失败。我们在 4.0.0 中引入了这项功能，并在 5.0.0 中扩展了它，但内置 Action 与 Runner 版本绑定。工作流无法为它固定版本，它也不属于 zizmor 等工具所依赖的可共享 Action 生态。我们决定移除它，避免继续发展第二套生态。

请改用 `actions/checkout`。如果作业镜像没有 Node，可使用 [`taiki-e/checkout-action`](https://github.com/taiki-e/checkout-action)，它仅需 Git 和 shell 即可检出代码：

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - run: make test
```

**2. 要求 Gitea 1.26.2 或更高版本（[#1395](https://gitea.com/gitea/runner/pulls/1395)）。**
Runner 移除了针对旧版 Gitea 结束作业日志处理方式的兼容逻辑。使用旧版 Gitea 时，大多数作业日志会留在数据库的 `dbfs_data` 表中，未被归档。

## 升级说明

- 先将 Gitea 升级到 1.26.2 或更高版本，再升级 Runner。
- 将工作流中的 `uses: builtin:checkout` 替换为 `actions/checkout` 或 `taiki-e/checkout-action`。
- 将 Docker Compose、Kubernetes 清单和服务单元中的 `gitea/runner:5.x` 替换为 `gitea/runner:6.0.0`。
- 从 5.2.x 或更早版本升级时，首次运行不会命中旧缓存，因为缓存条目现在按 Git 引用划分作用域。
- 如果从 5.4.0 或更早版本升级，并依赖 Runner 清理其 Docker 守护进程中的残留容器，请设置 `container.sweep: true`。自 5.4.1 起，必须显式启用此功能。

## 下载

可从 [Gitea Runner 下载页](https://dl.gitea.com/gitea-runner/6.0.0/)获取预构建的二进制文件。

也可访问 [Gitea Runner 发布页](https://gitea.com/gitea/runner/releases/tag/v6.0.0)获取本版本。

## 致谢

感谢自 5.0.0 发布以来贡献代码、参与测试、报告问题、编写文档和提供反馈的所有人。

---

## 变更记录

### [6.0.0](https://gitea.com/gitea/runner/releases/tag/v6.0.0) - 2026-11-11

* 破坏性变更
  * 移除 `builtin:checkout` ([#1407](https://gitea.com/gitea/runner/pulls/1407))
  * 要求 Gitea 1.26.2 或更高版本 ([#1395](https://gitea.com/gitea/runner/pulls/1395))

* 改进
  * 让 `runner.tool_cache_mode: shared` 在任意 `runner.capacity` 下都能安全运行 ([#1401](https://gitea.com/gitea/runner/pulls/1401))
  * 将 `ubuntu-26.04` 加入新注册 Runner 的默认标签 ([#1396](https://gitea.com/gitea/runner/pulls/1396))

* 缺陷修复
  * 为每个作业检测缓存地址并优先选用 IPv4 ([#1398](https://gitea.com/gitea/runner/pulls/1398))
  * 为非 root Runner 清空归 root 所有的 `container.bind_workdir` 工作目录 ([#1399](https://gitea.com/gitea/runner/pulls/1399))
  * 修复 `hashFiles()` 处理数字、布尔值或 null 参数的问题，以及 `::group::` 命令使用混合大小写或带缩进时的问题 ([#1394](https://gitea.com/gitea/runner/pulls/1394))
  * 防止 Docker 守护进程停止响应时作业在取消后继续挂起 ([#1404](https://gitea.com/gitea/runner/pulls/1404))

* 文档
  * 新增 macOS 的 launchd 示例 ([#1408](https://gitea.com/gitea/runner/pulls/1408))

### [5.4.1](https://gitea.com/gitea/runner/releases/tag/v5.4.1) - 2026-11-05

* 缺陷修复
  * 将 `container.sweep` 改为显式启用 ([#1389](https://gitea.com/gitea/runner/pulls/1389))
  * 防止工作流命令日志中出现遮蔽遗漏 ([#1384](https://gitea.com/gitea/runner/pulls/1384))
  * 升级 Runner 镜像中的 Alpine 软件包 ([#1388](https://gitea.com/gitea/runner/pulls/1388))

### [5.4.0](https://gitea.com/gitea/runner/releases/tag/v5.4.0) - 2026-11-05

* 功能
  * 支持将 Runner 作为 Windows 原生服务运行，并发布 Windows arm64 二进制文件 ([#1348](https://gitea.com/gitea/runner/pulls/1348))
  * 新增 `runner.ca_file` 和 `container.volumes` ([#1366](https://gitea.com/gitea/runner/pulls/1366))
  * 在 FreeBSD 上支持 Docker 作业、服务和 Action ([#1367](https://gitea.com/gitea/runner/pulls/1367))
  * 将发布校验和的签名写入 `checksums.txt.sig` ([#1382](https://gitea.com/gitea/runner/pulls/1382))

* 改进
  * 清理 Linux 和 macOS 主机作业残留的后台进程 ([#1376](https://gitea.com/gitea/runner/pulls/1376))
  * 使用 `RUNNER_TRACKING_ID` 在作业结束后保留步骤的后台进程 ([#1348](https://gitea.com/gitea/runner/pulls/1348))
  * 重试失败的镜像拉取和 Dockerfile Action 构建 ([#1376](https://gitea.com/gitea/runner/pulls/1376))
  * Windows 主机步骤以 UTF-8 输出 ([#1348](https://gitea.com/gitea/runner/pulls/1348))

* 缺陷修复
  * 修复大型缓存上传占满缓存卷，导致其他缓存保存失败的问题 ([#1377](https://gitea.com/gitea/runner/pulls/1377))
  * 修复多个并发作业使用同一个 Dockerfile Action 时出现 `No such image` 错误的问题 ([#1372](https://gitea.com/gitea/runner/pulls/1372))
  * 修复 git-lfs 低于 3.8.0 时检出失败并返回 HTTP 400 的问题 ([#1371](https://gitea.com/gitea/runner/pulls/1371))
  * 修复 Windows 主机作业处理路径、环境变量、shell 引号和检出的问题 ([#1348](https://gitea.com/gitea/runner/pulls/1348))

### [5.3.0](https://gitea.com/gitea/runner/releases/tag/v5.3.0) - 2026-11-02

* 改进
  * 通过 `kubernetes.transfer.mode`，让 Kubernetes 作业 Pod 通过 Pod 网络从 Runner 获取要复制的内容 ([#1354](https://gitea.com/gitea/runner/pulls/1354))
  * 与 GitHub 一样，按 Git 引用划分缓存条目的作用域 ([#1361](https://gitea.com/gitea/runner/pulls/1361))
  * 为内置 `GITHUB_*` 环境变量添加 `GITEA_*` 别名 ([#1358](https://gitea.com/gitea/runner/pulls/1358))

* 缺陷修复
  * 修复在本地可复用工作流中运行 `exec --no-skip-checkout` 时发生 panic 的问题 ([#1362](https://gitea.com/gitea/runner/pulls/1362))
  * 将 `github.action_repository` 和 `github.action_ref` 的作用域限定在执行 Action 的步骤 ([#1359](https://gitea.com/gitea/runner/pulls/1359))
  * 修复 Docker 守护进程响应缓慢时，Docker 代理探测遗留容器的问题 ([#1357](https://gitea.com/gitea/runner/pulls/1357))
  * 修复 dind 镜像中出现 `s6-notifyoncheck` 僵尸进程的问题 ([#1364](https://gitea.com/gitea/runner/pulls/1364))

* 安全
  * 将 `golang.org/x/net` 更新到 v0.62.0，以修复 CVE-2026-78661 ([#1356](https://gitea.com/gitea/runner/pulls/1356))

### [5.2.4](https://gitea.com/gitea/runner/releases/tag/v5.2.4) - 2026-10-28

* 改进
  * 通过 exec 将复制内容以 gzip 压缩方式传入 Kubernetes 作业容器 ([#1355](https://gitea.com/gitea/runner/pulls/1355))

* 缺陷修复
  * 在 `exec` 中提供 v4 制品 API，使 `upload-artifact` v4 及更高版本可用 ([#1341](https://gitea.com/gitea/runner/pulls/1341))

### [5.2.3](https://gitea.com/gitea/runner/releases/tag/v5.2.3) - 2026-10-26

* 缺陷修复
  * 在 Action 开始运行前关闭其标题分组 ([#1345](https://gitea.com/gitea/runner/pulls/1345))
  * 试运行期间不访问 Docker 守护进程 ([#1349](https://gitea.com/gitea/runner/pulls/1349))
  * 共享 Action 缓存保留解包后的内容，并重新获取损坏的目录树 ([#1352](https://gitea.com/gitea/runner/pulls/1352))
  * 统一 Runner 的行为 ([#1338](https://gitea.com/gitea/runner/pulls/1338))

### [5.2.2](https://gitea.com/gitea/runner/releases/tag/v5.2.2) - 2026-10-22

* 缺陷修复
  * 重试 Kubernetes 启动阶段的 exec，直到 kubelet 接受 ([#1337](https://gitea.com/gitea/runner/pulls/1337))

### [5.2.1](https://gitea.com/gitea/runner/releases/tag/v5.2.1) - 2026-10-22

* 改进
  * 加快作业设置、Action 准备和缓存服务器的运行 ([#1327](https://gitea.com/gitea/runner/pulls/1327), [#1336](https://gitea.com/gitea/runner/pulls/1336))
  * 迁移到 `connectrpc.com/connect/v2`，兼容使用 connect v1 和 v2 的 Gitea 服务端 ([#1325](https://gitea.com/gitea/runner/pulls/1325))

* 缺陷修复
  * 从作业日志中隐藏 Runner 自行处理的工作流命令，例如 `::set-output::` ([#1333](https://gitea.com/gitea/runner/pulls/1333))
  * 即使 `::stop-commands::` 生效，也在每个步骤中注册 `::add-mask::` 指定的值 ([#1333](https://gitea.com/gitea/runner/pulls/1333))
  * 修补采用代码拆分的 Action 包，例如 `rust-cache` v2.9.2、`setup-java` v6 和 `setup-deno` v2，使其能访问 v2 缓存 API ([#1328](https://gitea.com/gitea/runner/pulls/1328))

### [5.2.0](https://gitea.com/gitea/runner/releases/tag/v5.2.0) - 2026-10-20

* 安全
  * 使用 Go 1.27.3 构建，该版本修复 CVE-2026-111943 ([#1332](https://gitea.com/gitea/runner/pulls/1332))

* 改进
  * 当 Kubernetes 服务的 ID 是 DNS 子域名时，可用该 ID 访问服务 ([#1320](https://gitea.com/gitea/runner/pulls/1320))
  * 移除多个直接依赖，使二进制文件缩小约 5% ([#1319](https://gitea.com/gitea/runner/pulls/1319))

* 缺陷修复
  * 残留后台进程仍占用输出流时，不再将已成功的主机步骤判为失败 ([#1323](https://gitea.com/gitea/runner/pulls/1323))
  * 修复 YAML 块标量和折叠标量在读写往返中的问题 ([#1321](https://gitea.com/gitea/runner/pulls/1321))

### [5.1.1](https://gitea.com/gitea/runner/releases/tag/v5.1.1) - 2026-10-16

* 改进
  * 新增 `runner.log_report_level` ([#1310](https://gitea.com/gitea/runner/pulls/1310))
  * 每个作业只以归档包形式下载一次每个 Action，支持重试，失败后回退到 Git ([#1316](https://gitea.com/gitea/runner/pulls/1316))

* 缺陷修复
  * 修复 Action 的分支或标签变动后出现 `cannot lock ref` 错误和使用旧提交的问题 ([#1312](https://gitea.com/gitea/runner/pulls/1312))
  * 即使容器删除缓慢也移除作业网络，并在 10 分钟后回收孤立的作业网络和卷 ([#1318](https://gitea.com/gitea/runner/pulls/1318))

### [5.1.0](https://gitea.com/gitea/runner/releases/tag/v5.1.0) - 2026-10-14

* 改进
  * 将 Action 的 `pre` 和 `post` 步骤单独显示 ([#1293](https://gitea.com/gitea/runner/pulls/1293))
  * Gitea 不可访问时重试启动，避免直接退出 ([#1294](https://gitea.com/gitea/runner/pulls/1294))
  * 在 `exec --use-gitignore` 中遵循 Git 自身的忽略规则 ([#1309](https://gitea.com/gitea/runner/pulls/1309))

* 缺陷修复
  * 超时或取消后，为 post 步骤保留 `GITHUB_ENV`、`GITHUB_OUTPUT`、`GITHUB_STATE` 和 `GITHUB_PATH` ([#1294](https://gitea.com/gitea/runner/pulls/1294))
  * 忽略作业容器 `options` 中的 `--entrypoint` 并发出警告 ([#1294](https://gitea.com/gitea/runner/pulls/1294))
  * 跨架构作业使用作业容器自身的 `PATH` ([#1294](https://gitea.com/gitea/runner/pulls/1294))
  * 为 `linux/arm/v7` 等平台变体复用本地镜像 ([#1294](https://gitea.com/gitea/runner/pulls/1294))
  * 修复无 root 权限的 Podman 使用将 `/var/run` 设为符号链接的镜像时，复制 Action 出错的问题 ([#1294](https://gitea.com/gitea/runner/pulls/1294))
  * 在共享同一缓存目录的 Runner 之间锁定 Action 缓存 ([#1294](https://gitea.com/gitea/runner/pulls/1294))
  * 修复 Runner 嵌套在另一个 Runner 的 Docker 代理后方时的作业清理问题 ([#1314](https://gitea.com/gitea/runner/pulls/1314))

* 安全
  * 将 Go 更新到 1.27.2，将 `golang.org/x/net` 更新到 v0.60.0 ([#1291](https://gitea.com/gitea/runner/pulls/1291), [#1292](https://gitea.com/gitea/runner/pulls/1292))
