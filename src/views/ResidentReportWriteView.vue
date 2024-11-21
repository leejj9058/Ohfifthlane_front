<template>
  <Header />
  <div class="form-container">
     <!-- 큰 제목: 불법주차 신고하기 -->
     <h2 class="title-main text-center mb-2">부정주차 신고하기</h2>
  
  <!-- 작은 제목: 장애인 전용구역 -->
  <h5 class="title-sub text-center mb-5">거주자 우선 주차구역</h5>
  <p class="form-title"><strong><i class="bi bi-image me-2 text-primary"></i>사진</strong></p>

<img v-if="photo" :src="`/src/assets/images/uploads/${photo}`" alt="Captured Photo" style="width:350px; height: 350px;"/>
    <p class="form-title"><strong><i class="bi bi-car-front me-2 text-primary"></i>차량번호</strong></p>
    <input type="text" class="form-input" placeholder="차량번호 입력" v-model="reportCarNumber" />
    <p class="form-title"><strong><i class="bi bi-house-door me-2 text-primary"></i>거주자 주차 구획 번호</strong></p>
    <input type="text" class="form-input" placeholder="주차면번호를 입력하세요. 예 : 11305-00-00" v-model="rpzNum" />
    <!-- 신고 내용 공유 동의 체크박스 -->
    <div class="form-check mb-3 text-start">
          <input
            type="checkbox"                   
            id="agreeCheckbox"
            v-model="isAgreed"
            class="form-check-input"
          />
          <label class="form-check-label" for="agreeCheckbox">
            신고 내용 공유에 동의합니다.
          </label>
        </div>
        <div class="button-container d-flex justify-content-between" style="width: 100%;">
  <!-- 신고하기 버튼 -->
  <button
    type="submit"
    class="btn btn-primary"
    :style="{ width: '48%' }"
    :disabled="!isAgreed"
    @click="submitReport"
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
</template>

<script setup>
import Header from "@/components/Header.vue";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const reportCarNumber = ref("");
const rpzNum = ref(route.query.rpzNum || "");
const photo = ref(route.query.photo || null);
const currentLat = ref(null); // 현재 위도
const currentLon = ref(null); // 현재 경도
const router = useRouter();
const isAgreed = ref(false);

// 파이썬 서버로 사진을 보내서 번호판 인식된 값 받아오는 메서드
const sendImageUrl = async () => {
  try {
    // Flask 서버에 GET 요청 보내기
    const response = await axios.get("/ai/detect_plate", {
      params: {
        image_url: `https://172.168.10.73:5173/src/assets/images/uploads/${photo.value}`,
      },
    });
    console.log(response.data);

    // Flask 서버에서 반환된 JSON 결과 처리
    if (response.data.plates) {
      // 숫자가 포함된 문자열만 필터링
      const platesWithNumbers = response.data.plates.filter(plate => /\d/.test(plate));
      
      if (platesWithNumbers.length === 0) {
        reportCarNumber.value = "차량번호를 찾을 수 없습니다.";
        return;
      }

      // 빈도를 세기 위한 객체 생성
      const plateCounts = platesWithNumbers.reduce((acc, plate) => {
        acc[plate] = (acc[plate] || 0) + 1;
        return acc;
      }, {});

      // 가장 빈도가 높은 번호판 찾기
      let mostFrequentPlate = "";
      let maxCount = 0;

      for (const [plate, count] of Object.entries(plateCounts)) {
        if (count > maxCount) {
          mostFrequentPlate = plate;
          maxCount = count;
        }
      }

      // reportCarNumber에 가장 빈도가 높은 번호판을 설정
      reportCarNumber.value = mostFrequentPlate;

    } else if (response.data.error) {
      reportCarNumber.value = `오류: ${response.data.error}`;
    } else {
      reportCarNumber.value = "결과를 찾을 수 없습니다.";
    }
  } catch (error) {
    console.error("번호판 인식 요청 중 오류 발생:", error);
    reportCarNumber.value = "오류 발생: 결과를 가져오지 못했습니다.";
  }
};

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
  if (!reportCarNumber.value || !rpzNum.value) {
    alert("모든 항목을 입력해주세요.");
    return;
  }

  try {
  const response = await axios.post("/api/report", {
    report: {
      reportCarNumber: reportCarNumber.value,
      reportImage: photo.value ? photo.value.replace("http://172.168.10.11:8080/upload/", "") : "", // 사진 URL을 사용

      reportLat: currentLat.value, // 현재 위도
      reportLon: currentLon.value, // 현재 경도
    },
    rpz: {
      rpzNum: rpzNum.value,
    },
  });

  console.log(response); // 서버 응답 확인
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
  sendImageUrl();
  getCurrentLocation(); // 컴포넌트가 마운트되면 현재 위치 가져오기
});
</script>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background-color: #f9f9f9;
  width: 100%;
  max-width: 400px;
  margin: 30px auto;
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}
.title-main {
    font-size: 25px;
    font-weight: bold;
    color: #333;
    margin-bottom: px;
  }

.form-title {
  width: 100%;
  text-align: left;
  font-size: 16px;
  margin-bottom: 5px;
}
.title-sub {
    font-size: 15px;
    font-weight: bold;
    color: #003366;
    margin-top: 0;
  }

.form-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.submit-button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  max-width: 300px;
}
.btn-secondary {
    background-color: #6c757d;
    border-color: #6c757d;
}
.form-check {
  text-align: left; /* 컨테이너 왼쪽 정렬 */
  width: 100%; /* 가로 전체 사용 */
}

.form-check-input,
.form-check-label {
  display: inline-block; /* 체크박스와 라벨을 같은 줄에 배치 */
  vertical-align: middle; /* 높이 정렬 */
}

.form-check-label {
  margin-left: 5px; /* 체크박스와 라벨 사이 간격 */
}

@media (max-width: 360px) {
  .form-container {
  max-width: 350px;
  }


}

</style>