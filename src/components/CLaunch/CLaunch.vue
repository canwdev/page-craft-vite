<script setup lang="ts">
import TabLayout from '@/components/CanUI/packages/Layouts/TabLayout.vue'
import {QuickOptionItem} from '@/components/CanUI/packages/QuickOptions/enum'
import {useStorage} from '@vueuse/core'
import {LS_SettingsKey} from '@/enum/settings'

const props = withDefaults(
  defineProps<{
    items: QuickOptionItem[]
  }>(),
  {},
)
const currentTab = useStorage(LS_SettingsKey.C_LAUNCH_CURRENT_TAB, '')
onMounted(() => {
  if (!currentTab.value) {
    currentTab.value = props.items[0]?.value
  }
})
const currentContents = computed(() => {
  return props.items.find((item) => item.value === currentTab.value)
})
</script>

<template>
  <div class="c-launch">
    <TabLayout v-model="currentTab" horizontal :options="items">
      <div class="c-launch-content" v-if="currentContents?.children">
        <div
          class="c-launch-item"
          v-for="(item, index) in currentContents.children"
          :key="index"
          v-bind="item.props"
          :title="item.label"
        >
          <div class="icon-wrapper">
            <span class="item-icon" :class="item.iconClass" v-if="item.iconClass"></span>
          </div>
          <div class="item-label-wrapper">
            <div class="item-label">
              {{ item.label }}
            </div>
          </div>
        </div>
      </div>
      <slot :value="currentTab"></slot>
    </TabLayout>
  </div>
</template>

<style scoped lang="scss">
.c-launch {
  height: 100%;
  .c-launch-content {
    padding: 8px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    grid-template-rows: auto;
    gap: 8px;
  }
  .c-launch-item {
    outline: 1px solid $color_border;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    user-select: none;
    aspect-ratio: 1;
    border-radius: 4px;
    transition: all 0.2s;
    &:hover {
      background-color: $color_hover;
      outline-color: $primary;
      transition: all 0.1s;
    }

    &:active {
      background-color: $primary;
      color: white;
      outline-color: $primary;
      .icon-wrapper {
        .item-icon {
          color: white;
        }
      }
    }

    .icon-wrapper {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
      .item-icon {
        font-size: 48px;
        color: $primary;
        line-height: 1;
        transform: translateY(2px);
      }
    }
    .item-label-wrapper {
      box-sizing: border-box;
      padding: 4px 1px;
      width: 100%;

      .item-label {
        font-size: 14px;
        line-height: 1.2;
        // 换行2行省略
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
