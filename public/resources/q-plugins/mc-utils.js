const {addPlugin, copy} = window.$qlUtils
function guid_S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
}

const copyI18n = async (val, isObject = false) => {
  if (!val) {
    return
  }
  // 单行
  if (!val.includes('\n')) {
    const key = window.$mcUtils.formatI18nKey(val)
    if (isObject) {
      const obj = {[key]: val}
      await copy(obj, true)
    } else {
      await copy(key, true)
    }
    return
  }

  // 支持多行
  const json = window.$mcUtils.textConvertMultipleLine(val, window.$mcUtils.TextConvertMode.JSON)
  const lines = JSON.parse(json)
  let result = ''
  if (isObject) {
    result = {}
  }
  lines.forEach((l) => {
    const key = window.$mcUtils.formatI18nKey(l) || guid_S4()
    if (isObject) {
      // 检测重复键
      if (result[key]) {
        result[key + '__' + guid_S4()] = l
      } else {
        result[key] = l
      }
    } else {
      result += key + '\n'
    }
  })
  await copy(result, true)
}

const formatObjKey = async (text) => {
  const obj = JSON.parse(text)
  const result = {}
  for (const objKey in obj) {
    console.log(objKey);
    const key = window.$mcUtils.formatI18nKey(objKey) || guid_S4()
    // 检测重复键
    if (result[key]) {
      result[key + '__' + guid_S4()] = obj[objKey]
    } else {
      result[key] = obj[objKey]
    }
  }
  await copy(result, true)
};

if (!window.$mcUtils) {
  console.warn('window.$mcUtils is not defined')
} else {
  addPlugin(
    (valRef) => {
      return {
        label: 'PageCraft Utils',
        iconClass: 'mdi mdi-toolbox',
        children: [
          {
            label: '📋 Copy i18n key',
            props: {
              onClick: async () => {
                await copyI18n(valRef.value, false)
              },
            },
          },
          {
            label: '📋 Copy i18n object',
            props: {
              onClick: async () => {
                await copyI18n(valRef.value, true)
              },
            },
          },
          {
            label: '📋 Format object keys to i18n key',
            props: {
              onClick: async () => {
                await formatObjKey(valRef.value)
              },
            },
          },
          {
            label: '📃 Save input to file',
            props: {
              onClick: async () => {
                window.$mcUtils.handleExportFile(
                  await window.$mcUtils.promptGetFileName('filename.txt'),
                  valRef.value,
                  ''
                )
              },
            },
          },
          {
            label: '⌨️ Convert input to JSON',
            props: {
              onClick: async () => {
                const text = window.$mcUtils.textConvertMultipleLine(
                  valRef.value,
                  window.$mcUtils.TextConvertMode.JSON
                )
                await copy(text, true)
              },
            },
          },
          {
            label: '⌨️ Convert input to HTML',
            props: {
              onClick: async () => {
                const text = window.$mcUtils.textConvertMultipleLine(
                  valRef.value,
                  window.$mcUtils.TextConvertMode.HTML
                )
                await copy(text, true)
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
}
