
<template>
  <LayoutAuthenticated >
    <div class="options px-12 py-3 border-b dark:bg-slate-800 bg-gray-50 flex-col justify-between ">
      <span class="p-6 pb-3 pl-0   text-2xl">{{ item ? item.title : ''}} Logs</span>
      <br>
      <div class="flex justify-start py-2 gap-4">
        <button @click="refresh"  class="rounded-lg bg-blue-500 border-blue-500 text-whitepx-4 px-8 cursor-pointer hover:bg-blue-400 " >Refresh</button>
        <div class="">
        <!-- <label for="">Search Current Logs: </label> -->
        <input v-model="searchInput"  @input="filterLogs " type="text" name="" placeholder="Search current logs">

      </div>

      <div class="filter-cont">
      <input @keyup.enter="tail" class="" type="number" placeholder="Number of lines to tail">
      </div>
      </div>
      </div>
    <SectionMain class="">
    
    <div id="log-container" class="log-container flex flex-col gap-2">
      <output style="display: block;" class="" v-for="(log,index) in filteredLogs" :key="index" >{{ log }} </output>
     <br>
     <div v-show="showLoader" class="loader"></div> 
    </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup>
import SectionMain from '@/components/SectionMain.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import {computed, ref, nextTick, onMounted, onUnmounted, } from 'vue';
import { useMainStore } from '@/stores/main'
import { showToast } from '@/services/toast';
import router from '@/router';


const tailLines = ref();

const tail = (event) => {
 
  if(event.target.value > 1000){
    showToast('Tail Limit is 1000 lines', 'error')

  }
  else{
    if(event.target.value != ''){
      tailLines.value = event.target.value;
      refresh()
      tailLines.value = 0
    }
    
  }
};


const mainStore = useMainStore()

const item = ref()

const logs = ref([])

const searchInput = ref('');

const filteredLogs = computed(() => {
      if (!searchInput.value) {
        return logs.value;
      }
      return logs.value.filter(log => log.toLowerCase().includes(searchInput.value.toLowerCase()));
    });

const showLoader = computed(()=>{
  return logs.value.length > 0;
})

const filterLogs = (e)=>{
  searchInput.value=e.target.value
}


 function getRandomLetter() {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const randomIndex = Math.floor(Math.random() * letters.length);
  return letters[randomIndex];
}

function getRandomWord(length) {
  let word = '';
  for (let i = 0; i < length; i++) {
    word += getRandomLetter();
  }
  return word;
}


let chatSocket = null;
const roomName = getRandomWord(5)
const wsUrl = import.meta.env.VITE_WS_ENDPOINT + roomName + '/';

const connectWebSocket = (url) => {

  return new Promise((resolve, reject) => {
    if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
      resolve(chatSocket); // Return existing socket if it's already open
      return;
    }
    const socket = new WebSocket(url);
    socket.onopen = () => resolve(socket);
    socket.onerror = (error) => reject(error);

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);

        logs.value.push(data.message);

      

      nextTick(() => {
        const container = document.getElementById('log-container');
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        });
      });
    };

    socket.onclose = (e) => {
      console.error('Chat socket closed unexpectedly');
    };
    chatSocket = socket;
    
  });
};
const refresh = ()=>{
  chatSocket.close()
  logs.value = []
  sendMessage(item.value.id, tailLines.value)
}

const sendMessage = async (source, lines) => {
  try {
    const socket = await connectWebSocket(wsUrl);
    if (socket.readyState === WebSocket.OPEN) {
      
      socket.send(JSON.stringify({ source: source, lines : lines? lines : 0}));
    } else {
      console.error('WebSocket is not open. Unable to send message.');
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
};


// const wsConnection = async () => {
//   connectWebSocket(wsUrl).catch(error => {
//   console.error('Initial WebSocket connection failed:', error);});

// };
function isNumberAndNotEmpty(value) {
  return value !== '' && !isNaN(value) && typeof value === 'number';
}

onMounted(() => {
  if(isNumberAndNotEmpty(mainStore.activeSource)){
    item.value = mainStore.sources[mainStore.activeSource]
    sendMessage(item.value.id,0)
  }
  else{
    router.go(-1)
  }
})

onUnmounted(()=>{
  chatSocket ? chatSocket.close() : null
})

</script>

<style scoped>

.loader {
    width: .6rem;
    margin-left: 1.4rem;
    aspect-ratio: 1;
    border-radius: 50%;
    animation: l5 1s infinite linear alternate;
  }
  @keyframes l5 {
      0%  {box-shadow: 20px 0 #ffffff, -20px 0 rgba(255, 255, 255, 0.133);background: #ffffff }
      33% {box-shadow: 20px 0 #ffffff, -20px 0 rgba(255, 255, 255, 0.133);background: rgba(255, 255, 255, 0.133)}
      66% {box-shadow: 20px 0 rgba(255, 255, 255, 0.133),-20px 0 #ffffff; background: rgba(255, 255, 255, 0.133)}
      100%{box-shadow: 20px 0 rgba(255, 255, 255, 0.133),-20px 0 #ffffff; background: #ffffff }
  }

  ::selection {
        background: #0080FF;
        text-shadow: none;
      }
      
      pre {
        margin: 0;
      }

    .log-container{

        /* background-image: radial-gradient(rgba(15, 23, 42, 0.75), black 120%); */
        margin: 0;
        overflow: auto;
        padding: 2rem;
        color: white;
        font:.9rem Inconsolata, monospace;
        text-shadow: 0 0 5px #C8C8C8;
        height: 60vh;
        
    }
    .options
    {
      position: sticky;
      top: 55px;

    }

    input{
      @apply rounded-full bg-slate-100 text-black;

    }
</style>