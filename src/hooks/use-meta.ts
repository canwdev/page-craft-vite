import {useRoute} from 'vue-router'

export const useMetaTitle = () => {
  const route = useRoute()
  const metaTitle = route.meta.title as string

  return {
    metaTitle,
  }
}
