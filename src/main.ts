import pkg from '../package.json'
import moment from 'moment/moment'

/**
 * 输出包版本信息
 */
// @ts-ignore
const timeDisplay = BUILD_TIMESTAMP ? moment(BUILD_TIMESTAMP).format('YYYY-MM-DD HH:mm:ss') : 'N/A'
console.info(
  `%c ${pkg.name} ${import.meta.env.MODE} %c ${timeDisplay} %c`,
  'background:#258292; border-radius: 3px 0 0 3px; padding:2px 0; color: #f9f9f9; font-size: 10px;',
  'background:#f9f9f9; border-radius: 0 3px 3px 0; padding:2px 0; color: #258292; font-size: 10px; font-weight: bold;',
  'background:transparent'
)

import {createApp} from 'vue'
import App from './App.vue'
import {create} from 'naive-ui'
import './styles/style.scss'
import '@/components/CommonUI/ViewPortWindow/theme/index.scss'
import router from './router'
import {createPinia} from 'pinia'
import {PiniaSharedState} from 'pinia-shared-state'
const naive = create()
import PortalVue from 'portal-vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import i18n from '@/i18n/index'

const app = createApp(App)
app.use(i18n)
app.use(naive)
app.use(router)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
pinia.use(
  PiniaSharedState({
    // Enables the plugin for all stores. Defaults to true.
    enable: false,
  })
)
app.use(pinia)
app.use(PortalVue)
app.mount('#app')
