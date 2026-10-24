## 0.13.0 - 2026-10-24

折叠屏手机布局、可将工作委派到其他机器的代理、插件文件面板，以及插件翻译。

将守护进程连接到另一台机器，然后让代理将工作委派到该机器：

```sh
paseo host add 192.168.1.20:6767 --label studio
paseo host add 'ssh://me@build-box' --label build-box
paseo host add 'relay://...' --label laptop
```

### 新增

- 新增对 iPhone Duo 等折叠屏手机的支持，展开时切换为宽屏布局 ([#7424](https://github.com/getpaseo/paseo/pull/7424), [#7705](https://github.com/getpaseo/paseo/pull/7705))
- 新增已连接主机功能，代理可在其他机器上创建代理、发送提示并监控代理，还可在子代理轨道中查看这些代理 ([#7370](https://github.com/getpaseo/paseo/pull/7370), [#7593](https://github.com/getpaseo/paseo/pull/7593))
- paseo.sh 新增简体中文版，访问地址为 [paseo.sh/zh-CN](https://paseo.sh/zh-CN) ([#7373](https://github.com/getpaseo/paseo/pull/7373))
- 差异面板新增“所有更改”并设为默认选项，在同一份差异中显示自分支基点以来已提交和未提交的更改 ([#7576](https://github.com/getpaseo/paseo/pull/7576))
- 进入 Plan 模式前已开启 Auto 模式时，Claude 计划审批新增“使用 Auto 模式实施”选项 ([#7453](https://github.com/getpaseo/paseo/pull/7453))
- 新增向终端粘贴图片和拖入文件的支持，使 Claude Code、Codex 等代理的终端用户界面（TUI）能够读取这些内容，远程主机也适用 ([#3795](https://github.com/getpaseo/paseo/pull/3795) by @gerardbalaoro)

### 改进

- 侧栏工作区改为按创建时间排序；“显示 → 排序”中还可选择“最后提示时间”和“手动” ([#7635](https://github.com/getpaseo/paseo/pull/7635), [#7771](https://github.com/getpaseo/paseo/pull/7771))
- 侧栏中较长的项目分组改为显示七个工作区，以及所有需要关注或正在工作的工作区；其余工作区通过“显示更多”展开 ([#7635](https://github.com/getpaseo/paseo/pull/7635))
- 命令中心中的代理和工作区搜索结果改为显示与标签页、侧栏一致的图标和状态 ([#7690](https://github.com/getpaseo/paseo/pull/7690))
- 手动生成元数据时改为仅使用选定的模型，不再回退到默认模型 ([#7611](https://github.com/getpaseo/paseo/pull/7611))
- 新建工作区时始终显示“主机”字段，其菜单末尾提供“添加主机” ([#7580](https://github.com/getpaseo/paseo/pull/7580))
- 资源管理器在手机、平板和桌面端统一使用相同的标签页和启动器 ([#7424](https://github.com/getpaseo/paseo/pull/7424))
- 手机上的资源管理器标签页改为保留完整标签并支持滚动，“关闭”移入长按菜单 ([#7589](https://github.com/getpaseo/paseo/pull/7589))
- 守护进程设置了密码时，中继连接也必须提供该密码；此前未保存密码的中继主机需要重新添加 ([#7668](https://github.com/getpaseo/paseo/pull/7668) by @nickmaglowsch)
- 在手机上取消搜索、导入会话或添加项目时，保持侧栏打开 ([#7693](https://github.com/getpaseo/paseo/pull/7693))
- 将固定版本的 ACP 代理更新至其最新版本 ([#7781](https://github.com/getpaseo/paseo/pull/7781) by @JunWeiUp, @LouisDeconinck)
- 移除旧终端渲染器；iOS 和 Android 始终使用原生终端渲染器 ([#7639](https://github.com/getpaseo/paseo/pull/7639))
- 用量行改为使用应用当前语言，明确标注百分比表示已用量还是剩余量 ([#7376](https://github.com/getpaseo/paseo/pull/7376) by @michaelmwu)
- 代理的报告与完成通知改为合并成一条消息发送给父代理 ([#7561](https://github.com/getpaseo/paseo/pull/7561))
- 不再向未显示相应工作区“设置流程”面板的应用发送工作区设置输出 ([#7407](https://github.com/getpaseo/paseo/pull/7407), [#7473](https://github.com/getpaseo/paseo/pull/7473))
- 暂停 iOS 和 Android 上隐藏面板中的状态环动画 ([#7423](https://github.com/getpaseo/paseo/pull/7423) by @peterkeen)
- 仅加载所选语言的译文，减少应用启动时的工作量 ([#7410](https://github.com/getpaseo/paseo/pull/7410) by @colonelpanic8)
- 工作区布局没有变化时，不再重复保存 ([#7358](https://github.com/getpaseo/paseo/pull/7358) by @colonelpanic8)

### 插件

- 新增[文件面板](https://paseo.sh/docs/plugins/reference#file-panels)，插件可在文件标签页中打开匹配的文件，例如提供 PDF 查看器或富文本 Markdown 编辑器 ([#7411](https://github.com/getpaseo/paseo/pull/7411), [#7366](https://github.com/getpaseo/paseo/pull/7366), [#7614](https://github.com/getpaseo/paseo/pull/7614))
- 新增 `useTabState`，用于保存可在重新加载后恢复的各标签页面板状态，并新增 `addAgentPanel`；工作区面板、代理面板和文件面板共用 `workspaceId`、`params`、`revision` 和 `tab` 属性 ([#7685](https://github.com/getpaseo/paseo/pull/7685))
- 新增[插件翻译](https://paseo.sh/docs/plugins/reference#runtime-translations)，让插件内容和标签随应用语言切换 ([#7478](https://github.com/getpaseo/paseo/pull/7478))
- 支持通过 `translations`（位于 `paseo-plugin.json` 中）和 `OVERVIEW.zh-CN.md` 提供插件列表介绍的译文 ([#7373](https://github.com/getpaseo/paseo/pull/7373))
- 新增 `Markdown` 组件，位于 `@getpaseo/plugin/client/ui`，使用 Paseo 的渲染器渲染 Markdown ([#7579](https://github.com/getpaseo/paseo/pull/7579))
- 所有插件 `icon` 均支持内联 SVG 和组件图标 ([#7368](https://github.com/getpaseo/paseo/pull/7368))
- 所有插件 UI 导入统一改用 `@getpaseo/plugin/client/ui`；包括 `useRevealedText` 在内的旧入口仍可使用，但已弃用 ([#7474](https://github.com/getpaseo/paseo/pull/7474), [#7780](https://github.com/getpaseo/paseo/pull/7780) by @luoph, @RRD-dev, @mcowger)
- 弃用面板的 `context` 和 `agentId` 属性，以及 `addWorkspacePanel` 的 `context` 字段；请改用 `params.agentId` 和 `addAgentPanel` ([#7685](https://github.com/getpaseo/paseo/pull/7685))
- 轮次结束钩子改为发送空的 `timeline`；请改用 `timeline.refetch` 获取最近的历史记录 ([#7477](https://github.com/getpaseo/paseo/pull/7477))
- 修复手机和窄窗口中插件标题栏按钮缺失的问题；这些按钮现在显示在工作区的 ··· 菜单中 ([#7630](https://github.com/getpaseo/paseo/pull/7630))
- 修复重新打开 ACP 插件代理时聊天内容为空的问题 ([#7717](https://github.com/getpaseo/paseo/pull/7717) by @nistream)
- 修复通知时间线转换器因“invalid item type: notification”而无法加载的问题 ([#7582](https://github.com/getpaseo/paseo/pull/7582) by @Gavinchen92)

### 修复

- 修复守护进程重启后代理仍显示为运行中的问题 ([#7573](https://github.com/getpaseo/paseo/pull/7573))
- 修复守护进程重启后，父代理始终收不到启用 `notifyOnFinish` 的子代理通知的问题 ([#7683](https://github.com/getpaseo/paseo/pull/7683))
- 修复打开大型 Claude 会话时聊天内容为空或守护进程崩溃的问题 ([#7431](https://github.com/getpaseo/paseo/pull/7431) by @ZouYusheng)
- 修复导入较大的 Claude 历史记录时守护进程崩溃的问题 ([#7626](https://github.com/getpaseo/paseo/pull/7626) by @lanej)
- 修复直连中断后主机停留在错误状态、未切换到已保存中继连接的问题 ([#7616](https://github.com/getpaseo/paseo/pull/7616) by @3ae3ae)
- 修复 iOS 上点击通知打开过时工作区的问题，以及 Android 每次重新打开应用都再次打开通知对应代理的问题 ([#7612](https://github.com/getpaseo/paseo/pull/7612) by @kassamkhoja)
- 修复应用重新连接后侧栏中的 PR 状态和检查结果消失的问题 ([#7638](https://github.com/getpaseo/paseo/pull/7638))
- 修复没有应用显示工作区时，工作区差异统计和已合并 PR 的自动归档未能及时更新的问题 ([#7681](https://github.com/getpaseo/paseo/pull/7681))
- 修复 iPhone 上的 `/` 和 `@` 选择器遮挡消息输入框，并使最佳匹配项被键盘挡住的问题 ([#7679](https://github.com/getpaseo/paseo/pull/7679) by @masz77)
- 修复在手机上重新打开标为未读的工作区时，代理一直停留在加载状态的问题 ([#7608](https://github.com/getpaseo/paseo/pull/7608))
- 修复新工作区的固定状态或标题从侧栏消失、直到下一次更新才恢复的问题 ([#7758](https://github.com/getpaseo/paseo/pull/7758) by @stv1024)
- 修复守护进程重启后 Claude 后台命令通知重复出现的问题 ([#7737](https://github.com/getpaseo/paseo/pull/7737))
- 修复使用兼容 OpenAI 的语音服务器时，语音回复跳过后续句子的问题 ([#7756](https://github.com/getpaseo/paseo/pull/7756) by @grueneisfabian)
- 修复 Cursor 用量将奖励额度的消耗显示为超额支出，而非配额百分比的问题 ([#7778](https://github.com/getpaseo/paseo/pull/7778) by @kbitz, @stackia)
- 修复 Android 平板任务栏遮挡侧栏“添加项目”“主机”“帮助”和“设置”的问题 ([#7768](https://github.com/getpaseo/paseo/pull/7768))
- 修复滚动命令中心时视图跳回已选中结果的问题 ([#7688](https://github.com/getpaseo/paseo/pull/7688))
- 修复导入或恢复聊天时 Claude 系统上下文被显示为助手消息的问题 ([#7590](https://github.com/getpaseo/paseo/pull/7590) by @khevamann, @rogerluan)
- 修复应用刚加载完成就离开或重新加载时，已保存的工作区标签页丢失的问题 ([#7547](https://github.com/getpaseo/paseo/pull/7547))
- 修复 Markdown 预览中的相对链接从工作区根目录解析，而非从文档所在文件夹解析的问题 ([#7538](https://github.com/getpaseo/paseo/pull/7538))
- 修复 Android 上更改字体大小后，添加图片报错“Failed to select image”的问题 ([#7546](https://github.com/getpaseo/paseo/pull/7546) by @RRD-dev, @idoyana, @luoph)
- 修复 Android 上浮出面板、工具提示和上下文菜单的打开位置比触发控件低一个状态栏高度的问题 ([#7589](https://github.com/getpaseo/paseo/pull/7589))
- 修复浅色主题下当前资源管理器标签页不可见的问题 ([#7589](https://github.com/getpaseo/paseo/pull/7589))
- 修复 Android 将不受信任的证书错误显示为“Host not found”，并为无法解析的主机名错误提供 TLS 建议的问题 ([#7429](https://github.com/getpaseo/paseo/pull/7429), [#7701](https://github.com/getpaseo/paseo/pull/7701))
- 修复 Android 键盘遮挡“设置”中当前焦点字段的问题 ([#7362](https://github.com/getpaseo/paseo/pull/7362))
- 修复紧凑差异菜单中“拉取”或“推送”重复出现的问题 ([#7355](https://github.com/getpaseo/paseo/pull/7355) by @az33zy)
- 修复“跳转到标签页”和“跳转到工作区”允许保存不以数字结尾的快捷键的问题 ([#7365](https://github.com/getpaseo/paseo/pull/7365))
- 修复 `paseo agent archive` 对前 200 个之外的代理报 `AGENT_NOT_FOUND` 的问题 ([#7535](https://github.com/getpaseo/paseo/pull/7535) by @L4XB, @hteo1337)
- 修复读取已归档代理的历史记录后，这些代理重新出现在 MCP `list_agents` 中的问题 ([#7532](https://github.com/getpaseo/paseo/pull/7532) by @thomasvan)
- 修复以 `notifyOnFinish` 创建的分离运行代理始终不向创建者发送通知的问题 ([#7528](https://github.com/getpaseo/paseo/pull/7528) by @thomasvan)
- 修复给 OpenCode 代理的说明错误地声称 `notifyOnFinish` 默认关闭的问题 ([#7383](https://github.com/getpaseo/paseo/pull/7383) by @gszep)
- 修复恢复请求被拒绝后，Pi 子代理行仍显示为运行中的问题 ([#7369](https://github.com/getpaseo/paseo/pull/7369))
- 修复从源码构建 Android 应用时又下载一份 NDK 的问题 ([#7403](https://github.com/getpaseo/paseo/pull/7403) by @dwyanewang)
- 修复 Nix 软件包将许可证标为 AGPL，而非 Apache-2.0 的问题 ([#7415](https://github.com/getpaseo/paseo/pull/7415))
