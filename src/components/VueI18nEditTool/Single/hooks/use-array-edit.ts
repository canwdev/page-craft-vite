import {ITranslateItem} from '@/enum/vue-i18n-tool'

export const useArrayEdit = () => {
  const isShowArrayEdit = ref(false)
  const curTranslateItem = shallowRef<ITranslateItem | null>(null)
  const currentArrayString = ref<string>('')
  watch(isShowArrayEdit, (val) => {
    if (!val) {
      curTranslateItem.value = null
      currentArrayString.value = ''
    }
  })

  return {
    isShowArrayEdit,
    curTranslateItem,
    currentArrayString,
    handlePreviewArray(item: ITranslateItem) {
      curTranslateItem.value = item
      currentArrayString.value = JSON.stringify(item.value, null, 2)
      isShowArrayEdit.value = true
    },

    handleSaveArray(val) {
      if (curTranslateItem.value) {
        try {
          curTranslateItem.value.value = JSON.parse(val || '[]')
          isShowArrayEdit.value = false
        } catch (e: any) {
          console.error(e)
          window.$message.error(e.message)
        }
      }
    },
  }
}
