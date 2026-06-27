<script setup>
import { onMounted, reactive, ref } from 'vue'
import { mdiAccountGroup, mdiPlus, mdiPencil, mdiDelete, mdiAccountCheck, mdiAccountOff } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import CardBox from '@/components/CardBox.vue'
import CardBoxModal from '@/components/CardBoxModal.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import FormCheckRadio from '@/components/FormCheckRadio.vue'
import NotificationBar from '@/components/NotificationBar.vue'
import { apiClient, errorMessage } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const users = ref([])
const organizations = ref([])
const loading = ref(false)
const error = ref('')
const notice = ref('')

const modalOpen = ref(false)
const editing = ref(null)
const saving = ref(false)
const deleteTarget = ref(null)

const form = reactive({
  email: '',
  name: '',
  password: '',
  organization: null,
  is_superuser: false
})

const orgOptions = () => [
  { id: null, label: '— None —' },
  ...organizations.value.map((o) => ({ id: o.id, label: o.title }))
]

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    const [u, o] = await Promise.all([
      apiClient.get('accounts/users/'),
      apiClient.get('organizations/').catch(() => ({ data: [] }))
    ])
    users.value = u.data
    organizations.value = o.data
  } catch (e) {
    error.value = errorMessage(e, 'Failed to load users')
  } finally {
    loading.value = false
  }
}

const openCreate = () => {
  editing.value = null
  form.email = ''
  form.name = ''
  form.password = ''
  form.organization = orgOptions()[0]
  form.is_superuser = false
  modalOpen.value = true
}

const openEdit = (u) => {
  editing.value = u
  form.email = u.email
  form.name = u.name
  form.password = ''
  form.organization = orgOptions().find((o) => o.id === u.organization) || orgOptions()[0]
  form.is_superuser = u.is_superuser
  modalOpen.value = true
}

const save = async () => {
  if (saving.value) return
  error.value = ''
  if (!form.email || !form.name) {
    error.value = 'Name and email are required.'
    modalOpen.value = true
    return
  }
  if (!editing.value && !form.password) {
    error.value = 'A password is required for a new user.'
    modalOpen.value = true
    return
  }
  saving.value = true
  const payload = {
    email: form.email,
    name: form.name,
    organization: form.organization?.id ?? null,
    is_superuser: form.is_superuser
  }
  if (form.password) payload.password = form.password
  try {
    if (editing.value) {
      await apiClient.patch(`accounts/users/${editing.value.id}/`, payload)
      notice.value = 'User updated.'
    } else {
      await apiClient.post('accounts/users/', payload)
      notice.value = 'User created.'
    }
    await load()
  } catch (e) {
    error.value = errorMessage(e, 'Failed to save user')
    modalOpen.value = true
  } finally {
    saving.value = false
  }
}

const toggleActive = async (u) => {
  error.value = ''
  try {
    await apiClient.patch(`accounts/users/${u.id}/`, { is_active: !u.is_active })
    await load()
  } catch (e) {
    error.value = errorMessage(e, 'Failed to update user')
  }
}

const confirmDelete = async () => {
  if (!deleteTarget.value) return
  try {
    await apiClient.delete(`accounts/users/${deleteTarget.value.id}/`)
    notice.value = 'User deleted.'
    await load()
  } catch (e) {
    error.value = errorMessage(e, 'Failed to delete user')
  } finally {
    deleteTarget.value = null
  }
}

onMounted(load)
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiAccountGroup" title="Users" main>
        <BaseButton
          v-if="auth.isSuperAdmin"
          :icon="mdiPlus"
          label="Add User"
          color="info"
          @click="openCreate"
        />
      </SectionTitleLineWithButton>

      <NotificationBar v-if="!auth.isSuperAdmin" color="info" class="mb-4">
        You have view-only access. Only an admin can add, edit or remove users.
      </NotificationBar>

      <NotificationBar v-if="error" color="danger" class="mb-4">{{ error }}</NotificationBar>
      <NotificationBar v-if="notice" color="success" class="mb-4">{{ notice }}</NotificationBar>

      <CardBox has-table>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in users" :key="u.id">
              <td data-label="Name">{{ u.name || '—' }}</td>
              <td data-label="Email">{{ u.email }}</td>
              <td data-label="Role">
                <span
                  class="text-xs px-2 py-0.5 rounded-full"
                  :class="u.is_superuser ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'"
                >
                  {{ u.is_superuser ? 'super admin' : 'standard' }}
                </span>
              </td>
              <td data-label="Status">
                <span
                  class="text-xs px-2 py-0.5 rounded-full"
                  :class="u.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'"
                >
                  {{ u.is_active ? 'active' : 'disabled' }}
                </span>
              </td>
              <td class="text-right whitespace-nowrap">
                <BaseButtons v-if="auth.isSuperAdmin" type="justify-end" no-wrap>
                  <BaseButton :icon="mdiPencil" color="info" small title="Edit" @click="openEdit(u)" />
                  <BaseButton
                    :icon="u.is_active ? mdiAccountOff : mdiAccountCheck"
                    color="warning"
                    small
                    :disabled="u.id === auth.user?.id"
                    :title="u.is_active ? 'Disable' : 'Enable'"
                    @click="toggleActive(u)"
                  />
                  <BaseButton
                    :icon="mdiDelete"
                    color="danger"
                    small
                    :disabled="u.id === auth.user?.id"
                    title="Delete"
                    @click="deleteTarget = u"
                  />
                </BaseButtons>
                <span v-else class="text-slate-400">—</span>
              </td>
            </tr>
            <tr v-if="!loading && users.length === 0">
              <td colspan="5" class="text-center text-slate-500 py-6">No users found.</td>
            </tr>
          </tbody>
        </table>
      </CardBox>
    </SectionMain>

    <CardBoxModal
      v-model="modalOpen"
      :title="editing ? 'Edit User' : 'Add User'"
      button-label="Save"
      has-cancel
      @confirm="save"
    >
      <FormField label="Name">
        <FormControl v-model="form.name" placeholder="Jane Doe" />
      </FormField>
      <FormField label="Email">
        <FormControl v-model="form.email" type="email" placeholder="jane@example.com" />
      </FormField>
      <FormField label="Organization">
        <FormControl v-model="form.organization" :options="orgOptions()" />
      </FormField>
      <FormField
        label="Password"
        :help="editing ? 'Leave blank to keep the current password' : 'Required'"
      >
        <FormControl v-model="form.password" type="password" placeholder="••••••••" />
      </FormField>
      <FormCheckRadio
        v-model="form.is_superuser"
        name="is_superuser"
        label="Super admin (can manage users)"
        :input-value="true"
      />
    </CardBoxModal>

    <CardBoxModal
      :model-value="!!deleteTarget"
      title="Delete user"
      button="danger"
      button-label="Delete"
      has-cancel
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
      @update:model-value="(v) => { if (!v) deleteTarget = null }"
    >
      <p>Delete user <b>{{ deleteTarget?.email }}</b>? This cannot be undone.</p>
    </CardBoxModal>
  </LayoutAuthenticated>
</template>
