<template>

  <div class="d-flex justify-content-center"></div>
  <div class=" card p-5 login-container">
    <form @submit.prevent="handleLogin" class="login-form">
      <h2 class="text-center">로그인</h2>


      <div class="mt-5 form-group">
        <label for="userId">아이디:</label>
        <input type="text" id="userId" v-model="userId" required class="form-control">
      </div>

      <div class="form-group">
        <label for="password">비밀번호:</label>
        <div class="d-flex">
        <input type="password" id="password" v-model="password" required class="form-control">
      </div>
    </div>

    <button type="submit" class="btn btn-primary mt-3" style="width: 400px;">로그인</button>

    </form>

    <div class="mt-4 text-center">
      <router-link to="/findId" class="btn btn-link">아이디 찾기</router-link>
        <span class="mx-2">|</span>
        <router-link to="/findPassword" class="btn btn-link">비밀번호 찾기</router-link>
    </div>

    <div class="mt-4 text-center">
        <p>계정이 없으신가요? <router-link to="/register" class="btn btn-link">회원가입</router-link></p>
      </div>

  </div>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';


const userId = ref('');
const password = ref('');


const handleLogin = async () => {
  try {
    const response = await axios.post('/api/login', {
      accountEmail: userId.value,
      accountPassword: password.value
    });

    // 로그인 성공 (상태 코드 200-299)
    if (response.status >= 200 && response.status < 300) {
      console.log('로그인 성공');
      router.push('/');
    } else {
      // 예상치 못한 상태 코드
      throw new Error('Unexpected response status');
    }
  } catch (error) {
    if (error.response) {
      // 서버가 2xx 범위를 벗어나는 상태 코드로 응답한 경우
      console.error('로그인 실패:', error.response.data.message || '알 수 없는 오류 발생');
    } else if (error.request) {
      // 요청이 전송되었으나 응답을 받지 못한 경우
      console.error('서버 응답 없음');
    } else {
      // 요청 설정 중에 오류가 발생한 경우
      console.error('요청 오류:', error.message);
    }
  }
};


</script>



<style scoped>
.login-container {
  max-width: 500px;
  margin-left: 260px;
  margin-top: 100px;
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
