<template>
  <Header></Header>

  <div class="d-flex justify-content-center align-items-center p-3" id="background">
    <div class="p-4 p-md-5" style="max-width: 700px;">
      <h1 class=" mb-4 fs-2 fw-bold">내 공유주차장 설정</h1>

      <div class="mb-4">
        <h2 class=" mb-4 fs-5">주간 사용 가능 시간을 설정합니다.</h2>

        <hr class="my-4" style="margin-bottom: 50px !important;">

        <!-- 제목 밑에 큰 디브 -->
        <div class="time-settings-container">
          <!-- 일주일 이용시간 설정 -->
          <div v-for="(day, index) in weekDays" :key="index" class="mb-4 day-setting">
            <div class="d-flex align-items-center flex-wrap justify-content-center">
              <!-- 요일, checkbox 불러오기 -->
              <div class="me-3 mb-3 d-flex align-items-center justify-content-between day-label">
                {{ day }}
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" v-model="availableTimes[index].isActive"
                    :id="'switch-' + index">
                </div>
              </div>

              <!-- 시간 설정 holder -->
              <div class="d-flex align-items-center flex-wrap justify-content-center time-picker-container">
                <VueTimepicker v-model="availableTimes[index].start" format="hh:mm A" minute-interval="30"
                  class="me-2 mb-2 custom-placeholder" am-text="오전" pm-text="오후"
                  input-class="form-control form-control-sm time-input" placeholder="시작" 
                  :disabled="!availableTimes[index].isActive"></VueTimepicker>
                <VueTimepicker v-model="availableTimes[index].end" format="hh:mm A" minute-interval="30"
                  class="me-2 mb-2 custom-placeholder" am-text="오전" pm-text="오후"
                  input-class="form-control form-control-sm time-input" placeholder="종료"
                  :disabled="!availableTimes[index].isActive"></VueTimepicker>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-5 d-flex justify-content-center" style="margin-top: 100px !important;">
        <button class="btn btn-primary me-3 px-4 py-2" style="font-size: 1.1rem;" @click="saveSettings">저장하기</button>
        <button class="btn btn-secondary ms-3 px-4 py-2" style="font-size: 1.1rem;" @click="resetSettings">초기화</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Header from "@/components/Header.vue";
import VueTimepicker from 'vue3-timepicker';
import 'vue3-timepicker/dist/VueTimepicker.css';

const weekDays = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];

const availableTimes = ref(weekDays.map(() => ({
  start: '',
  end: '',
  isActive: false //사용가능 시간이 활성화 여부 : isActive (false : 비활)
})));

const saveSettings = () => {
  console.log('저장된 설정:', availableTimes.value);
  // 여기에 설정을 저장하는 로직을 추가하세요
};

const resetSettings = () => {
  availableTimes.value = weekDays.map(() => ({
    start: '',
    end: '',
    isActive: false
  }));
};
</script>

<style scoped>
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
  .card {
    padding: 2rem !important;
  }

  h1 {
    font-size: 1.5rem !important;
  }

  h2 {
    font-size: 1.2rem !important;
  }

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
}
</style>