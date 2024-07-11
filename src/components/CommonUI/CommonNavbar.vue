<script lang="ts" setup="">
import {useRoute} from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="vp-bg common-navbar-wrap">
    <n-page-header subtitle="" @back="$router.push({name: 'HomePage'})">
      <template #title> {{ route.meta?.title }} </template>
      <template #avatar>
        <slot name="avatar">
          <n-avatar v-if="route.meta?.icon" :src="route.meta.icon" style="background: none" />
        </slot>
      </template>
      <template #extra>
        <slot name="extra"></slot>
      </template>
    </n-page-header>
  </div>
</template>

<style lang="scss" scoped>
.common-navbar-wrap {
  border-radius: 0;
  padding: 8px 10px;
  user-select: none;
  border-bottom: 1px solid $color_border;
}
</style>
