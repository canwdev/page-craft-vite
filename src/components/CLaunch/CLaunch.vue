<script setup lang="ts">
import TabLayout from '@canwdev/vgo-ui/src/components/Layouts/TabLayout.vue'
import {QuickOptionItem} from '@canwdev/vgo-ui/src/components/QuickOptions/enum'
import {useStorage} from '@vueuse/core'
import {LS_SettingsKey} from '@/enum/settings'

const props = withDefaults(
  defineProps<{
    items: QuickOptionItem[]
  }>(),
  {},
)
const emit = defineEmits(['tabChange'])
const currentTab = useStorage(LS_SettingsKey.C_LAUNCH_CURRENT_TAB, '')

watch(currentTab, (val) => {
  emit('tabChange', val)
})

onMounted(() => {
  if (!currentTab.value) {
    currentTab.value = props.items[0]?.value
  }
})
const currentContents = computed(() => {
  return props.items.find((item) => item.value === currentTab.value)
})

const handleWheel = (e: WheelEvent) => {
  if (!e.shiftKey) return
  const items = props.items
  const getNextIndex = (currentIndex: number, direction: number) => {
    const newIndex = currentIndex + direction
    return newIndex < 0 ? items.length - 1 : newIndex % items.length
  }
  const index = items.findIndex((item) => item.value === currentTab.value)
  const nextIndex = e.deltaY > 0 ? getNextIndex(index, 1) : getNextIndex(index, -1)
  currentTab.value = items[nextIndex].value
}

// const getIconColor = (iconClass: string) => {
//   return colorHash.hex(iconClass)
// }
</script>

<template>
  <div class="c-launch" @wheel="handleWheel">
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
    padding: 4px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    grid-template-rows: auto;
    gap: 4px 2px;
  }
  .c-launch-item {
    //outline: 1px solid var(--vgo-color-border);
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    user-select: none;
    //aspect-ratio: 1;
    border-radius: 4px;
    transition: all 0.2s;
    &:hover {
      background-color: var(--vgo-color-hover);
      outline-color: var(--vgo-primary);
      transition: all 0.1s;
    }

    &:active {
      background-color: var(--vgo-primary);
      color: white;
      outline-color: var(--vgo-primary);
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
      //flex: 1;
      aspect-ratio: 1.35;
      .item-icon {
        font-size: 48px;
        color: var(--vgo-primary);
        line-height: 1;
        transform: translateY(4px);
        //text-shadow: 0 0 3px rgba(0, 0, 0, 0.15);
      }
    }
    .item-label-wrapper {
      box-sizing: border-box;
      padding: 4px 2px;
      width: 100%;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;

      .item-label {
        font-size: 13px;
        line-height: 1.2;
        // 换行2行省略
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
