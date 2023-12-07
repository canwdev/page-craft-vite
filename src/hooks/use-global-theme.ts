import {CustomThemeType, LdThemeType} from '@/enum/settings'
import {useSettingsStore} from '@/store/settings'
import {useMainStore} from '@/store/main'

const getSystemIsDarkMode = () =>
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

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

  return {
    isRect,
    isAero,
    isAppDarkMode,
  }
}
