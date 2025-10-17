import {
  useThemeOptions,
} from '@canwdev/vgo-ui/src/components/ViewPortWindow/use-theme'
import { useElementPlusTheme } from '@canwdev/vgo-ui/src/hooks/use-element-plus-theme/index'
import { LdThemeType } from '@/enum/settings'
import { useMainStore } from '@/store/main'
import { useSettingsStore } from '@/store/settings'
import { getSystemIsDarkMode, hexToRgb } from '@/utils/color'

export const contextMenuTheme = ref('flat dark')
export function useGlobalTheme() {
  const mainStore = useMainStore()
  const settingsStore = useSettingsStore()
  const { loadThemes } = useThemeOptions()

  onBeforeMount(() => {
    loadThemes()
  })

  const handleThemeChange = (val: LdThemeType) => {
    if (val === LdThemeType.SYSTEM) {
      mainStore.isAppDarkMode = getSystemIsDarkMode()
    }
    else if (val === LdThemeType.LIGHT) {
      mainStore.isAppDarkMode = false
    }
    else if (val === LdThemeType.DARK) {
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

  watch(
    isAppDarkMode,
    (val) => {
      if (val) {
        // Element Plus 暗黑模式 https://element-plus.org/zh-CN/guide/dark-mode.html
        document.documentElement.classList.add('dark')
        contextMenuTheme.value = 'flat dark'
      }
      else {
        document.documentElement.classList.remove('dark')
        contextMenuTheme.value = 'flat'
      }
    },
    { immediate: true },
  )

  const lastTheme = ref('')
  watch(
    () => settingsStore.customTheme,
    (val) => {
      if (lastTheme.value) {
        document.body.classList.remove(lastTheme.value)
      }
      document.body.classList.add(val)
      lastTheme.value = val
    },
    {
      immediate: true,
    },
  )

  const { changeTheme } = useElementPlusTheme(settingsStore.themeColor)

  const updateThemeColor = () => {
    const themeColor = settingsStore.themeColor
    // console.log({themeColor})
    if (themeColor) {
      changeTheme(themeColor)
      try {
        const res = hexToRgb(themeColor)
        if (!res) {
          return
        }
        const { r, g, b } = res
        const root = document.documentElement
        root.style.setProperty('--vgo-primary-rgb', `${r}, ${g}, ${b}`)
      }
      catch (e) {
        console.error(e)
      }
    }
  }

  watch(
    () => settingsStore.themeColor,
    () => {
      updateThemeColor()
    },
  )

  watch(
    () => settingsStore.disableAnimation,
    (val) => {
      if (val) {
        document.documentElement.classList.add('disable-animation')
      }
      else {
        document.documentElement.classList.remove('disable-animation')
      }
    },
    {
      immediate: true,
    },
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

  return {
    isAppDarkMode,
  }
}
