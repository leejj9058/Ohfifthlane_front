<template>
  <div class="app-container">
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
  isMainWebView.value = route.name === 'main'; // 경로 이름이 'main'인지 확인
}
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

.main-content-new {
  margin-left: 0;
  padding: 0;
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
