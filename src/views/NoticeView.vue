<template>
  <Header></Header>

  <div class="d-flex justify-content-center align-items-center p-3" id="background">

    <!-- 본문 -->
    <div class="p-4 p-md-5 w-100">

      <h1 class="mb-4 fs-2 fw-bold">공지 게시판</h1>
      
      <div class="d-flex justify-content-end">
        <button class="btn btn-primary" @click="gotoNew">글쓰기</button>
      </div>

      

      <!-- 줄 -->
      <hr >
      <!-- 줄 -->

      <!-- 게시글 테이블 -->
      <div class="table-responsive">

        <table class="table mb-3">
          <thead>
            <tr class="text-center">
              <th class="noticeNo">No</th>
              <th class="noticeTitle">제목</th>
              <th class="noticeDate">작성일</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="notice in notices":key="notice.noticeId"class="noticeIndex" @click="gotoNoticeOne(notice.noticeId)" > 
              <td class="text-center">{{ notice.noticeId }}</td>
              <td  class="noticeTitleOne">{{ notice.noticeTitle }}</td>
              <td class="text-center">{{notice.noticeDate}}</td>
            </tr>
            
          </tbody>
        </table>

      </div>

    </div>
    <!-- 본문 -->


  </div>


</template>

<script setup>
import { ref, onMounted } from 'vue';
import Header from "@/components/Header.vue";
import router from '@/router';
import axios from 'axios';

onMounted(() => {
  getNotice();
})

const notices = ref ([])

const gotoNoticeOne = (noticeId) => {
  router.push(`/boarddetail/${noticeId}`);
};

const gotoNew = () => {
  router.push(`/newboard`)
}

const getNotice = async () => {
  console.log('공지사항 요청 시작');

  try {
    const response = await axios.post('/api/getNotice');
    console.log('응답 데이터:', response);
    // 공지사항 불러오기 성공 (상태 코드 200-299)
    if (response.status >= 200 && response.status < 300) {
      console.log(response.data + '공지사항 success');
      notices.value = response.data;
    } else {
      // 예상치 못한 상태 코드
      throw new Error('Unexpected response status');
    }
  } catch (error) {
    if (error.response) {
      // 서버가 2xx 범위를 벗어나는 상태 코드로 응답한 경우
      console.error('공지사항 실패:', error.response.data.message || '알 수 없는 오류 발생');
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

.table {
  /* table-layout: fixed; */
  width: 100%;
}

.noticeNo {
  width: 10%;
}

.noticeTitle {
  width: 80%
}

.noticeDate {
  width: 15%;
}

.noticeTitleOne {
  cursor: pointer;
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

  .table td, .table th {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
}
</style>
