<script setup>
import {  mdiTableBorder, mdiPlusCircle } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import ConnectionList from '@/components/ConnectionList.vue'
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
      <SectionTitleLineWithButton :icon="mdiTableBorder" title="Connections" main>
        <BaseButton
        @click="router.push({'name':'add-connection'})"
          :icon="mdiPlusCircle"
          label="New Connection"
          color="dark"
          rounded-full
          small
        />
      </SectionTitleLineWithButton>
   
      <CardBox class="mb-6" has-table>
        <ConnectionList checkable />
      </CardBox>

    </SectionMain>
  </LayoutAuthenticated>
</template>
