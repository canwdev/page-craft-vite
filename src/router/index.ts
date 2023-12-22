import {createRouter, createWebHashHistory} from 'vue-router'
import WelcomePage from '@/views/WelcomePage.vue'
import CraftPage from '@/views/CraftPage.vue'
import DevPage from '@/views/DevPage.vue'
import pkg from '../../package.json'
import {useSettingsStore} from '@/store/settings'

let history = createWebHashHistory()
let routes = [
  {
    path: '/',
    name: 'HomePage',
    component: WelcomePage,
    meta: {
      title: `Welcome`,
    },
    beforeEnter: (to, from, next) => {
      const settingsStore = useSettingsStore()

      if (!settingsStore.enableWelcomePage) {
        return next({name: 'CraftPage'})
      }
      return next()
    },
  },
  {
    path: '/craft',
    name: 'CraftPage',
    component: CraftPage,
    meta: {
      title: `Craft`,
    },
  },
  {
    path: '/dev',
    name: 'Dev',
    component: DevPage,
    meta: {
      title: `Dev Page`,
    },
  },
  {
    path: '/tools',
    name: 'ToolsView',
    redirect: '/tools/excel-cp',
    children: [
      {
        path: 'excel-cp',
        name: 'ExcelCopyTool',
        component: () => import('@/views/ExcelCopyTool.vue'),
        meta: {
          title: 'Excel copy tool',
        },
      },
      {
        path: 'vue-i18n-edit',
        name: 'VueI18nEditTool',
        component: () => import('@/views/VueI18nEditTool.vue'),
        meta: {
          title: 'I18n(json) editing tool',
        },
      },
      {
        path: 'vue-i18n-dir',
        name: 'VueI18nBatchTool',
        component: () => import('@/views/VueI18nDirTool.vue'),
        meta: {
          title: 'I18n(json) batch tool',
        },
      },
    ],
  },
]
const router = createRouter({history, routes})

export const formatSiteTitle = (t?: string) => {
  const title = `Page Craft v${pkg.version}`
  if (!t) {
    return title
  }
  return `${t} - ${title}`
}

router.afterEach((to, _, failure) => {
  document.title = formatSiteTitle(to?.meta?.title as string)
})
export default router
