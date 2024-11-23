<template>
  <div class="container-fluid d-flex flex-column align-items-center">
    <div class="search-wrapper mt-0">
      <h2 class="title">주변 가까운 주차장</h2>
      <!-- 지도 표시 -->
      <div class="map-container">
        <div id="map" style="width: 100%; height: 300px;"></div>
      </div>

      <!-- 검색 결과 리스트 -->
      <div v-if="listItems.length > 0" class="list">
        <div v-for="(item, index) in listItems" :key="index" class="list-item" @click="goToMap(item)"> <!-- 지도에 마커 띄우기 -->
          <div class="clickable-item d-flex justify-content-between align-items-center">
            <div>
              <strong v-html="item.rpzNum"></strong><br />
              <span>{{ item.rpzAddress }}</span>
              <span>{{ item.rpzFee }}</span>
              <span>{{ item.rpzDistance }}</span>
            </div>
            <i class="bi bi-geo-alt text-primary" style="font-size: 1.5rem; cursor: pointer;"
              @click="openConfirmModal(item)"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- 홈으로 가기-->
    <div class="button-group">
      
      <button class="btn btn-cancel" @click="goToHome">홈 화면 가기</button>
    </div>

    <!-- 확인 모달 -->
    <!-- 목적지 선택 확인 모달 -->
    <div v-if="showConfirmModal" class="modal-overlay">
      <div class="modal-content">
        <p>해당 주차장을 예약하시겠습니까?</p>
        <div class="button-group">
          <button class="btn btn-confirm" @click="moveToMap(selectedItem)">확인</button>
          <button class="btn btn-cancel" @click="showConfirmModal = false">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { toast } from 'vue3-toastify';
import axios from 'axios';

const listItems = ref([]); // 주차장 검색 결과 리스트
const map = ref(null); // Kakao 지도 객체
const KAKAO_MAP_KEY = "a803ff1d149711eb074e8b95dadeab12"; // Kakao Map API 키
const router = useRouter();
const route = useRoute();
const showConfirmModal = ref(false);
const selectedItem = ref(null);

const myPosition = ref({ lat: null, lng: null }); // 내 위치 좌표

//------------------------------------------------함수--------------------------------------------------------------------


// 현재 위치 초기화 및 fallback 설정
onMounted(() => {
  const script = document.createElement("script");
  script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&autoload=false`;
  document.head.appendChild(script);

  // 이전 주차장 좌표 받아오기
  myPosition.value = route.query;

  console.log('My position: ', myPosition.value);

  script.onload = () => {
    console.log("Kakao Map script loaded successfully.");
    // 파라미터로 이전 주차장 좌표가 넘어왔을 때
    if (myPosition.value && myPosition.value.lat && myPosition.value.lng) {
      initializeMap(myPosition.value.lat, myPosition.value.lng);
    }
    // 파라미터로 넘어오지 않았을 때
    else {
      const defaultLat = 37.566774;
      const defaultLng = 126.978414;
      initializeMap(defaultLat, defaultLng);
    }

  };

  script.onerror = () => {
    console.error("Failed to load Kakao Map script. Check your API key and network.");
  };
  console.log('My WWWW: ', myPosition.value);
  // 주차장 리스트 가져오기
  getRecommendRPZList();

});

// 지도 초기화
const initializeMap = (lat, lng) => {
  console.log("Initializing map with lat:", lat, "lng:", lng);  // 초기화 시 출력 로그 추가
  nextTick(() => {
    const mapContainer = document.getElementById("map");
    if (!mapContainer) {
      console.error("Map container not found");
      return;
    }

    const mapOption = {
      center: new window.kakao.maps.LatLng(lat, lng),
      level: 5,
    };

    map.value = new window.kakao.maps.Map(mapContainer, mapOption);
    console.log("Map initialized successfully.");
  });
};

let currentMarker = null;

//거주자 우선 주차 5개 리스트 가져오기
const getRecommendRPZList = async () => {
  try {
    console.log(recentTime());

    const response = await axios.post('/api/getRecommendRPZList', {
      userLocationVo: {
        userLon: myPosition.value.lng,
        userLat: myPosition.value.lat,
      },
      reservationVo: {
        reservationStartTime: recentTime(),
        reservationEndTime: recentTimePlusFortyMinutes(),
        reservationDay: recentDate(),
      },
    });
    console.log("API response data:", response.data); // 확인을 위해 로그 추가
    listItems.value = response.data;

    console.log('listItems: ', listItems.value);

  } catch (error) {
    noParkingLotToast();
    console.error('주차장 리스트를 찾을 수 없습니다:', error);
  }
};

// 마커 추가
const addMarker = (lat, lng) => {
  if (!map.value) {
    console.warn("지도 객체가 아직 초기화되지 않았습니다.");
    return;
  }

  if (currentMarker) {
    currentMarker.setMap(null);
  }

  const position = new window.kakao.maps.LatLng(lat, lng);
  currentMarker = new window.kakao.maps.Marker({
    position: position,
    map: map.value,
  });

  console.log("Marker added at:", lat, lng);
};

// 주차장 정보 클릭 시 지도 이동
const goToMap = (item) => {
  if (!item || (!item.rpzLon && !item.rpzLat)) { // 수정필요
    console.warn("유효한 좌표가 없습니다:", item);
    return;
  }

  const lat = item.rpzLat || item.lat;
  const lng = item.rpzLon || item.lng;

  updateMap(lat, lng);
  addMarker(lat, lng);
};

// 모달 열기
const openConfirmModal = (item) => {
  selectedItem.value = item;
  console.log(selectedItem);
  showConfirmModal.value = true;
};

// 모달 확인 버튼 클릭 시 이동
const moveToMap = (item) => {
  if (!item || (!item.rpzLon && !item.rpzLat)) { // 수정필요
    console.warn("유효한 좌표가 없습니다:", item);
    return;
  }

  router.push({
    path: '/reservation',
    query: {
      rpzId: item.rpzId
    }
  });

  showConfirmModal.value = false;
};

// 지도 중심 업데이트
const updateMap = (lat, lng) => {
  if (!map.value) {
    console.warn("지도 객체가 아직 초기화되지 않았습니다.");
    return;
  }

  const position = new window.kakao.maps.LatLng(lat, lng);
  map.value.setCenter(position);
  console.log("Map center updated to:", lat, lng);
};

//주차장 없을때 토스트 출력
const noParkingLotToast = () => {
  toast("주차장이 없습니다. (╥﹏╥)", {
    autoClose: 3000,
  });
};

// 홈으로 가기
const goToHome = () => {
  router.push('/');
}

// 현재 날짜 구하기
const recentDate = () => {
  const now = new Date();
  const today = now.getDay();
  return today;
}

// 현재 시간 구하기
const recentTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const currentTime = `${hours}:${minutes}`;
  return currentTime;
}

// 현재 시간 + 40분 구하기
const recentTimePlusFortyMinutes = () => {
  const now = new Date();
  const thirtyMinutesLater = new Date(now.getTime() + 40 * 60000); // 40분 후
  const laterHours = thirtyMinutesLater.getHours().toString().padStart(2, '0');
  const laterMinutes = thirtyMinutesLater.getMinutes().toString().padStart(2, '0');
  const laterTime = `${laterHours}:${laterMinutes}`;

  return laterTime;
}
</script>

<style scoped>
.container-fluid {
  overflow-x: hidden;
  padding: 0;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 20px;
  color: #333;
  text-align: center;
}

.search-wrapper {
  margin-top: 20px;
}

.map-container {
  height: 300px;
  margin-top: 20px;
  border: 1px solid rgb(204, 192, 192);
  border-radius: 8px;
}

#map {
  width: 100%;
  height: 400px;
}

.search-wrapper {
  border: 1px solid #ccc;
  min-height: 50vh;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 650px;
}

/* 화면 크기가 768px 이하일 때 */
@media (max-width: 768px) {
  .search-wrapper {
    max-width: 100%;
    padding: 15px;
  }
}

/* 화면 크기가 576px 이하일 때 */
@media (max-width: 360px) {
  .search-wrapper {
    padding: 10px;
  }

  .container-fluid {
    padding: 0;
  }
}

/* placeholder 색상 조정 */
::placeholder {
  color: #888;
}

/* 포커스 시 입력 스타일 */
input:focus {
  outline: none;
  box-shadow: none;
}

.clickable-item {
  cursor: pointer;
  transition: background-color 0.3s;
}

/* 주차장 리스트 항목 스타일 */
.list {
  display: block;
  /* 한 줄에 하나씩 표시 */
  margin-top: 20px;
}

.list-item {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  margin-bottom: 10px;
  /* 항목 사이 간격 */
}

.list-item:hover {
  background-color: #e3e3e3;
}



.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background-color: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 90%;
  max-width: 400px;
}

.modal-content p {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.button-group {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.btn {
  width: 100%;
  padding: 10px 15px;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-confirm {
  background-color: #93b0ff;
  /* 연파랑 */
  color: white;
}

.btn-confirm:hover {
  background-color: #5b87ff;
  /* 살짝 어두운 연파랑 */
}

.btn-cancel {
  background-color: #d3d3d3;
  /* 연회색 */
  color: #333;
}

.btn-cancel:hover {
  background-color: #c0c0c0;
  /* 살짝 어두운 연회색 */
}
</style>