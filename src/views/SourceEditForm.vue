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



const selectOptions = ref([])

const form = reactive({
  title: '',
  connection: selectOptions.value[0],
  filepath: '',
  question: ''
})
function isEmptyString(str) {
    
    return (!str || str.length === 0 || str.trim()=="");
}
const submit = async ()=>{
  if(isEmptyString(form.title) | isEmptyString(form.connection))
  {
    showToast('Please fill all fields', 'error');
  }
  else{
    try {
      const response = await apiClient.post('sources', {

      title: form.title.trim(),
      connection: form.connection.trim(),
      file_path: form.filepath.trim()
      });

      if(response.status == 201){
      showToast(`${response.data.title} Source has been created`,'success')

      }
     
      
    } catch (error) {
      showToast(`${error.response.data.error}`,'error')
    }

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
  fetchSources()
})

</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Add Log Source" main>
     
      </SectionTitleLineWithButton>
      <CardBox>

        <!-- <NotificationBarInCard
          :color="formStatusOptions[formStatusCurrent]"
          :is-placed-with-header=formStatusWithHeader
        >
          <span
            ><b class="capitalize"></b> please hold there is an eror</span
          >
        </NotificationBarInCard> -->
       
        <FormField label="Source" help="This will be displayed on each source">
          <FormControl v-model="form.title" type="tel" placeholder="e.g App X" />
        </FormField>

        <FormField label="Connection" help="Ssh connection details for this source">
          <FormControl v-model="form.connection" :options="selectOptions" />
        </FormField>

        <FormField label="Source" help="Enter absolute log file path">
          <FormControl v-model="form.filepath" type="tel" placeholder="e.g /app/logs/foo.log" />
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
