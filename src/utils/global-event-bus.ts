// using ES6 modules
import mitt from 'mitt'

const globalEventBus = mitt()

export default globalEventBus

export const GlobalEvents = {
  ON_ADD_STYLE: 'ON_ADD_STYLE',
  IMPORT_SUCCESS: 'IMPORT_SUCCESS',
  SYNC_STORAGE_DATA: 'SYNC_STORAGE_DATA',
  ON_COMP_PREVIEW: 'ON_COMP_PREVIEW',
  ON_COMP_PREVIEW_CLOSE: 'ON_COMP_PREVIEW_CLOSE',
  ON_COMP_HOVER: 'ON_COMP_HOVER',
  ON_COMP_HOVER_OUT: 'ON_COMP_HOVER_OUT',
  ON_COMP_HOVER_CLEAR: 'ON_COMP_HOVER_CLEAR',
  I18N_SAVE_ALL_CHANGES: 'I18N_SAVE_ALL_CHANGES',
  I18N_BATCH_GUI_GET_SUBS: 'I18N_BATCH_GUI_GET_SUBS',
}

export const useGlobalBusOn = (eventName, callback) => {
  onMounted(() => {
    globalEventBus.on(eventName, callback)
  })
  onBeforeUnmount(() => {
    globalEventBus.off(eventName, callback)
  })
}

export const syncStorageData = () => {
  return new Promise((resolve) => {
    globalEventBus.emit(GlobalEvents.SYNC_STORAGE_DATA, resolve)
  })
}
