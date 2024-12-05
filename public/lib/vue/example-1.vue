<script lang="ts" setup>
const {ref} = 'vue'
const message = ref<string>('Hello Vue')
</script>

<template>
  <div class="hello-world">
    <div class="title">{{ message }}</div>
  </div>
</template>

<style lang="scss" scoped>
.hello-world {
  .title {
    font-weight: bold;
    color: #009688;
    font-size: 100px;
  }
}
</style>
