<template>
  <Header />
  <div class="form-container">
<img v-if="photo" :src="`/src/assets/images/uploads/${photo}`" alt="Captured Photo" style="width:350px; height: 350px;"/>
    <p class="form-title">차량번호</p>
    <input type="text" class="form-input" placeholder="차량번호 입력" v-model="reportCarNumber" />
    <p class="form-title">주차면번호</p>
    <input type="text" class="form-input" placeholder="주차면번호 입력" v-model="rpzNum" />
    <button class="submit-button" @click="submitReport()">신고하기</button>
  </div>
</template>

<script setup>
import Header from "@/components/Header.vue";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const reportCarNumber = ref("");
const rpzNum = ref("");
const photo = ref(route.query.photo || null);
const currentLat = ref(null); // 현재 위도
const currentLon = ref(null); // 현재 경도
const router = useRouter();

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
      reportImage: photo.value ? photo.value.replace("http://172.168.10.93:8080/upload/", "") : "", // 사진 URL을 사용

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

.form-title {
  width: 100%;
  text-align: left;
  font-size: 16px;
  margin-bottom: 5px;
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
</style>