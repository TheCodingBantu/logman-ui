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
    label: 'Sources',
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
