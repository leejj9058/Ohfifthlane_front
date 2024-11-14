<template>
  <div>
    <Header />

    <!-- 전체 페이지 컨테이너 -->
    <div class="container-fluid d-flex flex-column align-items-center justify-content-center   vh-100">
      
      <!-- 잔여 포인트 섹션 -->
      <section class="point-balance-section text-center mt-0">
        <div class="d-flex align-items-center justify-content-between w-100 mb-3">
          <!-- 뒤로가기 버튼 -->
          <button class="btn btn-link" @click="goBack">
            <i class="bi bi-arrow-left arrow-icon"></i>
          </button>
          </div>
          <!-- 교환소 제목 -->
          <h4 class="fw-bold text-center">교환소</h4>
        
        <div class="point-info d-flex align-items-center justify-content-between">
          <span>{{ userName }}님</span>
          <div class="d-flex align-items-center">
            <img
              src="@/assets/images/coin.png"
              class="coin-icon me-1"
              alt="포인트 아이콘"
            />
            <span>{{ userPoint }}p</span>
          </div>
        </div>
      </section>

      <!-- 상단 교환소 섹션 -->
      <section class="point-exchange-section text-center">
        <h4 class="fw-bold">문화상품권 교환</h4>

        <!-- 상품 1 -->
        <div
          class="product-item d-flex align-items-center justify-content-between mb-4"
          style="margin-top: 20px"
        >
          <div class="d-flex align-items-center">
            <img
              src="@/assets/images/5000.png"
              alt="상품 이미지"
              class="product-image me-3"
            />
            <div class="d-flex flex-column align-items-start" style="margin-left: 20px">
              <span style="font-weight: bold;">5000원권</span>
              <span class="product-price"> 교환가 : 5000p</span>
            </div>
          </div>
          <div class="count-controls d-flex align-items-center">
            <button class="btn btn-outline-secondary" @click="decreaseCount(0)">
              -
            </button>
            <span class="mx-2">{{ count[0] }}</span>
            <button class="btn btn-outline-secondary" @click="increaseCount(0)">
              +
            </button>
          </div>
        </div>

        <!-- 상품 2 -->
        <div class="product-item d-flex align-items-center justify-content-between mb-4">
          <div class="d-flex align-items-center">
            <img
              src="@/assets/images/10000.png"
              alt="상품 이미지"
              class="product-image me-3"
            />
            <div class="d-flex flex-column align-items-start" style="margin-left: 20px">
              <span style="font-weight: bold;">10000원권</span>
              <span class="product-price"> 교환가 : 10000p</span>
            </div>
          </div>
          <div class="count-controls d-flex align-items-center">
            <button class="btn btn-outline-secondary" @click="decreaseCount(1)">
              -
            </button>
            <span class="mx-2">{{ count[1] }}</span>
            <button class="btn btn-outline-secondary" @click="increaseCount(1)">
              +
            </button>
          </div>
        </div>

        <!-- 상품 3 -->
        <div class="product-item d-flex align-items-center justify-content-between mb-3">
          <div class="d-flex align-items-center">
            <img
              src="@/assets/images/50000.png"
              alt="상품 이미지"
              class="product-image me-3"
            />
            <div class="d-flex flex-column align-items-start" style="margin-left: 20px">
              <span style="font-weight: bold;">50000원권</span>
              <span class="product-price"> 교환가 : 50000p</span>
            </div>
          </div>
          <div class="count-controls d-flex align-items-center">
            <button class="btn btn-outline-secondary" @click="decreaseCount(2)">
              -
            </button>
            <span class="mx-2">{{ count[2] }}</span>
            <button class="btn btn-outline-secondary" @click="increaseCount(2)">
              +
            </button>
          </div>
        </div>
      </section>

      <!-- 하단 교환소 섹션 -->
      <section class="point-checkout-section text-center">
        <h4 class="fw-bold">포인트 교환</h4>
        <div class="point-summary d-flex flex-column align-items-center">
          <div class="d-flex justify-content-between" style="width: 300px">
            <span>보유한 포인트</span>
            <span>{{ userPoint }}p</span>
          </div>
          <div class="d-flex justify-content-between text-danger" style="width: 300px">
            <span>사용예정 포인트</span>
            <span>{{ totalPoint }}p</span>
          </div>
          <div class="d-flex justify-content-between" style="width: 300px">
            <span>총 잔여 포인트</span>
            <span>{{ remainPoint }}p</span>
          </div>
          <button class="btn btn-primary mt-3" style="width: 100px" @click="handleExchange">교환하기</button>
        </div>
      </section>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import Header from "@/components/Header.vue";
import { useRouter } from 'vue-router';  
// 사용자 정보
const userName = ref("");
const userPoint = ref(""); 

// Vue Router 인스턴스 생성
const router = useRouter();

//goBack 함수
const goBack = () => {
  router.go(-1);
};

// 개수 관리 배열
const count = ref([0, 0, 0]);

// 총 사용 예정 포인트 계산
const totalPoint = computed(
  () =>
    count.value[0] * 5000 + count.value[1] * 10000 + count.value[2] * 50000
);

// 잔여 포인트 계산
const remainPoint = computed(() => userPoint.value - totalPoint.value);

// 수량 증가 함수
const increaseCount = (index) => {
  count.value[index] += 1;
};

// 수량 감소 함수
const decreaseCount = (index) => {
  if (count.value[index] > 0) {
    count.value[index] -= 1;
  }
};

// 교환하기 버튼 클릭 핸들러
const handleExchange = () => {
  if (totalPoint.value > userPoint.value) {
    alert("보유 포인트가 부족합니다. 교환할 수 없습니다.");
  } else if (totalPoint.value === 0) {
    alert("교환할 상품을 선택하세요.");
  } else {
    alert("교환이 완료되었습니다!");
    // 추가로 교환 처리 로직을 넣을 수 있습니다.
  }
};

// Axios를 사용하여 데이터베이스에서 사용자 정보 가져오기
onMounted(async () => {
  try {
    const response = await axios.get("/api/exchangePoint"); 
    userName.value = response.data.name;
    userPoint.value = response.data.point;
  } catch (error) {
    console.error("사용자 정보를 가져오는 중 오류 발생:", error);
  }
});
</script>

<style scoped>
.container-fluid {
  padding-top: 20px;
  overflow-x: hidden;
}

.point-balance-section {
  background-color: #fff;
  border-radius: 12px;
  border: 1px solid #ddd;
  padding: 20px;
  width: 460px;

}

.point-info {
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  
}

.coin-icon {
  width: 24px;
  height: 24px;
}

.point-exchange-section,
.point-checkout-section {
  background-color: #fff;
  border-radius: 12px;
  border: 1px solid #ddd;
  padding: 20px;
  width: 100%;
  margin-top: 5px;
  margin-bottom: 5px;
  width: 460px;
}

.product-item {
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.product-image {
  width: 110px;
  height: 50px;
  border-radius: 4px;
  object-fit: cover;
}

.quantity-controls button {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.count-controls button {
  width: 35px; /* 버튼 너비 조정 */
  height: 35px; /* 버튼 높이 조정 */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px; /* 버튼 글자 크기 조정 */
}

/* 모바일 화면 (최대 460px)에서 반응형 스타일 */
@media (max-width: 460px) {
  .point-balance-section,
  .point-exchange-section,
  .point-checkout-section {
    width: 100%;
    max-width: 340px; /* 최대 너비 제한 */
    padding: 10px;
  }

  .point-info {
    padding: 10px;
  }

  .product-item {
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
    width: 100%;
  }

  .product-image {
    width: 100px;
    height: 40px;
  }

  .product-item-text {
    margin-bottom: 5px; /* 텍스트 아래 간격 5px 추가 */
  }

  .product-price {
    white-space: nowrap;
    margin-top: 5px; /* 위쪽 간격 5px 추가 */
  }

  .count-controls button {
    width: 30px;
    height: 30px;
    font-size: 16px;
  }

  .coin-icon {
    width: 20px;
    height: 20px;
  }

  .point-summary {
    width: 100%;
    max-width: 320px;
    gap: 5px;
  }

  .point-summary div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px; /* 좌우 여백 추가 */
    font-size: 14px;
  }

  .product-price {
    font-size: 15px; /* 작은 화면에서는 글자 크기 줄이기 */
    white-space: nowrap;
  }

  

  .btn-primary {
    width: 80px;
    font-size: 14px;
  }
}

</style>
