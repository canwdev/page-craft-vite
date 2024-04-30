<script setup lang="ts">
import MainPlayground from '@/components/PageCraft/MainPlayground/index.vue'
import {useBroadcastMessage} from '@/hooks/use-broadcast-messae'

// 初始化时同步浏览器不同窗口间的组件样式
const {channelRef} = useBroadcastMessage('PlaygroundPageStyleSync')
onMounted(() => {
  // console.log('[PlaygroundPageStyleSync] onMounted')
  channelRef.value?.postMessage(null)
})
</script>

<template>
  <MainPlayground style="height: 100%; overflow: auto" />

  <div class="mc-playground-action-wrap">
    <div class="mc-playground-action-inner vp-bg">
      <portal-target name="indicatorBarTeleportDest">
        <!--
        This component can be located anywhere in your App.
        The slot content of the above portal component will be rendered here.
        -->
      </portal-target>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mc-playground-action-wrap {
  position: sticky;
  bottom: 0px;
  left: 0;
  display: flex;
  pointer-events: none;
  justify-content: center;
}
.mc-playground-action-inner {
  pointer-events: all;
}
</style>
