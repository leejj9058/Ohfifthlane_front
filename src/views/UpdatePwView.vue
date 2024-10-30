<template>
  <div>
    <Header />

    <!-- 중앙 정렬 컨테이너 -->
    <div
      class="container-fluid d-flex flex-column align-items-center justify-content-center"
    >
      <!-- 비밀번호 변경 폼 -->
      <section class="password-change-section my-4 text-center">
        <h3 class="fw-bold">비밀번호 변경</h3>
        <form>
          <label for="new-password">변경할 비밀번호</label>
          <input type="password" id="new-password" v-model="newPassword" />
          <p v-if="errors.newPassword" class="error-message">{{ errors.newPassword }}</p>

          <label for="confirm-password">일치 확인</label>
          <input type="password" id="confirm-password" v-model="confirmPassword" />
          <p v-if="errors.confirmPassword" class="error-message">
            {{ errors.confirmPassword }}
          </p>

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
import { useRouter } from "vue-router"; // vue-router 가져오기
import Header from "@/components/Header.vue";
import axios from "axios";
const router = useRouter(); // router 인스턴스 생성

// 비밀번호 입력 필드
const newPassword = ref("");
const confirmPassword = ref("");
const errors = ref({}); // 에러 메시지 저장 객체

// 비밀번호 변경 함수
const changePassword = async () => {
  errors.value = {}; // 에러 메시지 초기화
  let isValid = true;

  // 비밀번호 유효성 검사 - 8자리 이상 및 대문자 포함 여부 확인
  if (!newPassword.value) {
    errors.value.newPassword = "비밀번호를 입력하세요.";
    isValid = false;
  } else {
    // 비밀번호 길이 검사
    if (newPassword.value.length < 8) {
      errors.value.newPassword = "비밀번호는 최소 8자리여야 합니다.";
      isValid = false;
    }

    // 대문자 포함 여부 검사
    let hasUpperCase = false;
    for (let i = 0; i < newPassword.value.length; i++) {
      if (newPassword.value[i] >= "A" && newPassword.value[i] <= "Z") {
        hasUpperCase = true;
        break;
      }
    }
    if (!hasUpperCase) {
      errors.value.newPassword = "비밀번호에는 대문자가 1개 이상 포함되어야 합니다.";
      isValid = false;
    }
  }

  // 비밀번호 확인 일치 여부 검사
  if (newPassword.value !== confirmPassword.value) {
    errors.value.confirmPassword = "비밀번호가 일치하지 않습니다.";
    isValid = false;
  }

  // 모든 유효성 검사를 통과하면 비밀번호 변경 요청
  if (isValid) {
    try {
      const response = await axios.post("/api/change-password", {
        newPassword: newPassword.value,
        confirmPassword: confirmPassword.value,
      });

      if (response.status >= 200 && response.status < 300) { // 성공 시
        alert("비밀번호가 성공적으로 변경되었습니다.");
        router.replace({ path: "/login" });
      } else if (response.status === 400) { // 실패 시
        errors.value = response.data.errors;
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
