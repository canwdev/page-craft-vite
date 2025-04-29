<script lang="ts" setup="">
import QrCodeDisplay from './QrCodeDisplay.vue'
import QRScanner from './QRScanner.vue'

const textInput = ref('')
</script>

<template>
  <div class="qr-code">
    <textarea v-model="textInput" class="vgo-input" placeholder="Input text..." rows="2"></textarea>
    <QrCodeDisplay :text="textInput" />
    <div style="opacity: 0.3">--- or ---</div>
    <QRScanner @onResult="(val) => (textInput = val)" />
  </div>
</template>

<style lang="scss" scoped>
.qr-code {
  padding: 16px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;

  textarea {
    width: 100%;
    box-sizing: border-box;
    flex-shrink: 0;
  }
}
</style>
