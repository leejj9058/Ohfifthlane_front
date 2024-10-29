<template>
  <div class="login-container">
    <form @submit.prevent="findId" class="login-form">
      <h2>아이디(email)찾기</h2>
      <div class="form-group">
        <label for="userName">이름:</label>
        <input type="text" id="userName" v-model="userName" required class="form-control">
      </div>
      <div class="form-group">
        <label for="userSSNFront">주민번호 앞자리:</label>
        <input type="text" id="userSSNFront" v-model="userSSNFront" required class="form-control">
      </div>
      <button type="submit" class="btn btn-primary">찾기</button>
      <p>{{ userEmail }}</p>
    </form>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';


const userName = ref('');
const userSSNFront = ref('');
const userEmail = ref('');

const findId = async () => {
  try {
    const response = await axios.post('/api/findId', {
      userName: userName.value,
      userSSNFront: userSSNFront.value
    });

    if (response.status >= 200 && response.status < 300) {
      console.log('아이디 찾기 성공');
      
      userEmail.value = response.data;
      

    } else {
      // 예상치 못한 상태 코드
      throw new Error('Unexpected response status');
    }

  } catch (error) {
    
    if (error.response) {
      // 서버가 2xx 범위를 벗어나는 상태 코드로 응답한 경우
      console.error('아이디 찾기 실패:', error.response.data.message || '알 수 없는 오류 발생');
    } else if (error.request) {
      // 요청이 전송되었으나 응답을 받지 못한 경우
      console.error('서버 응답 없음');
    } else {
      // 요청 설정 중에 오류가 발생한 경우
      console.error('요청 오류:', error.message);
    }
  }
}


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
