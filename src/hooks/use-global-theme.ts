import {LdThemeType} from '@/enum/settings'
import {useSettingsStore} from '@/store/settings'
import {useMainStore} from '@/store/main'
import {getSystemIsDarkMode, hexToRgb} from '@/utils/color'
import {GlobalThemeOverrides} from 'naive-ui'
import {useThemeOptions} from '@/components/CommonUI/ViewPortWindow/utils/use-theme'

export const useGlobalTheme = () => {
  const mainStore = useMainStore()
  const settingsStore = useSettingsStore()
  const {loadThemes} = useThemeOptions()

  onBeforeMount(() => {
    loadThemes()
  })

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

  watch(
    isAppDarkMode,
    (val) => {
      if (val) {
        document.body.classList.add('_dark')
      } else {
        document.body.classList.remove('_dark')
      }
    },
    {immediate: true},
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
    },
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

  // NaiveUI GlobalThemeOverrides
  const themeOverrides = computed<GlobalThemeOverrides>(() => {
    const primaryColor = settingsStore.themeColor || '#258292'

    return {
      common: {
        // borderRadiusSmall: isRect.value ? 0 : '2px',
        // borderRadius: isRect.value ? 0 : '4px',
        primaryColor,
        primaryColorHover: primaryColor,
        primaryColorPressed: primaryColor,
        primaryColorSuppl: primaryColor,
      },
    } as GlobalThemeOverrides
  })

  return {
    isAppDarkMode,
    themeOverrides,
  }
}
