// using ES6 modules
import mitt from 'mitt'

const globalEventBus = mitt()

export default globalEventBus

export const GlobalEvents = {
  ON_NODE_SELECT: 'ON_NODE_SELECT',
  IMPORT_SUCCESS: 'IMPORT_SUCCESS',
  SYNC_STORAGE_DATA: 'SYNC_STORAGE_DATA',
  ON_COMP_HOVER: 'ON_COMP_HOVER',
  ON_COMP_HOVER_OUT: 'ON_COMP_HOVER_OUT',
}

export const syncStorageData = () => {
  return new Promise((resolve) => {
    globalEventBus.emit(GlobalEvents.SYNC_STORAGE_DATA, resolve)
  })
}
