import {useMainStore} from '@/store/main-store'
import {ThemeType, useSettingsStore} from '@/store/settings'

const getSystemIsDarkMode = () =>
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

export const useIsDarkMode = () => {
  const mainStore = useMainStore()

  const isDarkMode = computed(() => mainStore.isAppDarkMode)

  return {
    isDarkMode,
  }
}

export const useHandleThemeChange = () => {
  const mainStore = useMainStore()
  const settingsStore = useSettingsStore()

  const handleThemeChange = (val: ThemeType) => {
    if (val === ThemeType.SYSTEM) {
      mainStore.isAppDarkMode = getSystemIsDarkMode()
    } else if (val === ThemeType.LIGHT) {
      mainStore.isAppDarkMode = false
    } else if (val === ThemeType.DARK) {
      mainStore.isAppDarkMode = true
    }
    settingsStore.theme = val
  }

  return {
    handleThemeChange,
  }
}

export const useGlobalTheme = () => {
  const mainStore = useMainStore()
  const {handleThemeChange} = useHandleThemeChange()
  const settingsStore = useSettingsStore()
  handleThemeChange(settingsStore.theme)

  const handleSystemThemeChange = (event: any) => {
    if (settingsStore.theme === ThemeType.SYSTEM) {
      mainStore.isAppDarkMode = Boolean(event.matches)
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

  const isAppDarkMode = computed(() => mainStore.isAppDarkMode)

  return {
    isAppDarkMode,
  }
}
