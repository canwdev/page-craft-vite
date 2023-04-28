import {ThemeType, useSettingsStore} from '@/store/settings'
import {useCraftStore} from '@/store/craft'

const getSystemIsDarkMode = () =>
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

export const useHandleThemeChange = () => {
  const craftStore = useCraftStore()
  const settingsStore = useSettingsStore()

  const handleThemeChange = (val: ThemeType) => {
    if (val === ThemeType.SYSTEM) {
      craftStore.isAppDarkMode = getSystemIsDarkMode()
    } else if (val === ThemeType.LIGHT) {
      craftStore.isAppDarkMode = false
    } else if (val === ThemeType.DARK) {
      craftStore.isAppDarkMode = true
    }
    settingsStore.theme = val
  }

  return {
    handleThemeChange,
  }
}

export const useGlobalTheme = () => {
  const craftStore = useCraftStore()
  const {handleThemeChange} = useHandleThemeChange()
  const settingsStore = useSettingsStore()
  handleThemeChange(settingsStore.theme)

  const handleSystemThemeChange = (event: any) => {
    if (settingsStore.theme === ThemeType.SYSTEM) {
      craftStore.isAppDarkMode = Boolean(event.matches)
    }
  }

  onMounted(() => {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', handleSystemThemeChange)
  })

  onBeforeUnmount(() => {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .removeEventListener('change', handleSystemThemeChange)
  })

  const isAppDarkMode = computed(() => craftStore.isAppDarkMode)

  return {
    isAppDarkMode,
  }
}
