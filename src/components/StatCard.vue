<script setup>
import BaseIcon from '@/components/BaseIcon.vue'

defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], default: 0 },
  icon: { type: String, default: null },
  color: { type: String, default: 'blue' }
})

const accents = {
  blue: 'bg-blue-100 text-blue-600',
  emerald: 'bg-emerald-100 text-emerald-600',
  indigo: 'bg-indigo-100 text-indigo-600',
  amber: 'bg-amber-100 text-amber-600'
}
</script>

<template>
  <div
    class="flex items-center gap-4 rounded-xl border border-gray-100 bg-white dark:bg-slate-900 dark:border-slate-700 px-5 py-4 shadow-sm"
  >
    <span
      class="inline-flex items-center justify-center w-11 h-11 rounded-xl"
      :class="accents[color] || accents.blue"
    >
      <BaseIcon v-if="icon" :path="icon" size="22" />
    </span>
    <div>
      <div class="text-2xl font-bold leading-none">{{ value }}</div>
      <div class="text-sm text-gray-500 mt-1">{{ label }}</div>
    </div>
  </div>
</template>
