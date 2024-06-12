<script setup>
import { containerMaxW } from '@/config.js'
</script>

<template>
  <section  :class="containerMaxW" class="p-6  " >
    <slot />
  </section>
</template>
