import JSZip from 'jszip'
import FileSaver from 'file-saver'

async function zipDirectory(
  directoryHandle: FileSystemDirectoryHandle,
  zip: JSZip = new JSZip(),
  path: string = ''
): Promise<JSZip> {
  // 遍历目录中的所有条目
  for await (const [name, handle] of directoryHandle.entries()) {
    const relativePath = path ? `${path}/${name}` : name
    if (handle.kind === 'file') {
      // 如果是文件，读取文件并添加到zip对象中
      const file = await handle.getFile()
      zip.file(relativePath, file)
    } else if (handle.kind === 'directory') {
      // 如果是目录，递归调用
      await zipDirectory(handle, zip, relativePath)
    }
  }
  return zip
}

export async function exportZip(directoryHandle: FileSystemDirectoryHandle) {
  const zip = await zipDirectory(directoryHandle)
  zip.generateAsync({type: 'blob'}).then((blob) => {
    FileSaver.saveAs(blob, 'archive.zip')
  })
}
