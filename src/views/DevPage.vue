<script lang="ts">
import {defineComponent} from 'vue'
import FileManager from '@/components/FileManager/FileManager.vue'

export default defineComponent({
  name: 'DevPage',
  components: {FileManager},
})
</script>

<template>
  <div class="dev-page">
    <FileManager />
  </div>
</template>

<style lang="scss" scoped>
.dev-page {
  background-color: black;
  color: white;
  height: 100%;
}
</style>
