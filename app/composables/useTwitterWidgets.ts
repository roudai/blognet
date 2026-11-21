// ツイートの埋め込み(blockquote.twitter-tweet)を、Twitter の widgets.js で表示する。
// 移植元: legacy/pages/post-37.vue、post-535.vue の head() と mounted()
//
// widgets.js は、読み込まれると blockquote を埋め込みの要素に置き換える。
// ハイドレーションの前に置き換わると、Vue の描画と食い違うため、スクリプトはマウント後に読み込む
// (specs/002-posts/research.md の 2)。読み込み済み(サイト内の移動)の場合は、widgets.load() で描画し直す。
const src = 'https://platform.twitter.com/widgets.js'

type Twttr = { widgets?: { load: (element?: HTMLElement) => void } }

export function useTwitterWidgets() {
  onMounted(() => {
    const twttr = (window as unknown as { twttr?: Twttr }).twttr
    if (twttr?.widgets) {
      twttr.widgets.load()
      return
    }
    // 読み込み中(別のページで追加済み)なら、読み込み後の自動の描画に任せる
    if (document.querySelector(`script[src="${src}"]`)) return
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.charset = 'utf-8'
    document.head.appendChild(script)
  })
}
