<script lang="ts">
import {defineComponent} from 'vue'
import TranslateTreeItem from '@/components/VueI18nCopyTool/TranslateTreeItem.vue'
import {
  exportI18nTreeJsonObj,
  formatTranslateTreeItem,
  ITranslateTreeItem,
  parseI18nJsonObj,
} from '@/enum/vue-i18n-copy-tool'
import FileChooser from '@/components/FileChooser.vue'
import {getFileName, handleExportFile, handleReadSelectedFile} from '@/utils/exporter'

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
      // console.log(obj)
      treeRootList.value = parseI18nJsonObj(obj)
    }

    return {
      treeRootList,
      handleImport,
      handleExport() {
        handleExportFile(
          getFileName(null, 'i18n_export'),
          JSON.stringify(exportI18nTreeJsonObj(treeRootList.value), null, 2),
          '.json'
        )
      },
      importFileChooserRef,
      loadDemo() {
        treeRootList.value = parseI18nJsonObj({
          hello_world: {
            section_a: {
              test_str: 'This is a test string',
              '': "It's fast and cool",
            },
            section_b: {
              '': "Blur this input and it'll fill left blank automatically!",
            },
          },
        })
      },
    }
  },
})
</script>

<template>
  <div class="vue-i18n-copy-tool">
    <n-card size="small" style="position: sticky; top: 0; z-index: 100; margin-bottom: 10px">
      <n-space align="center" justify="space-between">
        <n-space>
          <n-button @click="importFileChooserRef.chooseFile()" size="tiny">Import JSON</n-button>
          <n-button @click="handleExport" size="tiny">Export JSON</n-button>

          <n-popconfirm @positive-click="loadDemo">
            <template #trigger>
              <n-button size="tiny">Demo</n-button>
            </template>
            Load Demo? This will override editing content.
          </n-popconfirm>
        </n-space>

        <b>VueI18nCopyTool</b>
        <n-space>
          <n-button type="primary" @click="$router.push({name: 'HomeView'})" size="tiny"
            >Home</n-button
          >
        </n-space>
      </n-space>
    </n-card>

    <div class="_container">
      <TranslateTreeItem v-for="(item, index) in treeRootList" :key="index" :item="item" />
    </div>

    <FileChooser ref="importFileChooserRef" accept="application/JSON" @selected="handleImport" />
  </div>
</template>

<style lang="scss" scoped>
.vue-i18n-copy-tool {
  width: 100%;
  height: 100%;
  overflow: auto;
  position: relative;

  ._container {
    max-width: 1600px;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
