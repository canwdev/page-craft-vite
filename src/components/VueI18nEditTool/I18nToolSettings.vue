<script lang="ts">
import {defineComponent} from 'vue'
import {useI18n} from 'vue-i18n'
import {useModelWrapper} from '@/hooks/use-model-wrapper'
import {StOptionItem, StOptionType} from '@/components/CommonUI/OptionUI/enum'
import {useI18nToolSettingsStore} from '@/components/VueI18nEditTool/store/i18n-tool-settings'
import {TextConvertMode, TextConvertOptions} from '@/utils/mc-utils/text-convert'
import {Globe20Regular} from '@vicons/fluent'
import {NButton} from 'naive-ui'
import {useCommonSettings} from '@/components/PageCraft/Settings/use-common-settings'

export default defineComponent({
  name: 'I18nToolSettings',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:visible'],
  setup(props, {emit}) {
    const {t: $t} = useI18n()
    const mVisible = useModelWrapper(props, emit, 'visible')
    const i18nSetStore = useI18nToolSettingsStore()

    const {commonSettingsOptions} = useCommonSettings()

    const optionList = computed((): StOptionItem[] => {
      return [
        {
          label: $t('common.i18njson_editing_too'),
          key: 'json_editing',
          children: [
            {
              label: $t('msgs.auto_paste') + ': ' + $t('msgs.remove_quotes'),
              subtitle: 'Trim: \` | \' | "',
              key: 'autoPasteTrimQuotes',
              store: i18nSetStore,
              type: StOptionType.SWITCH,
            },
            {
              label: $t('msgs.auto_paste') + ': ' + $t('msgs.text_conv_mode'),
              key: 'autoPasteTextConvertMode',
              store: i18nSetStore,
              type: StOptionType.SELECT,
              selectOptions: [
                {label: 'Disabled', value: TextConvertMode.DISABLED},
                {label: 'Number', value: TextConvertMode.NUMBER},
                ...TextConvertOptions,
              ],
            },
            {
              label: $t('common.tools'),
              key: 'tools',
              actionRender: h(
                NButton,
                {
                  size: 'small',
                  onClick: () => {
                    console.log('window.$mcUtils', window.$mcUtils)
                  },
                },
                () => $t('actions.print_to_console')
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
              store: i18nSetStore,
              type: StOptionType.SWITCH,
            },
            {
              label: $t('msgs.ignore_folders'),
              key: 'ignoreFolders',
              store: i18nSetStore,
              type: StOptionType.DYNAMIC_TAGS,
            },
            {
              label: $t('msgs.auto_show_image'),
              key: 'isAutoShowImage',
              store: i18nSetStore,
              type: StOptionType.SWITCH,
            },
            {
              label: $t('msgs.enable_flag') + ' (Wikipedia)',
              key: 'enableFlag',
              store: i18nSetStore,
              type: StOptionType.SWITCH,
            },
          ],
        },
        ...commonSettingsOptions.value,
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
