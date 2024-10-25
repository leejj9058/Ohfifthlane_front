<template>
  <div class="login-container">
    <form @submit.prevent="handleLogin" class="login-form">
      <h2>로그인</h2>
      <div class="form-group">
        <label for="userId">아이디:</label>
        <input type="text" id="userId" v-model="userId" required class="form-control">
      </div>
      <div class="form-group">
        <label for="password">비밀번호:</label>
        <input type="password" id="password" v-model="password" required class="form-control">
      </div>
      <button type="submit" class="btn btn-primary">로그인</button>
    </form>
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
      userId: userId.value,
      password: password.value
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
.custom-page {
  margin-left: 0 !important;
}



@media (max-width: 768px) {
  .noticeNo {
    width: 10%;
  }

  .noticeTitle {
    width: 55%;
  }

  .noticeDate {
    width: 30%;
  }

  .table td,
  .table th {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
}
</style>
