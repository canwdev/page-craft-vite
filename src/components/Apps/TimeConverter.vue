<script lang="ts" setup>
import moment from 'moment/moment'

const defaultFormat = 'YYYY-MM-DD HH:mm:ss'
const textInput = ref('')
const textOutput = ref('')
const timestamp = ref(0)
const convert = (d = new Date()) => {
  timestamp.value = d.getTime()
  const format = textInput.value.trim() || defaultFormat
  textOutput.value = moment(d).format(format)
}

let timer
onMounted(() => {
  convert()
  timer = setInterval(() => {
    convert()
  }, 1000)
})
onBeforeUnmount(() => {
  clearInterval(timer)
})

const copyText = (text) => {
  window.$mcUtils.copy(text, true)
}

const inputTimestamp = ref('')
const timestampToDisplay = computed(() => {
  let value = inputTimestamp.value

  if (!Number.isNaN(Number(value))) {
    value = Number(value)
  }

  const format = textInput.value.trim() || defaultFormat
  const timestamp = moment(value).unix() * 1000
  return {
    text: moment(value).format(format),
    timestamp,
  }
})
</script>

<template>
  <div class="time-converter flex-cols font-code">
    <div class="flex-rows">
      <span>Current timestamp:</span>
      <span class="clickable" @click="copyText(timestamp)">
        {{ timestamp }}
      </span>
    </div>
    <div class="flex-rows">
      <span class="f-label">Format</span>
      <input
        v-model="textInput"
        class="vgo-input"
        :placeholder="defaultFormat"
        @keyup.esc="textInput = ''"
      />
      <span class="mdi mdi-arrow-right"></span>
      <span class="clickable" @click="copyText(textOutput)"> {{ textOutput }}</span>
    </div>
    <div class="flex-rows">
      <span class="f-label">Input</span>
      <input
        v-model="inputTimestamp"
        class="vgo-input"
        placeholder="Input string/timestamp"
        @keyup.esc="inputTimestamp = ''"
      />
      <span class="mdi mdi-arrow-right"></span>
      <div class="flex-cols">
        <span class="clickable" @click="copyText(timestampToDisplay.text)">
          {{ timestampToDisplay.text }}</span
        >
        <span class="clickable" @click="copyText(timestampToDisplay.timestamp)">
          {{ timestampToDisplay.timestamp }}</span
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.time-converter {
  height: 100%;
  padding: 8px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  .flex-rows {
    gap: 8px;
    align-items: center;
  }
  .f-label {
    width: 50px;
  }
  .clickable {
    cursor: pointer;
    &:hover {
      background-color: var(--vgo-color-hover);
      color: var(--vgo-primary);
    }
  }
}
</style>
