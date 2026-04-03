import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // กำหนดให้สร้าง output ไว้ในโฟลเดอร์ dist (Vercel จะหาโฟลเดอร์นี้เพื่อแสดงผล)
    outDir: 'dist',
  },
  server: {
    port: 3000,
  }
})
