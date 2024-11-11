<template>
  <Header></Header>

  <div class="d-flex justify-content-center align-items-center p-3" id="background">

    <!-- 본문 -->
    <div class="p-4 p-md-5 w-100">

      <h1 class="mb-4 fs-2 fw-bold">{{ report.reportLat }},  {{ report.reportLon }}</h1>

      <div class="d-flex justify-content-between align-items-center mb-0">
        <p class="mb-0" style="color: #A2A2A2;">{{ report.reportTime }}</p>
      </div>


      <hr>

      <div class="card d-flex flex-column justify-content-center p-4" style="height: 800px;">


        <!-- 사진 공간 -->
        <div class="picture mb-4 mt-4 d-flex justify-content-center align-items-center"
          style="height: 50%; width: 100%">
          <!-- 엑시오스로 연결한 이미지 불러옴 -->
          <img v-if="imageUrl" :src="imageUrl" alt="Report Image" class="img-fluid" style="max-height: 100%; max-width: 100%; object-fit: contain;">
          <p v-else>이미지를 불러올 수 없습니다.</p>
        </div>

        <table border="1" class="table" style="width: 100%; height: 300px; border-collapse: collapse;">

          <thead>
            <tr>
              <th>접수시간</th>
              <td colspan="2">{{ report.reportTime }}</td>
            </tr>
          </thead>

          <tbody>
            <tr>
              <th>위치</th>
              <td colspan="2">{{ report.reportAddress }}</td>

            </tr>
            <tr>
              <th>구획번호</th>
              <td colspan="2">{{ report.rpzNum }}</td>

            </tr>
            <tr>
              <th>차량번호</th>
              <td colspan="2">{{ report.reportCarNumber }}</td>

            </tr>
            <tr>
              <th>신고자이름 / 번호</th>
              <td>{{ report.userName }}</td>
              <td>{{ report.userTel }}</td>

            </tr>
          </tbody>
        </table>

        <!-- 버튼 -->
        <div class="d-flex justify-content-center mt-4">
          <template v-if="report.reportStatus === '0'"> 
            <!--  0~2 (0 = 미처리) 일 경우 견인 반려-->
            <button class="btn btn-primary me-4" @click="tractionBtn">견인</button>
            <button class="btn btn-danger ms-4" @click="rejectBtn">반려</button>
          </template>

          <template v-else>
            <button class="btn btn-secondary" @click="okBtn">확인</button>
          </template>
        </div>
        <!-- 버튼 -->

      </div>


    </div>
    <!-- 본문 -->


  </div>


</template>



<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import Header from "@/components/Header.vue";
import axios from 'axios';


const route = useRoute(); //라우터 객체 생성
const router = useRouter();
const reportId = route.params.reportId;  // URL에서 reportId 가져오기
const imageUrl = ref(''); //db에서 가져올 이미지

onMounted(() => {
  console.log(reportId);
  getReportDetail();
})


const report = ref([])

const getReportDetail = async () => {
  console.log('신고 요청 시작');

  try {
    const response = await axios.post('/api/reportDetail', { reportId });
    console.log('응답 데이터:', response);
    // 신고사항 불러오기 성공 (상태 코드 200-299)
    if (response.status >= 200 && response.status < 300) {
      console.log(response.data + '공지사항 success');
      report.value = response.data;
      imageUrl.value = response.data.reportImage; //이미지 가져오기 
    } else {
      // 예상치 못한 상태 코드
      throw new Error('Unexpected response status');
    }
  } catch (error) {
    if (error.response) {
      // 서버가 2xx 범위를 벗어나는 상태 코드로 응답한 경우
      console.error('신고 요청 실패:', error.response.data.message || '알 수 없는 오류 발생');
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
.table td {
  text-align: left;
  padding-left: 10px;
  /* 왼쪽 패딩 추가 (선택사항) */
}

.table th {
  text-align: center;
  /* th는 중앙 정렬 유지 */
  width: 30%;
  background-color: #f0f0f0;
}


.table td,
.table th {
  border: 1px solid black;
}


.table th {
  width: 30%;
  background-color: #f0f0f0;
}

.table td:nth-child(2) {
  width: 35%;
}

.table td:nth-child(3) {
  width: 35%;
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