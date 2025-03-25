<script lang="ts" setup="">
import QrCodeDisplay from './QrCodeDisplay.vue'
import QRScanner from './QRScanner.vue'

const textInput = ref('')
</script>

<template>
  <div class="qr-code">
    <textarea v-model="textInput" class="vp-input" placeholder="Input text..."></textarea>
    <QrCodeDisplay :text="textInput" />
    <div style="opacity: 0.3">--- or ---</div>
    <QRScanner @onResult="(val) => (textInput = val)" />
  </div>
</template>

<style lang="scss" scoped>
.qr-code {
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  textarea {
    width: 100%;
    height: 50px;
  }
}
</style>
