# Release Monitor 配置规范

此目录保存 Release Monitor 的长期规则与软件级配置，供后续人工维护和自动任务读取。这里的文件不是发布报告，不应由 VitePress 作为内容页展示。

## 状态

- `active`：已经生成版本资料，并继续跟踪后续版本。
- `planned`：仅完成基础配置，尚未扫描或回填任何版本。

只有在明确开始执行后，才可把软件从 `planned` 改为 `active`。

## 目录与文件

每个版本使用以下结构：

```text
<software>/<version>/
├── index.md
├── changelog.md
└── changelog.zh.md
```

- `index.md`：中文结构化更新总结。
- `changelog.md`：上游原始 Changelog；除软件级规则明确要求聚合外，应保留原文。
- `changelog.zh.md`：与原始 Changelog 结构对应的简体中文翻译。

## index.md 生成规则

固定内容：

1. Release Card：软件名、版本号、发布时间、项目主页、官方文档、版本页面、原始及中文 Changelog。
2. 概览：说明主要内容、更新亮点、重要变化与升级注意事项。

条件内容按以下顺序生成：

1. `Breaking Change`
2. `New Feature`
3. `Performance`
4. `Bugfix / Security`

某个分类没有实际内容时，必须省略整个章节。禁止写入“本版本没有新增功能”“没有性能优化”等占位说明。

## 通用选择规则

- 最低版本号为包含边界，除非软件级配置另有说明。
- 忽略 GitHub Draft Release。
- 默认只处理稳定版本；软件级配置可以覆盖预发布版本规则。
- 发布时间取 GitHub Release 的 `published_at`，页面只显示 UTC 日期 `YYYY-MM-DD`。
- 已生成的历史版本默认不可改写；只有用户明确要求时才更新。
- 新版本应保持原始 Changelog、中文翻译和结构化总结之间可追溯。

## 主题规则

Release Card 已预留 `accent` 参数。未来需要为每款软件设置固定主题色，或设计按季节切换主题色的规则；在专项设计完成前，不自行分配颜色。
