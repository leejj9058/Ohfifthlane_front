<template>
  <Header></Header>
  <div class="container-fluid">
  <div class="qr-tutorial-container" v-if="!scanning">
    <div class="qr-modal">
      <button class="qr-back-button" @click="goBack">←</button>
      <p class="qr-title">장애인표지의 QR을 찍어주세요</p>
      <div class="qr-container">
        <img :src="qrCodeImage" alt="QR 코드" class="qr-code" />
      </div>
      <button class="qr-report-button" @click="startScanning">신고하기</button>
      <p class="no-qr-text">*장애인표지가 없나요?*</p>
      <button class="report-safety-button" @click="goToSafetySite">안전신문고로 신고하기</button>
    </div>
  </div>
  
  <div v-else class="scanner-container">
    <qrcode-stream @decode="onDecode" @init="onInit" />
    <button class="scanner-cancel-button" @click="stopScanning">취소</button>
    <button class="scanner-next-button" @click="goToNextStep">다음으로</button> 
  </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import Header from '@/components/Header.vue';
import { QrcodeStream } from 'vue-qrcode-reader';
import qrCodeImage from '@/assets/images/qr-code.png';
import axios from 'axios';

export default {
  components: {
    Header,
    QrcodeStream,
  },
  setup() {
    const qrCodeImageRef = ref(qrCodeImage);
    const scanning = ref(false);
    const decodedContent = ref("");

    const goBack = () => {
      window.history.back();
    };

    const startScanning = () => {
      scanning.value = true;
    };

    const stopScanning = () => {
      scanning.value = false;
    };

    const onDecode = (content) => {
      decodedContent.value = content;
      alert(`QR 코드가 인식되었습니다: ${content}`);
      scanning.value = false;
    };

    const onInit = (promise) => {
      promise
        .then(() => {
          console.log("카메라 접근 성공");
        })
        .catch((error) => {
          console.error("카메라 접근 오류:", error);
          alert("카메라에 접근할 수 없습니다.");
          scanning.value = false;
        });
    };

    const goToNextStep = async () => {
      if (confirm("다음 단계로 진행하시겠습니까?")) {
        try {
          const response = await axios.post("/api/qr-data", {
            qrContent: decodedContent.value,
          });

          if (response.status === 200) {
            alert("QR 데이터가 서버에 전송되었습니다.");
            window.location.href = `/qrcodereport?vehicleNumber=${decodedContent.value}`;
          }
        } catch (error) {
          console.error("QR 데이터 전송 실패:", error);
          alert("QR 데이터 전송 중 오류가 발생했습니다.");
        }
      }
    };

    const goToSafetySite = () => {
      window.location.href = "https://www.safetyreport.go.kr"; // 안전신문고 URL
    };

    return {
      qrCodeImage: qrCodeImageRef,
      scanning,
      decodedContent,
      goBack,
      startScanning,
      stopScanning,
      onDecode,
      onInit,
      goToNextStep,
      goToSafetySite,
    };
  },
};
</script>

<style scoped>
.container-fluid {
  padding-top: 20px;
  overflow-x: hidden;
  max-width: 460px;
  margin: 0 auto;
}

.qr-tutorial-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.qr-modal {
  position: relative;
  background-color: white;
  width: 100%;
  max-width: 400px;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.qr-back-button {
  position: absolute;
  top: 15px;
  left: 15px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

.qr-title {
  font-size: 24px;
  margin-bottom: 20px;
}

.qr-code {
  width: 200px;
  height: 200px;
}

.qr-report-button {
  background-color: red;
  color: white;
  padding: 15px 30px;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  cursor: pointer;
  margin-bottom: 10px;
}

.no-qr-text {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}

.report-safety-button {
  background-color: #1e90ff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.scanner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  max-width: 460px;
  background-color: black;
  padding: 20px;
}

.scanner-cancel-button,
.scanner-next-button {
  width: 100%;
  max-width: 400px;
  margin-top: 10px;
  padding: 10px 0;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.scanner-cancel-button {
  background-color: white;
  color: black;
}

.scanner-next-button {
  background-color: green;
  color: white;
}
</style>
