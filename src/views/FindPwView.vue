<template>
  <div>
    <Header />

    <!-- 중앙 정렬 컨테이너 -->
    <div
      class="container-fluid d-flex flex-column align-items-center justify-content-center"
    >
      <!-- 비밀번호 찾기 폼 -->
      <section class="password-reset-section my-4 text-center">
        <div class="d-flex align-items-center ">
        <button class="btn btn-link  mb-3" @click="goBack">
            <i class="bi bi-arrow-left arrow-icon"></i>
          </button>
        <h3 class="fw-bold" style="margin-left: 100px;">비밀번호 찾기</h3>
      </div>
        <form>

          <label for="name">이름</label>
          <input type="text" id="userName" v-model="userName" />
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
            v-model="accountEmail"
            placeholder="아이디(이메일)을 입력하세요"
          />
          <p v-if="errors.accountEmail" class="error-message">{{ errors.accountEmail }}</p>

          <button type="button" class="btn btn-primary mt-3" @click="findPassword">
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

const router = useRouter();

const userName = ref("");
const userSSNFront = ref("");
const userSSNBack = ref("");
const accountEmail = ref("");
const errors = ref({}); // 에러 메시지 저장 객체

//goBack 함수
const goBack = () => {
  router.go(-1);
};

const userSSNBackMasked = computed({
  // get 함수: 마스킹된 주민번호 뒷자리를 반환합니다.
  get() {
    // 주민번호 뒷자리 길이가  7자리인 경우
    if (userSSNBack.value.length === 7) {
      // 첫 번째 글자만 보여주고 나머지 6자리는 '*'로 마스킹 처리
      return userSSNBack.value[0] + "******";
    }
    // 7자리가 안 되는 경우 입력된 값을 그대로 반환
    return userSSNBack.value;
  },
  
  // set 함수: 사용자가 입력한 값을 처리하여 주민번호 뒷자리에 저장합니다.
  set(value) {
    // 숫자만 남기기 위해 빈 문자열로 초기화
    let onlyNumbers = "";

    // 입력된 값의 각 문자를 순회하며 숫자인 경우에만 추가
    for (let i = 0; i < value.length && onlyNumbers.length < 7; i++) {
      // 현재 문자가 0~9 사이의 숫자인지 확인
      if (value[i] >= "0" && value[i] <= "9") {
        // 숫자인 경우 onlyNumbers에 추가
        onlyNumbers += value[i];
      }
    }
    // 최대 7자리까지 추출한 숫자를 주민번호 뒷자리 변수에 저장
    userSSNBack.value = onlyNumbers;
  }
});


// 유효성 검사 함수
const findPassword  = async () => {
  errors.value = {}; // 에러 메시지 초기화

  if (!userName.value) {
    errors.value.userName = "이름을 입력하세요.";
  } else if (userSSNFront.value.length !== 6 || userSSNBack.value.length !== 7) {
    errors.value.userSSN = "주민번호 형식이 올바르지 않습니다.";
  } // 이메일 입력 여부와 형식 검사
   else if (!accountEmail.value) {
    errors.value.accountEmail = "아이디(이메일)을 입력하세요.";
  } else if (!accountEmail.value.includes("@") || !accountEmail.value.includes(".com")) {
    errors.value.accountEmail = "올바른 이메일 형식이 아닙니다.";
  } 
  else {
    // 모든 유효성 검사를 통과한 경우 서버 요청 실행
    try {
      const response = await axios.post("/api/findAccountPassword", {
        userName: userName.value,
        userSSNFront: userSSNFront.value,
        userSSNBack: userSSNBack.value,
        accountEmail: accountEmail.value,
      });

      if (response.status >= 200 && response.status < 300) {
        alert("당신의 비밀번호는 ");
        router.replace({ path: "/updatePassword" });
      } else {
        alert("비밀번호 찾기에 실패했습니다.");
      }
    } catch (error) {
      console.error("비밀번호 변경 중 오류 발생:", error);
      alert("비밀번호 찾기 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  }
};
</script>


<style scoped>
.container-fluid {
  overflow-x: hidden;
}

.password-reset-section {
  background-color: #fff;
  border-radius: 12px;
  border: 1px solid #ddd;
  padding: 20px;
  max-width: 460px;
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
