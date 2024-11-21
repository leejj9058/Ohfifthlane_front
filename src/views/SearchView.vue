<template>
  <div class="container-fluid d-flex flex-column align-items-center">
    <div class="search-wrapper ">
      <div class="input-group mb-3">
        <div class="position-relative flex-grow-1">
          <span class="position-absolute" style="left: 10px; top: 50%; transform: translateY(-50%);" @click="goBack">
            <i class="bi bi-chevron-left"></i>
          </span>
          <input type="text" class="form-control" placeholder="목적지 또는 주소 검색" v-model="searchQuery"
            style="padding-right: 40px; padding-left: 30px;" />
          <span class="position-absolute search-icon" @click="sendSearchQuery">
            <i class="bi bi-search"></i>
          </span>
        </div>
      </div>

      <div v-if="!searchStarted" class="search-tip d-flex align-items-start flex-column mb-3">
        <div class="tip-text d-flex align-items-center mb-1">
          <i class="bi bi-bell-fill text-warning me-2"></i>
          <span>검색 팁!</span>
        </div>
        <div>목적지 인근 <strong>지역명</strong> 또는 <strong>지하철역</strong>으로 검색해 보세요. (예: 삼성동, 홍대입구역 등)</div>
      </div>

      <div class="no-history-wrapper" v-if="!searchStarted">
        <div class="no-history">
          <i class="bi bi-search"></i>
          <p>검색어를 입력해 주세요.</p>
        </div>
      </div>

      <div class="no-history-wrapper" v-if="searchStarted && listItems.length === 0">
        <div class="no-history">
          <i class="bi bi-search"></i>
          <p>검색 결과가 없습니다.</p>
        </div>
      </div>

      <div v-if="searchStarted && listItems.length > 0" class="map-container">
        <div id="map" style="width: 100%; height: 300px;"></div>
      </div>

      <div v-if="listItems.length > 0" class="list">
        <div v-for="(item, index) in listItems" :key="index" class="list-item m-2" @click="goToMap(item)">
          <div class="clickable-item d-flex justify-content-between align-items-center">
            <div>
              <strong v-html="item.title"></strong><br>
              <span>{{ item.address }}</span>
            </div>
            <i class="bi bi-geo-alt text-primary" style="font-size: 1.5rem; cursor: pointer;"
              @click.stop="openConfirmModal(item)"></i> <!-- 목적지 선택 확인 모달 켜기 -->
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 목적지 선택 확인 모달 -->
  <div v-if="showConfirmModal" class="modal-overlay">
    <div class="modal-content">
      <p>목적지를 선택하시겠습니까?</p>
      <button @click="moveToMap(selectedItem)">확인</button>
      <button @click="showConfirmModal = false">취소</button>
    </div>
  </div>
</template>

<script setup>import { ref, onMounted, nextTick } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const listItems = ref([]);
const searchQuery = ref('');
const searchStarted = ref(false);
const map = ref(null);
const KAKAO_MAP_KEY = 'a803ff1d149711eb074e8b95dadeab12';
const router = useRouter();
const showConfirmModal = ref(false);
const selectedItem = ref(null); // 선택된 항목을 저장할 변수 추가

//goBack 함수
const goBack = () => {
  router.go(-1);
};

const initializeMap = (lat, lng) => {
  nextTick(() => {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
      console.error('Map container not found');
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

const addMarker = (lat, lng) => {
  if (!map.value) {
    console.warn('지도 객체가 아직 초기화되지 않았습니다.');
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

const sendSearchQuery = async () => {
  if (searchQuery.value.trim() === '') {
    alert('목적지를 입력해주세요.');
    return;
  }

  searchStarted.value = true;
  console.log("Search started with query:", searchQuery.value);

  try {
    const response = await axios.get('/api/search', {
      params: { name: searchQuery.value }
    });
    console.log('API 응답:', response.data);
    listItems.value = response.data;

    if (listItems.value.length > 0) {
      const firstItem = listItems.value[0];
      const lat = firstItem.latitude || firstItem.lat;
      const lng = firstItem.longitude || firstItem.lng;

      initializeMap(lat, lng);
      addMarker(lat, lng);
    } else {
      console.log('검색 결과가 없습니다.');
    }
  } catch (error) {
    console.error('오류 발생:', error);
  }
};

onMounted(() => {
  const script = document.createElement('script');
  script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&autoload=false`;
  document.head.appendChild(script);

  script.onload = () => {
    console.log("Kakao Map script loaded successfully.");
  };

  script.onerror = () => {
    console.error('Failed to load Kakao Map script. Check your API key and network.');
  };
});

// 리스트 객체의 위치를 마커로 띄우기
const goToMap = (item) => {
  if (!item || (!item.latitude && !item.lat) || (!item.longitude && !item.lng)) {
    console.warn('유효한 좌표가 없습니다:', item);
    return;
  }

  const lat = item.latitude || item.lat;
  const lng = item.longitude || item.lng;

  updateMap(lat, lng);
  addMarker(lat, lng);
};

// 모달 열기 함수 (아이템 설정 포함)
const openConfirmModal = (item) => {
  selectedItem.value = item; // 선택된 아이템을 설정
  showConfirmModal.value = true; // 모달 열기
};

// 목적지로 설정
const moveToMap = (item) => {

  if (!item || (!item.latitude && !item.lat) || (!item.longitude && !item.lng)) {
    console.warn('유효한 좌표가 없습니다:', item);
    return;
  }

  const lat = item.latitude || item.lat;
  const lng = item.longitude || item.lng;

  router.push({
    name: 'map',
    query: {
      item: JSON.stringify({ title: item.title }), // title 속성 사용
      lat: lat,
      lng: lng,
    }
  });
  showConfirmModal.value = false;
};

// 지도 업데이트 함수
const updateMap = (lat, lng) => {
  if (!map.value) {
    console.warn('지도 객체가 아직 초기화되지 않았습니다.');
    return;
  }

  const position = new window.kakao.maps.LatLng(lat, lng);
  map.value.setCenter(position);
  console.log("Map center updated to:", lat, lng);
};


</script>

<style scoped>
.container-fluid{
  overflow-x: hidden;
  padding: 0 0 ;
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

.no-history-wrapper {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 화면 크기가 768px 이하일 때 */
@media (max-width: 768px) {
  .search-wrapper {
    max-width: 100%;
    margin-right: 0;
    padding: 15px;
  }
}

/* 화면 크기가 576px 이하일 때 */
@media (max-width: 360px) {
  .search-wrapper {
    padding: 10px;
  }

  .container-fluid{
  padding: 0 0 ;
}
}

/* placeholder 색상 조정 */
::placeholder {
  color: #888;
  opacity: 8;
}

input:focus {
  outline: none;
  box-shadow: none;
}

.search-tip {
  background-color: #f1f5f9;
  padding: 10px 15px;
  border-radius: 9px;
  font-size: 0.8rem;
  color: #333;
}

.tip-text {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 3px 8px;
  color: #333;
  font-weight: bold;
  font-size: 0.76rem;
}

.search-icon {
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

.clickable-item {
  cursor: pointer;
  transition: background-color 0.3s;
}



.input-group-text {
  cursor: pointer;
}

.no-history {
  text-align: center;
  color: #888;
}

.no-history i {
  font-size: 2rem;
  color: #ccc;
}

.no-history p {
  margin: 0.5rem 0;
  font-weight: bold;
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
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 80%;
  max-width: 400px;
}
</style>
