import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from "path";
// https://vite.dev/config/
export default defineConfig({
    base: "/",
    plugins: [react()],
    // 開発サーバのポート番号を変更
    server: {
        host: "0.0.0.0",
        port: 3000,
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
