<template>
  <div>
    <Header />

    <!-- 컨테이너 중앙 정렬 -->
    <div
      class="container-fluid d-flex flex-column align-items-center justify-content-center"
      style="min-height: 100vh"
    >
      <!-- 회원정보 수정 폼 -->
      <section class="signup-section my-4 text-center">
        <h3 class="fw-bold">회원정보수정</h3>
        <form>
          <!-- 이름 입력 -->
          <label for="name">이름</label>
          <input type="text" id="name" v-model="userName" />
          <!-- 이름 유효성 검사 메시지 표시 -->
          <p v-if="errors.userName" class="error-message">{{ errors.userName }}</p>

          <label for="id-number" class="text-danger">주민번호</label>
          <div class="id-input-container">
            <input
              type="text"
              id="id-number-first"
              v-model="userSsnFront"
              maxlength="6"
              disabled
            />
            <span class="dash">-</span>
            <input
              type="password"
              id="id-number-second"
              v-model="userSsnBack"
              maxlength="7"
              disabled
            />
          </div>

          <label for="email" class="text-danger">이메일(ID)</label>
          <input type="email" id="email" v-model="accountEmail" disabled />

          <label for="password">비밀번호</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="새 비밀번호 입력"
          />
          <p v-if="errors.password" class="error-message">{{ errors.password }}</p>

          <label for="password-confirm">비밀번호 확인</label>
          <input
            type="password"
            id="password-confirm"
            v-model="passwordConfirm"
            placeholder="비밀번호 재입력"
          />
          <p v-if="errors.passwordConfirm" class="error-message">
            {{ errors.passwordConfirm }}
          </p>

          <label for="phone">전화번호</label>
          <div class="phone-input-container">
            <input type="text" v-model="userTelPart1" maxlength="3" />
            <span class="dash">-</span>
            <input type="text" v-model="userTelPart2" maxlength="4" />
            <span class="dash">-</span>
            <input type="text" v-model="userTelPart3" maxlength="4" />
          </div>
          <p v-if="errors.userTel" class="error-message">{{ errors.userTel }}</p>

          <label for="address">주소</label>
          <input
            type="text"
            id="address"
            v-model="userAddress"
            placeholder="예: 서울특별시 강남구"
          />
          <p v-if="errors.userAddress" class="error-message">{{ errors.userAddress }}</p>

          <button type="button" class="btn btn-primary mt-3" @click="updateForm">
            회원정보수정
          </button>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios"; // Axios 임포트
import Header from "@/components/Header.vue";

const router = useRouter();

// 기본 값 설정
const userName = ref("");
const userSsnFront = ref("");
const userSsnBack = ref("");
const accountEmail = ref("");
const password = ref("");
const passwordConfirm = ref("");
const userTelPart1 = ref(""); // 전화번호 첫 번째 부분
const userTelPart2 = ref(""); // 전화번호 두 번째 부분
const userTelPart3 = ref(""); // 전화번호 세 번째 부분
const userAddress = ref("");
const errors = ref({}); // 에러 메시지 객체

// 폼 유효성 검사 함수
const updateForm = async () => {
  errors.value = {}; // 에러 메시지 초기화
  let isValid = true;

  // 이름 입력 여부만 검사
  if (!userName.value) {
    errors.value.userName = "이름을 입력하세요.";
    isValid = false;
  }

  // 비밀번호 유효성 검사 - 8자리 이상인지 확인
  if (!password.value) {
    errors.value.password = "비밀번호를 입력하세요.";
    isValid = false;
  } else if (password.value.length < 8) {
    errors.value.password = "비밀번호는 최소 8자리여야 합니다.";
    isValid = false;
  } else if (password.value !== passwordConfirm.value) {
    errors.value.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    isValid = false;
  }

  // 대문자 포함 여부 검사
  let hasUpperCase = false;

  for (let i = 0; i < password.value.length; i++) {
    if (password.value[i] >= "A" && password.value[i] <= "Z") {
      hasUpperCase = true;
      break;
    }
  }
  if (!hasUpperCase) {
    errors.value.password =
      "비밀번호에는 8자리 이상, 대문자가 1개 이상 포함되어야 합니다.";
    isValid = false;
  }
  if (!passwordConfirm.value) {
    errors.value.passwordConfirm = "비밀번호 확인을 입력하세요.";
    isValid = false;
  }

  // 전화번호 유효성 검사
  if (userTelPart1.value.length !== 3 || isNaN(userTelPart1.value)) {
    errors.value.userTel = "전화번호의 첫 번째 부분은 3자리 숫자여야 합니다.";
    isValid = false;
  } else if (userTelPart2.value.length !== 4 || isNaN(userTelPart2.value)) {
    errors.value.userTel = "전화번호의 두 번째 부분은 4자리 숫자여야 합니다.";
    isValid = false;
  } else if (userTelPart3.value.length !== 4 || isNaN(userTelPart3.value)) {
    errors.value.userTel = "전화번호의 세 번째 부분은 4자리 숫자여야 합니다.";
    isValid = false;
  }

  // 주소 유효성 검사
  if (!userAddress.value || userAddress.value.length < 5) {
    errors.value.userAddress = "주소를 5자 이상 입력하세요.";
    isValid = false;
  }

  // 모든 입력이 유효하면 회원정보 수정 처리 후 로그인 페이지로 이동
  if (isValid) {
    try {
      const response = await axios.post("/api/user", {
        name: userName.value,
        idNumberFirst: userSsnFront.value,
        idNumberSecond: userSsnBack.value,
        email: accountEmail.value,
        password: password.value,
        phone: `${userTelPart1.value}-${userTelPart2.value}-${userTelPart3.value}`,
        address: userAddress.value,
      });

      // 성공 시
      if (response.status >= 200 && response.status < 300) {
        alert("회원정보가 성공적으로 수정되었습니다.");
        console.log(response.data);
        router.replace({ path: "/login" });
      }
      // 실패 시 400 에러 처리
      else if (response.status === 400) {
        alert("회원정보 수정 중 오류가 발생했습니다. 다시 시도해 주세요.");
      }
    } catch (error) {
      console.error("Error updating user information:", error);
      alert("회원정보 수정 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  }
};

// 로그인 페이지로 이동하는 함수
const goToLogin = () => {
  const updatedData = {
    name: userName.value,
    idNumberFirst: userSsnFront.value,
    idNumberSecond: userSsnBack.value,
    email: accountEmail.value,
    password: password.value,
    phone: `${userTelPart1.value}-${userTelPart2.value}-${userTelPart3.value}`, // 전화번호를 합친 값을 전달
    address: userAddress.value,
  };

  console.log(updatedData); // 수정된 데이터를 처리하는 로직
  router.replace({ path: "/login" });
};
</script>

<style scoped>
.signup-section {
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
  width: 100%; /* 모든 입력 필드 동일한 너비 */
}

input:disabled {
  background-color: #f0f0f0;
}

.id-input-container,
.phone-input-container {
  display: flex;
  align-items: center;
  gap: 5px; /* 필드와 대시 사이 간격 조절 */
}

#id-number-first,
#id-number-second,
.phone-input-container input {
  padding: 8px;
  flex: 1; /* 균등한 크기로 설정 */
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
  text-align: center;
}

.dash {
  font-size: 20px;
  color: #666;
  margin: 0 5px; /* 대시와 입력 필드 간격 */
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
