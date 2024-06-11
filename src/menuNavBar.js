import {
  mdiAccount,
  mdiLogout,
} from '@mdi/js'

export default [
  {
    isCurrentUser: true,
    menu: [
      {
        icon: mdiAccount,
        label: 'My Profile',
        to: '/profile'
      },
      {
        isDivider: true
      },
      {
        icon: mdiLogout,
        label: 'Log Out',
        isLogout: true
      }
    ]
  },
  {
    icon: mdiLogout,
    label: 'Log out',
    isDesktopNoLabel: true,
    isLogout: true
  }
]
