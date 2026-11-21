<!--
  移植元: legacy/components/ImageCard.vue
  画像は public/images/ の固定の URL から配信する(Constitution の Technology & Delivery Constraints)
-->
<script setup lang="ts">
defineProps<{ name: string }>()
</script>

<template>
  <div class="columns ml-0 mr-0">
    <img :src="`/images/${name}.webp`" class="column is-8 is-offset-2" />
  </div>
</template>
