<template>
  <div class="container-fluid d-flex flex-column align-items-center justify-content-center">
    <div class="app-outer d-flex align-items-start justify-content-center">
      <div class="app-container p-3 shadow rounded">
        <button class="btn btn-link text-danger mb-2" @click="goBack">
          <i class="bi bi-arrow-left arrow-icon"></i>
        </button>
        <div class="app-card container">
          <div class="card p-3">
            <div class="bg-light p-3 rounded">
              <p><strong>구획번호:</strong> {{ data.rpzNum }}</p>
              <p><strong>주소:</strong> {{ data.rpzAddress }}</p>
              <p><strong>예약일:</strong> {{ data.reservationDay }}</p>
              <p><strong>예약시간:</strong> {{ data.reservationStartTime }} ~ {{ data.reservationEndTime }}</p>
              <p><strong>결제일시:</strong> {{ data.paymentDate }}</p>
            </div>
            <div class="text-center mt-2">
              <button class="btn btn-outline-danger me-2" @click="navigateToMap">🚗 길 찾기</button>
              <button class="btn btn-outline-warning" @click="refund">💳 환불하기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const data = reactive({
  rpzNum: route.query.rpzNum || '서초45-1234',
  rpzAddress: route.query.rpzAddress || '서울 서초구 12345',
  reservationDay: '2024.10.24', // 예약일
  reservationStartTime: '10:00', // 예약 시작 시간
  reservationEndTime: '12:00', // 예약 종료 시간
  paymentDate: new Date().toLocaleString() // 현재 날짜와 시간 표시
});

const goBack = () => {
  window.history.back(); // 브라우저 히스토리에서 뒤로 이동
};

// 길 찾기 함수
const navigateToMap = () => {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.rpzAddress)}`;
  window.open(mapUrl, '_blank'); // 새 탭에서 구글 맵 열기
};

// 환불 함수
const refund = () => {
  // 환불 처리 로직을 여기에 추가
  alert("환불 요청이 완료되었습니다."); // 예시 알림
};
</script>

<style scoped>
.container-fluid {
  padding-top: 20px;
  overflow-x: hidden;
  width: 460px;
  border-radius: 12px;
}

.app-outer {
  width: 100%;
  display: flex;
  align-items: flex-start; /* 상단으로 정렬 */
  justify-content: center;
}

.app-container {
  width: 100%;
  max-width: 460px; /* 최대 너비를 container-fluid에 맞춤 */
  padding: 1rem; /* 패딩 줄임 */
  margin: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.app-card {
  width: 100%;
}

.bg-light {
  background-color: #fff3cd; /* 연한 노란색 */
}

.text-center {
  text-align: center; /* 중앙 정렬 */
}

.mt-2 {
  margin-top: 0.5rem; /* 버튼 간격 조절 */
}

.arrow-icon {
  font-size: 1.2rem; /* 화살표 아이콘 크기 조정 */
}
</style>
