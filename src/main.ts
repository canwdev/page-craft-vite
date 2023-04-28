import {createApp} from 'vue'
import App from './App.vue'
import {
  // create naive ui
  create,
  // component
  NButton,
} from 'naive-ui'
import './styles/style.scss'
import router from './router'
import {createPinia} from 'pinia'
const naive = create({
  components: [NButton],
})
import {createHead} from '@vueuse/head'
import PortalVue from 'portal-vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App)
const head = createHead()
app.use(head)
app.use(naive)
app.use(router)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(PortalVue)
app.mount('#app')
