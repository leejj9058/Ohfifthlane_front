<template>
  <div>
    <Header />

    <!-- 중앙 정렬 컨테이너 -->
    <div
      class="container-fluid d-flex flex-column align-items-center justify-content-center"
    >
      <!-- 비밀번호 찾기 폼 -->
      <section class="password-reset-section my-4 text-center">
        <h3 class="fw-bold">비밀번호 찾기</h3>
        <form>

          <label for="name">이름</label>
          <input type="text" id="name" v-model="userName" />
          <p v-if="errors.userName" class="error-message">{{ errors.userName }}</p>

          <label for="id-number">주민번호</label>
          <div class="id-input-container">
            <input
              type="text"
              id="id-number-first"
              v-model="userSSNFront"
              maxlength="6"
              placeholder="앞 6자리"
            />
            <span class="dash">-</span>
            <input
              type="text"
              id="id-number-second"
              v-model="userSSNBackMasked"
              maxlength="7"
              placeholder="뒤 7자리"
            />
          </div>

          <p v-if="errors.userSSN" class="error-message">{{ errors.userSSN }}</p>

          <label for="email">아이디(이메일)</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="아이디(이메일)을 입력하세요"
          />
          <p v-if="errors.email" class="error-message">{{ errors.email }}</p>

          <button type="button" class="btn btn-primary mt-3" @click="validateForm">
            비밀번호 찾기
          </button>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Header from "@/components/Header.vue";
import axios from "axios";
import { useRouter } from "vue-router";
// 이메일 입력 필드
const router = useRouter();

const userName = ref("");
const userSSNFront = ref("");
const userSSNBack = ref("");
const email = ref("");
const errors = ref({}); // 에러 메시지 저장 객체

// 주민번호 뒷자리 마스킹된 값을 계산하는 computed
const userSSNBackMasked = computed({
  get() {
    if (userSSNBack.value.length === 7) {
      return userSSNBack.value[0] + "******"; // 첫 글자만 표시하고 나머지 6자리는 마스킹
    }
    return userSSNBack.value; // 7자리가 안 되면 그대로 표시
  },
  set(value) {
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

  if (!userName.value) {
    errors.value.userName = "이름을 입력하세요.";
    isValid = false;
  }
  if (userSSNFront.value.length !== 6 || userSSNBack.value.length !== 7) {
    errors.value.userSSN = "주민번호 형식이 올바르지 않습니다.";
    isValid = false;
  }

  // 이메일 입력 여부와 형식 검사
  if (!email.value) {
    errors.value.email = "아이디(이메일)을 입력하세요.";
    isValid = false;
  } else if (!email.value.includes("@") || !email.value.includes(".com")) {
    errors.value.email = "올바른 이메일 형식이 아닙니다.";
    isValid = false;
  }


  // 모든 유효성 검사를 통과하면 비밀번호 찾기 함수 호출
  if (isValid) {
    findPassword();
  }
};

// 비밀번호 찾기 
const findPassword = async () => {
  try {
    const response = await axios.post("/api/find-password", { email: email.value });
    
    if (response.status >= 200 && response.status < 300) {
      alert(response.data.message);
      router.replace({ path: "/findPw" });
    } else {
      alert("비밀번호 찾기에 실패했습니다. 다시 시도하세요.");
    }
  } catch (error) {
    console.error("Error finding password:", error);
    alert("비밀번호 찾기에 실패했습니다. 다시 시도하세요.");
  }
};
</script>

<style scoped>
.password-reset-section {
  background-color: #fff;
  border-radius: 12px;
  border: 1px solid #ddd;
  padding: 20px;
  width: 460px;
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

.id-input-container,
.phone-input-container {
  display: flex;
  align-items: center;
  gap: 10px; /* 필드와 대시 사이 간격 조절 */
}
</style>
