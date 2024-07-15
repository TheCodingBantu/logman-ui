

<template>
  <LayoutAuthenticated >

    <SectionMain>
      
    <h1 class="p-6 pb-3 pl-0 border-b mb-6 text-2xl sticky">Log Sources</h1>

    <NavBarItemPlain use-margin>
          <!-- <FormControl class="pt-2 pb-8" @input="filterSources" placeholder="Search (ctrl+k)" ctrl-k-focus transparent  /> -->
        </NavBarItemPlain>

    <div class="flex flex-wrap gap-12 w-full">
      <div v-for="(item, index) in items" :key="index" @click="gotoLogs(index)" class="second hero">
              <img src="../../src/images/image1.jpg" alt="" class="image">
              <div class="text"></div>
              
              <div class="main-text">
                <p>{{item.title}}</p>
              </div>
              <div class="date rounded-full">
              </div>
        </div>
    </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
<script setup>
  import SectionMain from '@/components/SectionMain.vue'
  import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import FormControl from '@/components/FormControl.vue'
import NavBarItemPlain from '@/components/NavBarItemPlain.vue'

  import { useRouter } from 'vue-router'
  import { computed, onMounted, ref } from 'vue'
  import { useMainStore } from '@/stores/main'
  const router = useRouter()
  
  const gotoLogs=(id)=>{
    mainStore.activeSource = id
    router.push({ name: 'logs'});
    
  }

  const mainStore = useMainStore()
  const filterValue = ref('');

  const items = computed(() => {

    if (filterValue.value) {
        return mainStore.sources.filter(item =>
          item.title.toLowerCase().includes(filterValue.value.toLowerCase())
        );
      }

      return mainStore.sources

  })

  const filterSources = (event) => {
      filterValue.value = event.target.value;
    };


</script>

<style scoped>
.hero {
  display: inline-block;
  position: relative;
  width: 250px;
  min-width: 250px;
  height: 250px;
  border-radius: 30px;
  overflow:hidden;
  box-shadow: 5px 5px 30px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  
}

.text {
  background-image: linear-gradient(0deg , #3f5efb, #fc466b);
  border-radius: 30px;
  position: absolute;
  top: 55%;
  left: -5px;
  height: 65%;
  width: 108%;
  transform: skew(19deg, -9deg);
}

.second .text {
  background-image: linear-gradient(-20deg , #273381, #2e2e2e);
}

.main-text {
  position: absolute;
  color: #fff;
  font-weight: 900;
  left: 150px;
  bottom: 26%;
}

.date {
  position: absolute;
  background-color: #0ebd08;
  left: 30px;
  bottom: 10%;
  width: 15px;
  height: 15px;
 
}

</style>
