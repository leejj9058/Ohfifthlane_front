<template>
  <Header />
  <div class="report-tutorial-container" v-if="showModal">
    <div class="report-modal">
      <button class="report-back-button" @click="goBack">←</button>
      <p class="report-title">번호판이 나오도록 촬영해주세요</p>
      <div class="report-container">
        <img src="@/assets/images/example-photo.png" alt="예시 이미지" class="report-example" />
      </div>
      <button class="report-button" @click="startCamera">촬영하기</button>
    </div>
  </div>

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

  <div v-else class="camera-view">
    <video ref="video" class="camera-video" autoplay></video>
    <button class="capture-button" @click="capturePhoto">사진 찍기</button>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, nextTick } from 'vue';
import Header from '@/components/Header.vue';
import axios from 'axios';

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
    videoStream.value = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoElement.value) {
      videoElement.value.srcObject = videoStream.value;
    }
  } catch (error) {
    alert("카메라에 접근할 수 없습니다.");
  }
};

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
    const response = await axios.post('/api/uploadPhoto', {
      reportImage: capturedPhoto.value, // 사진을 base64로 서버에 전송
    });

    if (response.status === 200) {
      const photoPath = response.data.reportImage; // 서버가 반환한 이미지 경로
      console.log("Returned photo path: ", photoPath);  // URL 확인용
      window.location.href = `/residentReportWrite?photo=${encodeURIComponent(photoPath)}`; // 이미지 경로 전달
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
.report-tutorial-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.report-modal {
  background-color: white;
  width: 400px; /* 모달의 너비 확장 */
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.report-back-button {
  position: absolute;
  top: 15px;
  left: 15px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

.report-title {
  font-size: 20px;
  margin-bottom: 25px;
}

.report-container {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.report-example {
  width: 250px;
  height: 180px;
}

.report-button {
  background-color: red;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
}

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
}

.capture-button {
  background-color: red;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  margin-top: 20px;
}

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
  font-size: 20px;
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

.confirm-button,
.cancel-button {
  background-color: red;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  margin: 5px;
}

.cancel-button {
  background-color: gray;
}
</style>