## ⚠️ 破坏性变更

### 移除 `builtin:checkout` (https://gitea.com/gitea/runner/pulls/1407)

由于该操作无法固定到特定版本，也不符合 Action 应可共享的设计理念，我们决定将其移除。建议使用 `actions/checkout`，或者使用无需 Node 的 [`taiki-e/checkout-action`](https://github.com/taiki-e/checkout-action)。

### 要求 Gitea 1.26.2 或更高版本 (https://gitea.com/gitea/runner/pulls/1395)

使用更早版本的 Gitea 时，大多数作业日志会留在数据库的 `dbfs_data` 表中，未被归档。

## 改进

- 让 `runner.tool_cache_mode: shared` 在任意 `runner.capacity` 下都能安全运行，为每个并发作业分配独立的工具缓存 https://gitea.com/gitea/runner/pulls/1401
- 将 `ubuntu-26.04` 加入新注册 Runner 的默认标签 https://gitea.com/gitea/runner/pulls/1396

## 缺陷修复

- 修复 Runner 启动时选用 IPv6 地址导致缓存和制品步骤失败的问题 https://gitea.com/gitea/runner/pulls/1398
- 修复以非 root 用户运行的 Runner 残留含有归 root 所有的文件的 `container.bind_workdir` 工作目录的问题 https://gitea.com/gitea/runner/pulls/1399
- 修复 `hashFiles()` 处理数字、布尔值或 null 参数的问题，以及 `::group::` 命令使用混合大小写或带缩进时的问题 https://gitea.com/gitea/runner/pulls/1394
- 修复 Docker 守护进程停止响应时，作业在取消后仍挂起的问题 https://gitea.com/gitea/runner/pulls/1404

## 文档

- 新增在 macOS 上运行 Runner 的 [launchd 示例](https://gitea.com/gitea/runner/src/branch/main/examples/launchd) https://gitea.com/gitea/runner/pulls/1408

**完整变更记录**：https://gitea.com/gitea/runner/compare/v5.4.1...v6.0.0
