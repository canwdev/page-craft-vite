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
const naive = create({
  components: [NButton],
})
import PortalVue from 'portal-vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import i18n from '@/i18n/index'

/*monaco config start*/
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new jsonWorker()
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker()
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker()
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker()
    }
    return new editorWorker()
  },
}
/*monaco config end*/

const app = createApp(App)
app.use(i18n)
app.use(naive)
app.use(router)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(PortalVue)
app.mount('#app')
