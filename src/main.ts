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

const app = createApp(App)
const head = createHead()
app.use(head)
app.use(naive)
app.use(router)
app.use(createPinia())
app.mount('#app')
