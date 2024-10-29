<template>
  <Header></Header>

  <div class="d-flex justify-content-center align-items-center p-3" id="background">

    <!-- 본문 -->
    <div class="p-4 p-md-5 w-100">

      <h1 class="mb-4 fs-2 fw-bold">신고 내역</h1>

      <div class="d-flex justify-content-start">
        <Datepicker class="customPicker" v-model="picked" :locale="locale" :format="inputFormat"
          @update:model-value="handleDateChange">
        </Datepicker>
      </div>


      <!-- 줄 -->
      <hr>
      <!-- 줄 -->

      <!-- 게시글 테이블 -->
      <div class="table-responsive">

        <table class="table mb-3">
          <thead>
            <tr class="text-center">
              <th class="reportNo">No</th>
              <th class="reportTitle">제목</th>
              <th class="reportStatus">상태</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="report in reports" :key="report.id" class="reportIndex" @click="gotoReportOne(report.id)">
              <td class="text-center">{{ report.id }}</td>
              <td class="reportTitle text-center">{{ report.title }}</td>
              <td class="text-center">
                <span :class="['status-badge', getStatusClass(report.status)]">
                  {{ report.status }}
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
import { ref, reactive } from 'vue';


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

// 날짜 선택 이벤트 핸들러
const handleDateChange = (date) => {
  console.log('선택된 날짜:', inputFormat(date));
  //날짜 선택하면 날짜에 해당하는 신고내역 가져오기
};


const reports = ref([
  { id: 1, title: "2024.10.27 서초구", status: "미처리" },
  { id: 2, title: "2024.10.27 서초구", status: "처리중" },
  { id: 3, title: "2024.10.27 서초구", status: "완료" },
  { id: 3, title: "2024.10.27 서초구", status: "반려" }

])

//
const getStatusClass = (status) => {
  switch (status) {
    case '미처리':
      return 'status-unprocessed';
    case '처리중':
      return 'status-processing';
    case '완료':
      return 'status-completed';
    case '반려':
      return 'status-rejected';
  }
};



// 해당 게시글 누르면 넘어가는 거
const gotoReportOne = (id) => {
  router.push(`/report/${id}`);
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
