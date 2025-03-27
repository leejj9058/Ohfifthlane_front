<template>
  <Header></Header>

  <div class="d-flex justify-content-center align-items-center p-3" id="background">
    <!-- 본문 -->
    <div class="p-4 p-md-5 w-100">
      <h1 class="mb-4 fs-2 fw-bold">
        {{ disabledPersonReport.disabledPersonReportAddress }}
      </h1>

      <div class="d-flex justify-content-between align-items-center mb-0">
        <p class="mb-0" style="color: #a2a2a2">
          {{ formatDate(disabledPersonReport.disabledPersonReportTime) }}
        </p>
      </div>
      <hr />
      
      <div
        class="card d-flex flex-column justify-content-center p-4"
        style="height: 800px"
      >
        <!-- 사진 공간 -->
        <div
          class="picture mb-4 mt-4 d-flex justify-content-center align-items-center"
          style="height: 50%; width: 100%"
        >
          <img
            v-if="imageUrl"
            :src="imageUrl"
            alt="disabledPersonReport Image"
            class="img-fluid"
            style="max-height: 100%; max-width: 100%; object-fit: contain"
          />
          <p v-else>이미지를 불러올 수 없습니다.</p>
        </div>

        <table
          border="1"
          class="table"
          style="width: 100%; height: 300px; border-collapse: collapse"
        >
          <thead>
            <tr>
              <th>접수시간</th>
              <td colspan="2">
                {{ formatDate(disabledPersonReport.disabledPersonReportTime) }}
              </td>
            </tr>
          </thead>

          <tbody>
            <tr>
              <th>위치</th>
              <td colspan="2">{{ disabledPersonReport.disabledPersonReportAddress }}</td>
            </tr>
            <tr>
              <th>차량번호</th>
              <td colspan="2">
                {{ disabledPersonReport.disabledPersonReportCarNumber }}
              </td>
            </tr>
            <tr>
              <th>신고자이름 / 번호</th>
              <td>{{ disabledPersonReport.userName }}</td>
              <td>{{ disabledPersonReport.userTel }}</td>
            </tr>
          </tbody>
        </table>

        <!-- 버튼 -->
        <div class="d-flex justify-content-center mt-4">
          <template v-if="disabledPersonReport.disabledPersonReportStatus === 0">
            <button
              class="btn btn-primary me-4"
              @click="updateDisabledPersonReportStatus(1)"
            >
              승인
            </button>
            <button
              class="btn btn-danger ms-4"
              @click="updateDisabledPersonReportStatus(2)"
            >
              반려
            </button>
          </template>

          <template v-else>
            <button class="btn btn-secondary" @click="goToDisabledPersonReportList">
              확인
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Header from "@/components/Header.vue";
import axios from "axios";
import { format } from "date-fns";

const route = useRoute();
const router = useRouter();
const disabledPersonReportId = route.params.disabledPersonReportId;
const imageUrl = ref("");

const disabledPersonReport = ref({});
const loading = ref(true);

const updateDisabledPersonReportStatus = async (status) => {
  const statusText = status === 1 ? "승인" : "반려";
  if (confirm(`${statusText} 처리 하시겠습니까?`)) {
    try {
      const response = await axios.put(
        `/api/updateDisabledPersonReportStatus/${disabledPersonReportId}/${status}`
      );
      if (response.status === 200) {
        disabledPersonReport.value.disabledPersonReportStatus = status;
        alert("처리가 완료되었습니다.");
      } else {
        alert("상태 변경에 실패했습니다.");
      }
    } catch (error) {
      console.error("상태 변경 실패:", error);
      alert("상태 변경에 실패했습니다.");
    }
  }
};

const goToDisabledPersonReportList = () => {
  router.push("/disabledPersonReportList");
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date)) return "";
  return format(date, "yyyy-MM-dd HH:mm");
};

onMounted(async () => {
  try {
    console.log(disabledPersonReportId);
    await getDisabledPersonReportDetail();
  } catch (error) {
    console.error("데이터 로딩 오류:", error);
  } finally {
    loading.value = false;
  }
});

const getDisabledPersonReportDetail = async () => {
  try {
    const response = await axios.get(
      `/api/disabledPersonReportDetail/${disabledPersonReportId}`
    );
    console.log("응답 데이터:", response);
    if (response.status >= 200 && response.status < 300) {
      disabledPersonReport.value = response.data;
      imageUrl.value = `/src/assets/images/uploads/${response.data.disabledPersonReportImage}`;
    } else {
      throw new Error("Unexpected response status");
    }
  } catch (error) {
    console.error("신고 요청 실패:", error.message);
  }
};
</script>

<style scoped>
.table td {
  text-align: left;
  padding-left: 10px;
}

.table th {
  text-align: center;
  width: 30%;
  background-color: #f0f0f0;
}

.table td,
.table th {
  border: 1px solid black;
}

.table td:nth-child(2) {
  width: 35%;
}

.table td:nth-child(3) {
  width: 35%;
}

@media (max-width: 768px) {
  .table td,
  .table th {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
}
</style>
