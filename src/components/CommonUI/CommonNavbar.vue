<script lang="ts" setup="">
import {useRoute} from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="vp-bg common-navbar-wrap">
    <el-page-header @back="$router.push({name: 'HomePage'})">
      <template #content>
        <div class="flex-row-center-gap">
          <el-avatar
            :size="32"
            shape="square"
            v-if="route.meta?.icon"
            :src="route.meta.icon"
            style="background: none"
          />
          {{ route.meta?.title }}
        </div>
      </template>

      <template #extra>
        <slot name="extra"></slot>
      </template>
    </el-page-header>
  </div>
</template>

<style lang="scss" scoped>
.common-navbar-wrap {
  border-radius: 0;
  padding: 8px 10px;
  user-select: none;
  border-bottom: 1px solid $color_border;
  :deep(.el-page-header__back) {
    &:hover {
      color: $primary;
    }
  }
}
</style>
