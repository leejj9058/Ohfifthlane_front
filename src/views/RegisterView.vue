<template>
  <div>
    <Header />

    <!-- 중앙 정렬 컨테이너 -->
    <div class="container-fluid d-flex flex-column align-items-center justify-content-center">
      <!-- 회원가입 폼 -->
      <section class="signup-section my-4 text-center">
        <div class="d-flex align-items-center ">
        <button class="btn btn-link  mb-3" @click="goBack" >
            <i class="bi bi-arrow-left arrow-icon"></i>
          </button>
        </div>  
        <h3 class="fw-bold text-center">회원가입</h3>
        
        <form>
          <label for="name">이름</label>
          <input type="text" id="name" v-model="userName" />
          <p v-if="errors.userName" class="error-message">{{ errors.userName }}</p>

          <label for="id-number">주민번호</label>
          <div class="id-input-container">
            <input type="text" id="id-number-first" v-model="userSSNFront" maxlength="6" placeholder="앞 6자리" />
            <span class="dash">-</span>
            <input type="text" id="id-number-second" v-model="userSSNBackMasked" maxlength="7" placeholder="뒤 7자리" />
          </div>

          <p v-if="errors.userSSN" class="error-message">{{ errors.userSSN }}</p>

          <label for="email">이메일(ID)</label>
          <div style="display: flex; align-items: baseline; width: 100%">
            <input type="email" id="email" v-model.trim="accountEmail" style="width: 320px; margin-right: 5px" />
            <button type="button" class="btn btn-secondary check-btn" @click="checkEmail"
              style="width: 100px; height: 44px; background-color: gray">
              중복확인
            </button>
          </div>
          <p v-if="errors.accountEmail" class="error-message">
            {{ errors.accountEmail }}
          </p>
          <p v-if="emailStatus" class="status-message">{{ emailStatus }}</p>
          <div v-if="emailStatus == '사용 가능한 이메일입니다.'" style="display: flex; align-items: baseline; width: 100%">
            <p id="sendEmailAddr" style="width: 320px; margin-right: 5px">{{ sendEmailAddr }}</p>
            <button type="button" class="btn btn-secondary check-btn" @click="sendEmail"
              style="width: 100px; height: 44px; background-color: gray">
              메일인증
            </button>
          </div>
          <div v-if="emailStatus == '사용 가능한 이메일입니다.'" style="display: flex; align-items: baseline; width: 100%">
            <input id="key" v-model="inputKey" class="text-center" style="width: 320px; margin-right: 5px" />
            <button type="button" class="btn btn-secondary check-btn" @click="sendEmailCheck"
              style="width: 100px; height: 44px; background-color: gray">
              확인
            </button>
          </div>
          <p v-if="errors.sendEmailCheck" class="error-message">
            {{ errors.sendEmailCheck }}
          </p>
          <label for="password">비밀번호</label>
          <input type="password" id="password" v-model="password" />
          <p v-if="errors.password" class="error-message">{{ errors.password }}</p>

          <label for="password-confirm">비밀번호 확인</label>
          <input type="password" id="password-confirm" v-model="passwordConfirm" />
          <p v-if="errors.passwordConfirm" class="error-message">
            {{ errors.passwordConfirm }}
          </p>

          <label for="phone">전화번호</label>
          <div class="phone-input-container">
            <input type="text" v-model="userTelPart1" maxlength="3" placeholder="000" />
            <span class="dash">-</span>
            <input type="text" v-model="userTelPart2" maxlength="4" placeholder="0000" />
            <span class="dash">-</span>
            <input type="text" v-model="userTelPart3" maxlength="4" placeholder="0000" />
          </div>
          <p v-if="errors.userTel" class="error-message">{{ errors.userTel }}</p>

          <label for="address">주소</label>
          <input type="text" id="address" v-model="userAddress" placeholder="예: 서울특별시 강남구" />
          <p v-if="errors.userAddress" class="error-message">{{ errors.userAddress }}</p>

          <button type="button" class="btn btn-primary mt-3" @click="registerForm">
            회원가입
          </button>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Header from "@/components/Header.vue";

const router = useRouter();

const userName = ref("");
const userSSNFront = ref("");
const userSSNBack = ref(""); // 주민번호 실제 값
const accountEmail = ref("");
const emailStatus = ref(""); // 이메일 중복 상태 메시지
const password = ref("");
const passwordConfirm = ref("");
const userTelPart1 = ref(""); // 전화번호 첫 번째 부분
const userTelPart2 = ref(""); // 전화번호 두 번째 부분
const userTelPart3 = ref(""); // 전화번호 세 번째 부분
const userAddress = ref("");

const sendEmailAddr = ref(""); // 인증 메세지 보낼 이메일
const emailKey = ref(""); // 서버로 받은 이메일 인증 키(찐)
const inputKey = ref(""); // 입력받은 이메일 인증 키

//goBack 함수
const goBack = () => {
  router.go(-1);
};

let checkedEmail = false;
// 에러 메시지 객체
const errors = ref({});

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

// 전화번호 전체를 합치는 computed
const userTel = computed(
  () => `${userTelPart1.value}-${userTelPart2.value}-${userTelPart3.value}`
);

const checkEmail = async () => {
  emailStatus.value = "";
  errors.value.accountEmail = "";

  if (!accountEmail.value) {
    errors.value.accountEmail = "이메일을 입력하세요.";
    return;
  }

  try {
    const response = await axios.post("/api/checkEmail", { accountEmail: accountEmail.value });
    if (response.data) {
      emailStatus.value = "사용 가능한 이메일입니다.";
      sendEmailAddr.value = accountEmail.value;
      console.log(sendEmailAddr);
    } else {
      emailStatus.value = "이미 사용 중인 이메일입니다.";
    }
  } catch (error) {
    console.error(error);
    if (error.response) {
      emailStatus.value = `오류: ${error.response.data.message}`;
    } else {
      emailStatus.value = "이메일 확인 중 오류가 발생했습니다.";
    }
  }
};

// 이메일 인증번호 보내기
const sendEmail = async () => {
  
  try {
    const response = await axios.post("/api/sendEmail", { accountEmail: sendEmailAddr.value });
    emailKey.value = response.data;
    console.log(emailKey.value);
  } catch (error) {
    console.error(error);
    if (error.response) {
      emailStatus.value = `오류: ${error.response.data.message}`;
    } else {
      emailStatus.value = "이메일 전송 중 오류가 발생했습니다.";
    }
  }
};

//인증키 확인하기
const sendEmailCheck = async () => {
  errors.value.sendEmailCheck = "";

  if (emailKey.value != inputKey.value) {
    errors.value.sendEmailCheck = "인증번호가 같지 않습니다.";
    return;
  }
  emailStatus.value = "인증이 완료되었습니다.";
  checkedEmail = true;
};

// 회원가입 폼 유효성 검사 및 제출
const registerForm = async () => {
  errors.value = {}; // 모든 에러 메시지 초기화
  let isValid = true;

  if (!userName.value) {
    errors.value.userName = "이름을 입력하세요.";
    isValid = false;
  }
  if (!userSSNFront.value || !userSSNBack.value) {
    errors.value.userSSN = "주민번호를 입력하세요.";
    isValid = false;
  }
  if (!accountEmail.value) {
    errors.value.accountEmail = "이메일을 입력하세요.";
    isValid = false;
  } else if (!accountEmail.value.includes("@") || !accountEmail.value.includes(".com")) {
    errors.value.accountEmail = "올바른 이메일 형식이 아닙니다.";
    isValid = false;
  }
  if (checkedEmail == false) {
    errors.value.checkedEmail = "이메일 중복확인을 해주세요."
  }
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
  if (!userTelPart1.value || !userTelPart2.value || !userTelPart3.value) {
    errors.value.userTel = "전화번호를 모두 입력하세요.";
    isValid = false;
  }
  if (!userAddress.value || userAddress.value.length < 5) {
    errors.value.userAddress = "주소를 5자 이상 입력하세요.";
    isValid = false;
  }

  if (isValid) {
    try {
      const response = await axios.post("/api/register", {
        account: {
          accountEmail: accountEmail.value,
          accountPassword: password.value,
          accountLevel: 2 // 기본값으로 설정
        },
        user: {
          userName: userName.value,
          userSSNFront: userSSNFront.value,
          userSSNBack: userSSNBack.value,
          userTel: userTel.value,
          userAddress: userAddress.value
        }
      });

      if (response.status >= 200 && response.status < 300) {
        alert("회원가입이 성공적으로 완료되었습니다!");
        router.replace({ path: "/login" });
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("회원가입 실패: 이미 가입된 이메일입니다.");
      } else {
        alert("회원가입 중 오류가 발생했습니다.");
      }
    }
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
  overflow: hidden;
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
  width: 100%;
}

.id-input-container,
.phone-input-container {
  display: flex;
  align-items: center;
}

#id-number-first,
#id-number-second,
.phone-input-container input {
  padding: 8px;
  flex: 1;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
  text-align: center;
}

.dash {
  margin: 0 5px;
  font-size: 20px;
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

.status-message {
  color: green;
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
