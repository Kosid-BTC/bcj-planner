/**
 * ไฟล์กำหนดค่าการประมวลผล CSS สำหรับ Vite
 * ทำหน้าที่เชื่อมต่อ Tailwind CSS เข้ากับระบบ Build
 */
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}, // ช่วยเติม Prefix ให้ CSS รองรับทุกเบราว์เซอร์อัตโนมัติ
  },
}
