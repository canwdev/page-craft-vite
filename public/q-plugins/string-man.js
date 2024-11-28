const {addPlugin, changeCase, copy} = window.$qlUtils

addPlugin(
  (valRef) => {
    return {
      // 🪢 #0776c6
      html: 'String Manipulation',
      iconClass: 'mdi mdi-format-letter-case-lower',
      // iconClass: 'mdi mdi-code-string',
      children: [
        'paramCase',
        'snakeCase',
        'camelCase',
        'pascalCase',
        'constantCase',
        'dotCase',
        'headerCase',
        'pathCase',
        'capitalCase',
        'sentenceCase',
        'noCase',
      ].map((type) => {
        const label = changeCase[type](type)
        return {
          label,
          props: {
            onClick: async () => {
              const result = changeCase[type](valRef.value)
              await copy(result, true)
            },
            class: 'font-code',
          },
          dynamicProps: {
            label,
            text: valRef,
            formatFn: (text) => changeCase[type](text || ''),
          },
        }
      }),
    }
  },
  {
    isStaticPlugin: true,
    isPresetPlugin: true,
  }
)
