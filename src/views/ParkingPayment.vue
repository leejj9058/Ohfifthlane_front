<template>
  <div class="container-fluid d-flex flex-column align-items-center justify-content-center">
    <div class="d-flex justify-content-start w-100 p-1">
      
    </div>
    
    <div class="card app-card p-4 shadow rounded">
      <div class="d-flex justify-content-between align-items-center">
  <!-- 화살표 버튼 -->
  <button class="btn btn-link text-danger p-0" @click="goBack">
    <i class="bi bi-arrow-left fs-4"></i>
  </button>

  <!-- 결제 정보 제목 (중앙 정렬) -->
</div>
  <h4 class="fw-bold flex-grow-1 text-center">결제 정보</h4>


      <div class="bordered-info p-2 mt-3 d-flex justify-content-between align-items-center">
        <div>
          <p style="font-size: 0.95rem;"><strong>구획번호:</strong> {{ reservation.rpzNum }}</p>
          <p style="font-size: 0.95rem;"><strong>주소:</strong> {{ reservation.rpzAddress }}</p>
          <p style="font-size: 0.95rem;">
            <strong>예약시간:</strong> {{ reservation.reservationDay }} {{ reservation.reservationStartTime }} ~ {{ reservation.reservationEndTime }}
          </p>
        </div>
        <img :src="reservation.image" class="reservation-image">
      </div>

      <div class="mt-3">
        <h7 class="fw-bold">포인트 사용하기</h7>
        <div class="d-flex align-items-center mt-2">
          <input
            type="number"
            class="form-control me-2"
            placeholder="사용할 포인트를 입력해주세요."
            style="width: 500px; padding: 0.3rem; font-size: 0.9rem;"
            v-model.number="usedPoints"
            @input="updateUsedPoints"
             :value="usedPoints === '' ? '' : usedPoints"
          >
        </div>
        <div class="d-flex justify-content-between align-items-center mt-2">
          <p class="me-2" style="font-size: 0.9rem; margin-bottom: 0;">보유 : {{ userPoint }}P</p>
          <div class="d-flex align-items-center">
            <input type="checkbox" id="useAllPoints" class="me-1" @change="toggleUseAllPoints">
            <label for="useAllPoints" style="font-size: 0.9rem; margin-bottom: 0;">모두 사용</label>
          </div>
        </div>
      </div>

      <div class="payment-buttons d-flex justify-content-around mt-3">
        <button class="btn btn-success">네이버페이</button>
        <button class="btn btn-warning">카카오페이</button>
        <button class="btn btn-primary">토스페이</button>
      </div>

      <hr class="thick-line">
      <div class="d-flex justify-content-between">
        <p>주차금액</p>
        <p class="text-end">{{ reservation.reservationFee }} 원 </p>
      </div>
      <div class="d-flex justify-content-between">
        <p>포인트 사용</p>
        <p class="text-end">{{ usedPoints || 0 }} 원</p>
      </div>
      <div class="d-flex justify-content-between">
        <p><strong>총 금액</strong></p>
        <p class="text-end"><strong>{{ reservationTotalFee }} 원</strong></p>
      </div>
      <hr class="thick-line">

      <button class="btn btn-dark w-100 mt-3" @click="completePayment">결제하기</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios'; // axios 임포트
import parkingImage from '@/assets/images/parkingarea.png';

const router = useRouter();
const route = useRoute();

const userPoint = ref(0); // 사용자 포인트 저장
const usedPoints = ref(''); // 사용될 포인트 기본값을 0으로 설정

// reservation 객체 정의
const reservation = ref({
  rpzNum: route.query.rpzNum,
  rpzAddress: route.query.rpzAddress,
  reservationDay: route.query.reservationDay,
  reservationStartTime: route.query.reservationStartTime,
  reservationEndTime: route.query.reservationEndTime,
  reservationFee: route.query.reservationFee, // 주차 요금 가져오기
  image: parkingImage // 기본 이미지 또는 다른 이미지 경로를 설정
});

// 총 금액 계산
const reservationTotalFee = computed(() => {
  const fee = Number(reservation.value.reservationFee) || 0; // 주차 요금이 숫자인지 확인
  const points = Number(usedPoints.value) || 0; // 사용 포인트가 숫자인지 확인
  
  // 포인트 사용 여부에 따라 총 금액 계산
  return Math.max(fee - points, 0); 
});

// 뒤로 가기
const goBack = () => {
  router.back(); // 이전 화면으로 돌아가는 로직
};

// 결제하기
const completePayment = () => {
  router.push({
    name: 'paymentComplete', // 결제 완료 페이지 이름
    query: {
      rpzNum: reservation.value.rpzNum,
      rpzAddress: reservation.value.rpzAddress,
      reservationDay: reservation.value.reservationDay,
      reservationStartTime: reservation.value.reservationStartTime,
      reservationEndTime: reservation.value.reservationEndTime,
      paymentDate: new Date().toLocaleString(),
      reservationTotalFee: reservationTotalFee.value,
      image: reservation.value.image,
    }
  });
};

// 포인트 입력에 따른 업데이트
const updateUsedPoints = () => {
  if (usedPoints.value > userPoint.value) {
    usedPoints.value = userPoint.value; // 최대 포인트 제한
  }
  
  if (usedPoints.value < 0) {
    usedPoints.value = 0; // 음수 입력 방지
  }
};

// 모두 사용 체크박스 처리
const toggleUseAllPoints = (event) => {
  if (event.target.checked) {
    usedPoints.value = userPoint.value; // 모든 포인트 사용
  } else {
    usedPoints.value = 0; // 체크 해제 시 포인트 초기화
  }
  updateUsedPoints();
};

// 사용자 포인트 가져오기
const fetchUserPoints = async () => {
  try {
    const response = await axios.get('/api/user/points'); // 사용자 포인트 API 호출
    userPoint.value = response.data.points; // 받아온 포인트 값 설정
  } catch (error) {
    console.error("포인트를 가져오는 데 실패했습니다:", error);
  }
};

// 컴포넌트 마운트 시 사용자 포인트 가져오기
onMounted(() => {
  fetchUserPoints();
});
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
  max-width: 500px;
}

.bordered-info {
  border: 2px solid hsl(0, 0%, 24%);
  border-radius: 4px;
}

.reservation-image {
  width: 120px;
  height: 105px;
  object-fit: cover;
  border: 1px solid #ddd;
}

.mt-3 {
  margin-top: 1rem;
}

.form-control {
  display: inline-block;
}

.thick-line {
  border: none;

  
  border-top: 3px solid #000;
  margin: 1rem 0;
}

.payment-buttons {
  margin: 1rem 0;
}

.payment-buttons .btn {
  flex: 1;
  margin: 0 3px;
}
</style>
