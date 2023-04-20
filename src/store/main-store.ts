type MainStore = {
  isAppDarkMode: boolean
  isTopLayout: boolean
}

export const useMainStore = defineStore('mainStore', {
  state: (): MainStore => {
    return {
      isAppDarkMode: true,
      isTopLayout: false,
    }
  },
  actions: {},
})
