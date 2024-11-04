<template>
  <div class="container-fluid d-flex flex-column align-items-center justify-content-center">
    <div class="card app-card p-4 shadow rounded">
      <h4 class="text-center fw-bold p-3">📢 결제가 완료되었습니다!</h4>

      <div class="text-center mt-3">
        <img src="@/assets/images/team3logo.png" alt="팀3 로고" class="logo" />
      </div>

      <div class="p-1">
        <div class="p-2">
          <hr class="thick-line" />
          <p class="info"><strong>구획번호:</strong> {{ data.rpzNum }}</p>
          <p class="info"><strong>주소:</strong> {{ data.rpzAddress }}</p>
          <p class="info"><strong>예약일:</strong> {{ data.reservationDay }}</p>
          <p class="info"><strong>예약시간:</strong> {{ data.reservationStartTime }} ~ {{ data.reservationEndTime }}</p>
          <div class="text-center">
            <img :src="data.image" alt="주차 이미지" class="reservation-image" />
          </div>
          <hr class="thick-line" />
          <p>결제일시: {{ data.paymentDate }}</p>
          <p>총 금액: {{ data.reservationTotalFee }}원</p>
        </div>
        <div class="text-center mt-4">
          <button class="btn btn-outline-danger me-2" @click="navigateToDirections">🚗 길 찾기</button>
          <button class="btn btn-outline-secondary" @click="goHome">🏠 홈으로</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const data = reactive({
  rpzNum: route.query.rpzNum || 'N/A',
  rpzAddress: route.query.rpzAddress || 'N/A',
  reservationDay: route.query.reservationDay || 'N/A', // URL에서 예약일 가져오기
  reservationStartTime: route.query.reservationStartTime || 'N/A', // URL에서 시작시간 가져오기
  reservationEndTime: route.query.reservationEndTime || 'N/A', // URL에서 종료시간 가져오기
  paymentDate: route.query.paymentDate || new Date().toLocaleString(), // 결제일시 기본값으로 현재 시간
  reservationTotalFee: route.query.reservationTotalFee || 'N/A', // 총 금액 추가
  image: route.query.image || '@/assets/images/default_parking_image.png', // 주차 이미지 추가
});

// 예약 정보를 서버로 보내는 함수
const sendReservationData = async () => {
  try {
    const response = await axios.post('/api/reservations', {
      rpzNum: data.rpzNum,
      rpzAddress: data.rpzAddress,
      reservationDay: data.reservationDay,
      reservationStartTime: data.reservationStartTime,
      reservationEndTime: data.reservationEndTime,
      paymentDate: data.paymentDate,
      reservationTotalFee: data.reservationTotalFee,
      image: data.image
    });
    console.log("예약 정보가 성공적으로 전송되었습니다:", response.data);
  } catch (error) {
    console.error("예약 정보를 전송하는 데 실패했습니다:", error);
  }
};

// 컴포넌트가 마운트될 때 예약 정보를 서버로 전송
onMounted(() => {
  sendReservationData();
});

// 길 찾기 버튼 클릭 시 동작할 함수
const navigateToDirections = () => {
  // 길 찾기 로직 추가 (예: 지도 API 호출)
  console.log("길 찾기 버튼 클릭됨");
};

// 홈으로 버튼 클릭 시 동작할 함수
const goHome = () => {
  // 홈으로 이동하는 로직 추가 (예: router.push('/home'))
  console.log("홈으로 이동");
};
</script>

<style scoped>
.container-fluid {
  padding-top: 20px;
  overflow-x: hidden;
  width: 460px;
  border-radius: 12px;
}

.app-card {
  width: 100%;
  max-width: 450px; /* 최대 너비를 조정하여 정렬 맞춤 */
}

.fw-bold {
  font-weight: bold; /* 진하게 표시하기 위한 클래스 */
}

.text-center {
  text-align: center; /* 중앙 정렬 */
}

.mt-3 {
  margin-top: 1rem; /* 간격 조정 */
}

.logo {
  width: 150px; /* 로고 크기 조절 */
  height: auto; /* 비율 유지 */
}

.reservation-image {
  width: 360px; /* 주차 이미지 크기 조절 */
  height: 180px; /* 주차 이미지 높이 조절 */
  object-fit: cover; /* 비율 유지 */
  border: 1px solid #ddd; /* 테두리 추가 */
}

.thick-line {
  border: none;
  border-top: 2px solid #000; /* 굵은 줄 색상과 두께 조정 */
  margin: 1rem 0; /* 상하 여백 조정 */
}

/* 줄 간격 조정 */
.info {
  line-height: 1.5; /* 줄 간격을 줄이기 */
  margin-bottom: 0.5rem; /* 요소 간격 조정 */
}
</style>
