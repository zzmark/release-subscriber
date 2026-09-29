# Release Monitor agent guide

本仓库是 VitePress 版本资料站。更新软件版本时，先读 [.release-monitor/README.md](.release-monitor/README.md) 和对应的 `.release-monitor/software/<slug>.yaml`；它们是内容与选版规则的权威来源。

## 工作范围

- 新产品：更新 catalog、软件配置、软件首页、站点导航与首页软件表。仅在版本资料齐备后设为 `active`。
- 新版本：按软件配置从上游源核对标签、正式版状态、发布时间和 Release 正文。GitHub 与 Gitea 的 Release 要使用各自的上游站点或官方 API；不要从镜像或搜索摘要拼接原文。
- 每版创建 `<slug>/<version>/index.md`、`changelog.md`、`changelog.zh.md`。原文保持可追溯；中文翻译保留标题层级、列表、链接、代码和术语。总结只写有实际内容的分类。
- 已收录的历史版本默认不改写。若发现历史数据问题，先核对用户是否要求修订。
- 维护软件首页版本表，并运行 `npm run releases:sync-home` 更新首页最新版本列。不要手工猜测最新版本。

## 完成检查

运行 `npm run releases:check` 和 `npm run docs:build`。检查失败时修复源数据或导航，不要放宽检查来掩盖内容缺失。CI 在部署前执行同样的检查。

具体操作步骤见项目 skill：[release-monitor](.agents/skills/release-monitor/SKILL.md)。
