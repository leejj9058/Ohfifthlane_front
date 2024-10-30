<template>
  <Header></Header>
  <div class="qr-tutorial-container" v-if="!scanning">
    <div class="qr-modal">
      <button class="qr-back-button" @click="goBack">←</button>
      <p class="qr-title">다음과 같이 장애인표지의 QR을 찍어주세요</p>
      <div class="qr-container">
        <img :src="qrCodeImage" alt="QR 코드" class="qr-code" />
      </div>
      <button class="qr-report-button" @click="startScanning">QR찍기</button>
    </div>
  </div>
  
  <div v-else class="scanner-container">
    <qrcode-stream @decode="onDecode" @init="onInit" />
    <button class="scanner-cancel-button" @click="stopScanning">취소</button>
    <button class="scanner-next-button" @click="goToNextStep">다음으로</button> 
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
    // Define reactive references
    const qrCodeImageRef = ref(qrCodeImage);
    const scanning = ref(false);
    const decodedContent = ref("");

    // Define methods
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
    };
  },
};
</script>

<style scoped>
.qr-tutorial-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Full height of the viewport */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%; /* Full width to prevent overflow */

}

.qr-modal {
  position: relative;
  background-color: white;
  width: 400px; /* Modal width */
  padding: 30px; /* Increase padding */
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3); /* Slightly stronger shadow */
  text-align: center;
  max-height: 80vh; /* Prevent modal from exceeding viewport height */
  overflow-y: auto; /* Allow scrolling if content exceeds height */
}

.qr-back-button {
  position: absolute; /* Use absolute positioning */
  top: 15px; /* Adjust as needed */
  left: 15px; /* Adjust as needed */
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}


.qr-title {
  font-size: 24px; /* Increase title font size */
  margin-bottom: 20px;
}

.qr-code {
  width: 200px; /* Increase QR code size */
  height: 200px; /* Increase QR code size */
}

.qr-report-button {
  background-color: red;
  color: white;
  padding: 15px 30px; /* Increase padding for button */
  border: none;
  border-radius: 5px;
  font-size: 18px; /* Increase font size */
  cursor: pointer;
}

/* Other styles remain unchanged */


.scanner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  background-color: black;
}

.scanner-cancel-button {
  margin-top: 20px;
  background-color: white;
  color: black;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.scanner-next-button { /* New style for the Next button */
  margin-top: 20px;
  background-color: green; /* Customize color */
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}
</style>
