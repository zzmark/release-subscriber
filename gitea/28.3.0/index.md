---
title: Gitea 28.3.0 更新总结
description: Gitea 28.3.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="Gitea"
  version="28.3.0"
  date="2026-11-01"
  repository-url="https://github.com/go-gitea/gitea"
  docs-url="https://docs.gitea.com/"
  release-url="https://github.com/go-gitea/gitea/releases/tag/v28.3.0"
  release-blog-url="https://blog.gitea.com/release-of-28.3.0/"
  release-blog-zh-url="./blog.zh"
/>

## 概览

Gitea 28.3.0 是 28 系列的第三个维护版本，集中修复令牌作用域、账户关联、Actions 工作流及私有资源访问等安全问题，并提升工单、拉取请求和 Actions 队列的性能。官方强烈建议尽快升级；完整漏洞条件和致谢见本版官方发布博客的中文译文。

## New Feature

- webhook 通知包含 Release 附件信息；项目里程碑可按关联工单筛选。

## Performance

- 缓存成功的 Runner 令牌验证结果；移除导致 SQLite 在管理员作业队列等页面读取几乎所有作业行的不必要索引。
- 加快工单与拉取请求仪表盘及仓库列表，修复相关表索引；加载所有提交状态时仅加载一次仓库。

## Bugfix / Security

- 收紧 public-only 令牌在管理员 API、组织仓库操作、OCI blob 挂载、OIDC userinfo、资料页、订阅源及贡献热力图上的权限，防止私有资源和组织 Runner 作业密钥泄露。
- 启用 `ACCOUNT_LINKING = auto` 且开放注册时，仅自动关联外部身份所指向的账户，修复通过关联表单访问其他现有账户的问题（CVE-2026-120263）。
- 评审触发的工作流在拉取请求 head 提交上运行，防止利用评审 `commit_id` 选择攻击者提交并使用仓库密钥执行工作流（CVE-2026-118386）；禁用 Actions 的仓库不再向 Runner 分配作业。
- 阻止 Actions 系统用户令牌列举实例的私有仓库或向系统账户添加邮件地址、GPG 密钥；后者的影响仅限于显示的签名状态。
- 修复 v1 产物上传头造成的存储型 XSS、工单依赖及项目看板泄露私有工单／拉取请求，以及已归档仓库仍可被修改的问题；限制产物保留期限和 Helm chart 解压数据量。
- 发布二进制使用 Go 1.27.3，停止信任一组存在安全隐患的中间证书，影响 OAuth2、webhook、镜像和迁移等对外连接的证书检查（CVE-2026-111943）；`golang.org/x/net` 更新至 v0.62.0，包含安全修复。
- 修复评审与评论同步、重命名文件差异、里程碑日期、标签和 API 权限检查，以及 GitHub／OneDev 迁移、贡献者统计、软件包元数据和多项界面问题。
