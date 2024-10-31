<template>
  <div class="container-fluid d-flex flex-column align-items-center">
    <div class="search-container">
      <div class="input-group mb-1">
        <span class="input-group-text">
          <i class="bi bi-arrow-left"></i>
        </span>
        <div class="position-relative flex-grow-1">
          <input
            type="text"
            class="form-control"
            placeholder="목적지를 입력해주세요."
            v-model="searchQuery"
            style="padding-right: 40px;"
          />
          <span
            class="position-absolute"
            style="right: 10px; top: 50%; transform: translateY(-50%); cursor: pointer;"
            @click="sendSearchQuery"
          >
            <i class="bi bi-search"></i> <!-- 돋보기 아이콘 -->
          </span>
        </div>
      </div>
      <div v-for="(item, index) in listItems" :key="index" class="list-item m-2" @click="goToMap(item)">
        <div class="clickable-item"> 
          <strong v-html="item.title"></strong><br>
          <span>{{ item.address }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios'; // Axios 임포트
import { useRoute} from 'vue-router';


const listItems = ref([]);
const route = useRoute(); // 현재 라우트의 정보
const searchQuery = ref('');

onMounted(() => {
  if(route.params.destination != null){
    searchQuery.value = route.params.destination;
    console.log('성공'+searchQuery.value);
    sendSearchQuery();
  }
});

const goToMap = (item) => {
  console.log(item)
  
  /* router.push(`/map/${item.latitude}/${item.longitude}`); */
};

// 검색 쿼리를 서버로 전송하는 함수
const sendSearchQuery = async () => {
  if (searchQuery.value.trim() === '') {
    alert('목적지를 입력해주세요.'); // 입력이 비어있으면 알림
    return;
  }

  try {
    const response = await axios.get('/api/search', {
      params: { name: searchQuery.value } // 입력된 쿼리 전송
    });
    console.log('서버 응답:', response.data); // 서버 응답 확인
    listItems.value = response.data;
  } catch (error) {
    console.error('오류 발생:', error); // 오류 처리
  }
};
</script>

<style scoped>

/* 마우스 커서를 포인터로 변경 */
.clickable-item {
  cursor: pointer;
  transition: background-color 0.3s;
}

.container-fluid {
  padding-top: 20px;
  overflow-x: hidden;
}
.search-container {
  width: 100%;
  max-width: 400px;
  margin-right: 320px;
  padding-top: 2rem;
}

.input-group-text {
  cursor: pointer;
}

.no-history {
  text-align: center;
  color: #888;
  margin-top: 2rem;
}

.no-history i {
  font-size: 2rem;
  color: #ccc;
}

.no-history p {
  margin: 0.5rem 0;
  font-weight: bold;
}
</style>
