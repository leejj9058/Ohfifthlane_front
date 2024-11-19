<template>
    <div class="container-fluid d-flex flex-column align-items-center justify-content-center">
      <!-- 큰 제목: 불법주차 신고하기 -->
      <h2 class="title-main text-center mb-2">불법주차 신고하기</h2>
  
      <!-- 작은 제목: 장애인 전용구역 -->
      <h2 class="title-sub text-center mb-5">장애인 전용구역</h2>
  
      <!-- 신고 폼 -->
      <form @submit.prevent="submitReport" class="w-100">
        <!-- 발생 지역 입력과 위치 찾기 버튼을 한 줄에 배치 -->
        <div class="d-flex align-items-center mb-3 w-100">
          <!-- 발생 지역 아이콘 -->
          <i class="bi bi-geo-alt-fill me-2 text-primary"></i>
          <!-- 발생 지역 텍스트 왼쪽 정렬 -->
          <label for="disabledPersonReportAddres" class="form-label me-2 text-start w-100">위치</label>
  
          <!-- 위치 찾기 버튼 (전체 너비로 확장) -->
          <button
            type="button"
            class="btn btn-outline-primary w-50 ms-auto"
            @click="findLocation"
          >
            위치 찾기
          </button>
        </div>
  
        <!-- 발생 지역 입력 칸 -->
        <input
          type="text"
          id="disabledPersonReportAddres"
          class="form-control mb-3"
          v-model="disabledPersonReportAddres"
          required
          placeholder="예: 서울 강남구 삼성동"
        />
  
        <!-- 사진 등록 섹션 -->
        <div class="d-flex align-items-center mb-3">
          <!-- 사진 아이콘 -->
          <i class="bi bi-camera-fill me-2 text-primary"></i>
          <!-- 사진 등록하기 텍스트 왼쪽 정렬 -->
          <label for="photoUpload" class="form-label mb-0 text-start">사진 등록하기</label>
  
          <!-- 사진 촬영하기 버튼 (오른쪽) -->
          <button
            type="button"
            class="btn btn-outline-primary btn-small ms-auto"
            @click="takePhoto"
          >
            촬영하기
          </button>
        </div>
  
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
  
        <!-- 신고 내용 입력 -->
        <div class="mb-3">
          <!-- 신고 내용 아이콘 -->
          <i class="bi bi-pencil-fill me-2 text-primary"></i>
          <label for="disabledPersonReportContent" class="form-label">신고 내용</label>
          <textarea
            id="disabledPersonReportContent"
            class="form-control"
            v-model="disabledPersonReportContent"
            rows="4"
            required
            placeholder="장애인 전용구역 불법주차 신고입니다."
          ></textarea>
        </div>
  
        <!-- 추가 입력칸 (예: 신고자 연락처) -->
        <div class="d-flex flex-column mb-3">
          <!-- 연락처 아이콘 -->
          <div class="d-flex align-items-center">
            <i class="bi bi-telephone-fill me-2 text-primary"></i>
            <!-- 연락처 텍스트 아이콘 바로 옆에 배치 -->
            <label for="userTel" class="form-label mb-0">연락처</label>
          </div>
          <input
            type="text"
            id="userTel"
            class="form-control"
            v-model="userTel"
            required
            placeholder="예: 010-1234-5678"
          />
        </div>
  
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
            :disabled="!isAgreed"
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
      </form>
    </div>
  </template>
  
  <script>
  import axios from "axios"; // axios 임포트
  
  export default {
    data() {
      return {
        disabledPersonReportAddres: '',
        userTel: '',
        disabledPersonReportContent: '',
        disabledPersonReportCarNumber: '',
        isAgreed: false,
      };
    },
    methods: {
      // 신고 데이터 전송
      submitReport() {
        // 폼 데이터 확인
        if (this.disabledPersonReportAddres && this.disabledPersonReportContent && this.disabledPersonReportCarNumber && this.userTel) {
          const reportData = {
            disabledPersonReportAddres: this.disabledPersonReportAddres,
            userTel: this.userTel,
            disabledPersonReportContent: this.disabledPersonReportContent,
            disabledPersonReportCarNumber: this.disabledPersonReportCarNumber,
          };
  
          // axios를 사용하여 POST 요청
          axios
            .post('https://your-api-endpoint.com/report', reportData)
            .then(response => {
              alert("신고가 접수되었습니다.");
              this.resetForm(); // 폼 초기화
            })
            .catch(error => {
              console.error("Error during submission:", error);
              alert("신고 전송에 실패했습니다. 다시 시도해주세요.");
            });
        } else {
          alert("모든 필드를 입력해주세요.");
        }
      },
  
      // 폼 초기화
      resetForm() {
        this.disabledPersonReportAddres = '';
        this.disabledPersonReportContent = '';
        this.isAgreed = false;
        this.userTel = '';
        this.disabledPersonReportCarNumber = '';
      },
  
      // 사진 촬영 기능 (예시)
      takePhoto() {
        alert("사진 촬영 기능을 구현하세요.");
      },
  
      // 위치 찾기 기능 (예시)
      findLocation() {
        this.disabledPersonReportAddres = "서울 강남구 삼성동";
      },
    },
  };
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
  