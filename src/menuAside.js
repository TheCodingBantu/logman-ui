import { mdiMonitor, mdiServerNetwork, mdiAccountGroup, mdiAccountCircle } from '@mdi/js'

// `superAdmin: true` items are only shown to super admins (filtered in the layout).
export default [
  {
    to: '/sources',
    icon: mdiMonitor,
    label: 'Sources'
  },
  {
    to: '/connections',
    icon: mdiServerNetwork,
    label: 'Connections',
    superAdmin: true
  },
  {
    to: '/users',
    icon: mdiAccountGroup,
    label: 'Users',
    superAdmin: true
  },
  {
    to: '/profile',
    icon: mdiAccountCircle,
    label: 'Profile'
  }
]
