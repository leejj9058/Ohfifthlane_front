<template>
  <div class="container-fluid d-flex flex-column align-items-center justify-content-center">
    <div class="d-flex justify-content-start w-100 p-1">
      <button class="btn btn-link text-danger" @click="goBack">
        <i class="bi bi-arrow-left fs-4"></i>
      </button>
    </div>
    <div class="card app-card p-4 shadow rounded">
      <h4 class="text-center fw-bold">결제 정보</h4>

      <!-- 테두리 추가 -->
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
          >
        </div>
        <div class="d-flex justify-content-between align-items-center mt-2">
          <p class="me-2" style="font-size: 0.9rem; margin-bottom: 0;">보유 : {{ user.points }}P</p>
          <div class="d-flex align-items-center">
            <input type="checkbox" id="useAllPoints" class="me-1" @change="toggleUseAllPoints">
            <label for="useAllPoints" style="font-size: 0.9rem; margin-bottom: 0;">모두 사용</label>
          </div>
        </div>
      </div>

      <!-- 결제 버튼 추가 -->
      <div class="payment-buttons d-flex justify-content-around mt-3">
        <button class="btn btn-success">네이버페이</button>
        <button class="btn btn-warning">카카오페이</button>
        <button class="btn btn-primary">토스페이</button>
      </div>

      <hr class="thick-line">
      <div class="d-flex justify-content-between">
        <p>주차금액</p>
        <p class="text-end">{{ reservation.amount }} 원</p>
      </div>
      <div class="d-flex justify-content-between">
        <p>포인트 사용</p>
        <p class="text-end">{{ usedPoints }} 원</p> <!-- 업데이트된 포인트 사용 금액 표시 -->
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
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import parkingImage from '@/assets/images/parkingarea.png';

const router = useRouter();

const reservation = ref({
  rpzNum: '122-189',
  rpzAddress: '서울시 강남구 테헤란로 123',
  reservationDay: '2024.10.24', // 예약일 추가
  reservationStartTime: '10:00', // 예약 시작 시간 추가
  reservationEndTime: '12:00', // 예약 종료 시간 추가
  image: parkingImage,
  amount: 5000,
});

const user = ref({
  points: 25741,
  usedPoints: 1000,
});

const usedPoints = ref(0); // 사용될 포인트 저장

const reservationTotalFee = computed(() => reservation.value.amount - usedPoints.value);

const goBack = () => {
  router.back(); // 이전 화면으로 돌아가는 로직
};

const completePayment = () => {
  router.push({
    name: 'paymentComplete',
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
  if (usedPoints.value > user.value.points) {
    usedPoints.value = user.value.points; // 최대 포인트 제한
  }
};

// 모두 사용 체크박스 처리
const toggleUseAllPoints = (event) => {
  if (event.target.checked) {
    usedPoints.value = user.value.points; // 모든 포인트 사용
  } else {
    usedPoints.value = 0; // 체크 해제 시 포인트 초기화
  }
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

/* 결제 버튼 스타일 */
.payment-buttons {
  margin: 1rem 0;
}

.payment-buttons .btn {
  flex: 1;
  margin: 0 3px;
}
</style>
