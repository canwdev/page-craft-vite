type MainStore = {
  isAppDarkMode: boolean
}

export const useMainStore = defineStore('mainStore', {
  state: (): MainStore => {
    return {
      isAppDarkMode: true,
    }
  },
  actions: {},
})
