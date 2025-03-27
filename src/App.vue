<template>
  <div class="app-container ">
    <!-- v-if를 사용하여 조건에 따라 다른 요소를 렌더링 -->
    <main v-if="isMainWebView" class="main-content main-content-new">
      <router-view></router-view>
    </main>
    <main v-else class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, watch } from 'vue';

const route = useRoute();
const isMainWebView = ref(false);

watch(route, () => {
  checkIfMainWebView();
});

function checkIfMainWebView() {
  // `MainWebView`의 경로나 이름을 확인하여 페이지 식별
  isMainWebView.value = route.name === 'main' || route.name === 'search' || route.name === 'map' || route.name === 'reservationList' || route.name === 'reservationDetail' || route.name === 'reservation' || route.name === 'parkingPay' || route.name === 'paymentComplete'; // 경로 이름이 'main'인지 확인
}
</script>

<style>
/* 전체 폰트 적용 */
@font-face {
  font-family: 'Pretendard-Regular';
  src: url('https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
  font-weight: 400;
  font-style: normal;
}

body {
  font-family: 'Pretendard-Regular', sans-serif;
}
</style>

<style scoped>

.app-container {
  display: flex;
}

.main-content {
  flex-grow: 1;
  margin-left: 250px; 
}

.main-content-new {
  margin-left: 0;
  padding: 0;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    margin-top: 0; /* 기본적으로 상단 여백 제거 */
  }

  .main-content.with-margin {
    margin-top: 50px; /* 헤더가 있는 경우에만 여백 추가 */
  }

  .main-content-new {
    margin-left: 0;
    padding: 0;
  }
}
</style>

<style>
/* 글로벌 스타일 */
</style>
