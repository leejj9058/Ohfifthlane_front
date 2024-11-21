<template>
  <Header></Header>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
  <div class="container-fluid">
    <div class="qr-tutorial-container" v-if="!scanning">
      <div class="qr-modal">
        <button class="qr-back-button" @click="goBack">
          <i class="fas fa-arrow-left"></i> <!-- FontAwesome 아이콘 추가 -->
        </button>
        <p class="qr-title">
  장애인 주차 표지 내<br />
  <span class="qr-blue-text">QR코드를 인식</span>해 주세요.
</p>
        <div class="qr-container">
          <img :src="qrCodeImage" alt="QR 코드" class="qr-code" />
        </div>
        <button class="qr-report-button" @click="startScanning">QR코드 인식하기</button>
        <p class="qr-content">
          <i class="bi bi-exclamation-triangle" style="font-size: 20px; margin-right: 0px; color: orange;"></i>
          장애인 주차 표지가 없을 경우,<br />
          아래 버튼을 눌러 촬영 후 신고해 주세요.
        </p>
        <button class="qr-report-button2" @click="startCamera">촬영하기</button>
      </div>
    </div>
  

    <div v-else class="scanner-container">
      <!-- 간단한 QR 코드 인식 카메라 뷰 -->
      <qrcode-stream
        :constraints="{ facingMode: 'environment' }"
        :formats="['qr_code']"
        @detect="onDetect"
        @init="onInit"
        @error="onError"
      />
      <button class="scanner-cancel-button" @click="stopScanning">취소</button>
      <button class="scanner-next-button" @click="goToNextStep">다음으로</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Header from '@/components/Header.vue';
import { QrcodeStream } from 'vue-qrcode-reader';
import qrCodeImage from '@/assets/images/qr-code.png';
import { useRouter } from 'vue-router';
import CryptoJS from "crypto-js";

const router = useRouter();
const qrCodeImageRef = ref(qrCodeImage);
const scanning = ref(false);
const result = ref('');
const secretKey = CryptoJS.enc.Utf8.parse("452fc981217ab2b2");
const iv = CryptoJS.enc.Utf8.parse("956914c27b3f7490");

function onDetect(detectedCodes) {
  result.value = detectedCodes.map((code) => code.rawValue).join(', ');
  const encryptedDataB64 = result.value;
  alert(`QR 코드가 인식되었습니다`);
}

function onInit(promise) {
  promise
    .then(() => {
      console.log("카메라 접근 성공");
    })
    .catch((err) => {
      console.error("카메라 접근 오류:", err);
      alert("카메라에 접근할 수 없습니다.");
      scanning.value = false;
    });
}

function onError(err) {
  console.error("QR 코드 리더 오류:", err);
  alert("QR 코드 리더 초기화 중 오류가 발생했습니다.");
}

const goBack = () => {
  window.history.back();
};

const startScanning = () => {
  scanning.value = true;
};

const stopScanning = () => {
  scanning.value = false;
};


const goToNextStep = async () => {
  
  const encryptedDataB64 = result.value;

  try {
    const encryptedData = CryptoJS.enc.Base64.parse(encryptedDataB64.replace(/-/g, '+').replace(/_/g, '/'));
    const decrypted = CryptoJS.AES.decrypt({ ciphertext: encryptedData }, secretKey, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    const jsonData = decrypted.toString(CryptoJS.enc.Utf8);
    const data = JSON.parse(jsonData);
    console.log("Decrypted Data:", data);
    router.push({ path: "/qrcodereport", query: {
      disabledPersonCarNum: data.disabledPersonCarNum,
      issueDate: data.issueDate,
    }, });
  } catch (error) {
    console.error("복호화 또는 JSON 파싱 중 에러 발생:", error);
  }
};

// 촬영하기 버튼 클릭 시 호출되는 함수
const startCamera = () => {
  // disabledPersonReportCamera 페이지로 이동
  router.push({ path: '/disabledPersonReportCamera' });
};
</script>

<style scoped>
/* Body and container styles */
.container-fluid {
  padding-top: 30px;
  overflow-x: hidden;
  max-width: 460px;
  margin: 0 auto;
  
}

/* QR Tutorial Modal */
.qr-tutorial-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}

.qr-modal {
  position: relative;
  background-color: #fff;
  width: 100%;
  max-width: 420px;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  transition: transform 0.3s ease-in-out;
}

.qr-back-button {
  position: absolute;
  top: 15px;
  left: 15px;
  background: none;
  border: none;
  font-size: 22px;
  color: #555;
  cursor: pointer;
  transition: color 0.3s;
}

.qr-back-button i {
  font-size: 22px;
}

.qr-back-button:hover {
  color: #ff6347; /* Hover effect */
}

.qr-title {
  font-size: 22px; /* 글씨 크기 키움 */
  font-weight: bold;
  color: #333;
  line-height: 1.2; /* 줄 간격 줄임 */
  margin-bottom: 15px;
}

.qr-code {
  width: 180px;
  height: 180px;
  margin-bottom: 10px; /* 이미지와 텍스트 사이 간격 줄임 */
}

.qr-report-button {
  background: linear-gradient(135deg, #007bff, #0056b3); /* 파란색 계열 */
  color: white;
  padding: 12px 25px;
  border: none;
  border-radius: 50px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  margin-bottom: 20px;
}

.qr-report-button2 {
  background: rgb(235, 205, 95); /* 배경색은 회색 */
  color: rgb(0, 0, 0);
  padding: 4px 20px;
  border: 2px solid orange; /* 오렌지 색 테두리 */
  border-radius: 50px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.qr-report-button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

/* QR Scanner */
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
  margin-top: 15px;
  padding: 12px 0;
  font-size: 16px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.scanner-cancel-button {
  background-color: #fff;
  color: black;
}

.scanner-next-button {
  background-color: #4CAF50;
  color: white;
}

.scanner-cancel-button:hover,
.scanner-next-button:hover {
  transform: scale(1.05);
}

.scanner-cancel-button {
  background-color: #fff;
  color: #333;
}

.scanner-next-button {
  background-color: #28a745;
  color: white;
}

.qr-blue-text {
  color: #fe5950; /* 파란색 텍스트 */
}

@media (max-width: 460px) {
 
  .qr-modal {
    width: 100%; /* 화면의 95% 너비 */
    padding: 15px; /* 내부 여백 축소 */
  }

  .qr-title {
    font-size: 16px; /* 제목 글씨 크기 더 축소 */
    line-height: 1.4;
  }

  .qr-code {
    width: 120px; /* QR 코드 이미지 크기 더 축소 */
    height: 120px;
  }

  .qr-report-button {
    font-size: 14px; /* 버튼 글씨 크기 더 축소 */
    padding: 8px 16px;
  }

  /* 스캐너 컨테이너 */
  .scanner-container {
    padding: 15px; /* 스캐너 내부 여백 추가 */
    max-width: 100%; /* 전체 너비로 확장 */
  }

  .scanner-cancel-button,
  .scanner-next-button {
    max-width: 90%; /* 버튼 너비를 화면의 90%로 설정 */
    font-size: 14px; /* 버튼 글씨 크기 축소 */
    padding: 10px 15px; /* 버튼 크기 축소 */
  }
}

</style>
