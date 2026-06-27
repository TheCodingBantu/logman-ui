import axios from 'axios'
import router from '@/router'

const API = import.meta.env.VITE_API_ENDPOINT

export const apiClient = axios.create({
  baseURL: API,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Attach the JWT access token to every request.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Transparent refresh: on a 401, try once to mint a new access token with the
// stored refresh token and replay the original request. If that fails, clear the
// session and bounce to the login screen.
let refreshing = null

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const status = error.response?.status

    if (status === 401 && original && !original._retry) {
      const refresh = localStorage.getItem('refresh')
      if (!refresh) {
        forceLogout()
        return Promise.reject(error)
      }
      original._retry = true
      try {
        if (!refreshing) {
          refreshing = axios
            .post(`${API}accounts/token/refresh/`, { refresh })
            .then((res) => res.data.access)
            .finally(() => {
              refreshing = null
            })
        }
        const newAccess = await refreshing
        localStorage.setItem('access', newAccess)
        original.headers.Authorization = `Bearer ${newAccess}`
        return apiClient(original)
      } catch (refreshError) {
        forceLogout()
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

function forceLogout() {
  localStorage.removeItem('access')
  localStorage.removeItem('refresh')
  localStorage.removeItem('user')
  if (router.currentRoute.value.name !== 'login') {
    router.push({ name: 'login' })
  }
}

// Friendly error-message extractor for views/toasts.
export const errorMessage = (error, fallback = 'Something went wrong') => {
  const data = error?.response?.data
  if (!data) return error?.message || fallback
  if (typeof data === 'string') return data
  if (data.detail) return data.detail
  if (data.error) return data.error
  const firstKey = Object.keys(data)[0]
  if (firstKey) {
    const val = data[firstKey]
    return Array.isArray(val) ? `${firstKey}: ${val[0]}` : `${firstKey}: ${val}`
  }
  return fallback
}
