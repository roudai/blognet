<!--
  移植元: legacy/components/YoutubeCard.vue(vue-youtube)
  vue-youtube は Vue 2 専用のため、YouTube の埋め込み用 iframe を直接置く(specs/002-posts/research.md の 1)。
  大きさは現行と同じ(本文の幅、16:9、最大幅 720px)。現行の iframe の width と height の属性(640x360)も合わせる
-->
<script setup lang="ts">
defineProps<{ id: string }>()
</script>

<template>
  <iframe
    :src="`https://www.youtube.com/embed/${id}`"
    width="640"
    height="360"
    title="YouTube video player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
  />
</template>

<style scoped>
iframe {
  aspect-ratio: 16 / 9;
  width: 100%;
  height: 100%;
  max-width: 720px;
  text-align: center;
}
</style>
