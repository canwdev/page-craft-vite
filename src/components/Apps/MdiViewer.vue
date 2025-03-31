<script lang="ts" setup="">
import {watchDebounced} from '@vueuse/core'

const textInput = ref('')

let metaList = ref([])

onMounted(async () => {
  metaList.value = await fetch('./resources/q-plugins/mdi-icon-viewer/meta-lite.json').then((res) =>
    res.json(),
  )
  console.log({metaList})
})

const filteredList = ref([])
watchDebounced(
  textInput,
  () => {
    if (!textInput.value) {
      filteredList.value = []
      return
    }
    const sVal = textInput.value.trim().toLowerCase()
    filteredList.value = metaList.value.filter((v) => {
      return (
        v.name.toLowerCase().includes(sVal) ||
        (v.tags_str ? v.tags_str.toLowerCase().includes(sVal) : false)
      )
    })
  },
  {debounce: 500},
)

const copyText = (item) => {
  window.$mcUtils.copy(item.name, true)
}
const copyHtml = (item) => {
  const iconClass = `mdi mdi-${item.name}`
  const htmlText = `<span class="${iconClass}"></span>`
  window.$mcUtils.copy(htmlText, true)
}
</script>

<template>
  <div class="md-i-viewer font-code">
    <div class="vgo-panel">
      <span class="mdi mdi-magnify"></span>
      <input
        v-model="textInput"
        class="vgo-input"
        placeholder="Filter icon name..."
        @keyup.esc="textInput = ''"
      />
      <span> {{ filteredList.length }} results </span>
    </div>
    <div v-if="filteredList.length" class="result-list">
      <div
        v-for="item in filteredList"
        :key="item.id"
        class="result-item"
        @click="copyText(item)"
        @contextmenu.prevent="copyHtml(item)"
      >
        <span class="i-icon" :class="[`mdi mdi-${item.name}`]"></span>
        <span class="i-title">{{ item.name }}</span>
        <span class="i-desc">{{ item.tags_str }}</span>
      </div>
    </div>
    <div v-else style="padding: 16px">
      Please input filter keywords.
      <a
        href="https://pictogrammers.com/library/mdi/"
        target="_blank"
        style="color: var(--vgo-primary)"
      >
        Material Design Icons
      </a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.md-i-viewer {
  display: flex;
  flex-direction: column;
  height: 100%;

  .vgo-panel {
    width: 100%;
    text-align: center;
    border-top: none;
    border-left: none;
    border-right: none;
    padding: 8px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 8px;
    .vgo-input {
      flex: 1;
    }
  }

  .result-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    grid-template-rows: auto;
    gap: 8px;
    padding: 8px;
    flex: 1;
    overflow: auto;
    box-sizing: border-box;

    .result-item {
      outline: 1px solid transparent;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      aspect-ratio: 1;
      border-radius: 4px;
      transition: all 0.2s;
      padding: 4px;
      gap: 4px;
      &:hover {
        background-color: var(--vgo-color-hover);
        outline-color: var(--vgo-primary);
        transition: all 0.1s;
      }

      &:active {
        background-color: var(--vgo-primary);
        color: white;
        outline-color: var(--vgo-primary);
        .i-icon {
          color: white;
        }
      }

      .i-icon {
        font-size: 48px;
        color: var(--vgo-primary);
        line-height: 1;
        transform: translateY(2px);
      }
      .i-title {
        line-height: 1.2;
        font-size: 14px;
        font-weight: 500;
      }
      .i-desc {
        font-size: 12px;
        line-height: 1.2;
        opacity: 0.5;
        font-weight: 300;
      }
    }
  }
}
</style>
