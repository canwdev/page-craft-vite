<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {DirTreeItem} from '@/enum/vue-i18n-tool'
import _get from 'lodash/get'
import _set from 'lodash/set'
import _unset from 'lodash/unset'
import {handleReadSelectedFile} from '@/utils/exporter'
import {ClipboardPaste20Regular, Delete20Regular, SaveMultiple20Regular} from '@vicons/fluent'
import DialogTextEdit from '@/components/CommonUI/DialogTextEdit.vue'
import {useI18n} from 'vue-i18n'
import {readClipboardData} from '@/utils'
import {textConvertAdvanced} from '@/components/VueI18nEditTool/copy-enum'
import {useI18nToolSettingsStore} from '@/store/i18n-tool-settings'
import FieldEdit from '@/components/VueI18nEditTool/Single/FieldEdit.vue'
import {useBatchItem} from '@/components/VueI18nEditTool/BatchGUI/batch-hooks'
import {useI18nMainStore} from '@/store/i18n-tool-main'
import CcFlag from '@/components/VueI18nEditTool/CcFlag.vue'

export default defineComponent({
  name: 'SubGuiItem',
  components: {
    CcFlag,
    Delete20Regular,
    FieldEdit,
    DialogTextEdit,
    SaveMultiple20Regular,
    ClipboardPaste20Regular,
  },
  props: {
    dirItem: {
      type: Object as PropType<DirTreeItem>,
      required: true,
    },
  },
  emits: ['saveChanged'],
  setup(props, {emit}) {
    const {dirItem} = toRefs(props)
    const {t: $t} = useI18n()
    const i18nMainStore = useI18nMainStore()
    const i18nSetStore = useI18nToolSettingsStore()

    const {
      isLoading,
      currentItem,
      handleSaveFile,
      isLocalCreated,
      handleCreateFile,
      handleReload,
      subFilePathArr,
    } = useBatchItem(props)

    // 翻译文件的json对象
    let translateObj = shallowRef<any | null>(null)

    // 当前翻译的字段值
    const fieldValue = ref<any>(null)

    // 字段值是否发生变化
    const isChanged = ref(false)

    const getValue = () => {
      return _get(translateObj.value, i18nMainStore.translatePath, null)
    }
    const setValue = (val: any) => {
      try {
        _set(translateObj.value, i18nMainStore.translatePath, val)
      } catch (e: any) {
        console.error(e)
        window.$message.error(e.message)
        throw e
      }
    }
    const deleteField = () => {
      _unset(translateObj.value, i18nMainStore.translatePath)
      fieldValue.value = null
      isChanged.value = true
    }

    const cleanup = () => {
      translateObj.value = null
      fieldValue.value = null
      nextTick(() => {
        isChanged.value = false
      })
    }

    onBeforeUnmount(() => {
      cleanup()
    })

    watch(
      currentItem,
      async (value) => {
        if (!value) {
          cleanup()
          return
        }
        const file = await (value.entry as FileSystemFileHandle).getFile()
        const str = await handleReadSelectedFile(file)
        translateObj.value = JSON.parse(str as string)
        fieldValue.value = getValue()
        nextTick(() => {
          isChanged.value = false
        })
      },
      {immediate: true}
    )
    watch(fieldValue, () => {
      isChanged.value = true
    })
    watch(
      () => i18nMainStore.translatePath,
      (val) => {
        fieldValue.value = getValue()
        nextTick(() => {
          isChanged.value = false
        })
      }
    )

    const inputRef = ref()

    const isCreatingNotSave = ref(false)
    const createField = (val) => {
      setValue(val)
      fieldValue.value = val
      isCreatingNotSave.value = true

      nextTick(() => {
        inputRef.value.focus()
      })
    }

    const handlePasteFormat = (val) => {
      val = textConvertAdvanced(val, i18nSetStore.autoPasteTextConvertMode, {
        isTrimQuotes: i18nSetStore.autoPasteTrimQuotes,
      })

      return val
    }

    const pasteCreateField = async () => {
      const val: any = await readClipboardData()
      createField(handlePasteFormat(val))
    }

    const saveChange = async ({isEmit = false, isSetValue = false} = {}) => {
      if (!isChanged.value) {
        return
      }
      if (isSetValue) {
        setValue(fieldValue.value)
      }
      await handleSaveFile(JSON.stringify(translateObj.value, null, 2))
      isChanged.value = false
      if (isEmit) {
        emit('saveChanged')
      }
    }

    const cancelChange = () => {
      if (isCreatingNotSave.value) {
        // 取消创建
        deleteField()
        isCreatingNotSave.value = false
        return
      }
      fieldValue.value = getValue()
      nextTick(() => {
        isChanged.value = false
      })
    }

    const isShowArrayEdit = ref(false)
    const currentArrayString = ref<string>('')
    watch(isShowArrayEdit, (val) => {
      if (!val) {
        currentArrayString.value = ''
      }
    })
    const handlePreviewArrayText = () => {
      currentArrayString.value = JSON.stringify(fieldValue.value, null, 2)
      isShowArrayEdit.value = true
    }
    const handleSaveArray = (val) => {
      try {
        fieldValue.value = JSON.parse(val)
        isShowArrayEdit.value = false
      } catch (e: any) {
        console.error(e)
        window.$message.error(e.message)
      }
    }
    const handleDeleteField = () => {
      deleteField()
      saveChange()
    }

    return {
      i18nMainStore,
      i18nSetStore,
      currentItem,
      translateObj,
      fieldValue,
      isChanged,
      createField,
      pasteCreateField,
      saveChange,
      cancelChange,
      inputRef,
      isLocalCreated,
      handleCreateFile,
      handleReload,

      isShowArrayEdit,
      currentArrayString,
      handlePreviewArrayText,
      handleSaveArray,
      handleDeleteField,
      isLoading,
      subFilePathArr,
    }
  },
})
</script>

<template>
  <div class="batch-translate-item vp-panel" :data-translate-path="i18nMainStore.translatePath">
    <div class="mc-loading-container" v-if="isLoading">
      <n-spin size="small" />
    </div>

    <div class="card-header">
      <div class="card-title-wrap">
        <span class="card-title font-code">
          <CcFlag v-if="i18nSetStore.enableFlag" :cc="dirItem.label" />
          <span class="region-label">{{ dirItem.label }}</span>
          <template v-if="i18nSetStore.isFoldersMode">
            {{ '/' + subFilePathArr.join('/') }}
          </template>
        </span>
        <!--        <span class="translate-path">-->
        <!--          {{ i18nMainStore.translatePath }}-->
        <!--        </span>-->
      </div>

      <template v-if="currentItem && fieldValue !== null">
        <n-popconfirm @positive-click="handleDeleteField">
          <template #trigger>
            <n-button size="small" tertiary type="error" title="Delete Field">
              <template #icon>
                <Delete20Regular />
              </template>
            </n-button>
          </template>
          {{ $t('msgs.remove_item') }}
        </n-popconfirm>
      </template>
    </div>

    <div class="tip-not-exist" v-if="!currentItem">
      <template v-if="isLocalCreated">
        <n-button secondary size="small" @click="handleReload">
          {{ $t('actions.reload') }}
        </n-button>
      </template>
      <template v-else>
        File does not exist, please
        <b style="text-decoration: underline; cursor: pointer" @click="handleCreateFile()">
          create it
        </b>
        on your local file system
      </template>
    </div>
    <template v-else-if="i18nMainStore.translatePath">
      <n-space v-if="fieldValue !== null" align="center" size="small">
        <FieldEdit ref="inputRef" v-model="fieldValue" @previewArray="handlePreviewArrayText" />

        <n-button-group v-if="isChanged">
          <n-button
            size="small"
            type="primary"
            @click="saveChange({isEmit: true, isSetValue: true})"
            title="Batch Save"
          >
            <template #icon><SaveMultiple20Regular /></template>
          </n-button>
          <n-button secondary size="small" @click="cancelChange">
            {{ $t('actions.cancel') }}
          </n-button>
        </n-button-group>
      </n-space>
      <n-button-group v-else>
        <n-button
          size="small"
          @click="pasteCreateField()"
          type="primary"
          :title="`Auto Paste Create (${i18nSetStore.autoPasteTextConvertMode})`"
        >
          <template #icon>
            <ClipboardPaste20Regular />
          </template>
        </n-button>
        <n-button size="small" @click="createField('')" type="primary">{{
          $t('actions.create_text')
        }}</n-button>
        <n-button size="small" @click="createField([])">{{ $t('actions.create_array') }}</n-button>
      </n-button-group>
    </template>
    <div style="color: gray" v-else>{{ $t('msgs.please_select_a_tran') }}</div>

    <DialogTextEdit
      v-if="isShowArrayEdit"
      is-textarea
      :title="$t('common.array_detail')"
      :placeholder="$t('common.array_json_string')"
      v-model:visible="isShowArrayEdit"
      :text="currentArrayString"
      @onSave="handleSaveArray"
    />
  </div>
</template>

<style lang="scss">
.batch-translate-item {
  padding: 10px;
  margin-bottom: 10px;
  position: relative;

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    margin-bottom: 5px;
    .card-title-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .card-title {
      font-size: 14px;
      font-weight: 400;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      .region-label {
        color: #f44336;
        font-weight: 500;
      }
    }
  }

  .translate-path {
    max-width: 200px;
    font-size: 12px;
    opacity: 0.3;
  }

  .item-value-edit {
    width: 450px;
    &._button {
      width: 200px;
    }
  }

  .tip-not-exist {
    color: $primary;
    margin-bottom: 10px;
  }

  .item-value-edit-wrap {
    .item-value-edit {
      &.vp-input {
        min-height: 50px;
      }
    }
  }
}
</style>
