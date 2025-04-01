import ColorHash from 'color-hash'

export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

export function rgbToHex(r, g, b) {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

export const getSystemIsDarkMode = () =>
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

// https://stackoverflow.com/a/16348977
export const stringToColour = (str = '') => {
  let i
  let hash = 0
  for (i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  let colour = '#'
  for (i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    colour += ('00' + value.toString(16)).substr(-2)
  }
  return colour
}
export const customHash = (str = '') => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash += str.charCodeAt(i)
  }
  return hash
}
export const colorHash = new ColorHash({
  hash: customHash,
  lightness: [0.66],
  // hue: [
  //   {min: 30, max: 90},
  //   {min: 180, max: 210},
  //   {min: 270, max: 285},
  // ],
  // saturation: [0.35, 0.5, 0.65],
})
