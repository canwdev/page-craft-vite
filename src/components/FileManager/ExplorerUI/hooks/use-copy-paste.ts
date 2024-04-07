import {fsWebApi} from '../../utils/api'
import {normalizePath} from '../../utils'

export const useCopyPaste = ({selectedPaths, basePath, isLoading, emit}) => {
  const explorerStore = reactive({
    cutPaths: [],
    copyPaths: [],
  })

  const enablePaste = computed(() => {
    return explorerStore.cutPaths.length > 0 || explorerStore.copyPaths.length > 0
  })

  const handleCut = () => {
    explorerStore.copyPaths = []
    explorerStore.cutPaths = selectedPaths.value
  }

  const handleCopy = () => {
    explorerStore.cutPaths = []
    explorerStore.copyPaths = selectedPaths.value
  }

  const handlePaste = async () => {
    let paths: string[] = []
    let isMove = false
    if (explorerStore.cutPaths.length) {
      paths = explorerStore.cutPaths
      isMove = true
    } else if (explorerStore.copyPaths.length) {
      paths = explorerStore.copyPaths
    } else {
      return
    }
    // console.log(paths)

    try {
      isLoading.value = true
      await fsWebApi.copyPaste({
        fromPaths: paths,
        toPath: basePath.value,
        isMove,
      })
      explorerStore.cutPaths = []
      explorerStore.copyPaths = []
      emit('refresh')
    } finally {
      isLoading.value = false
    }
  }

  return {
    enablePaste,
    handleCut,
    handleCopy,
    handlePaste,
  }
}
