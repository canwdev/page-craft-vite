<script lang="ts">
import {defineComponent, ref} from 'vue'
import TranslateTreeItem from '@/components/VueI18nEditTool/Single/TranslateTreeItem.vue'
import {exportI18nTreeJsonObj, I18nJsonObjUtils, ITranslateTreeItem} from '@/enum/vue-i18n-tool'
import DropZone from '@/components/CommonUI/DropZone.vue'
import {useFileDrop} from '@/hooks/use-file-drop'
import {useBeforeUnload, useSaveShortcut} from '@/hooks/use-beforeunload'
import {useMainStore} from '@/store/main'
import {useI18n} from 'vue-i18n'
import I18nToolSettings from '@/components/VueI18nEditTool/I18nToolSettings.vue'
import {useOpenedHistory} from '@/components/VueI18nEditTool/file-history'
import {handleReadSelectedFile} from '@/utils/mc-utils/io'
import CommonNavbar from '@/components/CommonUI/CommonNavbar.vue'
import DropdownMenu from '@/components/VgoUI/packages/OptionUI/Tools/DropdownMenu.vue'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'
import {IDBSettingsKey, PageCraftKeys, SettingsTabType} from '@/enum/settings'

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
    DropdownMenu,
    CommonNavbar,
    I18nToolSettings,
    TranslateTreeItem,
    DropZone,
  },
  setup() {
    const {t: $t} = useI18n()
    const mainStore = useMainStore()
    const translateTreeRoot = ref<ITranslateTreeItem[]>(I18nJsonObjUtils.parseWithRoot())
    const isLoading = ref(false)

    const {appendHistory, historyMenuOptions} = useOpenedHistory(
      IDBSettingsKey.I18N_FILE_HANDLE_HISTORY,
      async (handle: FileSystemFileHandle) => {
        fileHandle.value = handle
        const file = await handle.getFile()
        await handleImport(file)
      },
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

    const loadDemo = () => {
      translateTreeRoot.value = I18nJsonObjUtils.parseWithRoot({
        hello_world: {
          section_a: {
            test_str: 'This is a test string',
            test_arr: ['line 1', 'line 2', 'line 3'],
            test_number: 114514,
            '': '中English混合',
          },
          section_b: {
            '': "Blur this input and it'll generate the key automatically!",
          },
          section_c: {
            '': '平行、行列',
          },
        },
      })
    }

    const handleSettings = () => {
      globalEventBus.emit(GlobalEvents.OPEN_SETTINGS, SettingsTabType.I18N)
    }
    return {
      translateTreeRoot,
      fileHandle,
      handleImport,
      handleSelectFile,
      handleCloseFile,
      handleSaveFile,
      handleExport,
      loadDemo,
      ...useFileDrop({
        cb: handleFileDrop,
      }),
      mainStore,
      isLoading,
      historyMenuOptions,
      handleSettings,
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
    v-loading="isLoading"
  >
    <transition name="mc-fade">
      <DropZone position-fixed v-show="showDropzone" :text="$t('msgs.drag_file_here')" />
    </transition>

    <CommonNavbar>
      <template #extra>
        <div class="flex-row-center-gap">
          <button class="vgo-button" @click="handleSettings()">
            {{ $t('common.settings') }}
          </button>

          <button
            class="vgo-button"
            @click="mainStore.isShowQuickLaunch = !mainStore.isShowQuickLaunch"
          >
            {{ $t('common.toolbox') }}
          </button>

          <el-popconfirm
            v-if="fileHandle"
            @confirm="handleCloseFile()"
            :title="$t('msgs.confirm_close')"
          >
            <template #reference>
              <button class="vgo-button">💻 {{ $t('actions.close') }} JSON</button>
            </template>
          </el-popconfirm>

          <DropdownMenu v-else :options="historyMenuOptions">
            <button class="vgo-button primary" @click="handleSelectFile()">
              💻 {{ $t('actions.open') }} JSON
            </button>
          </DropdownMenu>

          <button v-if="fileHandle" class="vgo-button primary" @click="handleSaveFile()">
            💾 {{ $t('actions.save') }}
          </button>

          <button class="vgo-button" @click="handleExport()">
            {{ $t('actions.save_as') }} ...
          </button>

          <el-popconfirm @confirm="loadDemo()" :title="$t('msgs.load_demo_this_will')">
            <template #reference>
              <button class="vgo-button">
                {{ $t('common.demo') }}
              </button>
            </template>
          </el-popconfirm>
        </div>
      </template>
    </CommonNavbar>

    <div class="scroll-content scrollbar-mini">
      <div class="i18n-container">
        <TranslateTreeItem
          v-for="(item, index) in translateTreeRoot"
          :key="index"
          :item="item"
          :index="index"
          :title="fileHandle?.name"
        />
        <div class="height-placeholder"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '@/components/VueI18nEditTool/i18n-style';
.vue-i18n-edit-tool {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;

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

  .scroll-content {
    flex: 1;
    overflow: auto;

    .i18n-container {
      max-width: 1000px;
      margin-left: auto;
      margin-right: auto;
      min-width: auto;
    }

    .translate-tree-item {
      .group-header {
        top: 0px;
      }
    }
  }
}
</style>
