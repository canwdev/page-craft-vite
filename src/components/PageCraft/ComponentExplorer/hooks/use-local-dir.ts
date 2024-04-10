import {setHfsInstance} from '@/components/FileManager/utils/providers/humanfs-api'
import {useOpenedHistory} from '@/components/VueI18nEditTool/file-history'
import {QuickOptionItem} from '@/components/CommonUI/QuickOptions/enum'

export const useLocalDir = ({emit}) => {
  const handleRef = ref<FileSystemDirectoryHandle | null>(null)
  const {appendHistory, historyMenuOptions, openedHistory} = useOpenedHistory(
    'mc_explorer_local_dir3',
    async (handle: FileSystemDirectoryHandle) => {
      await setHfsInstance(handle)
      emit('refresh')
      handleRef.value = handle
    }
  )
  const isShowDirHistory = ref(false)

  const handleOpenLocalDir = async () => {
    const handle = await window.showDirectoryPicker()
    await setHfsInstance(handle)
    emit('refresh')
    await appendHistory(handle)
    handleRef.value = handle
  }

  const handleCloseLocalDir = async () => {
    await setHfsInstance()
    emit('refresh')
    handleRef.value = null
  }

  const localDirHistoryOptions = computed(() => {
    const options: QuickOptionItem[] = [...historyMenuOptions.value]
    if (handleRef.value) {
      options.push({
        label: '✖️ Close Local Folder',
        props: {
          onClick: handleCloseLocalDir,
        },
      })
    }
    return options
  })

  return {
    handleOpenLocalDir,
    localDirHistoryOptions,
    isShowDirHistory,
  }
}
