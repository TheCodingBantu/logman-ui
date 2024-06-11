

<template>
  <LayoutAuthenticated >

    <SectionMain>
    <h1 class="p-6 pb-3 pl-0 border-b mb-6 text-2xl sticky">Log Sources</h1>
    <div class="flex gap-12 w-full">
      <div @click="gotoLogs" class="second hero">
              <img src="../../src/images/image1.jpg" alt="" class="image">
              <div class="text"></div>
              
              <div class="main-text">
                <p>Uasin Gishu Test</p>
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
  import { useRouter } from 'vue-router'
  const router = useRouter()
  
  const gotoLogs=()=>{
    router.push('logs')
  }
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
  box-shadow: 5px 5px 30px rgba(0, 0, 0, 0.7);
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
