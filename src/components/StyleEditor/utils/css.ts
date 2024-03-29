export const sassToCSS = (sassCode, options?): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!sassCode) {
      return resolve('')
    }
    window.Sass.compile(sassCode, (output) => {
      if (output.message) {
        reject(output)
      } else {
        resolve(output.text)
      }
    })
  })
}

export const suggestElementClass = (el: HTMLElement) => {
  let className = el.className
  if (!className.replace) {
    // svg 兼容
    console.warn('Element is not supported', el)
    return ''
  }
  className = className.trim()
  if (className) {
    return '.' + className.split(' ').join('.')
  }
  return el.tagName.toLowerCase()
}
