import * as fs from 'node:fs'
import * as path from 'node:path'
import * as sass from 'sass'

function isBase64Image(str) {
  return /^data:image\/([a-zA-Z]*);base64,/.test(str)
}

function isSrcHttpUrl(url) {
  return /^(https?:)/i.test(url)
}

function isUrlImage(url) {
  return /\.(?:jpg|jpeg|jfif|pjpeg|pjp|gif|apng|png|webp|svg|avif)$/i.test(url)
}

function svg(buffer) {
  const base64 = buffer.toString('base64')
  return `data:image/svg+xml;base64,${base64}`
}

function img(buffer, ext = '') {
  return `"data:image/${ext};base64,${buffer.toString('base64')}"`
}

// 自定义 Sass 函数，用于将图片编码为 Base64
function imageToBase64(imagePath: sass.Value, basePath: string) {
  let str = imagePath.toString().trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '').trim()
  if (isBase64Image(str) || isSrcHttpUrl(str)) {
    return new sass.SassString(`url(${str})`)
  }

  const filePath = path.join(basePath, str)
  const buffer = fs.readFileSync(filePath)

  if (/\.svg$/i.test(str)) {
    str = svg(buffer)
  }
  else {
    str = img(buffer)
  }

  return new sass.SassString(`url(${str})`, { quotes: false })
}

function compileSass(scssFilePath: string, cssFilePath: string): void {
  console.log(`[Building] ${scssFilePath}`)
  const result = sass.compile(scssFilePath, {
    functions: {
      'url($file)': url => imageToBase64(url[0], path.dirname(scssFilePath)), // 注册 Sass 函数
    },
    silenceDeprecations: [
      'import',
    ],
  })
  fs.writeFileSync(cssFilePath, result.css)
  console.log(`[OK] ${cssFilePath}`)
}

function main() {
  const themesDir = path.join(__dirname, '../public/resources/themes-dist')
  fs.rmSync(themesDir, { recursive: true, force: true })
  fs.mkdirSync(themesDir)
  const themeJson = fs.readFileSync(path.join(__dirname, './src/index.json'), 'utf8')
  const themes = JSON.parse(themeJson)
  themes.forEach((theme) => {
    const themeSrcPath = path.join(__dirname, './src', theme.src)
    const themeFileContentCompiledPath = path.join(themesDir, `${theme.value}.css`)
    compileSass(themeSrcPath, themeFileContentCompiledPath)
  })
  fs.writeFileSync(path.join(themesDir, 'index.json'), themeJson)
}
main()
