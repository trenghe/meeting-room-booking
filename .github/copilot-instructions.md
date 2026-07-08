<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Hệ Thống Đặt Lịch Phòng Họp - Hướng Dẫn Phát Triển

### Project Overview

- **Loại**: Web Application (HTML/CSS/JavaScript + Firebase)
- **Tính năng chính**: Lịch phòng họp, đặt phòng, nội quy
- **CSDL**: Firebase Realtime Database
- **Số phòng**: 2 (Tầng 1 - Phòng A, Tầng 4 - Phòng B)

### Cấu Trúc File

```
js/
  ├── firebase-config.js    - Cấu hình Firebase (cần thay YOUR_* values)
  ├── calendar.js           - Hiển thị lịch, xử lý điều hướng tháng
  ├── booking.js            - Form đặt phòng, xử lý submission
  └── main.js               - Logic chính, tab navigation

css/
  ├── styles.css            - CSS chung, form, button
  ├── calendar.css          - Calendar grid, day styles
  └── modal.css             - Modal styling

index.html                   - Main HTML file với 3 tabs

assets/                      - Thư mục cho hình ảnh/tài nguyên
```

### Hàm Chính

- `initCalendar()` - Khởi tạo lịch
- `generateCalendar(room, date, container)` - Tạo grid lịch
- `initBookingForm()` - Khởi tạo form đặt phòng
- `isTimeSlotAvailable()` - Kiểm tra khung giờ trống
- `saveBooking()` - Lưu booking vào Firebase

### Format Dữ Liệu

- **Thời gian**: Format 24h (ví dụ: 900 = 9:00, 1330 = 13:30)
- **Ngày**: ISO format (YYYY-MM-DD)
- **Phòng**: 'floor1' hoặc 'floor4'

### Chuỗi Đặt Phòng

1. User chọn phòng, ngày, khung giờ
2. Kiểm tra khung giờ trống (isTimeSlotAvailable)
3. Lưu vào Firebase (saveBooking)
4. Firebase trigger cập nhật calendar (bookingsRef.on)
5. Giao diện cập nhật tự động

### Chế Độ Bảo Mật Firebase

- **Dev**: Test mode (cho phép read/write)
- **Prod**: Cần thêm authentication rules

### Tiếp Theo

1. Thay YOUR\_\* values trong firebase-config.js
2. Mở index.html trong browser hoặc Live Server
3. Kiểm tra console (F12) nếu có lỗi
