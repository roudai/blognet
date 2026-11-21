// `nuxt generate` の出力(.output/public)が、公開物の要件を満たしているかを確認する。
// 要件: specs/001-site-foundation/spec.md の FR-012、FR-013(原則 III)
//       specs/002-posts/spec.md の FR-001、FR-003(移植済みのページと記事の画像)
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { extname, join } from 'node:path'
import { migratedPages } from './pages.mjs'

const outputDir = '.output/public'
// Web サイトに含めてはならない、Google 広告の痕跡
const adPatterns = [/adsbygoogle/i, /googlesyndication/i, /google[-_]adsense/i, /google_ad_client/i, /pagead2/i]

const errors = []

if (!existsSync(outputDir)) {
  console.error(`${outputDir} がありません。先に pnpm generate を実行してください。`)
  process.exit(1)
}

// CNAME: 独自ドメインの維持
const cnamePath = join(outputDir, 'CNAME')
if (!existsSync(cnamePath)) {
  errors.push('CNAME がありません')
} else if (readFileSync(cnamePath, 'utf8').trim() !== 'blog.roudai.net') {
  errors.push('CNAME の内容が blog.roudai.net ではありません')
}

if (!existsSync(join(outputDir, 'favicon.ico'))) {
  errors.push('favicon.ico がありません')
}

// ads.txt: Web サイトの広告を廃止するため、含めない
if (existsSync(join(outputDir, 'ads.txt'))) {
  errors.push('ads.txt が含まれています(含めてはならない)')
}

// 移植済みのページ: すべてのパスの index.html があること(原則 II)
for (const page of migratedPages) {
  if (!existsSync(join(outputDir, page, 'index.html'))) errors.push(`${page} のページ(${page}/index.html)がありません`)
}

// 記事の画像: 移植元と同じファイル名で、内容が同一であること(Constitution の Technology & Delivery Constraints)
const imageDirs = [
  { legacy: 'legacy/assets/37', output: 'images/37', count: 10 },
  { legacy: 'legacy/assets/700', output: 'images/700', count: 8 },
]
for (const { legacy, output, count } of imageDirs) {
  const dir = join(outputDir, output)
  const files = existsSync(dir) ? readdirSync(dir) : []
  if (files.length !== count) errors.push(`${output} のファイル数が ${files.length} です(${count} のはず)`)
  // legacy/ が残っている間だけ、移植元との同一性を確認する(legacy/ は移行完了後に削除される)
  if (!existsSync(legacy)) continue
  for (const name of readdirSync(legacy)) {
    const file = join(dir, name)
    if (!existsSync(file)) errors.push(`${output}/${name} がありません`)
    else if (!readFileSync(file).equals(readFileSync(join(legacy, name)))) {
      errors.push(`${output}/${name} が ${legacy}/${name} と一致しません`)
    }
  }
}

// 広告のスクリプト、広告枠、広告用の meta タグが含まれていないこと
const textExtensions = new Set(['.html', '.js', '.mjs', '.css', '.json'])
const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })

for (const file of walk(outputDir).filter((f) => textExtensions.has(extname(f)))) {
  const text = readFileSync(file, 'utf8')
  for (const pattern of adPatterns) {
    if (pattern.test(text)) errors.push(`${file} に広告の痕跡があります(${pattern})`)
  }
}

if (errors.length > 0) {
  console.error('出力の検証に失敗しました:')
  for (const message of errors) console.error(`  - ${message}`)
  process.exit(1)
}

console.log(
  `出力の検証に成功しました(CNAME、favicon.ico、移植済みの ${migratedPages.length} ページと記事の画像があり、ads.txt と広告の痕跡がない)`,
)
