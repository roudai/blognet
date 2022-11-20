<template>
  <div>
    <h1 class="title">ルービックキューブを色々な解法で解いてみる</h1>
    <p class="subtitle">記事投稿日 : 2017年9月11日<br />最終修正日 : 2022年11月21日</p>
    <p>
      ルービックキューブを解くと言っても実は色々な解法があります。自分が知っている限りの解法については下のページにまとめてたりしますが、とりあえず現状自分ができる解法について動画を撮ってみました。
      その解法に精通してる人から見れば（特にRouxとか）どへたですが、形くらいはなんとかなってるんじゃないかと思います。
    </p>
    <p>
      YouTubeに上げるほどのものでもないので、すべてツイッターです。ちなみに実はすべて同じスクランブル（崩し方）で始めています。
    </p>
    <p>
      <a href="https://roudai.net/other/3x3x3-method/">ルービックキューブ各種解法</a>
    </p>

    <h2>CFOPメソッド</h2>
    <p>最もスタンダードな解法です。普通にやりたいなら絶対にこの方法を勉強しましょう。</p>
    <div class="column is-8 is-offset-2">
      <blockquote class="twitter-tweet">
        <a href="https://twitter.com/roudainet/status/906880653093826561?ref_src=twsrc%5Etfw"></a>
      </blockquote>
    </div>

    <h2>ZZメソッド</h2>
    <p>
      最初にエッジの向きを揃えます。持ち替えが全くなく、また最初の2層が終わった時点でエッジ向きが合っているのでCOLLとかZBLLとかがやりやすくなります。
    </p>
    <div class="column is-8 is-offset-2">
      <blockquote class="twitter-tweet">
        <a href="https://twitter.com/roudainet/status/906881568806920192?ref_src=twsrc%5Etfw"></a>
      </blockquote>
    </div>

    <h2>Rouxメソッド</h2>
    <p>
      最初に左右のブロックを揃え、最後に真ん中の層を動かしまくる解法です。持ち替えがない、というのもありますが、何より解いてるときの見た目が一番かっこいいです。
    </p>
    <div class="column is-8 is-offset-2">
      <blockquote class="twitter-tweet">
        <a href="https://twitter.com/roudainet/status/906882296422084613?ref_src=twsrc%5Etfw"></a>
      </blockquote>
    </div>

    <h2>Petrusメソッド</h2>
    <p>
      2x2x2→2x2x3 とブロックを作ったあとに、エッジの向きを揃えます。1982年の世界大会でLars
      Petrusが使っていたと言われ、とても歴史の長い解法です。ちゃんとやれば手数が短くすむので昔の回しにくいキューブでは有利だったようです。
    </p>
    <div class="column is-8 is-offset-2">
      <blockquote class="twitter-tweet">
        <a href="https://twitter.com/roudainet/status/906882756633694208?ref_src=twsrc%5Etfw"></a>
      </blockquote>
    </div>

    <h2>Ortegaメソッド</h2>
    <p>
      コーナーから揃える古典的な解法です。コーナーファーストなやり方は比較的分かりやすく、自力で解法を編み出す場合一番思いつきやすいかもしれません。
    </p>
    <div class="column is-8 is-offset-2">
      <blockquote class="twitter-tweet">
        <a href="https://twitter.com/roudainet/status/907217777269776384?ref_src=twsrc%5Etfw"></a>
      </blockquote>
    </div>

    <h2>8355メソッド</h2>
    <p>
      後半、Sexy
      Move（セクシームーブ）と呼ばれる動きを多用して解くやりかたです。セクシーです（嘘）。初心者でも考えながら実行できるため、
      やってみると案外おもしろいかもしれません。タイムを狙う解法ではありません。
    </p>
    <div class="column is-8 is-offset-2">
      <blockquote class="twitter-tweet">
        <a href="https://twitter.com/roudainet/status/907218616411500544?ref_src=twsrc%5Etfw"></a>
      </blockquote>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      script: [
        {
          type: 'text/javascript',
          async: true,
          src: 'https://platform.twitter.com/widgets.js',
        },
      ],
    }
  },
  mounted() {
    window.twttr.widgets.load()
  },
}
</script>
