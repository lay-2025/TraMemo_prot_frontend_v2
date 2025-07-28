import { defineConfig } from 'vite'
// `Uncaught Error: @vitejs/plugin-react can't detect preamble. Something is wrong.`エラー解決に以下を試したが最終的に関係無かったため元に戻す
// import react from '@vitejs/plugin-react-swc' これだと動作しないため、以下に変更
// `npm i @vitejs/plugin-react`コマンドでインストール必要
// import react from '@vitejs/plugin-react'
import react from '@vitejs/plugin-react-swc'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react()],
  // 開発サーバのポート番号を変更
  // host の記述もDocker環境での動作に必須の模様
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
