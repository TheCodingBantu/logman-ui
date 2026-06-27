import { createRouter, createWebHistory } from 'vue-router'
import SourcesView from '@/views/SourcesView.vue'
import LogView from '@/views/LogView.vue'

const routes = [
  {
    meta: { title: 'Log Sources', requiresAuth: true },
    path: '/',
    name: 'dashboard',
    component: SourcesView
  },
  {
    meta: { title: 'Log Sources', requiresAuth: true },
    path: '/sources',
    name: 'sources',
    component: SourcesView
  },
  {
    meta: { title: 'Live Logs', requiresAuth: true },
    path: '/sources/:id/logs',
    name: 'source-logs',
    component: LogView
  },
  {
    meta: { title: 'Connections', requiresAuth: true, superAdmin: true },
    path: '/connections',
    name: 'connections',
    component: () => import('@/views/ConnectionsView.vue')
  },
  {
    meta: { title: 'Users', requiresAuth: true, superAdmin: true },
    path: '/users',
    name: 'users',
    component: () => import('@/views/UsersView.vue')
  },
  {
    meta: { title: 'Profile', requiresAuth: true },
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue')
  },
  {
    meta: { title: 'Login' },
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    meta: { title: 'Error' },
    path: '/:pathMatch(.*)*',
    name: 'error',
    component: () => import('@/views/ErrorView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

// Auth + role guard (reads localStorage directly to avoid pinia init ordering).
router.beforeEach((to) => {
  const isAuthenticated = !!localStorage.getItem('access')
  let isSuperAdmin = false
  try {
    isSuperAdmin = !!JSON.parse(localStorage.getItem('user') || 'null')?.is_superuser
  } catch {
    isSuperAdmin = false
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.name === 'login' && isAuthenticated) {
    return { name: 'sources' }
  }
  if (to.meta.superAdmin && !isSuperAdmin) {
    return { name: 'sources' }
  }
  return true
})

export default router
