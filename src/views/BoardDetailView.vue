<template>
  <Header></Header>

  <div class="d-flex justify-content-center align-items-center p-3" id="background">

    <!-- 본문 -->
    <div class="p-4 p-md-5 w-100">

      <h1 class="mb-4 fs-2 fw-bold">{{notices[0].title}}</h1>

      <div class="d-flex justify-content-between align-items-center mb-0">
        <p class="mb-0" style="color: #A2A2A2;">{{notices[0].date}}</p>

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
        {{notices[0].detail}}
      </div>



    </div>
    <!-- 본문 -->


  </div>


</template>

<script setup>
import { ref, onMounted } from 'vue';
import Header from "@/components/Header.vue";
import router from '@/router';


// 수정 로직 구현
function editPost() {
  console.log('게시물 수정');
}

// 삭제 로직 구현
function deletePost() {
  console.log('게시물 삭제');
}

const notices = ref([
  { id: 1, title: "게시글 1", date: "2024.10.11 18:52", detail:"이 글의 본문입니다."
   }
])


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
