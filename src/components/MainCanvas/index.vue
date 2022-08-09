<template>
  <div class="main-canvas" ref="mainCanvasRef" id="main_canvas" @click="addComponent">

  </div>
</template>

<script>
export default {
  name: 'MainCanvas',
  methods: {
    addComponent(e) {
      console.log('e', e)
      let targetEl
      if (e.target) {
        targetEl = e.target
      } else {
        targetEl = this.$refs.mainCanvasRef
      }
      const ael = document.createElement('div')
      ael.innerText = 'Block!'
      targetEl.appendChild(ael)
    }
  }
}
</script>

<style lang="scss">
.main-canvas {
  max-width: 1200px;
  min-height: 800px;
  margin: 0 auto;
  background: white;

  * {
    outline: 1px solid red;

    &:hover {
      outline-color: blue;
    }
  }
}
</style>
