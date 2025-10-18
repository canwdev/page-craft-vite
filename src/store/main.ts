import type { BlockItem } from '@/enum/page-craft/block'
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { PageCraftKeys } from '@/enum'
import { ActionBlockItems } from '@/enum/page-craft/block'

export const useMainStore = defineStore(
  'main',
  () => {
    const isAppDarkMode = ref(true)

    const currentBlock = ref<BlockItem>(
      JSON.parse(localStorage.getItem(PageCraftKeys.CURRENT_BLOCK) || 'null')
      || ActionBlockItems.EMPTY,
    )
    const className = ref('')
    const innerText = ref('')
    const selecting = ref(false)

    const isShowQuickLaunch = ref(false)
    const isShowIframeBrowser = ref(false)

    const upgradeInfo = ref('')

    function setCurrentBlock(block: BlockItem) {
      // 修改 ref 的值需要使用 .value
      currentBlock.value = block
      // 副作用（side effects）保持不变
      localStorage.setItem(PageCraftKeys.CURRENT_BLOCK, JSON.stringify(block))
    }

    return {
      isAppDarkMode,
      currentBlock,
      className,
      innerText,
      selecting,
      isShowQuickLaunch,
      isShowIframeBrowser,
      upgradeInfo,
      setCurrentBlock,
    }
  },
  {
    share: {
      omit: ['isShowQuickLaunch', 'isShowIframeBrowser', 'upgradeInfo'],
      enable: true,
      initialize: true,
    },
  },
)
