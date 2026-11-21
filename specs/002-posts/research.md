# Research: 記事ページとトップページの移植

**Feature**: `002-posts` | **Date**: 2026-11-22

spike(原則 VIII)は、`nuxt dev`(ポート 4311)と `nuxt generate` の出力(`pnpm preview`、ポート 4310)の両方で、ブラウザーで確認した。
現行の見た目は、公開中の `https://blog.roudai.net` を、幅 1280px と 500px(ブラウザーの最小幅)で実測した。

## 1. YouTube の埋め込み(vue-youtube の代替)

- **Decision**: `vue-youtube` は使わず、`app/components/YoutubeCard.vue` で、YouTube の埋め込み用 iframe(`https://www.youtube.com/embed/<ID>`)を静的な HTML として出力する。スタイルは、現行の `legacy/components/YoutubeCard.vue` と同じ(`aspect-ratio: 16 / 9`、幅 100%、最大幅 720px)。`width="640" height="360"` の属性も、現行の iframe に合わせる。
- **Rationale**:
  - `vue-youtube` は Vue 2 専用で、Vue 3 / Nuxt 4 では動かない。現行は、再生の制御(API)を使っておらず、埋め込みの表示だけなので、iframe で足りる。
  - spike の結果: dev と generate の両方で、5件の iframe が表示され、ページ内で再生できた。現行と同じ幅(617px)、高さ(347px)、位置になった。
  - 現行は、静的な HTML には空の `div` だけを出し、ブラウザーで iframe に置き換えていた。新サイトは、静的な HTML に iframe を含めるため、JavaScript の実行前から動画の枠が表示される(見た目の最終状態は同じ)。
- **スタイルの範囲**: 現行は `iframe` 全体への、スコープなしのスタイルだった(ツイートや広告の iframe にも効きうる)。新サイトでは、`YoutubeCard` のスコープ付きのスタイルにした。ツイートの iframe は、widgets.js がインラインで大きさを指定するため、表示は変わらない(実測で確認)。
- **Alternatives considered**: `vue-youtube` の Vue 3 向けの代替ライブラリ。必要な機能(埋め込みの表示)に対して過剰で、原則 VIII の検証対象が増えるため採用しない。

## 2. ツイートの埋め込み(widgets.js の読み込み)

- **Decision**: ツイートは、移植元と同じ `blockquote.twitter-tweet` を静的な HTML に置き、`app/composables/useTwitterWidgets.ts` で、マウント後に `https://platform.twitter.com/widgets.js` を読み込む。読み込み済み(サイト内の移動)の場合は `twttr.widgets.load()` で描画し直す。
- **Rationale**:
  - widgets.js は、読み込まれると `blockquote` を別の要素に置き換える。`useHead` でヘッドに置くと、Vue のハイドレーションより先に置き換わる可能性があり、描画の食い違い(hydration mismatch)の原因になる。マウント後に読み込めば、この食い違いは起きない。
  - 現行の `mounted()` は、`window.twttr` の存在を確認せずに呼んでおり、ページを直接開いたときに、読み込み前だとエラーになりうる。新サイトは、存在を確認してから呼ぶ。
  - spike の結果:
    - `/post-37` と `/post-535` を直接開いた場合、ツイートが埋め込みとして表示された(それぞれ1件、6件)。
    - トップページから `/post-535` へ、さらに戻って `/post-37` へ、再読み込みなしで移動した場合も、表示された。widgets.js の `script` 要素は1つだけだった。
    - dev で、ハイドレーションの警告は出なかった。
  - 静的な HTML には、ツイートのリンク(引用の中の `a`)が残るため、読み込みに失敗しても、リンクとしては機能する(Spec の Edge Cases)。
- **Alternatives considered**:
  - `<ClientOnly>` でツイートを囲む: 静的な HTML からツイートのリンクが消え、現行と異なるため採用しない。
  - `useHead` で読み込む(現行の `head()` と同じ): 上記の食い違いのおそれがあるため採用しない。

## 3. Bulma のクラスの再現

記事のテンプレートで使われている Bulma 0.9 のクラスを、`app/assets/css/main.css` に同じ値で再現した(001 の土台に追加)。

| クラス | 使われ方 | 再現した値 |
|--------|----------|------------|
| `title`、`subtitle` | 記事のタイトルと、投稿日・最終修正日 | `title`: 2rem、600、`#363636`、行の高さ 1.125。`subtitle`: 1.25rem、400、`#4a4a4a`、1.25。`title + subtitle` の上の余白 -1.25rem、`:not(:last-child)` の下の余白 1.5rem |
| `columns` | 画像の行(`columns ml-0 mr-0`) | 769px 以上で flex、上下左右の負の余白(左右は `ml-0`、`mr-0` で打ち消す) |
| `column`、`is-8`、`is-offset-2` | `ImageCard` の画像、ツイートの枠 | 余白 0.75rem、769px 以上で幅 66.667%、左の余白 16.667% |
| `box` | 解法の手順の枠 | 角丸 6px、影、余白 1.25rem |

- 実測の結果(幅 1280px、`/post-37`): タイトル(32px、高さ 72px)、副題(20px、上の余白 -20px)、画像10枚の幅と高さ、動画5件、ツイート1件の大きさと横の位置が、現行と一致した。縦の位置の差は、現行に差し込まれている自動広告(合計約 2,300px)の分だけだった。
- 実測の結果(幅 500px、`/post-700`): 写真8枚の幅と高さが、現行と一致した。
- `strong` は Bulma の色と太さ(001 の `.content`)、`b` はブラウザーの既定(太字)で、現行と同じ。

## 4. 段落の中のブロック要素

- **Decision**: 移植元で、段落(`p`)の中に `div` を置いている2か所(`/post-37` の OLL と PLL の一覧の画像)は、ブラウザーが実際に表示している構造(段落、`div`、空の段落)に書き直す。
- **Rationale**: HTML では、`p` の中に `div` を置けず、ブラウザーは段落を閉じて `div` を外に出し、閉じタグの位置に空の段落を作る。Vue 3 のハイドレーションは、この構造の変化を食い違いとして扱うため、元の書き方のままでは表示が崩れるおそれがある。現行のブラウザー上の構造(実測)に合わせることで、見た目と余白を同じにした。
- 段落の中の `YoutubeCard`(iframe はインライン要素)は、`p` の中に置いてよいため、そのままにした。現行も、最終的に iframe が段落の中にある(実測)。

## 5. 画像

- **Decision**: `legacy/assets/37/` と `legacy/assets/700/` の webp を、同じファイル名で `public/images/37/`、`public/images/700/` にコピーし、`/images/<記事番号>/<名前>.webp` で参照する。`ImageCard` は、`require()` の代わりにこの URL を組み立てる。
- **Rationale**: Constitution の Technology & Delivery Constraints。現行の URL(`/_nuxt/img/<名前>.<ハッシュ>.webp`)は、ビルドごとに変わるため、引き継がない。パリティの確認は、中身のハッシュで行う。

## 6. 誤字の確認

- `legacy/pages/` の全ページを読み、明らかな誤字を4件直し、判断が必要なもの5件を候補として、spec.md に記録した。
- 候補5件は、2026-11-22 に運営者に1件ずつ確認し、すべて直した(GitHub のリンク先、Square-1 のリンク先、最少手数競技中の不正の大会名と日付、VLS のサイト名、括弧)。リンク先と大会の情報は、WCA のアーカイブと大会情報で確認した。
- 修正した表記が、公開中のサイトの静的な HTML に実際にあることを、取得して確認した(パリティの確認スクリプトも、記録した現行の表記が見つからない場合はエラーにする)。
