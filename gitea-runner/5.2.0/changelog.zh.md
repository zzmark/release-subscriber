## 安全
- 使用 Go 1.27.3 构建；该版本通过在 crypto/x509 中不再信任一组中间证书，修复 CVE-2026-111943（[#1332](https://gitea.com/gitea/runner/pulls/1332)）

## 增强
- Kubernetes：服务 ID 为 DNS 子域名（如 `devstoreaccount1.azurite.local`）时，支持通过该 ID 访问服务；对仅大小写不同的 ID 发出警告（[#1320](https://gitea.com/gitea/runner/pulls/1320)）

## 错误修复
- 遗留的后台进程仍保持步骤输出打开时，不再将已成功的主机步骤判为失败（[#1323](https://gitea.com/gitea/runner/pulls/1323)）
- 修复 YAML 中块标量与折叠标量的序列化往返问题；`config edit` 不再自动折行（[#1321](https://gitea.com/gitea/runner/pulls/1321)）

## 重构
- 移除 logrus、mergo、httprouter、retry-go 及其他直接依赖，使二进制文件体积缩小约 5%（[#1319](https://gitea.com/gitea/runner/pulls/1319)）。行为差异：
  - 构建上下文中的文件无法读取时，跳过该文件并发出警告，而非生成不完整的 tar 归档
  - 构建上下文不再携带 `security.capability` 扩展属性
  - 缓存服务器和制品服务器在 GET 路由上响应 HEAD 请求，不再对尾部斜杠执行重定向，也不再响应 OPTIONS 请求

## 构建与维护
- 移除未使用的 xgo `release*` Makefile 目标（[#1329](https://gitea.com/gitea/runner/pulls/1329)）
- 更新 Renovate 未自动更新的镜像和工具固定版本；构建器现在跟随当前的 Alpine 版本（[#1330](https://gitea.com/gitea/runner/pulls/1330)）
- 更新一处过时的 go-yaml 折行处理注释（[#1324](https://gitea.com/gitea/runner/pulls/1324)）


## 贡献者
* @bircni
* @silverwind
* @Zettat123

**完整 Changelog**：[v5.1.1...v5.2.0](https://gitea.com/gitea/runner/compare/v5.1.1...v5.2.0)
