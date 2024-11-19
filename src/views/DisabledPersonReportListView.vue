<template>
  <Header></Header>

  <div class="d-flex justify-content-center align-items-center p-3" id="background h-100">
    <!-- 본문 -->
    <div class="p-4 p-md-5 w-100">
      <h1 class="mb-4 fs-2 fw-bold">장애인 신고 내역</h1>

      <div class="d-flex justify-content-start">
        <Datepicker
          class="customPicker"
          v-model="picked"
          :locale="locale"
          :format="inputFormat"
          @update:model-value="handleDateChange"
        >
        </Datepicker>
      </div>

      <!-- 줄 -->
      <hr />
      <!-- 줄 -->

      <!-- 게시글 테이블 -->
      <div class="table-responsive vh-100">
        <table class="table mb-3">
          <thead>
            <tr class="text-center">
              <th class="disabledPersonReportNo">No</th>
              <th class="disabledPersonReportTitle">제목</th>
              <th class="disabledPersonReportTitle">날짜</th>
              <th class="disabledPersonReportStatus">상태</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="disabledPersonReport in disabledPersonReportList"
              :key="disabledPersonReport.disabledPersonReportId"
              class="disabledPersonReportIndex"
              @click="
                goTodisabledPersonReportDetail(
                  disabledPersonReport.disabledPersonReportId
                )
              "
            >
              <td class="text-center">
                {{ disabledPersonReport.disabledPersonReportId }}
              </td>
              <td class="disabledPersonReportTitle text-center">
                {{ disabledPersonReport.disabledPersonReportAddress }}
              </td>
              <td class="disabledPersonReportTitle text-center">
                {{ formatDate(disabledPersonReport.disabledPersonReportTime) }}
              </td>
              <td class="text-center">
                <span
                  :class="[
                    'status-badge',
                    getStatusClass(disabledPersonReport.disabledPersonReportStatus),
                  ]"
                >
                  {{ getStatusText(disabledPersonReport.disabledPersonReportStatus) }}
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
import Datepicker from "vue3-datepicker";
import { ko } from "date-fns/locale";
import { ref, reactive, onMounted } from "vue";
import axios from "axios";
import { format } from "date-fns"; // date-fns에서 format 함수 가져오기
import { useRouter } from "vue-router"; // router 추가

const router = useRouter();

// Datepicker 관련 설정
const picked = ref(new Date()); // 오늘 날짜
const locale = reactive(ko); // 한국어 로케일 적용
const inputFormat = (date) => {
  if (!date) return "";
  const year = date.getFullYear(); //날짜 가져오기
  const month = String(date.getMonth() + 1).padStart(2, "0"); //월 + 1 = javascript에서는 월 0부터 시작 + 두 자리 문자열로 만든다.
  const day = String(date.getDate()).padStart(2, "0"); // 일 = 두 자리 문자열로 만든다.
  return `${year}-${month}-${day}`; // YYYY-MM-DD 형식으로 처리
};

// disabledPersonReportTime 포맷팅 함수
const formatDate = (dateString) => {
  const date = new Date(dateString); // ISO 8601 형식의 문자열을 Date 객체로 변환
  return format(date, "yyyy-MM-dd HH:mm"); // 원하는 형식으로 반환
};

// 날짜 선택 이벤트 핸들러
const handleDateChange = (date) => {
  console.log("선택된 날짜:", inputFormat(date));
  fetchList(); // 날짜 변경 후 목록 다시 가져오기
};

const disabledPersonReportList = ref([]); // 신고 내역 리스트

// 신고 목록 가져오기
const fetchList = async () => {
  try {
    const response = await axios.post("/api/disabledPersonReportList", {
      date: inputFormat(picked.value), // 날짜 서버에 전달
    });
    disabledPersonReportList.value = response.data; // 응답 데이터에서 disabledPersonReportList를 받음
    console.log(`response:`, response.data);
  } catch (error) {
    console.error("Error fetching disabledPersonReport list:", error);
  }
};

onMounted(() => {
  fetchList(); // 컴포넌트가 마운트될 때 데이터 가져오기
});

const getStatusClass = (status) => {
  switch (status) {
    case 0:
      return "status-unprocessed";
    case 1:
      return "status-completed";
    case 2:
      return "status-rejected";
    default:
      return "";
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 0:
      return "미처리";
    case 1:
      return "완료";
    case 2:
      return "반려";
    default:
      return "알 수 없음";
  }
};

// 해당 신고 상세 페이지로 이동
const goTodisabledPersonReportDetail = (disabledPersonReportId) => {
  router.push(`/disabledPersonReportDetail/${disabledPersonReportId}`);
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

/* 테이블 셀에서 줄 바꿈 방지 */
.table td,
.table th {
  white-space: nowrap; /* 줄 바꿈 방지 */
}

.disabledPersonReportNo {
  width: 10%;
}

.disabledPersonReportTitle {
  width: 70%;
  cursor: pointer;
}

.disabledPersonReportDate {
  width: 20%;
}

/* 상태 열 너비 조정 */
.disabledPersonReportStatus {
  width: 15%; /* 너비 조정 */
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

  .disabledPersonReportNo {
    width: 15%;
  }

  .disabledPersonReportTitle {
    width: 55%;
  }

  .disabledPersonReportDate {
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
