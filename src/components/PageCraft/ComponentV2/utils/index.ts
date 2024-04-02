export const normalizePath = (path) => {
  return path.replace(/\\/gi, '/').replace(/\/+/gi, '/')
}

export const toggleArrayElement = (arr: any[], value: any) => {
  const index = arr.indexOf(value)
  if (index !== -1) {
    arr.splice(index, 1)
  } else {
    arr.push(value)
  }
  return arr
}

export const getLastDirName = (path) => {
  path = path.replace(/\/$/gi, '')
  return path.split('/').pop()
}

export const generateTextFile = (value: string | object, name: string) => {
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  const blob = new Blob([value], {type: 'text/plain;charset=utf-8'})
  return new File([blob], name)
}

export const getExtension = (name: string) => {
  if (!name || !name.includes('.') || name.startsWith('.')) return ''
  return name.split('.').reverse()[0].toLowerCase()
}
