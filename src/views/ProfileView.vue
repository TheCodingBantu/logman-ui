<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useMainStore } from '@/stores/main'
import { useAuthStore } from '@/stores/auth'
import { mdiAccount, mdiMail, mdiAsterisk, mdiFormTextboxPassword } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import BaseDivider from '@/components/BaseDivider.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import UserCard from '@/components/UserCard.vue'
import NotificationBar from '@/components/NotificationBar.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import { apiClient, errorMessage } from '@/services/api'

const mainStore = useMainStore()
const auth = useAuthStore()

const profileForm = reactive({ name: '', email: '' })
const passwordForm = reactive({ current_password: '', new_password: '', new_password_confirm: '' })

const profileMsg = ref({ type: '', text: '' })
const passwordMsg = ref({ type: '', text: '' })
const savingProfile = ref(false)
const savingPass = ref(false)

const loadProfile = async () => {
  try {
    const { data } = await apiClient.get('accounts/users/me/')
    profileForm.name = data.name || ''
    profileForm.email = data.email || ''
    auth.setUser({ ...(auth.user || {}), ...data })
    mainStore.setUser(data)
  } catch (e) {
    profileMsg.value = { type: 'danger', text: errorMessage(e, 'Failed to load profile') }
  }
}

const submitProfile = async () => {
  savingProfile.value = true
  profileMsg.value = { type: '', text: '' }
  try {
    const { data } = await apiClient.patch('accounts/users/me/', {
      name: profileForm.name,
      email: profileForm.email
    })
    auth.setUser({ ...(auth.user || {}), ...data })
    mainStore.setUser(data)
    profileMsg.value = { type: 'success', text: 'Profile updated.' }
  } catch (e) {
    profileMsg.value = { type: 'danger', text: errorMessage(e, 'Failed to update profile') }
  } finally {
    savingProfile.value = false
  }
}

const submitPass = async () => {
  passwordMsg.value = { type: '', text: '' }
  if (passwordForm.new_password !== passwordForm.new_password_confirm) {
    passwordMsg.value = { type: 'danger', text: 'New passwords do not match.' }
    return
  }
  savingPass.value = true
  try {
    await apiClient.post('accounts/users/change-password/', {
      current_password: passwordForm.current_password,
      new_password: passwordForm.new_password
    })
    passwordForm.current_password = ''
    passwordForm.new_password = ''
    passwordForm.new_password_confirm = ''
    passwordMsg.value = { type: 'success', text: 'Password changed.' }
  } catch (e) {
    passwordMsg.value = { type: 'danger', text: errorMessage(e, 'Failed to change password') }
  } finally {
    savingPass.value = false
  }
}

onMounted(loadProfile)
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiAccount" title="Profile" main />

      <UserCard class="mb-6" />

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CardBox is-form @submit.prevent="submitProfile">
          <NotificationBar v-if="profileMsg.text" :color="profileMsg.type" class="mb-4">
            {{ profileMsg.text }}
          </NotificationBar>

          <FormField label="Name" help="Required. Your name">
            <FormControl
              v-model="profileForm.name"
              :icon="mdiAccount"
              name="username"
              required
              autocomplete="name"
            />
          </FormField>
          <FormField label="E-mail" help="Required. Your e-mail">
            <FormControl
              v-model="profileForm.email"
              :icon="mdiMail"
              type="email"
              name="email"
              required
              autocomplete="email"
            />
          </FormField>

          <template #footer>
            <BaseButtons>
              <BaseButton
                color="info"
                type="submit"
                :label="savingProfile ? 'Saving…' : 'Save profile'"
                :disabled="savingProfile"
              />
            </BaseButtons>
          </template>
        </CardBox>

        <CardBox is-form @submit.prevent="submitPass">
          <NotificationBar v-if="passwordMsg.text" :color="passwordMsg.type" class="mb-4">
            {{ passwordMsg.text }}
          </NotificationBar>

          <FormField label="Current password" help="Required. Your current password">
            <FormControl
              v-model="passwordForm.current_password"
              :icon="mdiAsterisk"
              name="password_current"
              type="password"
              required
              autocomplete="current-password"
            />
          </FormField>

          <BaseDivider />

          <FormField label="New password" help="Required. New password">
            <FormControl
              v-model="passwordForm.new_password"
              :icon="mdiFormTextboxPassword"
              name="password"
              type="password"
              required
              autocomplete="new-password"
            />
          </FormField>

          <FormField label="Confirm password" help="Required. New password one more time">
            <FormControl
              v-model="passwordForm.new_password_confirm"
              :icon="mdiFormTextboxPassword"
              name="password_confirmation"
              type="password"
              required
              autocomplete="new-password"
            />
          </FormField>

          <template #footer>
            <BaseButtons>
              <BaseButton
                type="submit"
                color="info"
                :label="savingPass ? 'Saving…' : 'Change password'"
                :disabled="savingPass"
              />
            </BaseButtons>
          </template>
        </CardBox>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
