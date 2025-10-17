import FileSaver from 'file-saver'
import moment from 'moment'

export async function promptGetFileName(name?, fallbackPrefix = 'PageCraft') {
  return await window.$mcUtils.showInputPrompt({
    title: 'Export filename',
    value: name || `${fallbackPrefix}_${moment(new Date()).format('YYYYMMDD_HHmmss')}`,
  })
}
export function handleExportFile(filename, contentStr, ext) {
  if (!filename) {
    filename = `${moment(new Date()).format('YYYYMMDD_HHmmss')}`
  }
  const blob = new Blob([contentStr], {
    type: 'text/plain;charset=utf-8',
  })
  FileSaver.saveAs(blob, filename + ext)
}

export async function handleImportTextFile(options: any) {
  const [handle] = await window.showOpenFilePicker(
    options || {
      types: [
        {
          description: 'Text',
          accept: {
            'text/plain': ['.txt'],
          },
        },
      ],
    },
  )
  const file = await handle.getFile()
  return await handleReadSelectedFile(file)
}

export async function handleImportJson() {
  const [handle] = await window.showOpenFilePicker({
    types: [
      {
        description: 'JSON',
        accept: {
          'application/JSON': ['.json'],
        },
      },
    ],
  })
  const file = await handle.getFile()
  const str = await handleReadSelectedFile(file)
  return JSON.parse(str as string)
}

export function handleReadSelectedFile(file) {
  // console.log(file)
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        resolve(reader.result)
      }
      catch (error: any) {
        reject(error)
        window.$message.error(`Import Failed! ${error.message}`)
      }
    }
    reader.readAsText(file)
  })
}
