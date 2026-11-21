<template>
  <youtube ref="youtube" :video-id="id"></youtube>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
}
</script>

<style>
iframe {
  aspect-ratio: 16 / 9;
  width: 100%;
  height: 100%;
  max-width: 720px;
  text-align: center;
}
</style>
