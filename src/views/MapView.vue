<template>
    <div class="map-container">
        <div id="map" style="width:100%; height:auto;"></div>
        <!-- 어두워지는 오버레이 -->

        <div v-if="reservationDateTimeModal || showRPZDetailModal" class="map-overlay" @click="closeModal"></div>

        <div class="search-bar">

            <span class="position-absolute" style="left: 10px; top: 50%; transform: translateY(-50%);"
                @click="navigateToMainPage">
                <i class="bi bi-chevron-left" style="color: #333;"></i> <!-- 이전 아이콘 -->
            </span>

            <input type="text" class="form-control" :placeholder="destination" readonly @click="navigateToSearchView"
                style="pointer-events: auto; border: none; padding-left: 25px; color: #333;"> <!-- 텍스트 색상 지정 -->

            <i v-if="selectedDestination" class="bi bi-backspace" @click="deselectDestination"
                style="position: absolute; right: 40px; top: 50%; transform: translateY(-50%); color: #333;"></i>
            <!-- backspace 아이콘 위치 수정 -->

            <span class="position-absolute search-icon" @click="navigateToSearchView"
                style="right: 10px; top: 50%; transform: translateY(-50%); color: #333;">
                <i class="bi bi-search"></i> <!-- 검색 아이콘 -->
            </span>

        </div>

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

        <div class="filter-buttons">
            <button class="filter-option" @click="filterResident">
                <i class="fas fa-home icon-resident"></i> 거주자
            </button>
            <button class="filter-option" @click="filterPublicParking">
                <i class="fas fa-warehouse icon-parking"></i> 공영주차장
            </button>
            <button class="filter-option" @click="filterGasStations">
                <i class="fas fa-gas-pump icon-gas"></i> 주유소
            </button>
            <button class="filter-option" @click="filterChargingStations">
                <i class="fas fa-charging-station icon-charging"></i> 충전소
            </button>
        </div>





        <button class="filter-button" @click="openSelectReservationTimeModal">
            <i class="bi bi-sliders"></i> <!-- 필터 아이콘 -->
            <span class="filter-text">필터</span> <!-- 필터 텍스트 -->
        </button>
        <div class="button-container">
            <button class="revisitButton" @click="revisit">
                <i class="bi bi-arrow-clockwise"></i>이 지역 주차장 검색
            </button>
            <button class="return-location-button" @click="returnToCurrentLocation">
                <i class="fas fa-crosshairs"></i> <!-- 현재 위치 아이콘 -->
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
                <div v-if="showRPZDetailModal" class="modal-content-rpz" @click="moveReservation(selectedRPZ.id)">
                    <h3 style="display: flex; justify-content: center; align-items: center;">{{ selectedRPZ.num }}</h3>


                    <!-- 주소 -->
                    <p style="margin: 0; padding: 0; line-height: 2; text-align: left; color: #6c757d;">
                        <i class="bi bi-geo-alt-fill" style="font-size: 20px; margin-right: 0px; color: #d6d6d6;"></i>
                        {{ selectedRPZ.address }}
                    </p>

                    <!-- 요금 -->
                    <p
                        style="margin: 0; padding: 0; line-height: 1; text-align: left; margin-top: 5px; color: #6c757d;">
                        <i class="bi bi-wallet-fill" style="font-size: 20px; margin-right: 0px; color: #d6d6d6;"></i>
                        10분 당 : {{ selectedRPZ.fee }}원
                    </p>

                </div>
            </div>
        </transition>

    </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import TimePicker from 'vue3-timepicker'
import 'vue3-timepicker/dist/VueTimepicker.css'
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

//-------------------------------------------변수-------------------------------------------------

const defaultLat = 37.515815; // 초기 lat
const defaultLng = 127.035772; // 초기 lng


// 선택한 예약 시작 시간
const selectedStartTime = ref("");

// 선택한 예약 종료 시간
const selectedEndTime = ref("");

// 선택한 예약 날짜
const selectedDate = ref("");

const route = useRoute();
const centerPoint = ref({ lat: defaultLat, lng: defaultLng });
const destination = ref("목적지를 검색해보세요.");

const KAKAO_MAP_KEY = 'a803ff1d149711eb074e8b95dadeab12';
let map;
let clusterer;
let markers = [];
const markerObject = ref([]);
const selectedRPZ = ref([]);
const showRPZDetailModal = ref(false); // RPZ상세정보 모달 온/오프
const reservationDateTimeModal = ref(false); // 예약 날짜 시간 설정 온/오프
const router = useRouter();
const selectedDestination = ref(false); // 목적지 설정 여부

const startHours = ref([]); // 시작 가능한 시 표시
const startMinutes = ref([]); // 시작 가능한 분 표시
const endHours = ref([]); // 종료 가능한 시 표시
const endMinutes = ref([]); // 종료 가능한 분 표시

const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

//-----------------------------------------------함수-----------------------------------------------------


onMounted(() => {
    console.log(route.query.item)
    const item = JSON.parse(route.query.item || '{}'); // 쿼리에서 item이 없으면 빈 객체로 처리
    const lat = parseFloat(route.query.lat) || centerPoint.value.lat;
    const lng = parseFloat(route.query.lng) || centerPoint.value.lng;
    let text = "";

    // 목적지 선택 여부 변경
    if (Object.keys(item).length > 0) {
        selectedDestination.value = true;
        text = item.title.replace(/<\/?b>/g, "");
        console.log(text);
    }

    destination.value = text || '목적지를 검색해보세요'; // item의 title을 사용하거나 기본 텍스트 설정
    centerPoint.value = { lat, lng };

    console.log('Destination:', destination.value);
    console.log('Latitude:', lat);
    console.log('Longitude:', lng);

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

// 목적지 선택 해제
const deselectDestination = () => {
    selectedDestination.value = false;
    destination.value = "목적지를 검색해주세요.";
    centerPoint = { defaultLat, defaultLng };
}

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
        noParkingLotToast();
        console.error('주차장 리스트를 찾을 수 없습니다:', error);
    }
};

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

// 모달 끄기
const closeModal = () => {
    reservationDateTimeModal.value = false;
    showRPZDetailModal.value = false;
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

const noParkingLotToast = () => {
    toast("예약가능한 주차장이 없습니다.(╥﹏╥)", {
        autoClose: 3000,
    });
};


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


.search-icon {
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
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
    gap: 10px;
    background-color: transparent;
    /* 배경색을 투명으로 설정하여 전체 테두리 제거 */
    padding: 0;
    /* 전체 패딩 제거 */
    margin-top: 10px;
}

.filter-option {
    display: flex;
    align-items: center;
    padding: 5px 10px;
    border: 1px solid #ddd;
    /* 테두리 두께를 얇게 설정 */
    border-radius: 20px;
    background-color: #f9f9f9;
    font-size: 14px;
    color: #333;
    cursor: pointer;
    box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.15), -2px 2px 6px rgba(0, 0, 0, 0.15);
    /* 그림자를 양옆과 아래쪽에만 줌 */
}



.filter-option i {
    margin-right: 5px;
}

/* 작은 화면에서의 반응형 설정 */
@media (max-width: 768px) {
    .filter-option {
        font-size: 12px;
        /* 작은 화면에서 글씨 크기 줄임 */
        padding: 4px 8px;
        /* 작은 화면에서 패딩 조절 */
        height: 36px;
        /* 높이도 줄여서 뚱뚱해지지 않게 조정 */
    }
}

/* 아이콘 색상 스타일 */
.icon-resident {
    color: #ff4500;
}

.icon-parking {
    color: #ffb400;
    /* 노란색 */
}

.icon-gas {
    color: #28a745;
    /* 초록색 */
}

.icon-charging {

    color: #007bff;
}

/* 마우스 오버 효과 */
.filter-option:hover {
    background-color: #e6e6e6;
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
    background-color: white;
    color: black;
    /* 글자 색을 검정으로 변경 */
    border: none;
    border-radius: 25px;
    /* 둥근 테두리 */
    padding: 6px 12px;
    /* 버튼 내부 여백을 줄여서 상하 너비 감소 */
    display: flex;
    /* 아이콘과 텍스트를 가로로 배치 */
    align-items: center;
    /* 수직 정렬 */
    justify-content: center;
    /* 가로 정렬 */
    font-size: 0.9rem;
    /* 글자 크기 줄이기 */
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    z-index: 2;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
    /* 전환 효과 */
}

/* 아이콘 스타일 */
.filter-button i {
    font-size: 1.1rem;
    /* 아이콘 크기 줄이기 */
    margin-right: 6px;
    /* 아이콘과 텍스트 간의 간격 줄이기 */
}

/* 텍스트 스타일 */
.filter-button .filter-text {
    font-size: 0.9rem;
    /* 텍스트 크기 줄이기 */
    font-weight: 500;
    /* 텍스트 두께 유지 */
}

/* hover 상태에서 버튼 효과 */
.filter-button:hover {
    background-color: #007bff;
    /* hover 시 배경색 변경 */
    color: white;
    /* hover 시 글자색 흰색으로 변경 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    /* hover 시 그림자 강조 */
}

.revisitButton {
    background-color: white;
    /* 흰색 배경 */
    color: #007bff;
    /* 파란색 글자 */
    border: 2px solid #ffffff;
    /* 파란색 테두리 */
    border-radius: 25px;
    /* 둥근 테두리 */
    padding: 8px 12px;
    /* 버튼 안쪽 여백 줄이기 */
    display: flex;
    align-items: center;
    justify-content: center;
    /* 중앙 정렬 */
    gap: 5px;
    cursor: pointer;
    font-size: 0.9rem;
    /* 글자 크기 */
    font-weight: 500;
    transition: background-color 0.3s ease, color 0.3s ease;
    /* 배경 및 글자색 변화 애니메이션 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    /* x, y, blur, 색상 */
}

.return-location-button {
    width: 40px;
    /* 버튼 가로 크기 줄이기 */
    height: 40px;
    /* 버튼 세로 크기 줄이기 */
    border-radius: 50%;
    /* 원형 버튼 */
    background-color: white;
    /* 버튼 배경은 항상 하얀색 */
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    /* 그림자 효과 */
    cursor: pointer;
    transition: transform 0.2s ease;
    /* 버튼 크기 변화 애니메이션 */
}

.return-location-button:active {
    transform: scale(0.95);
    /* 클릭 시 버튼이 약간 축소되는 효과 */
}

.return-location-button i {
    color: rgba(176, 176, 176, 0.6);
    /* 기본 아이콘 색상: 불투명 파랑 */
    font-size: 20px;
    /* 아이콘 크기 줄이기 */
    transition: color 0.2s ease;
    /* 아이콘 색상 변경 애니메이션 */
}

.return-location-button:active i {
    color: #313131;
    /* 클릭 시 아이콘 색상: 또렷한 파랑으로 변경 */
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
    max-width: 460px;
    /* 지도 크기에 맞게 설정 */
    background-color: white;
    z-index: 1001;
    padding-bottom: 10px;
    display: flex;
    flex-direction: column;
    height: auto;
    /* 내용에 맞게 크기 조정 */
    border-radius: 30px 30px 0 0;
}

/* 모달이 열릴 때 애니메이션 적용 (위로 올라옴) */
.bottom-sheet.v-enter-active {
    transform: translateY(0);
    /* 모달이 위로 올라옴 */
}

/* 모달 닫힐 때 애니메이션 적용 (아래로 내려감) */
.bottom-sheet.v-leave-active {
    transform: translateY(100%);
    /* 모달이 아래로 내려감 */
}

/* 모달이 열릴 때 애니메이션을 제거하고, 그냥 위치 고정 */
.modal-content-time,
.modal-content-rpz {
    width: 100%;
    max-width: 460px;
    margin: 0 auto;
    padding: 30px;
    background-color: white;
    border-radius: 30px 30px 0 0;


    flex-direction: column;
    justify-content: flex-start;
    /* 컨텐츠 상단 정렬 */
    align-items: flex-start;
    /* 좌측 정렬 */
    overflow: auto;
    /* 내용이 넘칠 경우 스크롤 가능 */
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
    justify-content: space-between;
    /* 버튼들이 양 옆으로 배치 */
    margin-top: auto;
    /* 버튼이 맨 아래에 고정되도록 */
}

/* Slide fade transition (부드러운 전환을 위한 CSS) */
.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: transform 0.5s ease-out;
    /* 부드러운 전환 */
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
    background-color: rgba(0, 0, 0, 0.5);
    /* 어두운 오버레이 */
    z-index: 999;
    /* 모달이 올라올 때 오버레이가 뒤에 오도록 설정 */
}

/* 예약 시간 설정 제목 중앙 배치 및 위치 조정 */
/* 예약 시간 설정 제목 중앙 배치 및 위치 조정 */
.modal-content-time h5 {
    margin-bottom: 5px;
    /* 아래쪽 여백을 줄임 */
    font-size: 2rem;
    /* 제목 크기 */
    text-align: center;
    /* 중앙 정렬 */
    margin-top: 0px;
    /* 위쪽 여백을 추가하여 더 위로 올림 */
}

/* 날짜 버튼들을 가로로 배치 */
.d-flex.justify-content-between {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    /* 버튼 사이의 간격 */
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
    flex: 1;
    /* 버튼들을 균등하게 배치 */
}

/* 날짜 버튼 호버 효과 */
.btn-date:hover {
    background-color: #0056b3;
}

/* TimePicker 컨테이너 (시작/종료 시간 가로로 배치) */
.time-picker-container {
    flex: 1;
    /* 각 TimePicker를 균등하게 배치 */
    margin-right: 10px;
    /* TimePicker 간의 간격 */
}

.btn-action {
    padding: 12px 20px;
    /* 패딩을 더 넓게 설정 */
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease, color 0.3s ease;
    flex: 1;
    border-radius: 8px !important;
}

.btn-action:hover {
    background-color: #c3c3c3;
    /* 호버 시 배경을 파란색으로 */
    color: white;
    /* 호버 시 텍스트 색상을 흰색으로 */
}

/* "초기화" 버튼에 대한 추가 스타일 */
.btn-action.reset-btn {
    background-color: white;
    /* 배경을 흰색으로 */
    color: #000000 !important;
    /* 텍스트 색상은 파란색 */
    border: 1px solid rgb(196, 196, 196);
    border-radius: 8px;
    font-size: 1rem;
}

/* 작은 회색 바 */
.modal-header-bar {
    height: 4px;
    /* 바의 높이 */
    background-color: gray;
    /* 회색 바 색상 */
    width: 50px;
    /* 바의 너비, 원하시는 크기로 조정 가능 */
    margin: 8px auto 0;
    border-radius: 2px;
    /* 바의 끝을 둥글게 */
}
</style>
