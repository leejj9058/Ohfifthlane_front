<template>
  <Header />
  <div
    class="container-fluid d-flex flex-column align-items-center justify-content-center"
  >
    <div class="card p-5 login-container">
      <div class="d-flex align-items-center ">
      <button class="btn btn-link  mb-3" @click="goBack">
          <i class="bi bi-arrow-left arrow-icon"></i>
      </button>
      </div>
      <form @submit.prevent="handleLogin" class="login-form">
        <h2 class="fw-bold" style="margin-left: 90px;">로그인</h2>

        <div class="mt-5 form-group">
          <label for="userId">아이디:</label>
          <input type="text" id="userId" v-model="userId" required class="form-control" />
        </div>

        <div class="form-group">
          <label for="password">비밀번호:</label>
          <div class="d-flex">
            <input
              type="password"
              id="password"
              v-model="password"
              required
              class="form-control"
            />
          </div>
        </div>

        <button type="submit" class="btn btn-primary mt-3" style="width: 300px" >
          로그인
        </button>
      </form>

      <div class="mt-4 text-center">
        <router-link to="/findId" class="btn btn-link">아이디 찾기</router-link>
        <span class="mx-2">|</span>
        <router-link to="/findPassword" class="btn btn-link">비밀번호 찾기</router-link>
      </div>

      <div class="mt-4 text-center">
        <p>
          계정이 없으신가요?
          <router-link to="/register" class="btn btn-link">회원가입</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import Header from "@/components/Header.vue";
import { useRouter } from 'vue-router'; // Vue Router 추가

// router 인스턴스 생성
const router = useRouter();


const userId = ref("");
const password = ref("");

//goBack 함수
const goBack = () => {
  router.go(-1);
};


const handleLogin = async () => {
  try {
    const response = await axios.post("/api/login", {
      accountEmail: userId.value,
      accountPassword: password.value,
    });

    // 로그인 성공 (상태 코드 200-299)
    if (response.status >= 200 && response.status < 300) {
      console.log(response.data.accountLevel + '로그인');
      const accountLevel = response.data.accountLevel;
      if(accountLevel == 1) {
        router.push("/main");
      }else{
        router.push("/");
      }
    } else {
      // 예상치 못한 상태 코드
      throw new Error("Unexpected response status");
    }
  } catch (error) {
    if (error.response) {
      // 서버가 2xx 범위를 벗어나는 상태 코드로 응답한 경우
      console.error(
        "로그인 실패:",
        error.response.data.message || "알 수 없는 오류 발생"
      );
    } else if (error.request) {
      // 요청이 전송되었으나 응답을 받지 못한 경우
      console.error("서버 응답 없음");
    } else {
      // 요청 설정 중에 오류가 발생한 경우
      console.error("요청 오류:", error.message);
    }
  };
  }
</script>

<style scoped>
.container-fluid {
  padding-top: 40px;
  overflow-x: hidden;
}

.login-container {
  background-color: #fff;
  border-radius: 12px;
  border: 1px solid #ddd;
  padding: 20px;
  max-width: 460px;
  overflow: hidden;
}

.form-group {
  margin-bottom: 1rem;
}

.btn-link {
  color: #007bff;
  text-decoration: none;
  padding: 0;
}

.btn-link:hover {
  text-decoration: underline;
}

.ml-2 {
  margin-left: 0.5rem;
}

@media (max-width: 768px) {
  @media (max-width: 768px) {
    .login-container {
      max-width: 100%;
      margin-left: 0;
      margin-top: 50px;
      padding: 1rem;
    }

    .btn-primary {
      width: 100% !important; /* !important를 사용하여 인라인 스타일 오버라이드 */
    }

    .form-group input {
      font-size: 0.9rem;
    }

    h2 {
      font-size: 1.5rem;
    }

    .btn-link {
      font-size: 0.9rem;
    }
  }

  @media (max-width: 576px) {
    .login-container {
      margin-top: 20px;
    }

    .btn-primary {
      font-size: 0.9rem;
    }
  }
}
</style>
