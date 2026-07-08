# 📅 Hệ Thống Đặt Lịch Phòng Họp

Một ứng dụng web hiện đại để quản lý và đặt lịch sử dụng phòng họp với giao diện thân thiện người dùng và tích hợp Firebase Realtime Database.

## 🎯 Tính Năng

### 1. **Xem Lịch Phòng**

- Hiển thị lịch tháng cho 2 phòng (Tầng 1 - Phòng A, Tầng 4 - Phòng B)
- Đánh dấu trạng thái: Trống, Đã đặt, Đang có lịch
- Xem chi tiết khung giờ trống cho từng ngày
- Đếm số lịch đặt trên mỗi ngày

### 2. **Đặt Phòng**

- Chọn phòng với dung tích khác nhau
- Chọn ngày họp (phải từ ngày hôm sau trở đi)
- Chọn khung giờ từ 8:00 - 18:00 (tối thiểu 30 phút, tối đa 3 giờ)
- Nhập mục đích họp
- Nhập thông tin người đặt (tên, SĐT, email)
- Nhập số lượng người dự kiến
- Ghi chú thêm

### 3. **Nội Quy Phòng Họp**

- Điều kiện đặt phòng
- Giờ làm việc của các phòng
- Tiêu chuẩn và trang thiết bị từng phòng
- Trách nhiệm người đặt phòng
- Chính sách hủy đặt phòng

## 🏗️ Cấu Trúc Dự Án

```
Project TN/
├── index.html                 # File HTML chính
├── css/
│   ├── styles.css            # CSS chung
│   ├── calendar.css          # CSS cho lịch
│   └── modal.css             # CSS cho modal
├── js/
│   ├── firebase-config.js    # Cấu hình Firebase
│   ├── calendar.js           # Logic lịch
│   ├── booking.js            # Logic đặt phòng
│   └── main.js               # Logic chính
├── assets/                    # Thư mục cho tài nguyên (nếu cần)
└── README.md                  # File này
```

## 🔧 Cài Đặt

### Yêu cầu

- Trình duyệt web hiện đại (Chrome, Firefox, Safari, Edge)
- Kết nối Internet (để kết nối Firebase)

### Bước 1: Tạo Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Tạo một project mới
3. Bật **Realtime Database**
4. Đặt chế độ bảo mật thành **Test mode** (để phát triển)

### Bước 2: Lấy Thông Tin Firebase

1. Tại Firebase Console, chọn project của bạn
2. Vào **Project Settings** > **General**
3. Cuộn xuống tìm **Firebase SDK snippet** > Chọn **Config**
4. Sao chép thông tin cấu hình

### Bước 3: Cập Nhật Cấu Hình

Mở file `js/firebase-config.js` và thay thế:

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

### Bước 4: Chạy Ứng Dụng

1. Mở file `index.html` trong trình duyệt
2. Hoặc sử dụng Live Server trong VS Code:
   - Chuột phải trên `index.html` > **Open with Live Server**

## 📋 Hướng Dẫn Sử Dụng

### Xem Lịch Phòng

1. Click tab **"Lịch Phòng"**
2. Chọn tháng bằng nút mũi tên trái/phải
3. Click vào ngày để xem chi tiết khung giờ trống
4. Màu sắc thể hiện trạng thái:
   - ✅ Xanh lá: Trống
   - ❌ Đỏ: Đã đặt
   - ⚠️ Vàng: Đang có lịch (còn khoảng trống)

### Đặt Phòng

1. Click tab **"Đặt Phòng"**
2. Điền đầy đủ thông tin:
   - Chọn phòng
   - Chọn ngày (từ ngày hôm sau)
   - Chọn giờ bắt đầu và kết thúc
   - Nhập mục đích họp
   - Nhập thông tin liên hệ
3. Click **"Đăng Ký Phòng"**
4. Nếu thành công, lịch sẽ cập nhật ngay trên tab "Lịch Phòng"

### Xem Nội Quy

1. Click tab **"Nội Quy"**
2. Đọc kỹ các điều khoản và yêu cầu
3. Liên hệ với Ban Quản Lý nếu có thắc mắc

## 🗂️ Cấu Trúc Dữ Liệu Firebase

### Bookings

```json
{
  "bookings": {
    "bookingId1": {
      "room": "floor1",
      "date": "2024-01-15",
      "startTime": "900",
      "endTime": "1200",
      "purpose": "Họp ban lãnh đạo",
      "organizerName": "Nguyễn Văn A",
      "organizerPhone": "0123456789",
      "organizerEmail": "a@example.com",
      "attendeesCount": 10,
      "notes": "Cần setup video conferencing",
      "createdAt": "2024-01-13T10:30:00Z",
      "status": "confirmed"
    }
  }
}
```

## 🎨 Giao Diện

- **Hiện đại**: Gradient đẹp, màu sắc hài hoà
- **Thân thiện**: Layout rõ ràng, dễ sử dụng
- **Responsive**: Tương thích với điện thoại, tablet, desktop
- **Trực quan**: Biểu tượng emoji, chú thích rõ ràng

## 🔐 Bảo Mật

Hiện tại ứng dụng sử dụng **Test mode** của Firebase. Để triển khai production:

1. Thay đổi Firebase Security Rules
2. Bật xác thực người dùng
3. Thêm validation phía server

## 📱 Tính Năng Bonus

- ✅ Kiểm tra dung tích phòng
- ✅ Cập nhật lịch real-time
- ✅ Thông báo kết nối online/offline
- ✅ Xử lý lỗi toàn cầu
- ✅ Hỗ trợ tiếng Việt

## 🐛 Troubleshooting

### Không thấy lịch đặt

- Kiểm tra kết nối Internet
- Kiểm tra Firebase config có đúng không
- Mở DevTools (F12) kiểm tra console

### Không đặt được phòng

- Kiểm tra Firebase Database rules có allow write không
- Kiểm tra định dạng thời gian (HHmm format)
- Xem lỗi trong console

### Modal không hiển thị

- Làm tươi trang web (Ctrl+R hoặc Cmd+R)
- Kiểm tra JavaScript có lỗi không

## 🚀 Cải Tiến Trong Tương Lai

- [ ] Thêm xác thực người dùng
- [ ] Email xác nhận đặt phòng
- [ ] Hủy/sửa lịch đặt
- [ ] Báo cáo thống kê
- [ ] Mobile app
- [ ] Tích hợp Google Calendar
- [ ] Notification push

## 📞 Hỗ Trợ

Nếu có vấn đề, vui lòng liên hệ:

- **Email**: facilities@company.com
- **Điện thoại**: 0123 456 789

## 📄 Giấy Phép

Project này là sở hữu riêng của công ty.

---

**Phiên bản**: 1.0.0
**Cập nhật lần cuối**: Tháng 7 năm 2026
