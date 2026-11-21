# blognet

[blog.roudai.net](https://blog.roudai.net)(ブログ版ろーだいねっと)のソースです。ルービックキューブに関する記事のアーカイブで、GitHub Pages で公開しています。

## 技術構成

- [Nuxt](https://nuxt.com) 4、Vue 3、TypeScript、静的生成(SSG)のみ。サーバーランタイムは使いません
- [Tailwind CSS](https://tailwindcss.com) 4(旧サイトの Bulma の見た目を再現しています)
- YouTube の動画は iframe、ツイートは X / Twitter の `widgets.js` で埋め込みます
- パッケージマネージャーは pnpm(`package.json` の `packageManager` で固定)、Node は `.nvmrc` のバージョン。ロックファイルは `pnpm-lock.yaml` のみです

## 開発

```bash
corepack enable
pnpm install --frozen-lockfile

pnpm dev            # 開発サーバー(http://localhost:3000)
pnpm lint           # ESLint と Prettier の確認
pnpm typecheck      # 型チェック
pnpm generate       # 静的生成(出力は .output/public)
pnpm preview        # 生成結果の確認(http://localhost:3000、ポートは引数で変更可)
pnpm verify         # 生成結果の検証(必要なページとファイル、広告の痕跡がないこと)
pnpm verify:parity  # 本番との本文の比較(ネットワークが必要。CI では実行しない)
```

## ディレクトリ構成

```text
app/
├── pages/            # ページ。ファイルの配置が URL のパスになる(記事は post-<番号>.vue)
├── components/       # ヘッダー、フッター、画像(ImageCard)、YouTube の埋め込み(YoutubeCard)
├── composables/      # ツイートの埋め込み(useTwitterWidgets)
├── data/             # GitHub のリンク先など
└── assets/css/       # スタイル
public/               # そのまま配信するファイル(CNAME、favicon.ico、記事の画像)
modules/              # 全ページを静的生成の対象にするモジュール
scripts/              # preview と検証のスクリプト。pages.mjs に配信するページの一覧がある
specs/                # 機能ごとの仕様、計画、タスク(Spec Kit)
```

ページを追加したときは、`scripts/pages.mjs` の一覧にもパスを追加してください。`pnpm verify` が、一覧のページが出力されていることを確認します。

旧 Nuxt 2 のソースは、タグ `v1-nuxt2` で参照できます。

## 運用ルール

開発の原則は [`.specify/memory/constitution.md`](.specify/memory/constitution.md) にあります。主なものは次のとおりです。

- **`main` へ push すると、本番に公開されます**(`.github/workflows/deploy.yml`)。公開の前に、手元で `pnpm lint`、`pnpm typecheck`、`pnpm generate`、`pnpm verify` を実行してください。
- **CI**(`.github/workflows/ci.yml`)は、PR と `main` への push で、Lint、型チェック、静的生成、出力の検証、ワークフローの構文検査を行います。CI は公開を止めないため、`main` への push の後は、CI の結果も確認してください。
- **広告は載せません。** `pnpm verify` が、広告の痕跡がないことを確認します。

## 公開と GitHub の設定

- GitHub Pages の配信元は「GitHub Actions」、独自ドメインは `blog.roudai.net` です。独自ドメインは Settings > Pages の設定で決まります(出力の `CNAME` は、Actions 方式では使われませんが、念のため配信しています)。
- `github-pages` 環境は、`main` からのデプロイを許可しています。
