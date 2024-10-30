<template>
  <div :class="['header-container', { 'mobile-header': isMobile }]">
    <div v-if="isMobile" class="mobile-top-bar">
      <button @click="toggleSidebar" class="sidebar-toggle">
        <i class="bi bi-list"></i>
      </button>
      <h1 class="logo-text">주 차</h1>
    </div>

    <div :class="['sidebar', { 'sidebar-open': sidebarOpen }]">
      <div class="logo-container" v-if="!isMobile">
        <img width="50" height="50" src="https://img.icons8.com/fluency/48/car--v1.png" alt="car-icon" />
        <h1 class="logo-text">주 차</h1>
      </div>

      <nav class="nav-menu text-center">
        <button class="btn btn-primary" @click="goToLogin">로그인 / 회원가입</button>
        <hr class="my-4" />
        <ul class="nav-list" style="font-size: 20px;">
          <li><a @click="moveView">회원정보수정</a></li>
          <li><a @click="moveView">내 주차장 관리</a></li>
          <li><a @click="moveView('/setparking')">주차장 등록하기</a></li>
          <hr class="my-4" />
          <li><a @click="moveView">주차장 예약</a></li>
          <li><a @click="moveView">최근신고내역</a></li>
          <hr class="my-4" />
          <li><a @click="moveView('/notice')">공지사항</a></li>
          <li><a @click="moveView('/board')">문의사항</a></li>
          <li><a @click="moveView('/board')">교환소</a></li>
        </ul>
      </nav>

      <!-- 오버레이 추가 : 사이드바가 생겼을 때 뒤에 반투명 오버레이 -->
      <div v-if="isMobile && sidebarOpen" class="sidebar-overlay" @click="closeSidebar"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isMobile = ref(false);
const sidebarOpen = ref(false);

const goToLogin = () => {
  router.push('/login');
};

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
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});
</script>

<style scoped>
.header-container {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 200px;
  background-color: #f8f9fa;
  transition: all 0.3s ease;
  z-index: 1000;
}

.mobile-header {
  width: 100%;
  height: auto;
}

.mobile-top-bar {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #f8f9fa;
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
  color: #333;
}

.nav-list a:hover {
  cursor: pointer;
  color: rgb(93, 93, 223);
}

/* 오버레이 스타일 추가 */
.sidebar-overlay {
  position: fixed;
  top: 50px;
  left: 250px; /* Fixed value should be 250px, not just 250 */
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

/* 데스크톱 */
@media (min-width: 769px) {
  .header-container {
    width: 250px; /* 데스크톱에서의 너비 */
  }

  .logo-text {
    font-size: 28px; /* 로고 텍스트 크기 증가 */
  }

  .nav-menu {
    padding: 30px; /* 네비게이션 메뉴 패딩 증가 */
  }

  .nav-list li {
    margin: 15px 0; /* 메뉴 항목 간 간격 증가 */
  }

  .nav-list a {
    font-size: 18px; /* 메뉴 항목 글자 크기 증가 */
  }
}

/* 모바일 */
@media (max-width: 768px) {
  .header-container {
    width: 100%;
    height: auto;
  }

  .sidebar {
    position: fixed;
    top: 50px; /* 모바일 상단 바 높이에 맞춰 조정 */
    left: -250px; /* 사이드바 너비에 맞춰 조정 */
    width: 250px;
    height: calc(100vh - 50px);
    background-color: #f8f9fa;
    transition: left 0.3s ease;
  }

  .sidebar-open {
    left: 0;
  }

  .mobile-top-bar .logo-text {
    font-size: 20px; /* 모바일 상단 바의 로고 텍스트 크기 */
  }

  .nav-list {
    font-size: 18px; /* 모바일에서의 메뉴 항목 글자 크기 */
  }

  .nav-list li {
    margin: 15px 0; /* 모바일에서의 메뉴 항목 간격 */
  }

  .nav-menu {
    padding: 15px; /* 모바일에서의 네비게이션 메뉴 패딩 */
  }

  .sidebar {
    z-index: 1001; /* 오버레이보다 높은 z-index */
  }

  .mobile-top-bar {
    z-index: 1002; /* 사이드바와 오버레이보다 높은 z-index */
  }

  .sidebar-overlay {
    left: 250px; /* 사이드바가 열렸을 때의 너비 */
    transition: left 0.3s ease; /* 부드러운 전환 효과 */
  }

  .sidebar-open + .sidebar-overlay {
    left: 0; /* 사이드바가 열렸을 때 오버레이를 왼쪽으로 이동 */
  }
}
</style>
