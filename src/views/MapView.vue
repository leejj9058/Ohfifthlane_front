<template>
    <div class="map-container">
        <div id="map" style="width:100%; height:auto;"></div>
        <!-- 어두워지는 오버레이 -->
        <div v-if="reservationDateTimeModal || showRPZDetailModal" class="map-overlay"></div>
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

        <button class="filter-button" @click="openSelectReservationTimeModal">
            <i class="bi bi-funnel-fill"></i>
        </button>
        <div class="button-container">
            <button class="revisitButton" @click="revisit">
                <i class="bi bi-arrow-clockwise"></i>현재위치에서 재탐색
            </button>
            <button class="return-location-button" @click="returnToCurrentLocation">
                <i class="bi bi-geo-alt-fill"></i>
            </button>
        </div>

        <transition name="slide-fade">
    <div v-if="reservationDateTimeModal || showRPZDetailModal" class="bottom-sheet">
<!-- 회색 바 -->
<div class="modal-header-bar"></div>
        <!-- 예약 날짜 시간 선택 모달 내용 -->
        <div v-if="reservationDateTimeModal" class="modal-content-time">
            
            
    <div class="d-flex justify-content-center align-items-center mt-2" id="background">
        
        <div class="p-2 p-md-3 w-100 mt-1">
            
            <!-- 예약 시간 설정 제목 -->
            <h6 class="mb-4 fs-4 fw-bold text-center">예약 시간 설정</h6>
            
            <label for="time" class="label-date"><strong>날짜 선택</strong></label>
            <div class="d-flex flex-column">
                <!-- 날짜 선택 버튼들을 가로로 배치 -->
                <div class="d-flex justify-content-between mb-3">
                    <button v-for="(day, index) in daysWithDates" :key="index" 
                        @click="handleDateClick(index)" class="btn-date">
                        {{ day }}
                    </button>
                </div>

                <!-- 예약 시작 시간과 종료 시간을 가로로 배치 -->
                <div class="d-flex justify-content-between">
                    <div class="time-picker-container">
                        <p><strong>시작 시간</strong></p>
                        <TimePicker v-model="selectedStartTime" format="HH:mm" :is24="true"
                                    :minuteInterval="10" :hideDisabledHours="true" 
                                    :hideDisabledMinutes="true" />
                    </div>

                    <div class="time-picker-container">
                        <p><strong>종료 시간</strong></p>
                        <TimePicker v-model="selectedEndTime" format="HH:mm" :is24="true"
                                    :minuteInterval="10" :hideDisabledHours="true" 
                                    :hideDisabledMinutes="true" />
                    </div>
                </div>
            </div>
            <!-- 버튼들 -->
        <div class="d-flex justify-content-between mt-5">
                 <!-- 모달 끄기 -->
                <button @click="resetTime" class="btn-action reset-btn">초기화</button>
                <button @click="closeModal" class="btn-action">적용하기</button> <!-- 예약 시간 초기화-->
            </div>
        </div>
        
    </div>            
        </div>
  
                <!-- RPZ 정보 모달 내용 -->
                <div v-if="showRPZDetailModal" class="modal-content-rpz">
                    <h3>{{ selectedRPZ.manageName }}</h3>
                    <p>주소: {{ selectedRPZ.address }}</p>
                    <p>10분 당 요금: {{ selectedRPZ.fee }}</p>
                    <div class="d-flex justify-content-between">
                        <button @click="moveReservation(selectedRPZ.id)" class="me-2">자세히 보기</button>
                        <button @click="closeModal">닫기</button>
                    </div>
                </div>
            </div>
        </transition>

    </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

import TimePicker from 'vue3-timepicker'
import 'vue3-timepicker/dist/VueTimepicker.css'

//-------------------------------------------변수-------------------------------------------------

// 선택한 예약 시작 시간
const selectedStartTime = ref("");

// 선택한 예약 종료 시간
const selectedEndTime = ref("");

// 선택한 예약 날짜
const selectedDate = ref("");


const KAKAO_MAP_KEY = 'a803ff1d149711eb074e8b95dadeab12';
const centerPoint = ref({ lat: 37.515815, lng: 127.035772 });
let map;
let clusterer;
let markers = [];
const markerObject = ref([]);
const selectedRPZ = ref({});
const showRPZDetailModal = ref(false); //RPZ상세정보 모달 온/오프
const reservationDateTimeModal = ref(false); //예약 날짜 시간 설정 온/오프
const router = useRouter();

const startHours = ref([]); // 시작 가능한 시 표시
const startMinutes = ref([]); // 시작 가능한 분 표시
const endHours = ref([]); // 종료 가능한 시 표시
const endMinutes = ref([]); // 종료 가능한 분 표시 

const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

const isDragging = ref(false);
const startY = ref(0);

//-----------------------------------------------함수-----------------------------------------------------------

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
    resetTime();
    searchRPZList(centerPoint.value.lng, centerPoint.value.lat);
    console.log(centerPoint.value.lng, centerPoint.value.lat);

});

// 오늘 날짜를 기준으로 오늘, 내일, 모레의 날짜와 요일을 계산
const daysWithDates = computed(() => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 3; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);

        const dayIndex = date.getDay();
        const dayName = dayNames[dayIndex];

        // 날짜와 요일을 형식에 맞춰 문자열로 생성
        const dateStr = `${date.getMonth() + 1}월 ${date.getDate()}일 (${dayName})`;
        dates.push(dateStr);
    }

    return dates;
});

// 날짜 버튼 클릭 이벤트 핸들러
const handleDateClick = (index) => {
    selectedDate = daysWithDates.value[index].fullDate;
    console.log("선택한 날짜:", selectedDate); // 원하는 날짜 정보를 사용
};

// 선택 가능한 시간 표시
const setAvailableTime = () => {
    const now = new Date();

    // 현재 시간 이후로
    startHours = [now.getHours, 24];
    startMinutes = [now.getMinutes, 60];
    endHours = [now.getHours, 24];
    endMinutes = [now.getMinutes, 60];

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


// 예약 시간 초기화
const resetTime = () => {
    selectedStartTime.value = null;
    selectedEndTime.value = null;
    reservationDateTimeModal.value = false;
}

// 재탐색
const revisit = () => {
    searchRPZList(centerPoint.value.lng, centerPoint.value.lat);
};
const navigateToSearchView = () => {
    router.push({ path: '/search' });
};

const navigateToMainPage = () => {
    router.push({ path: '/' });
};

//거주자 우선 주차 리스트 가져오기
const searchRPZList = async (lng, lat) => {
    try {
        console.log(recentTime());
        const response = await axios.post('/api/getRPZListByTime', {
            userLocationVo: {
                userLon: lng,
                userLat: lat,
            },
            // reservationVo: {
            //     reservationStartTime: recentTime(),
            //     reservationEndTime: recentTimePlusFortyMinutes(),
            //     reservationDay: recentDate(),
            // },
            reservationVo: {
                reservationStartTime: selectedStartTime.value || recentTime(),
                reservationEndTime: selectedEndTime.value || recentTimePlusFortyMinutes(),
                reservationDay: selectedDate.value || recentDate(),
            },
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
        // 기존 마커 제거
        removeMarkers();
        // 새로운 마커 생성
        createMarker(markerObject.value);
    } catch (error) {

        console.error('API 요청 실패:', error);
    }
};


// //거주자 우선 주차 리스트 가져오기
// const searchRPZList = async ( lng, lat ) => {
//     try {
//         const response = await axios.post('/api/nearRPZList', {
//             {
//                 userLon: lng,
//                 userLat: lat,
//             },
//             
//         });

//         console.log("API response data:", response.data); // 확인을 위해 로그 추가

//         markerObject.value = response.data.map(item => ({
//             lat: item.rpzLat,
//             lng: item.rpzLon,
//             address: item.rpzAddress,
//             fee: item.rpzFee,
//             id: item.rpzId,
//             manageName: item.rpzManageName,
//             manageTel: item.rpzManageTel,
//             num: item.rpzNum,
//             userId: item.userId
//         }));
//         // 기존 마커 제거
//         removeMarkers();
//         // 새로운 마커 생성
//         createMarker(markerObject.value);
//     } catch (error) {
//         console.error('API 요청 실패:', error);
//     }
// };

// 현재 위치로 돌아오기
const returnToCurrentLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const currentPos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
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

// 예약 시간 설정 모달 열기
const openSelectReservationTimeModal = () => {
    reservationDateTimeModal.value = true; // 모달을 열기
    setAvailableTime();
    console.log("Filter button clicked");
};

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

// 거주자 우선 주차면 상세페이지로 이동
const moveReservation = (rpzId) => {
    router.replace({ path: '/reservation/', query: { rpzId: rpzId } });
};

// 마커 생성
const createMarker = (rpzList) => {
    if (!clusterer) {
        console.error("Clusterer is not initialized.");
        return;
    }
    rpzList.forEach((rpz) => {
        const markerPosition = new window.kakao.maps.LatLng(rpz.lat, rpz.lng);
        const marker = new window.kakao.maps.Marker({
            position: markerPosition,
            title: rpz.num,
        });
        clusterer.addMarker(marker);
        markers.push(marker);
        // Adding click event listener to the marker
        window.kakao.maps.event.addListener(marker, 'click', () => {
            selectedRPZ.value = rpz; // Set the selected RPZ information
            showRPZDetailModal.value = true; // Show the bottom sheet modal
        });
    });
};

// 기존 마커 삭제
const removeMarkers = () => {
    markers.forEach(marker => {
        marker.setMap(null);
    });
    if (clusterer) {
        clusterer.clear(); // 클러스터러 내의 모든 마커를 제거
    }
    markers = [];
};

//모달 끄기
const closeModal = () => {
    reservationDateTimeModal.value = false;
    showRPZDetailModal.value = false
}

// // Dragging functions
// const startDrag = (event) => {
//     isDragging.value = true;
//     startY.value = event.clientY;
// };

// const stopDrag = () => {
//     isDragging.value = false;
// };

// const drag = (event) => {
//     if (!isDragging.value) return;

//     const deltaY = event.clientY - startY.value;
//     startY.value = event.clientY;

//     const bottomSheet = document.querySelector('.bottom-sheet');
//     const currentTransform = getComputedStyle(bottomSheet).transform;
//     const translateY = currentTransform === 'none' ? 0 : parseInt(currentTransform.split(',')[5]);

//     const newTransform = `translateY(${translateY + deltaY}px)`;
//     bottomSheet.style.transform = newTransform;

//     // 슬라이드 내리기
//     if (translateY + deltaY > 100) {
//         showRPZDetailModal.value = false; // 아래로 내릴 때 모달 닫기
//         reservationDateTimeModal.value = false; // 아래로 내릴 때 시간 설정 모달 닫기
//     }
// };

// // 과거 날짜 비활성화 함수
// const disablePastDates = (date) => {
//     return date < new Date(); // 현재 시간보다 이전 시간 비활성화
// };

// // 종료 시간의 최소값을 시작 시간으로 동기화하는 함수
// const updateEndTime = () => {
//     if (endTime.value < startTime.value) {
//         endTime.value = new Date(startTime.value);
//     }
// };
</script>

<style src="vue-scroll-picker/lib/style.css"></style>
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
    bottom: 20px;
    right: 20px;
    z-index: 2;
    display: flex;
    gap: 10px;
    justify-content: flex-end;
}

.filter-button {
    position: absolute;
    bottom: 20px;
    left: 20px;
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
    z-index: 2;
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

.bottom-sheet-rpz,
.bottom-sheet-time {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100vw;
    height: 50vh;
    background: white;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease;
    transform: translateY(100%);
    z-index: 10;
}
/* 기존 모달 애니메이션을 없애고 고정 위치로 설정 */
.bottom-sheet {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    max-width: 460px; /* 지도 크기에 맞게 설정 */
    background-color: white;
    z-index: 1001;
    padding-bottom: 10px;
    display: flex;
    flex-direction: column;
    height: auto; /* 내용에 맞게 크기 조정 */
    border-radius: 30px 30px 0 0;
  
}

/* 모달이 열릴 때 애니메이션 적용 (위로 올라옴) */
.bottom-sheet.v-enter-active {
    transform: translateY(0); /* 모달이 위로 올라옴 */
}

/* 모달 닫힐 때 애니메이션 적용 (아래로 내려감) */
.bottom-sheet.v-leave-active {
    transform: translateY(100%); /* 모달이 아래로 내려감 */
}

/* 모달이 열릴 때 애니메이션을 제거하고, 그냥 위치 고정 */
.modal-content-time,
.modal-content-rpz {
    width: 100%;
    max-width: 460px;
    margin: 0 auto;
    padding: 20px;
    background-color: white;
    border-radius: 30px 30px 0 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 43vh; /* 모달 최소 높이 설정 */
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
    transition: background-color 0.3s ease;
}

.modal-content-rpz button:hover,
.modal-content-time button:hover {
    background-color: #0056b3;
}

/* 버튼이 모달 하단에 배치되도록 */
.modal-content-time .d-flex {
    justify-content: space-between; /* 버튼들이 양 옆으로 배치 */
    margin-top: auto; /* 버튼이 맨 아래에 고정되도록 */
}

/* Slide fade transition (부드러운 전환을 위한 CSS) */
.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: transform 0.5s ease-out; /* 부드러운 전환 */
}

/* Slide fade transition */

.slide-fade-enter {
    transform: translateY(100%);
}

.slide-fade-enter-to {
    transform: translateY(0);
}

.slide-fade-leave {
    transform: translateY(0);
}

.slide-fade-leave-to {
    transform: translateY(100%);
}

.map-overlay {
    position: fixed;
    top: 0;
    left: 0;
    justify-content: center;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5); /* 어두운 오버레이 */
    z-index: 999; /* 모달이 올라올 때 오버레이가 뒤에 오도록 설정 */
}
/* 예약 시간 설정 제목 중앙 배치 및 위치 조정 */
/* 예약 시간 설정 제목 중앙 배치 및 위치 조정 */
.modal-content-time h5 {
    margin-bottom: 5px;  /* 아래쪽 여백을 줄임 */
    font-size: 2rem; /* 제목 크기 */
    text-align: center; /* 중앙 정렬 */
    margin-top: 0px; /* 위쪽 여백을 추가하여 더 위로 올림 */
}

/* 날짜 버튼들을 가로로 배치 */
.d-flex.justify-content-between {
    display: flex;
    justify-content: space-between;
    gap: 10px; /* 버튼 사이의 간격 */
}

/* 날짜 버튼 스타일 */
.btn-date {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px;
    cursor: pointer;
    font-size: 1rem;
    flex: 1; /* 버튼들을 균등하게 배치 */
}

/* 날짜 버튼 호버 효과 */
.btn-date:hover {
    background-color: #0056b3;
}

/* TimePicker 컨테이너 (시작/종료 시간 가로로 배치) */
.time-picker-container {
    flex: 1; /* 각 TimePicker를 균등하게 배치 */
    margin-right: 10px; /* TimePicker 간의 간격 */
}

.btn-action {
    padding: 12px 20px;      /* 패딩을 더 넓게 설정 */
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease, color 0.3s ease;
    flex: 1;     
    border-radius: 8px !important;      
}

.btn-action:hover {
    background-color: #c3c3c3; /* 호버 시 배경을 파란색으로 */
    color: white;               /* 호버 시 텍스트 색상을 흰색으로 */
}

/* "초기화" 버튼에 대한 추가 스타일 */
.btn-action.reset-btn {
    background-color: white; /* 배경을 흰색으로 */
    color: #000000 !important;            /* 텍스트 색상은 파란색 */
    border: 1px solid rgb(196, 196, 196);
    border-radius: 8px;
    font-size: 1rem;
}
/* 작은 회색 바 */
.modal-header-bar {
    height: 4px; /* 바의 높이 */
    background-color: gray; /* 회색 바 색상 */
    width: 50px; /* 바의 너비, 원하시는 크기로 조정 가능 */
    margin: 8px auto 0;
    border-radius: 2px; /* 바의 끝을 둥글게 */
}


</style>
