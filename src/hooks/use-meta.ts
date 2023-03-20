import {useRoute} from 'vue-router'
import {useHead} from '@vueuse/head'

export const useMetaTitle = () => {
  const route = useRoute()
  const metaTitle = route.meta.title as string
  useHead({
    title: metaTitle,
  })

  return {
    metaTitle,
  }
}
