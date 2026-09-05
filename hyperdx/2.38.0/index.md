---
title: HyperDX 2.38.0 更新总结
description: HyperDX 2.38.0 的中文更新总结、原始 Changelog 与简体中文翻译。
---

<ReleaseCard
  software="HyperDX"
  version="2.38.0"
  date="2026-09-04"
  repository-url="https://github.com/hyperdxio/hyperdx"
  docs-url="https://www.hyperdx.io/docs/"
  release-url="https://github.com/hyperdxio/hyperdx/releases/tag/%40hyperdx/app%402.38.0"
/>

## 概览

本周期重点扩展 GPU 与 LLM 可观测性：基础设施面板新增按 GPU 和引擎拆分的利用率图表，并推出兼容多种 GenAI 埋点规范、可追溯历史数据的 LLM 可观测性仪表盘。告警、PromQL 过滤器、指标选择器和图表编辑器也获得多项增强，同时修复复杂分组图表、Prometheus 代理路径以及 OTel Bearer 认证等问题。

## Breaking Change

- PromQL 代理现在会保留 Connection 主机地址中的路径前缀；若现有地址误带 `/graph` 等非 API 前缀或无意保留的查询参数，升级前应清理，否则请求路径可能变为无效地址。
- PromQL 代理不再转发固定允许列表之外的任意请求查询参数；依赖这一旧行为的直接 API 调用需要调整。

## New Feature

- 基础设施侧栏新增 GPU 利用率与显存利用率图表，支持多 GPU 及通用、编码器、解码器等引擎维度。
- 新增 `/llm` Beta 仪表盘，在查询时兼容 OTel GenAI、OpenLLMetry、OpenInference 和 Vercel AI SDK，并展示流量、Token、成本、时延、工具与会话分析。
- 支持 inline 图表告警、告警 `displayName`/`tags`、更丰富的 Webhook 模板变量，以及 MCP、PromQL 和仪表盘静态过滤器。
- 新增 PromQL 标签过滤器自动补全、自定义序列图例模板和浏览器调试信息导出能力。

## Bugfix / Security

- 指标名称改为确定性、分页式服务端检索，并遵循图表时间范围，避免高基数指标被随机采样遗漏。
- 修复单序列直方图和多序列指标图按分组表达式排序时的作用域错误。
- 修复 PromQL 标签和值重复导致 Mantine 崩溃、图表 Y 轴小数显示、条件颜色保留及模式样本信息展示问题。
- standalone 与 OpAMP 托管模式的 OTel 接收端均接受 RFC 6750 `Bearer` 前缀认证头，同时保留裸 Token 兼容性。

