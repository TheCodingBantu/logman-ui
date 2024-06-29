
<template>
  <LayoutAuthenticated >
    <div class="options px-12 py-3 border-b dark:bg-slate-800 bg-gray-50 flex-col justify-between ">
      <span class="p-6 pb-3 pl-0   text-2xl">{{item.title}} Logs</span>
      <br>
      <div class="flex justify-start py-2 gap-4">
        <button @click="refresh"  class="rounded-lg bg-blue-500 border-blue-500 text-whitepx-4 px-8 cursor-pointer hover:bg-blue-400 " >Refresh</button>
        <div class="">
        <!-- <label for="">Search Current Logs: </label> -->
        <input type="text" name="" placeholder="Search current logs">

      </div>

      <div class="filter-cont">
      <input class="" type="number" placeholder="Number of lines to tail">
      </div>
      </div>
      </div>
    <SectionMain class="">
      

    <div id="log-container" class="log-container flex flex-col gap-2">
      <output style="display: block;" class="" v-for="(log,index) in logs" :key="index" >{{ log }} </output>
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
import { useRouter } from 'vue-router'
const router = useRouter()

const mainStore = useMainStore()

const item = mainStore.sources[props.id]

const logs = ref([])

const showLoader = computed(()=>{
  return logs.value.length > 0;
})
const props= defineProps({
    id: String
 })

let chatSocket = null;
const roomName = 'demo';

const wsUrl = 'ws://' + import.meta.env.VITE_API_BASE_URL + import.meta.env.VITE_WS_ENDPOINT + roomName + '/';

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
  //disconnnect socket
  chatSocket.close()
  //clear console
  logs.value = []
  wsConnection()
  sendMessage(item.id)
}

const sendMessage = async (source) => {
  try {
    const socket = await connectWebSocket(wsUrl);
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ source: source }));
    } else {
      console.error('WebSocket is not open. Unable to send message.');
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
};


const wsConnection = async () => {
  connectWebSocket(wsUrl).catch(error => {
  console.error('Initial WebSocket connection failed:', error);});

};

onMounted(() => {
  wsConnection()
  sendMessage(item.id)
  
})

onUnmounted(()=>{
  chatSocket.close()
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