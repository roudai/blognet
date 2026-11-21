# Quickstart: サイト基盤

**Feature**: `001-site-foundation`

## 前提

- Node 24(`.nvmrc`)と pnpm 10(`package.json` の `packageManager`)

## 手順

```sh
pnpm install          # postinstall で nuxt prepare が走る
pnpm dev              # 開発サーバー(http://localhost:3000)
pnpm lint             # ESLint と Prettier
pnpm typecheck        # vue-tsc による型チェック
pnpm generate         # 静的生成(.output/public)
pnpm verify           # 出力の検証(CNAME、ads.txt と広告の痕跡の不在、ページ)
pnpm preview          # .output/public を GitHub Pages に近い挙動で配信(既定はポート 3000)
```

## 確認(Spec の受け入れシナリオ)

1. **US1(ヘッダーとフッター)**: `pnpm preview` で `/` を開き、幅 1280px と 700px で、公開中の `https://blog.roudai.net/` と比べる。
   - 1280px: ヘッダー(背景 `#363636`、高さ 68px)、サイト名リンク、右端の白い GitHub アイコンが表示される。本文とヘッダーは画面の 1/2 幅で中央にある。
   - 700px: 全幅になり、GitHub アイコンは表示されない(現行と同じ)。
   - フッターに「© 2012-{年} roudai.net」と黒い GitHub アイコンが表示される。
2. **US2(CI とデプロイ)**: `nuxt4-rebuild` 宛ての PR で、`ci.yml` の `check` と `actionlint` が実行され、`deploy.yml` は実行されないことを確認する。
3. **US3(公開物)**: `pnpm generate && pnpm verify` が成功する。`.output/public/CNAME` が `blog.roudai.net`、`.output/public/ads.txt` が存在しない。
4. **US4(トップの骨組み)**: `/` がエラーなく表示される。

## 実施結果(2026-11-22)

- `pnpm lint`、`pnpm typecheck`、`pnpm generate`、`pnpm verify` がすべて成功した。
- US1 は、幅 1280px と 700px で、公開中のサイトと新サイトのヘッダー、本文、フッターの位置、大きさ、色を実測し、一致を確認した(差はスクロールバーの有無による数 px のみ)。
