// @ts-ignore
import {TOOL_CLASSES} from '@/enum'
const Sass = window.Sass

export const sassToCSS = (sassCode, options?): Promise<string> => {
  return new Promise((resolve, reject) => {
    Sass.compile(sassCode, (output) => {
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
  className = className.replace(TOOL_CLASSES.CLASS_MOUSE_OVER, '').trim()
  if (className) {
    return '.' + className.split(' ').join('.')
  }
  return el.tagName.toLowerCase()
}
