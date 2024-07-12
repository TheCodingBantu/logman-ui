import { createRouter, createWebHashHistory } from 'vue-router'
import Sources from '@/views/SourceView.vue'
import SourceEditForm from '@/views/SourceEditForm.vue'
import { AuthService } from '@/services/auth';
import LogView from '@/views/LogView.vue'
import ManageSources from '@/views/ManageSources.vue';
import ManageConnections from '@/views/ManageConnections.vue';
import ConnectionEditForm from '@/views/ConnectionEditForm .vue';

const authService = new AuthService();

const routes = [

  {
      meta: {
      title: 'Dashboard', requiresAuth: true
    },
    path: '/',
    name: 'dashboard',
    component: Sources
    
  },
  {
    meta: {
      title: 'Sources', requiresAuth: true
    },
    path: '/sources',
    name: 'sources',
    component: Sources
  },

  {
    meta: {
      title: 'Logs', requiresAuth: true
    },
    path: '/logs',
    name: 'logs',
    component: LogView,
  },
  
  {
    meta: {
      title: 'Manage Sources', requiresAuth: true
    },
    path: '/sources/manage',
    name: 'manage',
    component: ManageSources
  },
  {
    meta: {
      title: 'Manage Connections', requiresAuth: true
    },
    path: '/connections/manage',
    name: 'manage-connections',
    component: ManageConnections
  },
  {
    meta: {
      title: 'Add Source', requiresAuth: true
    },
    path: '/source/add',
    name: 'add-source',
    component: SourceEditForm
  },
  {
    meta: {
      title: 'Add Connection', requiresAuth: true
    },
    path: '/connection/add',
    name: 'add-connection',
    component: ConnectionEditForm 
  },
  {
    meta: {
      title: 'Profile', requiresAuth: true
    },
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue')
  },

  {
    meta: {
      title: 'Login',
    },
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue')
  },

]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
   
    if (to.name !== 'login' && !authService.getCurrentUser()){
      next({
        name: 'login',
      });

    } else {
      next();
    }

  } else {
    next();
  }
});

export default router
