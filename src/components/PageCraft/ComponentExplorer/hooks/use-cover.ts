import {IComponentItem} from '@/components/PageCraft/ComponentExplorer/enum'
import {takeScreenshot} from '@/utils/screenshot'
import {sleep} from '@/utils'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'
import {fileToBase64} from '@/utils/exporter'
import {normalizePath} from '@/components/FileManager/utils'
import {fsWebApi} from '@/components/FileManager/utils/providers/humanfs-api'

export const useComponentCover = ({exportComponentJson}) => {
  /*image cropper start*/
  const isShowImageCropper = ref(false)
  const cropperEditingSrc = ref('')
  const cropperCompleteCb = ref<any>(null) // 裁剪完成回调函数
  const cropperCancelCb = ref<any>(null) // 裁剪完成回调函数
  const startCropImage = (options) => {
    const {src = '', onComplete, onCancel} = options

    cropperEditingSrc.value = src
    cropperCompleteCb.value = onComplete
    cropperCancelCb.value = onCancel
    isShowImageCropper.value = true
  }
  const handleCropperSave = (base64url: string) => {
    if (typeof cropperCompleteCb.value === 'function') {
      cropperCompleteCb.value(base64url)
    }
    cropperCleanup()
  }
  const handleCropperCancel = () => {
    if (typeof cropperCancelCb.value === 'function') {
      cropperCompleteCb.value()
    }
    cropperCleanup()
  }
  const cropperCleanup = () => {
    isShowImageCropper.value = false
    cropperEditingSrc.value = ''
    cropperCancelCb.value = null
    cropperCompleteCb.value = null
  }
  /*image cropper end*/

  const setCover = async (item: IComponentItem, cover?: string) => {
    item.meta!.cover = cover
    const path = normalizePath(item.basePath + '/' + item.name + '/' + 'cover.base64')
    if (cover) {
      await fsWebApi.createFile({
        path,
        file: cover,
        isOverride: true,
      })
    } else {
      await fsWebApi.deleteEntry({
        path,
      })
    }
  }

  const getCoverOption = (item: IComponentItem) => {
    return {
      label: '🖼️ Cover',
      children: [
        {
          label: '🖼️ Capture cover...',
          props: {
            onClick: async () => {
              try {
                const base64url = await takeScreenshot({
                  async onCaptureStart() {
                    globalEventBus.emit(GlobalEvents.ON_COMP_PREVIEW, {
                      item: await exportComponentJson(item),
                      maximum: true,
                    })
                    await sleep(500)
                  },
                  quality: 0.7,
                })
                startCropImage({
                  src: base64url,
                  onComplete(newSrc) {
                    setCover(item, newSrc)
                  },
                })

                globalEventBus.emit(GlobalEvents.ON_COMP_PREVIEW_CLOSE, {maximum: false})
              } catch (e) {
                console.error(e)
                globalEventBus.emit(GlobalEvents.ON_COMP_PREVIEW_CLOSE, {maximum: false})
              }
            },
          },
        },
        {
          label: '🖼️ Upload cover',
          props: {
            onClick: async () => {
              // @ts-ignore
              const [handle] = await window.showOpenFilePicker({
                types: [
                  {
                    description: '🖼️ Cover Image',
                    accept: {
                      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
                    },
                  },
                ],
              })
              const file = await handle.getFile()
              const base64url = (await fileToBase64(file)) as string
              setCover(item, base64url)
            },
          },
        },
        item.meta!.cover && {
          label: '✏️ Edit cover',
          props: {
            onClick: async () => {
              startCropImage({
                src: item.meta!.cover,
                onComplete(newSrc) {
                  setCover(item, newSrc)
                },
              })
            },
          },
        },
        item.meta!.cover && {
          label: '❌ Remove cover',
          props: {
            onClick: async () => {
              setCover(item, undefined)
            },
          },
        },
      ].filter(Boolean),
    }
  }

  return {
    getCoverOption,

    // cover params
    isShowImageCropper,
    cropperEditingSrc,
    handleCropperSave,
    handleCropperCancel,
  }
}
