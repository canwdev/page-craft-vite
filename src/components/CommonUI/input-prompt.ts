import {NButton, NInput, NSpace} from 'naive-ui'

export const showInputPrompt = (options: any = {}): Promise<string> => {
  const {title = '', value = '', validateFn} = options

  return new Promise((resolve, reject) => {
    let editingValue = ref(value)
    const inputRef = ref()

    const handlePositiveClick = async () => {
      if (typeof validateFn === 'function') {
        await validateFn(editingValue.value)
      }
      d.destroy()
      resolve(editingValue.value)
    }

    const d = window.$dialog.info({
      title: title,
      showIcon: false,
      onAfterEnter: () => {
        inputRef.value?.focus()
      },
      content: () =>
        h(
          NSpace,
          {size: 'small', vertical: true},

          () => [
            h(NInput, {
              ref: inputRef,
              value: editingValue.value,
              clearable: true,
              'onUpdate:value': (v) => {
                editingValue.value = v
              },
              onKeydown: (event) => {
                if (editingValue.value && event.key === 'Enter') {
                  handlePositiveClick()
                  event.preventDefault()
                }
              },
            }),
          ]
        ),
      action: () =>
        h(NSpace, {size: 'small'}, () => [
          h(
            NButton,
            {
              type: 'primary',
              disabled: !editingValue.value,
              onClick: handlePositiveClick,
            },
            () => 'OK'
          ),
          h(
            NButton,
            {
              onClick: () => {
                d.destroy()
              },
            },
            () => 'Cancel'
          ),
        ]),
    })
  })
}
