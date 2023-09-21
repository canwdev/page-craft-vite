import {LdThemeType, useSettingsStore} from '@/store/settings'
import {useCraftStore} from '@/store/craft'

const getSystemIsDarkMode = () =>
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

export const useHandleThemeChange = () => {
  const craftStore = useCraftStore()
  const settingsStore = useSettingsStore()

  const handleThemeChange = (val: LdThemeType) => {
    if (val === LdThemeType.SYSTEM) {
      craftStore.isAppDarkMode = getSystemIsDarkMode()
    } else if (val === LdThemeType.LIGHT) {
      craftStore.isAppDarkMode = false
    } else if (val === LdThemeType.DARK) {
      craftStore.isAppDarkMode = true
    }
    settingsStore.ldTheme = val
  }

  return {
    handleThemeChange,
  }
}

export const useGlobalTheme = () => {
  const craftStore = useCraftStore()
  const {handleThemeChange} = useHandleThemeChange()
  const settingsStore = useSettingsStore()
  handleThemeChange(settingsStore.ldTheme)

  const handleSystemThemeChange = (event: any) => {
    if (settingsStore.ldTheme === LdThemeType.SYSTEM) {
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
