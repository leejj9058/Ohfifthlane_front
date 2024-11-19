import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    outDir: "../Ohfifthlane_back/src/main/resources/static",
  },
  server: {
    https: {
      key: fs.readFileSync("../localhost+4-key.pem"), // 키 파일 경로
      cert: fs.readFileSync("../localhost+4.pem"), // 인증서 파일 경로
    },

    host: "172.168.10.18", // 로컬 네트워크 IP 주소로 설정
    port: 5173,
    proxy: {
      "/api": {
        target: "http://172.168.10.18:8080",

        changeOrigin: true,
      },
      "/ai": {
        target: "http://172.168.10.11:8501", // 이건 수정하면 안돼요. 권수컴으로 파이썬 서버 가동했을 때 번호판 읽기 가능
        changeOrigin: true,
      },
      "/parking": {
        target: "http://openapi.seoul.go.kr:8088", // 이건 수정하면 안돼요. 권수컴으로 파이썬 서버 가동했을 때 번호판 읽기 가능
        changeOrigin: true,
      },
    },
  },
});
