import { createRouter, createWebHashHistory } from 'vue-router'
import Sources from '@/views/SourcesView.vue'
import LogView from '@/views/LogView.vue'
import SourceEditForm from '@/views/SourceEditForm.vue'


const routes = [

  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: 'Dashboard'
    },
    path: '/',
    name: 'dashboard',
    component: Sources
  },
  {
    meta: {
      title: 'Sources'
    },
    path: '/sources',
    name: 'sources',
    component: Sources
  },
  {
    meta: {
      title: 'Manage Sources'
    },
    path: '/sources/manage',
    name: 'manage',
    component: SourceEditForm
  },
  {
    meta: {
      title: 'Logs'
    },
    path: '/logs',
    name: 'logs',
    component: LogView
  },
  {
    meta: {
      title: 'Profile'
    },
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue')
  },
  {
    meta: {
      title: 'Ui'
    },
    path: '/ui',
    name: 'ui',
    component: () => import('@/views/UiView.vue')
  },
  {
    meta: {
      title: 'Responsive layout'
    },
    path: '/responsive',
    name: 'responsive',
    component: () => import('@/views/ResponsiveView.vue')
  },
  {
    meta: {
      title: 'Login'
    },
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    meta: {
      title: 'Error'
    },
    path: '/error',
    name: 'error',
    component: () => import('@/views/ErrorView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

export default router
