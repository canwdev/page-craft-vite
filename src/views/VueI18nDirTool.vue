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
import BatchTranslate from '@/components/VueI18nEditTool/BatchTranslate.vue'
import DropZone from '@/components/CommonUI/DropZone.vue'
import {useFileDrop} from '@/hooks/use-file-drop'
import {useMetaTitle} from '@/hooks/use-meta'
import DialogTextTransformer from '@/components/VueI18nEditTool/DialogTextTransformer.vue'
import {useSaveShortcut} from '@/hooks/use-beforeunload'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'
import VueMonaco from '@/components/CommonUI/VueMonaco.vue'
import dynamicLoadScript from '@/utils/dynamic-load-script'
import TranslateTreeItem from '@/components/VueI18nEditTool/TranslateTreeItem.vue'

let idSeed = 0

export default defineComponent({
  name: 'VueI18nBatchTool',
  components: {
    TranslateTreeItem,
    VueMonaco,
    BatchTranslate,
    DropZone,
    DialogTextTransformer,
  },
  setup() {
    const dirTree = ref<DirTreeItem[]>([])

    const recursiveReadDir = async (
      dirHandle,
      deep = 0,
      tree: DirTreeItem[] = [],
      parentDirs: string[] = []
    ): Promise<DirTreeItem[]> => {
      idSeed++
      let idx = 0
      for await (const entry of dirHandle.values()) {
        idx++
        let space = ''
        for (let i = 0; i < deep; i++) {
          space += '    '
        }

        if (entry.kind === 'directory') {
          // console.log(`${space}[D] ${entry.name}`, {entry})
          let children = []
          tree.push({
            key: `${idSeed}-D-${deep}-${idx}`,
            kind: entry.kind,
            label: entry.name,
            entry,
            parentDirs,
            children,
          })
          await recursiveReadDir(entry, deep + 1, children, [...parentDirs, entry.name])
        } else {
          // console.log(`${space}[F] ${entry.name}`, {entry})
          const isValidFile = /\.json$/gi.test(entry.name)
          if (isValidFile) {
            tree.push({
              key: `${idSeed}-F-${deep}-${idx}`,
              kind: entry.kind,
              label: entry.name,
              entry,
              parentDirs,
              children: null,
            })
          }
        }
      }
      return tree
    }

    const dirHandle = shallowRef()
    const handlePickDir = async () => {
      // https://css-tricks.com/getting-started-with-the-file-system-access-api/
      // https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryHandle
      // @ts-ignore
      dirHandle.value = await window.showDirectoryPicker()
      // console.log('dirHandle', dirHandle)
      dirTree.value = await recursiveReadDir(dirHandle.value)
    }
    const reloadPickedDir = async () => {
      dirTree.value = await recursiveReadDir(dirHandle.value)
    }

    const currentEditEntry = ref<FileSystemFileHandle | null>(null)
    const currentEditText = ref<string | null>(null)
    const currentFilePathArr = ref<string[]>([])

    const translatePath = ref('')

    const handleSaveFile = async () => {
      try {
        const fileHandle = currentEditEntry.value
        if (!fileHandle) {
          return
        }
        const file = await fileHandle.getFile()
        // @ts-ignore
        const writable = await fileHandle.createWritable()

        if (editMode.value !== 'text') {
          currentEditText.value = JSON.stringify(
            exportI18nTreeJsonObj(translateTreeRoot.value),
            null,
            2
          )
        }

        if (!currentEditText.value) {
          throw new Error('currentEditText is empty!')
        }
        await writable.write(currentEditText.value)
        await writable.close()
        await reloadPickedDir()
        window.$message.success('Saved!')
      } catch (error: any) {
        console.error(error)
        window.$message.error('Save Failed!' + error.message)
      }
    }

    type EditModeType = 'text' | 'gui' | 'batch'
    const editModeList = ['text', 'gui', 'batch']
    const editMode = ref<EditModeType>('batch')

    const translateTreeRoot = ref<ITranslateTreeItem[]>([formatTranslateTreeItem()])
    const updateGuiTranslateTree = () => {
      if (editMode.value !== 'text') {
        if (!currentEditText.value) {
          translateTreeRoot.value = []
          return
        }
        const obj = JSON.parse(currentEditText.value as string)
        translateTreeRoot.value = I18nJsonObjUtils.parseWithRoot(obj)
      }
    }

    watch(editMode, (val) => {
      updateGuiTranslateTree()
    })

    const {metaTitle} = useMetaTitle()
    const isShowCopyDialog = ref(false)

    useSaveShortcut(() => {
      if (currentEditEntry.value && editMode.value !== 'batch') {
        handleSaveFile()
        return
      }
      globalEventBus.emit(GlobalEvents.ON_I18N_SAVE_ALL_CHANGES)
    })

    const vueMonacoRef = ref()

    onMounted(async () => {
      await dynamicLoadScript(import.meta.env.BASE_URL + 'lib/pinyinjs/pinyin_dict_notone.min.js')
      await dynamicLoadScript(import.meta.env.BASE_URL + 'lib/pinyinjs/pinyinUtil.js')
    })

    return {
      metaTitle,
      iconTranslate,
      handlePickDir,
      dirTree,
      dirHandle,
      reloadPickedDir,
      vueMonacoRef,
      nodeProps: ({option}: {option: DirTreeItem}) => {
        return {
          async onClick() {
            if (option.kind === 'file') {
              const entry = option.entry as FileSystemFileHandle
              currentEditEntry.value = entry
              const str = await handleReadSelectedFile(await entry.getFile())
              currentEditText.value = str as string
              vueMonacoRef.value && vueMonacoRef.value.updateValue(str)
              currentFilePathArr.value = [...option.parentDirs, option.label]
              translatePath.value = ''
              updateGuiTranslateTree()
            }
          },
        }
      },
      currentEditText,
      currentEditEntry,
      handleSaveFile,
      editMode,
      editModeList,
      translateTreeRoot,
      currentFilePathArr,
      translatePath,
      handleKeyClick(str, event) {
        // console.log(str, event)
        const selector = '.translate-item'
        translatePath.value = str

        const els = Array.from(document.querySelectorAll(selector))
        els.forEach((el) => {
          el.classList.remove('active')
        })
        event.target.closest(selector).classList.add('active')
      },
      ...useFileDrop({
        cb: async (e) => {
          // Process all the items.
          for (const item of e.dataTransfer.items) {
            // Careful: `kind` will be 'file' for both file
            // _and_ directory entries.
            if (item.kind === 'file') {
              const entry = await item.getAsFileSystemHandle()
              if (entry.kind === 'directory') {
                dirHandle.value = entry
                dirTree.value = await recursiveReadDir(dirHandle.value)
              }
            }
          }
        },
      }),
      isShowCopyDialog,
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
      <DropZone v-show="showDropzone" text="Drop locale folder here" />
    </transition>

    <n-card size="small">
      <n-page-header subtitle="" @back="$router.push({name: 'HomeView'})">
        <template #title>{{ metaTitle }}</template>
        <template #avatar> <n-avatar :src="iconTranslate" style="background: none" /> </template>
        <template #extra>
          <n-space align="center">
            <n-button secondary size="small" @click="isShowCopyDialog = true">
              {{ $t('common.text_transformer') }}
            </n-button>

            <n-button
              secondary
              v-if="currentEditEntry && editMode !== 'batch'"
              type="primary"
              @click="handleSaveFile"
              >Save Changes</n-button
            >

            Edit Mode:<n-radio-group size="small" v-model:value="editMode">
              <n-radio-button
                v-for="mode in editModeList"
                :key="mode"
                :value="mode"
                :label="mode.toUpperCase()"
              />
            </n-radio-group>

            <n-button type="primary" size="small" @click="handlePickDir">
              Pick i18n Directory
            </n-button>

            <n-button secondary v-if="dirHandle" size="small" @click="reloadPickedDir">
              Refresh
            </n-button>
          </n-space>
        </template>
      </n-page-header>

      <DialogTextTransformer v-model:visible="isShowCopyDialog" />
    </n-card>

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
              :data="dirTree"
              :node-props="nodeProps"
              default-expand-all
              expand-on-click
              selectable
            />
          </n-scrollbar>
        </n-layout-sider>
        <n-layout-content>
          <div class="main-edit-wrap">
            <template v-if="currentEditEntry">
              <div v-if="false" class="action-row"></div>

              <div class="edit-content-wrap" :class="{'batch-mode': editMode === 'batch'}">
                <VueMonaco
                  ref="vueMonacoRef"
                  v-if="editMode === 'text'"
                  v-model="currentEditText"
                  language="json"
                  show-line-numbers
                />

                <template v-else>
                  <n-scrollbar
                    style="height: 100%"
                    :style="{width: editMode === 'batch' ? '500px' : '100%'}"
                  >
                    <TranslateTreeItem
                      v-for="(item, index) in translateTreeRoot"
                      :key="index"
                      :index="index"
                      :item="item"
                      :is-lite="editMode === 'batch'"
                      @onKeyClick="handleKeyClick"
                    />
                  </n-scrollbar>
                  <n-scrollbar v-if="editMode === 'batch'" style="height: 100%">
                    <BatchTranslate
                      :dir-tree="dirTree"
                      :file-path-arr="currentFilePathArr.slice(1)"
                      :translate-path="translatePath"
                    />
                  </n-scrollbar>
                </template>
              </div>
            </template>
            <div class="null-intro" v-else>
              <template v-if="dirTree.length">
                <div class="intro-title">
                  👈 请先选择一个json文件 <br />Please select a json file first
                </div>
              </template>
              <div class="font-code" v-else>
                <div class="intro-title">
                  📁 推荐的i18n目录结构：<br />Recommended i18n folder structure example:
                </div>
                <textarea
                  class="font-code"
                  readonly
                  cols="50"
                  rows="25"
                  :value="`└─locales    <-- Drag folder here! 拖拽文件夹到此
    ├─de-DE
    │      index.json
    │
    ├─en-US
    │      index.json
    │
    ├─es-ES
    │      index.json
    │
    ├─fr-FR
    │      index.json
    │
    ├─ja-JP
    │      index.json
    │
    ├─kr-KR
    │      index.json
    │
    ├─zh-CN
    │      index.json
    │
    └─zh-TW
            index.json`"
                ></textarea>
              </div>
            </div>
          </div>
        </n-layout-content>
      </n-layout>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.vue-i18n-copy-tool {
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
      padding: 10px;
      box-shadow: 0 0 5px rgba(71, 71, 71, 0.47);
      position: relative;
      z-index: 1;
    }
    .edit-content-wrap {
      flex: 1;
      overflow: hidden;
      padding: 0 0 0 10px;
      display: flex;

      &.batch-mode {
        :deep(.translate-item.active) {
          .n-input--focus {
            //background-color: rgba(98, 83, 82, 0.13);
          }
          .n-input__state-border {
            border-color: #f4ce36 !important;
            box-shadow: 0 0 10px rgba(244, 177, 54, 0.13) !important;
          }
        }
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
      color: #3a3a3a;
      background-color: lightyellow;
      font-size: 14px;
    }
  }
}
</style>
