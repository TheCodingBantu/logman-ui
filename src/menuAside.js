import {
  mdiMonitor,
  mdiLan,
  mdiMathLog
} from '@mdi/js'

export default [
  {
    to: '/sources',
    icon: mdiMonitor,
    label: 'Home'
  },

  {
    to: '/sources/manage',
    icon: mdiMathLog,
    label: 'Sources'
  },
  {
    to: '/connections/manage',
    icon: mdiLan,
    label: 'Connections'
  },
 
  // {
  //   label: 'Sources',
  //   icon: mdiViewList,
  //   menu: [
  //     {
  //       label: 'Item One'
  //     },
  //     {
  //       label: 'Item Two'
  //     }
  //   ]
  // },

]
