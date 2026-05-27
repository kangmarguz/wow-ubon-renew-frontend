# WOW Ubon Client

Frontend สำหรับเว็บรวมข้อมูลร้านอาหาร ที่พัก และสถานที่ท่องเที่ยวของจังหวัดอุบลราชธานี พัฒนาด้วย React + Vite และเชื่อมต่อ API ที่ `server/`

## Stack

- React 18
- Vite 5
- React Router DOM
- TanStack Query
- Zustand
- React Hook Form + Zod
- Tailwind CSS
- Axios
- React Leaflet
- React Toastify
- Lucide React

## ฟีเจอร์หลัก

- หน้า public: home, places, place detail
- auth flow: register, login, forgot password, forced change password
- user flow: submit place, edit place, my places, my reviews, account
- admin flow: dashboard, places moderation, reviews moderation, users, password reset requests
- loading states และ pending actions ใช้ shared loading UI ร่วมกันทั้งแอป

## Requirements

- Node.js 18+ แนะนำ
- npm
- backend ต้องรันอยู่ก่อน หรืออย่างน้อยเข้าถึง API ได้

## Environment Variables

ไฟล์ตัวอย่างในโปรเจกต์ปัจจุบันคือ `client/.env`

ต้องมีอย่างน้อย:

```env
VITE_API_BASE_URL=http://localhost:3333/api
```

ถ้า backend ไม่ได้รันที่ `localhost:3333` ให้แก้ค่า `VITE_API_BASE_URL` ให้ตรง

## ติดตั้งและรัน

```bash
npm install
npm run dev
```

ค่า default ของ Vite dev server คือ `http://localhost:5173`

## Scripts

```bash
npm run dev
npm run build
npm run preview
```

## Build สำหรับ demo / production preview

```bash
npm run build
npm run preview
```

## โครงสร้างที่ควรรู้

```text
src/
  app/                router และ app bootstrap
  features/           แยกตาม domain เช่น auth, places, profile, admin
  shared/             ui, constants, api client, helpers
```

## API Integration

- axios client อยู่ที่ `src/shared/api/http.js`
- token ถูกแนบผ่าน request interceptor จาก Zustand auth store
- ถ้าไม่ได้ตั้ง `VITE_API_BASE_URL` ระบบจะ fallback ไปที่ `http://localhost:3333/api`

## ลำดับการเปิดระบบตอนพัฒนา

1. รัน backend ใน `server/`
2. ตรวจว่า database และ env ฝั่ง backend พร้อม
3. รัน frontend ด้วย `npm run dev`
4. เปิด `http://localhost:5173`

## หมายเหตุ

- โปรเจกต์นี้ใช้ภาษาไทยเป็นหลักใน UI
- แผนที่ใช้ React Leaflet ดังนั้นการ submit/edit place และ place detail จะมี lazy-loaded map
- ถ้าหน้า upload รูปใช้งานไม่ได้ ให้เช็ก Cloudinary env ฝั่ง server ก่อน ไม่ใช่ฝั่ง client
