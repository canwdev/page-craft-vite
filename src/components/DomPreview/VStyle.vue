<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: 'VStyle',
  render() {
    return h('style', this.$slots.default?.())
  },
})
</script>
