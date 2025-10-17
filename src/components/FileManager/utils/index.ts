export function normalizePath(path) {
  return path.replace(/\\/g, '/').replace(/\/+/g, '/')
}

export function toggleArrayElement(arr: any[], value: any) {
  const index = arr.indexOf(value)
  if (index !== -1) {
    arr.splice(index, 1)
  }
  else {
    arr.push(value)
  }
  return arr
}

export function getLastDirName(path) {
  path = path.replace(/\/$/g, '')
  return path.split('/').pop() || '/'
}

export function generateTextFile(value: string | object, name: string) {
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  const blob = new Blob([value], { type: 'text/plain;charset=utf-8' })
  return new File([blob], name)
}

export function getExtension(name: string) {
  if (!name || !name.includes('.') || name.startsWith('.'))
    return ''
  return name.split('.').reverse()[0].toLowerCase()
}
