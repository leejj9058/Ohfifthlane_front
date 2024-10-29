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

        <div class="mb-3">
          <label for="fileInput" class="form-label">파일 첨부</label>
          <input type="file" class="form-control" id="fileInput" @change="handleFileUpload" ref="fileInput">
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
import { ref } from 'vue';
import axios from 'axios';
import Header from "@/components/Header.vue";
import router from '@/router';

const postTitle = ref('');
const postContent = ref('');
const file = ref(null);

function submitPost() {

  console.log('제목:', postTitle.value);
  console.log('내용:', postContent.value);
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
    height: 200px; /* 모바일에서 텍스트 영역 높이 조정 */
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
