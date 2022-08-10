<script lang="ts" setup>
import MainCanvas from './components/MainCanvas/index.vue'
import ToolBar from './components/ToolBar/index.vue'</script>

<template>
  <div class="page-craft-root">
    <n-message-provider>
      <MainCanvas/>

      <ToolBar/>
    </n-message-provider>
  </div>
</template>

<style scoped>
.page-craft-root {
  position: relative;
  height: 100%;
  width: 100%;
  background-color: aliceblue;
  overflow: hidden;
}

.page-craft-main-canvas {

}

</style>
