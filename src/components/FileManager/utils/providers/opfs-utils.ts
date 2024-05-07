/**
 * 递归查找指定路径和类型的文件系统句柄。
 *
 * @param directoryHandle FileSystemDirectoryHandle 的实例，表示文件系统中的目录。
 * @param path 字符串，表示需要查找的文件或目录的路径。路径应该是从 directoryHandle 所代表的目录开始的相对路径。
 * @param type 字符串，指定查找的类型。可以是 "file" 或 "directory"，分别表示查找文件或目录。
 * @returns 返回一个 Promise，解析为找到的 FileSystemHandle 或 null。如果路径正确并且找到了符合类型的句柄，则返回该句柄；如果路径不正确或未找到符合条件的句柄，则返回 null。
 */
export async function findHandleByPath(
  directoryHandle: FileSystemDirectoryHandle,
  path: string,
  type: 'file' | 'directory'
): Promise<FileSystemHandle | null> {
  // 将路径分割成数组，以便逐级查找
  const parts = path.split('/').filter((p) => p.length)
  let currentHandle: FileSystemDirectoryHandle | FileSystemFileHandle = directoryHandle

  // 遍历路径的每一部分
  for (const part of parts) {
    // 检查当前处理的是目录还是文件
    if (currentHandle.kind === 'directory') {
      // 尝试获取下一级的handle
      const nextHandle = await (currentHandle as FileSystemDirectoryHandle)
        .getDirectoryHandle(part, {create: false})
        .catch(() => null)

      // 如果没有找到，并且不是路径的最后一部分，说明路径无效
      if (!nextHandle && parts.indexOf(part) !== parts.length - 1) {
        return null
      } else if (nextHandle) {
        // 如果找到了下一级目录，继续在这个目录中查找
        currentHandle = nextHandle
      } else {
        // 如果是路径的最后一部分，尝试判断是文件还是目录
        if (type === 'directory') {
          return null // 已知最后一部分不是目录
        } else {
          // 尝试作为文件处理
          const fileHandle = await (currentHandle as FileSystemDirectoryHandle)
            .getFileHandle(part, {create: false})
            .catch(() => null)
          return fileHandle // 可能是null，如果文件不存在
        }
      }
    } else {
      // 当前handle是文件，但路径还没有结束，说明路径错误
      return null
    }
  }

  // 检查最终找到的handle是否符合期望的类型
  if (currentHandle.kind === type) {
    return currentHandle
  }

  return null
}
