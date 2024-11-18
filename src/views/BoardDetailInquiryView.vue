<template>
  <Header></Header>

  <div class="d-flex justify-content-center align-items-center p-4" id="background">


    <div class="p-4 p-md-5 w-100">

      <!-- 제목 카드 -->
      <div class="card p-2">
        <div class="d-flex justify-content-between align-items-center">
          <i class="bi bi-backspace fs-4 back" style="color: #A2A2A2;" @click="goBack"></i>

          <h1 class="mb-0 fs-4 fw-bold flex-grow-1 mx-3">
            {{ inquiry.inquiryTitle }}
          </h1>

          <p class="mb-0 me-3" style="color: #A2A2A2;">{{ formatDate(inquiry.inquiryDate) }}</p>

          <div class="dropdown">
            <button class="btn btn-link p-0" type="button" aria-expanded="false" id="detailBtn" style="color: black;"
              @click="toggleDropdown">
              <i class="bi bi-three-dots-vertical"></i>
            </button>

            <!-- 눌렀을 때 드롭다운 되는 메뉴리스트 -->
            <ul class="dropdown-menu" :class="{ show: isDropdownOpen }" aria-labelledby="detailBtn">
              <li>
                <a class="dropdown-item" @click="editPost">
                  <i class="bi bi-pen"></i> 수정하기
                </a>
              </li>
              <li>
                <a class="dropdown-item" @click="deletePost">
                  <i class="bi bi-trash3"></i> 삭제하기
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- 제목 카드 -->


      <!-- 줄 -->
      <hr>
      <!-- 줄 -->

      <!-- 본문 -->
      <div class="card p-4" style="height: 400px;">
        {{ inquiry.inquiryContent }}
      </div>
      <!-- 본문 -->

      <div class="card mt-4">
        <div class="d-flex flex-column">
          <div class="input-group mb-3 p-4">
            <input type="text" class="form-control" placeholder="문의답변을 입력하세요." aria-label="댓글 입력"
              v-model="newComment" />
            <button class="btn btn-primary" @click="submitComment">댓글달기</button>
          </div>
          <div class="comment-list">
            <div v-for="comment in comments" :key="comment.id" class="comment-item">
              <p><strong>{{ comment.userName }}</strong>: {{ comment.content }}</p>
            </div>
          </div>
        </div>
      </div>

    </div>



  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Header from "@/components/Header.vue";
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
//import router from '@/router';

const route = useRoute(); //라우터 객체 생성
const router = useRouter();

const inquiryId = route.params.inquiryId;  // URL에서 inquiryId 가져오기

const isDropdownOpen = ref(false); //드랍다운

const dropdownRef = ref(null);


onMounted(() => {
  console.log(inquiryId);
  getInquiryDetail();
})


const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

//뒤로가기
const goBack = () => {
  router.go(-1);
};

// 수정 로직 구현
function editPost() {
  console.log('게시물 수정');
  router.push('/boardWrite')
}

// 삭제 로직 구현
function deletePost() {
  console.log('게시물 삭제');
  router.push('/inquiry')
}



// 날짜 형식 변환
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const inquiry = ref({})

const getInquiryDetail = async () => {
  console.log('문의사항 요청 시작');

  try {
    const response = await axios.post('/api/getInquiryDetail', { inquiryId });
    console.log('응답 데이터:', response);
    // 문의사항 불러오기 성공 (상태 코드 200-299)
    if (response.status >= 200 && response.status < 300) {
      console.log(response.data + '문의사항 success');
      inquiry.value = response.data;
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

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  min-width: 120px;
  max-width: 200px;
  z-index: 1000;
}

.dropdown-item {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.back {
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


.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  z-index: 1000;
  min-width: 10rem;
  padding: 0.5rem 0;
  margin: 0.125rem 0 0;
  font-size: 1rem;
  color: #212529;
  text-align: left;
  list-style: none;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, .15);
  border-radius: 0.25rem;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 0.25rem 1.5rem;
  clear: both;
  font-weight: 400;
  color: #212529;
  text-align: inherit;
  white-space: nowrap;
  background-color: transparent;
  border: 0;
}

@media (max-width: 768px) {
  .dropdown-menu {
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    border-radius: 0.25rem 0.25rem 0 0;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  }

  .dropdown-item {
    padding: 0.75rem 1.5rem;
  }
}
</style>