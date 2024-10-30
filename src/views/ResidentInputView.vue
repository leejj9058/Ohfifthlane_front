<template>
  <Header></Header>
  <div class="form-container">
    <img :src="photo" alt="Captured Photo" class="form-photo" />
    <p class="form-title">차량번호</p>
    <input type="text" class="form-input" placeholder="차량번호 입력" v-model="vehicleNumber" />
    <p class="form-title">주차면번호</p>
    <input type="text" class="form-input" placeholder="주차면번호 입력" v-model="parkingNumber" />
    <p class="form-title">신고자 이름</p>
    <input type="text" class="form-input" placeholder="신고자 이름 입력" v-model="reporterName" />
    <button class="submit-button" @click="submitReport">신고하기</button>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import { ref, onMounted } from "vue";
import axios from "axios";

export default {
  components: {
    Header,
  },
  props: {
    photo: {
      type: String,
      default: null,
    },
  },
  setup(props) {
    const vehicleNumber = ref("");
    const parkingNumber = ref("");
    const reporterName = ref("");

    const submitReport = async () => {
      // 입력값 유효성 검사
      if (!vehicleNumber.value || !parkingNumber.value || !reporterName.value) {
        alert("모든 항목을 입력해주세요");
        return;
      }
      try {
        const response = await axios.post("/api/report", {
          vehicleNumber: vehicleNumber.value,
          parkingNumber: parkingNumber.value,
          reporterName: reporterName.value,
          photo: props.photo,
        });
        if (response.status === 200) {
          alert("신고 접수 되었습니다");
        }
      } catch (error) {
        console.error("신고 실패:", error);
        alert("신고 중 오류가 발생했습니다");
      }
    };

    onMounted(() => {
      if (props.photo) {
        console.log("Captured photo received:", props.photo);
      }
    });

    return {
      vehicleNumber,
      parkingNumber,
      reporterName,
      submitReport,
    };
  },
};
</script>


<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f9f9f9;
  width: 100%;
  max-width: 400px;
  margin: 30px auto; /* 아래로 내려주기 위한 마진 추가 */
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.form-photo {
  width: 100%;
  max-width: 300px;
  height: auto;
  border-radius: 8px;
  margin-bottom: 20px;
}

.form-title {
  width: 100%;
  text-align: left;
  font-size: 16px;
  margin-bottom: 5px;
}

.form-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.submit-button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  max-width: 300px;
}
</style>