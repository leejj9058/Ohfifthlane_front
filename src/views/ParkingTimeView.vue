<template>
  <Header></Header>

  <div class="container-fluid d-flex flex-column align-items-center justify-content-center">
    <div class="d-flex justify-content-center align-items-center p-3 card" id="background">
      <div class="p-4" style="max-width: 700px;">
        <div class="d-flex align-items-center">
          <button class="btn btn-link mb-3" @click="goBack">
            <i class="bi bi-arrow-left arrow-icon"></i>
          </button>
        </div>

        <h1 class="mb-4 fs-2 fw-bold">내 공유주차장 설정</h1>

        <div class="mb-4">
          <h2 class="mb-4 fs-5">주간 사용 가능 시간을 설정합니다.</h2>

          <hr class="my-4" style="margin-bottom: 50px !important;">

          <!-- 모바일에서는 아코디언 적용-->
          <div v-if="isMobile" class="accordion" id="timeSettingsAccordion">
            <div v-for="(day, date) in week" :key="date" class="accordion-item mb-2">
              <h2 class="accordion-header">
                <button
                  class="accordion-button collapsed"
                  type="button"
                  @click="toggleDay(date)"
                  :aria-expanded="activeDay === date"
                >
                  {{ day }}
                  <div class="form-check form-switch ms-auto">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="timeSet[date].isActive"
                      @click.stop="onToggleClick(date)"
                      :id="'switch-' + date"
                    />
                  </div>
                </button>
              </h2>
              <div class="accordion-collapse collapse" :class="{ show: activeDay === date }">
                <div class="accordion-body">
                  <div class="d-flex flex-column align-items-start time-picker-container">
                    <div v-for="(timeSlot, timeBoxs) in timeSet[date].timeSlots" :key="timeBoxs"
                      class="d-flex align-items-center mb-2 time-slot">
                      <VueTimepicker v-model="timeSlot.start" format="A hh:mm" minute-interval="10"
                        class="me-2 custom-placeholder" am-text="오전" pm-text="오후"
                        input-class="form-control form-control-sm time-input" placeholder="시작"></VueTimepicker>
                      <span class="mx-2">~</span>
                      <VueTimepicker v-model="timeSlot.end" format="A hh:mm" minute-interval="10"
                        class="me-2 custom-placeholder" am-text="오전" pm-text="오후"
                        input-class="form-control form-control-sm time-input" placeholder="종료"></VueTimepicker>

                        <button
                      v-if="
                        timeBoxs === timeSet[date].timeSlots.length - 1 &&
                        timeSet[date].timeSlots.length < MAX_TIMEBOX
                      "
                      @click.prevent="addTimeSlot(date)"
                      class="btn btn-sm btn-outline-primary ms-2"
                    >
                      <i class="bi bi-plus"></i>
                    </button>

                    <button
                      v-if="timeSet[date].timeSlots.length > 1"
                      @click.prevent="removeTimeSlot(date, timeBoxs)"
                      class="btn btn-sm btn-outline-danger ms-2"
                    >
                      <i class="bi bi-dash"></i>
                    </button>  
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 웹에서는 기존 방식 -->
          <div v-else class="time-settings-container">
            <div v-for="(day, date) in week" :key="index" class="mb-4 day-setting">
              <div class="d-flex align-items-center flex-wrap justify-content-between">
                <div class="me-3 mb-3 d-flex align-items-center justify-content-between day-label">
                  {{ day }}
                  <div class="form-check form-switch">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="timeSet[date].isActive"
                      :id="'switch-' + date"
                    />
                  </div>
                </div>

                <div v-if="timeSet[date].isActive" class="d-flex flex-column align-items-start time-picker-container">
                  <div v-for="(timeSlot, timeBoxs) in timeSet[date].timeSlots" :key="timeBoxs"
                    class="d-flex align-items-center mb-2 time-slot">
                    <VueTimepicker v-model="timeSlot.start" format="A hh:mm" minute-interval="10"
                      class="me-2 custom-placeholder" am-text="오전" pm-text="오후"
                      input-class="form-control form-control-sm time-input" placeholder="시작"></VueTimepicker>
                    <span class="mx-2">~</span>
                    <VueTimepicker v-model="timeSlot.end" format="A hh:mm" minute-interval="10"
                      class="me-2 custom-placeholder" am-text="오전" pm-text="오후"
                      input-class="form-control form-control-sm time-input" placeholder="종료"></VueTimepicker>
                      <button
                      v-if="
                        timeBoxs === timeSet[date].timeSlots.length - 1 &&
                        timeSet[date].timeSlots.length < MAX_TIMEBOX
                      "
                      @click.prevent="addTimeSlot(date)"
                      class="btn btn-sm btn-outline-primary ms-2"
                    >
                      <i class="bi bi-plus"></i>
                    </button>

                    <button
                      v-if="timeSet[date].timeSlots.length > 1"
                      @click.prevent="removeTimeSlot(date, timeBoxs)"
                      class="btn btn-sm btn-outline-danger ms-2"
                    >
                      <i class="bi bi-dash"></i>
                    </button>  
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-5 d-flex justify-content-center">
        <button class="btn btn-primary me-3 px-4 py-2" @click.prevent="saveSettings">저장하기</button>
        <button class="btn btn-secondary ms-3 px-4 py-2" @click.prevent="resetSettings">초기화</button>
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
const isMobile = ref(window.innerWidth <= 768);

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};
window.addEventListener('resize', checkMobile);

const goBack = () => {
  router.go(-1);
};

const week = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];
const MAX_TIMEBOX = 6;

const timeSet = ref(week.map(() => ({
  isActive: false,
  timeSlots: [{ start: '', end: '' }]
})));

const activeDay = ref(null);

const toggleDay = (date) => {
  activeDay.value = activeDay.value === date ? null : date;
};

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


const onToggleClick = (date) => {
  if (isMobile.value) {
    // 토글이 켜졌을 때 아코디언 열기
    if (timeSet.value[date].isActive) {

      activeDay.value = null;
    } else {
      // 토글이 꺼졌을 때 아코디언 닫기
      
      activeDay.value = date;
    }
  }
};

const saveSettings = () => {
  console.log('저장된 설정:', timeSet.value);
};

const resetSettings = () => {
  timeSet.value = week.map(() => ({
    isActive: false,
    timeSlots: [{ start: '', end: '' }]
  }));
  activeDay.value = null;


// `isMobile` 상태를 초기화
isMobile.value = window.innerWidth <= 768;
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
  max-width: 500px;
}

.day-label {
  width: 120px;
  font-size: 18px;
}

.time-picker-container {
  flex-grow: 1;
}


@media (max-width: 768px) {
  .time-slot {
    flex-direction: column;
    width: 100%;
    gap: 10px;
  }
}
</style>