<script lang="ts">
import {defineComponent} from 'vue'
import TranslateTreeItem from '@/components/VueI18nCopyTool/TranslateTreeItem.vue'
import {
  exportI18nTreeJsonObj,
  formatTranslateTreeItem,
  ITranslateTreeItem,
  parseI18nJsonObj,
} from '@/enum/vue-i18n-tool'
import FileChooser from '@/components/CommonUI/FileChooser.vue'
import {getFileName, handleExportFile, handleReadSelectedFile} from '@/utils/exporter'
import iconTranslate from '../assets/textures/translate.svg?url'

const filePickerOptions = {
  types: [
    {
      description: 'JSON',
      accept: {
        'application/JSON': ['.json'],
      },
    },
  ],
}

export default defineComponent({
  name: 'VueI18nCopyTool',
  components: {
    TranslateTreeItem,
  },
  setup() {
    const translateTreeRoot = ref<ITranslateTreeItem[]>([formatTranslateTreeItem()])

    const fileHandle = shallowRef<FileSystemFileHandle>()
    const handleImport = async (file) => {
      // @ts-ignore
      const [handle] = await window.showOpenFilePicker(filePickerOptions)
      fileHandle.value = handle
      const str = await handleReadSelectedFile(await handle.getFile())
      const obj = JSON.parse(str as string)
      // console.log(obj)
      translateTreeRoot.value = parseI18nJsonObj(obj)
    }

    const handleSaveFile = async () => {
      if (!fileHandle.value) {
        return
      }
      // @ts-ignore
      const writable = await fileHandle.value.createWritable()

      const txt = JSON.stringify(exportI18nTreeJsonObj(translateTreeRoot.value), null, 2)

      await writable.write(txt)
      await writable.close()
      window.$message.success('Saved!')
    }
    const handleExport = async () => {
      const txt = JSON.stringify(exportI18nTreeJsonObj(translateTreeRoot.value), null, 2)

      // @ts-ignore
      const handle = await window.showSaveFilePicker({
        suggestedName: fileHandle.value?.name,
        ...filePickerOptions,
      })
      const writable = await handle.createWritable()

      await writable.write(txt)
      await writable.close()

      window.$message.success('Saved!')
    }

    return {
      translateTreeRoot,
      fileHandle,
      handleImport,
      handleSaveFile,
      handleExport,
      loadDemo() {
        translateTreeRoot.value = parseI18nJsonObj({
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
      iconTranslate,
    }
  },
})
</script>

<template>
  <div class="vue-i18n-copy-tool">
    <n-card size="small" style="position: sticky; top: 0; z-index: 100; margin-bottom: 10px">
      <n-page-header subtitle="" @back="$router.push({name: 'HomeView'})">
        <template #title> Vue i18n Copy Tool </template>
        <template #avatar> <n-avatar :src="iconTranslate" style="background: none" /> </template>
        <template #extra>
          <n-space>
            <n-button type="primary" @click="handleImport" size="small"> Open JSON </n-button>
            <n-button v-if="fileHandle" @click="handleSaveFile" size="small" type="info"
              >Save</n-button
            >
            <n-button @click="handleExport" size="small">Save as...</n-button>

            <n-popconfirm @positive-click="loadDemo">
              <template #trigger>
                <n-button size="small">Demo</n-button>
              </template>
              Load Demo? This will override editing content.
            </n-popconfirm>
          </n-space>
        </template>
      </n-page-header>
    </n-card>

    <div class="_container">
      <TranslateTreeItem v-for="(item, index) in translateTreeRoot" :key="index" :item="item" />
    </div>
    <div style="height: 500px"></div>
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
