<script lang="ts">
import {defineComponent} from 'vue'
import {languages, setLanguage} from './languages'
import {useI18n} from 'vue-i18n'

export default defineComponent({
  name: 'LanguageChooser',
  setup() {
    const {t: $t} = useI18n()
    return {
      languages,
      handleLanguageSelect(val) {
        setLanguage(val)
        window.$dialog.warning({
          title: $t('msgs.refresh_page'),
          positiveText: $t('actions.ok'),
          negativeText: $t('actions.cancel'),
          onPositiveClick: () => {
            location.reload()
          },
          onNegativeClick: () => {},
        })
      },
    }
  },
})
</script>

<template>
  <el-select class="language-chooser" v-model="$i18n.locale" @change="handleLanguageSelect">
    <el-option v-for="vi in languages" :key="vi.locale" :label="vi.name" :value="vi.locale" />
  </el-select>
</template>

<style lang="scss" scoped>
.language-chooser {
  min-width: 180px;
}
</style>
