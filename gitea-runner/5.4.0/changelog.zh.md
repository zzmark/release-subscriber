Windows 现在是受支持的平台。每项变更都会在 Windows 上测试，本版修复了测试发现的 Windows 问题。Runner 还可作为 Windows 服务运行，并开始发布 Windows arm64 二进制文件。

## 新功能

- 新增 `runner.ca_file`，用于信任 Gitea 实例的私有 CA https://gitea.com/gitea/runner/pulls/1366
- 新增 `container.volumes`，将卷挂载到每个作业容器、服务容器和 Docker action 容器 https://gitea.com/gitea/runner/pulls/1366
- 支持在 FreeBSD 上运行 Docker 作业、服务和 action https://gitea.com/gitea/runner/pulls/1367
- 在 `checksums.txt.sig` 中提供发布校验和的签名 https://gitea.com/gitea/runner/pulls/1382
- 支持将 Runner 作为原生 Windows 服务运行，参见 [README](https://gitea.com/gitea/runner/src/branch/main/README.md#windows-service) https://gitea.com/gitea/runner/pulls/1348
- 发布 Windows arm64 二进制文件 https://gitea.com/gitea/runner/pulls/1348

## 增强

- 与 GitHub 的 Runner 一样，在 Linux 和 macOS 上也会终止主机模式作业遗留的后台进程 https://gitea.com/gitea/runner/pulls/1376
- 通过设置 `RUNNER_TRACKING_ID`，在作业结束后保留步骤的后台进程，参见[主机模式](https://gitea.com/gitea/runner/src/branch/main/docs/host-mode.md) https://gitea.com/gitea/runner/pulls/1348
- 镜像拉取和 Dockerfile action 构建失败后会重试 https://gitea.com/gitea/runner/pulls/1376
- Windows 主机模式步骤使用 UTF-8 输出，修复非 ASCII 文本乱码 https://gitea.com/gitea/runner/pulls/1348

## 错误修复

- 修复大型缓存上传填满缓存卷、导致其他缓存保存失败的问题 https://gitea.com/gitea/runner/pulls/1377
- 修复并发作业使用同一个 Dockerfile action 时出现 `No such image` 的问题 https://gitea.com/gitea/runner/pulls/1372
- 修复使用低于 3.8.0 版本的 git-lfs 检出时返回 HTTP 400 的问题 https://gitea.com/gitea/runner/pulls/1371
- 修复 Windows 主机模式作业中路径、环境变量、shell 引号和检出的处理问题 https://gitea.com/gitea/runner/pulls/1348

**完整 Changelog**：https://gitea.com/gitea/runner/compare/v5.3.0...v5.4.0
