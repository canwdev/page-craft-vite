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
      },
      {
        path: 'vue-i18n-cp',
        name: 'VueI18nCopyTool',
        component: () => import('@/views/VueI18nCopyTool.vue'),
      },
    ],
  },
]

export default createRouter({history, routes})
