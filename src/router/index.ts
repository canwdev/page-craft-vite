import {createRouter, createWebHashHistory} from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import DevPage from '@/views/DevPage.vue'
import pkg from '../../package.json'

let history = createWebHashHistory()
let routes = [
  {
    path: '/',
    name: 'HomeView',
    component: HomeView,
    meta: {
      title: `Page Craft v${pkg.version}`,
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

router.afterEach((to, _, failure) => {
  document.title = (to?.meta?.title as string) || document.title
})
export default router
