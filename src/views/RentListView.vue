<template>
  <div class="container-fluid d-flex flex-column align-items-center justify-content-center">
    <div class="app-outer d-flex align-items-start justify-content-center">
      <div class="app-container p-4 shadow rounded">
        <button class="btn btn-link text-danger mb-2" @click="goBack">
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
import axios from 'axios'; // axios import

const router = useRouter();

const reservations = ref([]); // 전체 예약 내역을 저장하는 변수
const displayedReservations = ref([]); // 표시할 예약 내역을 저장하는 변수
const itemsToShow = ref(5); // 한 번에 표시할 예약 내역 개수
const showMore = ref(true); // '더보기' 버튼을 보여줄지 여부

const goBack = () => {
  console.log('눌림')
  window.history.back(); // 브라우저 히스토리에서 뒤로 이동
};

// axios로 실제 데이터 가져오기 대신 mockData 설정
const fetchReservations = async () => {
  try {
    // 실제 API 호출을 대신해 mockData를 사용한 axios 호출 처리
    const response = await axios.get('https://api.example.com/reservations') // 실제 API 경로로 변경해야 함
      .catch(() => {
        // 여기서 mockData를 직접 넣기
        return {
          data: [
            {
              rpzNum: '122-189',
              rpzAddress: '서울 강남구 120-1',
              reservationDay: '2024-11-06',
              reservationStartTime: '14:00',
              reservationEndTime: '16:10',
            },
            {
              rpzNum: '122-101',
              rpzAddress: '서울 강남구 141-15',
              reservationDay: '2024-10-15',
              reservationStartTime: '11:00',
              reservationEndTime: '11:50',
            },
            {
              rpzNum: '101-34',
              rpzAddress: '서울 서초구 154-12',
              reservationDay: '2024-05-21',
              reservationStartTime: '18:30',
              reservationEndTime: '19:50',
            }
          ]
        };
      });

    // 응답 데이터를 reservations에 저장
    reservations.value = response.data;
    loadReservations(); // 받은 데이터를 표시할 목록에 로드
  } catch (error) {
    console.error("예약 정보를 가져오는 데 실패했습니다:", error);
    // 만약 API 호출이 실패하면 mockData 사용
    reservations.value = [
      {
        rpzNum: '122-189',
        rpzAddress: '서울 강남구 120-1',
        reservationDay: '2024-11-06',
        reservationStartTime: '14:00',
        reservationEndTime: '16:10',
      },
      {
        rpzNum: '122-101',
        rpzAddress: '서울 강남구 141-15',
        reservationDay: '2024-10-15',
        reservationStartTime: '11:00',
        reservationEndTime: '11:50',
      },
      {
        rpzNum: '101-34',
        rpzAddress: '서울 서초구 154-12',
        reservationDay: '2024-05-21',
        reservationStartTime: '18:30',
        reservationEndTime: '19:50',
      }
    ];
    loadReservations();
  }
};

// 로드할 예약 목록을 표시
const loadReservations = () => {
  displayedReservations.value = reservations.value.slice(0, itemsToShow.value);
};

// 더보기 버튼 클릭 시 예약 내역을 추가로 로드
const loadMore = () => {
  itemsToShow.value += 5;
  displayedReservations.value = reservations.value.slice(0, itemsToShow.value);

  if (displayedReservations.value.length >= reservations.value.length) {
    showMore.value = false; // 더 이상 표시할 내역이 없으면 '더보기' 버튼 숨김
  }
};

// 예약 상세 페이지로 이동
const goToDetail = (item) => {
  console.log('Navigating to detail for:', item);
  router.push({
    name: 'rentDetail', // 예약 상세 페이지로 이동
    query: {
      rpzNum: item.rpzNum,
      rpzAddress: item.rpzAddress,
      reservationDay: item.reservationDay,
      reservationStartTime: item.reservationStartTime,
      reservationEndTime: item.reservationEndTime,
    }
  });
};

onMounted(fetchReservations); // 컴포넌트가 마운트 될 때 예약 정보를 가져옵니다.
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
