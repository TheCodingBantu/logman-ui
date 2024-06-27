<script setup>
import {  mdiTableBorder, mdiPlusCircle } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import TableSampleClients from '@/components/SourceList.vue'
import CardBox from '@/components/CardBox.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import BaseButton from '@/components/BaseButton.vue'
import { useRouter } from 'vue-router'
const router=useRouter()


</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiTableBorder" title="Sources" main>
        <BaseButton
        @click="router.push({'name':'add-source'})"
          :icon="mdiPlusCircle"
          label="New Source"
          color="dark"
          rounded-full
          small
        />
      </SectionTitleLineWithButton>
   
      <CardBox class="mb-6" has-table>
        <TableSampleClients checkable />
      </CardBox>

    </SectionMain>
  </LayoutAuthenticated>
</template>
