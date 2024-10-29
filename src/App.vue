
<template>


  <div class="app-container">

    <main class="main-content">
      <router-view></router-view>
    </main>
    
  </div>

</template>

<script setup>
import { RouterView } from 'vue-router'
import { ref, onMounted } from 'vue';
import router from '@/router/index.js';

</script>

<style scoped>

.app-container {
  display: flex;
}

.main-content {
  flex-grow: 1;
  margin-left: 250px; /* 데스크톱에서 헤더의 너비와 동일하게 설정 */
  padding: 20px;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    margin-top: 50px; /* 모바일 상단 바 높이에 맞춰 조정 */
  }
}



 
/* end::하단내비게이션 */


</style>

<style>
/* 글로벌 스타일 */

</style>
