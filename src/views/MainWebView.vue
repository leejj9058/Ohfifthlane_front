<template>
  <WebHeaderView />

  <section class="centered-section" style="text-align: left; padding-left: 10px; ">
  <div class="container">
    <div class="row">
      <!-- 왼쪽 열 -->
      <div class="col-md-6 text-section">
        <div class="spacer mb-3"></div>
          <h1 class="fw-bold">주차가 걱정될 때</h1>
          <h2 class="fw-bold">대한민국 1등 주차 플랫폼</h2>
          <h1 class="fw-bold">(OH!)차로</h1>
      </div>

      <!-- 오른쪽 열: 이미지 -->
      <div class="col-md-6 image-section">
        <img src="@/assets/images/realmainparking.png" alt="메인 이미지" class="responsive-image" style="width: 700px; height: 400px"/>
      </div>
    </div>
  </div>
</section>

  <!-- 첫 번째 섹션: 왼쪽에서 날아오는 애니메이션 적용 -->
  <section>
    <div class="container" id="intro-section">
      <div class="row">
        <!-- 왼쪽 열 -->
        <div class="col-md-6">
          <div class="spacer mb-3"></div>
          <h3 class="subheading text-primary">거주자 우선주차 쉐어링 | 거주자 우선주차 신고 | 장애인QR신고</h3>
        <h2 class="main-heading fw-bold">한번에 해결하는 ALL IN ONE 플랫폼<br>(OH!)차로</h2>
        <p>웹 과 모바일에 최적화된 화면을 제공합니다.</p>
          <button class="btn btn-primary mt-3 px-4 py-3" @click="goToHome">
            오차로 사용하기
          </button>
        </div>

        <!-- 오른쪽 열: 왼쪽에서 날아오는 애니메이션 -->
        <div class="col-md-6">
          <div class="spacer mb-3"></div>
          <img src="@/assets/images/maincapture.png" class="animated-icon fade-in-down scroll-animate" style="height: 400px;"/>
        </div>
      </div>
    </div>
  </section>

  <!-- 두 번째 섹션: 오른쪽에서 날아오는 애니메이션 적용 -->
  <section>
    <div class="container" id="mobile-intro-section">
      <div class="row">
        <!-- 왼쪽 열 -->
        <div class="col-md-6">
          <div class="spacer mb-3"></div>
          <h4 class="subheading text-primary">구석구석 주차장 공유</h4>
          <h2 class="main-heading fw-bold">한칸의 주차공간으로도<br>수익을 창출 할 수 있어요.</h2>
          <p>집 앞, 가게 앞 공간을 자유롭게 공유하고,<br>부가 수익을 얻을 수 있습니다.<br>다른 사람이 공유한 주차장도 쉽게 이용 가능합니다.</p>
        </div>

        <!-- 오른쪽 열: 오른쪽에서 날아오는 애니메이션 -->
        <div class="col-md-6">
          <div class="spacer mb-3"></div>
          <img src="@/assets/images/shareimage.png" class="animated-icon fade-in-left scroll-animate" style="height: 400px;" />
        </div>
      </div>
    </div>
  </section>

  <!-- 세 번째 섹션: 위에서 아래로 날아오는 애니메이션 적용 -->
  <section>
    <div class="container" id="share-intro-section">
      <div class="row">
        <!-- 왼쪽 열 -->
        <div class="col-md-6">
          <div class="spacer mb-3"></div>
          <h4 class="subheading text-primary">목적지 주변의 주차장</h4>
          <h1 class="fw-bold">목적지 주변의</h1>
          <h2 class="fw-bold">주차장을 찾을 수 있어요</h2>
          <p>목적지 주변 주차장들의 요금, 위치, 시간 정보를,<br>편리하게 확인하고 이용해보세요.</p>
        </div>

        <!-- 오른쪽 열: 위에서 아래로 날아오는 애니메이션 -->
        <div class="col-md-6">
          <div class="spacer mb-3"></div>
          <img src="@/assets/images/tabletimage.png" class="animated-icon fade-in-right scroll-animate" style="height: 400px;" />
        </div>
      </div>
    </div>
  </section>

  <!-- 네 번째 섹션: 아래에서 올라오는 애니메이션 적용 -->
  <section>
    <div class="container" id="QR-intro-section">
      <div class="row">
        <!-- 왼쪽 열 -->
        <div class="col-md-6">
          <div class="spacer mb-3"></div>
          <h1 class="fw-bold">장애인 주차구역에서</h1>
          <h2 class="fw-bold">불법주정차가 의심된다면</h2>
          <p>장애인차량에 표지가 없거나,<br>장애인 차량인지 의심된다면.<br>장애인 주차 표지의 QR을 찍어서 확인하세요!</p>
        </div>

        <!-- 오른쪽 열: 아래에서 올라오는 애니메이션 -->
        <div class="col-md-6">
          <div class="spacer mb-3"></div>
          <img src="@/assets/images/Qrreport.png" class="animated-icon fade-in-up scroll-animate" style="height: 400px; " />
        </div>
      </div>
    </div>
  </section>

  <footerView/>
</template>

<script setup>
import { useRouter } from "vue-router";
import WebHeaderView from "@/components/WebHeaderView.vue";
import footerView from "@/components/footerView.vue";

const router = useRouter();

const goToHome = () => {
  router.replace({ path: "/", query: {} });
};

// 스크롤 이벤트를 문서에 추가합니다.
document.addEventListener("scroll", function() {
  // 클래스명이 'scroll-animate'인 모든 요소를 선택합니다.
  const elements = document.querySelectorAll(".scroll-animate");
  // 현재 창의 높이(뷰포트 높이)를 가져옵니다.
  const windowHeight = window.innerHeight;

  // 선택된 각 요소에 대해 반복문을 실행합니다.
  elements.forEach((element) => {
    // 요소의 상단이 뷰포트 상단으로부터 얼마나 떨어져 있는지 계산합니다.
    const positionFromTop = element.getBoundingClientRect().top;

    // 요소의 상단이 하단에서 100픽셀 이상 위에 있을 경우
    if (positionFromTop - windowHeight <= -50) {
      // 해당 요소에 'clear' 클래스를 추가하여 애니메이션을 시작합니다.
      element.classList.add("clear");
    }
  });
});

</script>

<style scoped>
/* 중앙에 정렬된 섹션 스타일 */
.centered-section {
  padding: 60px 0;
  display: flex;
  text-align: center;
  background-color: #e0f7ff;
}


.subheading {
  font-size: 1.5rem;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 5px;
  white-space: nowrap;
}

.main-heading {
  font-size: 2rem;
  line-height: 1.5;
  color: #333;
}

/* 왼쪽에서 날아오는 애니메이션 */
.fade-in-left {
  opacity: 0;
  transform: translateX(-100px);
  transition: opacity 0.6s ease, transform 0.6s ease;
  margin-left: 40px;
}

.fade-in-left.clear {
  opacity: 1;
  transform: translateX(0);
}

/* 오른쪽에서 날아오는 애니메이션 */
.fade-in-right {
  opacity: 0;
  transform: translateX(100px);
  transition: opacity 0.6s ease, transform 0.6s ease;
  margin-left: 110px;
}

.fade-in-right.clear {
  opacity: 1;
  transform: translateX(0);
}

/* 아래에서 올라오는 애니메이션 */
.fade-in-up {
  opacity: 0;
  transform: translateY(100px);
  transition: opacity 0.6s ease, transform 0.6s ease;
  margin-left: 350px;
}

.fade-in-up.clear {
  opacity: 1;
  transform: translateY(0);
}

/* 위에서 아래로 내려오는 애니메이션 */
.fade-in-down {
  opacity: 0;
  transform: translateY(-100px);
  transition: opacity 0.6s ease, transform 0.6s ease;
  margin-left: 250px;
}

.fade-in-down.clear {
  opacity: 1;
  transform: translateY(0);
}

h1,
h2 {
  line-height: 1.5;
  font-size: 2rem;
}

.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 50px;
}

.spacer {
  height: 20px;
}
</style>
