import {createRouter, createWebHashHistory} from 'vue-router'
import HomeView from '@/views/HomeView.vue'

let history = createWebHashHistory()
let routes = [
  {
    path: '/',
    name: 'HomeView',
    component: HomeView,
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
          title: 'Excel Copy Tool',
        },
      },
      {
        path: 'vue-i18n-edit',
        name: 'VueI18nEditTool',
        component: () => import('@/views/VueI18nEditTool.vue'),
        meta: {
          title: 'I18n Edit Tool',
        },
      },
      {
        path: 'vue-i18n-dir',
        name: 'VueI18nBatchTool',
        component: () => import('@/views/VueI18nDirTool.vue'),
        meta: {
          title: 'I18n Batch Tool',
        },
      },
    ],
  },
]

export default createRouter({history, routes})
