<template>
  <header class="header" :class="{ scrolled: isScrolled }">
    <div class="container">
      <div class="logo">
        <span class="logo-text" style="margin-right: 100px; font-size: 40px;">오차로</span>
      </div>
      <nav class="nav" style="margin-right: 60px;">
        <ul>
          <li><a @click.prevent="goToService">서비스소개</a></li>
          <li><a @click.prevent="goToMobileInfo">주차장 공유</a></li>
          <li><a @click.prevent="goToShareInfo">목적지 주변 주차장 탐색</a></li>
          <li><a @click.prevent="goToQRReport">장애인 QR신고</a></li>
        </ul>
      </nav>
      <div>
        <button v-if="!isLoggedIn" class="btn btn-primary" style="margin-right: 50px;" @click="goToLogin">로그인 / 회원가입</button>
        <div v-else>
          <button class="btn btn-danger" style="margin-right: 20px;" @click="goToReportList">신고내역</button>
          <button class="btn btn-primary" style="margin-right: 50px;" @click="goToLogout">로그아웃</button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from "vue";

const router = useRouter();
const isLoggedIn = ref(false); // 로그인 여부를 나타내는 상태

const goToLogin = () => {
  router.push('/login');
};

const goToReportList = () => {
  router.push('/reportList'); // 신고내역 페이지로 이동
};

const goToLogout = () => {
  // 로그아웃 로직 추가 (예: API 호출 후 상태 변경)
  isLoggedIn.value = false;
  alert("로그아웃되었습니다.");
};

const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50; // 스크롤이 50px 이상일 때
};

onMounted(() => {

  isLoggedIn.value = true; // 테스트를 위해 true로 설정
  window.addEventListener("scroll", handleScroll);
});

const goToService = () => {
  const introSection = document.getElementById("intro-section");
  if (introSection) {
    const offsetTop = introSection.offsetTop; // 섹션의 상단 위치를 계산
    window.scrollTo({
      top: offsetTop - 70, // 50px 정도 위쪽 여유 공간 추가
      behavior: "smooth",
    });
  }
};

const goToMobileInfo = () => {
  const mobileIntroSection = document.getElementById("mobile-intro-section");
  if (mobileIntroSection) {
    const offsetTop = mobileIntroSection.offsetTop; // 섹션의 상단 위치를 계산
    window.scrollTo({
      top: offsetTop - 70, // 50px 정도 위쪽 여유 공간 추가
      behavior: "smooth",
    });
  }
};

const goToShareInfo = () => {
  const shareInfoSection = document.getElementById("share-intro-section");
  if (shareInfoSection) {
    const offsetTop = shareInfoSection.offsetTop;
    window.scrollTo({
      top: offsetTop - 70, // 50px 정도 위쪽 여유 공간 추가
      behavior: "smooth",
    })
  }
}

const goToQRReport = () => {
  const QRReportSection = document.getElementById("QR-intro-section");
  if (QRReportSection) {
    const offsetTop = QRReportSection.offsetTop;
    window.scrollTo({
      top: offsetTop - 50, // 50px 정도 위쪽 여유 공간 추가
      behavior: "smooth",
    })
  }
}

</script>

<style scoped>
.header {
  position: fixed; /* 상단에 고정 */
  top: 0;
  height: 90px;
  width: 100%;
  padding: 20px 0; /* 패딩 조정 */
  background-color: white; /* 기본 배경색을 투명으로 설정 */
  z-index: 1000; /* 다른 요소 위에 표시 */
  transition: background-color 0.3s ease; /* 배경색 변경 시 부드럽게 애니메이션 */
  border-bottom: 1px solid blue;
}

.header.scrolled {
  background-color: rgba(255, 255, 255, 1); /* 약간 투명한 흰색 */
}

.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-text {
  font-size: 2rem; /* 로고 크기 조정 */
  color: #007bff; /* 파란색 글자 */
  font-weight: bold;
}

.nav ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav ul li {
  margin-left: 15px; /* 간격 조정 */
}

.nav ul li a {
  color: #333;
  text-decoration: none;
  font-weight: normal;
  font-size: 1.1rem; /* 메뉴 텍스트 크기 조정 */
}

.nav ul li a:hover {
  text-decoration: underline;
}
</style>
