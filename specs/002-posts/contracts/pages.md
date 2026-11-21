# Contract: 記事ページとトップページ

**Feature**: `002-posts`

## 出力するページ

`scripts/pages.mjs` の `migratedPages` が、出力に含まれなければならないページの一覧である。`pnpm verify` が、各パスの `index.html` の存在を確認する。

| パス | 移植元 | 画像 | YouTube | ツイート |
|------|--------|------|---------|----------|
| `/` | `legacy/pages/index.vue` | 0 | 0 | 0 |
| `/post-37` | `legacy/pages/post-37.vue` | 10(`/images/37/`) | 5 | 1 |
| `/post-386` | `legacy/pages/post-386.vue` | 0 | 2 | 0 |
| `/post-388` | `legacy/pages/post-388.vue` | 0 | 2 | 0 |
| `/post-535` | `legacy/pages/post-535.vue` | 0 | 0 | 6 |
| `/post-700` | `legacy/pages/post-700.vue` | 8(`/images/700/`) | 0 | 0 |

## 記事の画像

- `legacy/assets/37/*.webp`(10枚)と `legacy/assets/700/*.webp`(8枚)を、同じファイル名で `public/images/37/` と `public/images/700/` に置く。
- `pnpm verify` が、ファイル数と、移植元とのバイト単位の同一性を確認する(`legacy/` がある間)。

## パリティの確認

`pnpm generate` の後に `pnpm verify:parity [パス...]`(パスを省くと全ページ)を実行する。本番サイト(`https://blog.roudai.net`)の取得が必要なため、CI では実行しない。

- 比べる範囲: レイアウトの本文の領域(class に `content` と `m-2` を持つ最初の `div`)。
- 比べる値:
  - 本文のテキスト(タグを除き、空白をまとめたもの)
  - リンク先(`href`)の並び。ツイートの埋め込みは、引用の中のリンクとして比べる
  - 画像の中身(SHA-256)の並び。現行はハッシュ付きの URL か data URI、新サイトは `/images/` のファイル
  - YouTube の動画の ID の並び。現行の静的な HTML には含まれないため、移植元のテンプレート(`<youtube-card id>`)と比べる
- spec.md の「現行の表記から直した箇所」の表のうち、理由に「候補」とない行は、現行の表記を修正後の表記に置き換えてから比べる。
