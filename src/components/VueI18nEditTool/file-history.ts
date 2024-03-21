import {useIDBKeyval} from '@vueuse/integrations/useIDBKeyval'
import {QuickOptionItem} from '@/components/CommonUI/QuickOptions/enum'
import moment from 'moment/moment'

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

export const useOpenedHistory = (storageKey: string, handleOpenHistory) => {
  const {data: openedHistory, set: setOpenedHistory} = useIDBKeyval<FileHandleHistory[]>(
    storageKey,
    []
  )

  const appendHistory = async (handle: FileSystemFileHandle) => {
    console.log(handle)
    const list = [...openedHistory.value]
    list.push({
      handle,
      lastOpened: Date.now(),
    })
    // 最多保存10条历史记录，因为无法区分打开的文件是否为同一文件
    await setOpenedHistory(list.slice(0, 10))
  }

  const historyMenuOptions = computed((): QuickOptionItem[] => {
    if (!openedHistory.value.length) {
      return []
    }
    return [
      ...openedHistory.value
        .sort((a, b) => {
          return b.lastOpened - a.lastOpened
        })
        .map((i) => {
          const {handle, lastOpened} = i
          return {
            // 由于API不支持判断文件的绝对路径，使用添加时间来区分
            label: handle.name + ` (${moment(lastOpened).format('HH:mm:ss')})`,
            props: {
              onClick: async () => {
                if (await verifyPermission(handle)) {
                  handleOpenHistory(handle)
                }
              },
            },
          }
        }),
      {
        label: '🧹 Clear History',
        props: {
          onClick: () => {
            openedHistory.value = []
          },
        },
      },
    ]
  })

  return {
    openedHistory,
    setOpenedHistory,
    appendHistory,
    historyMenuOptions,
  }
}
