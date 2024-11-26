<template>
  <Header />
  <link
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
    rel="stylesheet"
  />

  <!-- 첫 번째 모달: 촬영 전 안내 -->
  <div class="report-tutorial-container" v-if="showModal">
    <div class="report-modal">
      <!-- 뒤로가기 버튼과 텍스트를 한 줄로 배치 -->
      <div class="header-container">
        <button class="report-back-button mt-1" @click="goBack">
          <i class="fas fa-arrow-left"></i>
          <!-- 뒤로가기 아이콘 -->
        </button>
        <p class="report-title text-center">신고 차량의</p>
        <span class="qr-blue-text" style="margin-left: 10px; font-weight: bold"
          >번호판이 나오도록 촬영
        </span>
        <span class="text-center">해 주세요</span>
      </div>

      <div class="report-container">
        <img
          src="@/assets/images/example-photo.png"
          alt="예시 이미지"
          class="report-example"
        />
      </div>
      <button class="report-button" @click="startCamera">촬영하기</button>
    </div>
  </div>

  <!-- 두 번째 모달: 사진 미리보기 -->
  <div v-else-if="showPreview" class="photo-preview-modal">
    <div class="photo-preview">
      <p class="preview-title">이 사진으로 하시겠습니까?</p>
      <div class="preview-container">
        <img :src="capturedPhoto" alt="Captured Photo" class="captured-photo" />
      </div>
      <button class="confirm-button" @click="confirmPhoto">확인</button>
      <button class="cancel-button" @click="retakePhoto">다시 촬영</button>
    </div>
  </div>

  <!-- 카메라 뷰 (사진 촬영) -->
  <div v-else class="camera-view">
    <video ref="video" class="camera-video" autoplay></video>
    <button class="capture-button" @click="capturePhoto">사진 찍기</button>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, nextTick } from "vue";
import Header from "@/components/Header.vue";
import axios from "axios";
import { useRoute } from 'vue-router';



const route = useRoute();

//쿼리 파라미터로 입력한 차량번호
const vehicleNumber = route.query.vehicleNumber;

const showModal = ref(true);
const showPreview = ref(false);
const capturedPhoto = ref(null);
const videoStream = ref(null);
const videoElement = ref(null);

const goBack = () => {
  window.history.back();
};

const startCamera = async () => {
  showModal.value = false;
  await nextTick();
  await enableCamera();
};

 const enableCamera = async () => {
  videoElement.value = document.querySelector('video');
   try {
     // 후면 카메라 사용 설정
     videoStream.value = await navigator.mediaDevices.getUserMedia({
       video: {
         facingMode: { exact: "environment" }
       }
     });
     if (videoElement.value) {
       videoElement.value.srcObject = videoStream.value;
     }
   } catch (error) {
     alert("카메라에 접근할 수 없습니다. 후면 카메라를 사용할 수 없습니다.");
     console.error("Camera error: ", error);
   }
 };

/*
const enableCamera = async () => {
  videoElement.value = document.querySelector("video");
  try {
    videoStream.value = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoElement.value) {
      videoElement.value.srcObject = videoStream.value;
    }
  } catch (error) {
    alert("카메라에 접근할 수 없습니다.");
  }
};
*/

const capturePhoto = () => {
  const canvas = document.createElement("canvas");
  const video = videoElement.value;

  if (video) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    capturedPhoto.value = canvas.toDataURL("image/png");
    showPreview.value = true;
    stopCamera();
  }
};

const stopCamera = () => {
  if (videoStream.value) {
    videoStream.value.getTracks().forEach((track) => track.stop());
  }
};

const confirmPhoto = async () => {
  try {
    const response = await axios.post("/api/uploadDisabledPersonReportPhoto", {
      disabledPersonReportImage: capturedPhoto.value, // 사진을 base64로 서버에 전송
    });

    if (response.status === 200) {
      const photoPath = response.data.disabledPersonReportImage; // 서버가 반환한 이미지 경로
      console.log("Returned photo path: ", photoPath); // URL 확인용
      window.location.href = `/disabledPersonReport?photo=${encodeURIComponent(
        photoPath
      )}&vehicleNumber=${encodeURIComponent(vehicleNumber)}`; // 이미지 경로와 차량 번호 전달

    } else {
      alert("사진 전송에 실패했습니다. 다시 시도해 주세요.");
    }
  } catch (error) {
    alert("서버에 사진을 전송할 수 없습니다.");
  }

  showPreview.value = false;
};

const retakePhoto = () => {
  showPreview.value = false;
  startCamera();
};

onBeforeUnmount(() => {
  stopCamera();
});
</script>

<style scoped>
/* 모달 스타일 */
.report-tutorial-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.report-modal {
  background-color: white;
  width: 420px;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  text-align: center;
  position: relative;
}

/* 뒤로가기 버튼 */
.report-back-button {
  position: absolute;
  top: 10px;
  left: 10px;
  background: none;
  border: none;
  font-size: 22px;
  color: #555;
  cursor: pointer;
  transition: color 0.3s;
}

/* 텍스트 스타일 */
.report-title {
  font-size: 22px;
  font-weight: bold;
  margin: 0; /* 텍스트 마진 제거 */
  color: #333;
}

/* 예시 이미지 스타일 */
.report-container {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.report-example {
  width: 250px;
  height: 180px;
  object-fit: cover;
  border-radius: 10px;
}

/* 버튼 스타일 */
.report-button {
  background: linear-gradient(135deg, #007bff, #0056b3); /* 파란색 계열 */
  color: white;
  padding: 12px 25px;
  border: none;
  border-radius: 50px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  margin: 0;
}
.capture-button,
.confirm-button,
.cancel-button {
  background-color: #ff6347;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.report-button:hover,
.capture-button:hover,
.confirm-button:hover,
.cancel-button:hover {
  background-color: #e94e34;
}

/* 카메라 화면 스타일 */
.camera-view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #000;
}

.camera-video {
  width: 100%;
  max-width: 600px;
  height: auto;
  border-radius: 8px;
}

.capture-button {
  margin-top: 20px;
}

/* 사진 미리보기 모달 */
.photo-preview-modal {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
}

.photo-preview {
  background-color: white;
  padding: 30px;
  border-radius: 15px;
  width: 400px;
  text-align: center;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.preview-title {
  font-size: 22px;
  margin-bottom: 20px;
}

.preview-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.captured-photo {
  width: 100%;
  max-width: 350px;
  border-radius: 10px;
}

.qr-blue-text {
  color: #fe5950; /* 파란색 텍스트 */
}

.cancel-button {
  background-color: gray;
}

@media (max-width: 460px) {
  .report-modal,
  .photo-preview {
    width: 100%; /* 화면 너비의 95%로 설정 */
  }

  .report-example {
    width: 180px; /* 예시 이미지 크기 더 축소 */
    height: 120px;
  }

  .captured-photo {
    max-width: 250px; /* 미리보기 사진 크기 더 축소 */
  }

  .report-title {
    font-size: 16px; /* 제목 글자 크기 축소 */
  }

  .report-button,
  .capture-button,
  .confirm-button,
  .cancel-button {
    font-size: 14px; /* 버튼 글자 크기 더 축소 */
    padding: 8px 16px; /* 버튼 크기 더 축소 */
  }

  .camera-video {
    max-width: 100%; /* 비디오 화면 크기 최적화 */
  }
}
</style>
