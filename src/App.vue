<script lang="ts" setup>
import MainCanvas from './components/MainCanvas/index.vue'
import ToolBar from './components/ToolBar/index.vue'</script>

<template>
  <div class="mine-page-craft">
    <n-message-provider>
      <MainCanvas/>

      <ToolBar/>
    </n-message-provider>
  </div>
</template>

<style scoped>
.mine-page-craft {
  position: relative;
  height: 100%;
  width: 100%;
  background-color: aliceblue;
  overflow: hidden;
}

.main-canvas {

}

</style>
