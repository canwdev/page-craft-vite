const {copy, addPlugin, base64Utils} = window.$qlUtils

const {btoa_utf8, atob_utf8, chooseFileToBase64} = base64Utils

addPlugin(
  (valRef) => {
    return {
      label: '🔤 Base64 Toolbox',
      children: [
        {
          label: 'Text to Base64',
          props: {
            onClick: () => {
              const str = btoa_utf8(valRef.value)
              copy(str, true)
            },
          },
        },
        {
          label: 'Base64 to Text',
          props: {
            onClick: () => {
              const str = atob_utf8(valRef.value)
              copy(str, true)
            },
          },
        },
        {
          label: '🖼️ Browse files to base64...',
          props: {
            onClick: async () => {
              const base64url = await chooseFileToBase64()
              await copy(base64url)
            },
          },
        },
      ],
    }
  },
  {
    isStaticPlugin: true,
    isPresetPlugin: true,
  }
)
