import {QuickOptionItem} from '@/components/CommonUI/QuickOptions/enum'
import {qLogicQrCode} from './qr-code'
import {Ref} from 'vue'
import {useDebounceFn} from '@vueuse/core'
import {usePluginState} from './plugins'

export const useQLogics = (qlOptionsRef) => {
  const {staticPlugins, dynamicPlugins} = usePluginState()

  const filteredOptions = ref<QuickOptionItem[]>([])

  const qLogicReload = {
    label: '🔄 Reload Plugins',
    props: {
      onClick: async () => {
        window.$qlUtils.reloadPlugins()
      },
    },
  }

  const _handleSearch = (valRef: Ref<string>) => {
    let options: QuickOptionItem[] = []
    const val = valRef.value
    if (val === '/?') {
      const label = `❓帮助说明：
- 支持输入时间戳，如：1709794946384
- 输入 /? 查看帮助
- 按 tab 键切换到下方功能列表，再按 esc 聚焦到输入框
- 部分功能支持多行文本`
      options.push({
        label,
      })
    }

    const filterableOptions = [
      ...qlOptionsRef.value,
      ...staticPlugins.value,
      qLogicQrCode(valRef),
      qLogicReload,
    ]

    // 没有输入，显示默认内容
    if (!val) {
      filteredOptions.value = [...options, ...filterableOptions]
      return
    }
    filteredOptions.value = [
      ...options,
      // 过滤列表功能
      ...filterableOptions.filter((i) => {
        const sVal = val.trim().toLowerCase()
        let flag = false
        if (i.search) {
          flag = i.search.toLowerCase().includes(sVal)
        }
        if (!flag && i.label) {
          flag = i.label.toLowerCase().includes(sVal)
        }
        return flag
      }),
      ...dynamicPlugins.value.map((f) => f(valRef)),
    ].filter((val) => !!val)
  }

  const handleSearch = useDebounceFn(_handleSearch, 100)

  return {
    handleSearch,
    filteredOptions,
  }
}
