// 前端虚拟文件系统API，仅用于测试！
const {BFSRequire} = window.BrowserFS

const fs = BFSRequire('fs')
const Path = BFSRequire('path')

// 在 router.beforeEach 进行 configure初始化
/*await configure(
  {
    fs: 'MountableFileSystem',
    options: {
      '/home': {fs: 'LocalStorage'},
      '/tmp': {fs: 'InMemory'},
      // '/idbfs': {fs: 'IndexedDB'},
    },
  },
  (e) => {
    if (e) {
      console.error(e)
    }
  }
)*/

const recursiveDelete = (path) => {
  let files = []
  if (fs.existsSync(path)) {
    if (fs.lstatSync(path).isDirectory()) {
      files = fs.readdirSync(path)
      files.forEach(function (file, index) {
        const curPath = path + '/' + file
        recursiveDelete(curPath)
      })
      fs.rmdirSync(path)
    } else {
      fs.unlinkSync(path)
    }
  }
}

/**
 * 递归复制文件或文件夹
 * @param fromPath 来源文件或文件夹，如 /source/file1.txt 或 /source/folder1
 * @param toPath 目标文件夹 /target
 */
const recursiveCopy = (fromPath, toPath) => {
  const stats = fs.statSync(fromPath) // Get stats about the source

  if (stats.isDirectory()) {
    console.log('dir', fromPath)

    if (!fs.existsSync(toPath)) {
      fs.mkdirSync(toPath, {recursive: true})
    }
    // If source is a directory
    fs.readdirSync(fromPath).forEach((file) => {
      // For each file in the source directory
      const sourceFilePath = Path.join(fromPath, file) // Construct the full path
      const destinationFilePath = Path.join(toPath, file) // Construct the full path
      recursiveCopy(sourceFilePath, destinationFilePath) // Recursively copy the file
    })
  } else if (stats.isFile()) {
    console.log('file', fromPath)
    const base = Path.dirname(toPath)
    if (!fs.existsSync(base)) {
      fs.mkdirSync(Path.dirname(toPath), {recursive: true})
    }
    // If source is a file
    fs.writeFileSync(toPath, fs.readFileSync(fromPath))
  }
}

const copyEntry = (fromPath: string, toPath: string, isMove = false) => {
  if (!fs.existsSync(fromPath)) {
    throw new Error(`fromPath: ${fromPath} is not exist!`)
  }
  // 目标路径也需要加上文件名
  toPath = Path.join(toPath, Path.basename(fromPath))

  if (fs.existsSync(toPath)) {
    throw new Error(`toPath: ${toPath} is exist!`)
  }
  console.log({
    fromPath,
    toPath,
    isMove,
  })
  recursiveCopy(fromPath, toPath)
  if (isMove) {
    recursiveDelete(fromPath)
  }
}

export const fsWebApi = {
  getDrives(params) {
    return [
      {label: 'LocalStorage FS', path: '/home'},
      {label: 'RAM FS', path: '/tmp'},
      // {label: 'IndexedDB FS', path: '/idbfs'},
    ]
  },
  getList({path}) {
    const files = fs.readdirSync(path)
    return files.map((entryName: string) => {
      const entryPath = Path.join(path, entryName)
      let stat: any = null
      let error

      try {
        stat = fs.statSync(entryPath)
      } catch (e: any) {
        error = e.message
      }
      // console.log(stat)

      const isDirectory = stat && stat.isDirectory()
      const ext = Path.extname(entryName) || ''
      return {
        name: entryName,
        isDirectory,
        hidden: entryName.startsWith('.'),
        lastModified: stat?.ctime.getTime() || 0,
        birthtime: stat?.birthtime.getTime() || 0,
        size: isDirectory ? undefined : stat?.size,
        ext: ext,
        error,
        stat,
      }
    })
  },
  getStream(params) {
    const {path} = params
    const r = fs.readFileSync(path)
    console.log(r)
    return r
  },
  createDir(params) {
    const {path, ignoreExisted = false} = params
    if (ignoreExisted) {
      if (fs.existsSync(path)) {
        return {path}
      }
    }
    fs.mkdirSync(path, {recursive: true})
    return {path}
  },
  createFile(params, config: any = {}) {
    const {path, file} = params

    if (fs.existsSync(path)) {
      throw new Error(`file ${path} already exist!`)
    }
    this.createDir({path: Path.dirname(path), ignoreExisted: true})
    fs.writeFileSync(path, '123')
  },
  renameEntry(params) {
    const {fromPath, toPath} = params
    fs.renameSync(fromPath, toPath)
  },
  copyPaste(params) {
    const {fromPaths, toPath, isMove} = params
    for (let i = 0; i < fromPaths.length; i++) {
      const path = fromPaths[i]
      copyEntry(path, toPath, isMove)
    }
  },
  deleteEntry(params) {
    const {path} = params
    if (Array.isArray(path)) {
      for (let i = 0; i < path.length; i++) {
        const p = path[i]
        recursiveDelete(p)
      }
    } else {
      recursiveDelete(path)
    }
  },
}
