<script lang="ts">
import {TreeOption} from 'naive-ui'
import {defineComponent} from 'vue'
import iconTranslate from '../assets/textures/translate.svg?url'
import {handleReadSelectedFile} from '@/utils/exporter'
import {
  exportI18nTreeJsonObj,
  formatTranslateTreeItem,
  ITranslateTreeItem,
  parseI18nJsonObj,
} from '@/enum/vue-i18n-copy-tool'

type DirTreeItem = {
  key: string
  kind: 'directory' | 'file'
  label: string
  entry: FileSystemDirectoryHandle | FileSystemFileHandle
  children: DirTreeItem[] | null
}

let idSeed = 0

export default defineComponent({
  name: 'VueI18nDirTool',
  components: {},
  setup() {
    const dirTree = shallowRef<DirTreeItem[]>([])

    const recursiveReadDir = async (
      dirHandle,
      deep = 0,
      tree: DirTreeItem[] = []
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
            children,
          })
          await recursiveReadDir(entry, deep + 1, children)
        } else {
          // console.log(`${space}[F] ${entry.name}`, {entry})
          tree.push({
            key: `${idSeed}-F-${deep}-${idx}`,
            kind: entry.kind,
            label: entry.name,
            entry,
            children: null,
          })
        }
      }
      return tree
    }

    const handlePickDir = async () => {
      // https://css-tricks.com/getting-started-with-the-file-system-access-api/
      // https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryHandle
      // @ts-ignore
      const dirHandle = await window.showDirectoryPicker()
      // console.log('dirHandle', dirHandle)
      dirTree.value = await recursiveReadDir(dirHandle)
    }

    const isShowFileEdit = ref(false)
    const currentEditEntry = ref<FileSystemFileHandle | null>(null)
    const currentEditText = ref<string | null>(null)
    const handleSaveFile = async () => {
      try {
        const fileHandle = currentEditEntry.value
        if (!fileHandle) {
          return
        }
        const file = await fileHandle.getFile()
        // @ts-ignore
        const writable = await fileHandle.createWritable()

        if (editMode.value === 'gui') {
          currentEditText.value = JSON.stringify(
            exportI18nTreeJsonObj(translateTreeRoot.value),
            null,
            2
          )
        }

        await writable.write(currentEditText.value)
        await writable.close()
        window.$message.success('Saved!')
      } catch (error: any) {
        console.error(error)
        window.$message.error('Save Failed!' + error.message)
      }
    }

    type EditModeType = 'text' | 'gui' | 'batch'
    const editModeList = ['text', 'gui', 'batch']
    const editMode = ref<EditModeType>('gui')

    const translateTreeRoot = ref<ITranslateTreeItem[]>([formatTranslateTreeItem()])
    const updateGuiTranslateTree = () => {
      if (editMode.value !== 'text') {
        if (!currentEditText.value) {
          translateTreeRoot.value = []
          return
        }
        const obj = JSON.parse(currentEditText.value as string)
        translateTreeRoot.value = parseI18nJsonObj(obj)
      }
    }

    watch(editMode, (val) => {
      updateGuiTranslateTree()
    })

    return {
      iconTranslate,
      handlePickDir,
      dirTree,
      nodeProps: ({option}: {option: DirTreeItem}) => {
        return {
          async onClick() {
            if (option.kind === 'file') {
              const entry = option.entry as FileSystemFileHandle
              currentEditEntry.value = entry
              const str = await handleReadSelectedFile(await entry.getFile())
              currentEditText.value = str as string
              isShowFileEdit.value = true
              updateGuiTranslateTree()
            }
          },
        }
      },
      isShowFileEdit,
      currentEditText,
      handleSaveFile,
      editMode,
      editModeList,
      translateTreeRoot,
    }
  },
})
</script>

<template>
  <div class="vue-i18n-copy-tool">
    <n-card size="small">
      <n-page-header subtitle="" @back="$router.push({name: 'HomeView'})">
        <template #title> Vue i18n Dir Tool </template>
        <template #avatar> <n-avatar :src="iconTranslate" style="background: none" /> </template>
        <template #extra>
          <n-space align="center">
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
          </n-space>
        </template>
      </n-page-header>
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
            <template v-if="isShowFileEdit">
              <div class="action-row">
                <n-button type="primary" @click="handleSaveFile">Save File</n-button>
              </div>

              <div class="edit-content-wrap">
                <n-input
                  v-if="editMode === 'text'"
                  type="textarea"
                  v-model:value="currentEditText"
                  class="font-code"
                  style="height: 100%"
                  placeholder="Edit Text"
                ></n-input>

                <template v-else>
                  <n-scrollbar
                    style="height: 100%"
                    :style="{width: editMode === 'batch' ? '400px' : '100%'}"
                  >
                    <TranslateTreeItem
                      v-for="(item, index) in translateTreeRoot"
                      :key="index"
                      :item="item"
                      :is-lite="editMode === 'batch'"
                    />
                  </n-scrollbar>
                  <n-scrollbar v-if="editMode === 'batch'" style="height: 100%">
                    batch
                  </n-scrollbar>
                </template>
              </div>
            </template>
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
      padding: 10px;
      padding-top: 0;
      display: flex;
    }
  }
}
</style>
