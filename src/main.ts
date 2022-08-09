import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {
  // create naive ui
  create,
  // component
  NButton
} from 'naive-ui'
import {createPinia} from 'pinia'

const naive = create({
  components: [NButton]
})

const app = createApp(App)
app.use(naive)
app.use(createPinia())
app.mount('#app')
