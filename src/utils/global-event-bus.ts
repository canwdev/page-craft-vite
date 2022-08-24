// using ES6 modules
import mitt from 'mitt'

const globalEventBus = mitt()

export default globalEventBus

export const GlobalEvents = {
  ON_NODE_SELECT: 'ON_NODE_SELECT',
  ON_IMPORT_STYLE: 'ON_IMPORT_STYLE',
}
