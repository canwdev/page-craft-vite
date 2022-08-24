// @ts-ignore
import {TOOL_CLASSES} from '@/enum'

const csspretty = window.csspretty
const Sass = window.Sass

export const beautifyCSS = (cssCode, options: any = {}) => {
  const useTabs = options.useTabs,
    useSpaceCount = options.useSpaceCount

  let inchar, insize

  if (useTabs) {
    inchar = '\t'
    insize = 1
  } else {
    inchar = ' '
    insize = useSpaceCount || 2
  }

  return csspretty({
    mode: 'beautify' /* Doing beautify twice, otherwise it doesn't beautify code like the following one in single go:
                                       .box-shadow(@style,@alpha: 50%) when (isnumber(@alpha)){.box-shadow(@style, rgba(0, 0, 0, @alpha))} */,
    insize: insize,
    inchar: inchar,
    source: csspretty({
      mode: 'beautify',
      insize: insize,
      inchar: inchar,
      source: cssCode,
    }),
  })

  // Alternatively, use cssbeautify library:
  //     return cssbeautify(
  //         cssCode,
  //         {
  //             indent: '    ',
  //             autosemicolon: true
  //         }
  //     );
}

export const minifyCSS = (cssCode) => {
  return csspretty({
    mode: 'minify',
    source: cssCode,
  })
}

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