import dynamicLoadScript from '@/utils/dynamic-load-script'

export function sassToCSS(sassCode): Promise<string> {
  return new Promise(async (resolve, reject) => {
    if (!sassCode) {
      return resolve('')
    }
    if (!window.Sass) {
      await dynamicLoadScript('lib/sass/sass.sync.min.js')
    }
    window.Sass.compile(sassCode, (output) => {
      if (output.message) {
        reject(output)
      }
      else {
        resolve(output.text)
      }
    })
  })
}

export function suggestElementClass(el: HTMLElement) {
  let className = el.className
  if (!className.replace) {
    // svg 兼容
    console.warn('Element is not supported', el)
    return ''
  }
  className = className.trim()
  if (className) {
    return `.${className.split(' ').join('.')}`
  }
  return el.tagName.toLowerCase()
}
