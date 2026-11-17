## 0.16.1 - 2026-11-17

### 修复

- 修复 Claude Bypass 在 `permissions.ask` 规则或返回 `ask` 的钩子要求显示权限卡片时，仍跳过卡片直接批准操作的问题 ([#9927](https://github.com/getpaseo/paseo/pull/9927))
- 修复触屏笔记本主要使用触控板或鼠标时，控件仍采用触控尺寸的问题 ([#9909](https://github.com/getpaseo/paseo/pull/9909)，由 @michaelhthomas)
- 修复 Claude Code 正在续订过期访问令牌时，Paseo 刷新 Claude 模型列表导致会话一直失败，直到运行 `/login` 的问题 ([#9855](https://github.com/getpaseo/paseo/pull/9855)，由 @daysun-k)
- 修复网页版“添加主机”表单的文本输入框缺少边框，导致主机密码字段不可见的问题 ([#9865](https://github.com/getpaseo/paseo/pull/9865)，由 @angusb93)
- 修复新消息改变当前轮次的执行方向后，OpenCode 的问题无法回答或关闭的情况 ([#9891](https://github.com/getpaseo/paseo/pull/9891))
- 修复含有 `/` 的 Pi 和 OMP 模型名称被截断，只显示最后一个斜杠后文字的问题 ([#9823](https://github.com/getpaseo/paseo/pull/9823), [#9836](https://github.com/getpaseo/paseo/pull/9836)，由 @rms523)
- 修复在文件暂存的同一秒内保存了大小未变的编辑时，“变更”视图遗漏该编辑的问题 ([#9854](https://github.com/getpaseo/paseo/pull/9854))
- 修复将对话标为已读失败后，错误提示一直不关闭的问题 ([#9837](https://github.com/getpaseo/paseo/pull/9837))
- 修复守护进程重启后，等待结果和完成通知将智能体自行发起的回复与上一条回复合并的问题 ([#9846](https://github.com/getpaseo/paseo/pull/9846))
- 修复客户端仅为读取历史记录而打开 Codex 对话时，对话一直留在守护进程中，直到重启才卸载的问题 ([#9859](https://github.com/getpaseo/paseo/pull/9859)，由 @Spshulem)
