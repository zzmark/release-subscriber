## 新功能

- 新增用于运行作业的 Kubernetes 后端 (#1260)

## 改进

- Prometheus 指标现在也可以通过 OpenTelemetry 导出 (#1248)
- 任务启动时，在日志中包含任务、作业和运行的标识符 (#1257)
- 在文档中推荐容器作业使用 Docker-in-Docker (#1258)

## 错误修复

- 使 Docker Action、作业环境处理和宿主机模式的行为更贴近 GitHub Actions (#1268)
- 防止克隆 Action 时因 HTTP/2 连接停滞而一直挂起 (#1266)
- 使注册尝试更快失败，并遵循 `GITEA_MAX_REG_ATTEMPTS` (#1197)
- 修复 Docker-in-Docker 镜像的就绪检查、退出码传递和关闭顺序 (#1265)
- 清除已使用的一次性注册状态，防止该状态被重复使用 (#1256)

## 贡献者
* @silverwind
* @bircni
* @wmTJc9IK0Q

**完整变更日志**: [v4.0.1...v4.1.0](https://gitea.com/gitea/runner/compare/v4.0.1...v4.1.0)
