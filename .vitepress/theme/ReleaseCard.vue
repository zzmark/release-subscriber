<script setup lang="ts">
withDefaults(defineProps<{
  software: string
  version: string
  date: string
  repositoryUrl: string
  docsUrl: string
  releaseUrl: string
  accent?: string
  releaseLabel?: string
  presentationUrl?: string
  presentationZhUrl?: string
}>(), {
  accent: '#2878d0',
  releaseLabel: '',
  presentationUrl: '',
  presentationZhUrl: ''
})
</script>

<template>
  <section class="release-card" :style="{ '--release-accent': accent }">
    <div class="release-card__header">
      <span class="release-card__eyebrow">
        <span class="release-card__mark" aria-hidden="true">◆</span>
        Release Summary
        <span v-if="releaseLabel" class="release-card__badge">{{ releaseLabel }}</span>
      </span>
      <h1>{{ software }} <span>v{{ version }}</span></h1>
    </div>

    <dl class="release-card__meta">
      <div>
        <dt>版本</dt>
        <dd>{{ version }}</dd>
      </div>
      <div>
        <dt>发布时间</dt>
        <dd>{{ date }}</dd>
      </div>
    </dl>

    <nav class="release-card__links" aria-label="版本资料">
      <a :href="repositoryUrl" target="_blank" rel="noreferrer">项目主页 ↗</a>
      <a :href="docsUrl" target="_blank" rel="noreferrer">官方文档 ↗</a>
      <a :href="releaseUrl" target="_blank" rel="noreferrer">版本页面 ↗</a>
      <a href="./changelog">原始 Changelog</a>
      <a href="./changelog.zh">中文 Changelog</a>
      <a v-if="presentationUrl" :href="presentationUrl" target="_blank" rel="noreferrer">原始演示 ↗</a>
      <a v-if="presentationZhUrl" :href="presentationZhUrl" target="_blank" rel="noreferrer">中文演示 ↗</a>
    </nav>
  </section>
</template>
