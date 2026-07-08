# 🚀 Quick Start Guide - Hướng Dẫn Nhanh

## Bước 1️⃣: Cấu Hình Firebase (2 phút)

1. **Tạo Firebase Project**
   - Vào https://console.firebase.google.com/
   - Tạo project mới tên `meeting-room-booking`

2. **Thêm Realtime Database**
   - Menu trái: **Build** → **Realtime Database**
   - Chọn **asia-southeast1** (VN region)
   - **Test mode** → Enable

3. **Lấy Firebase Config**
   - Vào **Project Settings** (⚙️) → **General**
   - Tìm **Firebase SDK snippet** → **Config**
   - Copy toàn bộ `firebaseConfig` object

4. **Cập Nhật `js/firebase-config.js`**
   - Mở file `js/firebase-config.js`
   - Dán config vào (thay `YOUR_*` values)
   - **Save** (Ctrl+S)

## Bước 2️⃣: Chạy Ứng Dụng (30 giây)

### Option A: Live Server (Khuyến nghị)

1. Chuột phải trên `index.html`
2. Chọn **"Open with Live Server"**
3. Trang web tự mở trong browser ✅

### Option B: Direct Open

1. Mở `index.html` trong browser (Ctrl+O)

## Bước 3️⃣: Test Ứng Dụng (1 phút)

### Kiểm tra kết nối Firebase

1. Mở **DevTools**: F12 hoặc Ctrl+Shift+I
2. Tab **Console**
3. Nếu thấy log: ✅ **"Firebase configuration loaded"**
   - Nếu không → Kiểm tra Firebase config

### Test đặt phòng

1. Click tab **"Đặt Phòng"**
2. Điền form:
   - Phòng: Tầng 1 - Phòng A
   - Ngày: Chọn ngày hôm sau
   - Giờ: 9:00 - 11:00
   - Thông tin: Tên/SĐT/Email test
   - Số người: 5
3. Click **"🔒 Đăng Ký Phòng"**
4. Nếu thành công → Sẽ hiển thị mã booking ✅

### Xem lịch cập nhật

1. Click tab **"Lịch Phòng"**
2. Ngày vừa đặt sẽ hiển thị trạng thái: 🟡 (Đang có lịch)
3. Click ngày đó → Xem chi tiết khung giờ ✅

## 🎯 3 Tính Năng Chính

| Tính Năng        | Tab   | Mô Tả                                       |
| ---------------- | ----- | ------------------------------------------- |
| 📅 **Xem Lịch**  | Tab 1 | Lịch tháng 2 phòng, click ngày xem chi tiết |
| 📝 **Đặt Phòng** | Tab 2 | Form đầy đủ, auto check khung giờ trống     |
| 📋 **Nội Quy**   | Tab 3 | Quy tắc, tiêu chuẩn, trách nhiệm người dùng |

## 🛠️ Các File Quan Trọng

| File                    | Mục Đích                     |
| ----------------------- | ---------------------------- |
| `index.html`            | Giao diện, 3 tabs chính      |
| `js/firebase-config.js` | Kết nối Firebase ⭐          |
| `js/calendar.js`        | Logic lịch                   |
| `js/booking.js`         | Logic form đặt phòng         |
| `js/main.js`            | Logic chung & tab navigation |
| `css/styles.css`        | Styling chung                |

## ⚡ Các Công Việc Tiếp Theo

### Tùy Chỉnh

- [ ] Thay logo/hình ảnh trong `assets/`
- [ ] Sửa số điện thoại/email liên hệ trong `index.html`
- [ ] Sửa tên công ty/phòng

### Mở Rộng

- [ ] Thêm xác thực người dùng
- [ ] Gửi email xác nhận đặt phòng
- [ ] Hủy/sửa lịch đặt
- [ ] Thống kê báo cáo
- [ ] Mobile app

### Deploy

- [ ] Firebase Hosting
- [ ] Netlify
- [ ] GitHub Pages

## 🆘 Vấn Đề Thường Gặp

### ❌ "Cannot read bookings"

→ Kiểm tra Firebase config, internet connection

### ❌ "Permission denied"

→ Kiểm tra Firebase Database Rules có cho phép write không?

### ❌ "Không thấy dữ liệu"

→ Mở DevTools (F12) → Console xem lỗi chi tiết

## 📞 Cần Giúp?

1. **Firebase Docs**: https://firebase.google.com/docs/
2. **Project Docs**: Xem [README.md](README.md)
3. **Firebase Setup**: Xem [FIREBASE_SETUP.md](FIREBASE_SETUP.md)

---

## ✅ Checklist

- [ ] Firebase project tạo xong
- [ ] Realtime Database bật
- [ ] Firebase config cập nhật
- [ ] Chạy ứng dụng thành công
- [ ] Test đặt phòng ok
- [ ] Lịch cập nhật real-time

**Hoàn tất tất cả trên = Sẵn sàng! 🎉**

---

**Lần cập nhật**: 8/7/2026 | **Phiên bản**: 1.0.0
