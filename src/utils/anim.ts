// 面板闪烁动画
export const blinkPanel = async (el: HTMLElement, maxCount: number = 3) => {
  const originalColor = el.style.backgroundColor
  el.style.transition = 'background-color 0.5s ease'

  const blink = async (color: string) => {
    el.style.backgroundColor = color
    await new Promise((resolve) => setTimeout(resolve, 300))
    el.style.backgroundColor = originalColor
    await new Promise((resolve) => setTimeout(resolve, 300))
  }

  for (let i = 0; i < maxCount; i++) {
    await blink('var(--primary)')
  }

  el.style.backgroundColor = originalColor
  el.style.transition = ''
}
