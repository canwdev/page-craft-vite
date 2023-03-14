<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {DirTreeItem} from '@/enum/vue-i18n-tool'
import _get from 'lodash/get'
import _set from 'lodash/set'
import {handleReadSelectedFile} from '@/utils/exporter'
// import countryCodeEmoji from '@/utils/country-code-emoji'

export default defineComponent({
  name: 'BatchTranslateItem',
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
  },
  setup(props, {emit}) {
    const {dirItem, filePathArr, translatePath} = toRefs(props)

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
      if (isFieldArray.value && text) {
        text = JSON.parse(text)
      }
      _set(translateObj.value, translatePath.value, text)
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
        window.$message.success('Saved!')
      } catch (error: any) {
        console.error(error)
        window.$message.error('Save Failed!' + error.message)
      }
    }

    // const countryFlag = computed(() => {
    //   const code = dirItem.value?.label.split('-').pop()
    //   return countryCodeEmoji(code)
    // })

    return {
      currentItem,
      translateObj,
      translateText,
      isChanged,
      async saveChange() {
        setText()
        await handleSaveFile()
        nextTick(() => {
          isChanged.value = false
        })
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
      },
      isFieldArray,
      // countryFlag,
    }
  },
})
</script>

<template>
  <n-card
    size="small"
    class="batch-translate-item"
    :title="dirItem.label + '/' + filePathArr.join('/')"
  >
    <template #header-extra>
      <span style="color: darkseagreen" class="font-code">{{ translatePath }}</span>
    </template>
    <div style="color: red; margin-bottom: 10px" v-if="!currentItem">
      File does not exist, please create it on your local file system
    </div>
    <template v-else-if="translatePath">
      <n-space v-if="translateText !== null" align="center">
        <n-input
          type="textarea"
          size="small"
          v-model:value="translateText"
          :placeholder="isFieldArray ? 'Input array' : 'Input text'"
          :rows="isFieldArray ? 8 : 1"
          style="width: 450px"
          :class="{'font-code': isFieldArray}"
        />
        <n-button size="small" v-if="isChanged" type="primary" @click="saveChange">Save</n-button>
        <n-button size="small" v-if="isChanged" @click="cancelChange">Cancel</n-button>
      </n-space>
      <n-space v-else>
        <n-button size="small" @click="createField('')" type="primary">Create text</n-button>
        <n-button size="small" @click="createField([])">Create Array</n-button>
      </n-space>
    </template>
    <div style="color: darkgoldenrod" v-else>Please select a translation field on the left</div>
  </n-card>
</template>

<style lang="scss" scoped>
.batch-translate-item {
  margin-bottom: 10px;
}
</style>
