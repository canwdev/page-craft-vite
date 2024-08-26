<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {DirTreeItem} from '@/enum/vue-i18n-tool'
import _get from 'lodash/get'
import _set from 'lodash/set'
import _unset from 'lodash/unset'
import DialogTextEdit from '@/components/CommonUI/DialogTextEdit.vue'
import {useI18n} from 'vue-i18n'
import {readClipboardData} from '@/utils'
import {textConvertAdvanced} from '@/utils/mc-utils/text-convert'
import {useI18nToolSettingsStore} from '@/components/VueI18nEditTool/store/i18n-tool-settings'
import FieldEdit from '@/components/VueI18nEditTool/Single/FieldEdit.vue'
import {useBatchItemV2} from '@/components/VueI18nEditTool/BatchGUI/batch-hooks'
import {BatchListItem, useI18nMainStore} from '@/components/VueI18nEditTool/store/i18n-tool-main'
import CcFlag from '@/components/VueI18nEditTool/CcFlag.vue'

export default defineComponent({
  name: 'SubGuiItem',
  components: {
    CcFlag,
    FieldEdit,
    DialogTextEdit,
  },
  props: {
    listItem: {
      type: Object as PropType<BatchListItem>,
      required: true,
    },
  },
  emits: ['saveChanged'],
  setup(props, {emit}) {
    const {listItem} = toRefs(props)
    const {t: $t} = useI18n()
    const i18nMainStore = useI18nMainStore()
    const i18nSetStore = useI18nToolSettingsStore()

    const {
      isLoading,
      handleSaveFile,
      isLocalCreated,
      handleCreateFile,
      handleReload,
      subFilePathArr,
    } = useBatchItemV2(props)

    // 翻译文件的json对象
    let localJson = computed(() => {
      return listItem.value.json
    })

    // 当前翻译的字段值
    const fieldValue = ref<any>(null)

    // 字段值是否发生变化
    const isChanged = ref(false)

    // 是否存在json文件
    const getIsJsonCreated = () => {
      return !!listItem.value.json
    }

    const getValue = () => {
      return _get(localJson.value, i18nMainStore.translatePath, null)
    }
    const setValue = (val: any, path = i18nMainStore.translatePath) => {
      try {
        if (!getIsJsonCreated()) {
          throw new Error('json file not exist!')
        }
        _set(listItem.value.json as any, path, val)
      } catch (e: any) {
        console.error(e)
        window.$message.error(e.message)
        throw e
      }
    }
    const deleteField = () => {
      _unset(localJson.value, i18nMainStore.translatePath)
      fieldValue.value = null
      isChanged.value = true
    }
    const renameField = (newPath) => {
      const value = getValue()
      _unset(localJson.value, i18nMainStore.translatePath)
      setValue(value, newPath)
      isChanged.value = true
    }

    const cleanup = () => {
      fieldValue.value = null
      nextTick(() => {
        isChanged.value = false
      })
    }

    onBeforeUnmount(() => {
      cleanup()
    })

    watch(
      listItem,
      async (value) => {
        if (!value.json) {
          cleanup()
          return
        }
        // console.log('[watch listItem]', value)
        fieldValue.value = getValue()
        nextTick(() => {
          isChanged.value = false
        })
      },
      {immediate: true},
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
      },
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
      await handleSaveFile(JSON.stringify(localJson.value, null, 2))
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
    const handleDeleteField = async () => {
      if (!getIsJsonCreated()) {
        return
      }
      deleteField()
      await saveChange()
    }
    // 外部调用批量重命名
    const handleRenameField = async (newPath) => {
      if (!getIsJsonCreated()) {
        return
      }
      renameField(newPath)
      await saveChange()
    }

    return {
      i18nMainStore,
      i18nSetStore,
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
      handleRenameField,
      getIsJsonCreated,
      isLoading,
      subFilePathArr,
    }
  },
})
</script>

<template>
  <div
    class="batch-translate-item vp-panel"
    :data-translate-path="i18nMainStore.translatePath"
    v-loading="isLoading"
  >
    <div class="card-header">
      <div class="card-title-wrap">
        <span class="card-title font-code">
          <CcFlag v-if="i18nSetStore.enableFlag" :cc="listItem.rootDir.label" />
          <span class="region-label">{{ listItem.rootDir.label }}</span>
          <template v-if="i18nSetStore.isFoldersMode">
            {{ '/' + subFilePathArr.join('/') }}
          </template>
        </span>
        <!--        <span class="translate-path">-->
        <!--          {{ i18nMainStore.translatePath }}-->
        <!--        </span>-->
      </div>

      <template v-if="listItem.json && fieldValue !== null">
        <el-popconfirm
          @confirm="handleDeleteField"
          :title="$t('msgs.remove_item')"
          :teleported="false"
        >
          <template #reference>
            <button class="btn-no-style" :title="$t('actions.delete')">
              <i class="fa fa-trash-o"></i>
            </button>
          </template>
        </el-popconfirm>
      </template>
    </div>

    <div class="tip-not-exist" v-if="!listItem.json">
      <template v-if="isLocalCreated">
        <button class="vp-button warning" @click="handleReload">
          {{ $t('actions.reload') }}
        </button>
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
      <div class="flex-row-center-gap" v-if="fieldValue !== null">
        <FieldEdit ref="inputRef" v-model="fieldValue" @previewArray="handlePreviewArrayText" />

        <div v-if="isChanged">
          <button
            class="vp-button warning"
            @click="saveChange({isEmit: true, isSetValue: true})"
            title="Batch Save"
          >
            <i class="fa fa-floppy-o" aria-hidden="true"></i>
          </button>
          <button class="vp-button" @click="cancelChange">
            {{ $t('actions.cancel') }}
          </button>
        </div>
      </div>
      <div v-else>
        <button
          @click="pasteCreateField()"
          class="vp-button primary"
          :title="`${$t('msgs.auto_paste')} Create (${i18nSetStore.autoPasteTextConvertMode})`"
        >
          <i class="fa fa-clipboard" aria-hidden="true"></i>
        </button>
        <button class="vp-button primary" @click="createField('')">
          {{ $t('actions.create_text') }}
        </button>
        <button class="vp-button" @click="createField([])">{{ $t('actions.create_array') }}</button>
      </div>
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
