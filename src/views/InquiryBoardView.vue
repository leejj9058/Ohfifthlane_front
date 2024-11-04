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
              <th class="noticeNo">No</th>
              <th class="noticeTitle">제목</th>
              <th class="noticeDate">작성일</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="notice in notices":key="notice.id"class="noticeIndex" @click="gotoNoticeOne(notice.id)" > 
              <td class="text-center">{{ notice.id }}</td>
              <td  class="noticeTitleOne">{{ notice.title }}</td>
              <td class="text-center">{{notice.date}}</td>
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

const notices = ref ( [
  {id:1, title: "게시글 1", date: "2024.10.11"},
  {id:2, title: "두번째 글", date: "2024.10.15"},
  {id:3, title: "세번째 글입니다.", date: "2024.10.16"}

])

const gotoNoticeOne = (id) => {
  router.push(`/notice/${id}`);
};

const gotoNew = () => {
  router.push(`/newboard`)
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
