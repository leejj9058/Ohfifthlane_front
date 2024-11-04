
<template>


  <div class="app-container" style="background-color: #F9F9F9;">

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
  overflow-x: hidden; /* 가로 스크롤 숨기기 */
}

.main-content {
  flex-grow: 1;
  margin-left: 250px; /* 데스크톱에서 헤더의 너비와 동일하게 설정 */
  margin-top: 50px;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0; /* 모바일에서는 왼쪽 여백 제거 */
    width: calc(100% - 20px); /* 모바일에서는 전체 너비 사용하고 여백 고려 */
    padding: 10px; /* 패딩 조정 */
    box-sizing: border-box; /* 패딩을 포함하여 전체 너비 계산 */
  }
}

body {
  font-family: 'Orbit', sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Do Hyeon', sans-serif;
}

.orbit-font {
  font-family: 'Orbit', sans-serif;
}


</style>

<style>
/* 글로벌 스타일 */

</style>
