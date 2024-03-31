const opts = {
  indent_size: '2',
  indent_char: ' ',
  max_preserve_newlines: '1',
  preserve_newlines: true,
  keep_array_indentation: false,
  break_chained_methods: false,
  indent_scripts: 'normal',
  brace_style: 'collapse',
  space_before_conditional: true,
  unescape_strings: false,
  jslint_happy: false,
  end_with_newline: false,
  wrap_line_length: '110',
  indent_inner_html: false,
  comma_first: false,
  e4x: false,
  indent_empty_lines: false,
}

// https://beautifier.io/
export const formatHtml = (html) => {
  return window.html_beautify(html, opts)
}

export const formatCss = (cssCode, options: any = {}) => {
  return window.css_beautify(cssCode, opts)
}
