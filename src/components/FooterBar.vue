<script setup>
import { containerMaxW } from '@/config.js'
import BaseLevel from '@/components/BaseLevel.vue'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="py-2 px-6" :class="containerMaxW">
    <BaseLevel>
      <div class="text-center md:text-left">
        <b>&copy;{{ year }}, Jp Devops Team</b>
      </div>
      <div class="md:py-2">
        
      </div>
    </BaseLevel>
  </footer>
</template>
