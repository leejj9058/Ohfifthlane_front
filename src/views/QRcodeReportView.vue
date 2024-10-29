<template>
  <Header></Header>
  <div class="form-container">
    <img :src="qrCodeImage" alt="Captured Photo" class="form-photo" />
    <p class="form-title">차량번호</p>
    <div class="input-row">
      <input type="text" class="form-input" placeholder="차량번호 입력" v-model="vehicleNumber" />
      <button class="lookup-button" @click="checkVehicleRegistration">조회</button>
    </div>
    <div v-if="registrationChecked">
      <div v-if="isRegistered" class="info-box registered">
        <p><strong>{{ vehicleNumber }}</strong>는 등록된 차량입니다</p>
      </div>
      <div v-else class="info-box unregistered">
        <p><strong>{{ vehicleNumber }}</strong>는 등록되지 않은 차량입니다.</p>
        <p class="warning">*차량번호가 일치하는지 한번 더 확인해 주세요*</p>
      </div>
    </div>
    <button class="submit-button" @click="submitReport">신고하기</button>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import qrCodeImage from '@/assets/images/qr-code.png';

export default {
  components: {
    Header,
  },
  data() {
    return {
      qrCodeImage,             // 이미지 경로 가져오기
      vehicleNumber: "",        // 차량번호 입력값
      isRegistered: false,      // 차량 등록 여부
      registrationChecked: false, // 조회 여부 체크
    };
  },
  methods: {
    checkVehicleRegistration() {
      
      // DB 조회 결과 예제
      const registeredVehicles = ["123가1234", "456나5678"]; // 예시 차량 번호 리스트
      this.isRegistered = registeredVehicles.includes(this.vehicleNumber);
      this.registrationChecked = true; // 조회가 수행되었음을 표시
    },
    submitReport() {
      // 입력값 유효성 검사
      if (!this.vehicleNumber) {
        alert("모든 항목을 입력해주세요");
      } else {
        alert("신고접수 되었습니다");
      }
    },
  },
};
</script>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f9f9f9;
  width: 100%;
  max-width: 400px;
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
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.lookup-button {
  margin-left: 10px;
  padding: 10px 15px;
  font-size: 14px;
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
</style>
