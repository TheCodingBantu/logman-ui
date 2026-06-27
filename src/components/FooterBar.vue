<script setup>
import { containerMaxW } from '@/config.js'
import { mdiGithub } from '@mdi/js'
import BaseLevel from '@/components/BaseLevel.vue'
import BaseIcon from '@/components/BaseIcon.vue'

const year = new Date().getFullYear()

const creators = [
  { handle: 'mashm3ll0w', url: 'https://github.com/mashm3ll0w' },
  { handle: 'phil-ngugi', url: 'https://github.com/phil-ngugi' }
]
</script>

<template>
  <footer class="py-3 px-6" :class="containerMaxW">
    <BaseLevel>
      <div class="text-center md:text-left">
        <b>Log<span class="text-blue-500">Man</span></b>
        <span class="text-gray-500">&nbsp;&copy;{{ year }} — real-time log streaming</span>
      </div>
      <div class="flex items-center gap-3 text-sm text-gray-500 md:py-0 py-2">
        <span>Created by</span>
        <a
          v-for="c in creators"
          :key="c.handle"
          :href="c.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1 text-gray-600 dark:text-slate-300 hover:text-blue-500"
        >
          <BaseIcon :path="mdiGithub" size="18" />
          <span>{{ c.handle }}</span>
        </a>
      </div>
    </BaseLevel>
  </footer>
</template>
