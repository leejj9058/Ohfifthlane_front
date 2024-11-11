<template>
    <div class="map-container">
        <div id="map" style="width:100%; height:auto;"></div>
        <div class="search-bar">
            <button class="btn-back" @click="navigateToMainPage">
                <i class="bi bi-arrow-left"></i> <!-- 이전 아이콘 -->
            </button>
            <input type="text" placeholder="목적지를 입력하세요." readonly @click="navigateToSearchView"
                style="pointer-events: auto;">
            <button class="btn-search" @click="navigateToSearchView"><i class="bi bi-search"></i></button>
        </div>
        <div class="filter-buttons">
            <button class="filter-option" @click="filterResident">거주자</button>
            <button class="filter-option" @click="filterPublicParking">공영주차장</button>
            <button class="filter-option" @click="filterGasStations">주유소</button>
            <button class="filter-option" @click="filterChargingStations">충전소</button>
        </div>

        <button class="filter-button" @click="openFilter">
            <i class="bi bi-funnel-fill"></i>
        </button>
        <div class="button-container">
            <button class="revisitButton" @click="revisit()">
                <i class="bi bi-arrow-clockwise"></i>현재위치에서 재탐색
            </button>
            <button class="return-location-button" @click="returnToCurrentLocation()">
                <i class="bi bi-geo-alt-fill"></i>
            </button>
        </div>
       
        <transition name="slide-fade">
            <div v-if="showTimeModal" class="modal-content-time">
                    <div class="d-flex justify-content-center align-items-center p-3" id="background">
                        <div class="p-4 p-md-5 w-100">
                            <h1 class="mb-4 fs-2 fw-bold">예약 시간 설정</h1>
                            <label for="time">시간을 선택하세요:</label>
                            <div>
                                <div>
                                    <label for="start-time">시작 시간:</label>
                                    <input id="start-time" type="text" ref="startTime" />

                                    <label for="end-time">종료 시간:</label>
                                    <input id="end-time" type="text" ref="endTime" />

                                    <div>
                                        <h2>시간 선택</h2>
                                        <VueScrollPicker :options="options" v-model="selected" />
                                    </div>

                                </div>
                            </div>
                            <hr>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between">
                        <button @click="selectTimeModal" class="me-2">확인</button>
                        <button @click="closeModal">닫기</button>
                    </div>
                </div>
        </transition>
        <transition name="slide-fade">
            <div v-if="showModal" class="modal-content-rpz" @mousedown="startDrag" @mouseup="stopDrag"
                @mouseleave="stopDrag" @mousemove="drag">
                <div class="modal-content">
                    <h3>{{ selectedRPZ.manageName }}</h3>
                    <p>주소: {{ selectedRPZ.address }}</p>
                    <p>10분 요금: {{ selectedRPZ.fee }}</p>
                    <button @click="moveReservation(selectedRPZ.id)" class="me-2">자세히 보기</button>
                    <button @click="closeModal">닫기</button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import 'flatpickr/dist/flatpickr.css';
import flatpickr from 'flatpickr';
//--------------------------------------
import VueScrollPicker from 'vue-scroll-picker';
const options = ref([
    { label: '10:00', value: '10:00' },
    { label: '10:10', value: '10:10' },
    { label: '10:20', value: '10:20' },
    // 추가 시간 옵션
]);
const selected = ref('10:00');
//--------------------------------------
const KAKAO_MAP_KEY = 'a803ff1d149711eb074e8b95dadeab12';
const centerPoint = ref({ lat: 37.515815, lng: 127.035772 });
let map;
let clusterer;
let markers = [];
const markerObject = ref([]);
const selectedRPZ = ref({});
const showModal = ref(false);
const showTimeModal = ref(false);
const isDragging = ref(false);
const startY = ref(0);
const router = useRouter();
const date = ref(new Date());
const startTime = ref();  // 시작 시간 초기값
const endTime = ref();    // 종료 시간 초기값
onMounted(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&autoload=false&libraries=services,clusterer`;
    document.head.appendChild(script);
    script.onload = () => {
        window.kakao.maps.load(() => {
            const mapContainer = document.getElementById('map');
            const mapOption = {
                center: new window.kakao.maps.LatLng(centerPoint.value.lat, centerPoint.value.lng),
                level: 5,
            };
            map = new window.kakao.maps.Map(mapContainer, mapOption);
            clusterer = new window.kakao.maps.MarkerClusterer({
                map: map,
                averageCenter: true,
                minLevel: 2,
                disableClickZoom: true,
            });
            window.kakao.maps.event.addListener(map, 'center_changed', () => {
                const center = map.getCenter();
                centerPoint.value.lat = center.getLat();
                centerPoint.value.lng = center.getLng();
            });
        });
    };
    searchRPZList(centerPoint.value.lng, centerPoint.value.lat);
});
const revisit = () => {
    searchRPZList(centerPoint.value.lng, centerPoint.value.lat);
};
const navigateToSearchView = () => {
    router.push({ path: '/search' });
};
const navigateToMainPage = () => {
    router.push({ path: '/' });
};
const searchRPZList = async (lng, lat) => {
    try {
        const response = await axios.post('/api/nearRPZList', {
            userLon: lng,
            userLat: lat
        });
        console.log("API response data:", response.data); // 확인을 위해 로그 추가
        markerObject.value = response.data.map(item => ({
            lat: item.rpzLat,
            lng: item.rpzLon,
            address: item.rpzAddress,
            fee: item.rpzFee,
            id: item.rpzId,
            manageName: item.rpzManageName,
            manageTel: item.rpzManageTel,
            num: item.rpzNum,
            userId: item.userId
        }));
        removeMarkers();
        createMarker(markerObject.value);
    } catch (error) {
        console.error('API 요청 실패:', error);
    }
};
const removeMarkers = () => {
    markers.forEach(marker => {
        marker.setMap(null);
    });
    if (clusterer) {
        clusterer.clear(); // 클러스터러 내의 모든 마커를 제거
    }
    markers = [];
};
const returnToCurrentLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const currentPos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            const newCenter = new window.kakao.maps.LatLng(currentPos.lat, currentPos.lng);
            map.setCenter(newCenter);
        }, () => {
            alert("위치 정보를 가져오는 데 실패했습니다.");
        });
    } else {
        alert("이 브라우저는 위치 정보를 지원하지 않습니다.");
    }
};
const openFilter = () => {
    showTimeModal.value = true; // 모달을 열기
    console.log("Filter button clicked");
};
const selectTimeModal = () => {
    flatpickr(startTime.value, {
        enableTime: true,
        noCalendar: true,
        dateFormat: 'H:i',
        time_24hr: true,
        minuteIncrement: 10, // 10분 단위 설정
    });
    flatpickr(endTime.value, {
        enableTime: true,
        noCalendar: true,
        dateFormat: 'H:i',
        time_24hr: true,
        minuteIncrement: 10, // 10분 단위 설정
    });
    searchRPZList(centerPoint.value.lng, centerPoint.value.lat);
}
const filterResident = async () => {
    console.log("거주자 필터 클릭됨");
    await searchRPZList(centerPoint.value.lng, centerPoint.value.lat, 'resident'); // 'resident'를 추가하여 필터링
};
const filterPublicParking = () => {
    console.log("공영주차장 필터 클릭됨");
};
const filterGasStations = () => {
    console.log("주유소 필터 클릭됨");
};
const filterChargingStations = () => {
    console.log("충전소 필터 클릭됨");
};
const moveReservation = (rpzId) => {
    router.replace({ path: '/reservation/', query: { rpzId: rpzId } });
};
const createMarker = (rpzList) => {
    if (!clusterer) {
        console.error("Clusterer is not initialized.");
        return;
    }
    rpzList.forEach((rpz) => {
        const markerPosition = new window.kakao.maps.LatLng(rpz.lat, rpz.lng);
        const marker = new window.kakao.maps.Marker({
            position: markerPosition,
            title: rpz.num
        });
        clusterer.addMarker(marker);
        markers.push(marker);
        // Adding click event listener to the marker
        window.kakao.maps.event.addListener(marker, 'click', () => {
            selectedRPZ.value = rpz; // Set the selected RPZ information
            showModal.value = true; // Show the bottom sheet modal
        });
    });
};
//모달 끄기
const closeModal = () => {
    showTimeModal.value = false;
    showModal.value = false
};

// Dragging functions
const startDrag = (event) => {
    isDragging.value = true;
    startY.value = event.clientY; // 드래그 시작 y좌표 설정
};
const setTime = (time) => {
    console.log("설정된 시간:", time);
    // 여기서 시간 설정 관련 로직 추가
    showTimeModal.value = false; // 모달 닫기
// 과거 날짜 비활성화 함수
}
const disablePastDates = (date) => {
    return date < new Date(); // 현재 시간보다 이전 시간 비활성화
};
// 종료 시간의 최소값을 시작 시간으로 동기화하는 함수
const updateEndTime = () => {
    if (endTime.value < startTime.value) {
        endTime.value = new Date(startTime.value);
    }
};
</script>

<style scoped>
.map-container {
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100vh;
    max-width: 460px;
    margin: 0 auto;

}

#map {
    width: 100%;
    height: 100%;
}

.search-bar {
    position: absolute;
    top: 20px;
    left: 10px;
    right: 10px;
    z-index: 1;
    display: flex;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    padding: 5px;
}

.search-bar input {
    flex: 1;
    padding: 8px;
    border: none;
    border-top: 0;
    border-bottom: 0;
    border-right: 1px solid #ddd;
    border-left: 1px solid #ddd;
    pointer-events: none;
}

.search-bar button.btn-back {
    border: none;
    background-color: #007bff;
    color: white;
    padding: 6px 8px;
    border-radius: 10px 0 0 10px;
    cursor: pointer;
}

.search-bar button.btn-search {
    border: none;
    background-color: #007bff;
    color: white;
    padding: 6px 8px;
    border-radius: 0 10px 10px 0;
    cursor: pointer;
}

.filter-buttons {
    position: absolute;
    top: 70px;
    left: 10px;
    right: 10px;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    background-color: white;
    border-radius: 10px;
    padding: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    margin-top: 10px;
}

.filter-option {
    flex: 1;
    padding: 10px 0;
    /* 높이만 지정해 버튼이 가로로 늘어나도록 설정 */
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    text-align: center;
    margin: 0 2px;
}

.button-container {
    position: absolute;
    /* 지도 위에 위치하도록 설정 */
    bottom: 20px;
    /* 지도의 하단에서의 거리 */
    right: 20px;
    /* 왼쪽 여백 */
    z-index: 2;
    /* 다른 요소들보다 위에 오도록 설정 */
    display: flex;
    gap: 10px;
    /* 버튼 간격 조정 */
    justify-content: flex-end;
}

.filter-button {
    position: absolute;
    bottom: 20px;
    left: 20px;
    z-index: 1;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}


.revisitButton {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 15px;
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    font-size: 0.9rem;
}

.return-location-button {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 15px;
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 0.9rem;
}

.bottom-sheet {
    position: absolute;
    left: 0;
    bottom: 0;  /* 화면 하단에 고정 */
    width: 100vw;  /* 화면의 가로를 채움 */
    height: 50vh;  /* 화면의 세로 반을 차지 */
    background: white;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease;
    transform: translateY(100%); /* 초기 위치는 화면 바깥 */
    z-index: 10;
}

.modal-content-rpz,
.modal-content-time {
    position: fixed; /* 화면 고정 */
    bottom: 0;       /* 화면 하단에 위치 */
    width: 100vw;    /* 가로로 화면 전체 채움 */
    max-width: 460px;
    height: 50vh;    /* 세로 높이 설정 */
    margin: 0 auto;
    padding: 20px;
    background-color: white;
    border-radius: 15px 15px 0 0;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow-y: auto;
    z-index: 10;
}

.modal-content-rpz h3,
.modal-content-time h1 {
    margin-bottom: 15px;
    color: #333;
    font-weight: bold;
    text-align: center;
}

.modal-content-rpz p,
.modal-content-time label {
    color: #666;
    margin-bottom: 10px;
    text-align: center;
}

.modal-content-rpz button,
.modal-content-time button {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 15px;
    cursor: pointer;
    font-size: 1rem;
    margin-top: 10px;
}

.modal-content-rpz button:hover,
.modal-content-time button:hover {
    background-color: #0056b3;
}

/* Slide fade transition */
.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: transform 0.4s ease;
}

.slide-fade-enter {
    transform: translateY(100%);
    /* 화면 아래에서 올라오는 애니메이션 시작 */
}

.slide-fade-enter-to {
    transform: translateY(0);
    /* 화면 중앙에서 정지하는 애니메이션 끝 */
}

.slide-fade-leave {
    transform: translateY(0);
    /* 화면 중앙에서 사라지기 시작 */
}

.slide-fade-leave-to {
    transform: translateY(100%);
    /* 화면 아래로 사라짐 */
}
</style>
