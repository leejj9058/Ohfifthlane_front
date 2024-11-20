<template>
  <Header></Header>

  <div class="d-flex justify-content-center align-items-center p-3" id="background">

    <!-- 본문 -->
    <div class="p-4 p-md-5 w-100 vh-100" style="background-color: white;">

      <h1 class="mb-4 fs-2 fw-bold">문의 게시판</h1>

      <div class="d-flex justify-content-end">
        <button class="btn btn-primary" @click="gotoNew">글쓰기</button>
      </div>

      <hr >

      <!-- 게시글 테이블 -->
      <div class="table-responsive">

        <table class="table mb-3">
          <thead>
            <tr class="text-center">
              <th class="inquiryNo">No</th>
              <th class="inquiryTitle">제목</th>
              <th class="inquiryDate">작성일</th>
            </tr>
          </thead>

          <tbody>
            <!-- vo랑 이름을 똑같이 해서 받아와야 한다. -->
            <tr v-for="inquiry in inquiries":key="inquiry.inquiryId"class="inquiryIndex" @click="gotoInquiryOne(inquiry.inquiryId)" > 
              <td class="text-center">{{ inquiry.inquiryId }}</td>
              <td  class="inquiryTitleOne text-center">{{ inquiry.inquiryTitle }}</td>
              <td class="text-center">{{formatDate(inquiry.inquiryDate)}}</td>
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
import axios from 'axios'

// const notices = ref ( [
//   {id:1, title: "게시글 1", date: "2024.10.11"},
//   {id:2, title: "두번째 글", date: "2024.10.15"},
//   {id:3, title: "세번째 글입니다.", date: "2024.10.16"}

// ]

onMounted(async () => {
  console.log('컴포넌트 마운트됨');
  await getInquiry();
});

const inquiries = ref([])

//목록에서 작성일 날짜만 나오게끔 형식을 정해준다. 
// 날짜 형식 변환
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};


const gotoInquiryOne = (inquiryId) => {
  router.push(`/inquiry/${inquiryId}`);
};

function gotoNew() {
  router.push('/newboard/inquiry'); //글쓰기로 넘어가는 라우터
}

const getInquiry = async () => {
  console.log('문의사항 요청 시작');

  try {
    const response = await axios.post('/api/getInquiry');
    console.log('응답 데이터:', response);
    // 공지사항 불러오기 성공 (상태 코드 200-299)
    if (response.status >= 200 && response.status < 300) {
      console.log(response.data + '문의사항 success');
      inquiries.value = response.data;
    } else {
      // 예상치 못한 상태 코드
      throw new Error('Unexpected response status');
    }
  } catch (error) {
    if (error.response) {
      // 서버가 2xx 범위를 벗어나는 상태 코드로 응답한 경우
      console.error('문의사항 실패:', error.response.data.message || '알 수 없는 오류 발생');
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

.inquiryNo {
  width: 10%;
}

.inquiryTitle {
  width: 70%
}

.inquiryDate {
  width: 20%;
}

.inquiryTitleOne {
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
