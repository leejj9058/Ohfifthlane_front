<template>
  <div>
    <Header />

    <!-- 컨테이너 중앙 정렬 -->
    <div class="container-fluid d-flex flex-column align-items-center justify-content-center" >
      
      <!-- 검색창 -->
      <div class="search-container" style="width: 460px;">
        <div class="input-group">
          <input type="text" class="rounded-search form-control" placeholder="어디로 갈까요?" v-model="destination" />
          <span class="input-group-text">
            <i class="bi bi-search" @click="searchDestination()"></i>
          </span>
        </div>
      </div>

      <!-- 카드 섹션 -->
      <section class="board-section my-1 text-center">
        <div class="d-flex justify-content-center">
          <!-- 왼쪽 큰 카드 -->
          <div class="me-3">
            <div class="card p-3 shadow-sm custom-card d-flex flex-column justify-content-center align-items-center" style="height: 300px; width: 200px; " @click="goToPublicParking">
              <img src="@/assets/images/parking.png" class="animated-icon" style="height: 90px" />
              <h6 class="mt-3" style="font-weight: bold;" >거주자 우선주차</h6>
            </div>
          </div>

          <!-- 오른쪽 두 개의 작은 카드 -->
          <div>
            <div class="card mb-3 p-3 shadow-sm custom-card d-flex flex-column justify-content-center align-items-center" style="height: 140px; width: 200px" @click="goToReportResident">
              <img src="@/assets/images/parkingd.png" style="height: 60px;"  />
              <h6 class="mt-3" style="font-weight: bold;">거주자 주차신고</h6>
            </div>
            <div class="card p-3 shadow-sm custom-card d-flex flex-column justify-content-center align-items-center" style="height: 140px; width: 200px; margin-top: 20px; " @click="goToQRcode">
              <img src="@/assets/images/parkingdd.png" style="height: 60px" />
              <h6 class="mt-3" style="font-weight: bold;">장애인 QR신고</h6>
            </div>
          </div>
        </div>
        <!-- 내 예약내역 확인 카드 -->
        <div class="d-flex justify-content-center mt-4">
          <div class="card p-3 shadow-sm custom-card d-flex flex-column justify-content-center align-items-center" style="height: 60px; width: 420px" @click="goToReservationHistory">
            <h6 class="m-0" style="font-weight: bold;">내 예약내역 확인</h6>
          </div>
        </div>
      </section>

      <!-- 공지사항 섹션 -->
      <section class="board-section my-1 text-center">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h3 class="fw-bold">공지사항</h3>
          <button class="btn btn-primary animated-button" style="background-color: #add8e6; border: none" @click="goToNoticePage">+</button>
        </div>
        <ul class="list-unstyled">
          <li v-for="post in notices" :key="post.noticeId" class="d-flex justify-content-between align-items-center py-2 border-bottom"  @click="goNoticeDetail(post.noticeId)">
            <span>{{ post.noticeTitle }}</span>
            <span class="text-muted">{{ post.noticeDate }}</span>
          </li>
        </ul>
      </section>

      <!-- 영상 섹션 -->
      <section class="video-section my-1 text-center">
        <h3 class="fw-bold">우리 앱이 처음이신가요?</h3>
        <!-- autoplay, loop, muted 속성 추가 -->
        <video width="420" height="315" autoplay loop muted>
          <source src="@/assets/video/video.mp4" type="video/mp4" />
        </video>
      </section>  
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import Header from "@/components/Header.vue";
import router from "@/router";
import axios from 'axios';

// 공지사항 
const notices = ref([]);

// 목적지 입력값 
const destination = ref('');

// 목적지 입력 후 검색 시 검색 페이지로 값 가지고 이동
const searchDestination = () => {
  console.log(destination.value)
  
  router.push(`/search/${destination.value}`);
};

// 공지사항 클릭 시 상세 페이지로 이동
const goNoticeDetail = (noticeId) => {
  console.log(noticeId)
  
  router.push(`/boardDetail/${noticeId}`);
};

const posts = ref([]);

// 공지사항 데이터 가져오기
const fetchPosts = async () => {
  try {
    const response = await axios.post('/api/getNotice');
    // 공지사항 불러오기 성공 (상태 코드 200-299)
    if (response.status >= 200 && response.status < 300) {
      notices.value = response.data;
    } else {
      // 예상치 못한 상태 코드
      throw new Error('Unexpected response status');
    }
  } catch (error) {
    if (error.response) {
      // 서버가 2xx 범위를 벗어나는 상태 코드로 응답한 경우
      console.error('공지사항 실패:', error.response.data.message || '알 수 없는 오류 발생');
    } else if (error.request) {
      // 요청이 전송되었으나 응답을 받지 못한 경우
      console.error('서버 응답 없음');
    } else {
      // 요청 설정 중에 오류가 발생한 경우
      console.error('요청 오류:', error.message);
    }
  }
};

onMounted(() => {
  fetchPosts();
});

const goToPublicParking = () => {
  router.replace({ path: "/map", query: {} });
};

const goToReportResident = () => {
  router.replace({ path: "/reportresident", query: {} });
};

const goToQRcode = () => {
  router.replace({ path: "/qrcode", query: {} });
};

const goToNoticePage = () => {
  router.replace({ path: "/notice", query: {} });
};

const goToReservationHistory = () => {
  router.replace({ path: "/rentList", query: {} });
};
</script>

<style scoped>


.container-fluid {
  padding-top: 20px;
  overflow-x: hidden;
}

.card {
  border-radius: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 8px 16px rgba(0, 191, 255, 0.1);
}

.custom-card:hover {
  transform: scale(1.03);
  box-shadow: 0 6px 20px rgba(0, 191, 255, 0.2);
  background-color: #e0f7ff; /* 연한 파란색 배경 */
}

.board-section {
  background-color: #fff;
  border-radius: 12px;
  border: 1px solid #ddd;
  padding: 20px;
  width: 460px;
  
}

.video-section {
  background-color: #fff;
  border-radius: 12px;
  border: 1px solid #ddd;
  padding: 20px;
  width: 460px;
}

.list-unstyled li {
  position: relative;
  padding-left: 10px;
  cursor: pointer;
}

.list-unstyled li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  background-color: #00c6ff;
  border-radius: 50%;
}

.list-unstyled li:hover {
  background-color: #f0f8ff;
}

.animated-button {
  transition: transform 0.3s ease; /* 애니메이션 부드럽게 */
}

.animated-button:hover {
  transform: rotate(360deg); /* 마우스를 올렸을 때 360도 회전 */
}

.animated-button:active {
  transform: scale(1.1); /* 클릭 시 살짝 확대 */
}

/* 아이콘에 적용할 애니메이션 */
.animated-icon {
  width: 90px;
  animation: bounce 1.5s infinite ease-in-out; /* bounce 애니메이션 */
}

/* bounce 애니메이션 정의 */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
