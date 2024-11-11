<template>
  <Header></Header>

  <div class="container-fluid d-flex flex-column align-items-center justify-content-center vh-100">
    <div class="d-flex justify-content-center align-items-center p-3 card" id="background">
      <div class="p-4" style="max-width: 700px;">
        <div class="d-flex align-items-center ">
          <button class="btn btn-link  mb-3" @click="goBack">
            <i class="bi bi-arrow-left arrow-icon"></i>
          </button>
        </div>  
        
        <h1 class=" mb-4 fs-2 fw-bold">내 공유주차장 설정</h1>

        <div class="mb-4">
          <h2 class=" mb-4 fs-5">주간 사용 가능 시간을 설정합니다.</h2>

          <hr class="my-4" style="margin-bottom: 50px !important;">

          <!-- 제목 밑에 큰 디브 -->
          <div class="time-settings-container">
            <!-- 일주일 이용시간 설정 -->
            <div v-for="(day, date) in week" :key="index" class="mb-4 day-setting">

              <div class="d-flex align-items-center flex-wrap justify-content-between">
                <!-- 요일, checkbox 불러오기 -->
                <div class="me-3 mb-3 d-flex align-items-center justify-content-between day-label">
                  {{ day }}

                  <!-- 요일 활성화 -->
                  <div class="form-check form-switch">
                    <!-- 체크박스 누르면 메서드에 데이트 들어가서 활성화 -->
                    <input class="form-check-input" type="checkbox" v-model="timeSet[date].isActive"
                      :id="'switch-' + date">
                  </div>
                  <!-- 요일 활성화 -->
                </div>

                <!-- 시간 설정 holder -->
                <div v-if="timeSet[date].isActive" class="d-flex flex-column align-items-start time-picker-container">

                  <!-- 타임피커 timeSlots => timeBoxs로 받아줌 -->
                  <div v-for="(timeSlot, timeBoxs) in timeSet[date].timeSlots" :key="timeBoxs"
                    class="d-flex align-items-center mb-2">
                    <VueTimepicker v-model="timeSlot.start" format="A hh:mm" minute-interval="10"
                      class="me-2 custom-placeholder" am-text="오전" pm-text="오후"
                      input-class="form-control form-control-sm time-input" placeholder="시작"></VueTimepicker>
                    <span class="mx-2">~</span>
                    <VueTimepicker v-model="timeSlot.end" format="A hh:mm" minute-interval="10"
                      class="me-2 custom-placeholder" am-text="오전" pm-text="오후"
                      input-class="form-control form-control-sm time-input" placeholder="종료"></VueTimepicker>
                    <!-- 타임피커 -->

                    <!-- 타임피커 생성 : -1 은 마지막인지 확인하는 것 0부터 시작하니까 -1로 빼서 확인 -->
                    <button
                      v-if="timeBoxs === timeSet[date].timeSlots.length - 1 && timeSet[date].timeSlots.length < MAX_TIMEBOX"
                      @click.prevent="addTimeSlot(date)" class="btn btn-sm btn-outline-primary ms-2">
                      <i class="bi bi-plus"></i>
                    </button>

                    <!-- 타임피커 하나 지우는 버튼 : >1 은 1보다 크다는 것을 의미한다. -->
                    <button v-if="timeSet[date].timeSlots.length > 1" @click.prevent="removeTimeSlot(date, timeBoxs)"
                      class="btn btn-sm btn-outline-danger ms-2">
                      <i class="bi bi-dash"></i>
                    </button>

                  </div>

                </div>
                <!-- 타임피커holder -->

              </div>

            </div>
          </div>
        </div>
      </div>

      <div class="mt-5 d-flex justify-content-center">
        <button class="btn btn-primary me-3 px-4 py-2" style="font-size: 1.1rem;"
          @click.prevent="saveSettings">저장하기</button>
        <button class="btn btn-secondary ms-3 px-4 py-2" style="font-size: 1.1rem;"
          @click.prevent="resetSettings">초기화</button>
      </div>
    </div>
  </div>



</template>

<script setup>
import { ref } from 'vue';
import Header from "@/components/Header.vue";
import VueTimepicker from 'vue3-timepicker';
import 'vue3-timepicker/dist/VueTimepicker.css';
import { useRouter } from 'vue-router';

const router = useRouter();

//goBack 함수
const goBack = () => {
  router.go(-1);
};

//date -> day
const week = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];

//타임피커 상수 정의
const MAX_TIMEBOX = 6;

// 요일이 들어가면 타임슬롯 활성화되는 메서드
//timeSlots = 타임피커
const timeSet = ref(week.map(() => ({
  isActive: false,
  timeSlots: [{ start: '', end: '' }]
})));

//타임피커 하나 더
const addTimeSlot = (day) => {
  if (timeSet.value[day].timeSlots.length < MAX_TIMEBOX) {
    timeSet.value[day].timeSlots.push({ start: '', end: '' });
  }
};

//타임피커 빼기
const removeTimeSlot = (day, timeBoxs) => {
  timeSet.value[day].timeSlots.splice(timeBoxs, 1);
};



const saveSettings = () => {
  console.log('저장된 설정:', timeSet.value);
};

const resetSettings = () => {
  timeSet.value = week.map(() => ({
    isActive: false,
    timeSlots: [{ start: '', end: '' }]
  }));
};
</script>

<style scoped>
.container-fluid {
  padding-top: 20px;
  overflow-x: hidden;
}

.custom-placeholder input::placeholder {
  color: #999;
  opacity: 1;
}

.time-input {
  width: 110px !important;
  font-size: 14px !important;
}

.vue__time-picker {
  width: auto !important;
}

.vue__time-picker input.display-time {
  font-size: 14px !important;
}

.form-check-input {
  width: 2.5rem;
  height: 1.25rem;
}

.time-settings-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.day-setting {
  width: 100%;
}

.day-label {
  width: 120px;
}

.time-picker-container {
  flex-grow: 1;
}

@media (max-width: 768px) {
  .day-setting {
    max-width: 100%;
  }

  .day-label {
    width: 100%;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .time-picker-container {
    width: 100%;
    justify-content: center;
  }

  .time-input,
  .vue__time-picker input.display-time {
    font-size: 14px !important;
    width: 110px !important;
  }

  .btn {
    font-size: 1rem !important;
    padding: 0.5rem 1rem !important;
  }
}

.vue__time-picker input.display-time:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  max-width: none;
  width: auto;
  /* 모바일에서 가로폭 조정 */
  margin-bottom: 10px;
  /* 각 요일 간의 간격 조정 */
  flex-wrap: wrap;
  /* 모바일에서 줄바꿈 가능하도록 설정 */
  justify-content: space-between;
  /* 공간을 균등하게 배분 */
  align-items: center;
  /* 세로 정렬 */
}
</style>