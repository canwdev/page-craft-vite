export type ReplacementItem = [number, number, string]

export const replaceTemplate = (template: string, replacements: ReplacementItem[]) => {
  let newTemplate = ''
  let lastIndex = 0
  for (const [start, end, newText] of replacements) {
    newTemplate += template.slice(lastIndex, start) + newText
    lastIndex = end
  }
  newTemplate += template.slice(lastIndex)
  return newTemplate
}
