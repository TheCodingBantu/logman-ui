<script setup>
import { computed } from 'vue'
import { useDarkModeStore } from '@/stores/darkMode.js'
import {
  gradientBgPurplePink,
  gradientBgDark,
  gradientBgPinkRed,
  gradientBgLight
} from '@/colors.js'

const props = defineProps({
  bg: {
    type: String,
    required: true,
    validator: (value) => ['purplePink', 'pinkRed', 'light'].includes(value)
  }
})

const colorClass = computed(() => {
  // 'light' stays light in both themes so brand artwork reads clearly.
  if (props.bg === 'light') {
    return gradientBgLight
  }

  if (useDarkModeStore().isEnabled) {
    return gradientBgDark
  }

  switch (props.bg) {
    case 'purplePink':
      return gradientBgPurplePink
    case 'pinkRed':
      return gradientBgPinkRed
  }

  return ''
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center" :class="colorClass">
    <slot card-class="w-11/12 md:w-7/12 lg:w-6/12 xl:w-4/12 shadow-2xl" />
  </div>
</template>
