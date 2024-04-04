import {IEntry} from '../../types/filesystem'
import {WebHfs} from '@humanfs/web'
import {path as Path} from '../path'

const hfs = new WebHfs({
  root: await navigator.storage.getDirectory(),
})
console.log('[hfs]', hfs)

// 必须设置基础路径，否则报错
const basePath = '/page-craft'

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
        lastModified: (await hfs.lastModified(basePath + path))?.getTime() || 0,
        birthtime: 0,
        size: await hfs.size(basePath + path),
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
    const {path, file} = params

    if (await hfs.isFile(basePath + path)) {
      throw new Error(`file ${path} already exist!`)
    }
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

    for (let i = 0; i < fromPaths.length; i++) {
      const path = fromPaths[i]

      const absPath = basePath + path
      const entryName = Path.basename(absPath)
      const absToPath = basePath + Path.join(toPath, entryName)

      // console.log(absPath, absToPath)
      if (isMove) {
        if (await hfs.isDirectory(absPath)) {
          await hfs.moveAll(absPath, absToPath)
        } else {
          await hfs.move(absPath, absToPath)
        }
      } else {
        if (await hfs.isDirectory(absPath)) {
          await hfs.copyAll(absPath, absToPath)
        } else {
          await hfs.copy(absPath, absToPath)
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
