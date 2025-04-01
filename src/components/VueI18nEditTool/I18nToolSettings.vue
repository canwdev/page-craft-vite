<script lang="ts">
import {defineComponent} from 'vue'
import {useI18n} from 'vue-i18n'
import {useModelWrapper} from '@/hooks/use-model-wrapper'
import {StOptionItem, StOptionType} from '@/components/VgoUI/packages/OptionUI/enum'
import {useI18nToolSettingsStore} from '@/components/VueI18nEditTool/store/i18n-tool-settings'
import {TextConvertMode, TextConvertOptions} from '@/utils/mc-utils/text-convert'
import OptionUI from '@/components/VgoUI/packages/OptionUI/index.vue'

export default defineComponent({
  name: 'I18nToolSettings',
  components: {OptionUI},
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

    const optionList = computed((): StOptionItem[] => {
      return [
        {
          label: $t('common.i18njson_editing_too'),
          key: 'i18njson_editing_too',
          children: [
            {
              label: $t('msgs.auto_paste') + ': ' + $t('msgs.remove_quotes'),
              subtitle: 'Trim: ` | \' | "',
              key: 'autoPasteTrimQuotes',
              store: i18nSetStore,
              type: StOptionType.SWITCH,
            },
            {
              label: $t('msgs.auto_paste') + ': ' + $t('msgs.text_conv_mode'),
              key: 'autoPasteTextConvertMode',
              store: i18nSetStore,
              type: StOptionType.SELECT,
              options: [
                {label: 'Disabled', value: TextConvertMode.DISABLED},
                {label: 'Number', value: TextConvertMode.NUMBER},
                ...TextConvertOptions,
              ],
            },
            {
              label: $t('common.tools'),
              key: 'tools',
              actionRender: h(
                'button',
                {
                  class: 'vgo-button',
                  onClick: () => {
                    console.log('window.$mcUtils', window.$mcUtils)
                  },
                },
                $t('actions.print_to_console'),
              ),
            },
          ],
        },
        {
          label: $t('common.i18njson_batch_tool'),
          key: 'i18njson_batch_tool',
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
      ]
    })

    return {
      mVisible,
      optionList,
    }
  },
})
</script>

<template>
  <OptionUI :option-list="optionList" />
</template>
