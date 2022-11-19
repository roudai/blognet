<template>
  <div class="column is-8 is-offset-2">
    <youtube :video-id="id" class="youtube"></youtube>
  </div>
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
.youtube {
  width: 100%;
  max-width: 640px;
  margin: 1rem;
}
</style>
