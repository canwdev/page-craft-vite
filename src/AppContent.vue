<script lang="ts">
import MainCanvas from '@/components/MainCanvas/index.vue'

export default defineComponent({
  components: {
    MainCanvas,
  },
  emits: ['themeChange'],
  setup() {
    window.$message = useMessage()
    window.$notification = useNotification()
    window.$dialog = useDialog()
    window.$loadingBar = useLoadingBar()

    return {}
  },
})
</script>
<template>
  <MainCanvas />
</template>
