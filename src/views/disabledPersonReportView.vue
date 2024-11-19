<template>
    <div class="container-fluid d-flex flex-column align-items-center justify-content-center">
      <!-- 큰 제목: 불법주차 신고하기 -->
      <h2 class="title-main text-center mb-2">불법주차 신고하기</h2>
      <!-- 작은 제목: 장애인 전용구역 -->
      <h2 class="title-sub text-center mb-5">장애인 전용구역</h2>
  
      <!-- 신고 폼 -->
      <div class="w-100">
        <!-- 차량 사진 -->
        <img v-if="photo" :src="`/src/assets/images/uploads/${photo}`" alt="Captured Photo" style="width:300px; height: 300px;"/>
  
        <!-- 차량 번호 입력 -->
        <div class="d-flex align-items-center mb-3">
          <!-- 차량 번호 아이콘 -->
          <i class="bi bi-car-front me-2 text-primary"></i>
          <!-- 차량 번호 텍스트 왼쪽 정렬 -->
          <label for="disabledPersonReportCarNumber" class="form-label mb-0">차량 번호</label>
        </div>
  
        <!-- 차량 번호 입력 칸 -->
        <input
          type="text"
          id="disabledPersonReportCarNumber"
          class="form-control mb-3"
          v-model="disabledPersonReportCarNumber"
          required
          placeholder="차량 번호를 입력하세요. 예: 12가 3456"
        />
  
        <!-- 신고 내용 공유 동의 체크박스 -->
        <div class="form-check mb-3">
          <input
            type="checkbox"
            id="agreeCheckbox"
            v-model="isAgreed"
            class="form-check-input"
          />
          <label class="form-check-label mb-2" for="agreeCheckbox">
            신고 내용 공유에 동의합니다.
          </label>
        </div>
  
        <!-- 신고하기 버튼과 닫기 버튼 -->
        <div class="button-container d-flex justify-content-between">
          <!-- 신고하기 버튼 -->
          <button
            type="submit"
            class="btn btn-primary"
            :style="{ width: '48%' }"
            :disabled="!isAgreed || !disabledPersonReportCarNumber" @click="submitReport"
          >
            신고하기
          </button>
  
          <!-- 닫기 버튼 -->
          <button
            type="button"
            class="btn btn-secondary"
            :style="{ width: '48%' }"
            @click="resetForm"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const photo = ref(route.query.photo || null);
const disabledPersonReportCarNumber = ref("");
const currentLat = ref(null); // 현재 위도
const currentLon = ref(null); // 현재 경도
const isAgreed = ref(false);


// 현재위치가져오기
const getCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      currentLat.value = position.coords.latitude;
      currentLon.value = position.coords.longitude;
    }, (error) => {
      console.error("위치 정보 가져오기 실패:", error);
      alert("위치 정보를 가져오는 데 실패했습니다.");
    });
  } else {
    alert("현재 브라우저는 위치 정보를 지원하지 않습니다.");
  }
}


const submitReport = async () => {
  try {
    if (!disabledPersonReportCarNumber.value) {
      alert("차량 번호를 입력하세요.");
      return;
    }

    const response = await axios.post("/api/disabledPersonReport", {
      
        disabledPersonReportCarNumber: disabledPersonReportCarNumber.value,
        disabledPersonReportImage: photo.value,
        disabledPersonReportLat: currentLat.value,
        disabledPersonReportLon: currentLon.value,
      
    });

    console.log('response:', response);

    if (response.status === 200) {
      alert("신고 접수 되었습니다.");
      router.push('/'); // 메인 페이지로 리다이렉트
    } else {
      console.error('Unexpected response status:', response.status);
      alert("서버 응답 오류 발생: " + response.status);
    }
  } catch (error) {
    console.error('Error occurred during report submission:', error);
    alert("신고 중 오류가 발생했습니다. 다시 시도해 주세요.");
  }
};

// 닫기 버튼 클릭 시 이전 페이지로 돌아가기
const resetForm = () => {
  router.back(); // 이전 페이지로 돌아감
};

onMounted(() => {
  if (photo.value) {
    console.log("Captured photo received:", photo.value);
  }
  getCurrentLocation(); // 컴포넌트가 마운트되면 현재 위치 가져오기
});


</script>

  
  <style scoped>
  .container-fluid {
    padding-top: 20px;
    padding-bottom: 20px;
    width: 100%;
    max-width: 460px;
    border-radius: 15px;
    height: 100vh;
    margin: 0 auto;
    background-color: #f8f9fa;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .title-main {
    font-size: 36px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
  }
  
  .title-sub {
    font-size: 28px;
    font-weight: bold;
    color: #003366;
    margin-top: 0;
  }
  
  .form-label {
    font-weight: 600;
    font-size: 16px;
    color: #333;
  }
  
  input,
  textarea {
    border-radius: 8px;
    padding: 10px;
  }
  
  textarea {
    resize: none;
  }
  
  button {
    font-weight: 600;
    padding: 12px;
    border-radius: 8px;
    font-size: 16px;
  }
  
  button:hover {
    cursor: pointer;
  }
  
  button-container {
    display: flex;
    justify-content: space-between;
  }
  
  .btn-secondary {
    background-color: #6c757d;
    border-color: #6c757d;
  }
  
  .btn-secondary:hover {
    background-color: #5a6268;
    border-color: #545b62;
  }
  
  .form-check-label {
    font-size: 14px;
    color: #333;
  }
  
  .btn-outline-primary {
    font-weight: bold;
    padding: 8px;
    border-radius: 8px;
  }
  
  .btn-outline-primary:hover {
    background-color: #007bff;
    color: #fff;
  }
  </style>
  