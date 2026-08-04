import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { apiClient } from '@/services/api'

const API = import.meta.env.VITE_API_ENDPOINT

const read = (key, fallback = null) => {
  const raw = localStorage.getItem(key)
  if (raw === null) return fallback
  try {
    return JSON.parse(raw)
  } catch {
    return raw
  }
}

export const useAuthStore = defineStore('auth', () => {
  const access = ref(localStorage.getItem('access') || null)
  const refresh = ref(localStorage.getItem('refresh') || null)
  const user = ref(read('user'))

  const isAuthenticated = computed(() => !!access.value)
  const isSuperAdmin = computed(() => !!user.value?.is_superuser)
  const displayName = computed(() => user.value?.name || user.value?.email || 'User')

  function setTokens(payload) {
    if (payload.access) {
      access.value = payload.access
      localStorage.setItem('access', payload.access)
    }
    if (payload.refresh) {
      refresh.value = payload.refresh
      localStorage.setItem('refresh', payload.refresh)
    }
  }

  function setUser(payload) {
    user.value = payload
    localStorage.setItem('user', JSON.stringify(payload))
  }

  // Load the full current user (incl. is_superuser) from the API. The token
  // endpoint only returns a minimal user, so without this an admin isn't
  // recognised as one until they happen to open the Profile page (which fetches
  // this same endpoint). Merge onto any existing user so cached fields survive.
  async function fetchUser() {
    const { data } = await apiClient.get('accounts/users/me/')
    setUser({ ...(user.value || {}), ...data })
    return data
  }

  async function login(email, password) {
    const { data } = await axios.post(`${API}accounts/token/`, { email, password })
    setTokens(data)
    if (data.user) setUser(data.user)
    // Immediately resolve the real profile so admin-only nav shows on first
    // paint after login — no need to click anything. Non-fatal on failure.
    try {
      await fetchUser()
    } catch {
      // keep the session; the startup hydrate / Profile page will retry
    }
    return data
  }

  function logout() {
    access.value = null
    refresh.value = null
    user.value = null
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    localStorage.removeItem('user')
  }

  return {
    access,
    refresh,
    user,
    isAuthenticated,
    isSuperAdmin,
    displayName,
    setTokens,
    setUser,
    fetchUser,
    login,
    logout
  }
})
