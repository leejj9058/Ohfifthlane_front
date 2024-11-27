<template>
  <div class="container-fluid d-flex flex-column align-items-center justify-content-center">
    <div class="app-outer d-flex align-items-start justify-content-center">
      <div class="app-container p-4 shadow rounded">
        <button class="btn btn-link text-danger mb-2" @click="goBack">
          <i class="bi bi-arrow-left arrow-icon"></i>
        </button>
        
        <div
          v-for="(item, index) in reservations"
          :key="item.rpzNum"
          class="card mb-3 p-3 d-flex flex-row justify-content-between align-items-center"
        >
          <div @click="goToDetail(item)">
            <p class="reservation-date"><strong>{{ item.reservationDay }}</strong></p>
            <p><strong>구획번호:</strong> {{ item.rpzNum }}</p>
            <p><strong>주소:</strong> {{ item.rpzAddress }}</p>
            <p><strong>예약시간:</strong> {{ item.reservationStartTime }} ~ {{ item.reservationEndTime }}</p>
          </div>
          <button class="btn btn-danger" @click="goToResidentReport(item)" style="margin-left: 50px;">신고하기</button>

        </div>
        <button v-if="showMore" class="btn btn-secondary mt-3 " @click="loadMore">더보기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios'; 

const router = useRouter();

const reservations = ref([]); // 전체 예약 내역을 저장하는 변수
// const rpzs = ref([]); // 예약에 있는 거주자 우선 주차구역 리스트
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
    const response = await axios.get('/api/getReservationListByUserId');
      
    // 응답 데이터를 reservations에 저장
    reservations.value = response.data;
    console.log(reservations.value);
    loadReservations(); // 받은 데이터를 표시할 목록에 로드
  } catch (error) {
    console.error("예약 정보를 가져오는 데 실패했습니다:", error);
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
    name: 'reservationDetail', // 예약 상세 페이지로 이동
    query: {
      rpzNum: item.rpzNum,
      rpzAddress: item.rpzAddress,
      reservationDay: item.reservationDay,
      reservationStartTime: item.reservationStartTime,
      reservationEndTime: item.reservationEndTime,
    }
  });
};

// 컴포넌트가 마운트 될 때 예약 정보를 가져옵니다.
onMounted(() => {

  fetchReservations();
  
});

const goToResidentReport = (item) => {
  router.push({ 
    path: "/residentReport", 
    query: { rpzNum: item.rpzNum }}); //일단 구획번호만 넘김
};

</script>

<style scoped>
.container-fluid {
  padding-top: 40px;
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
  margin-left: 10px;
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

@media (max-width: 480px) {

  .container-fluid {
    width: 100%; /* 모바일 화면에서 너비를 100%로 설정 */
    max-width: 100%; /* 최대 너비를 제한하지 않음 */
    padding: 10px 0; /* 좌우 padding 제거 */
    overflow-x: hidden; /* 가로 스크롤 숨김 */
  }

  .app-container {
    width: 100%; /* 너비를 100%로 설정 */
    max-width: 100%; /* 최대 너비 제한 없음 */
    padding: 0 10px; /* 좌우 padding 최소화 */
    box-sizing: border-box; /* padding 포함 너비 계산 */
    overflow-x: hidden;
  }

  .card {
    flex-direction: column; /* 세로 배치로 변경 */
    align-items: flex-start; /* 왼쪽 정렬 */
    max-width: 340px;
  }

  .card > div {
    width: 100%; /* 텍스트 부분이 전체 너비를 사용 */
    margin-bottom: 10px; /* 텍스트와 버튼 사이 간격 */
  }

  button.btn-danger {
    margin-top: 50px; /* 텍스트 아래 간격 추가 */
    align-self: flex-start; /* 버튼을 왼쪽 정렬 */
  }

  /* 더보기 버튼 스타일 */
  .btn-secondary {
    width: 340px; /* 모바일 화면에서 너비를 340px로 고정 */
    max-width: 100%; /* 화면보다 더 커지지 않도록 */
    margin: 0 auto; /* 가운데 정렬 */
    display: block; /* 가운데 정렬 보장을 위해 block 설정 */
  }
}




</style>
