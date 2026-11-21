# Research: サイト基盤

**Feature**: `001-site-foundation` | **Date**: 2026-11-22

Plan の Technical Context で未確定だった項目を調べた結果をまとめる。
同じ運営者の roudai.net の再構築(`roudai/roudainet` の `specs/001-site-foundation/research.md`)で検証済みの構成を基本とし、
blognet で変わる点と、最新版で変わった点だけを、spike(原則 VIII)で確認した。spike は `nuxt dev` と `nuxt generate` の両方で行った。

## 1. フレームワークとバージョン

- **Decision**: Nuxt `4.6.4`(2026-11-22 時点の `latest`)、Vue 3、静的生成のみ(`nuxt generate`)。Node 24(`.nvmrc` は `24`、`engines.node` は `^24.15.0`)。
- **Rationale**: 原則 I(最新の安定版、SSG のみ)。roudai.net で採用した 4.6.3 からパッチ版が上がっていたため、最新に合わせた。spike で `nuxt generate` が成功し、`.output/public` に静的ファイルが出力されることを確認した。
- **Alternatives considered**: roudai.net と同じ 4.6.3 に固定する。原則 I(最新の安定版)に反するため採用しない。

## 2. CSS: Buefy の代替

- **Decision**: Tailwind CSS `4.3.5` を、Vite プラグイン(`@tailwindcss/vite`)経由で使う。UI コンポーネントライブラリは使わない。`app/assets/css/main.css` は、roudai.net の同名ファイルのうち、テーマ(Bulma のフォント、ブレークポイント、色)と `.content` の定義を流用する。
- **Rationale**: Buefy は Vue 2 向けで、Vue 3 / Nuxt 4 では動かない。roudai.net で、Tailwind が `nuxt dev` と `nuxt generate` の両方で動くこと、Bulma の見た目を再現できることを確認済み。blognet も同じ Buefy(Bulma 0.9)の見た目なので、同じ値をそのまま使える。
- **Alternatives considered**: Bulma の CSS だけを導入する。roudai.net と構成が分かれ、保守の手間が増えるため採用しない。
- **パリティに関わる調査結果**(公開中の `https://blog.roudai.net` の実測。幅 1280px と 700px):
  - **本文の幅**: 現行レイアウトは `columns` + `container column is-half` で、769px 以上ではビューポートの 1/2 幅、`container` の `margin: 0 auto` により中央寄せ。最大幅は 1024px 以上で 960px、1216px 以上で 1152px、1408px 以上で 1344px(幅の 1/2 が常に小さいため、実際には効かない)。768px 以下では全幅。
  - **ヘッダー**: `navbar is-dark p-2`。背景 `#363636`、高さ 68px、サイト名リンクの余白 `8px 12px`。
  - **GitHub アイコン**: 現行にはバーガーボタンがなく、1024px 未満では `navbar-menu` が隠れるため、GitHub アイコンは表示されない(幅 700px で実測)。パリティのため、同じ挙動にする。
  - **フッター**: 背景 `#fafafa`、余白 `48px 24px 96px`、中央寄せ。
  - 新サイト(プレビュー)を同じ幅で実測し、ヘッダーの高さ、色、余白、本文とフッターの位置が一致することを確認した(差はスクロールバーの有無による数 px のみ)。

## 3. TypeScript と型チェック(spike 結果)

- **Decision**: TypeScript は `5.9.x` に固定し(`^5`)、型チェックは `nuxt typecheck`(`vue-tsc`)で行う。ルートに、`.nuxt/tsconfig.*.json` を参照する `tsconfig.json` を置く(roudai.net と同じ)。
- **Rationale**: spike で、`typescript@7.0.2`(`latest`)と `vue-tsc@3.3.14`(`latest`)の組み合わせでも、`ERR_PACKAGE_PATH_NOT_EXPORTED`(`./lib/tsc`)で型チェックが動かないことを確認した。roudai.net の時点(`vue-tsc@3.3.13`)から状況は変わっていない。
- **Alternatives considered**: TypeScript 7 の `tsgo` 系。Vue の SFC に未対応のため採用しない。

## 4. 静的生成と prerender

- **Decision**: `nitro.prerender.crawlLinks` を `false` にし、存在する静的ページのパスを、ローカルモジュール `modules/prerender-pages.ts`(roudai.net と同一)で集めて `routes` へ渡す。
- **Rationale**: 構成を roudai.net とそろえる。blognet のページはすべて静的なパス(`/`、`/post-<番号>`)で、動的なルートはないため、このモジュールで全ページが出力される。記事の移植前に、トップページから未移植の記事へリンクしても、generate が 404 で失敗しない。
- **Alternatives considered**: `crawlLinks: true`。未移植のページへのリンクがあると generate が失敗するため採用しない。

## 5. Lint と整形

- **Decision**: `@nuxt/eslint`(`1.17.0`)、ESLint 10、Prettier 3、`eslint-config-prettier`。設定ファイル(`eslint.config.mjs`、`.prettierrc`、`.prettierignore`、`.editorconfig`)は roudai.net のものを流用する。`.prettierrc` は現行の `legacy/.prettierrc` と同じ値。
- **Rationale**: 原則 V。`legacy/`、`specs/`、`.specify/`、`.claude/` は検査対象から除外する(原則 VI)。`.prettierignore` からは、blognet にない `public/app-ads.txt` を外した。

## 6. パッケージマネージャー

- **Decision**: `pnpm`(`10.33.2`)。`package.json` の `packageManager` で固定し、ロックファイルは `pnpm-lock.yaml` のみとする。`legacy/yarn.lock` は引き継がない。
- **Rationale**: 原則 V。roudai.net と同じ。

## 7. デプロイと CI

- **Decision**: roudai.net の `.github/actions/setup/action.yml`、`.github/workflows/ci.yml`、`.github/workflows/deploy.yml` を流用する(GitHub Actions の Pages デプロイ方式)。
  - `ci.yml`: `main` と `nuxt4-rebuild` 宛ての PR と、`main` への push で、Lint、型チェック、generate、出力の検証、actionlint を実行する。デプロイしない。
  - `deploy.yml`: `main` への push のみで、generate、出力の検証のあと、Pages へデプロイする。
- **Rationale**: 原則 VII。現行の `peaceiris/actions-gh-pages`(Node 16、yarn、`gh-pages` ブランチへの push)は、`legacy/` への移動後は動かない。移動の前に、現行のワークフローのトリガーを `main` への push のみに限定し、作業ブランチの push で本番が上書きされないようにした。
- **重要な外部設定(リポジトリの外)**:
  - Settings > Pages の Source を、「Deploy from a branch(`gh-pages`)」から「GitHub Actions」へ切り替える(`main` の初回デプロイの直前)。
  - Custom domain が `blog.roudai.net` のままであることを確認する。
  - ブランチ保護で、`main` と `nuxt4-rebuild` への PR の CI を必須にする。

## 8. 公開物のルートファイル

- **Decision**: `public/CNAME`(`legacy/static/CNAME` と同一、内容 `blog.roudai.net`)と `public/favicon.ico`(`legacy/static/favicon.ico` と同一)を置く。`legacy/static/ads.txt` はコピーしない。
- **Rationale**: 原則 III。現行の `ads.txt` と `@nuxtjs/google-adsense`(`pageLevelAds`)は廃止する。公開中のサイトでは `pagead2.googlesyndication.com` のスクリプトが読み込まれていることを確認した。
- **出力の検証**: `scripts/verify-output.mjs`(roudai.net のものから `app-ads.txt` と解法画像の確認を除いたもの)で、`CNAME` の内容、`favicon.ico` の存在、`ads.txt` の不在、広告の痕跡の不在、移植済みページ(`scripts/pages.mjs`)の存在を確認する。

## 9. ヘッダーとフッターの内容

- **Decision**: 現行の `legacy/components/NavBar.vue` と `FooterBar.vue` の内容を再現する。
  - ヘッダー: サイト名「ブログ版ろーだいねっと アーカイブ」(`/` へのリンク)、GitHub アイコン(白、`https://github.com/roudai/roudai.net`)。サイト名は、現行と同じく通常のリンク(`<a href="/">`)にする。
  - フッター: 「© 2012-{年} roudai.net」と GitHub アイコン(黒、同じ URL)。年はビルド時の年で描画し、マウント後に現在の年へ更新する(roudai.net と同じ)。
- **補足**: GitHub アイコンのリンク先 `https://github.com/roudai/roudai.net` は、2026-11-22 の確認で 404 を返す(リポジトリ名の変更による。転送されない)。原則 IV の例外(古くなった情報の更新)は、運営者の明示的な指示が必要なため、この Spec では変更せず、更新の候補として運営者に確認する。リンク先は `app/data/site.ts` の1か所にまとめ、更新時の変更を1行にする。
- 現行の `NavBar.vue` にある `menuShow`(メニューの開閉)は、呼び出す要素がなく使われていないため、移植しない。
