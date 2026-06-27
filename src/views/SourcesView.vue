<script setup>
import { onMounted, reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  mdiMonitor,
  mdiPlus,
  mdiPencil,
  mdiDelete,
  mdiTextBoxOutline,
  mdiEye,
  mdiEyeOff,
  mdiBroadcast,
  mdiServerNetwork,
  mdiAccountGroup
} from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import StatCard from '@/components/StatCard.vue'
import CardBox from '@/components/CardBox.vue'
import CardBoxModal from '@/components/CardBoxModal.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseIcon from '@/components/BaseIcon.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import NotificationBar from '@/components/NotificationBar.vue'
import { apiClient, errorMessage } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const sources = ref([])
const connections = ref([])
const loading = ref(false)
const error = ref('')
const notice = ref('')

const modalOpen = ref(false)
const editing = ref(null)
const saving = ref(false)
const deleteTarget = ref(null)

const form = reactive({ title: '', file_path: '', connection: null, is_active: true })
const usersCount = ref(null)

const connectionOptions = () =>
  connections.value.map((c) => ({ id: c.id, label: `${c.ssh_user}@${c.ssh_host}` }))

const stats = computed(() => ({
  total: sources.value.length,
  active: sources.value.filter((s) => s.is_active).length,
  connections: connections.value.length,
  users: usersCount.value
}))

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    const [s, c] = await Promise.all([apiClient.get('sources'), apiClient.get('connections')])
    sources.value = s.data
    connections.value = c.data
  } catch (e) {
    error.value = errorMessage(e, 'Failed to load sources')
  } finally {
    loading.value = false
  }
  // Users count is best-effort (any authenticated user can read the list).
  try {
    const u = await apiClient.get('accounts/users/')
    usersCount.value = u.data.length
  } catch {
    usersCount.value = null
  }
}

const openCreate = () => {
  editing.value = null
  form.title = ''
  form.file_path = ''
  form.connection = connectionOptions()[0] || null
  form.is_active = true
  modalOpen.value = true
}

const openEdit = (src) => {
  editing.value = src
  form.title = src.title
  form.file_path = src.file_path
  form.connection =
    connectionOptions().find((o) => o.id === src.connection?.id) || connectionOptions()[0] || null
  form.is_active = src.is_active
  modalOpen.value = true
}

const save = async () => {
  if (saving.value) return
  error.value = ''
  if (!form.title || !form.file_path || !form.connection) {
    error.value = 'Title, file path and connection are required.'
    modalOpen.value = true
    return
  }
  saving.value = true
  const payload = {
    title: form.title,
    file_path: form.file_path,
    connection: form.connection.id,
    is_active: form.is_active
  }
  try {
    if (editing.value) {
      await apiClient.put(`sources/${editing.value.id}`, payload)
      notice.value = 'Source updated.'
    } else {
      await apiClient.post('sources', payload)
      notice.value = 'Source created.'
    }
    await load()
  } catch (e) {
    error.value = errorMessage(e, 'Failed to save source')
    modalOpen.value = true
  } finally {
    saving.value = false
  }
}

const toggleActive = async (src) => {
  error.value = ''
  try {
    await apiClient.patch(`sources/${src.id}`, { is_active: !src.is_active })
    await load()
  } catch (e) {
    error.value = errorMessage(e, 'Failed to update source')
  }
}

const confirmDelete = async () => {
  if (!deleteTarget.value) return
  try {
    await apiClient.delete(`sources/${deleteTarget.value.id}`)
    notice.value = 'Source deleted.'
    await load()
  } catch (e) {
    error.value = errorMessage(e, 'Failed to delete source')
  } finally {
    deleteTarget.value = null
  }
}

const openLogs = (src) => router.push(`/sources/${src.id}/logs`)

onMounted(load)
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiMonitor" title="Log Sources" main>
        <BaseButton
          v-if="auth.isSuperAdmin"
          :icon="mdiPlus"
          label="Add Source"
          color="info"
          @click="openCreate"
        />
      </SectionTitleLineWithButton>

      <NotificationBar v-if="error" color="danger" class="mb-4">{{ error }}</NotificationBar>
      <NotificationBar v-if="notice" color="success" class="mb-4">{{ notice }}</NotificationBar>

      <div v-if="auth.isSuperAdmin" class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total sources" :value="stats.total" :icon="mdiMonitor" color="blue" />
        <StatCard label="Active sources" :value="stats.active" :icon="mdiBroadcast" color="emerald" />
        <StatCard label="Connections" :value="stats.connections" :icon="mdiServerNetwork" color="indigo" />
        <StatCard label="Users" :value="stats.users ?? '—'" :icon="mdiAccountGroup" color="amber" />
      </div>

      <div
        v-if="!loading && sources.length"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <CardBox v-for="src in sources" :key="src.id" is-hoverable>
          <div class="flex items-start justify-between gap-3">
            <button
              type="button"
              class="flex items-center gap-3 min-w-0 text-left"
              :disabled="!src.is_active"
              :title="src.is_active ? 'View logs' : 'Source disabled'"
              @click="src.is_active && openLogs(src)"
            >
              <span
                class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 text-blue-600 shrink-0"
              >
                <BaseIcon :path="mdiMonitor" size="22" />
              </span>
              <span class="font-semibold truncate">{{ src.title }}</span>
            </button>

            <span
              v-if="auth.isSuperAdmin"
              class="text-xs px-2 py-0.5 rounded-full shrink-0"
              :class="src.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'"
            >
              {{ src.is_active ? 'enabled' : 'disabled' }}
            </span>
          </div>

          <!-- Full details + controls are super-admin only. -->
          <template v-if="auth.isSuperAdmin">
            <dl class="mt-4 space-y-1 text-sm">
              <div class="flex gap-2">
                <dt class="text-gray-500 w-24 shrink-0">File path</dt>
                <dd class="font-mono truncate">{{ src.file_path }}</dd>
              </div>
              <div class="flex gap-2">
                <dt class="text-gray-500 w-24 shrink-0">Connection</dt>
                <dd class="truncate">
                  {{ src.connection ? src.connection.ssh_user + '@' + src.connection.ssh_host : '—' }}
                </dd>
              </div>
            </dl>

            <BaseButtons class="mt-4" no-wrap>
              <BaseButton
                :icon="mdiTextBoxOutline"
                color="success"
                small
                :disabled="!src.is_active"
                title="View logs"
                @click="openLogs(src)"
              />
              <BaseButton :icon="mdiPencil" color="info" small title="Edit" @click="openEdit(src)" />
              <BaseButton
                :icon="src.is_active ? mdiEyeOff : mdiEye"
                color="warning"
                small
                :title="src.is_active ? 'Disable' : 'Enable'"
                @click="toggleActive(src)"
              />
              <BaseButton
                :icon="mdiDelete"
                color="danger"
                small
                title="Delete"
                @click="deleteTarget = src"
              />
            </BaseButtons>
          </template>
        </CardBox>
      </div>

      <CardBox v-else-if="!loading">
        <p class="text-center text-slate-500 py-6">
          {{ auth.isSuperAdmin ? 'No sources yet. Click “Add Source” to create one.' : 'No sources available.' }}
        </p>
      </CardBox>
    </SectionMain>

    <CardBoxModal
      v-model="modalOpen"
      :title="editing ? 'Edit Source' : 'Add Source'"
      button-label="Save"
      has-cancel
      @confirm="save"
    >
      <FormField label="Title" help="Shown on the source card">
        <FormControl v-model="form.title" placeholder="e.g. Payments API" />
      </FormField>
      <FormField label="File path" help="Absolute path of the log file on the server">
        <FormControl v-model="form.file_path" placeholder="/var/log/app/app.log" />
      </FormField>
      <FormField label="Connection" help="SSH connection used to tail this source">
        <FormControl v-model="form.connection" :options="connectionOptions()" />
      </FormField>
      <p v-if="editing" class="text-sm text-slate-500">
        Use the enable/disable button on the list to change availability.
      </p>
    </CardBoxModal>

    <CardBoxModal
      :model-value="!!deleteTarget"
      title="Delete source"
      button="danger"
      button-label="Delete"
      has-cancel
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
      @update:model-value="(v) => { if (!v) deleteTarget = null }"
    >
      <p>
        Delete source <b>{{ deleteTarget?.title }}</b>? This cannot be undone.
      </p>
    </CardBoxModal>
  </LayoutAuthenticated>
</template>
