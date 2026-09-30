## 0.10.2 - 2026-09-30

### 修复

- 修复 OpenCode v2 回合持续超过五分钟时，因 `UND_ERR_HEADERS_TIMEOUT` 而失败的问题（[#5674](https://github.com/getpaseo/paseo/pull/5674)）
- 修复 OpenCode v2 回合进行期间，上下文用量指示器一直为空，并在回合结束后消失的问题（[#5710](https://github.com/getpaseo/paseo/pull/5710)，由 @mcowger 贡献）
- 修复 OpenCode v2 提问卡片只显示标题，且不提供输入答案的选项的问题（[#5679](https://github.com/getpaseo/paseo/pull/5679)）
- 修复 GPT 模型在 OpenCode v2 中进行的补丁编辑显示为原始 Patch 卡片，而非编辑差异视图的问题（[#5696](https://github.com/getpaseo/paseo/pull/5696)）
- 修复已完成的 OpenCode v2 编辑不显示差异的问题（[#5609](https://github.com/getpaseo/paseo/pull/5609)）
