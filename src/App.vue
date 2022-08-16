<script lang="ts" setup>
import MainCanvas from './components/MainCanvas/index.vue'
</script>

<template>
  <div class="page-craft-root">
    <n-message-provider>
      <MainCanvas/>
    </n-message-provider>
  </div>
</template>

<style scoped>
.page-craft-root {
  position: relative;
  height: 100%;
  width: 100%;
  background-color: white;
  /*background-image: url("https://api.dujin.org/bing/1920.php");*/
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  overflow: hidden;
}

.page-craft-main-canvas {

}

</style>
