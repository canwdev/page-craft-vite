const {copy, addPlugin} = window.$qlUtils
const evalCode = (val, isToast = false) => {
  try {
    return eval(val)
  } catch (error) {
    console.log(error)
    if (isToast) {
      window.$message.error(error.message)
    } else {
      return error.message
    }
  }
}
const isTimestamp = (val) => {
  val = Number(val)
  const d = new Date(val)
  if (d.getTime() > 0) {
    return d
  }
  return false
}

addPlugin(
  (valRef) => {
    const date = isTimestamp(valRef.value)
    if (date) {
      const label = window.$qlUtils.moment(date).format('YYYY-MM-DD HH:mm:ss')
      return {
        label: label,
        iconClass: 'mdi mdi-content-copy',
        props: {onClick: () => copy(label, true)},
      }
    }
  },
  {
    isPresetPlugin: true,
  }
)

addPlugin(
  (valRef) => {
    return {
      html: 'JavaScript Eval',
      iconClass: 'mdi mdi-flash',
      props: {
        onClick: async () => {
          await copy(evalCode(valRef.value, true), true)
        },
      },
    }
  },
  {
    isPresetPlugin: true,
  }
)

addPlugin(
  (valRef) => {
    return {
      // ⚡ #ff822d
      html: 'Realtime JavaScript Eval',
      iconClass: 'mdi mdi-language-javascript',
      children: [
        {
          label: '',
          props: {
            onClick: async () => {
              await copy(evalCode(valRef.value, true), true)
            },
            class: 'font-code',
          },
          dynamicProps: {
            label: 'eval()',
            text: valRef,
            formatFn: (val) => {
              return evalCode(val)
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
