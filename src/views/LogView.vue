<script setup>
import SectionMain from '@/components/SectionMain.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'

</script>

<template>
  <LayoutAuthenticated >
    <div class="options px-12 py-3 border-b dark:bg-slate-800 bg-gray-50 flex-col justify-between ">
      <span class="p-6 pb-3 pl-0   text-2xl">Uasin Gishu Test Logs</span>
      <br>
      <div class="flex justify-start py-2 gap-4">
        <button class="rounded-lg bg-blue-500 border-blue-500 text-whitepx-4 px-8 cursor-pointer hover:bg-blue-400 " >Refresh</button>
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
      

    <div class="log-container">
     
      <br><output>2024-06-11 10:06:37 [3912077] [INFO] message=254795282610 have a wallet account. No enough balances, Intiating stk push...</output>
      <br><output>2024-06-11 10:06:44 [3912063] [INFO] message=254795282610 have a wallet account. Enough balances, Intiating Wallet Payment...</output>
      <br><output>2024-06-11 10:07:04 [3912069] [INFO] message=Notification payment payload {'status': 'FAILED', 'bill_number': 'jwwtest', 'reference': '044618615219517', 'description': 'Request cancelled by user', 'mode_of_payment': 'Mpesa'}</output>
      <br><output>2024-06-11 10:07:09 [3912069] [INFO] message=Payment notification to https://webhook.site/87ea3545-72e7-4f83-821d-44aa8d15874f successiful!</output>
      <br><output>2024-06-11 10:07:52 [3912055] [INFO] message=Notification payment payload {'status': 'SUCCESS', 'bill_number': '254456371439', 'reference': '047226413543275', 'description': 'Ok', 'mode_of_payment': 'Wallet'}</output>
      <br><output>2024-06-11 10:07:53 [3912055] [ERROR] message=Notifcation to http://usn.malipo.org/index.php/payment/processpayments failed.</output>
      <br><output>2024-06-11 10:07:53 [3912055] [ERROR] message= The error is {"data":{"msg":"Something went Wrong.","payload":null}}</output>
      <br><output>2024-06-11 12:08:21 [3912069] [INFO] message=Updated User data Via post_save_with_modifications signal from {'last_login': datetime.datetime(2024, 6, 10, 12, 37, 16, 295405, tzinfo=&lt;UTC&gt;), 'photo': &lt;cloudinary.CloudinaryResource object at 0x7f31ffb18f40&gt;, 'full_name': ''} to {'last_login': datetime.datetime(2024, 6, 11, 9, 8, 21, 941279, tzinfo=&lt;UTC&gt;), 'photo': &lt;cloudinary.CloudinaryResource object at 0x7f31ffbf8ac0&gt;, 'full_name': ''}</output>
      <output>2024-06-11 09:39:13 [3499534] [INFO] message=254795282610 have a wallet account. Enough balances, Intiating Wallet Payment...</output>
      <br><output>2024-06-11 09:39:46 [3499541] [ERROR] message=Notifcation to http://usn.malipo.org/index.php/payment/processpayments failed.</output>
      <br><output>2024-06-11 09:39:46 [3499541] [ERROR] message= The error is {"data":{"msg":"Something went Wrong.","payload":null}}</output>
      <br><output>2024-06-11 10:06:37 [3912077] [INFO] message=254795282610 have a wallet account. No enough balances, Intiating stk push...</output>
      <br><output>2024-06-11 10:06:44 [3912063] [INFO] message=254795282610 have a wallet account. Enough balances, Intiating Wallet Payment...</output>
      <br><output>2024-06-11 10:07:04 [3912069] [INFO] message=Notification payment payload {'status': 'FAILED', 'bill_number': 'jwwtest', 'reference': '044618615219517', 'description': 'Request cancelled by user', 'mode_of_payment': 'Mpesa'}</output>
      <br><output>2024-06-11 10:07:09 [3912069] [INFO] message=Payment notification to https://webhook.site/87ea3545-72e7-4f83-821d-44aa8d15874f successiful!</output>
      <br><output>2024-06-11 10:07:52 [3912055] [INFO] message=Notification payment payload {'status': 'SUCCESS', 'bill_number': '254456371439', 'reference': '047226413543275', 'description': 'Ok', 'mode_of_payment': 'Wallet'}</output>
      <br><output>2024-06-11 10:07:53 [3912055] [ERROR] message=Notifcation to http://usn.malipo.org/index.php/payment/processpayments failed.</output>
      <br><output>2024-06-11 10:07:53 [3912055] [ERROR] message= The error is {"data":{"msg":"Something went Wrong.","payload":null}}</output>
      <br><output>2024-06-11 12:08:21 [3912069] [INFO] message=Updated User data Via post_save_with_modifications signal from {'last_login': datetime.datetime(2024, 6, 10, 12, 37, 16, 295405, tzinfo=&lt;UTC&gt;), 'photo': &lt;cloudinary.CloudinaryResource object at 0x7f31ffb18f40&gt;, 'full_name': ''} to {'last_login': datetime.datetime(2024, 6, 11, 9, 8, 21, 941279, tzinfo=&lt;UTC&gt;), 'photo': &lt;cloudinary.CloudinaryResource object at 0x7f31ffbf8ac0&gt;, 'full_name': ''}</output>

      <br>
      <br>

      <div class="loader"></div> 
    </div>


    </SectionMain>
  </LayoutAuthenticated>
</template>

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
        overflow: hidden;
        padding: 2rem;
        color: white;
        font:.9rem Inconsolata, monospace;
        text-shadow: 0 0 5px #C8C8C8;
        
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