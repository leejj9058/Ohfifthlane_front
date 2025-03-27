<template>
  <Header></Header>

  <div class="d-flex justify-content-center align-items-center p-3" id="background h-100">

    <!-- 본문 -->
    <div class="p-4 p-md-5 w-100">

      <h1 class="mb-4 fs-2 fw-bold">거주자 신고 내역</h1>

      <div class="d-flex justify-content-start">
        <Datepicker class="customPicker" v-model="picked" :locale="locale" :format="inputFormat"
          @update:model-value="handleDateChange">
        </Datepicker>
      </div>


      <!-- 줄 -->
      <hr>
      <!-- 줄 -->

      <!-- 게시글 테이블 -->
      <div class="table-responsive  vh-100">

        <table class="table mb-3 ">
          <thead>
            <tr class="text-center">
              <th class="reportNo">No</th>
              <th class="reportTitle">제목</th>
              <th class="reportTitle">날짜</th>
              <th class="reportStatus">상태</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="report in reportList" :key="report.reportId" class="reportIndex" @click="goToReportDetail(report.reportId)">
              <td class="text-center">{{ report.reportId }}</td>
              <td class="reportTitle text-center">{{ report.reportAddress }}</td>
              <td class="reportTitle text-center">{{ formatDate(report.reportTime) }}</td>
              <td class="text-center">
                <span :class="['status-badge', getStatusClass(report.reportStatus)]">
                  {{ getStatusText(report.reportStatus) }}
                </span>
              </td>
            </tr>

          </tbody>
        </table>

      </div>

    </div>
    <!-- 본문 -->


  </div>


</template>

<script setup>
import Header from "@/components/Header.vue";
import Datepicker from 'vue3-datepicker';
import { ko } from 'date-fns/locale';
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import { format } from 'date-fns'; // date-fns에서 format 함수 가져오기
import { useRouter } from 'vue-router'; // router 추가

const router = useRouter();

// Datepicker 관련 설정
const picked = ref(new Date()); // 오늘 날짜
const locale = reactive(ko); // 한국어 로케일 적용
const inputFormat = (date) => {
  if (!date) return '';
  const year = date.getFullYear(); //날짜 가져오기
  const month = String(date.getMonth() + 1).padStart(2, '0'); //월 + 1 = javascript에서는 월 0부터 시작 + 두 자리 문자열로 만든다.
  const day = String(date.getDate()).padStart(2, '0'); // 일 = 두 자리 문자열로 만든다. 
  return `${year}-${month}-${day}`; // YYYY-MM-DD 형식으로 처리
};

// reportTime 포맷팅 함수
const formatDate = (dateString) => {
  const date = new Date(dateString); // ISO 8601 형식의 문자열을 Date 객체로 변환
  return format(date, 'yyyy-MM-dd HH:mm'); // 원하는 형식으로 반환
};

// 날짜 선택 이벤트 핸들러
const handleDateChange = (date) => {
  console.log('선택된 날짜:', inputFormat(date));
  fetchList(); // 날짜 변경 후 목록 다시 가져오기
};

//const reportList = ref([]); // 신고 내역 리스트
const reportList = ref([
  {
    reportId: 1,
    reportAddress: '서울 강남구 123-45',
    reportTime: '2024-11-01T14:00:00',
    reportStatus: 0,
  },
  {
    reportId: 2,
    reportAddress: '서울 서초구 234-56',
    reportTime: '2024-11-02T15:30:00',
    reportStatus: 1,
  },
  {
    reportId: 3,
    reportAddress: '서울 종로구 345-67',
    reportTime: '2024-11-03T16:45:00',
    reportStatus: 2,
  },
]);


// 신고 목록 가져오기
const fetchList = async () => {
  try {
    const response = await axios.post('/api/reportList', {
      date: inputFormat(picked.value) // 날짜 서버에 전달
    });
    // 서버 응답이 빈 배열이면 기본 더미 데이터 유지
    reportList.value = response.data.length ? response.data : reportList.value;
    console.log(`response:`, response.data);
  } catch (error) {
    console.error('Error fetching report list:', error);
  }
};

onMounted(() => {
  fetchList(); // 컴포넌트가 마운트될 때 데이터 가져오기
});

const getStatusClass = (status) => {
  switch (status) {
    case 0: return 'status-unprocessed';
    case 1: return 'status-completed';
    case 2: return 'status-rejected';
    default: return '';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 0: return '미처리';
    case 1: return '완료';
    case 2: return '반려';
    default: return '알 수 없음';
  }
};

// 해당 신고 상세 페이지로 이동
const goToReportDetail = (reportId) => {
  router.push(`/reportDetail/${reportId}`);
};

</script>





<style scoped>
/* 상태 뱃지 */
.status-badge {
  display: inline-block;
  padding: 0.25em 0.6em;
  font-size: 0.75em;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.25rem;
}

.status-unprocessed {
  color: #fff;
  background-color: #dc3545;
}

.status-processing {
  color: #fff;
  background-color: #007bff;
}

.status-completed {
  color: #fff;
  background-color: #28a745;
}

.status-rejected {
  color: #fff;
  background-color: #6c757d;
}

/* 상태뱃지 */



.customPicker {
  font-size: 14px;
  width: 100px;
}

/* 데이트픽커 팝업 크기 조절 */
.customPicker :deep(.dp__main) {
  width: 250px;
  /* 달력 전체 너비 */
}

.customPicker :deep(.dp__input) {
  font-size: 14px;
  padding: 8px;
}

.customPicker :deep(.dp__calendar_header),
.customPicker :deep(.dp__calendar_item) {
  font-size: 12px;
}

.customPicker :deep(.dp__cell_inner) {
  width: 30px;
  height: 30px;
}

/* 테이블 스타일 */
.table {
  width: 100%;
}

.reportNo {
  width: 10%;
}

.reportTitle {
  width: 70%;
  cursor: pointer;
}

.reportDate {
  width: 20%;
}

/* 반응형 디자인을 위한 미디어 쿼리 */
@media (max-width: 768px) {
  .customPicker {
    width: 120px;
  }

  .customPicker :deep(.dp__main) {
    width: 220px;
  }

  .customPicker :deep(.dp__input) {
    font-size: 12px;
    padding: 6px;
  }

  .customPicker :deep(.dp__calendar_header),
  .customPicker :deep(.dp__calendar_item) {
    font-size: 10px;
  }

  .customPicker :deep(.dp__cell_inner) {
    width: 25px;
    height: 25px;
  }

  .table td,
  .table th {
    padding: 0.3rem;
    font-size: 0.8rem;
  }

  .reportNo {
    width: 15%;
  }

  .reportTitle {
    width: 55%;
  }

  .reportDate {
    width: 30%;
  }
}

@media (max-width: 576px) {
  .customPicker {
    width: 100px;
  }

  .customPicker :deep(.dp__main) {
    width: 200px;
  }

  .customPicker :deep(.dp__cell_inner) {
    width: 22px;
    height: 22px;
  }

  .table td,
  .table th {
    padding: 0.2rem;
    font-size: 0.7rem;
  }
}
</style>
