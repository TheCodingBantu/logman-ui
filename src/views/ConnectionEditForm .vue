<script setup>
import { onMounted, reactive , ref} from 'vue'
import { mdiBallotOutline } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseDivider from '@/components/BaseDivider.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import {apiClient} from '@/services/api.js'
import { showToast } from '@/services/toast';
import { useMainStore } from '@/stores/main'



const selectOptions = ref([])

const form = reactive({
  ssh_user: '',
  ssh_host: '',
  ssh_port: '',
  ssh_pass: ''
})


function isEmptyString(str) {
    
    return (!str || str.length === 0 || isNumber(str)? false : str.trim()=="");
}

const isNumber = value => typeof value === 'number' && !isNaN(value);

const submit = async ()=>{

  for (const key in form) {
      if(isEmptyString(form[key]))
      {
        showToast('Please fill all fields', 'error');
        return null;
      }      
    }
  
    try {
      const response = await apiClient.post('connections', JSON.stringify(form));

      if(response.status == 200){
      
      showToast(`${response.data.ssh_host} Connection has been created`,'success')
      useMainStore().fetchConnnections()
      }
     
      
    } catch (error) {
      console.log(error)
      showToast(`${error.response.data.error}`,'error')
    }
}

const fetchSources = async () => {
      try {
        const response = await apiClient.get('connections');
        response.data.forEach(conn => {
          selectOptions.value.push(
          {
            id: `${conn.id}`,
            label:`${conn.ssh_user}@${conn.ssh_host}`
          }
        )
        });
     
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error as needed
      }
    };


onMounted(()=>{
  // fetchSources()
})

</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Add Connection" main>
     
      </SectionTitleLineWithButton>
      <CardBox>
       
        <FormField label="Username" help="ssh username">
          <FormControl v-model="form.ssh_user" type="text" placeholder="" />
        </FormField>

        <FormField label="Host" help="ssh host">
          <FormControl v-model="form.ssh_host" type="text" placeholder="" />
        </FormField>

        <FormField label="Port" help="ssh port">
          <FormControl v-model="form.ssh_port" type="number" placeholder="" />
        </FormField>

        <FormField label="Password" help="ssh password">
          <FormControl v-model="form.ssh_pass" type="password" placeholder="" />
        </FormField>

        <BaseDivider />
        <template #footer>
          <BaseButtons>
            <BaseButton color="info" label="Submit" @click="submit"  />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
