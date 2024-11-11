<template>
  <Header></Header>

  <div class="d-flex justify-content-center align-items-center p-3" id="background">

    <!-- 본문 -->
    <div class="p-4 p-md-5 w-100">

      <h1 class="mb-4 fs-2 fw-bold">{{ report.reportAddres }}</h1>

      <div class="d-flex justify-content-between align-items-center mb-0">
        <p class="mb-0" style="color: #A2A2A2;">{{ formatDate(report.reportTime) }}</p>
      </div>


      <hr>

      <div class="card d-flex flex-column justify-content-center p-4" style="height: 800px;">


        <!-- 사진 공간 -->
        <div class="picture mb-4 mt-4 d-flex justify-content-center align-items-center"
          style="height: 50%; width: 100%">
          <img v-if="imageUrl" :src="imageUrl" alt="Report Image" class="img-fluid" style="max-height: 100%; max-width: 100%; object-fit: contain;">
          <p v-else>이미지를 불러올 수 없습니다.</p>
        </div>

        <table border="1" class="table" style="width: 100%; height: 300px; border-collapse: collapse;">

          <thead>
            <tr>
              <th>접수시간</th>
              <td colspan="2">{{ formatDate(report.reportTime) }}</td>
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
          <template v-if="report.reportStatus === 0"> 
            <!--  0~2 (0 = 미처리) 일 경우 견인 반려-->
            <button class="btn btn-primary me-4" @click="updateReportStatus(1)">견인</button>
            <button class="btn btn-danger ms-4" @click="updateReportStatus(2)">반려</button>
          </template>

          <template v-else>
            <button class="btn btn-secondary" @click="goToReportList">확인</button>
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
import { useRoute, useRouter } from 'vue-router';
import Header from "@/components/Header.vue";
import axios from 'axios';
import { format } from 'date-fns';

const route = useRoute(); // 라우터 객체 생성
const router = useRouter();
const reportId = route.params.reportId;  // URL에서 reportId 가져오기
const imageUrl = ref(''); // db에서 가져올 이미지

const report = ref({
  
});

const loading = ref(true); // 로딩 상태 추가

const updateReportStatus = async (reportStatus) => {

  const statusText = reportStatus === 1 ? '견인' : '반려';
  if (confirm(`${statusText}처리 하시겠습니까?`)) {
    try {
      const response = await axios.put(`/api/updateReportStatus/${reportId}/${reportStatus}`);
      if (response.status == 200) {
        report.value.reportStatus = reportStatus; //상태 업데이트
        alert('견인처리가 완료되었습니다.');
      } else {
        alert('상태 변경에 실패했습니다.');
      }

    } catch (error) {
      console.error('견인 상태 변경 실패: ', error);
      alert('견인 상태변경에 실패했습니다.');
    }
  }
}

const goToReportList = () => {
  router.push('/reportList')
}



// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date)) {
    return '';  // 또는 'Invalid Date' time 포매팅 하고 나서 보여지게
  }
  return format(date, 'yyyy-MM-dd HH:mm'); // 원하는 형식으로 반환
};

onMounted(async () => {
  try {
    console.log(reportId);
    await getReportDetail();
  } catch (error) {
    console.error('데이터 로딩 오류:', error);
  } finally {
    loading.value = false; // 로딩이 끝났으므로 상태를 false로 변경
  }
});

const getReportDetail = async () => {
  try {
    const response = await axios.get(`/api/reportDetail/${reportId}`);
    console.log('응답 데이터:', response);
    if (response.status >= 200 && response.status < 300) {
      report.value = response.data;
      imageUrl.value = `/src/assets/images/uploads/${response.data.reportImage}`;
    } else {
      throw new Error('Unexpected response status');
    }
  } catch (error) {
    console.error('신고 요청 실패:', error.message);
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