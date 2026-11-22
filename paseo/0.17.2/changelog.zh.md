## 0.17.2 - 2026-11-22

- **轮次和会话统计：** 可查看 Claude、OpenCode v2、Pi、Oh My Pi 和插件提供方的单轮及会话耗时、Token、缓存与费用指标。 ([#10496](https://github.com/getpaseo/paseo/pull/10496), [#10510](https://github.com/getpaseo/paseo/pull/10510))
- **自动刷新模型列表：** 已启用的提供方每 30 分钟在后台刷新一次模型列表。 ([#10481](https://github.com/getpaseo/paseo/pull/10481))
- **默认显示侧栏用量：** 侧栏用量摘要默认启用，未启用的提供方所对应的数据源初始隐藏，各数据源的开关移至「来源」列表。 ([#10491](https://github.com/getpaseo/paseo/pull/10491))
- **智能体可以引导运行中的轮次：** 除排队或中断外，智能体还可以向另一智能体正在运行的轮次发送引导消息，并从响应中获得关于消息投递的提示。 ([#10483](https://github.com/getpaseo/paseo/pull/10483))

<details>
<summary>全部变更</summary>

### 新增

- 移动端工作区操作菜单新增「归档工作区」。 ([#10507](https://github.com/getpaseo/paseo/pull/10507))
- 提供方设置新增文档链接、更完整的诊断报告，以及支持直接刷新且可滚动的「模型」列表。 ([#10487](https://github.com/getpaseo/paseo/pull/10487))

### 变更

- 移除 OpenCode v2 对话中的「此对话使用 OpenCode v2。」提示行。 ([#10490](https://github.com/getpaseo/paseo/pull/10490))

### 修复

- 修复在斜杠菜单中按 Tab 或 Enter 时，执行过期的 `/exit` 选项并归档智能体的问题。 ([#10484](https://github.com/getpaseo/paseo/pull/10484) by @3ae3ae)
- 修复保存多个连接时，繁忙主机的连接掉线并进入重连状态的问题。 ([#10395](https://github.com/getpaseo/paseo/pull/10395))
- 修复启动失败后修改「新建工作区」表单并重试时出现冲突错误的问题，并统一输入框的错误提示。 ([#10482](https://github.com/getpaseo/paseo/pull/10482))
- 修复创建周期性计划后 Antigravity 轮次一直显示为运行中的问题。 ([#10469](https://github.com/getpaseo/paseo/pull/10469))
- 修复守护进程启动或重新加载插件时，本地目录插件残留僵尸子进程的问题。 ([#10470](https://github.com/getpaseo/paseo/pull/10470))

</details>
