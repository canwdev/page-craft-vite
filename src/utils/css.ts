export const beautifyCSS = (cssCode, options: any = {}) => {
  // @ts-ignore
  const csspretty = window.csspretty
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
