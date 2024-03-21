<script lang="ts">
import {defineComponent, ref} from 'vue'
import iconTranslate from '../assets/textures/translate.svg?url'
import {handleReadSelectedFile} from '@/utils/exporter'
import {
  DirTreeItem,
  exportI18nTreeJsonObj,
  formatTranslateTreeItem,
  I18nJsonObjUtils,
  ITranslateTreeItem,
} from '@/enum/vue-i18n-tool'
import BatchTranslate from '@/components/VueI18nEditTool/BatchGUI/index.vue'
import DropZone from '@/components/CommonUI/DropZone.vue'
import {useFileDrop} from '@/hooks/use-file-drop'
import {useMetaTitle} from '@/hooks/use-meta'
import {useBeforeUnload, useSaveShortcut} from '@/hooks/use-beforeunload'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'
import TranslateTreeItem from '@/components/VueI18nEditTool/Single/TranslateTreeItem.vue'
import {useMainStore} from '@/store/main'
import {useI18n} from 'vue-i18n'
import {Document20Regular, Folder20Regular} from '@vicons/fluent'
import {NIcon} from 'naive-ui'
import {useI18nToolSettingsStore} from '@/store/i18n-tool-settings'
import I18nToolSettings from '@/components/VueI18nEditTool/I18nToolSettings.vue'
import BatchTextEditor from '@/components/VueI18nEditTool/BatchText/index.vue'
import {useI18nMainStore} from '@/store/i18n-tool-main'
import {useStorage} from '@vueuse/core'
import TabLayout from '@/components/CommonUI/TabLayout.vue'
import {useIDBKeyval} from '@vueuse/integrations/useIDBKeyval'
import {
  FileHandleHistory,
  useOpenedHistory,
  verifyPermission,
} from '@/components/VueI18nEditTool/file-history'
import {LsKeys} from '@/enum/page-craft'
import moment from 'moment/moment'
import QuickOptions from '@/components/CommonUI/QuickOptions/index.vue'
import {useGuiToolbox} from '@/components/VueI18nEditTool/BatchGUI/use-gui-toolbox'

const formatDirTreeItem = (data: any = {}): DirTreeItem => {
  return {
    key: data.key,
    kind: data.kind,
    label: data.label,
    entry: data.entry,
    parentDirs: data.parentDirs,
    children: data.children || null,
    prefix: () =>
      h(
        NIcon,
        {size: 18},
        {
          default: () => h(data.kind === 'directory' ? Folder20Regular : Document20Regular),
        }
      ),
  }
}

enum EditMode {
  TEXT = 'text',
  GUI = 'gui',
  BATCH = 'batch',
}

const editModeOptions = [
  {
    label: 'TEXT',
    value: EditMode.TEXT,
  },
  {
    label: 'SINGLE',
    value: EditMode.GUI,
  },
  {
    label: 'BATCH',
    value: EditMode.BATCH,
  },
]

export default defineComponent({
  name: 'VueI18nBatchTool',
  components: {
    QuickOptions,
    TabLayout,
    BatchTextEditor,
    I18nToolSettings,
    TranslateTreeItem,
    BatchTranslate,
    DropZone,
  },
  setup() {
    const {t: $t} = useI18n()
    const mainStore = useMainStore()
    const i18nMainStore = useI18nMainStore()
    const i18nSetStore = useI18nToolSettingsStore()
    const isLoading = ref(false)

    const {appendHistory, historyMenuOptions} = useOpenedHistory(
      LsKeys.I18N_FOLDER_HANDLE_HISTORY,
      async (handle: FileSystemFileHandle) => {
        dirHandle.value = handle as unknown as FileSystemDirectoryHandle
        await reloadPickedDir()
      }
    )

    // 保存手动展开的文件夹keys
    const expandedKeys = useStorage('vue_i18n_dir_tool_expanded_keys', [])

    const isValidDir = (name: string) => {
      return !i18nSetStore.ignoreFoldersMap[name]
    }

    // 递归读取文件夹
    const recursiveReadDir = async (
      dirHandle,
      deep = 0,
      tree: DirTreeItem[] = [],
      parentDirs: string[] = [],
      parentKey: string = ''
    ): Promise<DirTreeItem[]> => {
      let idx = 0
      for await (const entry of dirHandle.values()) {
        idx++
        let space = ''
        for (let i = 0; i < deep; i++) {
          space += '    '
        }

        if (entry.kind === 'directory' && isValidDir(entry.name)) {
          // console.log(`${space}[D] ${entry.name}`, {entry})
          let children = []
          const key = `${parentKey}${deep}-${entry.name}`
          tree.push(
            formatDirTreeItem({
              key,
              kind: entry.kind,
              label: entry.name,
              entry,
              parentDirs,
              children,
            })
          )
          await recursiveReadDir(entry, deep + 1, children, [...parentDirs, entry.name], key + '_')
        } else {
          // console.log(`${space}[F] ${entry.name}`, {entry})
          const isValidFile = /\.json$/gi.test(entry.name)
          if (isValidFile) {
            const key = `${parentKey}${deep}-${entry.name}`
            tree.push(
              formatDirTreeItem({
                key,
                kind: entry.kind,
                label: entry.name,
                entry,
                parentDirs,
                children: null,
              })
            )
          }
        }
      }

      // 排序
      tree.sort((a, b) => {
        if (a.kind === 'directory' && b.kind === 'file') {
          return -1 // 文件夹在文件的前面
        } else if (a.kind === 'file' && b.kind === 'directory') {
          return 1 // 文件在文件夹的后面
        } else {
          return 0 // 保持原有顺序
        }
      })
      // console.log('[recursiveReadDir]', tree)
      return tree
    }

    // 获取当前目录下的所有文件
    const readJsonFiles = async (dirHandle, tree: DirTreeItem[] = []): Promise<DirTreeItem[]> => {
      let idx = 0
      for await (const entry of dirHandle.values()) {
        idx++
        if (entry.kind !== 'directory') {
          const isValidFile = /\.json$/gi.test(entry.name)
          if (isValidFile) {
            const key = `${idx}-${entry.kind}-${entry.name}`
            tree.push(
              formatDirTreeItem({
                key: key,
                kind: entry.kind,
                label: entry.name,
                entry,
                parentDirs: [],
                children: null,
              })
            )
          }
        }
      }
      console.log('[readJsonFiles]', tree)
      return tree
    }

    const dirHandle = shallowRef<FileSystemDirectoryHandle>()
    const handlePickDir = async () => {
      // https://css-tricks.com/getting-started-with-the-file-system-access-api/
      // https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryHandle
      // @ts-ignore
      const handle = await window.showDirectoryPicker()
      await appendHistory(handle)
      dirHandle.value = handle
      // console.log('dirHandle', dirHandle)
      await reloadPickedDir()
    }
    const reloadPickedDir = async () => {
      try {
        isLoading.value = true
        const handle = dirHandle.value
        let tree: DirTreeItem[] = []
        if (i18nSetStore.isFoldersMode) {
          tree = await recursiveReadDir(handle)
        } else {
          tree = await readJsonFiles(handle)
        }
        if (!tree.length) {
          window.$message.error(
            'The content is empty, please check the folder directory structure!'
          )
        }
        i18nMainStore.dirTree = tree
      } catch (e: any) {
        console.error(e)
        window.$message.error(e.message)
      } finally {
        isLoading.value = false
      }
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
            if (handle.kind === 'directory') {
              await appendHistory(handle)
              dirHandle.value = handle
              await reloadPickedDir()
              break
            } else {
              window.$message.error('Please drag and drop a folder here!')
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

    const handleCloseDir = () => {
      dirHandle.value = undefined
      currentEditEntry.value = null
      editingTextValue.value = null
      i18nMainStore.dirTree = []
      i18nMainStore.filePathArr = []
    }

    const currentEditEntry = ref<FileSystemFileHandle | null>(null)
    const editingTextValue = ref<string | null>(null)

    const handleSaveFile = async () => {
      try {
        isLoading.value = true
        const fileHandle = currentEditEntry.value
        if (!fileHandle) {
          return
        }
        // @ts-ignore
        const writable = await fileHandle.createWritable()

        if (editMode.value !== EditMode.TEXT) {
          editingTextValue.value = JSON.stringify(
            exportI18nTreeJsonObj(translateTreeRoot.value),
            null,
            2
          )
        }

        if (!editingTextValue.value) {
          throw new Error('editingTextValue is empty!')
        }
        await writable.write(editingTextValue.value)
        await writable.close()
        await reloadPickedDir()
        window.$message.success($t('msgs.saved'))
      } catch (error: any) {
        console.error(error)
        window.$message.error('Save Failed!' + error.message)
      } finally {
        isLoading.value = false
      }
    }

    const editMode = useStorage('vue_i18n_dir_tool_edit_mode', EditMode.BATCH)

    const translateTreeRoot = ref<ITranslateTreeItem[]>([formatTranslateTreeItem()])
    const updateGuiTranslateTree = () => {
      if (editMode.value !== 'text') {
        if (!editingTextValue.value) {
          translateTreeRoot.value = []
          return
        }
        const obj = JSON.parse(editingTextValue.value as string)
        translateTreeRoot.value = I18nJsonObjUtils.parseWithRoot(obj)
      }
    }

    watch(editMode, (val) => {
      updateGuiTranslateTree()
    })

    const {metaTitle} = useMetaTitle()

    useSaveShortcut(() => {
      if (currentEditEntry.value && editMode.value === EditMode.GUI) {
        handleSaveFile()
        return
      }
      globalEventBus.emit(GlobalEvents.I18N_SAVE_ALL_CHANGES)
    })

    const vueMonacoRef = ref()

    useBeforeUnload(() => {
      return !!dirHandle.value
    })

    const isShowToolSettings = ref(false)

    const nodeProps = ({option}: {option: DirTreeItem}) => {
      return {
        // 处理树枝的点击事件
        async onClick() {
          try {
            isLoading.value = true
            if (option.kind === 'file') {
              const entry = option.entry as FileSystemFileHandle
              currentEditEntry.value = entry
              const str = await handleReadSelectedFile(await entry.getFile())
              editingTextValue.value = str as string
              i18nMainStore.filePathArr = [...option.parentDirs, option.label]
              i18nMainStore.translatePath = ''
              updateGuiTranslateTree()
            }
          } catch (e: any) {
            console.error(e)
            window.$message.error(e.message)
          } finally {
            isLoading.value = false
          }
        },
      }
    }

    return {
      metaTitle,
      i18nMainStore,
      iconTranslate,
      handlePickDir,
      handleCloseDir,
      dirHandle,
      reloadPickedDir,
      vueMonacoRef,
      nodeProps,
      editingTextValue,
      currentEditEntry,
      handleSaveFile,
      editMode,
      EditMode,
      editModeOptions,
      translateTreeRoot,
      ...useFileDrop({
        cb: handleFileDrop,
      }),
      i18nSetStore,
      mainStore,
      isShowToolSettings,
      isLoading,
      expandedKeys,
      historyMenuOptions,
      ...useGuiToolbox(),
    }
  },
})
</script>

<template>
  <div
    class="vue-i18n-dir-tool i18n-style"
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
      <DropZone position-fixed v-show="showDropzone" :text="$t('msgs.drag_folder_here')" />
    </transition>

    <div class="vp-bg navbar-wrap">
      <n-page-header subtitle="" @back="$router.push({name: 'HomePage'})">
        <template #title>{{ metaTitle }}</template>
        <template #avatar> <n-avatar :src="iconTranslate" style="background: none" /> </template>
        <template #extra>
          <n-space align="center">
            <n-button secondary size="small" @click="isShowToolSettings = true">
              {{ $t('common.settings') }}
            </n-button>

            <n-button secondary size="small" @click="mainStore.isShowQuickLaunch = true">
              {{ $t('common.tools') }}
            </n-button>

            <n-button
              size="small"
              secondary
              v-if="currentEditEntry && editMode === EditMode.GUI"
              type="primary"
              @click="handleSaveFile"
            >
              {{ $t('actions.save_changes') }}
            </n-button>

            {{ $t('common.edit_mode') }}:
            <TabLayout v-model="editMode" horizontal :tab-list="editModeOptions" />

            <n-popconfirm v-if="dirHandle" @positive-click="handleCloseDir()">
              <template #trigger>
                <n-button secondary type="primary" size="small">
                  {{ $t('actions.close') }} Folder
                </n-button>
              </template>
              {{ $t('msgs.confirm_close') }}
            </n-popconfirm>

            <n-dropdown v-else size="small" :options="historyMenuOptions">
              <n-button type="primary" size="small" @click="handlePickDir">
                {{ $t('actions.pick_i18n_directory') }}
              </n-button>
            </n-dropdown>

            <n-popconfirm v-if="dirHandle" @positive-click="reloadPickedDir()">
              <template #trigger>
                <n-button secondary size="small" class="js_reload_btn">
                  {{ $t('actions.reload') }}
                </n-button>
              </template>
              {{ $t('msgs.confirm_reload_files') }}
            </n-popconfirm>
          </n-space>
        </template>
      </n-page-header>
    </div>

    <div class="_container">
      <n-layout style="height: 100%" has-sider>
        <n-layout-sider
          collapse-mode="width"
          :collapsed-width="0"
          :width="300"
          show-trigger="arrow-circle"
          content-style="padding: 10px;"
          bordered
        >
          <n-scrollbar style="height: 100%">
            <n-tree
              block-line
              :data="i18nMainStore.dirTree"
              :node-props="nodeProps"
              :default-expand-all="false"
              expand-on-click
              selectable
              class="font-code"
              virtual-scroll
              v-model:expanded-keys="expandedKeys"
            />
          </n-scrollbar>
        </n-layout-sider>
        <n-layout-content>
          <!--{{ expandedKeys }}-->
          <div class="main-edit-wrap">
            <template v-if="currentEditEntry">
              <!--文本编辑器-->
              <!--<template v-if="editMode === EditMode.TEXT">-->
              <!--  <n-card class="action-row">-->
              <!--    {{ i18nMainStore.filePathArr.join('/') }}-->
              <!--  </n-card>-->
              <!--  <div class="edit-content-wrap">-->
              <!--    <VueMonaco-->
              <!--      ref="vueMonacoRef"-->
              <!--      v-model="editingTextValue"-->
              <!--      language="json"-->
              <!--      show-line-numbers-->
              <!--    />-->
              <!--  </div>-->
              <!--</template>-->
              <BatchTextEditor v-if="editMode === EditMode.TEXT" />

              <!--GUI模式-->
              <div v-else class="edit-content-wrap batch-mode">
                <n-scrollbar
                  class="gui-edit-gui"
                  :style="{width: editMode === EditMode.BATCH ? '500px' : '100%'}"
                >
                  <div v-if="editMode === EditMode.BATCH" class="vp-bg action-row">
                    <button class="vp-button" @click="isShowToolboxMenu = !isShowToolboxMenu">
                      Gui Toolbox
                    </button>
                    <!-- {{ i18nMainStore.filePathArr.join('/') }}-->
                    <QuickOptions
                      style="top: 100%"
                      v-model:visible="isShowToolboxMenu"
                      :options="guiToolboxOptions"
                    />
                  </div>

                  <TranslateTreeItem
                    v-for="(item, index) in translateTreeRoot"
                    :key="index"
                    :index="index"
                    :item="item"
                    :is-lite="editMode === EditMode.BATCH"
                    :title="i18nMainStore.filePathArr.join('/')"
                    @onKeyClick="handleKeyClick"
                  />
                </n-scrollbar>

                <!--批处理模式-->
                <n-scrollbar class="gui-edit-batch" v-if="editMode === EditMode.BATCH">
                  <BatchTranslate />
                </n-scrollbar>
              </div>
            </template>

            <!--未打开文件夹，展示提示-->
            <div class="null-intro" v-else>
              <template v-if="i18nMainStore.dirTree.length">
                <div class="intro-title">👈 {{ $t('msgs.please_select_a_json') }}</div>
              </template>
              <div class="font-code" v-else>
                <n-space align="center" class="intro-title">
                  <n-switch size="large" v-model:value="i18nSetStore.isFoldersMode">
                    <template #checked>{{ $t('common.folders_mode') }}</template>
                    <template #unchecked>{{ $t('common.files_mode') }}</template>
                  </n-switch>

                  📁 {{ $t('msgs.recommended_i18n_fol') }}:
                </n-space>
                <textarea
                  class="font-code"
                  :class="{_alt: !i18nSetStore.isFoldersMode}"
                  readonly
                  cols="50"
                  rows="20"
                  :value="
                    i18nSetStore.isFoldersMode
                      ? `└─[locales]    --> ${$t('msgs.drag_folder_here')}!
   ├─de-DE
   │  └─index.json
   ├─en-US
   │  └─index.json
   ├─es-ES
   │  └─index.json
   ├─fr-FR
   │  └─index.json
   ├─ja-JP
   │  └─index.json
   ├─kr-KR
   │  └─index.json
   ├─zh-CN
   │  └─index.json
   └─zh-TW
      └─index.json`
                      : `└─[locales]    --> ${$t('msgs.drag_folder_here')}!
   ├─ ar.json
   ├─ cn.json
   ├─ de.json
   ├─ en.json
   ├─ es.json
   ├─ fr.json
   ├─ it.json
   ├─ jp.json
   └─ kr.json
`
                  "
                ></textarea>
              </div>
            </div>
          </div>
        </n-layout-content>
      </n-layout>
    </div>

    <I18nToolSettings v-model:visible="isShowToolSettings" />
  </div>
</template>

<style lang="scss">
@import '@/components/VueI18nEditTool/i18n-style';
.vue-i18n-dir-tool {
  width: 100%;
  height: 100%;
  overflow: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  ._container {
    width: 100%;
    flex: 1;
    overflow: hidden;
  }
  .main-edit-wrap {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 100%;
    .action-row {
      font-size: 12px;
      border: none;
      box-shadow: 0 0 5px rgba(71, 71, 71, 0.47);
      position: relative;
      z-index: 1;
      gap: 4px;
      display: flex;
      .vp-button {
        font-size: 12px;
        padding: 2px 4px;
        height: auto;
      }
    }
    .edit-content-wrap {
      flex: 1;
      overflow: hidden;
      padding: 0;
      display: flex;

      &.batch-mode {
        .translate-item.active {
          background-color: $primary !important;
        }
      }

      .gui-edit-gui {
        height: 100%;
        .action-row {
          position: sticky;
          top: 0;
          z-index: 2;
        }
      }

      .gui-edit-batch {
        height: 100%;
      }
    }
  }

  .null-intro {
    padding: 20px;
    user-select: none;
    .intro-title {
      margin-bottom: 4px;
      font-size: 18px;
      font-weight: 500;
    }
    textarea {
      resize: none;
      color: #ff0;
      background-color: black;
      font-size: 14px;
      &._alt {
        color: #0f0;
      }
    }
  }
}
</style>
