<script setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { mdiAccount, mdiAsterisk } from '@mdi/js'
import SectionFullScreen from '@/components/SectionFullScreen.vue'
import CardBox from '@/components/CardBox.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'
import NotificationBar from '@/components/NotificationBar.vue'
import { useAuthStore } from '@/stores/auth'
import { useMainStore } from '@/stores/main'
import { errorMessage } from '@/services/api'

const form = reactive({
  email: '',
  pass: ''
})

const contributors = [
  { name: 'Charles Swaleh', url: 'https://github.com/mashm3ll0w' },
  { name: 'Philemon Ngugi', url: 'https://github.com/phil-ngugi' }
]

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const mainStore = useMainStore()

const error = ref('')
const loading = ref(false)

const submit = async () => {
  error.value = ''
  loading.value = true
  try {
    const data = await auth.login(form.email, form.pass)
    if (data.user) mainStore.setUser(data.user)
    const redirect = route.query.redirect || '/sources'
    router.push(redirect)
  } catch (e) {
    error.value = errorMessage(e, 'Invalid email or password')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <LayoutGuest>
    <SectionFullScreen v-slot="{ cardClass }" bg="purplePink">
      <CardBox :class="[cardClass, '!bg-lightDark-200 !text-grey-800']" is-form @submit.prevent="submit">
        <div class="flex flex-col items-center text-center mb-6">
          <img src="/imgs/logman_logo.png" alt="LogMan" class="w-80 max-w-full mb-3 object-contain" />
          <p class="text-white-500 text-sm">Stream your logs in real time</p>
        </div>

        <NotificationBar v-if="error" color="danger" class="mb-4">
          {{ error }}
        </NotificationBar>

        <FormField label="Email" help="Please enter your email">
          <FormControl
            v-model="form.email"
            :icon="mdiAccount"
            name="email"
            type="email"
            autocomplete="username"
            required
          />
        </FormField>

        <FormField label="Password" help="Please enter your password">
          <FormControl
            v-model="form.pass"
            :icon="mdiAsterisk"
            type="password"
            name="password"
            autocomplete="current-password"
            required
          />
        </FormField>

        <template #footer>
          <BaseButtons>
            <BaseButton
              type="submit"
              color="info"
              :label="loading ? 'Signing in…' : 'Login'"
              :disabled="loading"
            />
          </BaseButtons>
          <p class="text-center text-xs text-gray-400 mt-6">
            Built by
            <template v-for="(person, i) in contributors" :key="person.url"
              ><a
                :href="person.url"
                target="_blank"
                rel="noopener noreferrer"
                class="text-gray-300 hover:text-info hover:underline"
                >{{ person.name }}</a
              ><span v-if="i < contributors.length - 1"> · </span></template
            >
          </p>
        </template>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>
