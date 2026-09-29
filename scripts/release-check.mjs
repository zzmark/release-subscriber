import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const read = (path) => readFileSync(resolve(root, path), 'utf8')
const versionPattern = /^\d+(?:\.\d+){0,2}(?:[-+].+)?$/
const compareVersions = (a, b) => b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' })
const errors = []

function field(yaml, section, key) {
  const match = yaml.match(new RegExp(`^${section}:\\s*\\r?\\n((?:^[ \\t]+.*\\r?\\n?)*)`, 'm'))
  return match?.[1].match(new RegExp(`^  ${key}:\\s*(.+)$`, 'm'))?.[1]?.trim().replace(/^['"]|['"]$/g, '')
}

const catalog = read('.release-monitor/catalog.yaml')
const products = [...catalog.matchAll(/^  - slug: ([\w-]+)\r?\n    status: (active|planned)\r?\n    config: ([^\r\n]+)/gm)]
if (!products.length) errors.push('catalog.yaml has no software entries')
const homePath = 'index.md'
let home = read(homePath)

for (const [, slug, status, configPath] of products) {
  const config = read(`.release-monitor/${configPath}`)
  const display = field(config, 'software', 'display_name')
  const output = field(config, 'software', 'output_directory')
  const configStatus = field(config, 'software', 'status')
  if (field(config, 'software', 'slug') !== slug || output !== slug || configStatus !== status) {
    errors.push(`${slug}: catalog and software config disagree`)
  }
  if (!existsSync(resolve(root, slug, 'index.md'))) {
    errors.push(`${slug}: missing landing page`)
    continue
  }
  const versions = readdirSync(resolve(root, slug), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && versionPattern.test(entry.name))
    .map((entry) => entry.name)
    .sort(compareVersions)
  if (status === 'active' && !versions.length) errors.push(`${slug}: active product has no releases`)
  if (status === 'planned' && versions.length) errors.push(`${slug}: planned product already has releases`)

  const minimum = field(config, 'selection', 'minimum_version')
  const minParts = minimum?.split('.').map(Number)
  const landing = read(`${slug}/index.md`)
  const nav = read('.vitepress/config.mts')
  if (!nav.includes(`link: '/${slug}/'`) || !nav.includes(`releaseItems('${slug}')`)) {
    errors.push(`${slug}: missing VitePress navigation or sidebar`)
  }
  for (const version of versions) {
    const base = `${slug}/${version}`
    if (minParts) {
      const parts = version.split(/[-+]/, 1)[0].split('.').map(Number)
      const firstDifference = Array.from({ length: Math.max(parts.length, minParts.length) }, (_, index) => (parts[index] ?? 0) - (minParts[index] ?? 0)).find((difference) => difference !== 0)
      if (firstDifference < 0) {
        errors.push(`${base}: below configured minimum ${minimum}`)
      }
    }
    const files = ['index.md', 'changelog.md', 'changelog.zh.md']
    for (const file of files) {
      const path = `${base}/${file}`
      if (!existsSync(resolve(root, path)) || !read(path).trim()) errors.push(`${base}: missing or empty ${file}`)
    }
    if (!files.every((file) => existsSync(resolve(root, base, file)))) continue
    const page = read(`${base}/index.md`)
    const date = page.match(/\bdate="(\d{4}-\d{2}-\d{2})"/)?.[1]
    if (!page.includes(`<ReleaseCard`) || !page.includes(`version="${version}"`) || !page.includes(`software="${display}"`) || !date || !page.includes('release-url="')) {
      errors.push(`${base}: incomplete Release Card`)
    }
    if (!landing.includes(`| ${version} |`) || (date && !landing.includes(`| ${version} | ${date} |`) && !landing.includes(`| ${version} | LTS | ${date} |`) && !landing.includes(`| ${version} | 常规 | ${date} |`))) {
      errors.push(`${base}: missing landing row or date mismatch`)
    }
  }

  if (versions.length) {
    const latest = versions[0]
    const row = new RegExp(`^(\\| ${display.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')} \\| )([^|]+)( \\| \\[查看\\]\\(\\./${slug}/\\) \\|)$`, 'm')
    if (!row.test(home)) errors.push(`${slug}: missing homepage row`)
    else if (process.argv.includes('--sync-home')) home = home.replace(row, (_, start, _old, end) => `${start}${latest}${end}`)
    else if (!home.includes(`| ${display} | ${latest} | [查看](./${slug}/) |`)) errors.push(`${slug}: homepage latest version should be ${latest}`)
  }
}

if (process.argv.includes('--sync-home') && !errors.length && home !== read(homePath)) {
  writeFileSync(resolve(root, homePath), home)
  console.log('Updated homepage latest versions')
}
if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'))
  process.exitCode = 1
} else {
  console.log(`Checked ${products.length} products and their release files`)
}
