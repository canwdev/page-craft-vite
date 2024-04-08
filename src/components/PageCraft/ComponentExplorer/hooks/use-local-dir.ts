import {setHfsInstance} from '@/components/FileManager/utils/providers/humanfs-api'
import {useOpenedHistory} from '@/components/VueI18nEditTool/file-history'

export const useLocalDir = ({emit}) => {
  const {
    appendHistory,
    historyMenuOptions: localDirHistory,
    openedHistory,
  } = useOpenedHistory('mc_explorer_local_dir3', async (handle: FileSystemDirectoryHandle) => {
    setHfsInstance(handle)
    emit('refresh')
  })
  const isShowDirHistory = ref(false)

  const handleOpenLocalDir = async () => {
    const handle = await window.showDirectoryPicker()
    setHfsInstance(handle)
    emit('refresh')
    await appendHistory(handle)
  }

  return {
    handleOpenLocalDir,
    localDirHistory,
    isShowDirHistory,
  }
}
