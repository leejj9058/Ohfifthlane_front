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
    <input 
      type="number" 
      class="form-control no-focus me-2" 
      placeholder="사용할 포인트를 입력해주세요." 
      style="width: 220px; padding: 0.3rem; font-size: 0.9rem; height: 50px;" 
      v-model="inputUsedPoints" 
    />
    <button 
      class="btn custom-btn" 
      :class="{ 'custom-btn-active': inputUsedPoints > 0 }" 
      @click="usedPoint" style="font-size: 15px; margin-left: 9px; height: 50px;"
    >사용하기</button>
  </div>
  <div class="d-flex justify-content-between align-items-center mt-2">
    <p class="me-2" style="font-size: 0.9rem; margin-bottom: 0;">보유 : {{ userPoint }} P</p>
    <div class="d-flex align-items-center">
      <input type="checkbox" id="useAllPoints" class="me-1" @change="toggleUseAllPoints">
      <label for="useAllPoints" style="font-size: 0.9rem; margin-bottom: 0;">모두 사용</label>
    </div>
  </div>
</div>


   

      <hr class="thick-line">
      <div class="d-flex justify-content-between">
        <p>주차금액</p>
        <p class="text-end">{{ ParkingTotalFee }} 원</p>
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

      <div class="d-flex align-items-center mt-3">
  <button 
    class="custom-checkbox"
    :class="{'checked': isAgreed}"
    @click="toggleAgree"
  >
    <i class="bi bi-check-circle" v-if="isAgreed" style="color: #1453ff;"></i>
    <i class="bi bi-circle" v-else style="color: #9cb6ff;"></i>
  </button>
  <label for="agreeTerms" style="font-size: 0.9rem;">
    결제 내역에 동의합니다.
  </label>
</div>

<!-- 결제하기 버튼 -->
<button 
  class="btn btn-dark w-100 mt-3" 
  @click="completePayment" 
  :disabled="!isAgreed"  
>
  결제하기
</button>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios'; // axios 임포트
import parkingImage from '@/assets/images/parkingarea.png';
import BootPay from "bootpay-js"; // 부트페이 SDK

//-----------------------------------------변수--------------------------------------------------
const router = useRouter();
const route = useRoute();

const userPoint = ref(0); // 보유 포인트
const inputUsedPoints = ref(''); // 사용할 포인트
const usedPoints = ref('');
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
const ParkingTotalFee = ref(0);
const image = parkingImage;

// 동의 여부 상태 관리
const isAgreed = ref(false);

// 동의 상태 토글 함수
const toggleAgree = () => {
  isAgreed.value = !isAgreed.value;
};


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
  RPZId.value = Number(route.query.RPZId) || 0;
  RPZNum.value = route.query.RPZNum || '';
  RPZAddress.value = route.query.RPZAddress || '';
  reservationDay.value = route.query.reservationDay || '';
  reservationStartTime.value = route.query.reservationStartTime || '';
  reservationEndTime.value = route.query.reservationEndTime || '';
  ParkingTotalFee.value = Number(route.query.reservationTotalFee) || 0;
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
    console.log(response.data);
    userPoint.value = response.data; // 받아온 포인트 값 설정
  } catch (error) {
    console.error("예약하는데 실패:", error);
  }
};

// 부트페이 결제 및 완료 처리
const completePayment = async () => {
  const totalFee = reservationTotalFee.value; // 총 결제 금액 계산
 
  
  // 부트페이 결제 요청
  BootPay.request({
    price: totalFee.toString(), // reservationTotalFee 값을 문자열로 변환하여 전달
    application_id: "673af9cc4fb27baaf86e4fe5", // 부트페이 Application ID
    name: "주차로", 
    pg: 'kcp', 
    method: 'card', 
    user_info: {
      username: "동희수",
      email: "test@example.com",
      phone: "010-1234-5678"
    },
    order_id: `order_${new Date().getTime()}`, // 고유 주문 ID
  })
  .error((data) => {
    console.error("결제 실패:", data);
    alert("결제에 실패하였습니다. 다시 시도해주세요.");
  })
  .cancel((data) => {
    console.log("결제 취소:", data);
    alert("결제가 취소되었습니다.");
  })
  .close(() => {
    console.log("결제 창이 닫혔습니다.");
  })
  .done((data) => {
    console.log("결제 성공:", data);
    insertReservation();
    })
    .catch(error => {
      console.error("결제 실패:", error);
      alert("결제에 실패하였습니다. 다시 시도해주세요.");
    });
};

// 결제
const insertReservation = async() => {
  console.log(reservationStartTime.value)
  try {
    const response = await axios.post("/api/addReservation", 
    {
      userId : userId.value,
      reservationStartTime: reservationStartTime.value,
      reservationEndTime: reservationEndTime.value,
      reservationDay: reservationDay.value,
      reservationTotalFee: reservationTotalFee.value,
      rpzId: RPZId.value,
    }); 
    console.log(response.data);
    
    // 결제 완료 페이지 이동
    router.push({
    name: 'paymentComplete', 
    query: {
      RPZId: RPZId.value,
      RPZNum: RPZNum.value,
      RPZAddress: RPZAddress.value,
      reservationDay: reservationDay.value,
      reservationStartTime: reservationStartTime.value,
      reservationEndTime: reservationEndTime.value,
      paymentDate: new Date().toLocaleString(),
      reservationTotalFee: reservationTotalFee.value,
      image: image,
    }
  });
  } catch (error) {
    console.error("포인트를 가져오는 데 실패했습니다:", error);
  }
  
};


const usedPoint = () => {
  usedPoints.value = inputUsedPoints.value
  updateUsedPoints();
  reservationPaymentFee();
}

// 포인트 입력에 따른 업데이트
const updateUsedPoints = () => {
  const inputPointNumber = Number(inputUsedPoints.value); // 문자열을 숫자로 변환
  const userPointNumber = Number(userPoint.value); // 안전하게 숫자 변환

  if (isNaN(inputPointNumber) || inputPointNumber < 0) {
    usedPoints.value = 0;
  } else if (inputPointNumber > userPointNumber) {
    usedPoints.value = userPointNumber;
  } else {
    usedPoints.value = inputPointNumber;
  }
};

// 모두 사용 체크박스 처리
const toggleUseAllPoints = (event) => {
  usedPoints.value = event.target.checked ? userPoint.value : 0;
  inputUsedPoints.value = usedPoints.value
  reservationPaymentFee();
};

// 총 결제 금액 계산
const reservationPaymentFee = () => {
  const fee = Number(ParkingTotalFee.value) || 0;
  const points = Number(usedPoints.value) || 0;
  reservationTotalFee.value = Math.max(fee - points, 0);
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

.no-focus:focus {
  outline: none; /* 외곽선 제거 */
  box-shadow: none; /* 파란색 효과 제거 */
  border-color: #ccc; /* 기본 테두리 색상 */
}

/* 사용하기 버튼 스타일 */
.custom-btn {
  background-color: #9cb6ff; /* 연한 남색 */
  color: white;
  border: none;
  padding: 0.3rem 1rem;
  font-size: 1rem;
  border-radius: 4px;
}
/* 입력값이 0 이상일 때 활성화된 스타일 */
.custom-btn-active {
  background-color: #4d7cff; /* 더 진한 남색 */
  transition: background-color 0.3s ease; /* 색상 전환 효과 */
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

    max-width: 390px;
  }

  .payment-buttons {
    flex-direction: column;
    gap: 10px;
  }

}

.custom-checkbox {
  background-color: transparent;
  border: none;
  display: inline-block;
  cursor: pointer;
  font-size: 20px; /* 아이콘 크기 조정 */
  transition: all 0.3s ease;
}

.custom-checkbox.checked {
  color: #1453ff; /* 체크된 상태일 때 색상 */
}

.custom-checkbox i {
  font-size: 1.5rem; /* 아이콘 크기 */
  transition: all 0.3s ease;
}

.custom-checkbox:focus {
  outline: none;
}

.custom-checkbox:active {
  transform: scale(1.1);
}

.custom-checkbox.disabled {
  color: #ddd;
  cursor: not-allowed;
}
</style>
