<template>
  <header class="header" :class="{ scrolled: isScrolled }">
    <div class="container">
      <div class="logo"  >
        <span class="logo-text">오차로</span>
      </div>
      <nav class="nav" style="margin-right: 100px;">
        <ul>
          <li><a href="#">서비스소개</a></li>
          <li><a href="#">모바일 앱 이용안내</a></li>
          <li><a href="#">주차 공유 안내</a></li>
        </ul>
      </nav>
      <button class="btn btn-primary" style="margin-right: 200px;" @click="goToLogin">로그인 / 회원가입</button>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from "vue";

// router 인스턴스 생성
const router = useRouter();

const goToLogin = () => {
  router.push('/login');
};

const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50; // 스크롤이 50px 이상일 때
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.header {
  position: fixed; /* 상단에 고정 */
  top: 0;
  height: 90px;
  width: 100%;
  padding: 20px 0; /* 패딩 조정 */
  border-bottom: 1px solid #007bff;
  background-color: transparent; /* 기본 배경색을 투명으로 설정 */
  z-index: 1000; /* 다른 요소 위에 표시 */
  transition: background-color 0.3s ease; /* 배경색 변경 시 부드럽게 애니메이션 */
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
