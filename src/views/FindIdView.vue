<template>
  <div>
    <Header />

    <!-- 중앙 정렬 컨테이너 -->
    <div class="container-fluid d-flex flex-column align-items-center justify-content-center">
      <!-- 아이디 찾기 폼 -->
      <section class="signup-section my-4 text-center">

        <div class="d-flex align-items-center ">
          <button class="btn btn-link  mb-3" @click="goBack">
            <i class="bi bi-arrow-left arrow-icon"></i>
          </button>
          <h3 class="fw-bold" style="margin-left: 100px;">아이디 찾기</h3>
        </div>
        <form>
          <label for="name">이름</label>
          <input type="text" id="name" v-model="userName" />
          <p v-if="errors.userName" class="error-message">{{ errors.userName }}</p>

          <label for="id-number">주민번호</label>
          <div class="id-input-container">
            <input type="text" id="id-number-first" v-model="userSSNFront" maxlength="6" placeholder="앞 6자리" />
            <span class="dash">-</span>
            <!-- 마스킹된 값을 표시하는 필드 -->
            <input type="text" id="id-number-second" v-model="userSSNBackMasked" maxlength="7" placeholder="뒤 7자리" />
          </div>
          <p v-if="errors.userSSN" class="error-message">{{ errors.userSSN }}</p>

          <button type="button" class="btn btn-primary mt-3" @click="validateForm">
            아이디 찾기
          </button>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Header from "@/components/Header.vue";
import axios from 'axios';
import { useRouter } from 'vue-router'; // Vue Router 추가

// router 인스턴스 생성
const router = useRouter();

// 이름과 주민번호를 ref로 선언
const userName = ref("");
const userSSNFront = ref("");
const userSSNBack = ref("");
const errors = ref({}); // 에러 메시지 저장

//goBack 함수
const goBack = () => {
  router.go(-1);
};


// 주민번호 뒷자리 마스킹된 값을 계산하는 computed
const userSSNBackMasked = computed({
  get() {
    // 7자리를 모두 입력한 경우에만 마스킹 처리
    if (userSSNBack.value.length === 7) {
      return userSSNBack.value[0] + "******"; // 첫 글자만 표시하고 나머지 6자리는 마스킹
    }
    return userSSNBack.value; // 7자리가 안 되면 그대로 표시
  },
  set(value) {
    // 입력된 값에서 숫자만 추출하고 최대 7자리까지 허용
    let onlyNumbers = "";
    for (let i = 0; i < value.length && onlyNumbers.length < 7; i++) {
      if (value[i] >= "0" && value[i] <= "9") {
        onlyNumbers += value[i];
      }
    }
    userSSNBack.value = onlyNumbers;
  },
});

// 유효성 검사 함수
const validateForm = () => {
  errors.value = {}; // 에러 메시지 초기화
  let isValid = true;

  // 이름 유효성 검사
  if (!userName.value) {
    errors.value.userName = "이름을 입력하세요.";
    isValid = false;
  }

  if (!userSSNFront.value || !userSSNBack.value) {
    errors.value.userSSN = "주민번호를 입력하세요.";
    isValid = false;
  }

  // 유효성 검사를 통과한 경우 아이디 찾기 함수 호출
  if (isValid) {
    findId();
  }
};

// 아이디 찾기 버튼 클릭 시 호출되는 함수
const findId = async () => {

  try {
    const response = await axios.post('/api/findId', {
      userName: userName.value,
      userSSNFront: userSSNFront.value,
      userSSNBack: userSSNBack.value
    });
    if (response.status >= 200 && response.status < 300) {
      alert(`당신의 아이디는 ${response.data} 입니다.`);
      router.replace({ path: "/login" });
    }
    else {
        alert("아이디 찾기에 실패했습니다.");
      }
    } catch (error) {
      console.error("비밀번호 변경 중 오류 발생:", error);
      alert("비밀번호 찾기 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  
};
</script>

<style scoped>
.container-fluid {
  overflow-x: hidden;
}

.signup-section {
  background-color: #fff;
  border-radius: 12px;
  border: 1px solid #ddd;
  padding: 20px;
  max-width: 460px;
  /* 메인 페이지와 동일한 너비 */
}

form {
  display: flex;
  flex-direction: column;
}

label {
  margin-top: 10px;
  text-align: left;
}

input {
  padding: 8px;
  margin-top: 5px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.id-input-container {
  display: flex;
  align-items: center;
}

#id-number-first,
#id-number-second {
  padding: 8px;
  width: 48%;
  /* 동일한 가로 길이 설정 */
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.dash {
  margin: 0 10px;
  /* 가운데 선 길이를 늘림 */
  font-size: 20px;
  width: 20px;
  /* 가로 길이를 확장 */
  text-align: center;
}

button {
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #6495ed;
  color: white;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #4169e1;
}

.error-message {
  color: red;
  font-size: 12px;
  text-align: left;
  margin-top: -10px;
  margin-bottom: 10px;
}

/* 뒤로가기 버튼 스타일 */
.btn-link {
  padding: 0;
  background-color: transparent;
  border: none;
  text-decoration: none;
  box-shadow: none;
}

.arrow-icon {
  font-size: 1.5rem;
  color: #007bff; /* 기본 링크 색상 */
}

.btn-link:hover {
  text-decoration: underline;
}
</style>
