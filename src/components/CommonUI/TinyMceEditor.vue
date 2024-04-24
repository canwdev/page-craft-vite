<script lang="ts">
import Editor from '@tinymce/tinymce-vue'
import {defineComponent, ref, toRefs} from 'vue'
import {useVModel} from '@vueuse/core'

export default defineComponent({
  name: 'TinyMceEditor',
  components: {
    Editor,
  },
  inheritAttrs: false,
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    minimal: {
      type: Boolean,
      default: false,
    },
    dark: {
      type: Boolean,
      default: false,
    },
    contentCss: {
      type: String,
      default: 'dark',
    },
  },
  emits: ['update:modelValue', 'valueChange'],
  setup(props, {emit}) {
    const {contentCss, minimal, dark} = toRefs(props)
    // https://www.tiny.cloud/docs/tinymce/s6/basic-setup/
    const initOptions = ref({
      body_class: 'detail-rich-text',
      skin: dark.value ? 'oxide-dark' : 'oxide',
      content_css: contentCss.value,
      verify_html: false, // 防止消除空标签
      plugins: [
        'advlist',
        'autolink',
        'link',
        'image',
        'lists',
        'charmap',
        'preview',
        'anchor',
        'pagebreak',
        'searchreplace',
        'wordcount',
        'visualblocks',
        'visualchars',
        'code',
        'fullscreen',
        'insertdatetime',
        'media',
        'table',
        'emoticons',
        'template',
        'help',
      ],
      menubar: minimal.value ? '' : 'edit view insert format tools table help',
      height: 600,
      content_style: 'img {max-width: 100%;}',
      toolbar: minimal.value
        ? [
            'styles bold italic alignleft aligncenter alignright alignjustify bullist numlist forecolor backcolor',
          ]
        : [
            'undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | ',
            'bullist numlist outdent indent | link image | print preview media fullscreen | ' +
              'forecolor backcolor emoticons',
          ],
      relative_urls: false,
      remove_script_host: false,
      image_dimensions: false,
      /*      images_upload_handler: (blobInfo, progress) => {
        return new Promise(async (resolve, reject) => {
          try {
            const formData = new FormData()
            formData.append('files', blobInfo.blob(), blobInfo.filename())

            const params = articleImage.value
              ? {
                  type: FileUploadType.ARTICLE,
                }
              : {}

            const res = await serviceFms.post('/files/batch-upload', formData, {
              params: params,
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              onUploadProgress: (progressEvent) => {
                let imgLoadPercent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                progress(imgLoadPercent)
              },
            })
            const {
              files: [resFile],
            } = res
            console.log('resFile.url', {location: resFile.url})
            resolve(resFile.url)
          } catch (e) {
            reject(e)
          }
        })
      },*/
    })
    const mValue = useVModel(props, 'modelValue', emit)

    return {
      mValue,
      initOptions,
    }
  },
})
</script>

<template>
  <div class="tiny-mce-editor">
    <Editor v-model="mValue" :init="initOptions" v-bind="$attrs" />
  </div>
</template>

<style lang="scss">
.tiny-mce-editor {
  width: 100%;
  .tox-tinymce {
    width: 100%;
  }
}
</style>
