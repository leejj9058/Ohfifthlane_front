<template>
  <div class="container-fluid d-flex flex-column align-items-center justify-content-center">
    <div class="app-outer d-flex align-items-start justify-content-center">
      <div class="app-container p-4 shadow rounded">
        <button class="btn btn-link text-danger mb-3" @click="goBack">
          <i class="bi bi-arrow-left arrow-icon"></i>
        </button>
        <div
          v-for="(item, index) in displayedReservations"
          :key="index"
          class="card mb-3 p-3 d-flex flex-row justify-content-between align-items-center"
          @click="goToDetail(item)"
        >
          <div>
            <p class="reservation-date"><strong>{{ item.reservationDay }}</strong></p>
            <p><strong>구획번호:</strong> {{ item.rpzNum }}</p>
            <p><strong>주소:</strong> {{ item.rpzAddress }}</p>
            <p><strong>예약시간:</strong> {{ item.reservationStartTime }} ~ {{ item.reservationEndTime }}</p>
          </div>
          <button class="btn btn-danger">길찾기</button>
        </div>
        <button v-if="showMore" class="btn btn-secondary mt-3 w-100" @click="loadMore">더보기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const reservations = ref([]);
const displayedReservations = ref([]);
const itemsToShow = ref(5);
const showMore = ref(true);

// 가라 데이터 정의
const mockData = [
  {
    rpzNum: '001',
    rpzAddress: '서울시 강남구 123',
    reservationDay: '2023-10-29', // 날짜 추가
    reservationStartTime: '10:00',
    reservationEndTime: '11:00',
  },
  {
    rpzNum: '002',
    rpzAddress: '부산시 해운대구 456',
    reservationDay: '2023-10-29',
    reservationStartTime: '11:00',
    reservationEndTime: '12:00',
  },
  {
    rpzNum: '003',
    rpzAddress: '대구시 중구 789',
    reservationDay: '2023-10-29',
    reservationStartTime: '12:00',
    reservationEndTime: '13:00',
  }
];

// fetchReservations 함수 수정
const fetchReservations = async () => {
  try {
    const response = { data: mockData }; // mockData를 응답으로 설정
    reservations.value = response.data;
    loadReservations();
  } catch (error) {
    console.error("예약 정보를 가져오는 데 실패했습니다:", error);
  }
};

const loadReservations = () => {
  displayedReservations.value = reservations.value.slice(0, itemsToShow.value);
};

const loadMore = () => {
  itemsToShow.value += 5;
  displayedReservations.value = reservations.value.slice(0, itemsToShow.value);

  if (displayedReservations.value.length >= reservations.value.length) {
    showMore.value = false;
  }
};

const goToDetail = (item) => {
  console.log('Navigating to detail for:', item);
  router.push({ name: 'rentDetail', query: {
    rpzNum: item.rpzNum,
    rpzAddress: item.rpzAddress,
    reservationDay: item.reservationDay,
    reservationStartTime: item.reservationStartTime,
    reservationEndTime: item.reservationEndTime,
  } });
};

onMounted(fetchReservations);
</script>

<style scoped>
.container-fluid {
  padding-top: 20px;
  overflow-x: hidden;
  width: 460px;
  border-radius: 12px;
}

.app-outer {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-container {
  width: 100%;
  max-width: 460px;
  padding: 1.5rem;
  margin: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.card {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.reservation-date {
  font-weight: bold; /* 굵게 표시 */
  margin-bottom: 0.5rem; /* 구획번호와의 간격 조정 */
}

button.btn-danger {
  white-space: nowrap;
}

.arrow-icon {
  font-size: 1.5rem;
  font-weight: bold;
}
</style>
