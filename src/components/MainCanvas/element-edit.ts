export type CustomFormItem = {
  label: string
  key: string
}

export type ElementEditForm = {
  tagName: string
  className: string
  innerHTML: string
  customProps: any
}

export const elementCustomPropsMap = {
  img: {
    getCustomProps: (el) => {
      return {
        src: el.getAttribute('src'),
      }
    },
    customFormItems: [
      {
        label: 'src',
        key: 'src',
      },
    ],
    updateElement(el, formData: ElementEditForm) {
      el.setAttribute('src', formData.customProps.src)
    },
  },
}

export const formatForm = (el: HTMLElement | null): ElementEditForm => {
  const options: any = el || {}
  const customProps = el && elementCustomPropsMap[el?.tagName.toLowerCase()]
  return {
    tagName: options.tagName || '',
    className: options.className || '',
    innerHTML: options.innerHTML || '',
    // get element specific custom props
    customProps: customProps && customProps.getCustomProps(el),
  }
}

// get element specific form items
export const getCustomFormItems = (el: HTMLElement | null): CustomFormItem[] => {
  if (!el) {
    return []
  }
  const customProps = elementCustomPropsMap[el?.tagName.toLowerCase()]

  if (!customProps) {
    return []
  }

  return customProps.customFormItems
}
