<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { mdiAccount, mdiAsterisk } from '@mdi/js'
import SectionFullScreen from '@/components/SectionFullScreen.vue'
import CardBox from '@/components/CardBox.vue'
import FormCheckRadio from '@/components/FormCheckRadio.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'
import { AuthService } from '@/services/auth'
import { useMainStore } from '@/stores/main'
const form = reactive({
  login: '',
  pass: '',
  remember: true
})
const authService = new AuthService()

const router = useRouter()
const mainStore = useMainStore()

const login = async()=> {
      try {
          const result = await authService.login(form.login, form.pass);
          if(result.success){
            //get logged in user details 
            let usr_obj = {
              'name': result.data.user.name,
              'email': result.data.user.email,
              'uid': result.data.user.id,
              'grps': result.data.user.groups
            }
            mainStore.userName = result.data.user.name
            mainStore.userEmail = result.data.user.email;
            mainStore.userId = result.data.user.id;

            sessionStorage.setItem('u_obj', JSON.stringify(usr_obj));

            mainStore.fetchSources()
            mainStore.fetchConnnections()

            router.push('sources')
          
          }
        
      } catch (error) {
        console.log(error)
      }
    }
const submit = () => {

  login()
}
</script>

<template>
  <LayoutGuest>

    <SectionFullScreen v-slot="{ cardClass }" bg="purplePink">
      <h1 class="dark:bg-slate-800 w-full absolute top-0 left-0 text-2xl p-4">LogMan v.2.0</h1>

      <CardBox :class="cardClass" is-form @submit.prevent="submit">
        <FormField label="Login" help="Please enter your login">
          <FormControl
            v-model="form.login"
            :icon="mdiAccount"
            name="login"
            autocomplete="username"
          />
        </FormField>

        <FormField label="Password" help="Please enter your password">
          <FormControl
            v-model="form.pass"
            :icon="mdiAsterisk"
            type="password"
            name="password"
            autocomplete="current-password"
          />
        </FormField>

        <FormCheckRadio
          v-model="form.remember"
          name="remember"
          label="Remember"
          :input-value="true"
        />

        <template #footer>
          <BaseButtons>
            <BaseButton type="submit" color="info" label="Login" />
            <!-- <BaseButton to="/" color="info" outline label="Back" /> -->
          </BaseButtons>
        </template>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>
