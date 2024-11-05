import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import fs from 'fs';


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
      key: fs.readFileSync('./localhost+3-key.pem'), // 키 파일 경로
      cert: fs.readFileSync('./localhost+3.pem'),     // 인증서 파일 경로
    },
    host: '172.168.10.73', // 로컬 네트워크 IP 주소로 설정
    port: 5173,
    proxy: {
      "/api": "http://172.168.10.73:8080",
    },
  },
});