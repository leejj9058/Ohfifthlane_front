<template>
  <Header></Header>

  <div class="d-flex justify-content-center align-items-center p-3" id="background">

    <!-- 본문 -->
    <div class="p-4 p-md-5 w-100">
      <h1 class="mb-4 fs-2 fw-bold">게시글 작성</h1>

      <hr>

      <form @submit.prevent="submitPost">
        <div class="mb-3">
          <label for="postTitle" class="form-label">제목</label>
          <input type="text" class="form-control" id="postTitle" v-model="postTitle" required>
        </div>

        <div class="mb-3">
          <label for="postContent" class="form-label">내용</label>
          <textarea class="form-control" id="postContent" rows="13" v-model="postContent" required></textarea>
        </div>

        <div class="d-flex justify-content-end">
          <button type="submit" class="btn btn-primary me-2">저장</button>
          <button type="button" class="btn btn-secondary" @click="cancelPost">취소</button>
        </div>

      </form>

    </div>



  </div>


</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Header from "@/components/Header.vue";
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const postTitle = ref('');
const postContent = ref('');
const file = ref(null);
const boardType = ref('');
const accountId = ref(null); //로그인한 아이디


onMounted(async () => {
  boardType.value = route.params.boardType;

  // 페이지 들어가자마자 세션에 저장된 id 값 가져오기 
  try {
    const response = await axios.get('/api/getAccountId');
    accountId.value = response.data;
    console.log('현재 아이디', accountId.value)
  } catch (error) {
    console.error('세션 아이디 가져오기 실패', error);
  }
});


async function submitPost() {

  if(!accountId.value) {
   alert("로그인이 필요합니다.");
   router.push('/login');
   return;
  }

  try {
    //엔드포인트 설정 : inquiry 면 api/writeInquiry : 아니면
    let endpoint = boardType.value === 'inquiry' ? '/api/writeInquiry' : '/api/writeNotice';

    let postData;

    if (boardType.value === 'inquiry') {

      postData = {
        inquiryTitle: postTitle.value,
        inquiryContent: postContent.value,
        userId: accountId.value //세션에서 가져온 아이디

      };

    } else {
      postData = {
        noticeTitle: postTitle.value,
        noticeContent: postContent.value,
        userId: accountId.value //세션에서 가져온 아이디

      }
    }

    const response = await axios.post(endpoint, postData);

    if (response.data > 0) {
      console.log('글 작성 성공');
      // boardType에 따라 리다이렉트 경로 설정
      if (boardType.value === 'inquiry') {
        router.push('/inquiry'); // 문의게시판으로 이동
      } else {
        router.push('/notice'); // 공지사항으로 이동
      }
    } else {
      console.error('작성 실패');
    }
  } catch (error) {
    console.error('글 작성 오류', error);
  }
}

//취소하면 뒤로가기
function cancelPost() {
  router.go(-1);
}

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
  .p-4 {
    padding: 1rem !important;
  }

  .mb-4 {
    margin-bottom: 1rem !important;
  }

  .fs-2 {
    font-size: 1.5rem !important;
  }

  .form-label {
    font-size: 0.9rem;
  }

  .form-control {
    font-size: 0.9rem;
  }

  textarea.form-control {
    height: 200px;
    /* 모바일에서 텍스트 영역 높이 조정 */
  }

  .btn {
    font-size: 0.9rem;
    padding: 0.375rem 0.75rem;
  }
}

@media (max-width: 576px) {
  .p-4 {
    padding: 0.5rem !important;
  }

  .fs-2 {
    font-size: 1.25rem !important;
  }

  .form-label {
    font-size: 0.8rem;
  }

  .form-control {
    font-size: 0.8rem;
  }

  .btn {
    font-size: 0.8rem;
    padding: 0.25rem 0.5rem;
  }
}
</style>
