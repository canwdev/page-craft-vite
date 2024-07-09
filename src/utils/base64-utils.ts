/**
 * Encodes a string to Base64 with UTF-8 character encoding.
 * @param str The input string to encode.
 */
const btoa_utf8 = (str) => {
  // 首先将字符串转换为UTF-8编码的字节
  const utf8Bytes = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) =>
    // @ts-ignore
    String.fromCharCode('0x' + p1)
  )

  // 使用btoa函数进行Base64编码
  return btoa(utf8Bytes)
}

/**
 * Decodes a Base64-encoded string with UTF-8 character encoding.
 * @param str The Base64-encoded string to decode.
 */
const atob_utf8 = (str) => {
  // 使用atob函数进行Base64解码
  const utf8Bytes = atob(str)

  // 将解码后的UTF-8字节序列转换回原始字符串
  try {
    return decodeURIComponent(
      utf8Bytes
        .split('')
        .map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join('')
    )
  } catch (e) {
    console.error('Decoding failed', e)
    return null
  }
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader()
    fr.onload = (e) => {
      resolve(e.target!.result)
    }
    fr.onerror = reject
    fr.readAsDataURL(blob)
  })
}

/**
 * 转换文件到base64 url
 */
function chooseFileToBase64({
  // 传入 '*' 支持所有格式，传入 'image/*' 支持svg、jpg、png等图片
  accept = '*',
} = {}) {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = accept

    input.onchange = function (e) {
      // @ts-ignore
      const files = e.target!.files
      if (files.length === 0) {
        reject('No file selected!')
        return
      }

      const file = files[0]
      const reader = new FileReader()

      reader.onload = function (event) {
        const dataUrl = event.target!.result
        resolve(dataUrl)
      }

      reader.onerror = function (event) {
        reject(event.target!.error)
      }

      reader.readAsDataURL(file)
    }

    input.click()
  })
}

export const base64Utils = {
  btoa_utf8,
  atob_utf8,
  blobToBase64,
  chooseFileToBase64,
}
