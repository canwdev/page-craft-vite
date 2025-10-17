import ContextMenu from '@imengyu/vue3-context-menu'
import ElementPlus from 'element-plus'
import moment from 'moment/moment'

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { PiniaSharedState } from 'pinia-shared-state'
import PortalVue from 'portal-vue'

import { createApp } from 'vue'
import i18n from '@/i18n/index'

import pkg from '../package.json'
import App from './App.vue'
import router from './router'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
// https://pictogrammers.com/library/mdi/
import '@mdi/font/css/materialdesignicons.min.css'
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import './styles/style.scss'
import '@/components/Apps/app-list'

/**
 * 输出包版本信息
 */
// @ts-ignore
const timeDisplay = BUILD_TIMESTAMP ? moment(BUILD_TIMESTAMP).format('YYYY-MM-DD HH:mm:ss') : 'N/A'
console.info(
  `%c ${pkg.name} ${pkg.version} ${import.meta.env.MODE} %c ${timeDisplay} %c`,
  'background:#009688; border-radius: 3px 0 0 3px; padding:2px 0; color: #f9f9f9; font-size: 10px;',
  'background:#f9f9f9; border-radius: 0 3px 3px 0; padding:2px 0; color: #009688; font-size: 10px; font-weight: bold;',
  'background:transparent',
)

const app = createApp(App)
app.use(i18n)
app.use(ElementPlus)
app.use(router)
app.use(ContextMenu)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
pinia.use(
  PiniaSharedState({
    // Enables the plugin for all stores. Defaults to true.
    enable: false,
  }),
)
app.use(pinia)
app.use(PortalVue)
app.mount('#app')
