<script lang="ts">
export default {
  name: 'SettingsApp',
}
</script>

<script setup lang="ts">
import {SettingsTabType} from '@/enum/settings'
import TabLayout from '@/components/CanUI/packages/Layouts/TabLayout.vue'
import SettingsCommon from '@/components/OS/SettingsApp/SettingsCommon.vue'
import SettingsAi from '@/components/OS/SettingsApp/SettingsAi.vue'
import I18nToolSettings from '@/components/VueI18nEditTool/I18nToolSettings.vue'
import {useI18n} from 'vue-i18n'

type AppParams = {
  curTab: SettingsTabType
}
const props = withDefaults(
  defineProps<{
    appParams?: AppParams
  }>(),
  {},
)

const {t: $t} = useI18n()
const settingsTabs = ref([
  {label: $t('common.common'), value: SettingsTabType.COMMON},
  {label: 'AI', value: SettingsTabType.AI},
  {label: $t('i18n_tools.i18_n'), value: SettingsTabType.I18N},
])
const curTab = ref<SettingsTabType>(SettingsTabType.COMMON)

// 应用启动传参
watch(
  () => props.appParams,
  () => {
    if (!props.appParams) {
      return
    }
    curTab.value = props.appParams.curTab
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <TabLayout class="system-settings" horizontal v-model="curTab" :options="settingsTabs">
    <div class="settings-content">
      <transition mode="out-in" name="fade">
        <SettingsCommon v-if="curTab === SettingsTabType.COMMON" />
        <SettingsAi v-else-if="curTab === SettingsTabType.AI" />
        <I18nToolSettings v-else-if="curTab === SettingsTabType.I18N" />
      </transition>
    </div>
  </TabLayout>
</template>

<style lang="scss" scoped>
//.system-settings-window {
//  max-height: 80vh;
//  min-width: 400px;
//  .system-settings {
//    height: 100%;
//    overflow: auto;
//  }
//  a {
//    color: $primary;
//  }
//}
</style>
