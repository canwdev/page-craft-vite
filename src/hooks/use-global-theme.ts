import {CustomThemeType, LdThemeType} from '@/enum/settings'
import {useSettingsStore} from '@/store/settings'
import {useMainStore} from '@/store/main'
import {LsKeys} from '@/enum/page-craft'
import {createOrFindStyleNode} from '@/utils/dom'
import {getSystemIsDarkMode, hexToRgb} from '@/utils/color'
import {GlobalThemeOverrides} from 'naive-ui'
import {sassToCSS} from '@/utils/css'
import {usePlaygroundStore} from '@/store/playground'
import {useBroadcastMessage} from '@/components/PageCraft/MainPlayground/hooks/use-broadcast-messae'

export const useGlobalTheme = () => {
  const mainStore = useMainStore()
  const settingsStore = useSettingsStore()

  const handleThemeChange = (val: LdThemeType) => {
    if (val === LdThemeType.SYSTEM) {
      mainStore.isAppDarkMode = getSystemIsDarkMode()
    } else if (val === LdThemeType.LIGHT) {
      mainStore.isAppDarkMode = false
    } else if (val === LdThemeType.DARK) {
      mainStore.isAppDarkMode = true
    }
    settingsStore.ldTheme = val
  }

  handleThemeChange(settingsStore.ldTheme)

  const handleSystemThemeChange = (event: any) => {
    if (settingsStore.ldTheme === LdThemeType.SYSTEM) {
      mainStore.isAppDarkMode = Boolean(event.matches)
    }
  }

  watch(() => settingsStore.ldTheme, handleThemeChange)

  const isAppDarkMode = computed(() => mainStore.isAppDarkMode)

  const isRect = computed(() => {
    return (
      !settingsStore.enableRoundedTheme ||
      settingsStore.customTheme === CustomThemeType.MINIMALISM ||
      settingsStore.customTheme === CustomThemeType.WIN8 ||
      settingsStore.customTheme === CustomThemeType.CLASSIC
    )
  })
  const isAero = computed(() => {
    return settingsStore.enableAeroTheme && settingsStore.customTheme === CustomThemeType.DEFAULT
  })

  const updateThemeColor = () => {
    const themeColor = settingsStore.themeColor
    // console.log({themeColor})
    if (themeColor) {
      try {
        const res = hexToRgb(themeColor)
        if (!res) {
          return
        }
        const {r, g, b} = res
        const root = document.documentElement
        root.style.setProperty('--primary-rgb', `${r}, ${g}, ${b}`)
      } catch (e) {
        console.error(e)
      }
    }
  }

  watch(
    () => settingsStore.themeColor,
    () => {
      updateThemeColor()
    }
  )

  watch(
    () => settingsStore.disableAnimation,
    (val) => {
      if (val) {
        document.documentElement.classList.add('disable-animation')
      } else {
        document.documentElement.classList.remove('disable-animation')
      }
    },
    {
      immediate: true,
    }
  )

  onBeforeUnmount(() => {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .removeEventListener('change', handleSystemThemeChange)
  })
  onMounted(() => {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', handleSystemThemeChange)
    updateThemeColor()
  })

  // NaiveUI GlobalThemeOverrides
  const themeOverrides = computed<GlobalThemeOverrides>(() => {
    const primaryColor = settingsStore.themeColor || '#258292'

    return {
      common: {
        borderRadiusSmall: isRect.value ? 0 : '2px',
        borderRadius: isRect.value ? 0 : '4px',
        primaryColor,
        primaryColorHover: primaryColor,
        primaryColorPressed: primaryColor,
        primaryColorSuppl: primaryColor,
      },
    } as GlobalThemeOverrides
  })

  return {
    isRect,
    isAero,
    isAppDarkMode,
    themeOverrides,
  }
}

export const useHeadStyleEl = (id) => {
  const styleEl = ref<HTMLElement | null>(null)

  onMounted(() => {
    styleEl.value = createOrFindStyleNode(id)
  })

  onBeforeUnmount(() => {
    const elementToRemove = document.getElementById(id)
    if (elementToRemove) {
      // console.log('elementToRemove', elementToRemove)
      // 从DOM中移除元素
      elementToRemove.parentNode?.removeChild(elementToRemove)
    }
  })

  return {
    styleEl,
  }
}

/**
 * 使用全局样式
 */
export const useGlobalStyle = () => {
  const playgroundStore = usePlaygroundStore()

  const globalStyleText = ref('')
  const settingsStore = useSettingsStore()

  const {channelRef} = useBroadcastMessage('globalStyleChange')

  watch(globalStyleText, (val) => {
    applyGlobalStyle()
  })

  const applyGlobalStyle = async () => {
    try {
      if (settingsStore.enableGlobalStyle) {
        const value = globalStyleText.value
        const result = value ? await sassToCSS(value) : ''
        // console.log(result)
        playgroundStore.globalCSS = result
        localStorage.setItem(LsKeys.GLOBAL_STYLE, globalStyleText.value)

        channelRef.value!.postMessage(result)
      } else {
        playgroundStore.globalCSS = ''
      }
    } catch (e: any) {
      window.$message.error(e.message)
    }
  }

  watch(
    () => settingsStore.enableGlobalStyle,
    (val) => {
      applyGlobalStyle()
    }
  )

  onMounted(() => {
    globalStyleText.value = localStorage.getItem(LsKeys.GLOBAL_STYLE) || ''
  })

  return {
    globalStyleText,
    applyGlobalStyle,
  }
}
