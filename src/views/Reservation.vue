<template>
  <div class="container-fluid d-flex flex-column align-items-center justify-content-center">
    <div class="card outer-card">
      <!-- Material Icons CDN 포함 -->
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

      <div class="map-icon-container">
        <span class="material-icons" @click="goToMap">map</span> <!-- 지도 모양 아이콘 -->
      </div>
      <img src="@/assets/images/parkingarea.png" class="card-img-top" alt="Parking" />

      <div class="content-card">
        <div class="card-body text-center">
          <h5 class="card-title"><strong>{{ RPZNum }}</strong></h5>
          <p class="card-text"><strong>{{ RPZAddress }}</strong></p>
          <div class="d-flex justify-content-between align-items-center">
            <p class="text mb-0"><strong>🅿️ 주차요금</strong></p>
            <p class="text mb-0"><strong>10분당 {{ rpzFee }}원</strong></p>
          </div>
        </div>
      </div>

      <div class="border-top p-3">
        <div class="date-buttons d-flex justify-content-around mb-2">
          <button class="btn btn-light-red" :class="{ 'active': selectedDate === 0 }" @click="selectDate(0)">
            {{ formattedToday }}
          </button>
          <button class="btn btn-light-red" :class="{ 'active': selectedDate === 1 }" @click="selectDate(1)">
            {{ formattedTomorrow }}
          </button>
          <button class="btn btn-light-red" :class="{ 'active': selectedDate === 2 }" @click="selectDate(2)">
            {{ formattedDayAfterTomorrow }}
          </button>
        </div>

        <div class="period-radio-buttons d-flex justify-content-around mb-2">
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" id="amRadio" value="AM" v-model="selectedPeriod"
              @change="selectPeriod('AM')" :disabled="!isDateSelected">
            <label class="form-check-label" for="amRadio">오전</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" id="pmRadio" value="PM" v-model="selectedPeriod"
              @change="selectPeriod('PM')" :disabled="!isDateSelected">
            <label class="form-check-label" for="pmRadio">오후</label>
          </div>
        </div>

        <div class="rectangle-time-bar">
          <div class="scrollable">
            <div v-for="(hour, index) in availableHours" :key="hour" :class="{
              'selected': hour === startTime.value,
              'greyed-out': reservedSlots.includes(hour),
              'btn-yellow': selectedSlots.includes(hour)
            }" @click="selectTime(hour)" class="time-slot">
              <span class="time-label" v-if="index % 6 === 0">{{ formatHour(hour) }}</span>
            </div>
          </div>
        </div>

        <p class="bold-text mt-3">예약시간 설정 (최소 30분부터 가능)</p>

        <div class="d-flex flex-column align-items-center">
          <p class="selected-date small-text">
            {{ selectedDate === 0 ? formattedToday : selectedDate === 1 ? formattedTomorrow : formattedDayAfterTomorrow
            }}
          </p>
          <p class="mb-0">
            <span class="font-small">{{ selectedSlots.length === 0 ? '시간을 선택하세요' : '' }}</span>
            <span class="font-large">{{ selectedSlots.length > 0 ? `${reservationStartTime} ~ ${reservationEndTime}` :
              '' }}</span>
          </p>
        </div>
      </div>

      <div class="card-body text-center">
        <div class="d-flex justify-content-between">
          <p class="mb-0">총 시간</p>
          <p class="mb-1"><strong>{{ duration }}</strong></p>
        </div>

        <div class="d-flex justify-content-between">
          <p class="mb-0">총 가격</p>
          <p class="mb-1"><strong>{{ reservationFee }}원</strong></p>
        </div>
        <button class="btn btn-pay w-100 mt-3" @click="confirmPayment">예약하기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

//-----------------------------------변수--------------------------------------

const router = useRouter();
const route = useRoute();

// 지도 페이지로 이동하는 함수
const goToMap = () => {
  router.push('/map');
};

// 상태 변수 설정
const selectedDate = ref(null);
const selectedPeriod = ref(null); // AM/PM 선택
const startTime = ref(9); // 예약 시작 시간
const endTime = ref(10); // 예약 종료 시간
const reservedSlots = computed(() => {
  // 현재 시간 이전의 슬롯은 회색으로 표시
  const currentHour = today.getHours();
  const currentMinutes = today.getMinutes();
  const currentTimeInHours = currentHour + currentMinutes / 60;
  if (selectedDate.value === 0) {
    return availableHours.value.filter(hour => hour <= currentTimeInHours);
  }
  return [];
});
const selectedSlots = ref([]);

const userId = ref(); //유저 아이디

// 주차장 정보 변수
const RPZId = route.query.rpzId; // 예: 122-189
const RPZNum = ref(''); // 예: 122-189
const RPZAddress = ref(''); // 예: 서울 강남구 120-1
const rpzFee = ref(0);
const shareStartTime = ref(0); // 예약 공유 시작 시간
const shareEndTime = ref(24);   // 예약 공유 종료 시간

//-----------------------------------함수-------------------------------

onMounted(() => {
  // RPZ 정보 가져오기
  getRPZById(route.query.rpzId);

  // userId 가져오기
  console.log(userId.value);
  getUserId();
});


// RPZ정보 가져오기
const getRPZById = async (rpzId) => {
  try {

    const response = await axios.post(`/api/getRPZById?rpzId=${rpzId}`);

    console.log("1. API response data:", response.data);
    RPZNum.value = response.data.rpzNum || '122-189';
    RPZAddress.value = response.data.rpzAddress || '서울 강남구 120-1';
    rpzFee.value = response.data.rpzFee || 500;
    shareStartTime.value = response.data.shareStartTime || 0; // 기본값 설정
    shareEndTime.value = response.data.shareEndTime || 24;   // 기본값 설정

  } catch (error) {

    console.error('주차장을 찾을 수 없습니다:', error);
  }
};

// userId 가져오기
const getUserId = async () => {
  try {

    const response = await axios.get('/api/getUserId');

    console.log("1. API response data:", response.data);
    userId.value = response.data;

  } catch (error) {
    console.error('로그인 정보가 없습니다', error);
  }
};




//날짜 및 시간 계산
const today = new Date();
const formattedToday = computed(() => `${today.getMonth() + 1}/${today.getDate()}`);
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const formattedTomorrow = computed(() => `${tomorrow.getMonth() + 1}/${tomorrow.getDate()}`);
const dayAfterTomorrow = new Date(today);
dayAfterTomorrow.setDate(today.getDate() + 2);
const formattedDayAfterTomorrow = computed(() => `${dayAfterTomorrow.getMonth() + 1}/${dayAfterTomorrow.getDate()}`);
const isDateSelected = computed(() => selectedDate.value !== null);
const reservationDay = computed(() => {
  return selectedDate.value === 0 ? formattedToday.value
    : selectedDate.value === 1 ? formattedTomorrow.value
      : formattedDayAfterTomorrow.value;
});


// 예약 시간 계산
const duration = computed(() => {
  if (selectedSlots.value.length === 0) {
    return '0분'; // 선택한 슬롯이 없을 경우
  }

  const totalHours = (endTime.value - startTime.value);
  const totalMinutes = Math.round(totalHours * 60);

  if (totalHours < 1) {
    return `${totalMinutes}분`; // 1시간 미만일 경우
  } else {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return minutes === 0 ? `${hours}시간` : `${hours}시간 ${minutes}분`;
  }
});

// 예약 비용 계산
const reservationFee = computed(() => {
  if (selectedSlots.value.length === 0) {
    return '0'; // 선택한 슬롯이 없을 경우
  }

  const totalHours = (endTime.value - startTime.value);
  const totalMinutes = Math.round(totalHours * 60);
  // 30분 미만일 경우 예약 불가

  const totalCost = Math.ceil(totalMinutes / 10) * rpzFee.value; // 10분 단위로 계산 (10분당 500원)

  return `${totalCost}`;
});


// 시간 슬롯 계산
// 시작시간 형변환
const reservationStartTime = computed(() => formatTime(startTime.value));
// 종료시간 형변환
const reservationEndTime = computed(() => formatTime(endTime.value));
const availableHours = computed(() => {
  const startHour = selectedPeriod.value === 'AM' ? 0 : 12;
  const endHour = selectedPeriod.value === 'AM' ? 12 : 24;
  // 10분 단위로 시간 슬롯 생성
  const hourSlots = Array.from({ length: endHour - startHour }, (_, i) => i + startHour)
    .flatMap(hour => Array.from({ length: 6 }, (_, j) => (hour + j * 10 / 60))) // 10분 단위로 나누기
    .filter(hour => hour >= shareStartTime.value && hour < shareEndTime.value);

  return hourSlots;
});


const selectDate = (date) => {
  selectedDate.value = date;

  selectedSlots.value = [];
  // 현재 날짜를 선택한 경우에만 현재 시간에 따라 기간을 설정
  if (date === 0) {
    const currentHour = today.getHours();
    selectedPeriod.value = currentHour >= 12 ? 'PM' : 'AM';
  } else {
    selectedPeriod.value = 'AM'; // 다른 날짜의 경우 기본 AM
  }
};

// 시간 슬롯 선택
const selectTime = (hour) => {
  // 회색 슬롯은 클릭할 수 없도록 체크
  if (!reservedSlots.value.includes(hour)) {
    const isSelected = selectedSlots.value.includes(hour);

    if (isSelected) {
      // 양옆 끝을 클릭했을 때, 하나씩만 지워짐
      if (selectedSlots.value.length === 1) {
        // 하나만 선택된 경우에는 그냥 해제
        selectedSlots.value = [];
      } else {
        // 여러 개의 슬롯이 선택된 경우, 중간 슬롯을 클릭하면 모두 해제
        if (hour !== selectedSlots.value[0] && hour !== selectedSlots.value[selectedSlots.value.length - 1]) {
          // 중간 슬롯을 클릭했을 때, 모든 선택을 해제
          selectedSlots.value = [];
        } else {
          // 양옆 끝을 클릭한 경우, 그 하나만 지움
          selectedSlots.value = selectedSlots.value.filter(slot => slot !== hour);
        }
      }
    } else {
      // 선택된 슬롯이 여러 개 있을 경우, 클릭한 중간 슬롯을 클릭하면 모든 선택을 해제
      if (selectedSlots.value.length > 1) {
        selectedSlots.value = []; // 선택된 슬롯 모두 초기화
      }

      // 선택된 슬롯이 없거나 첫 슬롯을 선택한 경우
      if (selectedSlots.value.length === 0 || selectedSlots.value[0] === hour) {
        selectedSlots.value = [hour]; // 선택한 슬롯만 저장
      } else {
        // 첫 번째 슬롯과 클릭한 슬롯을 기준으로 범위 설정
        const startSlot = Math.min(selectedSlots.value[0], hour);
        const endSlot = Math.max(selectedSlots.value[0], hour);

        // 시작 슬롯과 끝 슬롯 사이의 모든 슬롯을 선택
        selectedSlots.value = [];
        for (let i = Math.floor(startSlot * 60); i <= Math.floor(endSlot * 60); i += 10) {
          const slot = i / 60; // 분을 시간으로 변환
          if (!reservedSlots.value.includes(slot)) {
            selectedSlots.value.push(slot);
          }
        }
      }
    }
  }

  // 시작과 끝 시간을 설정
  if (selectedSlots.value.length > 0) {
    startTime.value = selectedSlots.value[0];
    endTime.value = selectedSlots.value[selectedSlots.value.length - 1] + 10 / 60; // 마지막 슬롯 끝
  } else {
    // 선택된 슬롯이 없을 때 초기화
    startTime.value = 9; // 초기값
    endTime.value = 10; // 초기값
  }
};

// 시간 설정
const formatTime = (hour) => {
  const hours = Math.floor(hour);
  const formattedHours = hours < 10 ? '0' + hours : hours; // 한 자리일 때 앞에 0 추가
  const minutes = Math.round((hour % 1) * 60);
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  return `${formattedHours}:${formattedMinutes}`;
};

const formatHour = (hour) => {
  const hours = Math.floor(hour);
  const minutes = (hour % 1) * 60;
  return Math.floor(hour);
};

// AM/PM 선택
const selectPeriod = (period) => {
  selectedPeriod.value = period;
  selectedSlots.value = [];
};

// 결제화면으로 이동
const confirmPayment = () => {
  if (selectedSlots.value.length === 0) {
    alert("예약 시간을 선택해주세요.");
    return;
  }

  if (selectedSlots.value.length < 3) {
    alert('30분 이상부터 예약 가능합니다.');
    return;
  }

  if (!userId.value || userId.value < 1) {
    alert("로그인이 필요합니다.");
    router.push('/login');
    return;
  }

  router.push({
    path: '/parkingPayment',
    query: {
      userId: userId.value || 0,
      RPZId: RPZId,
      RPZNum: RPZNum.value || '',
      RPZAddress: RPZAddress.value || '',
      reservationDay: reservationDay.value || '',
      reservationStartTime: reservationStartTime.value || '',
      reservationEndTime: reservationEndTime.value || '',
      reservationTotalFee: reservationFee.value || 0,
    }
  });
};

</script>

<style scoped>
.container-fluid {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding-top: 20px;
  overflow-x: hidden;
}

/* 사진 위에 동그란 원 배치 */

.map-icon-container {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 48px;
  height: 48px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

.map-icon-container i,
.map-icon-container svg,
.map-icon-container .material-icons {
  font-size: 24px;
  color: rgb(128, 128, 128);
  /* 아이콘 색상 */
}


/* 추가된 오전/오후 버튼 스타일 */
.period-buttons .btn-light-period {
  background-color: white;
  border: 1px solid #8c8c8c;
  color: #989898;
  width: 70px;
  height: 28px;
  border-radius: 5px;
  font-size: 0.86rem;
}

.period-buttons .btn-light-period.active {
  background-color: #ff6565;
  color: white;
}

.container {
  max-width: 400px;
}

.outer-card {
  width: 100%;
  max-width: 400px;
  border: 1px solid #e9ecef;
}

.card-img-top {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.content-card {
  background-color: #fff;
  margin-top: -20px;
  padding: 3px;
  border-radius: 17px;
}

.card-title {
  font-size: 1.5rem;
  line-height: 1.2;
}

.card-text {
  font-size: 0.8rem;
  line-height: 0.5;
  color: rgb(114, 114, 114);
}

.text {
  line-height: 1.2;
  font-size: 0.75rem;
  color: rgb(23, 23, 137);
}

.btn-pay {
  background-color: rgb(112, 112, 112);
  /* 기본 배경색 */
  color: white;
  margin: 5px;
  transition: background-color 0.3s ease;
  /* 색상 변화에 부드러운 전환 효과 추가 */
}

.btn-pay:hover {
  background-color: rgb(0, 0, 0);
  /* 마우스를 올렸을 때 배경색 진회색으로 변경 */
}

.date-buttons {
  margin-bottom: 10px;
}

.btn-light-red {
  background-color: white;
  border: 1px solid #8c8c8c;
  color: #989898;
  width: 70px;
  height: 28px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
  font-size: 0.86rem;
}

.btn-light-red.active {
  background-color: #ff6565;
  color: white;
  border: none;
}

.bold-text {
  font-weight: bold;
  font-size: 0.75rem;
  margin-bottom: 5px;
  text-align: left;
}

.time-slot {
  flex: 0 0 10px;
  position: relative;
  cursor: pointer;
  background-color: #fff;
  border: 1px solid #e9ecef;
  border-radius: 5px;
  height: 25px;
  margin-right: 2.3px;
}

.rectangle-time-bar {
  overflow-x: auto;
  white-space: nowrap;
  height: 68px;
  display: flex;
  align-items: center;
  margin-top: 15px;
}

.scrollable {
  display: inline-flex;
}

.rectangle-time-bar div {
  flex: 0 0 10px;
  position: relative;
  cursor: pointer;
  background-color: #fff;
  border: 1px solid #e9ecef;
  border-radius: 5px;
  height: 25px;
  margin-right: 2.3px;
}

.rectangle-time-bar div .time-label {
  position: absolute;
  top: -25px;
  left: 0%;
  transform: translateX(-80%);
  font-size: 0.7rem;
  margin: 8px;
}

.rectangle-time-bar div.selected {
  background-color: #007bff;
  color: white;
}

.rectangle-time-bar div.greyed-out {
  background-color: rgba(200, 200, 200, 0.5);
  cursor: not-allowed;
  /* 클릭할 수 없음을 표시 */
}


.rectangle-time-bar div.btn-yellow {
  background-color: #ffeb3b;
  /* 노란색 */
  color: black;
}

.font-large {
  font-size: 2rem;
  color: #273788;
  /* 원하는 색상 */
  font-weight: bold;
  /* 글자 굵게 */
}

.font-small {
  font-size: 1.3rem;
  /* 원하는 크기로 설정 */
  color: #ff6565;
  font-weight: bold;
  /* 색상 유지 */
}

.small-text {
  font-size: 1.25rem;
  /* 글자 크기를 작게 */
  margin-bottom: 1px;
  /* 아래 요소와의 간격을 줄임 */
  color: #273788;
  font-weight: bold;
  /* 원하는 색상으로 설정 */
}
</style>
