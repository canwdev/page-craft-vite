import {IEntry} from '../../types/filesystem'
import {WebHfs} from '@humanfs/web'
import {path as Path} from '../path'

let hfs = new WebHfs({
  root: await navigator.storage.getDirectory(),
})
// 必须设置基础路径，否则报错
let basePath = '/page-craft'

const p = async () => {
  const handle = await window.showDirectoryPicker()
  hfs = new WebHfs({
    root: handle,
  })
  basePath = ''
}
window._p = p
console.log('[hfs]', hfs)

export const fsWebApi = {
  async getList({path}) {
    const list: IEntry[] = []
    for await (const entry of hfs.list(basePath + path)) {
      const ext = Path.extname(entry.name || '') || ''
      list.push({
        name: entry.name,
        ext,
        isDirectory: entry.isDirectory,
        hidden: entry.name.startsWith('.'),
        // 不准确，并且消耗性能，所以不读取
        // lastModified: (await hfs.lastModified(basePath + path))?.getTime() || 0,
        lastModified: 0,
        birthtime: 0,
        // size: await hfs.size(basePath + path),
      })
    }
    return list
  },
  async getFile(params) {
    const {path, mode = 'text'} = params
    const absPath = basePath + path
    if (mode === 'text') {
      return await hfs.text(absPath)
    } else if (mode === 'json') {
      return await hfs.json(absPath)
    } else {
      return await hfs.bytes(absPath)
    }
  },
  async createDir(params) {
    const {path, ignoreExisted = false} = params
    // console.log('createDir', path)
    if (ignoreExisted) {
      if (await hfs.isDirectory(basePath + path)) {
        return {path}
      }
    }
    await hfs.createDirectory(basePath + path)

    return {path}
  },
  async createFile(params, config: any = {}) {
    const {path, file, isOverride = false} = params

    if (!isOverride && (await hfs.isFile(basePath + path))) {
      throw new Error(`file ${path} already exist!`)
    }

    // console.log('createFile', params)
    // This method will create any necessary parent directories that are missing in order to write the file
    await hfs.write(basePath + path, file)
  },
  async writeFile(params, config: any = {}) {
    const {path, file} = params
    // This method will create any necessary parent directories that are missing in order to write the file
    await hfs.write(basePath + path, file)
  },
  async renameEntry(params) {
    const {fromPath, toPath} = params
    const absPath = basePath + fromPath
    const absToPath = basePath + toPath
    // console.log('renameEntry', absPath, absToPath)
    if (await hfs.isDirectory(absPath)) {
      await hfs.moveAll(absPath, absToPath)
    } else {
      await hfs.move(absPath, absToPath)
    }
  },
  async copyPaste(params) {
    const {fromPaths, toPath, isMove} = params
    let {toPathAbs} = params

    for (let i = 0; i < fromPaths.length; i++) {
      const path = fromPaths[i]

      const absPath = basePath + path
      const entryName = Path.basename(absPath)
      if (toPathAbs) {
        toPathAbs = basePath + toPathAbs
      } else {
        toPathAbs = basePath + Path.join(toPath, entryName)
      }

      // console.log(absPath, absToPath)
      if (isMove) {
        if (await hfs.isDirectory(absPath)) {
          await hfs.moveAll(absPath, toPathAbs)
        } else {
          await hfs.move(absPath, toPathAbs)
        }
      } else {
        if (await hfs.isDirectory(absPath)) {
          await hfs.copyAll(absPath, toPathAbs)
        } else {
          await hfs.copy(absPath, toPathAbs)
        }
      }
    }
  },
  async deleteEntry(params) {
    const {path} = params
    const dpDelete = async (path) => {
      const absPath = basePath + path
      if (await hfs.isDirectory(absPath)) {
        await hfs.deleteAll(absPath)
      } else {
        await hfs.delete(absPath)
      }
    }
    if (Array.isArray(path)) {
      for (let i = 0; i < path.length; i++) {
        const p = path[i]
        await dpDelete(p)
      }
    } else {
      await dpDelete(path)
    }
  },
}
