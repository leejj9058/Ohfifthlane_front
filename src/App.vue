<template>
  <div class="app-container" style="background-color: #F9F9F9;">
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
}

.main-content {
  flex-grow: 1;
  margin-left: 250px; 
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
