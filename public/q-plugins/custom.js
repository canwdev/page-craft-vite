;(function () {
  const {addPlugin, copy} = window.$qlUtils

  if (!window.$mcUtils) {
    console.warn('window.$mcUtils is not defined')
    return
  }

  const labelArr = [
    {
      reg: /^阿拉伯语：|^Arabic:/,
      name: 'عربى',
      iso: 'ar-AR',
    },
    {
      reg: /^德语：|^German:/,
      name: 'Deutsch',
      iso: 'de-DE',
    },
    {
      reg: /^英语：|^English:/,
      name: 'English',
      iso: 'en-US',
    },
    {
      reg: /^西语：|^Spanish:/,
      name: 'Español',
      iso: 'es-ES',
    },
    {
      reg: /^法语：|^French:/,
      name: 'Français',
      iso: 'fr-FR',
    },
    {
      reg: /^意大利语：|^Italian:/,
      name: 'Italiano',
      iso: 'it-IT',
    },
    {
      reg: /^日语：|^Japanese:/,
      name: '日本語',
      iso: 'ja-JP',
    },
    {
      reg: /^韩语：|^Korean:/,
      name: '한국어',
      iso: 'kr-KR',
    },
    {
      reg: /^中文：|^简中：|^Chinese Simplified:/,
      name: '简体中文',
      iso: 'zh-CN',
    },
    {
      reg: /^繁体中文：|^繁中：|^Traditional Chinese:/,
      name: '繁體中文',
      iso: 'zh-TW',
    },
  ]
  function getLocaleLabel(raw) {
    if (!raw) {
      return null
    }
    for (let i = 0; i < labelArr.length; i++) {
      const {reg, iso} = labelArr[i]
      const result = reg.exec(raw)
      // console.log(result)
      if (result) {
        return {
          label: iso,
          value: raw.slice(result[0].length, raw.length).trim(),
        }
      }
    }
    return raw
  }
  function convertText(text) {
    const lines = text.trim().split('\n')
    return lines
      .map((line) => {
        return getLocaleLabel(line)
      })
      .filter(Boolean)
  }

  function convertObject(obj) {
    const result = []
    for (const key in obj) {
      const value = obj[key]
      const f = labelArr.find((l) => l.name === key)
      result.push({
        label: f?.iso || key,
        value,
      })
    }
    return result
  }

  addPlugin((valRef) => {
    return {
      label: '🧰 自定义文本转换',
      children: [
        {
          label: '⌨️ 多语言多行文本转JSON数组',
          props: {
            onClick: async () => {
              await copy(convertText(valRef.value), true)
            },
          },
        },
        {
          label: '⌨️ JS对象转JSON数组',
          props: {
            onClick: async () => {
              await copy(convertObject(eval(valRef.value)), true)
            },
          },
        },
      ],
    }
  })
})()
