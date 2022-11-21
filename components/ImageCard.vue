<template>
  <div class="columns ml-0 mr-0">
    <img :src="imagePath()" class="column is-8 is-offset-2" />
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  methods: {
    imagePath() {
      return require(`@/assets/${this.name}.webp`)
    },
  },
}
</script>
