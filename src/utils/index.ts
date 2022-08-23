export const copyToClipboard = (text: string) => {
  const input = document.createElement('textarea')
  input.value = text
  document.body.appendChild(input)
  input.select()
  document.execCommand('Copy')
  document.body.removeChild(input)
}
export const isCharacterKeyPress = (evt) => {
  if (typeof evt.which == 'undefined') {
    // This is IE, which only fires keypress events for printable keys
    return true
  } else if (typeof evt.which == 'number' && evt.which > 0) {
    // In other browsers except old versions of WebKit, evt.which is
    // only greater than zero if the keypress is a printable key.
    // We need to filter out backspace and ctrl/alt/meta key combinations
    return !evt.ctrlKey && !evt.metaKey && !evt.altKey && evt.which != 8
  }
  return false
}
