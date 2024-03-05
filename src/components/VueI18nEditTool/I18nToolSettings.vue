<script lang="ts">
import {defineComponent} from 'vue'
import {useI18n} from 'vue-i18n'
import {useModelWrapper} from '@/hooks/use-model-wrapper'
import {StOptionItem, StOptionType} from '@/components/CommonUI/OptionUI/enum'
import {useI18nToolSettingsStore} from '@/store/i18n-tool-settings'
import {TextConvertMode, TextConvertOptions} from '@/components/VueI18nEditTool/copy-enum'
import {Globe20Regular} from '@vicons/fluent'
import {NButton} from 'naive-ui'

export default defineComponent({
  name: 'I18nToolSettings',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, {emit}) {
    const {t: $t} = useI18n()
    const mVisible = useModelWrapper(props, emit, 'visible')
    const intSettingsStore = useI18nToolSettingsStore()

    const optionList = computed((): StOptionItem[] => {
      return [
        {
          label: $t('common.i18njson_editing_too'),
          key: 'json_editing',
          children: [
            {
              label: '自动粘贴: 移除首尾引号',
              subtitle: 'Trim: \` | \' | "',
              key: 'autoPasteTrimQuotes',
              store: intSettingsStore,
              type: StOptionType.SWITCH,
            },
            {
              label: '自动粘贴: 文本转换器模式',
              key: 'autoPasteTextConvertMode',
              store: intSettingsStore,
              type: StOptionType.SELECT,
              selectOptions: [
                {label: 'Disabled', value: TextConvertMode.DISABLED},
                {label: 'Number', value: TextConvertMode.NUMBER},
                ...TextConvertOptions,
              ],
            },
            {
              label: 'Dev',
              key: 'dev',
              actionRender: h(
                NButton,
                {
                  size: 'small',
                  onClick: () => {
                    console.log('window.$consoleUtils', window.$consoleUtils)
                  },
                },
                () => 'Print Utils Console'
              ),
            },
          ],
        },
        {
          label: $t('common.i18njson_batch_tool'),
          key: 'json_editing',
          children: [
            {
              label: $t('common.folders_mode'),
              key: 'isFoldersMode',
              store: intSettingsStore,
              type: StOptionType.SWITCH,
            },
            {
              label: 'ignoreFolders',
              key: 'ignoreFolders',
              store: intSettingsStore,
              type: StOptionType.DYNAMIC_TAGS,
            },
          ],
        },
      ]
    })

    return {
      mVisible,
      optionList,
      dialogIconRender() {
        return h(Globe20Regular)
      },
    }
  },
})
</script>

<template>
  <n-modal
    v-model:show="mVisible"
    preset="dialog"
    :title="$t('common.settings')"
    style="padding-left: 10px; padding-right: 10px"
    :icon="dialogIconRender"
  >
    <OptionUI :option-list="optionList" />
  </n-modal>
</template>
