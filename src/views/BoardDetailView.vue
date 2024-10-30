<template>
  <Header></Header>

  <div class="d-flex justify-content-center align-items-center p-3" id="background">

    <!-- 본문 -->
    <div class="p-4 p-md-5 w-100">

      <h1 class="mb-4 fs-2 fw-bold">{{notice.noticeTitle}}</h1>

      <div class="d-flex justify-content-between align-items-center mb-0">
        <p class="mb-0" style="color: #A2A2A2;">{{notice.noticeDate}}</p>

        <div class="dropdown">
          <button class="btn btn-link p-0" type="button" aria-expanded="false" id="detailBtn"  data-bs-toggle="dropdown">
            <i class="bi bi-three-dots-vertical"></i>
          </button>
        
          <!-- 눌렀을 때 드랍다운 되는 메뉴리스트 -->
          <ul class="dropdown-menu" aria-labelledby="detailBtn">
         
            <li>
              <a class="dropdown-item" href="#" @click="editPost">
                <i class="bi bi-pen"></i>
                수정하기</a>
            </li>
            <li>
              <a class="dropdown-item" href="#" @click="deletePost">
                <i class="bi bi-trash3"></i>
                삭제하기</a>
            </li>

          </ul>
        </div>

      </div>


      <hr>

      <div class="card p-4" style="height: 800px;">
        {{notice.noticeContent}}
      </div>



    </div>
    <!-- 본문 -->


  </div>


</template>

<script setup>
import { ref, onMounted } from 'vue';
import Header from "@/components/Header.vue";
import { useRoute} from 'vue-router';
import axios from 'axios';

const route = useRoute(); // 현재 라우트의 정보

const noticeId = route.params.noticeId;  // URL에서 noticeId 가져오기

onMounted(() => {
  console.log(noticeId);
  getNoticeDetail();
})

// 수정 로직 구현
function editPost() {
  console.log('게시물 수정');
}

// 삭제 로직 구현
function deletePost() {
  console.log('게시물 삭제');
}

const notice = ref({})

const getNoticeDetail = async () => {
  console.log('공지사항 요청 시작' );

  try {
    const response = await axios.post('/api/getNoticeDetail', { noticeId});
    console.log('응답 데이터:', response);
    // 공지사항 불러오기 성공 (상태 코드 200-299)
    if (response.status >= 200 && response.status < 300) {
      console.log(response.data + '공지사항 success');
      notice.value = response.data;
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

  .table td,
  .table th {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
}
</style>
