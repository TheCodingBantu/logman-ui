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
import NotificationBarInCard from '@/components/NotificationBarInCard.vue'



const selectOptions = ref([])

const form = reactive({
  title: '',
  connections: selectOptions.value[0],
  subject: '',
  question: ''
})
const submit = ()=>{

}

const fetchSources = async () => {
      try {
        const response = await apiClient.get('connections');
        response.data.forEach(conn => {
          selectOptions.value.push(
          {
            id: conn.id,
            label:conn.host
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

const formStatusOptions = ['info', 'success', 'danger', 'warning']
const formStatusWithHeader = ref(true)
const formStatusCurrent = ref(2)
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Add Log Source" main>
       
      </SectionTitleLineWithButton>
      <CardBox form @submit.prevent="submit">

        <NotificationBarInCard
          :color="formStatusOptions[formStatusCurrent]"
          :is-placed-with-header=formStatusWithHeader
        >
          <span
            ><b class="capitalize"></b> please hold there is an eror</span
          >
        </NotificationBarInCard>
       
        <FormField label="Source" help="This will be displayed on each source">
          <FormControl v-model="form.title" type="tel" placeholder="e.g App X" />
        </FormField>

        <FormField label="Connection" help="Ssh connection details for this source">
          <FormControl v-model="form.connections" :options="selectOptions" />
        </FormField>
        <BaseDivider />

        <template #footer>
          <BaseButtons>
            <BaseButton type="submit"  color="info" label="Submit" />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
