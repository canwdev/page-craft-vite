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
import {useMainStore} from '@/store/main'
import {useI18n} from 'vue-i18n'
import I18nToolSettings from '@/components/VueI18nEditTool/I18nToolSettings.vue'
import {useIDBKeyval} from '@vueuse/integrations/useIDBKeyval'
import {LsKeys} from '@/enum/page-craft'
import {guid} from '@/utils'
import {QuickOptionItem} from '@/components/CommonUI/QuickOptions/enum'
import QuickOptions from '@/components/CommonUI/QuickOptions/index.vue'
import {
  FileHandleHistory,
  useOpenedHistory,
  verifyPermission,
} from '@/components/VueI18nEditTool/file-history'
import moment from 'moment'

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
    QuickOptions,
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

    const {appendHistory, historyMenuOptions} = useOpenedHistory(
      LsKeys.I18N_FILE_HANDLE_HISTORY,
      async (handle: FileSystemFileHandle) => {
        fileHandle.value = handle
        const file = await handle.getFile()
        await handleImport(file)
      }
    )

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
      const [handle] = await window.showOpenFilePicker(filePickerOptions)
      await appendHistory(handle)
      fileHandle.value = handle
      const file = await handle.getFile()
      await handleImport(file)
    }

    const handleFileDrop = async (e) => {
      try {
        isLoading.value = true
        // Process all the items.
        for (const item of e.dataTransfer.items) {
          // Careful: `kind` will be 'file' for both file
          // _and_ directory entries.
          if (item.kind === 'file') {
            const handle = await item.getAsFileSystemHandle()
            if (handle.kind !== 'directory') {
              await appendHistory(handle)
              fileHandle.value = handle
              const file = await handle.getFile()
              await handleImport(file)
            } else {
              window.$message.error('Please drag and drop a json file here!')
            }
          }
        }
      } catch (e: any) {
        console.error(e)
        window.$message.error(e.message)
      } finally {
        isLoading.value = false
      }
    }

    const handleCloseFile = () => {
      fileHandle.value = undefined
      translateTreeRoot.value = I18nJsonObjUtils.parseWithRoot()
    }

    const handleSaveFile = async () => {
      try {
        isLoading.value = true
        if (!fileHandle.value) {
          return
        }
        // @ts-ignore
        const writable = await fileHandle.value.createWritable()

        const txt = JSON.stringify(exportI18nTreeJsonObj(translateTreeRoot.value), null, 2)

        await writable.write(txt)
        await writable.close()
        window.$message.success($t('msgs.saved'))
      } catch (e: any) {
        console.error(e)
        window.$message.error(e.message)
      } finally {
        isLoading.value = false
      }
    }
    const handleExport = async () => {
      try {
        isLoading.value = true
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
      } catch (e: any) {
        console.error(e)
        window.$message.error(e.message)
      } finally {
        isLoading.value = false
      }
    }

    const {metaTitle} = useMetaTitle()

    useSaveShortcut(() => {
      if (fileHandle.value) {
        handleSaveFile()
        return
      }
      handleExport()
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

    const menuOptions = computed((): QuickOptionItem[] => {
      // @ts-ignore
      return [
        {
          label: $t('common.settings'),
          props: {
            onClick: () => {
              isShowToolSettings.value = true
            },
          },
        },
        {
          label: $t('common.tools'),
          props: {
            onClick: () => {
              mainStore.isShowQuickLaunch = true
            },
          },
        },
        fileHandle.value
          ? {
              label: '💻 ' + $t('actions.close') + ' JSON',
              children: [
                {
                  label: $t($t('msgs.confirm_close')),
                  props: {onClick: handleCloseFile, isBack: true},
                },
              ],
            }
          : {
              label: '💻  ' + $t('actions.open') + ' JSON',
              props: {
                onClick: () => {
                  handleSelectFile()
                },
              },
              dropdown: historyMenuOptions.value,
            },

        fileHandle.value
          ? {
              label: '💾 ' + $t('actions.save'),
              props: {
                onClick: () => {
                  handleSaveFile()
                },
              },
            }
          : null,
        {
          label: $t('actions.save_as') + '...',
          props: {
            onClick: () => {
              handleExport()
            },
          },
        },
        {
          label: $t('common.demo'),
          children: [
            {label: $t('msgs.load_demo_this_will'), props: {onClick: loadDemo, isBack: true}},
          ],
        },
      ].filter(Boolean)
    })

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
      menuOptions,
    }
  },
})
</script>

<template>
  <div
    class="vue-i18n-edit-tool i18n-style"
    @dragover.prevent.stop="fileDragover"
    @dragleave.prevent.stop="showDropzone = false"
    @drop.prevent.stop="fileDrop"
  >
    <transition name="mc-fade">
      <div class="mc-loading-container position-fixed" v-if="isLoading">
        <n-spin />
      </div>
    </transition>
    <transition name="mc-fade">
      <DropZone position-fixed v-show="showDropzone" :text="$t('msgs.drag_file_here')" />
    </transition>

    <div
      class="vp-bg navbar-wrap"
      style="position: sticky; top: 0; z-index: 100; margin-bottom: 10px"
    >
      <n-page-header subtitle="" @back="$router.push({name: 'HomePage'})">
        <template #title>{{ metaTitle }}</template>
        <template #avatar> <n-avatar :src="iconTranslate" style="background: none" /> </template>
        <template #extra>
          <QuickOptions
            is-static
            :options="menuOptions"
            horizontal
            :auto-focus="false"
            item-cls="vp-button"
          />
        </template>
      </n-page-header>
    </div>

    <div class="_container">
      <TranslateTreeItem
        v-for="(item, index) in translateTreeRoot"
        :key="index"
        :item="item"
        :index="index"
        :title="fileHandle?.name"
      />
    </div>
    <div class="height-placeholder"></div>

    <I18nToolSettings v-model:visible="isShowToolSettings" />
  </div>
</template>

<style lang="scss">
@import '@/components/VueI18nEditTool/i18n-style';
.vue-i18n-edit-tool {
  width: 100%;
  height: 100%;
  overflow: auto;
  position: relative;
  scrollbar-width: thin;

  .n-page-header__extra {
    .quick-options {
      gap: 8px;
    }
  }

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
