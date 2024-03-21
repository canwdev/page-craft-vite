<script lang="ts" setup="">
import QuickOptions from '@/components/CommonUI/QuickOptions/index.vue'
import {useI18n} from 'vue-i18n'
import {useI18nMainStore} from '@/store/i18n-tool-main'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'
import {readClipboardData} from '@/utils'
import {ref} from 'vue'
import {QuickOptionItem} from '@/components/CommonUI/QuickOptions/enum'
import {useDebounceFn} from '@vueuse/core'

const tiSelector = '.translate-item'
const {t: $t} = useI18n()
const i18nMainStore = useI18nMainStore()

onMounted(() => {
  locateSelectedPath()
})

const locateSelectedPath = () => {
  const currentPath = i18nMainStore.translatePath
  if (!currentPath) {
    return
  }
  const el = document.querySelector(`${tiSelector}[data-translate-path="${currentPath}"]`)
  if (el) {
    el.classList.add('t_selected')
    el.scrollIntoView({behavior: 'smooth', block: 'center'})
  }
}

// 获取SubGuiItem组件实例
const getSubItems = () => {
  return new Promise((resolve) => {
    globalEventBus.emit(GlobalEvents.I18N_BATCH_GUI_GET_SUBS, resolve)
  })
}

const copyJsonFromRight = async () => {
  const items: any = await getSubItems()
  console.log('[items]', items)
  const result: any = []
  for (const key in items) {
    // SubGuiItem实例
    const item = items[key]
    result.push({
      label: item.dirItem.label,
      // undefined 为该文件没有创建，null 为该字段内容为空。
      value: item.currentItem ? item.fieldValue : undefined,
    })
  }
  window.$qlUtils.copy(result)
}

const pasteJsonOverrideRight = async () => {
  try {
    const data: any = await readClipboardData()
    const pastedResult: any[] = JSON.parse(data)
    console.log('[pastedResult]', pastedResult)

    const items: any = await getSubItems()
    const itemsLabelMap: any = {}
    items.forEach((item) => {
      itemsLabelMap[item.dirItem.label] = item
    })

    console.log('[itemsLabelMap]', itemsLabelMap)
    for (const key in pastedResult) {
      // SubGuiItem实例
      const result = pastedResult[key]
      const {label, value} = result

      if (value !== undefined && value !== null) {
        const item = itemsLabelMap[label]
        if (item) {
          item.fieldValue = value
        }
      }
    }
    window.$message.success($t('msgs.action_completed_pl'))
  } catch (error: any) {
    window.$message.error(error.message)
  }
}

const handleAnalyse = async () => {
  console.log('[translatePath]', i18nMainStore.translatePath)
  console.log('[dirTree]', i18nMainStore.dirTree)
  console.log('[filePathArr]', i18nMainStore.filePathArr)
  const items: any = await getSubItems()
  console.log('[getSubItems]', items)
  console.log('TODO！')
}

const isShowToolboxMenu = ref(false)
const guiToolboxOptions = computed((): QuickOptionItem[] => {
  const currentPath = i18nMainStore.translatePath
  return [
    {
      label: $t('msgs.fen_xi_fan_yi_shu') + ' (TBD)',
      props: {
        onClick: handleAnalyse,
      },
    },
    {
      label: 'Locate',
      disabled: !currentPath,
      props: {
        onClick: () => {
          locateSelectedPath()
        },
      },
    },
    {
      label: $t('msgs.copy_json_from_right'),
      disabled: !currentPath,
      props: {
        onClick: copyJsonFromRight,
      },
    },
    {
      label: $t('msgs.paste_json_override_right'),
      disabled: !currentPath,
      props: {
        onClick: pasteJsonOverrideRight,
      },
    },
  ]
})

// 过滤key
const toolboxFilterKey = ref('')
const toolboxFilterKeyChange = useDebounceFn(() => {
  const els = document.querySelectorAll(
    `${tiSelector}[data-translate-path*="${toolboxFilterKey.value}"]`
  )
  Array.from(els).forEach((el, index) => {
    const key = el.getAttribute('data-translate-path')
    el.classList.add('t_selected')
    if (index === 0) {
      el.scrollIntoView({behavior: 'smooth', block: 'center'})
    }

    // 高亮动画，1s后取消
    if (key !== i18nMainStore.translatePath) {
      el.classList.add('_transition')
      setTimeout(() => {
        el.classList.remove('t_selected')
        setTimeout(() => {
          el.classList.remove('_transition')
        }, 1000)
      }, 1000)
    }
  })
}, 500)
</script>

<template>
  <div class="vp-bg action-row">
    <button
      class="vp-button"
      @click="isShowToolboxMenu = !isShowToolboxMenu"
      @mouseover="isShowToolboxMenu = true"
    >
      Gui Toolbox
    </button>

    <input
      class="vp-input"
      style="flex: 1"
      v-model="toolboxFilterKey"
      placeholder="Locate Translate Path"
      @input="toolboxFilterKeyChange"
      @keyup.enter="toolboxFilterKeyChange"
      @keyup.esc="toolboxFilterKey = ''"
    />

    <!-- {{ i18nMainStore.filePathArr.join('/') }}-->
    <transition name="fade-scale">
      <QuickOptions
        style="top: 100%"
        v-model:visible="isShowToolboxMenu"
        :options="guiToolboxOptions"
        @mouseleave="isShowToolboxMenu = false"
      />
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.action-row {
  font-size: 12px;
  border: none;
  border-bottom: 1px solid $color_border;
  position: relative;
  z-index: 1;
  gap: 4px;
  padding: 4px 10px;
  display: flex;
  .vp-button,
  .vp-input {
    font-size: 12px;
    padding: 2px 4px;
    height: auto;
  }
}
</style>
