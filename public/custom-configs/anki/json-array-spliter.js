const fs = require('fs')
const Path = require('path')

/**
 * 将一个JSON数组文件拆分成若干个JSON数组文件
 * @param {string} jsonFilePath - 原始JSON文件路径
 * @param {string} targetDir - 输出目标目录
 * @param {number} splitCount - 每个小文件的最大内容条数
 */
function splitArray(jsonFilePath, targetDir, splitCount) {
  // 读取原始JSON文件
  const data = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'))

  // 判断目标目录是否存在，不存在则创建
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir)
  }

  // 分割数组
  let index = 0
  for (let i = 0; i < data.length; i += splitCount) {
    const chunk = data.slice(i, i + splitCount)
    const chunkPath = Path.join(targetDir, `split-${index + 1}.json`)
    fs.writeFileSync(chunkPath, JSON.stringify(chunk, null, 2))
    index++
  }
}

/**
 * 将目标目录中的多个JSON文件合并为一个JSON数组文件
 * @param {string} targetDir - 输入目录
 * @param {string} jsonFilePath - 合并后生成的JSON文件路径
 */
function mergeArray(targetDir, jsonFilePath) {
  // 读取目标目录中的文件，并按照序号排序
  const files = fs
    .readdirSync(targetDir)
    .filter((file) => file.startsWith('split-') && file.endsWith('.json'))
    .sort((a, b) => {
      const aIndex = parseInt(a.split('-')[1].split('.')[0])
      const bIndex = parseInt(b.split('-')[1].split('.')[0])
      return aIndex - bIndex
    })

  // 合并文件内容
  const mergedData = []
  for (const file of files) {
    const filePath = Path.join(targetDir, file)
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    mergedData.push(...data)
  }

  // 写入合并后的文件
  fs.writeFileSync(jsonFilePath, JSON.stringify(mergedData, null, 2))
}

// splitArray('cardsInfo_ODH.json', 'splited', 34)
mergeArray('splited-translated', 'cardsInfo_ODH_merged.json')
