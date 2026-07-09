# Firebase Setup Guide - Hướng Dẫn Cài Đặt Firebase

## Bước 1: Tạo Firebase Project

1. Truy cập https://console.firebase.google.com/
2. Click **"Add project"** (hoặc **"Create a project"**)
3. Nhập tên project: `Meeting Room Booking` 
4. Chọn **Create project**

## Bước 2: Thêm Realtime Database

1. Trong Firebase Console, chọn project của bạn
2. Bên trái, click **Build** > **Realtime Database**
3. Click **Create Database**
4. Chọn location: **asia-southeast1** (gần nhất với VN)
5. Chọn **Start in test mode** (để test/dev)
6. Click **Enable**

Cấu hình Database Rules (cho phép read/write):

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

## Bước 3: Lấy Firebase Config

1. Từ Project Overview, click biểu tượng **Web** (</>)
2. Đặt tên ứng dụng: `meeting-room-app`
3. Click **Register app**
4. Sao chép phần **firebaseConfig**

Nó sẽ trông như thế này:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "meeting-room-app.firebaseapp.com",
  databaseURL: "https://meeting-room-app-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "meeting-room-app",
  storageBucket: "meeting-room-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456",
};
```

## Bước 4: Update firebase-config.js

1. Mở file `js/firebase-config.js`
2. Thay thế:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

Bằng thông tin thực từ Firebase Console

## Bước 5: Kiểm Tra Kết Nối

1. Mở `index.html` trong trình duyệt
2. Mở **DevTools** (F12 hoặc Ctrl+Shift+I)
3. Vào tab **Console**
4. Nếu thấy log `"Firebase configuration loaded"` và `"Bookings updated"` - Thành công! ✅

## Test Dữ Liệu

Để test, bạn có thể thêm dữ liệu trực tiếp vào Firebase:

1. Vào **Realtime Database** trong Firebase Console
2. Click **+** để thêm data
3. Tạo structure:

```
bookings
  └─ test_booking_1
     ├─ room: "floor1"
     ├─ date: "2024-12-20"
     ├─ startTime: "900"
     ├─ endTime: "1100"
     ├─ purpose: "Test booking"
     ├─ organizerName: "Test User"
     ├─ organizerPhone: "0123456789"
     ├─ organizerEmail: "test@example.com"
     ├─ attendeesCount: 5
     ├─ notes: "Test notes"
     ├─ createdAt: "2024-01-01T00:00:00Z"
     └─ status: "confirmed"
```

Lịch sẽ cập nhật real-time khi bạn thêm data!

## Cảnh Báo Bảo Mật

⚠️ **Test mode chỉ dùng cho development**, vì cho phép bất kỳ ai đọc/ghi dữ liệu.

Để production, bạn cần:

1. Bật Firebase Authentication
2. Cập nhật Security Rules
3. Validate dữ liệu phía server

## Troubleshooting

### Lỗi: "Firebase SDK not loaded"

- Kiểm tra kết nối Internet
- Kiểm tra script Firebase trong index.html có đúng không

### Lỗi: "Permission denied"

- Kiểm tra Database Rules
- Đảm bảo đã chọn Test mode

### Không thấy data

- Kiểm tra Firebase config có đúng projectId không
- Kiểm tra database region có đúng không

## Liên Hệ

Nếu gặp vấn đề, tham khảo: https://firebase.google.com/docs/
