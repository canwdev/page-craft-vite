export const createOrFindStyleNode = (id, cssText?) => {
  const find = document.querySelector(id)
  if (find) {
    return find
  }
  const styleNode = document.createElement('style')
  styleNode.id = id

  if (cssText) {
    styleNode.innerHTML = cssText
  }

  document.head.appendChild(styleNode)
  return styleNode
}
