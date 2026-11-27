## 0.18.1 - 2026-11-27

- **主机级元数据指令：** 可在主机上统一设置指令，用于指定生成工作区标题、分支名、提交消息和拉取请求时采用的语言、语气与格式。 ([#11064](https://github.com/getpaseo/paseo/pull/11064))
- **企业用量支出：** 用量页面现在显示 Claude 额外用量的支出、Codex 个人支出上限和重置时间。 ([#8976](https://github.com/getpaseo/paseo/pull/8976) by @mcowger, @JasprW)

<details>
<summary>全部变更</summary>

### 修复

- 修复 Android 进入 Doze 模式时，智能体推送通知延迟数分钟的问题。 ([#8501](https://github.com/getpaseo/paseo/pull/8501) by @truelecter)
- 修复在命令中心输入一个词的过程中，搜索结果突然重新排序的问题。 ([#11085](https://github.com/getpaseo/paseo/pull/11085))
- 修复关闭 Web 浮层后，或在提示词提交期间打开自动补全时，消息编辑器的斜杠和 `@` 自动补全停止工作的问题。 ([#11041](https://github.com/getpaseo/paseo/pull/11041))
- 修复首次打开「新建工作区」中的起始引用弹出框时，弹出框高度突变并导致列表条目移动的问题。 ([#11042](https://github.com/getpaseo/paseo/pull/11042))
- 修复宽屏布局下，从 iOS 主屏幕打开的 Web 应用的状态栏与专注模式标签页、浮动侧栏及 Mermaid 全屏查看器重叠的问题。 ([#9970](https://github.com/getpaseo/paseo/pull/9970) by @mywaffles)
- 修复将工作区标为已读时，已完成终端的待处理提醒仍未清除的问题。 ([#11040](https://github.com/getpaseo/paseo/pull/11040))
- 修复 GitLab 流水线在派生项目中运行时，合并请求检查和流水线详情返回 404 的问题。 ([#11074](https://github.com/getpaseo/paseo/pull/11074))
- 修复 Pi 执行自行启动的轮次时，用户发送的消息未进入队列而直接失败的问题。 ([#11077](https://github.com/getpaseo/paseo/pull/11077))
- 修复 OpenCode v2 已撤销请求后，工具审批仍卡住的问题。 ([#11061](https://github.com/getpaseo/paseo/pull/11061) by @rhettjay)
- 修复共享服务器上有其他会话运行时，空闲清理未能从内存释放 OpenCode v2 聊天的问题。 ([#11039](https://github.com/getpaseo/paseo/pull/11039))
- 修复空闲 ACP 智能体的进程退出后，下一条消息无法重开智能体，导致其持续失败的问题。 ([#11047](https://github.com/getpaseo/paseo/pull/11047))
- 修复全球版 `kimi.ai` 账号无法查询用量或显示登录已过期的问题。 ([#8505](https://github.com/getpaseo/paseo/pull/8505) by @benthecarman)
- 修复 GLM Agent 使用 `Z_AI_API_KEY` 或其凭据文件登录时未显示 Z.ai 用量卡片的问题。 ([#8376](https://github.com/getpaseo/paseo/pull/8376) by @Peanut-HZM)

### 插件

- 将 OMP 工具调用的意图加入 `item.metadata.intent`，供时间线插件使用。 ([#10727](https://github.com/getpaseo/paseo/pull/10727) by @mcowger)

</details>
