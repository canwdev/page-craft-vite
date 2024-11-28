const {addPlugin, copy, ref, computed, watch} = window.$qlUtils

addPlugin(
  {
    label: 'Eye Drop',
    search: 'eyedrop',
    iconClass: 'mdi mdi-eyedropper-variant',
    props: {
      onClick: async () => {
        if ('EyeDropper' in window) {
          const eyeDropper = new window.EyeDropper()
          const result = await eyeDropper.open({})
          const {sRGBHex} = result
          await copy(sRGBHex, true)
        } else {
          window.$message.error(`window.EyeDropper is not supported`)
        }
      },
    },
  },
  {
    isPresetPlugin: true,
  }
)

let fonts = []
addPlugin(
  (valRef) => {
    return {
      label: 'System Fonts',
      iconClass: 'mdi mdi-format-size',
      // iconClass: 'mdi mdi-format-font',
      children: async () => {
        if (!fonts.length) {
          fonts = await window.queryLocalFonts()
          console.log(fonts)
        }

        // 支持直接返回vue3计算属性
        return computed(() => {
          return [
            ...fonts
              .filter((v) => {
                if (!valRef.value) {
                  return true
                }
                const sVal = valRef.value.trim().toLowerCase()
                return v.fullName.toLowerCase().includes(sVal)
              })
              .map((v) => {
                return {
                  label: v.fullName,
                  props: {
                    onClick: () => {
                      copy(v.fullName, true)
                    },
                    style: {fontFamily: v.fullName},
                  },
                }
              }),
          ]
        })
      },
    }
  },
  {
    isStaticPlugin: true,
    isPresetPlugin: true,
  }
)

// https://eeejay.github.io/webspeechdemos/
const synth = window.speechSynthesis
if (!synth) {
  console.warn('window.speechSynthesis is not supported')
} else {
  addPlugin(
    (valRef) => {
      return {
        label: 'Speech Synthesis',
        iconClass: 'mdi mdi-speaker-message',
        children: async () => {
          let voices = synth.getVoices()
          console.log(voices)
          return [
            ...voices.map((v) => {
              return {
                label: v.name,
                props: {
                  onClick: () => {
                    console.log(v, valRef.value)
                    const utterThis = new SpeechSynthesisUtterance(valRef.value)
                    utterThis.voice = v
                    utterThis.volume = 1
                    utterThis.pitch = 0.5

                    synth.speak(utterThis)
                  },
                },
              }
            }),
          ]
        },
      }
    },
    {
      isStaticPlugin: true,
      isPresetPlugin: true,
    }
  )
}
