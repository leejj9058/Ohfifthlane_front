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
import axios from 'axios';
import { useRouter } from 'vue-router';
import CryptoJS from "crypto-js";

const router = useRouter();
// 기본 상태값들 정의
const qrCodeImageRef = ref(qrCodeImage);
const scanning = ref(false);
const result = ref('');
// 비밀 키와 IV 설정 (Python 코드와 동일한 값 사용)
const secretKey = CryptoJS.enc.Utf8.parse("452fc981217ab2b2");
const iv = CryptoJS.enc.Utf8.parse("956914c27b3f7490");

// 이벤트 핸들러
function onDetect(detectedCodes) {
  result.value = detectedCodes.map((code) => code.rawValue).join(', ');
  const encryptedDataB64 = result.value; // 실제 QR 코드에서 얻은 데이터
  alert(`QR 코드가 인식되었습니다: ${result.value}`);
  //scanning.value = false;
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
  alert(result.value);

  // QR 코드에서 읽은 데이터를 사용
  const encryptedDataB64 = result.value; // onDetect에서 설정한 QR 데이터

  try {
    // URL-safe Base64 디코딩
    const encryptedData = CryptoJS.enc.Base64.parse(encryptedDataB64.replace(/-/g, '+').replace(/_/g, '/'));

    // AES 복호화
    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: encryptedData },
      secretKey,
      { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
    );

    // 복호화된 JSON 문자열
    const jsonData = decrypted.toString(CryptoJS.enc.Utf8);

    // JSON 파싱
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
  position: fixed;
  top: 0;
  left: 0;
  width: 100%; /* Full width to prevent overflow */

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

.scanner-cancel-button {
  background-color: white;
  color: black;
}

.scanner-next-button {
  background-color: green;
  color: white;
}

.scanner-cancel-button {
  background-color: white;
  color: black;
}

.scanner-next-button {
  margin-top: 20px;
  background-color: green; /* Customize color */
  color: white;
}
</style>
