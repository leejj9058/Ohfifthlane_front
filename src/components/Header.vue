<template>
  <div :class="['header-container', { 'mobile-header': isMobile }]">
    <div v-if="isMobile" class="mobile-top-bar">
      <button @click="toggleSidebar" class="sidebar-toggle">
        <i class="bi bi-list" ></i>
      </button>
      <h1 class="logo-text ps-3" @click="goToHome" >오차로</h1>
    </div>

    <div :class="['sidebar', { 'sidebar-open': sidebarOpen }]">
      <div class="logo-container" v-if="!isMobile">
        <img width="100" height="100" src="@/assets/images/111.png" alt="car-icon" @click="goToHome" />
        <h1 class="logo-text">주 차</h1>
      </div>
      
      <nav class="nav-menu text-center">
        <button v-if="accountId == 0" class="btn btn-primary w-100" style="background-color: #A4C8F3;" @click="goToLogin">로그인</button>
        <button v-if="accountId != 0" class="btn btn-primary w-100" style="background-color: #A4C8F3;" @click="goToLogout">로그아웃</button>
        <hr class="my-4" />
        <ul class="nav-list" style="font-size: 20px;">
          <li><a @click="moveView('/updateRegister')">회원정보수정</a></li>
          <li><a @click="moveView('/timeset')">내 주차장 관리</a></li>
          <li><a @click="moveView('/setparking')">주차장 등록하기</a></li>

          <hr class="my-4" />
          <li><a @click="moveView('/notice')">공지사항</a></li>
          <li><a @click="moveView('/board')">문의사항</a></li>
          <li><a @click="moveView('/exchange')">교환소</a></li>
        </ul>
      </nav>

      <button class="btn btn-outline-light mt-3 go-web-button" @click="goToWebPage" style="margin-left: 50px;" >웹으로 이동하기</button>


      <!-- 오버레이 추가 : 사이드바가 생겼을 때 뒤에 반투명 오버레이 -->
      <div v-if="isMobile && sidebarOpen" class="sidebar-overlay" @click="closeSidebar"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from "axios";

const router = useRouter();
const isMobile = ref(false);
const sidebarOpen = ref(false);
const accountId = ref(0);
const goToLogin = () => {
  router.push('/login');
};

const goToHome = () => {
  router.push('/');
};

const goToWebPage = () => {
  router.push('/main');
}

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768; // 768px 이하를 모바일로 간주
};

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

// 사이드바 닫는 함수
const closeSidebar = () => {
  sidebarOpen.value = false;
};

const moveView = (path) => {
  closeSidebar();
  router.push(path);
};

onMounted(() => {
  checkMobile();
  getAccountId();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});

const getAccountId = async () => {
  try {
    const response = await axios.get("/api/getAccountId");

    // 로그인 성공 (상태 코드 200-299)
    if (response.status >= 200 && response.status < 300) {
      accountId.value = response.data;
      console.log(accountId.value);
    } else {
      // 예상치 못한 상태 코드
      throw new Error("Unexpected response status");
    }
  } catch (error) {
    if (error.response) {
      // 서버가 2xx 범위를 벗어나는 상태 코드로 응답한 경우
      console.error(
        "실패:",
        error.response.data.message || "알 수 없는 오류 발생"
      );
    } else if (error.request) {
      // 요청이 전송되었으나 응답을 받지 못한 경우
      console.error("서버 응답 없음");
    } else {
      // 요청 설정 중에 오류가 발생한 경우
      console.error("요청 오류:", error.message);
    }
  }
};

const goToLogout = async () => {
  try {
    const response = await axios.get("/api/goToLogout");

    // 로그인 성공 (상태 코드 200-299)
    if (response.status >= 200 && response.status < 300) {
        accountId.value = response.data;
        console.log("로그아웃" + accountId.value)
    } else {
      // 예상치 못한 상태 코드
      throw new Error("Unexpected response status");
    }
  } catch (error) {
    if (error.response) {
      // 서버가 2xx 범위를 벗어나는 상태 코드로 응답한 경우
      console.error(
        "실패:",
        error.response.data.message || "알 수 없는 오류 발생"
      );
    } else if (error.request) {
      // 요청이 전송되었으나 응답을 받지 못한 경우
      console.error("서버 응답 없음");
    } else {
      // 요청 설정 중에 오류가 발생한 경우
      console.error("요청 오류:", error.message);
    }
  }
};
</script>

<style scoped>

.header-container {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 200px;
  background-color: #124393;
  transition: all 0.3s ease;
  z-index: 1000;
  color: white; /* 전체 글씨 색상을 흰색으로 설정 */
}

.mobile-header {
  width: 100%;
  height: auto;
}

.mobile-top-bar {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #124393;
}

.sidebar-toggle {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}

.logo-text {
  font-size: 24px;
  margin-top: 10px;
}

.nav-menu {
  padding: 20px;
}

.nav-list {
  list-style-type: none;
  padding: 0;
}

.nav-list li {
  margin: 10px 0;
}

.nav-list a {
  text-decoration: none;
  color: white; /* 메뉴 항목 글씨 색상 흰색으로 설정 */
}

.nav-list a:hover {
  cursor: pointer;
  color: rgb(204, 204, 204); /* 마우스를 올렸을 때 색상 변경 */
}

/* 오버레이 스타일 추가 */
.sidebar-overlay {
  position: fixed;
  top: 50px;
  left: -250px; /* Fixed value should be -250px for sidebar */
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.go-home {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer !important;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.go-home {
  transform: scale(1.05);
  opacity: 0.8;
}

.go-home:active {
  transform: scale(0.95);
}

.go-web-button {
  position: absolute;
  bottom: 20px;
}
/* 데스크톱 */
@media (min-width: 769px) {
    .header-container {
        width:250px; /* 데스크톱에서의 너비 */
    }

    .logo-text {
        font-size:28px; /* 로고 텍스트 크기 증가 */
        color:white; /* 로고 텍스트 색상 흰색으로 설정 */
    }

    .nav-menu {
        padding:30px; /* 네비게이션 메뉴 패딩 증가 */
    }

    .nav-list li {
        margin:15px; /* 메뉴 항목 간 간격 증가 */
    }

    .nav-list a {
        font-size:18px; /* 메뉴 항목 글자 크기 증가 */
        color:white; /* 데스크톱에서의 메뉴 항목 글씨 색상 흰색으로 설정 */
    }
}

/* 모바일 */
@media (max-width:768px) {

  .main-content {
    margin-left: 0; /* 모바일에서는 왼쪽 여백 제거 */
    width: calc(100% - 20px); /* 모바일에서는 전체 너비 사용하고 여백 고려 */
    padding: 10px; /* 패딩 조정 */
    box-sizing: border-box; /* 패딩을 포함하여 전체 너비 계산 */
    margin-top: 50px; /* 헤더 높이만큼 마진 추가 */
  }
    .header-container {
        width:100%;
        height:auto; 
    }

    .sidebar {
        position:fixed; 
        top:50px; /* 모바일 상단 바 높이에 맞춰 조정 */
        left:-250px; /* 사이드바 너비에 맞춰 조정 */
        width:250px; 
        height:100vh;
        background-color: #124393;
        transition:left .3s ease; 
    }

    .sidebar-open { 
        left :0; 
    }

    .mobile-top-bar .logo-text { 
        font-size :20px; /* 모바일 상단 바의 로고 텍스트 크기 */ 
        color:white; /* 로고 텍스트 색상 흰색으로 설정 */ 
    }

    .nav-list { 
        font-size :18px; /* 모바일에서의 메뉴 항목 글자 크기 */ 
        color:white; /* 모바일에서의 메뉴 항목 글씨 색상 흰색으로 설정 */ 
    }

    .nav-list li { 
        margin :15px ; /* 모바일에서의 메뉴 항목 간격 */ 
    }

    .nav-menu { 
        padding :15px ; /* 모바일에서의 네비게이션 메뉴 패딩 */ 
    }

    .sidebar { 
        z-index :1001 ; /* 오버레이보다 높은 z-index */ 
    }

    .mobile-top-bar { 
        z-index :1002 ; /* 사이드바와 오버레이보다 높은 z-index */ 
    }

    .sidebar-overlay { 
        left :250px ; /* 사이드바가 열렸을 때의 너비 */ 
        transition:left .3s ease ; /* 부드러운 전환 효과 */ 
    }

    .sidebar-open + .sidebar-overlay { 
        left :0 ; /* 사이드바가 열렸을 때 오버레이를 왼쪽으로 이동 */ 
    }
    .go-web-button {
     position: absolute;
     bottom: 80px;
    }
}

</style>