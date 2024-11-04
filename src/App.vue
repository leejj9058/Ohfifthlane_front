<template>
  <div class="app-container">
  <!-- isMainWebView가 true이면 'main-content-new' 클래스가 적용됨. -->
    <main class="main-content" :class='isMainWebView ? "main-content-new" : ""'>
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted, watch } from 'vue';

const route = useRoute();
const isMainWebView = ref(false);

watch(route, () => {
  checkIfMainWebView();
});

function checkIfMainWebView() {
  // `MainWebView`의 경로나 이름을 확인하여 페이지 식별
  isMainWebView.value = route.name === 'main' || route.name === 'map'; // 경로 이름이 'main'인지 확인
}
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

.main-content-new {
  margin-left: 0;
  padding: 0;
}


@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    margin-top: 50px; /* 모바일 상단 바 높이에 맞춰 조정 */
  }
}
</style>

<style>
/* 글로벌 스타일 */
</style>
