<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {DirTreeItem} from '@/enum/vue-i18n-tool'
import _get from 'lodash/get'
import _set from 'lodash/set'
import {handleReadSelectedFile} from '@/utils/exporter'
import {DocumentEdit20Regular, SaveMultiple20Regular} from '@vicons/fluent'
import DialogTextEdit from '@/components/CommonUI/DialogTextEdit.vue'
import {useI18n} from 'vue-i18n'
// import countryCodeEmoji from '@/utils/country-code-emoji'

export default defineComponent({
  name: 'BatchTranslateItem',
  components: {DialogTextEdit, DocumentEdit20Regular, SaveMultiple20Regular},
  props: {
    dirItem: {
      type: Object as PropType<DirTreeItem>,
      required: true,
    },
    filePathArr: {
      type: Array as PropType<string[]>,
      default() {
        return []
      },
    },
    translatePath: {
      type: String,
      default: '',
    },
    // 是否为多文件夹模式，如果为否则当作单个文件处理
    isFoldersMode: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['saveChanged'],
  setup(props, {emit}) {
    const {t: $t} = useI18n()
    const {dirItem, filePathArr, translatePath, isFoldersMode} = toRefs(props)

    const findNode = (): DirTreeItem | null => {
      let find: DirTreeItem | null = null
      const recursiveFindItem = (children: DirTreeItem[] | null, dirArr: string[], depth = 0) => {
        const dirName = dirArr[depth]
        if (!children) {
          return
        }
        // console.log('---', depth, dirName)

        for (let i = 0; i < children.length; i++) {
          const child = children[i]
          if (child.label === dirName) {
            if (depth === dirArr.length - 1) {
              find = child
              throw new Error('item found')
            }
          }
          if (child.children) {
            recursiveFindItem(child.children, dirArr, depth + 1)
          }
        }
      }
      try {
        recursiveFindItem(dirItem.value.children, filePathArr.value)
      } catch (e) {
        // console.warn(e)
      }
      return find
    }

    const currentItem = computed(() => {
      if (!isFoldersMode.value) {
        // 单文件读取
        return dirItem.value
      }
      return findNode()
    })
    const translateObj = shallowRef<any>(null)
    const translateText = ref<string | null>(null)
    const isChanged = ref(false)
    const isFieldArray = ref(false)

    const getText = () => {
      const res = _get(translateObj.value, translatePath.value, null)
      if (Array.isArray(res)) {
        isFieldArray.value = true
        return JSON.stringify(res, null, 2)
      } else {
        isFieldArray.value = false
      }
      return res
    }
    const setText = (text = translateText.value) => {
      try {
        if (isFieldArray.value && text) {
          text = JSON.parse(text)
        }
        _set(translateObj.value, translatePath.value, text)
      } catch (e: any) {
        console.error(e)
        window.$message.error(e.message)
        throw e
      }
    }

    watch(
      currentItem,
      async (value) => {
        if (!value) {
          translateObj.value = null
          translateText.value = null
          isFieldArray.value = false
          nextTick(() => {
            isChanged.value = false
          })
          return
        }
        const file = await (value.entry as FileSystemFileHandle).getFile()
        const str = await handleReadSelectedFile(file)
        translateObj.value = JSON.parse(str as string)
        translateText.value = getText()
        nextTick(() => {
          isChanged.value = false
        })
      },
      {immediate: true}
    )
    watch(translateText, () => {
      isChanged.value = true
    })
    watch(translatePath, (val) => {
      translateText.value = getText()
      nextTick(() => {
        isChanged.value = false
      })
    })

    const handleSaveFile = async () => {
      try {
        if (!currentItem.value) {
          return
        }
        const fileHandle = currentItem.value.entry as FileSystemFileHandle
        if (!fileHandle) {
          return
        }
        const file = await fileHandle.getFile()
        // @ts-ignore
        const writable = await fileHandle.createWritable()

        // console.log('[translateObj.value]', translateObj.value)

        const txt = JSON.stringify(translateObj.value, null, 2)

        await writable.write(txt)
        await writable.close()
        window.$message.success($t('msgs.saved'))
      } catch (error: any) {
        console.error(error)
        window.$message.error($t('msgs.error') + error.message)
        throw error
      }
    }

    // const countryFlag = computed(() => {
    //   const code = dirItem.value?.label.split('-').pop()
    //   return countryCodeEmoji(code)
    // })

    const inputRef = ref()
    const isShowArrayEdit = ref(false)

    return {
      currentItem,
      translateObj,
      translateText,
      isChanged,
      async saveChange({isEmit = false} = {}) {
        if (!isChanged.value) {
          return
        }
        setText()
        await handleSaveFile()
        nextTick(() => {
          isChanged.value = false
        })
        if (isEmit) {
          emit('saveChanged')
        }
      },
      cancelChange() {
        translateText.value = getText()
        nextTick(() => {
          isChanged.value = false
        })
      },
      createField(val) {
        setText(val)
        translateText.value = val
        isFieldArray.value = Array.isArray(val)

        nextTick(() => {
          inputRef.value.focus()
        })
      },
      isFieldArray,
      inputRef,
      isShowArrayEdit,
      handleSaveArray(val) {
        try {
          JSON.parse(val) // validate only
          translateText.value = val
          isShowArrayEdit.value = false
        } catch (e: any) {
          console.error(e)
          window.$message.error(e.message)
        }
      },
      // countryFlag,
    }
  },
})
</script>

<template>
  <n-card size="small" class="batch-translate-item">
    <div class="card-header">
      <span class="card-title">
        <span class="text-red">{{ dirItem.label }}</span>
        <template v-if="isFoldersMode">
          {{ '/' + filePathArr.join('/') }}
        </template>
      </span>
      <span class="translate-path">
        {{ translatePath }}
      </span>
    </div>

    <div style="color: hotpink; margin-bottom: 10px" v-if="!currentItem">
      File does not exist, please create it on your local file system
    </div>
    <template v-else-if="translatePath">
      <n-space v-if="translateText !== null" align="center">
        <n-input
          ref="inputRef"
          type="textarea"
          size="small"
          v-model:value="translateText"
          :placeholder="isFieldArray ? $t('msgs.input_array') : $t('msgs.input_text')"
          :rows="isFieldArray ? 2 : 1"
          style="width: 450px"
          :class="{'font-code': isFieldArray}"
        />
        <n-button
          secondary
          v-if="isFieldArray"
          @click="isShowArrayEdit = true"
          size="small"
          :title="$t('actions.edit')"
        >
          <template #icon><DocumentEdit20Regular /></template>
        </n-button>

        <n-button
          size="small"
          v-if="isChanged"
          type="primary"
          @click="saveChange({isEmit: true})"
          title="Batch save"
        >
          <template #icon><SaveMultiple20Regular /></template>
        </n-button>
        <n-button secondary size="small" v-if="isChanged" @click="cancelChange">
          {{ $t('actions.cancel') }}
        </n-button>
      </n-space>
      <n-space v-else>
        <n-button size="small" @click="createField('')" type="primary">{{
          $t('actions.create_text')
        }}</n-button>
        <n-button size="small" @click="createField([])">{{ $t('actions.create_array') }}</n-button>
      </n-space>
    </template>
    <div style="color: gray" v-else>{{ $t('msgs.please_select_a_tran') }}</div>

    <DialogTextEdit
      is-textarea
      :title="$t('common.array_detail')"
      :placeholder="$t('common.array_json_string')"
      v-model:visible="isShowArrayEdit"
      :text="translateText"
      @onSave="handleSaveArray"
    />
  </n-card>
</template>

<style lang="scss" scoped>
.batch-translate-item {
  margin-bottom: 10px;

  :deep(.n-card__content) {
    padding: 10px;
  }

  .card-header {
    font-size: 12px;
    margin-bottom: 5px;
    .card-title {
      font-size: 14px;
      font-weight: 400;
    }
    .text-red {
      color: #f44336;
      font-weight: 500;
    }
  }

  .translate-path {
    max-width: 200px;
    font-size: 12px;
    opacity: 0.3;
    margin-left: 10px;
  }
}
</style>
