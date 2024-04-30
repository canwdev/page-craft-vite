import {IEntry} from '../../types/filesystem'
import {WebHfs} from '@humanfs/web'
import {path as Path} from '../path'
import {findHandleByPath} from '@/components/FileManager/utils/providers/opfs-utils'

// 必须使用安全域名访问，如https或localhost，否则启动报错
// 必须启用配置 top-level-await
let root = await navigator.storage.getDirectory()
let hfs = new WebHfs({
  root,
})

/**
 * 动态设置hfs实例
 * 可以传入以下实例，必须要有点击交互
 * const handle = await window.showDirectoryPicker()
 */
export const setHfsInstance = async (handle?: FileSystemDirectoryHandle) => {
  root = handle || (await navigator.storage.getDirectory())
  hfs = new WebHfs({
    root,
  })
}

console.log('[hfs]', hfs)

const fixPath = (path: string) => {
  // humanfs 必须用点代替根目录的斜杠
  if (path === '/' || !path) {
    return '.'
  }
  return path
}

export const fsWebApi = {
  async findHandleByPath(path: string, type: 'file' | 'directory') {
    const directoryHandle: FileSystemDirectoryHandle = root
    console.log(directoryHandle)
    return await findHandleByPath(directoryHandle, path, type)
  },
  async getList({
    path,
    // 消耗性能，所以默认关闭
    isStat = false,
  }) {
    const list: IEntry[] = []
    path = fixPath(path)
    for await (const entry of hfs.list(path)) {
      const ext = Path.extname(entry.name || '') || ''
      const entryPath = Path.normalize(path + '/' + entry.name)
      list.push({
        name: entry.name,
        ext,
        isDirectory: entry.isDirectory,
        hidden: entry.name.startsWith('.'),

        lastModified: isStat ? (await hfs.lastModified(entryPath))?.getTime() || 0 : 0,
        birthtime: 0,
        size: isStat ? await hfs.size(entryPath) : undefined,
      })
    }
    return list
  },
  async getFile(params) {
    const {path, mode = 'text'} = params
    const absPath = fixPath(path)
    if (mode === 'text') {
      return await hfs.text(absPath)
    } else if (mode === 'json') {
      return await hfs.json(absPath)
    } else {
      return await hfs.bytes(absPath)
    }
  },
  async createDir(params) {
    let {path, ignoreExisted = false} = params
    path = fixPath(path)
    // console.log('createDir', path)
    if (ignoreExisted) {
      if (await hfs.isDirectory(path)) {
        return {path}
      }
    }
    await hfs.createDirectory(path)

    return {path}
  },
  async createFile(params, config: any = {}) {
    let {path, file, isOverride = false} = params
    path = fixPath(path)
    if (!isOverride && (await hfs.isFile(path))) {
      throw new Error(`file ${path} already exist!`)
    }

    // console.log('createFile', params)
    // This method will create any necessary parent directories that are missing in order to write the file
    await hfs.write(path, file)
  },
  async writeFile(params, config: any = {}) {
    let {path, file} = params
    path = fixPath(path)
    // This method will create any necessary parent directories that are missing in order to write the file
    await hfs.write(path, file)
  },
  async renameEntry(params) {
    const {fromPath, toPath} = params
    const absPath = fixPath(fromPath)
    const absToPath = fixPath(toPath)
    // console.log('renameEntry', absPath, absToPath)
    if (await hfs.isDirectory(absPath)) {
      await hfs.moveAll(absPath, absToPath)
    } else {
      await hfs.move(absPath, absToPath)
    }
  },
  async copyPaste(params) {
    const {fromPaths, toPath, isMove, toPathAbs} = params

    for (let i = 0; i < fromPaths.length; i++) {
      const path = fromPaths[i]

      const absPath = fixPath(path)
      // 完整目标路径=toPath+文件夹（名）
      let targetAbsPath: string
      // 如果传入了目标文件（夹）名，则不进行后续的拼接
      if (toPathAbs) {
        targetAbsPath = fixPath(toPathAbs)
      } else {
        const entryName = Path.basename(absPath)
        targetAbsPath = fixPath(Path.join(toPath, entryName))
      }

      if (isMove) {
        if (await hfs.isDirectory(absPath)) {
          await hfs.moveAll(absPath, targetAbsPath)
        } else {
          await hfs.move(absPath, targetAbsPath)
        }
      } else {
        if (await hfs.isDirectory(absPath)) {
          await hfs.copyAll(absPath, targetAbsPath)
        } else {
          await hfs.copy(absPath, targetAbsPath)
        }
      }
    }
  },
  async deleteEntry(params) {
    const {path} = params
    const dpDelete = async (path) => {
      const absPath = fixPath(path)
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
