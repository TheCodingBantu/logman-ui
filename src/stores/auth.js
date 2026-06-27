import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

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

  async function login(email, password) {
    const { data } = await axios.post(`${API}accounts/token/`, { email, password })
    setTokens(data)
    if (data.user) setUser(data.user)
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
    login,
    logout
  }
})
