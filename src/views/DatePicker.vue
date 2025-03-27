<template>
  <Header></Header>
<!-- 
  <div class="d-flex justify-content-center align-items-center p-3" id="background">

 
    <div class="p-4 p-md-5 w-100">

      <h1 class="mb-4 fs-2 fw-bold">신고 내역</h1>
      <div>
        <Datepicker locale="ko" style="width:300px" time-picker-inline v-model="date" />

        flatpickr("#timepicker", {
        enableTime: true,
        noCalendar: true,
        time_24hr: true,
        disable: [
        {
        from: "13:00",
        to: "14:00" // 13:00 ~ 14:00 시간대 비활성화
        }
        ]
        });




      </div>
      <div class="d-flex justify-content-start">

      </div>


    
      <hr>




    </div>
   

  </div> -->


</template>

<script setup>
// import Header from "@/components/Header.vue";

// import { ref, reactive } from 'vue';
// import Datepicker from '@vuepic/vue-datepicker';
// import '@vuepic/vue-datepicker/dist/main.css';


const date = ref(new Date());



</script>



<style scoped></style>
