<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { mdiRefresh, mdiPlay, mdiPause, mdiBroom, mdiArrowLeft, mdiMagnify } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import { apiClient, errorMessage } from '@/services/api'
import { ansiToHtml, stripAnsi } from '@/services/ansi'

const route = useRoute()
const sourceId = route.params.id

const logs = ref([])
const source = ref(null)
const search = ref('')
const lines = ref(200)
const paused = ref(false)
const connected = ref(false)

// Terminal colour themes (the ANSI span colours sit on top of these).
const THEMES = {
  midnight: { label: 'Midnight', bg: '#0b1020', fg: '#e2e8f0' },
  black: { label: 'Black', bg: '#000000', fg: '#d1d5db' },
  matrix: { label: 'Matrix', bg: '#021b02', fg: '#39ff14' },
  solarized: { label: 'Solarized', bg: '#002b36', fg: '#93a1a1' },
  light: { label: 'Light', bg: '#f8fafc', fg: '#1e293b' }
}
const theme = ref(localStorage.getItem('logTheme') || 'midnight')
const themeOptions = Object.entries(THEMES).map(([id, t]) => ({ id, label: t.label }))
const terminalStyle = computed(() => {
  const t = THEMES[theme.value] || THEMES.midnight
  return { background: t.bg, color: t.fg }
})
const onThemeChange = (e) => {
  theme.value = e.target.value
  localStorage.setItem('logTheme', theme.value)
}
const error = ref('')
const MAX_LINES = 5000

let chatSocket = null
const logContainer = ref(null)

const buildWsBase = (endpoint) => {
  // Full http(s) URL: just swap the scheme (https -> wss, http -> ws).
  if (/^https?:\/\//.test(endpoint)) return endpoint.replace(/^http/, 'ws')
  // Bare path: derive scheme + host from the current page so HTTPS -> wss.
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const path = endpoint.startsWith('/') ? endpoint : '/' + endpoint
  return `${proto}//${window.location.host}${path}`
}
const wsBase = buildWsBase(import.meta.env.VITE_WS_ENDPOINT)
const randomRoom = () => Math.random().toString(36).slice(2, 12)

const filteredLogs = computed(() => {
  const q = search.value.trim().toLowerCase()
  const rendered = logs.value.map((l, i) => ({ i, html: ansiToHtml(l), plain: stripAnsi(l) }))
  if (!q) return rendered
  return rendered.filter((r) => r.plain.toLowerCase().includes(q))
})

const scrollToBottom = () => {
  nextTick(() => {
    const el = logContainer.value
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  })
}

const fetchSource = async () => {
  try {
    const { data } = await apiClient.get(`sources/${sourceId}`)
    source.value = data
  } catch (e) {
    // non-fatal: stream can still work, just no title
    source.value = null
  }
}

const openSocket = () => {
  error.value = ''
  const url = wsBase + randomRoom() + '/'
  const socket = new WebSocket(url)

  socket.onopen = () => {
    connected.value = true
    socket.send(JSON.stringify({ source: sourceId, lines: Number(lines.value) || 0 }))
  }
  socket.onmessage = (e) => {
    if (paused.value) return
    try {
      const data = JSON.parse(e.data)
      if (data.message === undefined || data.message === null) return
      logs.value.push(data.message)
      if (logs.value.length > MAX_LINES) logs.value.splice(0, logs.value.length - MAX_LINES)
      scrollToBottom()
    } catch {
      // ignore malformed frame
    }
  }
  socket.onerror = () => {
    error.value = 'Live connection error — check the source connection and try Refresh.'
    connected.value = false
  }
  socket.onclose = () => {
    connected.value = false
  }
  chatSocket = socket
}

const closeSocket = () => {
  if (chatSocket) {
    try {
      chatSocket.close()
    } catch {
      /* noop */
    }
    chatSocket = null
  }
  connected.value = false
}

const refresh = () => {
  closeSocket()
  logs.value = []
  openSocket()
}

const clear = () => {
  logs.value = []
}

const togglePause = () => {
  paused.value = !paused.value
}

onMounted(async () => {
  await fetchSource()
  openSocket()
})

onUnmounted(() => {
  closeSocket()
})
</script>

<template>
  <LayoutAuthenticated>
    <div
      class="options px-6 lg:px-12 py-3 border-b dark:bg-slate-800 bg-gray-50 sticky top-14 z-10"
    >
      <div class="flex items-center justify-between flex-wrap gap-2">
        <div class="flex items-center gap-3">
          <BaseButton :icon="mdiArrowLeft" color="whiteDark" small rounded-full to="/sources" />
          <span class="text-xl font-semibold">{{ source ? source.title : 'Live Logs' }}</span>
          <span
            class="text-xs px-2 py-0.5 rounded-full"
            :class="connected ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'"
          >
            {{ connected ? 'live' : 'disconnected' }}
          </span>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <div class="relative">
            <span class="absolute left-2 top-1.5 text-gray-400">
              <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current"><path :d="mdiMagnify" /></svg>
            </span>
            <input
              v-model="search"
              type="text"
              placeholder="Filter logs"
              class="rounded-full bg-slate-100 text-black pl-8 pr-3 py-1.5 text-sm"
            />
          </div>
          <input
            v-model="lines"
            type="number"
            min="0"
            placeholder="Lines"
            class="rounded-full bg-slate-100 text-black px-3 py-1.5 w-24 text-sm"
          />
          <select
            :value="theme"
            class="rounded-full bg-slate-100 text-black px-3 py-1.5 text-sm"
            title="Terminal theme"
            @change="onThemeChange"
          >
            <option v-for="opt in themeOptions" :key="opt.id" :value="opt.id">{{ opt.label }}</option>
          </select>
          <BaseButtons>
            <BaseButton :icon="mdiRefresh" color="info" small label="Refresh" @click="refresh" />
            <BaseButton
              :icon="paused ? mdiPlay : mdiPause"
              :color="paused ? 'success' : 'warning'"
              small
              :label="paused ? 'Resume' : 'Pause'"
              @click="togglePause"
            />
            <BaseButton :icon="mdiBroom" color="contrast" small label="Clear" @click="clear" />
          </BaseButtons>
        </div>
      </div>
      <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>
    </div>

    <SectionMain>
      <div ref="logContainer" id="log-container" class="log-container" :style="terminalStyle">
        <output
          v-for="row in filteredLogs"
          :key="row.i"
          class="log-line"
          v-html="row.html"
        />
        <div v-if="filteredLogs.length === 0" class="text-slate-500 italic">
          {{ search ? 'No lines match your filter.' : 'Waiting for log output…' }}
        </div>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<style scoped>
.log-container {
  margin: 0;
  overflow: auto;
  padding: 1.5rem;
  background: #0b1020;
  color: #e2e8f0;
  font: 0.85rem/1.5 'Inconsolata', 'JetBrains Mono', 'Fira Code', monospace;
  border-radius: 0.5rem;
  height: 72vh;
  white-space: pre-wrap;
  word-break: break-word;
}
.log-line {
  display: block;
}
::selection {
  background: #2563eb;
  color: #fff;
}
</style>
