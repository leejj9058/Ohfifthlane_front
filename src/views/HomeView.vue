<template>
  <div>
    <Header />

    <!-- 컨테이너 중앙 정렬 -->
    <div class="container-fluid d-flex flex-column align-items-center justify-content-center" >
      
      <!-- 검색창 -->
      <div class="search-container" style="width: 460px;">
        <div class="input-group">
          <input type="text" class="rounded-search form-control" placeholder="어디로 갈까요?" />
          <span class="input-group-text">
            <i class="fas fa-search"></i>
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
            <div class="card mb-3 p-3 shadow-sm custom-card d-flex flex-column justify-content-center align-items-center" style="height: 140px; width: 200px" @click="goToDisabledParking">
              <img src="@/assets/images/parkingd.png" style="height: 60px;"  />
              <h6 class="mt-3" style="font-weight: bold;">거주자 주차신고</h6>
            </div>
            <div class="card p-3 shadow-sm custom-card d-flex flex-column justify-content-center align-items-center" style="height: 140px; width: 200px; margin-top: 20px; " @click="goToParkingReport">
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
          <li v-for="(post, index) in posts" :key="index" class="d-flex justify-content-between align-items-center py-2 border-bottom">
            <span>{{ post.title }}</span>
            <span class="text-muted">{{ post.date }}</span>
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
import { useRouter } from "vue-router";
import Header from "@/components/Header.vue";
import router from "@/router";

const posts = ref([]);

// 공지사항 데이터 가져오기
const fetchPosts = async () => {
  try {
    const response = {
      data: [
        { title: " 첫 번째 게시글", date: "2024-10-01" },
        { title: " 두 번째 게시글", date: "2024-10-02" },
        { title: " 세 번째 게시글", date: "2024-10-03" },
      ],
    };
    posts.value = response.data;
  } catch (error) {
    console.error("공지사항을 불러오는 중 오류가 발생했습니다.", error);
  }
};

onMounted(() => {
  fetchPosts();
});

const goToMyPage = () => {
  router.replace({ path: "/mypage", query: {} });
};

const goToPublicParking = () => {
  router.replace({ path: "/publicparking", query: {} });
};

const goToDisabledParking = () => {
  router.replace({ path: "/disabledparking", query: {} });
};

const goToParkingReport = () => {
  router.replace({ path: "/parkingreport", query: {} });
};

const goToNoticePage = () => {
  router.replace({ path: "/notice", query: {} });
};

const goToReservationHistory = () => {
  router.replace({ path: "/reservationHistory", query: {} });
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
