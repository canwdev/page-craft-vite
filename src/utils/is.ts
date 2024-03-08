/**
 * 是否外部链接
 * @param url
 * @returns {boolean}
 */
export function isOutLink(url) {
  if (!url) {
    return false
  }
  return /^(https?:|mailto:|tel:|[a-zA-Z]{4,}:)/.test(url)
}

export function isBase64Image(str) {
  return /^data:image\/([a-zA-Z]*);base64,/.test(str)
}

export function isSrcHttpUrl(url) {
  if (!url) {
    return false
  }
  return /^(https?:)/.test(url)
}
