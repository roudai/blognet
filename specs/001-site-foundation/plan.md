# Implementation Plan: サイト基盤

**Branch**: `001-site-foundation` | **Date**: 2026-11-22 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-site-foundation/spec.md`

## Summary

blog.roudai.net の再構築の最初の機能として、共通レイアウト(ヘッダー、フッター、1/2 幅の本文)、トップページの骨組み、
GitHub Pages へのデプロイ基盤、CI 品質ゲートを、Nuxt 4 + TypeScript の静的生成で作る。
構成は、同じ運営者の roudai.net の再構築とそろえ、設定ファイル、prerender のモジュール、CI のワークフロー、CSS の土台を流用する。
CSS は Tailwind CSS(v4、Vite プラグイン)で、現行の Bulma の見た目を再現する。Buefy と AdSense のモジュールは使わない([research.md](./research.md))。

## Technical Context

**Language/Version**: TypeScript 5.9.x(`typescript@^5`、7 未満)、Node 24(LTS)

**Primary Dependencies**: Nuxt 4.6.4、Vue 3、Tailwind CSS 4.3.5(`@tailwindcss/vite`)、`@nuxt/eslint`、Prettier 3、`vue-tsc`

**Storage**: N/A

**Testing**: 自動テストは作らない(Spec で必須としていない)。品質ゲートは Lint、型チェック、`nuxt generate`、出力の検証スクリプト(`scripts/verify-output.mjs`)。見た目は、現行サイトとの実測比較(quickstart)

**Target Platform**: 静的サイト。モダンなブラウザー(モバイルとデスクトップ)。配信は GitHub Pages(`https://blog.roudai.net`)

**Project Type**: 静的 Web サイト(フロントエンドのみ。サーバーランタイムなし)

**Performance Goals**: 特別な目標はない。PR の CI は 15 分以内に結果が出る(SC-003)

**Constraints**:

- SSG のみ。サーバーランタイムを使わない(原則 I)
- `legacy/` は変更しない。ルートの Lint、整形、型チェックの対象から除外する(原則 VI)
- Web サイトに広告を含めない。`CNAME` は出力に含める(原則 III)
- デザインの刷新はしない。見た目は現行と同等(原則 IV、FR-004)

**Scale/Scope**: ページはトップの骨組みのみ。コンポーネントは3個(ヘッダー、フッター、GitHub アイコン)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| 原則 | 判定 | 根拠 |
|------|------|------|
| I. 最新の安定版 Nuxt、TypeScript、静的生成のみ | ⚠ 逸脱(正当化あり) | Nuxt は 4.6.4(`latest`)、静的生成のみ。ただし TypeScript は 5.9 に固定(7.0.2 は `vue-tsc` 3.3.14 と非互換。research.md の 3)。Complexity Tracking に記載 |
| II. URL の互換性 | ✅ 合格(この Spec では影響なし) | この Spec の出力はトップのみ。記事のパスは 002 で同じパスに移植し、切り替え時に突き合わせる |
| III. Web サイトに広告を含めない、配信用ファイルは CNAME | ✅ 合格 | AdSense モジュールを含めない。`ads.txt` はコピーしない。`CNAME` を `public/` に置き、検証スクリプトで確認する |
| IV. 機能パリティを最優先 | ✅ 合格 | 見た目と挙動を現行の Bulma に合わせる(本文 1/2 幅、1024px 未満で GitHub アイコンを隠す)。メニューの開閉などの追加はしない |
| V. CI による品質ゲート | ✅ 合格 | `ci.yml` で Lint と型チェックを実行する。pnpm と `pnpm-lock.yaml` のみ |
| VI. `legacy/` は読み取り専用 | ✅ 合格 | `legacy/` を変更せず、ESLint、Prettier の対象から除外する |
| VII. 本番デプロイは `main` からのみ | ✅ 合格 | `deploy.yml` は `main` への push のみで起動。`ci.yml` はデプロイしない |
| VIII. 依存ライブラリは spike で検証 | ✅ 合格 | Tailwind と TypeScript の版を、`nuxt dev` と `nuxt generate` で確認した。YouTube と Twitter の埋め込みは、この Spec では使わず、002 の Plan で検証する |

**事前ゲート**: 原則 I に逸脱が 1 件(TypeScript のバージョン)。**Phase 1 後の再評価**: 同じ(新たな違反なし)。

## Project Structure

### Documentation (this feature)

```text
specs/001-site-foundation/
├── plan.md              # このファイル
├── research.md          # Phase 0 の出力
├── quickstart.md        # Phase 1 の出力
├── checklists/
│   └── requirements.md  # /speckit-specify の出力
└── tasks.md             # Phase 2 の出力
```

データ(メニュー構成など)を持たないため、`data-model.md` と `contracts/` は作らない。

### Source Code (repository root)

```text
app/
├── app.vue
├── assets/css/main.css        # Tailwind の読み込み、Bulma のテーマ値、.content 相当のスタイル(roudai.net から流用)
├── components/
│   ├── AppHeader.vue          # ヘッダー(サイト名リンク、GitHub アイコン)
│   ├── AppFooter.vue          # フッター(© 2012-{年}、GitHub アイコン)
│   └── IconGithub.vue         # GitHub アイコン(roudai.net から流用)
├── data/site.ts               # GitHub アイコンのリンク先
├── layouts/default.vue        # ヘッダー + 本文(1/2 幅、中央寄せ) + フッター
└── pages/index.vue            # トップページの骨組み
public/
├── CNAME                      # blog.roudai.net
└── favicon.ico                # legacy/static/favicon.ico と同一
scripts/
├── pages.mjs                  # 出力に含まれなければならないページのパス
├── verify-output.mjs          # 出力の検証(CNAME、ads.txt の不在、広告の痕跡の不在、ページ)
└── preview.mjs                # 生成結果の静的配信(roudai.net から流用)
.github/
├── actions/setup/action.yml   # 共通のセットアップ(Node、pnpm、依存のインストール)
└── workflows/
    ├── ci.yml                 # PR と main への push 用(Lint、型チェック、generate、出力の検証、actionlint)
    └── deploy.yml             # main への push 用(generate → Pages へデプロイ)
modules/prerender-pages.ts     # 存在する静的ページだけを prerender の対象にする(roudai.net から流用)
nuxt.config.ts                 # SSG、Tailwind、prerender 設定、head(現行のタイトルと説明)
tsconfig.json / eslint.config.mjs / .prettierrc / .prettierignore / .editorconfig / .nvmrc
package.json / pnpm-lock.yaml
legacy/                        # 読み取り専用(変更しない)
```

**Structure Decision**: アプリを、リポジトリのルートに置く(Nuxt 4 の `app/` ディレクトリ構成)。roudai.net と同じ構成にする。
旧 `.github/workflows/ci.yml`(名前は `cd`)は削除し、`ci.yml` と `deploy.yml` を新しく置く。

## 実装上の留意点

- **ブレークポイント**: roudai.net と同じく、px の独自名(`tablet` 769px、`desktop` 1024px、`widescreen` 1216px、`fullhd` 1408px)を使い、Tailwind 既定の `lg` は使わない。
- **本文の幅**: `tablet` 以上で `w-1/2`、中央寄せ。最大幅は Bulma の `container` と同じく 960 / 1152 / 1344px。本文の余白は現行の `content m-2`(8px)。
- **ヘッダー**: `desktop` 未満では GitHub アイコンを含む領域を隠す(現行の `navbar-menu` と同じ)。
- **外部の設定(リポジトリの外)**: Settings > Pages の Source を「GitHub Actions」へ変更する(`main` の初回デプロイの前)。Custom domain が `blog.roudai.net` のままであることを確認する。ブランチ保護で、PR の CI を必須にする。

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| 原則 I: TypeScript を最新の安定版(7.0.2)ではなく 5.9.x に固定する | `vue-tsc` 3.3.14 が TypeScript 7 と非互換で(`ERR_PACKAGE_PATH_NOT_EXPORTED`)、`nuxt typecheck` が動かない。型チェックは原則 V の必須ゲートである(research.md の 3) | TypeScript 7 を使うと、原則 V の型チェックを満たせない |

**解除条件**: `vue-tsc` が TypeScript 7 に対応した時点で、TypeScript を 7 系へ上げ、この行を削除する。
