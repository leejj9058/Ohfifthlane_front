<template>
  <div class="container-fluid d-flex flex-column align-items-center justify-content-center">
    <div class="d-flex justify-content-start w-100 p-1"></div>

    <div class="card app-card p-4 shadow rounded">
      <button class="btn btn-link text-danger" @click="goBack" style="text-align: left;">
        <i class="bi bi-arrow-left fs-4"></i>
      </button>
      <h4 class="text-center fw-bold">결제 정보</h4>

      <div class="bordered-info p-2 mt-3 d-flex justify-content-between align-items-center">
        <div v-if="RPZId">
          <p style="font-size: 0.95rem;"><strong>구획번호:</strong> {{ RPZNum }}</p>
          <p style="font-size: 0.95rem;"><strong>주소:</strong> {{ RPZAddress }}</p>
          <p style="font-size: 0.95rem;">
            <strong>예약시간:</strong> {{ reservationDay }} {{ reservationStartTime }} ~
            {{ reservationEndTime }}
          </p>
        </div>
        <div v-else>
          <p>예약 정보를 로드 중입니다...</p>
        </div>

      </div>

      <div class="mt-3">
        <h7 class="fw-bold">포인트 사용하기</h7>
        <div class="d-flex align-items-center mt-2">
          <input type="number" class="form-control me-2" placeholder="사용할 포인트를 입력해주세요."
            style="width: 500px; padding: 0.3rem; font-size: 0.9rem;" :value="usedPoints === '' ? '' : usedPoints"
            @input="updateUsedPoints" />
        </div>
        <div class="d-flex justify-content-between align-items-center mt-2">
          <p class="me-2" style="font-size: 0.9rem; margin-bottom: 0;">보유 : {{ userPoint }} P</p>
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
        <p class="text-end">{{ reservationTotalFee }} 원</p>
      </div>
      <div class="d-flex justify-content-between">
        <p>포인트 사용</p>
        <p class="text-end">{{ usedPoints || 0 }} 원</p>
      </div>
      <div class="d-flex justify-content-between">
        <p><strong>총 금액</strong></p>
        <p class="text-end"><strong>{{ reservationPaymentFee }} 원</strong></p>
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

//-----------------------------------------변수--------------------------------------------------
const router = useRouter();
const route = useRoute();

const userPoint = ref(0); // 보유 포인트
const usedPoints = ref(''); // 사용할 포인트

// reservation 객체 정의
// const reservation = ref({
//   userId: '',
//   RPZId: '',
//   RPZNum: '',
//   RPZAddress: '',
//   reservationDay: '',
//   reservationStartTime: '',
//   reservationEndTime: '',
//   reservationTotalFee: 0,
//   image: parkingImage,
// });

const userId = ref(0);
const RPZId = ref('');
const RPZNum = ref('');
const RPZAddress = ref('');
const reservationDay = ref('');
const reservationStartTime = ref('');
const reservationEndTime = ref('');
const reservationTotalFee = ref(0);
const image = parkingImage;



//-------------------------------------------함수---------------------------------------------------

onMounted(() => {
  console.log('route.query:', route.query.RPZId);
  if (!route.query.RPZId) {
    console.error("RPZId가 누락되었습니다.");
    alert("예약 정보를 가져올 수 없습니다.");
    router.push('/error'); // 오류 페이지로 이동
    return;
  }

  // 객체 값 초기화
  userId.value = route.query.userId || 0;
  RPZId.value = route.query.RPZId || '';
  RPZNum.value = route.query.RPZNum || '';
  RPZAddress.value = route.query.RPZAddress || '';
  reservationDay.value = route.query.reservationDay || '';
  reservationStartTime.value = route.query.reservationStartTime || '';
  reservationEndTime.value = route.query.reservationEndTime || '';
  reservationTotalFee.value = Number(route.query.reservationTotalFee) || 0;

  console.log(RPZNum);
  
  fetchUserPoint();
  console.log(userPoint);

});


// 뒤로 가기
const goBack = () => {
  router.back(); // 이전 화면으로 돌아가는 로직
};

// 사용자 포인트 가져오기
const fetchUserPoint = async () => {
  try {
    const response = await axios.get('/api/getUserPoint'); // 사용자 포인트 API 호출
    console.log(response.data.userPoint);
    userPoint.value = response.data.userPoint; // 받아온 포인트 값 설정
  } catch (error) {
    console.error("포인트를 가져오는 데 실패했습니다:", error);
  }
};

// 결제완료 페이지로 이동
const completePayment = () => {
  router.push({
    name: 'paymentComplete', // 결제 완료 페이지 이름
    query: {
      RPZId: RPZId,
      RPZNum: RPZNum,
      RPZAddress: RPZAddress,
      reservationDay: reservationDay,
      reservationStartTime: reservationStartTime,
      reservationEndTime: reservationEndTime,
      paymentDate: new Date().toLocaleString(),
      reservationTotalFee: reservationTotalFee,
      image: image,
    }
  });
};

// 포인트 입력에 따른 업데이트
const updateUsedPoints = () => {
  const usedPointNumber = Number(usedPoint.value); // 문자열을 숫자로 변환
  const userPointNumber = Number(userPoint.value); // 안전하게 숫자 변환

  if (isNaN(usedPointNumber) || usedPointNumber < 0) {
    usedPoints.value = 0;
  } else if (usedPointsNumber > userPointNumber) {
    usedPoints.value = userPointNumber;
  } else {
    usedPoints.value = usedPointsNumber;
  }
};

// 모두 사용 체크박스 처리
const toggleUseAllPoints = (event) => {
  usedPoints.value = event.target.checked ? userPoint.value : 0;
  updateUsedPoints();
};

// 총 결제 금액 계산
const reservationPaymentFee = computed(() => {
  const fee = Number(reservationTotalFee) || 0;
  const points = Number(usedPoints.value) || 0;
  return Math.max(fee - points, 0);
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

@media (max-width: 460px) {

  .container-fluid {
    padding: 20 5px;
    /* 모바일에서 전체 화면에 10px 패딩 추가 */
    overflow-x: hidden;
    max-width: 360px;
  }

  .payment-buttons {
    flex-direction: column;
    gap: 10px;
  }

}
</style>
