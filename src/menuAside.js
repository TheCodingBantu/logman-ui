import {
  mdiMonitor,
  mdiLan,
  mdiMathLog
} from '@mdi/js'

//get user groups
const grps = JSON.parse(sessionStorage.getItem('u_obj')) ? JSON.parse(sessionStorage.getItem('u_obj')).grps : ""
const is_manager = grps.includes('Managers') ? true  :false


const options = [
  {
    to: '/sources',
    icon: mdiMonitor,
    label: 'Home'
  },
]

const manager_options = [
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
]

if (is_manager){
  manager_options.forEach(option => {
    options.push(option)
  });
}

export default options;
