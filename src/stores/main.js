import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import {apiClient} from '@/services/api.js'

export const useMainStore = defineStore('main', () => {
  const userName = ref('John Doe')
  const userEmail = ref('doe.doe.doe@example.com')

  const userAvatar = computed(
    () =>
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail.value.replace(
        /[^a-z0-9]+/gi,
        '-'
      )}`
  )

  const isFieldFocusRegistered = ref(false)

  const sources = ref([])
  const history = ref([])

  function setUser(payload) {
    if (payload.name) {
      userName.value = payload.name
    }
    if (payload.email) {
      userEmail.value = payload.email
    }
  }

 const fetchSampleClients = async()=> {
    try {
      const response = await apiClient.get('sources');
      sources.value = [...sources.value, ...response.data];
   
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  function fetchSampleHistory() {
    axios
      .get(`data-sources/history.json`)
      .then((result) => {
        history.value = result?.data?.data
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  return {
    userName,
    userEmail,
    userAvatar,
    isFieldFocusRegistered,
    sources,
    history,
    setUser,
    fetchSampleClients,
    fetchSampleHistory
  }
})
