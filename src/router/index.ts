import {createRouter, createWebHashHistory} from 'vue-router'
import WelcomePage from '@/views/HomePage.vue'
import i18n from '@/i18n/index'
import {window as tauriWin} from '@tauri-apps/api'
import {formatSiteTitle} from '@/router/router-utils'

import iconExcel from '@/assets/textures/excel.svg?url'
import iconTranslate from '../assets/textures/translate.svg?url'
import iconAi from '@/assets/textures/chat-gpt-logo.svg?url'
import iconText from '@/assets/textures/enchanted_book.png?url'
import iconDev from '@/assets/textures/redstone.png?url'

let history = createWebHashHistory()
let routes = [
  {
    path: '/',
    name: 'HomePage',
    component: WelcomePage,
    meta: {
      title: i18n.global.t('common.welcome'),
    },
    // beforeEnter: (to, from, next) => {
    //   return next()
    // },
  },
  {
    path: '/craft',
    name: 'CraftPage',
    component: () => import('@/views/CraftPage.vue'),
    meta: {
      title: `Craft`,
    },
  },
  {
    path: '/craft/playground',
    name: 'PlaygroundPage',
    component: () => import('@/views/PlaygroundPage.vue'),
    meta: {
      title: `Playground`,
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
          icon: iconExcel,
        },
      },
      {
        path: 'richtext',
        name: 'RichTextTool',
        component: () => import('@/views/RichTextTool.vue'),
        meta: {
          title: `RichText Tool`,
          icon: iconText,
        },
      },
      {
        path: 'vue-i18n-edit',
        name: 'VueI18nEditTool',
        component: () => import('@/views/VueI18nEditTool.vue'),
        meta: {
          title: i18n.global.t('common.i18njson_editing_too'),
          icon: iconTranslate,
        },
      },
      {
        path: 'vue-i18n-dir',
        name: 'VueI18nBatchTool',
        component: () => import('@/views/VueI18nDirTool.vue'),
        meta: {
          title: i18n.global.t('common.i18njson_batch_tool'),
          icon: iconTranslate,
        },
      },
      {
        path: 'ai',
        name: 'AiPage',
        component: () => import('@/views/AiPage.vue'),
        meta: {
          title: `ChatGPT`,
          icon: iconAi,
        },
      },
      {
        path: 'dev',
        name: 'DevPage',
        component: () => import('@/views/DevPage.vue'),
        meta: {
          title: `Dev Page`,
          icon: iconDev,
        },
      },
    ],
  },
  // catch all route for 404
  {path: '/:catchAll(.*)', component: () => import('@/views/404.vue')},
]
const router = createRouter({history, routes})

router.beforeEach(async (to, from, next) => {
  return next()
})

router.afterEach((to, _, failure) => {
  document.title = formatSiteTitle(to?.meta?.title as string)

  if (window.__TAURI__) {
    let curWin = tauriWin.getCurrent()
    console.log('curWin', curWin)
    curWin.setTitle(document.title)
  }
})
export default router
