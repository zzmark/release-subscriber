# Release Monitor 配置规范

此目录保存 Release Monitor 的长期规则与软件级配置，供后续人工维护和自动任务读取。这里的文件不是发布报告，不应由 VitePress 作为内容页展示。

## 状态

- `active`：已经生成版本资料，并继续跟踪后续版本。
- `planned`：仅完成基础配置，尚未扫描或回填任何版本。

只有在明确开始执行后，才可把软件从 `planned` 改为 `active`。

## 目录与文件

每个版本使用以下基础结构：

```text
<software>/<version>/
├── index.md
├── changelog.md
└── changelog.zh.md
```

- `index.md`：中文结构化更新总结。
- `changelog.md`：上游原始 Changelog；除软件级规则明确要求聚合或抽取外，应保留原文。
- `changelog.zh.md`：与原始 Changelog 结构对应的简体中文翻译。
- 软件级配置可以要求额外资料。ClickHouse 版本还包含 `presentation.zh/index.html` 及其必要资源，作为可在线浏览的中文 Release 演示。

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

软件级配置可以为 Release Card 增加额外链接或标记。ClickHouse 必须加入原始 Release 演示、中文 Release 演示链接，并在 3 月和 8 月版本显示 `LTS` 标记。

## 翻译规则

- 所有译文必须由 ChatGPT 基于具体软件的用途、技术栈和上下文完成。
- 是否使用 subagent 由执行任务根据内容规模自行决定。
- 禁止使用 Google Translate、浏览器翻译或类似基础机翻，包括“机翻后润色”。
- 必须完整保留 Markdown 或幻灯片结构、链接、代码、命令、版本号、包名和无需翻译的专有名词。
- 同一软件内的技术术语与组件名称必须保持一致。
- 提交前检查逐段或逐页对应关系、错译漏译、批次串文、生硬直译和非预期英文残留。

## 通用选择规则

- 最低版本号为包含边界，除非软件级配置另有说明。
- 忽略 GitHub Draft Release。
- 默认只处理稳定版本；软件级配置可以覆盖预发布版本规则。
- 发布时间优先取上游 Release 或 Changelog 明确给出的发布日期，页面显示 UTC 日期 `YYYY-MM-DD`。
- 已生成的历史版本默认不可改写；只有用户明确要求时才更新。
- 新版本应保持原始 Changelog、中文翻译和结构化总结之间可追溯。

## 主题规则

Release Card 支持 `accent` 参数。

- 未配置主题的软件不得自行分配颜色。
- ClickHouse 按版本号中的月份切换四季主题色，具体映射以 `software/clickhouse.yaml` 为准；不能按任务执行日期或页面生成日期取色。
