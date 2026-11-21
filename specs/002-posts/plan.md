# Implementation Plan: 記事ページとトップページの移植

**Branch**: `002-posts` | **Date**: 2026-11-22 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-posts/spec.md`

## Summary

現行の記事5件とトップページを、001 のサイト基盤の上に移植する。記事は、移植元の `.vue` テンプレートの HTML をそのまま使い(Markdown 化はしない)、
埋め込みの部品だけを Vue 3 向けに置き換える。YouTube は iframe を直接置く `YoutubeCard`、ツイートはマウント後に widgets.js を読み込む `useTwitterWidgets`、
画像は `public/images/` の固定の URL を使う `ImageCard` にした。Bulma のクラス(`title`、`subtitle`、`columns`、`column`、`box`)は、001 の CSS に同じ値で追加する([research.md](./research.md))。
本番との一致は、パリティの確認スクリプト(`scripts/verify-parity.mjs`)で確認する([contracts/pages.md](./contracts/pages.md))。

## Technical Context

**Language/Version**: TypeScript 5.9.x、Node 24(001 と同じ)

**Primary Dependencies**: Nuxt 4.6.4、Tailwind CSS 4.3.5(追加の依存なし)。外部の埋め込み: YouTube(iframe)、X / Twitter(`widgets.js`)

**Storage**: N/A

**Testing**: 自動テストは作らない。品質ゲートは Lint、型チェック、generate、`pnpm verify`(ページと画像)。本番との比較は `pnpm verify:parity`(手動)と、ブラウザーでの実測

**Target Platform**: 001 と同じ

**Project Type**: 静的 Web サイト

**Performance Goals**: 特別な目標はない

**Constraints**: 原則 II(同じパス)、III(広告なし)、IV(パリティ、誤字の修正は記録)、VI(`legacy/` を変更しない)、VIII(埋め込みの spike)

**Scale/Scope**: 6ページ、画像18枚、YouTube 9件、ツイート7件

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| 原則 | 判定 | 根拠 |
|------|------|------|
| I. 最新の安定版 Nuxt、TypeScript、静的生成のみ | ⚠ 001 と同じ逸脱 | TypeScript 5.9 の固定(001 の Complexity Tracking)。この Spec で新たな逸脱はない |
| II. URL の互換性 | ✅ 合格 | 6ページを現行と同じパスで出力する。`pnpm verify` で確認する |
| III. Web サイトに広告を含めない | ✅ 合格 | 広告の部品を移植しない。`pnpm verify` で広告の痕跡がないことを確認する |
| IV. 機能パリティを最優先 | ✅ 合格 | 本文はテンプレートをそのまま移植し、パリティの確認スクリプトで本番と比べる。誤字の修正は spec.md に記録した。Markdown 化、ページタイトル、OGP などは行わない |
| V. CI による品質ゲート | ✅ 合格 | 001 の CI のまま |
| VI. `legacy/` は読み取り専用 | ✅ 合格 | 画像はコピーして使い、`legacy/` は変更しない |
| VII. 本番デプロイは `main` からのみ | ✅ 合格 | 変更なし |
| VIII. 依存ライブラリは spike で検証 | ✅ 合格 | `vue-youtube` の代替(iframe)と widgets.js の読み込みを、dev と generate の両方で検証した(research.md の 1、2) |

**Phase 1 後の再評価**: 同じ(新たな違反なし)。

## Project Structure

### Documentation (this feature)

```text
specs/002-posts/
├── plan.md
├── research.md
├── quickstart.md
├── contracts/pages.md   # 出力するページ、画像、パリティの確認の契約
├── checklists/requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
app/
├── assets/css/main.css            # Bulma の title、subtitle、columns、column、box を追加
├── components/
│   ├── ImageCard.vue              # 画像(/images/<名前>.webp)の行
│   └── YoutubeCard.vue            # YouTube の埋め込み(iframe)
├── composables/useTwitterWidgets.ts  # マウント後に widgets.js を読み込む
└── pages/
    ├── index.vue                  # 記事一覧(骨組みを置き換え)
    └── post-37.vue … post-700.vue # 記事5件
public/images/37/、public/images/700/   # legacy/assets/ からコピー
scripts/
├── pages.mjs                      # 記事5件を追加
├── verify-output.mjs              # 記事の画像の確認を追加
└── verify-parity.mjs              # 本番との比較(roudai.net のものを blognet 向けに変更)
package.json                       # verify:parity を追加
```

**Structure Decision**: 記事は `app/pages/post-<番号>.vue` の静的なページとし、現行と同じパスにする。動的なルート(`[slug]`)にはしない(Markdown 化と同じく、パリティの後の別の Spec で扱う)。

## Complexity Tracking

001 の TypeScript の固定以外に、正当化が必要な逸脱はない。
