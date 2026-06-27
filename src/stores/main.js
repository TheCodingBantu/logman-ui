import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMainStore = defineStore('main', () => {
  const userName = ref('')
  const userEmail = ref('')

  const userAvatar = computed(
    () =>
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${(userEmail.value || 'user').replace(
        /[^a-z0-9]+/gi,
        '-'
      )}`
  )

  const isFieldFocusRegistered = ref(false)

  function setUser(payload) {
    if (payload.name) {
      userName.value = payload.name
    }
    if (payload.email) {
      userEmail.value = payload.email
    }
  }

  return {
    userName,
    userEmail,
    userAvatar,
    isFieldFocusRegistered,
    setUser
  }
})
