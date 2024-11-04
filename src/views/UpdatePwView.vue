<template>
  <div>
    <Header />

    <!-- 중앙 정렬 컨테이너 -->
    <div
      class="container-fluid d-flex flex-column align-items-center justify-content-center"
    >
      <!-- 비밀번호 변경 폼 -->
      <section class="password-change-section my-4 text-center">
        <div class="d-flex align-items-center ">
        <button class="btn btn-link  mb-3" @click="goBack">
            <i class="bi bi-arrow-left arrow-icon"></i>
          </button>
        <h3 class="fw-bold" style="margin-left: 90px;">비밀번호 변경</h3>
        </div>
        <form>
          <!-- 새 비밀번호 입력 -->
          <label for="accountPassword">새 비밀번호</label>
          <input
            type="password"
            id="accountPassword"
            v-model="accountPassword" 
            placeholder="새 비밀번호를 입력하세요"
          />
          <p v-if="errors.accountPassword" class="error-message">{{ errors.accountPassword }}</p>

           <!-- 비밀번호 확인 입력 -->
           <label for="confirmPassword">새 비밀번호 확인</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            placeholder="비밀번호를 다시 입력하세요"
          />
          <p v-if="errors.confirmPassword" class="error-message">
            {{ errors.confirmPassword }}
          </p>

          <!-- 비밀번호 변경 버튼 -->
          <button type="button" class="btn btn-primary mt-3" @click="changePassword">
            비밀번호 변경
          </button>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"; 
import { useRouter } from "vue-router"; // 라우터 사용을 위해 vue-router 가져오기
import Header from "@/components/Header.vue"; 
import axios from "axios"; 

const router = useRouter(); // 라우터 인스턴스 생성

//goBack 함수
const goBack = () => {
  router.go(-1);
};


// 새 비밀번호와 확인 비밀번호를 관리할 ref 객체
const accountPassword = ref(""); // 새 비밀번호
const confirmPassword = ref(""); // 새 비밀번호 확인
const errors = ref({}); // 에러 메시지 저장용 객체

/**
 * 비밀번호 변경을 처리하는 함수
 */
const changePassword = async () => {
  errors.value = {}; // 에러 메시지 초기화

  // 1. 유효성 검사 수행
  if (!accountPassword.value) {
    errors.value.accountPassword = "비밀번호를 입력하세요.";
  } else if (accountPassword.value.length < 8) {
    errors.value.accountPassword = "비밀번호는 최소 8자리여야 합니다.";
  } else if (!/[A-Z]/.test(accountPassword.value)) {
    errors.value.accountPassword = "비밀번호에는 대문자가 1개 이상 포함되어야 합니다.";
  } else if (accountPassword.value !== confirmPassword.value) {
    errors.value.confirmPassword = "비밀번호가 일치하지 않습니다.";
  } else {
    // 모든 유효성 검사를 통과한 경우 서버 요청 실행
    try {
      const response = await axios.post("/api/changeAccountPassword", {
        accountPassword: accountPassword.value,
      });

      if (response.status >= 200 && response.status < 300) {
        alert("비밀번호가 성공적으로 변경되었습니다.");
        router.replace({ path: "/login" }); // 로그인 페이지로 이동
      } else {
        alert("비밀번호 변경에 실패했습니다.");
      }
    } catch (error) {
      console.error("비밀번호 변경 중 오류 발생:", error);
      alert("비밀번호 변경 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  }
};
</script>

<style scoped>
.password-change-section {
  background-color: #fff;
  border-radius: 12px;
  border: 1px solid #ddd;
  padding: 20px;
  width: 460px; /* 적절한 너비 설정 */
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
</style>
