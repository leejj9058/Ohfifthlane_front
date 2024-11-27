<template>
  <Header></Header>
  <div class="form-container">
    <p class="form-title" style="font-size: 25px;">신고할 차량의 차량번호를 조회하기</p>
    <div class="input-row">
      <input type="text" class="form-input"  placeholder="차량번호 입력" v-model="vehicleNumber" />
      <button class="lookup-button" @click="checkVehicleRegistration" >조회</button>
    </div>
    <div v-if="registrationChecked">
      <div v-if="isRegistered" class="info-box registered">
        <p><strong class="inputCarNum">{{ staticVehicleNumber }}</strong>차량은 신고 대상 차량이 아닙니다</p>
      </div>
      <div v-else class="info-box unregistered">
        <p style="font-size: 20px;"><strong class="inputCarNum">{{ staticVehicleNumber }}</strong> 차량은 신고 대상 차량입니다.</p>
        <p class="warning">*차량번호가 일치하는지 한번 더 확인해 주세요*</p>
        
      </div>
      <button class="submit-button" @click="submitReport">신고하러 가기</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Header from '@/components/Header.vue';
import qrCodeImage from '@/assets/images/qr-code.png';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const vehicleNumber = ref(""); // 차량번호를 입력받기 위한 변수
const isRegistered = ref(false); // 차량이 등록된 상태인지 확인하는 변수 (true: 등록됨, false: 미등록)
const registrationChecked = ref(false); // 조회 완료 상태를 나타내는 변수 (true: 조회 완료됨)
const qrDisabledPersonCarNum = ref(''); // QR 코드에서 읽어온 차량 번호 저장
const qrIssueDate = ref(''); // QR 코드에서 읽어온 발급일자 저장 
const staticVehicleNumber = ref(""); // 조회 후에만 표시될 차량번호

// 컴포넌트가 마운트될 때 QR 코드에서 차량번호와 발급일자 정보를 가져와 변수에 저장
onMounted(()=>{
  qrDisabledPersonCarNum.value = route.query.disabledPersonCarNum;
  qrIssueDate.value = route.query.issueDate;
})

// 차량번호 조회 함수: 입력된 차량번호를 QR 코드의 차량번호와 비교해 유효성 검사를 수행
const checkVehicleRegistration = async () => {
  if (vehicleNumber.value) { // 차량번호가 입력되었는지 확인
  if (qrDisabledPersonCarNum.value === vehicleNumber.value) { // QR 코드의 차량번호와 입력된 차량번호가 일치하는지 확인
    // issueDate 문자열을 Date 객체로 변환
    const issueDate = new Date(qrIssueDate.value);
    const currentDate = new Date();

    // 현재 날짜와 issueDate의 차이가 3년 이내인지 확인 (밀리초 기준)
    const diffInMilliseconds = currentDate - issueDate;
    const threeYearsInMilliseconds = 3 * 365 * 24 * 60 * 60 * 1000;

    if (diffInMilliseconds <= threeYearsInMilliseconds) { // 3년 이내이면 등록된 차량으로 간주
      isRegistered.value = true;
      registrationChecked.value = true;
    } else {
      alert("등록된 차량 정보가 3년 이상 경과되었습니다.");
      isRegistered.value = false;
      registrationChecked.value = true;
    }
  } else {
    alert("QR코드에 등록된 차량이 아닙니다.")
    isRegistered.value = false;
    registrationChecked.value = true;
  }
  staticVehicleNumber.value = vehicleNumber.value; // 조회 후 고정된 차량번호로 설정
} else {
  alert("차량번호를 입력해주세요.");
}
  
};
// 신고 접수 함수: 신고 대상 여부에 따라 다른 메시지 표시
const submitReport = () => {
  if (!vehicleNumber.value) {
    alert("모든 항목을 입력해주세요");
  } else if (isRegistered.value) {
    alert("신고 대상 차량이 아닙니다.");
  } else {
    router.push({ 
      path: '/disabledPersonReportCamera',
      query: { vehicleNumber: vehicleNumber.value } //차량 번호 다음페이지 넘기기
    });
  }
};

const goToNoticePage = () => {
  // 공지사항 페이지로 이동
};

const goNoticeDetail = (noticeId) => {
  // 공지사항 상세 페이지로 이동
};
</script>

<style scoped>
.container-fluid {
  padding-top: 20px;
  overflow-x: hidden;
}

.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px;
  background-color: #f9f9f9;
  width: 100%;
  max-width: 460px;
  margin: 30px auto;
  border-radius: 15px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);

}

.form-photo {
  width: 100%;
  max-width: 300px;
  height: auto;
  border-radius: 8px;
  margin-bottom: 20px;
}

.form-title {
  width: 100%;
  text-align: left;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
}

.input-row {
  display: flex;
  width: 100%;
}

.form-input {
  flex: 1;
  padding: 10px;
  font-size: 12px;
  border-radius: 5px;
  border: 1px solid #ddd;

}

.lookup-button {
  margin-left: 10px;
  padding: 10px 15px;
  font-size: 20px;
  background-color: #e0e0e0;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
}

.info-box {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
  font-size: 14px;
  text-align: center;
}

.registered {
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  color: #333;
}

.unregistered {
  background-color: #fff0f0;
  border: 1px solid #ffcccc;
  color: #cc0000;
}

.warning {
  color: #cc0000;
  font-size: 12px;
  margin-top: 5px;
}

.submit-button {
  background-color: #ff0000;
  color: white;
  padding: 15px 20px;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  cursor: pointer;
  width: 100%;
  max-width: 300px;
  margin-top: 20px;
}

.board-section {
  background-color: #fff;
  border-radius: 12px;
  border: 1px solid #ddd;
  padding: 20px;
  width: 460px;
}

.list-unstyled li {
  position: relative;
  padding-left: 10px;
  cursor: pointer;
}

.list-unstyled li:hover {
  background-color: #f0f8ff;
}

.animated-button {
  transition: transform 0.3s ease;
}

.animated-button:hover {
  transform: rotate(360deg);
}

.animated-button:active {
  transform: scale(1.1);
}

@media (max-width:360px) {
  .form-container {
  
  margin: 80px auto;
  border-radius: 15px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);

}
}
</style>
