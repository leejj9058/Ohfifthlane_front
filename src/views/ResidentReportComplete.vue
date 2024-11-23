<template>
  <div class="container-fluid d-flex flex-column align-items-center">
    <div class="outer-box">
      <p class="confirmation-message mt-5">신고가 완료되었습니다!</p>

      <div class="notification">
        <span class="emoji">⚠️</span> 이용에 불편을 드려 대단히 죄송합니다.<br>
        '내 주변 주차장'을 클릭하시면, 현재 위치 주변의 다른 주차장 정보를 받아보실 수 있습니다. <br>
        추가적인 도움이 필요하시면, 고객센터(010-6708-7697)로 연락주시기 바랍니다.
      </div>

      <div class="button-container">
        <button class="btn btn-home" @click="goHome"><span class="emoji">🏠</span> 홈으로</button>
        <button class="btn btn-recommend" @click="goToNearbyParking">
          <span class="emoji">🔍</span> 내 주변 주차장
        </button>
      </div>

      <!-- 위도와 경도 표시 -->
      <div v-if="latitude && longitude">
        <p>현재 위치:</p>
        <p>위도: {{ latitude }}</p>
        <p>경도: {{ longitude }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// 위치 정보를 저장할 변수들
const latitude = ref(null);
const longitude = ref(null);

// useRoute를 통해 URL의 쿼리 파라미터를 가져옵니다.
const route = useRoute();
latitude.value = route.query.Lat || '위도 정보 없음';
longitude.value = route.query.Lon || '경도 정보 없음';

// useRouter를 사용하여 라우팅 기능을 사용할 수 있습니다.
const router = useRouter();

// 홈으로 이동
const goHome = () => {
  router.push('/');
};

// 내 주변 주차장 버튼 클릭 시 처리
const goToNearbyParking = () => {
  router.push({
        path: '/recommendNearRPZView', // 리다이렉트할 페이지 경로
        query: {
          lat: latitude.value, // 현재 위도
          lng: longitude.value, // 현재 경도
        },
      });
};

onMounted(() => {
  // 마운트 시 초기화 작업 (예: 위치 정보 갱신 등)
});
</script>

<style scoped>
.container-fluid {
  overflow-x: hidden;
  padding: 0;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.outer-box {
  width: 360px;
  height: 640px;
  border: 2px solid #ccc;
  border-radius: 8px;
  padding: 25px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.confirmation-message {
  font-size: 28px;
  font-weight: bold;
  color: rgb(63, 63, 63);
  margin-top: 20px;
}

.notification {
  font-size: 14px;
  color: rgb(120, 120, 120);
  background-color: #f4f4f4;
  padding: 14px;
  border-radius: 8px;
  margin-top: 0px;
  text-align: left;
}

.button-container {
  display: inline-flex;
  justify-content: center;
  margin-top: 5px;
}

button {
  padding: 8px 10px;
  font-size: 16px;
  margin: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 8px;
  border: none;
  transition: background-color 0.3s ease;
}

.btn-home {
  background-color: #dcdcdc;
  color: #333333;
}

.btn-recommend {
  background-color: #b8d3ff;
  color: rgb(0, 0, 0);
}

button:hover {
  opacity: 0.8;
}

.emoji {
  font-size: 20px;
}
</style>
