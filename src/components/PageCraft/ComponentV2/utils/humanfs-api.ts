import {IEntry} from '../types/filesystem'

const {BFSRequire} = window.BrowserFS
const Path = BFSRequire('path')

import {WebHfs} from '@humanfs/web'

const hfs = new WebHfs({
  root: await navigator.storage.getDirectory(),
})
console.log('hfs', hfs)

// 必须设置基础路径，否则报错
const basePath = '/page-craft'

export const fsWebApi = {
  async getList({path}) {
    const list: IEntry[] = []
    for await (const entry of hfs.list(basePath + path)) {
      if (entry.isFile) {
        console.log(entry)
      } else if (entry.isDirectory) {
        console.log(entry)
      }
      const ext = Path.extname(entry.name) || ''
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
  async createDir(params) {
    const {path, ignoreExisted = false} = params
    console.log('createDir', path)
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
    await this.createDir({path: Path.dirname(path), ignoreExisted: true})
    await hfs.write(basePath + path, file)
  },
  async renameEntry(params) {
    const {fromPath, toPath} = params
    const absPath = basePath + fromPath
    const absToPath = basePath + toPath
    console.log('renameEntry', absPath, absToPath)
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

      console.log(absPath, absToPath)
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
