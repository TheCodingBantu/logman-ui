import {
  mdiMonitor,
  mdiViewList,
} from '@mdi/js'

export default [
  {
    to: '/sources',
    icon: mdiMonitor,
    label: 'Home'
  },

  {
    to: '/sources/manage',
    icon: mdiMonitor,
    label: 'Manage Sources'
  },
 
  {
    label: 'Source',
    icon: mdiViewList,
    menu: [
      {
        label: 'Item One'
      },
      {
        label: 'Item Two'
      }
    ]
  },

]
