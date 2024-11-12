<template>
  <Header></Header>

  <div class="container-fluid d-flex flex-column align-items-center justify-content-center ">
    <div class="card d-flex justify-content-center align-items-center p-3" id="background">

      <div class="p-4 p-md-5 w-100 ">
        <div class="d-flex align-items-center ">
          <button class="btn btn-link  mb-3" @click="goBack">
            <i class="bi bi-arrow-left arrow-icon"></i>
          </button>
        </div>  
        <h1 class=" mb-4 fs-2 fw-bold"> 공유주차장 등록 </h1>

        <div class="d-flex mh-3 mb-4">
          <h2 class="m-0 fs-3">
            <span class="text-primary" id="name">{{ name }}</span>
            <span class="ms-2">님</span>
          </h2>
        </div>

        <div style="margin-top: 40px;"> </div>

        <div class="table-responsive">
          <table class="table table-borderless mb-3">
            <tbody>
              <!-- 폰 번호 입력 -->
              <tr>
                <th class="align-middle">
                  <label class="form-label fs-5 mb-0" for="phone-number">휴대폰 번호</label>
                </th>
                <td>
                  <input id="phone-number" class="form-control form-control-lg fs-5" placeholder="010-1234-5678"
                    @focus="showPhoneInfo" @blur="hidePhoneInfo">
                </td>
              </tr>
              <!-- 폰번호 추가 정보 -->
              <tr class="info-row">
                <th></th>
                <td>
                  <p id="phone-info" class="form-text text-primary" style="font-size: 15px;">
                    공유주차장에 결제가 발생할 경우 위 번호로 문자가 전송됩니다.
                  </p>
                </td>
              </tr>

              <!-- 생년월일 입력 -->
              <tr>
                <th class="align-middle">
                  <label class="form-label fs-5 mb-0" for="birth">생년월일</label>
                </th>
                <td>
                  <input id="birth" class="form-control form-control-lg fs-5" placeholder="법정생년월일 6자리">
                </td>
              </tr>

              <!-- 차량번호 입력 -->
              <tr>
                <th class="align-middle">
                  <label class="form-label fs-5 mb-0" for="car-number">차량 번호</label>
                </th>
                <td>
                  <input id="car-number" class="form-control form-control-lg fs-5" placeholder="00다 0000"
                    @focus="showCarInfo" @blur="hideCarInfo">
                </td>
              </tr>
              <!-- 차 번호 추가 정보 -->
              <tr class="info-row">
                <th></th>
                <td>
                  <p id="car-info" class="form-text text-primary" style="font-size: 15px;">
                    거주자우선주차구역 배정 시 신청하신 차량 번호를 입력해주세요.
                  </p>
                </td>
              </tr>

              <!-- 거주지 입력 -->
              <tr>
                <th class="align-middle">
                  <label class="form-label fs-5 mb-0" for="location">위 치</label>
                </th>
                <td>
                  <select id="location" v-model="selectedLocation" class="form-select form-select-lg fs-5">
                    <option value="" disabled selected>배정받은 위치를 선택하세요.</option>
                    <option v-for="location in locations" :key="location.value" :value="location.value">
                      {{ location.text }}
                    </option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>

          <p class="mt-3 mb-2" style="font-size: 15px; color: gray;">※ 자치구(또는 공단)에 신청한 정보와 맞지 않을 경우 등록이 되지 않을 수 있습니다.
          </p>
          <p class="mb-0" style="font-size: 15px; color: gray;">※ 시간등록을 하지 않을 경우 등록된 주차장은 공유되지 않습니다. </p>
        </div>

        <div class="d-flex justify-content-center gap-3 mt-5">
          <button class="btn btn-primary btn-lg fs-5 px-5" @click="showModal">등록하기</button>
        </div>

        <!-- 모달창 -->
        <div class="modal fade" id="warningModal" tabindex="-1" aria-labelledby="warningModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="warningModalLabel">등록 완료</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <p class="mb-0" style="font-size: 18px;">주차구역 등록이 완료되었습니다.</p>
                <p class="mb-2" style="font-size: 18px;">이용시간 등록 페이지로 이동합니다.</p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal"
                  @click="gotoTimesetView">확인</button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

  </div>

</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import Header from "@/components/Header.vue";
import { Modal } from 'bootstrap';
import { useRouter } from 'vue-router';
import axios from 'axios'


const router = useRouter();

//goBack 함수
const goBack = () => {
  router.go(-1);
};



//사용자 데이터
// const users = 
//   { id: 1, name: "이름"}

// //back으로 보낼 공유주차장 소유자 확인 데이터
// const userParkingSpot = reactive({
//   phoneNumber: '',
//   birth: '',
//   carNumber:'',
//   location: ''
// });

//사용자 이름
const name = ref("");

onMounted(() => {
  modal = new Modal(document.getElementById('warningModal'));
});


const gotoTimesetView = () => {
  router.push('/timeset');
}

function showPhoneInfo() {
  const phoneInfo = document.getElementById('phone-info');
  const infoRow = phoneInfo.closest('.info-row');
  phoneInfo.classList.add('show');
  infoRow.classList.add('show');
}

function hidePhoneInfo() {
  const phoneInfo = document.getElementById('phone-info');
  const infoRow = phoneInfo.closest('.info-row');
  phoneInfo.classList.remove('show');
  infoRow.classList.remove('show');
}

function showCarInfo() {
  const carInfo = document.getElementById('car-info');
  const infoRow = carInfo.closest('.info-row');
  carInfo.classList.add('show');
  infoRow.classList.add('show');
}

function hideCarInfo() {
  const carInfo = document.getElementById('car-info');
  const infoRow = carInfo.closest('.info-row');
  carInfo.classList.remove('show');
  infoRow.classList.remove('show');
}

const selectedLocation = ref('');

// select 박스 데이터
const locations = ref([
  { value: 'gangnam', text: '강남구' },
  { value: 'gangdong', text: '강동구' },
  { value: 'gangbuk', text: '강북구' },
  { value: 'gangseo', text: '강서구' },
  { value: 'gwanak', text: '관악구' },
  { value: 'gwangjin', text: '광진구' },
  { value: 'guro', text: '구로구' },
  { value: 'geumcheon', text: '금천구' },
  { value: 'nowon', text: '노원구' },
  { value: 'dobong', text: '도봉구' },
  { value: 'dongdaemun', text: '동대문구' },
  { value: 'dongjak', text: '동작구' },
  { value: 'mapo', text: '마포구' },
  { value: 'seodaemun', text: '서대문구' },
  { value: 'seocho', text: '서초구' },
  { value: 'seongdong', text: '성동구' },
  { value: 'seongbuk', text: '성북구' },
  { value: 'songpa', text: '송파구' },
  { value: 'yangcheon', text: '양천구' },
  { value: 'yeongdeungpo', text: '영등포구' },
  { value: 'yongsan', text: '용산구' },
  { value: 'eunpyeong', text: '은평구' },
  { value: 'jongno', text: '종로구' },
  { value: 'jung', text: '중구' },
  { value: 'jungnang', text: '중랑구' }
]);

//모달 창 띄우기
let modal;


const showModal = () => {
  modal.show();
};

</script>

<style scoped>
.container-fluid {
  padding-top: 20px;
  overflow-x: hidden;
}

.info-row {
  display: none;
}

.info-row.show {
  display: table-row;
}

.form-text {
  display: none;
  margin: 0;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out, padding 0.3s ease-out;
}

.form-text.show {
  display: block;
  max-height: 100px;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.table th {
  width: 150px;
  vertical-align: middle;
}

.table td {
  min-height: 80px;
  vertical-align: top;
  position: relative;
}

.container-fluid {
  padding-top: 20px;
  overflow-x: hidden;
}

@media (max-width: 768px) {
  .info-row.show {
    display: block;
  }

  .table th,
  .table td {
    display: block;
    width: 100%;
  }

  .table th {
    padding-bottom: 0;
  }



  .card {
    padding: 2rem !important;
  }

  h1 {
    font-size: 1.5rem !important;
  }

  h2 {
    font-size: 1.3rem !important;
  }

  .form-control,
  .form-select,
  .btn {
    font-size: 1rem !important;
  }
}
</style>