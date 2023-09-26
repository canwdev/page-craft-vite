import {configure, BFSRequire, initialize, FileSystem} from 'browserfs'
import {folderPrefix} from '@/hooks/use-component-storage'

configure(
  // {
  //   fs: 'LocalStorage',
  //   options: {},
  // },
  {
    fs: 'MountableFileSystem',
    options: {
      '/tmp': {fs: 'InMemory'},
      '/': {
        fs: 'LocalStorage',
      },
    },
  },
  function (e) {
    if (e) {
      // An error happened!
      throw e
    }
    // Otherwise, BrowserFS is ready-to-use!
  }
)
export let fs = BFSRequire('fs')

console.log(fs)

const path = BFSRequire('path')
// 递归删除文件夹
export const deleteFolderRecursiveSync = (folderPath) => {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = path.join(folderPath, file)
      if (fs.lstatSync(curPath).isDirectory()) {
        // 递归删除子文件夹
        deleteFolderRecursiveSync(curPath)
      } else {
        // 删除文件
        fs.unlinkSync(curPath)
      }
    })
    // 删除空文件夹
    fs.rmdirSync(folderPath)
  }
}

// 递归复制文件夹
export const copyFolderSync = (sourceFolder, destinationFolder) => {
  // 创建目标文件夹
  if (!fs.existsSync(destinationFolder)) {
    fs.mkdirSync(destinationFolder)
  }

  // 读取源文件夹的内容
  const files = fs.readdirSync(sourceFolder)

  files.forEach((file) => {
    const sourceFilePath = path.join(sourceFolder, file)
    const destinationFilePath = path.join(destinationFolder, file)

    // 判断文件/文件夹类型
    if (fs.statSync(sourceFilePath).isDirectory()) {
      // 递归复制子文件夹
      copyFolderSync(sourceFilePath, destinationFilePath)
    } else {
      // 复制文件
      // 由于 BrowserFS 中的 copyFileSync 不存在，需要手动实现
      fs.writeFile(destinationFilePath, fs.readFileSync(sourceFilePath))
    }
  })
}

// 检查父文件夹是否存在
export const autoCreateParentFolderSync = (filePath) => {
  const parentFolder = path.dirname(filePath) // 获取父文件夹的路径
  if (fs.existsSync(parentFolder)) {
    return
  } else {
    fs.mkdirSync(parentFolder)
    return true
  }
}
