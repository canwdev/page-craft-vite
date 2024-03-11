export type FileHandleHistory = {
  handle: FileSystemFileHandle
  lastOpened: number
}
export async function verifyPermission(fileHandle) {
  const options = {
    // mode: 'readwrite',
  }
  // Check if permission was already granted. If so, return true.
  if ((await fileHandle.queryPermission(options)) === 'granted') {
    return true
  }
  // Request permission. If the user grants permission, return true.
  if ((await fileHandle.requestPermission(options)) === 'granted') {
    return true
  }
  // The user didn't grant permission, so return false.
  return false
}
