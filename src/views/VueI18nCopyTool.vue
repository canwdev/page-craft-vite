<script lang="ts">
import {defineComponent} from 'vue'
import TranslateTreeItem from '@/components/VueI18nCopyTool/TranslateTreeItem.vue'
import {
  formatTranslateTreeItem,
  ITranslateTreeItem,
  parseI18nJsonObj,
} from '@/enum/vue-i18n-copy-tool'
import FileChooser from '@/components/FileChooser.vue'
import {handleReadSelectedFile} from '@/utils/exporter'

export default defineComponent({
  name: 'VueI18nCopyTool',
  components: {
    TranslateTreeItem,
    FileChooser,
  },
  setup() {
    const treeRootList = ref<ITranslateTreeItem[]>([formatTranslateTreeItem()])

    const importFileChooserRef = ref()
    const handleImport = async (file) => {
      const str = await handleReadSelectedFile(file)
      const obj = JSON.parse(str as string)

      console.log(obj)
      console.log(parseI18nJsonObj(obj))
    }

    onMounted(() => {
      treeRootList.value = parseI18nJsonObj({
        customized_details: {
          me: {
            ai_powered: 'AI-Powered Auto-Tracking',
            a_foldable_ai_power:
              'A foldable AI-powered phone mount featured with an auto-tracking function, follows you to capture every movement.',
            quick_pick: 'Quick Pick',
            just_put_your:
              'Just put your hands up or simply press the button on OBSBOT Me, OBSBOT Me will automatically start/cancel track you.',
            brushless_motor: 'Brushless Motor',
            with_a_higher:
              "With a higher starting speed, and betterspeed control, don't worry that miss your splendid moment.",
            no_app_required: 'No App Required',
            dont_need_extra:
              "Don't need extra complex action like download Apps or connects bluetooth, live broadcast on any Apps you like at once.",
            portable_and_ext: 'Portable and Extendable',
            the_foldable_str:
              'The Foldable structure and the lightweighted design, make the OBSBOT Me more portable.',
          },
          tail: {
            ai_tracking: 'AI-tracking',
            ai_tracking_stab:
              'AI tracking. Stable and smooth video shooting performance with tracking even in the low light interior environment, busy streets, twisted body movements, unusual shooting angles, and noisy backgrounds.',
            intelligent_copo: 'Intelligent Coposition',
            the_first_in:
              'The first in class to introduce AI technologies for a smart video shooting system, enabling the device to perform autonomous optimization and processing of composition.',
            break_free_from: 'Break free from limitations',
            obsbot_tail_has:
              'OBSBOT Tail has a built-in 3-axis pan/tilt/zoom gimbal platform that effectively stabilizes the image during video shots.',
            power_gesture: 'Power Gesture',
            obsbot_tail_has_powerful:
              'OBSBOT Tail has powerful gesture implementation in AI video shooting, empowering users to access a series of functions such as start recording, tracking, zoom and creative camera movements with natural simple gestures.',
            multifunctional: 'Multifunctional Studio App',
            obsbot_studio_ap:
              'Obsbot Studio App is much more than just a control panel. It also supports the application of filters in real-time. Its wide array of post-editing functions allows you to edit videos, set audio outputs, adjust colors and share your creations.',
            optimal_camera: 'Optimal Camera performance',
            equipped_with:
              'Equipped with a Sony CMOS sensor and Hoya optical lens system, OBSBOT Tail supports 3.5x optical zoom, 10x hybrid zoom, 4K 60fps film quality recording and 240fps slow-motion.',
          },
        },
      })
    })

    return {
      treeRootList,
      handleImport,
      importFileChooserRef,
    }
  },
})
</script>

<template>
  <div class="vue-i18n-copy-tool">
    <n-card size="small" style="margin-bottom: 10px">
      <n-space>
        <n-button @click="importFileChooserRef.chooseFile()" size="tiny">Import JSON</n-button>
        <n-button size="tiny">Export JSON</n-button>
      </n-space>
    </n-card>

    <TranslateTreeItem v-for="(item, index) in treeRootList" :key="index" :item="item" />

    <FileChooser ref="importFileChooserRef" accept="application/JSON" @selected="handleImport" />
  </div>
</template>

<style lang="scss" scoped>
.vue-i18n-copy-tool {
  width: 100%;
  height: 100%;
  background-color: white;
  overflow: auto;
}
</style>
