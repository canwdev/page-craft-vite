import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import {
  // create naive ui
  create,
  // component
  NButton,
} from 'naive-ui'
import {createPinia} from 'pinia'
import '7.css/dist/7.scoped.css'
const naive = create({
  components: [NButton],
})

const app = createApp(App)
app.use(naive)
app.use(createPinia())
app.mount('#app')
