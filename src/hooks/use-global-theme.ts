import {LsKeys} from '@/enum/page-craft'
import {useMainStore} from '@/store/main-store'

export enum ThemeType {
  SYSTEM = 0,
  LIGHT = 1,
  DARK = 2,
}

export const themeOptions = [
  {
    label: 'Follow System',
    value: ThemeType.SYSTEM,
  },
  {
    label: 'Light Theme',
    value: ThemeType.LIGHT,
  },
  {
    label: 'Dark Theme',
    value: ThemeType.DARK,
  },
]

export const getUserTheme = () =>
  Number(localStorage.getItem(LsKeys.LS_KEY_THEME)) || ThemeType.SYSTEM

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

  const handleThemeChange = (val: ThemeType) => {
    if (val === ThemeType.SYSTEM) {
      mainStore.isAppDarkMode = getSystemIsDarkMode()
    } else if (val === ThemeType.LIGHT) {
      mainStore.isAppDarkMode = false
    } else if (val === ThemeType.DARK) {
      mainStore.isAppDarkMode = true
    }
    localStorage.setItem(LsKeys.LS_KEY_THEME, String(val))
  }

  return {
    handleThemeChange,
  }
}

export const useGlobalTheme = () => {
  const mainStore = useMainStore()
  const {handleThemeChange} = useHandleThemeChange()
  handleThemeChange(getUserTheme())

  const handleSystemThemeChange = (event: any) => {
    if (getUserTheme() === ThemeType.SYSTEM) {
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
