<script setup lang="ts">
import {ref} from 'vue'
import {
  DirTreeItem,
  exportI18nTreeJsonObj,
  formatTranslateTreeItem,
  I18nJsonObjUtils,
  ITranslateTreeItem,
} from '@/enum/vue-i18n-tool'
import BatchGUI from '@/components/VueI18nEditTool/BatchGUI/index.vue'
import DropZone from '@/components/CommonUI/DropZone.vue'
import {useFileDrop} from '@/hooks/use-file-drop'
import {useBeforeUnload, useSaveShortcut} from '@/hooks/use-beforeunload'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'
import TranslateTreeItem from '@/components/VueI18nEditTool/Single/TranslateTreeItem.vue'
import {useMainStore} from '@/store/main'
import {useI18n} from 'vue-i18n'
import {useI18nToolSettingsStore} from '@/components/VueI18nEditTool/store/i18n-tool-settings'
import I18nToolSettings from '@/components/VueI18nEditTool/I18nToolSettings.vue'
import BatchJson from '@/components/VueI18nEditTool/BatchJson/index.vue'
import {useI18nMainStore} from '@/components/VueI18nEditTool/store/i18n-tool-main'
import {useStorage} from '@vueuse/core'
import TabLayout from '@/components/CommonUI/TabLayout.vue'
import {useOpenedHistory} from '@/components/VueI18nEditTool/file-history'
import {LsKeys} from '@/enum/page-craft'
import {useGuiToolbox} from '@/components/VueI18nEditTool/BatchGUI/GuiToolbox/use-gui-toolbox'
import GuiToolbox from '@/components/VueI18nEditTool/BatchGUI/GuiToolbox/GuiToolbox.vue'
import {handleReadSelectedFile} from '@/utils/mc-utils/io'
import CommonNavbar from '@/components/CommonUI/CommonNavbar.vue'

const formatDirTreeItem = (data: any = {}): DirTreeItem => {
  return {
    key: data.key,
    kind: data.kind,
    label: data.label,
    entry: data.entry,
    parentDirs: data.parentDirs,
    children: data.children || null,
    prefix: () =>
      /*      h(
        NIcon,
        {size: 18},
        {
          default: () => h(data.kind === 'directory' ? Folder20Regular : Document20Regular),
        }
      ),*/
      h('span', {}, data.kind === 'directory' ? '📁' : '📄'),
  }
}

enum EditMode {
  JSON = 'json',
  GUI = 'gui',
  BATCH = 'batch',
}

const editModeOptions = [
  {
    label: 'JSON',
    value: EditMode.JSON,
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

const {t: $t} = useI18n()
const mainStore = useMainStore()
const i18nMainStore = useI18nMainStore()
const i18nSetStore = useI18nToolSettingsStore()

const {appendHistory, historyMenuOptions} = useOpenedHistory(
  LsKeys.I18N_FOLDER_HANDLE_HISTORY,
  async (handle: FileSystemFileHandle) => {
    async function doOpen() {
      dirHandle.value = handle as unknown as FileSystemDirectoryHandle
      await reloadPickedDir()
    }
    if (dirHandle.value) {
      window.$dialog
        .confirm($t('msgs.confirm_reload_files'), $t('actions.confirm'), {
          type: 'warning',
        })
        .then(() => {
          doOpen()
        })
        .catch()

      return
    }
    await doOpen()
  },
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
  parentKey: string = '',
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
        }),
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
          }),
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
          }),
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
    i18nMainStore.isLoading = true
    const handle = dirHandle.value
    let tree: DirTreeItem[] = []
    await reloadCurrentEditEntry()
    if (i18nSetStore.isFoldersMode) {
      tree = await recursiveReadDir(handle)
    } else {
      tree = await readJsonFiles(handle)
    }
    if (!tree.length) {
      window.$message.error('The content is empty, please check the folder directory structure!')
    }
    i18nMainStore.dirTree = tree
  } catch (e: any) {
    console.error(e)
    window.$message.error(e.message)
  } finally {
    i18nMainStore.isLoading = false
  }
}

const handleFileDrop = async (e) => {
  try {
    i18nMainStore.isLoading = true
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
    i18nMainStore.isLoading = false
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
    i18nMainStore.isLoading = true
    const fileHandle = currentEditEntry.value
    if (!fileHandle) {
      return
    }
    // @ts-ignore
    const writable = await fileHandle.createWritable()

    if (editMode.value !== EditMode.JSON) {
      editingTextValue.value = JSON.stringify(
        exportI18nTreeJsonObj(i18nMainStore.translateTreeRoot),
        null,
        2,
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
    i18nMainStore.isLoading = false
  }
}

const editMode = useStorage('vue_i18n_dir_tool_edit_mode', EditMode.BATCH, localStorage, {
  listenToStorageChanges: false,
})

const updateGuiTranslateTree = () => {
  if (editMode.value !== 'text') {
    if (!editingTextValue.value) {
      i18nMainStore.translateTreeRoot = []
      return
    }
    const obj = JSON.parse(editingTextValue.value as string)
    i18nMainStore.translateTreeRoot = I18nJsonObjUtils.parseWithRoot(obj)
  }
}

watch(editMode, (val) => {
  updateGuiTranslateTree()
})

useSaveShortcut(() => {
  if (currentEditEntry.value && editMode.value === EditMode.GUI) {
    handleSaveFile()
    return
  }
  globalEventBus.emit(GlobalEvents.I18N_SAVE_ALL_CHANGES)
})

useBeforeUnload(() => {
  return !!dirHandle.value
})

const isShowToolSettings = ref(false)

const {handleKeyClick, removeSelectedClass} = useGuiToolbox()

const reloadCurrentEditEntry = async () => {
  if (currentEditEntry.value) {
    const str = await handleReadSelectedFile(await currentEditEntry.value.getFile())
    editingTextValue.value = str as string
    removeSelectedClass()
    updateGuiTranslateTree()
  }
}
const nodeProps = ({option}: {option: DirTreeItem}) => {
  return {
    // 处理树枝的点击事件
    async onClick() {
      try {
        i18nMainStore.isLoading = true
        if (option.kind === 'file') {
          const entry = option.entry as FileSystemFileHandle
          currentEditEntry.value = entry
          i18nMainStore.filePathArr = [...option.parentDirs, option.label]
          i18nMainStore.translatePath = ''
          await reloadCurrentEditEntry()
        }
      } catch (e: any) {
        console.error(e)
        window.$message.error(e.message)
      } finally {
        i18nMainStore.isLoading = false
      }
    },
  }
}
const {showDropzone, fileDragover, fileDrop} = useFileDrop({
  cb: handleFileDrop,
})
</script>

<template>
  <div
    class="vue-i18n-dir-tool i18n-style"
    @dragover.prevent.stop="fileDragover"
    @dragleave.prevent.stop="showDropzone = false"
    @drop.prevent.stop="fileDrop"
    v-loading="i18nMainStore.isLoading"
  >
    <transition name="mc-fade">
      <DropZone position-fixed v-show="showDropzone" :text="$t('msgs.drag_folder_here')" />
    </transition>

    <CommonNavbar>
      <template #extra>
        <n-space size="small" align="center">
          <button class="vp-button" @click="isShowToolSettings = true">
            {{ $t('common.settings') }}
          </button>

          <button
            class="vp-button"
            @click="mainStore.isShowQuickLaunch = !mainStore.isShowQuickLaunch"
          >
            {{ $t('common.toolbox') }}
          </button>

          {{ $t('common.edit_mode') }}:
          <TabLayout v-model="editMode" horizontal :tab-list="editModeOptions" />

          <n-button
            size="small"
            secondary
            v-if="currentEditEntry && editMode === EditMode.GUI"
            type="primary"
            @click="handleSaveFile"
          >
            {{ $t('actions.save_changes') }}
          </n-button>

          <n-dropdown
            v-if="dirHandle"
            size="small"
            :options="historyMenuOptions"
            label-field="label"
            key-field="key"
          >
            <n-popconfirm @positive-click="handleCloseDir()">
              <template #trigger>
                <button class="vp-button primary">{{ $t('actions.close') }} Folder</button>
              </template>
              {{ $t('msgs.confirm_close') }}
            </n-popconfirm>
          </n-dropdown>

          <n-dropdown
            v-else
            size="small"
            :options="historyMenuOptions"
            label-field="label"
            key-field="key"
          >
            <button class="vp-button primary" @click="handlePickDir">
              {{ $t('actions.pick_i18n_directory') }}
            </button>
          </n-dropdown>

          <n-popconfirm v-if="dirHandle" @positive-click="reloadPickedDir()">
            <template #trigger>
              <button class="vp-button js_reload_btn">
                {{ $t('actions.reload') }}
              </button>
            </template>
            {{ $t('msgs.confirm_reload_files') }}
          </n-popconfirm>
        </n-space>
      </template>
    </CommonNavbar>

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
          <el-scrollbar style="height: 100%">
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
          </el-scrollbar>
        </n-layout-sider>
        <n-layout-content>
          <!--{{ expandedKeys }}-->
          <div class="main-edit-wrap">
            <template v-if="currentEditEntry">
              <!--文本编辑器-->
              <BatchJson v-if="editMode === EditMode.JSON" />

              <!--GUI模式/批处理模式-->
              <div v-else class="edit-content-wrap batch-mode">
                <el-scrollbar
                  class="gui-edit-gui"
                  :style="{width: editMode === EditMode.BATCH ? '500px' : '100%'}"
                >
                  <GuiToolbox
                    @reloadTranslates="reloadPickedDir"
                    v-if="editMode !== EditMode.JSON"
                    :is-batch-mode="editMode === EditMode.BATCH"
                  />

                  <TranslateTreeItem
                    v-for="(item, index) in i18nMainStore.translateTreeRoot"
                    :key="index"
                    :index="index"
                    :item="item"
                    :is-lite="editMode === EditMode.BATCH"
                    :title="i18nMainStore.filePathArr.join('/')"
                    @onKeyClick="handleKeyClick"
                  />
                </el-scrollbar>

                <!--批处理模式-->
                <el-scrollbar class="gui-edit-batch" v-if="editMode === EditMode.BATCH">
                  <BatchGUI />
                </el-scrollbar>
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
    .edit-content-wrap {
      flex: 1;
      overflow: hidden;
      padding: 0;
      display: flex;

      &.batch-mode {
        .translate-item {
          &._transition {
            transition: all 1s;
          }
          &.t_selected {
            background-color: $primary !important;
            transition: all 0.3s;
          }
          &.t_highlight {
            outline-offset: -1px;
            outline: 1px dashed #ffeb3b !important;
            &.t_highlight_current {
              outline: 2px solid #ff9800 !important;
            }
          }
        }
      }

      .gui-edit-gui {
        height: 100%;
        border-right: 1px solid $color_border;
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
