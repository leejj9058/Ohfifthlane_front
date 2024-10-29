<template>
  <Header></Header>

  <div class="d-flex justify-content-center align-items-center p-3" id="background">

    <!-- 본문 -->
    <div class="p-4 p-md-5 w-100">

      <h1 class="mb-4 fs-2 fw-bold">{{ report[0].title }}</h1>

      <div class="d-flex justify-content-between align-items-center mb-0">
        <p class="mb-0" style="color: #A2A2A2;">{{ report[0].date }}</p>
      </div>


      <hr>

      <div class="card d-flex flex-column justify-content-center p-4" style="height: 800px;">


        <!-- 사진 공간 -->
        <div class="picture mb-4 mt-4  d-flex justify-content-center align-items-center"  style="height: 50%; width: 100%">
          <img src="@/assets/images/33.png" alt="Report Image" class="img-fluid" style="max-height: 100%; max-width: 100%; object-fit: contain;">
        </div>
        <!-- 사진 공간 -->

        <table border="1" class="table" style="width: 100%; height: 300px; border-collapse: collapse;">

          <thead>
            <tr>
              <th>접수시간</th>
              <td colspan="2">{{ report[0].date }}</td>
            </tr>
          </thead>

          <tbody>
            <tr>
              <th>위치</th>
              <td colspan="2">{{ report[0].location }}</td>

            </tr>
            <tr>
              <th>구획번호</th>
              <td colspan="2">{{ report[0].parkinglotNo }}</td>

            </tr>
            <tr>
              <th>차량번호</th>
              <td colspan="2">{{ report[0].carNo }}</td>

            </tr>
            <tr>
              <th>신고자이름 / 번호</th>
              <td>{{ report[0].reporterName }}</td>
              <td>{{ report[0].reporterPhone }}</td>

            </tr>
          </tbody>
        </table>

        <!-- 버튼 -->
        <div class="d-flex justify-content-center mt-4">
          <template v-if="report[0].status==='미처리'">
            <button class="btn btn-primary me-4">견인</button>
            <button class="btn btn-danger ms-4">반려</button>
          </template>

          <template v-else>
            <button class="btn btn-secondary">확인</button>
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
import Header from "@/components/Header.vue";



const report = ref([
  {
    id: 1, 
    title: "2024.07.08 서초구", 
    date: "2024.07.08 15:34", 
    location: "서초구 00로", 
    parkinglotNo:"143-2", 
    carNo: "123가 1234", 
    reporterName:"함지수", 
    reporterPhone:"00000",
    status:"미처리"
  }
])


// const report = ref({});


// //back이랑 연결해서 데이터 가져오기 (axios)
// const getReport = async () => {
//   try {
//     // const response = await axios.get('http://your-api-url/report/1'); // back에서 가져와서 연결할 axios 주소를 여기에 적어준다.
//     const response = {
//       data: {
//         id: 1, 
//         title: "2024.07.08 서초구", 
//         date: "2024.07.08 15:34", 
//         location: "서초구 00로", 
//         parkinglotNo: "143-2", 
//         carNo: "123가 1234", 
//         reporterName: "함지수", 
//         reporterPhone: "00000",
//         status: "미처리"
//       }
//     };
//     report.value = response.data; //가져온 데이터를 report의 value에 넣어줌
//   } catch (error) {
//     console.error('데이터 전송 오류', error);
//   };
// }

// onMounted(()=> {
//   getReport()
// })

</script>

<style scoped>

.table td {
  text-align: left;
  padding-left: 10px; /* 왼쪽 패딩 추가 (선택사항) */
}

.table th {
  text-align: center; /* th는 중앙 정렬 유지 */
  width: 30%;
  background-color: #f0f0f0;
}


.table td, .table th {
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