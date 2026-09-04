import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, type DefaultTheme } from 'vitepress'

const repository = 'https://github.com/zzmark/release-subscriber'

function compareVersionsDescending(a: string, b: string): number {
  return b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' })
}

function releaseItems(software: string): DefaultTheme.SidebarItem[] {
  const directory = resolve(process.cwd(), software)
  const versions = readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^\d+\.\d+\.\d+(?:[-+].+)?$/.test(entry.name))
    .map((entry) => entry.name)
    .sort(compareVersionsDescending)

  return versions.map((version, index) => ({
      text: version,
      collapsed: index !== 0,
      items: [
        { text: '更新总结', link: `/${software}/${version}/` },
        { text: '原始 Changelog', link: `/${software}/${version}/changelog` },
        { text: '中文 Changelog', link: `/${software}/${version}/changelog.zh` }
      ]
    }))
}

export default defineConfig({
  lang: 'zh-CN',
  title: 'Release Monitor',
  description: '软件版本更新、原始 Changelog 与中文更新总结',
  base: '/release-subscriber/',
  cleanUrls: true,
  lastUpdated: true,
  sitemap: {
    hostname: 'https://zzmark.github.io/release-subscriber/'
  },
  head: [
    ['meta', { name: 'theme-color', content: '#3451b2' }]
  ],
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: 'Vaultwarden', link: '/vaultwarden/' },
      { text: 'GitHub', link: repository }
    ],
    sidebar: {
      '/vaultwarden/': [
        { text: 'Vaultwarden', link: '/vaultwarden/' },
        ...releaseItems('vaultwarden')
      ]
    },
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '没有找到相关结果',
            resetButtonTitle: '清除查询',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    },
    outline: {
      level: [2, 3],
      label: '本页目录'
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'medium',
        timeStyle: 'short'
      }
    },
    editLink: {
      pattern: `${repository}/edit/main/:path`,
      text: '在 GitHub 上编辑此页'
    },
    socialLinks: [
      { icon: 'github', link: repository }
    ]
  }
})
