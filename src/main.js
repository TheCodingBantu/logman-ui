import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useMainStore } from '@/stores/main.js'
import { useAuthStore } from '@/stores/auth.js'

import './css/main.css'

// Init Pinia
const pinia = createPinia()

// Create Vue app
createApp(App).use(router).use(pinia).mount('#app')

// Seed the displayed user from the persisted session (if any)
const mainStore = useMainStore(pinia)
try {
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null')
  if (storedUser) mainStore.setUser(storedUser)
} catch (e) {
  // ignore malformed stored user
}

// On every load (e.g. a page refresh), re-resolve the real profile in the
// background so admin-only nav is correct without visiting the Profile page.
// The cached user shows instantly; is_superuser is corrected as soon as this
// returns. Silent on failure — the response interceptor handles a dead session.
const authStore = useAuthStore(pinia)
if (authStore.isAuthenticated) {
  authStore.fetchUser().catch(() => {})
}

// Dark mode
// Uncomment, if you'd like to restore persisted darkMode setting, or use `prefers-color-scheme: dark`. Make sure to uncomment localStorage block in src/stores/darkMode.js
import { useDarkModeStore } from './stores/darkMode'

const darkModeStore = useDarkModeStore(pinia)

if (
  (!localStorage['darkMode'] && window.matchMedia('(prefers-color-scheme: dark)').matches) ||
  localStorage['darkMode'] === '1'
) {
  darkModeStore.set(true)
}

// Default title tag
const defaultDocumentTitle = 'LogMan'

// Set document title from route meta
router.afterEach((to) => {
  document.title = to.meta?.title
    ? `${to.meta.title} — ${defaultDocumentTitle}`
    : defaultDocumentTitle
})
