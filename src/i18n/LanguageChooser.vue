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
          title: 'Refresh page?',
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
  <n-select
    class="language-chooser"
    size="small"
    v-model:value="$i18n.locale"
    :options="languages"
    value-field="locale"
    label-field="name"
    @update:value="handleLanguageSelect"
  />
</template>

<style lang="scss" scoped>
.language-chooser {
  min-width: 180px;
}
</style>
