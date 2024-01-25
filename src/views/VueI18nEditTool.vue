<script lang="ts">
import {defineComponent, ref} from 'vue'
import TranslateTreeItem from '@/components/VueI18nEditTool/Single/TranslateTreeItem.vue'
import {exportI18nTreeJsonObj, I18nJsonObjUtils, ITranslateTreeItem} from '@/enum/vue-i18n-tool'
import {handleReadSelectedFile} from '@/utils/exporter'
import iconTranslate from '../assets/textures/translate.svg?url'
import DropZone from '@/components/CommonUI/DropZone.vue'
import {useFileDrop} from '@/hooks/use-file-drop'
import {useMetaTitle} from '@/hooks/use-meta'
import {Save20Regular} from '@vicons/fluent'
import {useBeforeUnload, useSaveShortcut} from '@/hooks/use-beforeunload'
import dynamicLoadScript from '@/utils/dynamic-load-script'
import {useMainStore} from '@/store/main'
import {useI18n} from 'vue-i18n'
import I18nToolSettings from '@/components/VueI18nEditTool/I18nToolSettings.vue'

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
  name: 'VueI18nEditTool',
  components: {
    I18nToolSettings,
    TranslateTreeItem,
    DropZone,
    Save20Regular,
  },
  setup() {
    const {t: $t} = useI18n()
    const mainStore = useMainStore()
    const translateTreeRoot = ref<ITranslateTreeItem[]>(I18nJsonObjUtils.parseWithRoot())
    const isLoading = ref(false)

    const fileHandle = shallowRef<FileSystemFileHandle>()
    const handleImport = async (file) => {
      try {
        isLoading.value = true
        const str = await handleReadSelectedFile(file)
        const obj = JSON.parse(str as string)
        translateTreeRoot.value = I18nJsonObjUtils.parseWithRoot(obj)
      } catch (e: any) {
        console.error(e)
        window.$message.error(e.message)
      } finally {
        isLoading.value = false
      }
    }

    const handleSelectFile = async () => {
      // @ts-ignore
      const [handle] = await window.showOpenFilePicker(filePickerOptions)
      fileHandle.value = handle
      const file = await handle.getFile()
      handleImport(file)
    }

    const handleCloseFile = () => {
      fileHandle.value = undefined
      translateTreeRoot.value = I18nJsonObjUtils.parseWithRoot()
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
      window.$message.success($t('msgs.saved'))
    }
    const handleExport = async () => {
      console.log(translateTreeRoot.value)
      const txt = JSON.stringify(exportI18nTreeJsonObj(translateTreeRoot.value), null, 2)

      // @ts-ignore
      const handle = await window.showSaveFilePicker({
        suggestedName: fileHandle.value?.name,
        ...filePickerOptions,
      })
      const writable = await handle.createWritable()

      await writable.write(txt)
      await writable.close()

      window.$message.success($t('msgs.saved'))
    }

    const {metaTitle} = useMetaTitle()

    useSaveShortcut(() => {
      if (fileHandle.value) {
        handleSaveFile()
        return
      }
      handleExport()
    })

    onMounted(async () => {
      console.log(import.meta)
      await dynamicLoadScript('./lib/pinyinjs/pinyin_dict_notone.min.js')
      await dynamicLoadScript('./lib/pinyinjs/pinyinUtil.js')
    })

    useBeforeUnload(() => {
      return !!fileHandle.value
    })

    const isShowToolSettings = ref(false)

    const loadDemo = () => {
      translateTreeRoot.value = I18nJsonObjUtils.parseWithRoot({
        hello_world: {
          section_a: {
            test_str: 'This is a test string',
            test_arr: ['line 1', 'line 2', 'line 3'],
            test_number: 114514,
          },
          section_b: {
            '': "Blur this input and it'll generate the key automatically!",
          },
          section_c: {
            '': '中文 is Supported',
          },
        },
      })
    }

    const handleFileDrop = async (e) => {
      // Process all the items.
      for (const item of e.dataTransfer.items) {
        // Careful: `kind` will be 'file' for both file
        // _and_ directory entries.
        if (item.kind === 'file') {
          const entry = await item.getAsFileSystemHandle()
          if (entry.kind !== 'directory') {
            fileHandle.value = entry
            const file = await entry.getFile()
            await handleImport(file)
          } else {
            window.$message.error('Please drag and drop a json file here!')
          }
        }
      }
    }

    return {
      metaTitle,
      translateTreeRoot,
      fileHandle,
      handleImport,
      handleSelectFile,
      handleCloseFile,
      handleSaveFile,
      handleExport,
      loadDemo,
      iconTranslate,
      ...useFileDrop({
        cb: handleFileDrop,
      }),
      mainStore,
      isShowToolSettings,
      isLoading,
    }
  },
})
</script>

<template>
  <div
    class="vue-i18n-copy-tool"
    @dragover.prevent.stop="fileDragover"
    @dragleave.prevent.stop="showDropzone = false"
    @drop.prevent.stop="fileDrop"
  >
    <transition name="mc-fade">
      <DropZone position-fixed v-show="showDropzone" :text="$t('msgs.drag_folder_here')" />
    </transition>

    <n-card size="small" style="position: sticky; top: 0; z-index: 100; margin-bottom: 10px">
      <n-page-header subtitle="" @back="$router.push({name: 'HomePage'})">
        <template #title>{{ metaTitle }}</template>
        <template #avatar> <n-avatar :src="iconTranslate" style="background: none" /> </template>
        <template #extra>
          <n-space>
            <n-button secondary size="small" @click="isShowToolSettings = true">
              {{ $t('common.settings') }}
            </n-button>

            <n-button secondary size="small" @click="mainStore.isShowTextTransformer = true">
              {{ $t('common.text_transformer') }}
            </n-button>

            <n-popconfirm v-if="fileHandle" @positive-click="handleCloseFile">
              <template #trigger>
                <n-button v-if="fileHandle" secondary type="primary" size="small">
                  Close JSON
                </n-button>
              </template>
              Confirm close JSON? Unsaved contents will be lost.
            </n-popconfirm>
            <n-button v-else type="primary" @click="handleSelectFile" size="small">
              {{ $t('actions.open_json') }}
            </n-button>

            <n-button v-if="fileHandle" @click="handleSaveFile" size="small" type="info">
              <template #icon>
                <Save20Regular />
              </template>

              {{ $t('actions.save') }}
            </n-button>
            <n-button secondary @click="handleExport" size="small">
              {{ $t('actions.save_as') }}...
            </n-button>

            <n-popconfirm v-if="!fileHandle" @positive-click="loadDemo">
              <template #trigger>
                <n-button tertiary size="small">{{ $t('common.demo') }}</n-button>
              </template>
              {{ $t('msgs.load_demo_this_will') }}
            </n-popconfirm>
          </n-space>
        </template>
      </n-page-header>
    </n-card>

    <div class="_container">
      <TranslateTreeItem
        v-for="(item, index) in translateTreeRoot"
        :key="index"
        :item="item"
        :index="index"
      />
    </div>
    <div class="height-placeholder">
      <div v-show="isLoading" class="loading-wrap">Loading...</div>
    </div>

    <I18nToolSettings v-model:visible="isShowToolSettings" />
  </div>
</template>

<style lang="scss" scoped>
.vue-i18n-copy-tool {
  width: 100%;
  height: 100%;
  overflow: auto;
  position: relative;

  .height-placeholder {
    height: 500px;
  }
  .loading-wrap {
    text-align: center;
    padding: 10px;
  }

  ._container {
    max-width: 1000px;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
