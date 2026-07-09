// ===============================
// Admin / Management Functionality
// ===============================

function initAdmin() {
  renderAdminBookings();
}

document.addEventListener("DOMContentLoaded", () => {
  // Khi Firebase cập nhật dữ liệu sẽ tự render lại bảng
  window.updateScheduleDisplay = renderAdminBookings;

  // Render lần đầu
  setTimeout(renderAdminBookings, 1000);
});

// ===============================
// Format Date
// yyyy-MM-dd -> dd/MM/yyyy
// ===============================
function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString("vi-VN");
}

// ===============================
// Render Admin Table
// ===============================
function renderAdminBookings() {
  const tbody = document.getElementById("adminBookingsBody");

  if (!tbody) return;

  tbody.innerHTML = "";

  if (!bookings || Object.keys(bookings).length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center;padding:20px;">
          Không có lịch họp nào.
        </td>
      </tr>
    `;
    return;
  }

  // Sắp xếp theo ngày mới nhất
  const sortedBookings = Object.values(bookings).sort((a, b) => new Date(b.date) - new Date(a.date));

  sortedBookings.forEach((booking, index) => {
    const tr = document.createElement("tr");

    const roomName = booking.room === "floor1" ? "Phòng họp Lầu 1" : "Phòng họp Lầu 4";

    const startTime = parseInt(booking.startTime) || 0;
    const endTime = parseInt(booking.endTime) || 0;

    const timeStr = `${formatTime(startTime)} - ${formatTime(endTime)}`;

    tr.innerHTML = `
      <td><strong>${index + 1}</strong></td>
      <td>${formatDate(booking.date)}</td>
      <td>${roomName}</td>
      <td>${timeStr}</td>
      <td>${booking.organizerName || ""}</td>
      <td>${booking.purpose || ""}</td>
      <td>
        <button
          class="action-btn delete"
          onclick="deleteBookingHandler('${booking.id}')">
          Xóa
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// ===============================
// Delete Booking
// ===============================
function deleteBookingHandler(id) {
  if (!confirm("Bạn có chắc chắn muốn xóa lịch họp này không?")) return;

  deleteBooking(id).then((res) => {
    if (res.success) {
      showNotification("✅ Đã xóa lịch họp thành công", "success");

      renderAdminBookings();

      if (window.updateScheduleDisplay) {
        updateScheduleDisplay();
      }
    } else {
      showNotification("❌ Lỗi khi xóa: " + res.error, "error");
    }
  });
}

// ===============================
// Notification
// ===============================
function showNotification(message, type = "info") {
  const notification = document.createElement("div");

  notification.className = `booking-status ${type}`;

  notification.textContent = message;

  notification.style.position = "fixed";
  notification.style.top = "20px";
  notification.style.right = "20px";
  notification.style.zIndex = "9999";
  notification.style.maxWidth = "400px";
  notification.style.padding = "15px 20px";
  notification.style.borderRadius = "8px";
  notification.style.boxShadow = "0 8px 20px rgba(0,0,0,.2)";
  notification.style.fontWeight = "600";

  switch (type) {
    case "success":
      notification.style.background = "#4caf50";
      notification.style.color = "#fff";
      break;

    case "error":
      notification.style.background = "#f44336";
      notification.style.color = "#fff";
      break;

    default:
      notification.style.background = "#2196f3";
      notification.style.color = "#fff";
  }

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 4000);
}

// ===============================
// Export
// ===============================
window.initAdmin = initAdmin;
