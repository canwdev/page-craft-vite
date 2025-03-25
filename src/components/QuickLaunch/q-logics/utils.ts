// 过滤列表功能
export const filterLabel = (item, value) => {
  const sVal = value.trim().toLowerCase()
  let flag = false
  if (item.search) {
    flag = item.search.toLowerCase().includes(sVal)
  }
  if (!flag && item.label) {
    flag = item.label.toLowerCase().includes(sVal)
  }
  return flag
}
