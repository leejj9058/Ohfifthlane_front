<template>
    <Header></Header>

    <div class="map-container">
        <!-- Map -->
        <div id="map" style="width:100%; height:1000px;"></div>

        <!-- Search bar -->
        <div class="search-bar" @click="navigateToSearchView">
            <input type="text" placeholder="목적지를 입력하세요." readonly>
            <button class="btn-search"><i class="bi bi-search"></i></button>
        </div>

        <!-- Filter buttons below search bar -->
        <div class="filter-buttons">
            <button class="filter-option" @click="filterResident">거주자</button>
            <button class="filter-option" @click="filterPublicParking">공영주차장</button>
            <button class="filter-option" @click="filterGasStations">주유소</button>
            <button class="filter-option" @click="filterChargingStations">충전소</button>
        </div>

        <button class="revisitButton" @click="revisit()">
            <i class="bi bi-geo-alt-fill"></i> <!-- 재탐색 버튼 -->
        </button>

        <!-- Button to return to current location -->
        <button class="return-location-button" @click="returnToCurrentLocation()">
            <i class="bi bi-geo-alt-fill"></i> <!-- GPS icon -->
        </button>

        <!-- Floating filter button -->
        <button class="filter-button" @click="openFilter">
            <i class="bi bi-funnel-fill"></i>
        </button>
    </div>
</template>

<script setup>
import Header from "@/components/Header.vue";
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const KAKAO_MAP_KEY = 'a803ff1d149711eb074e8b95dadeab12';
const centerPoint = ref({ lat: 37.515815, lng: 127.035772 });
let map;

const markerObject = ref([]);
const isLoggedIn = ref(false);
const router = useRouter();
const isOpen = ref(false);

onMounted(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&autoload=false`;
    document.head.appendChild(script);

    script.onload = () => {
        window.kakao.maps.load(() => {
            const mapContainer = document.getElementById('map');
            const mapOption = {
                center: new window.kakao.maps.LatLng(centerPoint.value.lat, centerPoint.value.lng),
                level: 5,
            };

            map = new window.kakao.maps.Map(mapContainer, mapOption);

            searchCafeList(centerPoint.value.lat, centerPoint.value.lng);

            window.kakao.maps.event.addListener(map, 'center_changed', () => {
                const center = map.getCenter();
                centerPoint.value.lat = center.getLat();
                centerPoint.value.lng = center.getLng();
                console.log(centerPoint);

            });
        });
    };
});

const revisit = () => { //이동한 좌표로 재탐색
    searchCafeList(centerPoint.value.lat, centerPoint.value.lng);
    console.log(centerPoint);
}


// Navigate to the search view when the search bar is clicked
const navigateToSearchView = () => {
    router.push({ path: '/search' });
};

const searchCafeList = async (lng, lat) => {
    try {
        const response = await axios.post('/api/nearRPZList', {
            userLat: lat,
            userLon: lon
        });
        markerObject.value = response.data;
        createMarker(markerObject.value);
    } catch (error) {
        console.error('API 요청 실패:', error);
    }
};

// Function to return to the current location
const returnToCurrentLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const currentPos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            const newCenter = new window.kakao.maps.LatLng(currentPos.lat, currentPos.lng);
            map.setCenter(newCenter); // Move the map center to the current location
            console.log('현재 위치로 이동:', currentPos);
        }, () => {
            alert("위치 정보를 가져오는 데 실패했습니다.");
        });
    } else {
        alert("이 브라우저는 위치 정보를 지원하지 않습니다.");
    }
};

const openFilter = () => {
    console.log("Filter button clicked");
};

const filterResident = () => {
    console.log("거주자 필터 클릭됨");
    // Add filtering logic here
};

const filterPublicParking = () => {
    console.log("공영주차장 필터 클릭됨");
    // Add filtering logic here
};

const filterGasStations = () => {
    console.log("주유소 필터 클릭됨");
    // Add filtering logic here
};

const filterChargingStations = () => {
    console.log("충전소 필터 클릭됨");
    // Add filtering logic here
};

const toggleLogin = () => {
    isLoggedIn.value = !isLoggedIn.value;
};

const goToHome = () => {
    router.replace({ path: '/' });
};

const moveCafeInfo = (tblid) => {
    router.replace({ path: '/cafeinfo/', query: { tblid: tblid } });
}

const createMarker = (cafeList) => {
    cafeList.forEach((cafe) => {
        const markerPosition = new window.kakao.maps.LatLng(cafe.lat, cafe.lng);
        const marker = new window.kakao.maps.Marker({
            position: markerPosition,
            title: cafe.name
        });
        marker.setMap(map);

        window.kakao.maps.event.addListener(marker, 'click', () => {
            moveCafeInfo(cafe.tblId);
        });
    });
};
</script>

<style scoped>
.map-container {
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;
    margin: 0 auto;
}

#map {
    width: 100%;
    height: 100%;
}

/* Search bar style */
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
    /* Add cursor pointer for visual feedback */
}

.search-bar input {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 10px 0 0 10px;
    pointer-events: none;
    /* Disable input interaction */
}

.search-bar button {
    border: none;
    background-color: #007bff;
    color: white;
    padding: 3px;
    border-radius: 0 10px 10px 0;
    cursor: pointer;
}

/* Filter buttons */
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
}

.filter-option {
    flex: 1;
    padding: 10px;
    margin: 0 5px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

/* Return location button */
.return-location-button {
    position: absolute;
    bottom: 20px;
    /* Positioned at the bottom */
    right: 20px;
    /* Positioned to the right */
    z-index: 1;
    background-color: #007bff;
    /* Blue background for the button */
    color: white;
    border: none;
    border-radius: 50%;
    width: 50px;
    /* Adjust button size */
    height: 50px;
    /* Adjust button size */
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    /* Icon size */
    cursor: pointer;
}

/* Floating filter button */
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
</style>
