<template>
  <div>
    <Header />

    <!-- 컨테이너 중앙 정렬 -->
    <div class="container-fluid d-flex flex-column align-items-center justify-content-center ">



      <!-- 검색창 -->
      <div class="search-container mb-3" style="width: 460px;">
        <div class="input-group searchBar d-flex align-items-center" style="color: rgb(99, 157, 224);">
          <i class="bi bi-geo-alt-fill fs-4 ms-3" style="background-color: white;"></i>
          <input type="text" class="rounded-search form-control ms-1" style="border: none;" placeholder="어디로 갈까요?"
            v-model="destination" @focus="searchDestination()" />
          <button class="search-button">
            <i class="bi bi-search fs-4 me-2"></i>
          </button>
        </div>
      </div>

      <!-- 카드 섹션 -->
      <section class="my-1 text-center">
        <div class="d-flex justify-content-center">
          <!-- 왼쪽 큰 카드 -->
          <div class="d-flex justify-content-center">
            <!-- 왼쪽 큰 카드 -->
            <div class="me-3">
              <div class="card custom-card big-card" @click="goToPublicParking">
                <div class="card-image-container">
                  <img src="@/assets/images/main11.png" alt="거주자 우선주차" class="card-image" />
                </div>
                <div class="card-content">
                  <h6 class="mt-3" style="font-weight: bold; font-size: 25px; color:white;">공유 주차장 찾기</h6>
                  <div style="color: white;">
                    <p class="mt-0 mb-0 text-start" style="font-size: 12px;">내 근처 공유된 </p>
                    <p class="text-start" style="font-size: 12px;">주차장을 찾을 수 있어요 </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 오른쪽 두 개의 작은 카드 -->
          <div class="d-flex flex-column align-items-end">

            <div class="card custom-card miniCard small-card mb-3 shadow-sm" style="height: 140px; width: 200px"
              @click="goToResidentReport">
              <div class="card-image-container">
                <img src="@/assets/images/main33.png" class="card-image" />
              </div>

              <div class="card-content " style="width: 100%; padding: 10px;">
                <h6 class="mb-0 text-end" style="font-weight: bold; font-size: 19px;">거주자</h6>
                <h6 class="mb-0 text-end" style="font-weight: bold; font-size: 19px;">우선주차 구역 신고</h6>
                <p class="mt-0 mb-0 text-end" style="font-size: 12px;">부정주차 신고</p>

                <div class="text-start">
                  <img src="@/assets/images/w2.png" class="card-image text-end" style="width: 50px;" />
                </div>
              </div>

              <div class="overlay d-flex flex-column">
                <i class="bi bi-exclamation-triangle"></i>
                <p style="color: white !important;">신 고</p>
              </div>
            </div>

            <div class="card custom-card small-card shadow-sm p-0" style="height: 140px; width: 200px;"
              @click="goToQRcode">
              <div class="card-image-container">
                <img src="@/assets/images/main22.png" class="card-image" />
              </div>

              <div class="card-content" style="width: 100%; padding: 10px;">
                <h6 class="mb-0 text-end" style="font-weight: bold; font-size: 19px;">장애인 주차구역 신고</h6>
                <p class="mt-0 mb-0 text-end w-100" style="font-size: 12px;">불법주차 QR신고</p>

                <div class="text-start mt-3">
                  <img src="@/assets/images/w2.png" class="card-image text-start" style="width: 50px;" />
                </div>
              </div>

              <div class="overlay d-flex flex-column">
                <i class="bi bi-exclamation-triangle"></i>
                <p style="color: white !important;">신 고</p>
              </div>
            </div>

          </div>
          <!-- 오른쪽 두 개의 작은 카드 -->
        </div>


        <!-- 내 예약내역 확인 카드 -->
        <div class="d-flex justify-content-center mt-4 mb-3">
          <div class="card d-flex flex-row p-3 shadow-sm custom-card justify-content-center align-items-center"
            style="height: 60px; width: 420px; background-color:white;" @click="goToReservationHistory">
            <i class="bi bi-calendar-check d-flex align-items-center me-3 fs-4"></i>
            <h6 class="m-0 d-flex align-items-center" style="font-weight: bold;">내 예약내역 확인</h6>
          </div>
        </div>


      </section>

      <!-- 공지사항 섹션 -->
      <section class="board-section my-1 text-center">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h3 class="fw-bold">놓치면 안 되는 소식</h3>
          <button class="btn btn-primary animated-button" style="background-color: rgb(99, 157, 224); border: none"
            @click="goToNoticePage">더보기</button>
        </div>
        <ul class="list-unstyled">
          <li v-for="post in notices" :key="post.noticeId"
            class="d-flex justify-content-between align-items-center py-2 border-bottom"
            @click="goNoticeDetail(post.noticeId)">
            <span>{{ post.noticeTitle }}</span>
            <span class="text-muted">{{ formatDate(post.noticeDate) }}</span>
          </li>
        </ul>
      </section>

      <!-- 영상 섹션 -->
      <section class="video-section mt-4 text-center" style=" border: none; " >
        <h3 class="fw-bold">우리 앱이 처음이신가요?</h3>
        <p class="mb-0">오차로를 소개합니다~</p>
        <!-- autoplay, loop, muted 속성 추가 -->
        <video class="mt-0" width="420" height="300" autoplay loop muted style="border-radius: 40px !important; overflow: hidden;">
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

// 날짜 형식 변환
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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

const goToResidentReport = () => {
  router.replace({ path: "/residentReport", query: {} });
};

const goToQRcode = () => {
  router.replace({ path: "/qrcode", query: {} });
};

const goToNoticePage = () => {
  router.replace({ path: "/notice", query: {} });
};

const goToReservationHistory = () => {
  router.push("/rentList");
};
</script>

<style scoped>

.searchBar {
  border-radius: 50px;
  overflow: hidden;
  border: 3px solid rgb(99, 157, 224);
  background-color: white;
}


.card-content {
  position: absolute;
  font-size: 30px !important;
  color: white;
  padding: 20px;
  text-shadow: 2px 4px 3px rgba(51, 50, 50, 1);
  /* 수평, 수직, 흐림, 투명도 */
  text-shadow:
    -1px -1px 0 #000,
    1px -1px 0 #000,
    -1px 1px 0 #000,
    1px 1px 0 #000;
}


.custom-card {
  height: 300px;
  width: 200px;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
  border: none;
}



.card-image-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.8;
  /* 투명도 조절 (0.0 ~ 1.0) */
}


.custom-card:hover .overlay {
  opacity: 1;
}

.overlay i {
  font-size: 50px;
  color: white;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}



@keyframes blink {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.container-fluid {
  padding-top: 20px;
  overflow-x: hidden;
}

.card {
  border: none;
  border-radius: 12px;
  transition: transform 0.2s, box-shadow 0.2s;

}

.custom-card:hover {
  transform: scale(1.03);
  box-shadow: 0 6px 20px rgba(127, 163, 175, 0.2);
  background-color: #e0f7ff;
  /* 연한 파란색 배경 */
}

.board-section {
  background-color: #fff;
  border-radius: 12px;
  border: none;
  padding: 20px;
  width: 460px;
  box-shadow: 0 6px 20px rgba(114, 114, 114, 0.1);

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

  border-radius: 50%;
}

.list-unstyled li:hover {
  background-color: #f0f8ff;
}

.animated-button {
  /* //transition: transform 0.3s ease; */
  transition: background-color 0.3s ease, transform 0.2s ease;
  /* 배경색과 변형에 대한 부드러운 전환 */
  /* 애니메이션 부드럽게 */
}

.animated-button:hover {
  background-color: rgb(79, 155, 224);
  /* 마우스를 올렸을 때 색상 변화 */
  transform: scale(1.05);
  /* 마우스를 올렸을 때 살짝 확대 */
  /* transform: rotate(360deg); */
  /* 마우스를 올렸을 때 360도 회전 */
}

.animated-button:active {
  transform: scale(0.95);
  /* 클릭 시 살짝 축소 */
  /* transform: scale(1.1); */
  /* 클릭 시 살짝 확대 */
}

/* 아이콘에 적용할 애니메이션 */
.animated-icon {
  width: 90px;
  animation: bounce 1.5s infinite ease-in-out;
  /* bounce 애니메이션 */
  /* width: 90px;
  animation: bounce 1.5s infinite ease-in-out; */
  /* bounce 애니메이션 */
}

.search-button {
  background: none; /* 배경 제거 */
  border: none; /* 테두리 제거 */
  color: rgb(99, 157, 224); /* 아이콘 색상 설정 */
  cursor: pointer; /* 커서를 포인터로 변경 */
  transition: transform 0.2s ease; /* 부드러운 전환 효과 */
}

/* bounce 애니메이션 정의 */
@keyframes bounce {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}


</style>
