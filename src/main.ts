import {createApp} from 'vue'
import App from './App.vue'
import {
  // create naive ui
  create,
  // component
  NButton,
} from 'naive-ui'
import './styles/style.scss'
import '@/components/CommonUI/ViewPortWindow/theme/index.scss'
import router from './router'
import {createPinia} from 'pinia'
import {PiniaSharedState} from 'pinia-shared-state'
const naive = create({
  components: [NButton],
})
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
