type IStore = {
  globalCSS: string
  currentCSS: string
}

export const usePlaygroundStore = defineStore('playground', {
  state: (): IStore => {
    return {
      globalCSS: '',
      currentCSS: '',
    }
  },
  share: {
    enable: true,
    initialize: true,
  },
})
