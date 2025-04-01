import {useIDBKeyval} from '@vueuse/integrations/useIDBKeyval'
import {QuickOptionItem} from '@canwdev/vgo-ui/src/components/QuickOptions/enum'
import moment from 'moment/moment'

export type FileHandleHistory = {
  handle: FileSystemFileHandle
  lastOpened: number
  alias: string
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
    [],
  )

  const appendHistory = async (handle: FileSystemFileHandle) => {
    // console.log(handle)
    const list = [...openedHistory.value]
    list.push({
      handle,
      lastOpened: Date.now(),
      alias: '',
    })
    // 最多保存20条历史记录，因为无法区分打开的文件是否为同一文件
    await setOpenedHistory(list.slice(0, 20))
  }

  const handleOpen = async (handle) => {
    if (await verifyPermission(handle)) {
      handleOpenHistory(handle)
    }
  }
  const handleRename = async (item) => {
    const list = [...openedHistory.value]
    const idx = list.findIndex((i) => i === item)
    if (idx !== -1) {
      let f = list[idx]
      const newName = await window.$mcUtils.showInputPrompt({
        title: `Set Alias: ${f.handle.name}`,
        value: f.alias || f.handle.name,
        allowEmpty: true,
      })
      f = {
        ...f,
        alias: newName,
      }
      list.splice(idx, 1, f)
      await setOpenedHistory(list)
    }
  }
  const handleRemove = async (item: FileHandleHistory) => {
    const list = [...openedHistory.value]
    const idx = list.findIndex((i) => i === item)
    if (idx !== -1) {
      list.splice(idx, 1)
      await setOpenedHistory(list)
    }
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
          const {handle, lastOpened, alias} = i
          return {
            // 由于API不支持判断文件的绝对路径，使用添加时间来区分
            label: alias || handle.name + ` (${moment(lastOpened).format('HH:mm:ss')})`,
            key: `open_${lastOpened}`,
            props: {
              onClick: () => handleOpen(handle),
            },
            children: [
              {
                label: `Set Alias`,
                key: `alias_${lastOpened}`,
                props: {
                  onClick: () => handleRename(i),
                },
              },
              {
                label: `Remove`,
                key: `remove_${lastOpened}`,
                props: {
                  onClick: () => handleRemove(i),
                },
              },
            ],
          }
        }),
      {
        label: '🧹 Clear History',
        props: {
          onClick: () => {
            window.$dialog
              .confirm('Confirm clear history?', '', {
                type: 'warning',
              })
              .then(() => {
                openedHistory.value = []
              })
              .catch()
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
