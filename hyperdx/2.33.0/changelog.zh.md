

## @hyperdx/app@2.33.0

### 小改动

- 8aeb2f32：为仪表板添加只读信息亭模式，具有最小标题和自动
 静态显示的实时刷新。
- b1e4e1d9：feat：除了 URL 参数中的 ID 之外，还接受源名称

### 补丁更改

- b1e4e1d9：修复：在源加载时禁用无效的自动完成查询
- b2165b41：壮举（仪表板）：选择加入链接（多面）过滤器值

 仪表板和 Kubernetes 过滤器栏获得“链接过滤器”切换（
 栏末尾的双向箭头按钮）。启用后，每个过滤器
 下拉列表仅显示与其他当前选择同时出现的值 -
 例如选择“集群”会将“命名空间”下拉列表缩小到其中的命名空间
 集群（K8s bar 也参与自由文本搜索）。从来没有过滤器
 限制了它自己的选项，所以多重选择仍然有效。默认是关闭的
 因为条件值查找不能使用廉价的每键汇总，并且
 规模上更昂贵；启用时，源的所有方面都在
 单个“groupUniqArrayIf”扫描而不是每个过滤器一个查询。搜索页
 过滤器不受影响。

- cacdfe98：壮举：支持其他页面上的源名称深度链接
- 7914ec09：修复时间表工具提示：单击图表外部现在取消固定
 工具提示，图钉始终堆叠在悬停工具提示上方，以及多系列悬停
 工具提示被限制在有限的高度而不是溢出图表（将其固定
 滚动浏览每个系列）。
- 9327396c：修复保存的搜索导航，以便新创建的搜索可靠地加载其存储的
 配置。
- ab190d16：杂务：将使用情况统计跟踪移至 Reo.dev
- e231d72e：修复：当查询处于错误状态时停止请求额外的搜索页面。 
失败的页面（例如，慢速时间窗口上的 ClickHouse 查询超时）
 之前将 `hasNextPage` 保持为 true，因此表重新发出失败的查询并
 保持在隐藏错误并报告零结果的加载状态。
- ec161d70：壮举：将仪表板图块全屏操作移动到顶级工具栏图标

 “查看全屏”操作现在作为图标直接位于图块工具栏中，而不是位于“更多操作”菜单中，因此只需单击一次而不是两次。折叠工具栏的窄图块将其保留在菜单中，并且“f”快捷键保持不变。

- 7b3e6d28：修复：绘制一个独立的仪表板系列，即使它的排名超出了线上限

 隔离（或搜索/复选框过滤）超出每个图表线条渲染上限的时间图系列会使图表留空，因为上限是在选择过滤器之前应用的。现在，选择超过了上限，因此明确选择的系列始终会渲染，并且超大的手动选择仍然受上限限制。

- fa1a0687：壮举：警告 SQL 编辑器中缺少参数/宏
- 更新了依赖项 [017c296e]
- 更新了依赖项 [874a5e95]
- 更新了依赖项 [0e280949]
- 更新了依赖项 [1b658f3c]
- 更新了依赖项 [fa1a0687]
 - @hyperdx/api@2.33.0
 - @hyperdx/common-utils@0.24.1

## @hyperdx/common-utils@0.24.1

### 补丁更改

- fa1a0687：壮举：警告 SQL 编辑器中缺少参数/宏

## @hyperdx/api@2.33.0

### 小改动

- 874a5e95：feat(mcp)：添加源和 webhook 管理工具，以便摄取 → 仪表板流程可以实现端到端自动化。新的 MCP 工具：“clickstack_save_source”/“clickstack_delete_source”和“clickstack_save_webhook”/“clickstack_delete_webhook”（保存在省略“id”时创建，并在提供时更新）。 Webhook 逻辑现在通过 `createWebhook` / `updateWebhook` / `deleteWebhook` 控制器共享：`createWebhook` 由内部 API、外部 API v2 和 MCP 使用； `updateWebhook` / `deleteWebhook` 由外部 API v2 和 MCP 共享（内部 API 保留其自己的屏蔽秘密更新/删除流程）。 

`clickstack_describe_source` 现在返回一个可往返的 `config` 块 - `clickstack_save_source` 接受的确切平面形状，包括之前省略的精选摘要字段（相关 ID `logSourceId`/`traceSourceId`/`metricSourceId`/`sessionSourceId`、`defaultTableSelectExpression`、`parentSpanIdExpression`、`spanKindExpression`、物化视图等）。这消除了读/写不对称性，使忠实的源克隆变得不可能：代理可以读回源的完整配置并将其直接传递到“clickstack_save_source”中以克隆或读-修改-写它。



 修复（警报）：通用/事件 Webhook 在没有正文的情况下持续存在（正文默认值仅由 UI 表单应用，而不是 API/MCP 创建路径）不再使 `Handlebars.compile(undefined)` 上的 `sendGenericWebhook` 崩溃。现在它会回退到默认的正文模板，因此警报仍然会触发。

### 补丁更改

- 017c296e：修复：修复 MCP 分组条形/饼图查询中的 DataCloneError
- 0e280949：修复：MCP 端点（`/api/mcp`）现在为 GET 和 DELETE 返回 405，而不是中止符合规范的客户端。无状态 Streamable HTTP 传输不提供服务器启动的 SSE 流或客户端可终止的会话，因此它现在对这些方法响应“405 不允许的方法”（使用“允许：POST”），官方 MCP SDK 客户端（例如 Claude Code）将其视为“未提供，继续”而不是失败的连接。
- 1b658f3c：修复：处理警报任务中的每个连接失败而不退出
- 更新了依赖项 [fa1a0687]
 - @hyperdx/common-utils@0.24.1

