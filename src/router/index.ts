import {createRouter, createWebHashHistory} from 'vue-router'
import WelcomePage from '@/views/WelcomePage.vue'
import CraftPage from '@/views/CraftPage.vue'
import DevPage from '@/views/DevPage.vue'
import pkg from '../../package.json'
import {useSettingsStore} from '@/store/settings'
import i18n from '@/i18n/index'
import {window as tauriWin} from '@tauri-apps/api'

let history = createWebHashHistory()
let routes = [
  {
    path: '/',
    name: 'HomePage',
    component: WelcomePage,
    meta: {
      title: i18n.global.t('common.welcome'),
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
    path: '/craft/playground',
    name: 'CraftPlayground',
    component: () => import('@/views/CraftPlayground.vue'),
    meta: {
      title: `Playground`,
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
          title: i18n.global.t('common.excel_copy_tool'),
        },
      },
      {
        path: 'vue-i18n-edit',
        name: 'VueI18nEditTool',
        component: () => import('@/views/VueI18nEditTool.vue'),
        meta: {
          title: i18n.global.t('common.i18njson_editing_too'),
        },
      },
      {
        path: 'vue-i18n-dir',
        name: 'VueI18nBatchTool',
        component: () => import('@/views/VueI18nDirTool.vue'),
        meta: {
          title: i18n.global.t('common.i18njson_batch_tool'),
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

  if (window.__TAURI__) {
    let curWin = tauriWin.getCurrent()
    console.log('curWin', curWin)
    curWin.setTitle(document.title)
  }
})
export default router
