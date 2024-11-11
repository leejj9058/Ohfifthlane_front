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
  getCurrentLocation(); // 컴포넌트가 마운트되면 현재 위치 가져오기
});
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