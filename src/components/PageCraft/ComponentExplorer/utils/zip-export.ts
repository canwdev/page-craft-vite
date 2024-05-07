import JSZip from 'jszip'
import FileSaver from 'file-saver'

/* 以下代码基本上是用GPT-4生成的，太强了 */

/**
 * 压缩目录
 * @param directoryHandle
 * @param zip
 * @param path
 */
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
  console.log('[exportZip]', directoryHandle)
  const zip = await zipDirectory(directoryHandle)
  zip.generateAsync({type: 'blob'}).then((blob) => {
    FileSaver.saveAs(blob, 'archive.zip')
  })
}

async function unzipAndWriteToDirectory(
  zipFile: File,
  directoryHandle: FileSystemDirectoryHandle,
  basePath = ''
) {
  const zip = await JSZip.loadAsync(zipFile)
  await processZipObject(zip, directoryHandle, basePath)
}

async function processZipObject(
  zip: JSZip,
  directoryHandle: FileSystemDirectoryHandle,
  path: string = ''
) {
  for (const filename in zip.files) {
    const zipEntry = zip.files[filename]
    const fullPath = (path ? `${path}/` : '') + filename
    const entryParts = fullPath.split('/').filter((part) => part.length > 0)
    const entryName = entryParts.pop()

    let currentHandle = directoryHandle
    for (const part of entryParts) {
      try {
        currentHandle = await currentHandle.getDirectoryHandle(part, {create: true})
      } catch (error) {
        console.error('Error creating/accessing directory:', part, error)
        throw error
      }
    }

    if (!zipEntry.dir) {
      try {
        const fileData = await zipEntry.async('blob')
        const fileHandle = await currentHandle.getFileHandle(entryName!, {create: true})
        const writable = await fileHandle.createWritable()
        await writable.write(fileData)
        await writable.close()
      } catch (error) {
        console.error('Error writing file:', entryName, error)
        throw error
      }
    }
  }
}

/**
 * 选择zip并递归导入
 * @param directoryHandle 导入目标文件夹handle
 * @param basePath 导入基础路径
 */
export async function chooseZipFileAndImport(
  directoryHandle: FileSystemDirectoryHandle,
  basePath = ''
) {
  const [fileHandle] = await window.showOpenFilePicker({
    types: [
      {
        description: 'Zip Files',
        accept: {'application/zip': ['.zip']},
      },
    ],
  })
  const file = await fileHandle.getFile()
  await unzipAndWriteToDirectory(file, directoryHandle, basePath)
}

/**
 * 选择文件夹并递归导入
 * @param directoryHandle 导入目标文件夹handle
 * @param basePath 导入基础路径
 */
export async function chooseDirectoryAndImport(
  directoryHandle: FileSystemDirectoryHandle,
  basePath = ''
): Promise<void> {
  // 弹出文件夹选择窗口
  const handle = await window.showDirectoryPicker()

  // 递归复制函数
  async function recursiveCopy(
    srcHandle: FileSystemDirectoryHandle,
    destHandle: FileSystemDirectoryHandle
  ): Promise<void> {
    // 遍历源文件夹中的所有条目
    for await (const [name, entry] of srcHandle) {
      if (entry.kind === 'file') {
        // 如果是文件，则直接复制
        const file = await entry.getFile()
        const newFileHandle = await destHandle.getFileHandle(name, {create: true})
        const writable = await newFileHandle.createWritable()
        await writable.write(file)
        await writable.close()
      } else if (entry.kind === 'directory') {
        // 如果是目录，递归处理
        const newDirHandle = await destHandle.getDirectoryHandle(name, {create: true})
        await recursiveCopy(entry, newDirHandle)
      }
    }
  }

  // 获取目标目录句柄
  let targetHandle = directoryHandle
  if (basePath) {
    // 如果有 basePath，则需要逐级创建或获取目录
    const parts = basePath.split('/').filter((p) => p.length > 0)
    for (const part of parts) {
      targetHandle = await targetHandle.getDirectoryHandle(part, {create: true})
    }
  }

  // 执行复制操作
  await recursiveCopy(handle, targetHandle)
}

/**
 * 选择多个文件并导入
 * @param directoryHandle 导入目标文件夹handle
 * @param basePath 导入基础路径
 */
export async function chooseFilesAndImport(
  directoryHandle: FileSystemDirectoryHandle,
  basePath = ''
): Promise<void> {
  // 弹出文件选择窗口，允许多选
  const fileHandles = await window.showOpenFilePicker({
    multiple: true,
  })

  // 获取目标目录句柄
  let targetHandle = directoryHandle
  if (basePath) {
    // 如果有 basePath，则需要逐级创建或获取目录
    const parts = basePath.split('/').filter((p) => p.length > 0)
    for (const part of parts) {
      targetHandle = await targetHandle.getDirectoryHandle(part, {create: true})
    }
  }

  // 遍历所有选中的文件句柄
  for (const fileHandle of fileHandles) {
    const file = await fileHandle.getFile()
    // 创建或获取同名文件句柄
    const newFileHandle = await targetHandle.getFileHandle(file.name, {create: true})
    // 创建可写流
    const writable = await newFileHandle.createWritable()
    // 写入文件
    await writable.write(file)
    // 关闭流
    await writable.close()
  }
}
