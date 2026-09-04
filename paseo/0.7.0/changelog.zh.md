

## 0.7.0 - 2026-08-31

### 已更改

- 将项目许可证更改为 Apache-2.0 ([#3944](https://github.com/getpaseo/paseo/pull/3944))
- 更改了 Cmd/Ctrl+E 以在不选择视图的情况下切换资源管理器可见性 ([#3896](https://github.com/getpaseo/paseo/pull/3896))
- 将默认移动内容文本大小从 15 像素更改为 16 像素 ([#4111](https://github.com/getpaseo/paseo/pull/4111))

### 添加

- 添加了直接从 Git 存储库安装和更新的插件 ([#3920](https://github.com/getpaseo/paseo/pull/3920))
- 添加了插件定义的时间轴转换和渲染（[#3940](https://github.com/getpaseo/paseo/pull/3940)）
- 添加了从桌面和 CLI 到现有远程守护进程的 SSH 连接（[#3989](https://github.com/getpaseo/paseo/pull/3989) by @reidlevesque）
- 在命令中心添加了工作区管理和布局操作（[#3013](https://github.com/getpaseo/paseo/pull/3013) by @cleiter）
- 为插件添加了上下文作曲家药丸贡献（[#3956](https://github.com/getpaseo/paseo/pull/3956)）
- 为客户端插件添加了主机 UI 原语 ([#3967](https://github.com/getpaseo/paseo/pull/3967))
- 添加了 Paseo 工具调用的可读提示、详细信息和结果 ([#4066](https://github.com/getpaseo/paseo/pull/4066))
- 向工作区图像和助理时间线预览添加了缩放和平移（[#4032](https://github.com/getpaseo/paseo/pull/4032)、[#4049](https://github.com/getpaseo/paseo/pull/4049)、[#4064](https://github.com/getpaseo/paseo/pull/4064))
- 添加了直接在首选桌面编辑器中打开子文件夹的功能（[#3615](https://github.com/getpaseo/paseo/pull/3615) by @caikovsky）
- 添加了从插件表面到代理和工作区的主机导航（[#3901](https://github.com/getpaseo/paseo/pull/3901) by @omercnet）
- 将主机渲染的图标添加到插件客户端界面（[#3903](https://github.com/getpaseo/paseo/pull/3903) by @omercnet）
- 向插件主题添加了语义表面、边框、成功和警告颜色（[#3898](https://github.com/getpaseo/paseo/pull/3898) by @omercnet）
- 将注册项目列表添加到公共插件 SDK（[#3899](https://github.com/getpaseo/paseo/pull/3899) by @omercnet）
- 在命令中心添加了 PR 和 MR 号码搜索（[#3008](https://github.com/getpaseo/paseo/pull/3008) by @cleiter）
- 向代理 SDK 句柄添加了会话命令（[#3719](https://github.com/getpaseo/paseo/pull/3719)，作者：@gpambrozio、@marvin-ambrozio）
- 添加了 F-Droid 版本元数据和稳定的变更日志生成（[#2501](https://github.com/getpaseo/paseo/pull/2501) by @antonok-edm）
- 向文件、编辑器和差异添加了 Astro 语法突出显示 ([#3997](https://github.com/getpaseo/paseo/pull/3997))

### 改进

- 以稳定的视觉速率传输助理文本，而不是到达块（[#3612](https://github.com/getpaseo/paseo/pull/3612) by @Tommypop2）
- 在不相关的缓存恢复和网络加载之前绘制缓存的对话（[#3907](https://github.com/getpaseo/paseo/pull/3907)）
- 在普通代理会话中重复使用一个 OpenCode 助手，而不是为每个代理生成一个 ([#4009](https://github.com/getpaseo/paseo/pull/4009))
- 在预留的 API 预算内批量进行 GitHub Pull 请求轮询（[#3825](https://github.com/getpaseo/paseo/pull/3825) by @dezchai）
- 向 GitLab 和 Gitea 检查添加了手动、需要操作和警告状态（[#2337](https://github.com/getpaseo/paseo/pull/2337) by @nllptrx）
- 在共享 GitHub 批处理路径上保留冷启动拉取请求状态检查 ([#4025](https://github.com/getpaseo/paseo/pull/4025))

### 已修复



- 修复了写入期间 Claude 或 OMP JSONL 进程关闭时守护进程崩溃的问题 ([#4048](https://github.com/getpaseo/paseo/pull/4048))
- 修复了在 Composer 拆卸过程中键盘重新启动时 Android 第一条消息提交崩溃的问题 ([#4044](https://github.com/getpaseo/paseo/pull/4044))
- 修复了将作曲家控件隐藏在键盘后面的长移动草稿（[#4051](https://github.com/getpaseo/paseo/pull/4051)）
- 修复了点击可选文本时 Android 时间轴发生变化的问题 ([#4090](https://github.com/getpaseo/paseo/pull/4090))
- 修复了 web 和 Electron 作曲家在提交后失去焦点的问题 ([#4067](https://github.com/getpaseo/paseo/pull/4067))
- 修复了 Android 听写在捕获停止后将蓝牙音频保留在通话质量路由中的问题 ([#4069](https://github.com/getpaseo/paseo/pull/4069))
- 修复了废弃部分转录后听写重试超时的问题（[#4065](https://github.com/getpaseo/paseo/pull/4065)）
- 修正了直接听写提交忽略最新语音片段的问题（[#3968](https://github.com/getpaseo/paseo/pull/3968)）
- 修复了 iPad 桌面布局中模型选择器崩溃的问题（[#3992](https://github.com/getpaseo/paseo/pull/3992) by @yzim）
- 修复了提供商子代理时间线中缺少 OpenCode 子会话提示的问题（[#4055](https://github.com/getpaseo/paseo/pull/4055) by @mcowger）
- 修复了从历史记录中打开时存档的代理消失的问题 ([#4033](https://github.com/getpaseo/paseo/pull/4033))
- 修复了恢复的工作区选项卡进入协调循环的问题 ([#3987](https://github.com/getpaseo/paseo/pull/3987))
- 修复了从持久缓存返回的存档工作区（[#3975](https://github.com/getpaseo/paseo/pull/3975)）
- 修复了 Grok 统一计费帐户显示零积分而不是每周使用量的问题（[#4029](https://github.com/getpaseo/paseo/pull/4029) by @Lite-G, @claude）
- 修复了 Git 进程排队时守护进程重新连接停止的问题 ([#3945](https://github.com/getpaseo/paseo/pull/3945))
- 修复了速度缓慢的 Pi 和 OMP 启动请求在 30 秒后超时的问题 ([#4008](https://github.com/getpaseo/paseo/pull/4008))
- 修复了绕过配置的 Git 签名的提交和压缩合并 ([#3976](https://github.com/getpaseo/paseo/pull/3976))
- 修复了覆盖提交控件的 Android 系统导航 ([#4005](https://github.com/getpaseo/paseo/pull/4005))
- 修复了新代理工作显示为重新打开的任务的问题 ([#4068](https://github.com/getpaseo/paseo/pull/4068))
- 修复了 Markdown 文字字符被印刷符号替换的问题（@cleiter 的 [#3253](https://github.com/getpaseo/paseo/pull/3253)）
- 修复了倒带长对话重播完整重建时间线的问题（[#3642](https://github.com/getpaseo/paseo/pull/3642)）
- 修复了已安装的 iOS 编辑器中的倒回提示保持空白的问题 ([#3946](https://github.com/getpaseo/paseo/pull/3946))
- 修复了 iOS 上本机插件设置和异步客户端回调失败的问题 ([#3942](https://github.com/getpaseo/paseo/pull/3942))
- 修复了 ACP 代理报告终端功能不可用的问题（[#3910](https://github.com/getpaseo/paseo/pull/3910) by @pmilanez）
- 修复了取消的克劳德权限请求留下过时的权限卡（[#3792](https://github.com/getpaseo/paseo/pull/3792)）
- 修复了隐藏来自非传统提供商的代理的插件守护进程会话（[#3902](https://github.com/getpaseo/paseo/pull/3902) by @omercnet）
- 修复了手动承认的桌面更新在准备情况检查期间消失的问题 ([#3865](https://github.com/getpaseo/paseo/pull/3865))
- 修复了在资源管理器外部打开的移动更改和拉取请求操作（[#3867](https://github.com/getpaseo/paseo/pull/3867)）
- 修复了较旧的桌面版本删除较新版本编写的设置（[#3909](https://github.com/getpaseo/paseo/pull/3909) by @cleiter）
- 修复了从设置返回后作曲家高度闪烁的问题 ([#3943](https://github.com/getpaseo/paseo/pull/3943))
- 修复了在 Light 主题中没有可见突出显示的选定工作区（[#3922](https://github.com/getpaseo/paseo/pull/3922) by @wdaubney）
- 修复了与更改树不一致的滚动差异顺序（[#3913](https://github.com/getpaseo/paseo/pull/3913) by @cleiter）
- 修复了关闭操作的错误西班牙语翻译（[#3934](https://github.com/getpaseo/paseo/pull/3934) by @antonio）

